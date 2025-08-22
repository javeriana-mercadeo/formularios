/**
 * FormManager - Orquestador principal modernizado
 * Integra sistema de stores Zustand con compatibilidad legacy
 * @version 2.0 - Modernizado con Feature-First Architecture
 */
import { ValidationEngine } from '../features/validation/ValidationEngine.js'
import { FieldController } from '../features/field-management/FieldController.js'
import { TomSelectAdapter } from '../integrations/tom-select/TomSelectAdapter.js'
import { CleaveAdapter } from '../integrations/cleave/CleaveAdapter.js'
import { useSystemStore } from './stores/system-store.js'
import { useValidationStore } from '../features/validation/stores/validation-store.js'
import { useFieldStore } from '../features/field-management/stores/field-store.js'

// Importar módulos existentes renombrados (compatibilidad)
import { Ui as DomManager } from '../ui/DomManager.js'
import { Logger } from './Logger.js'
import { Config as ConfigLoader } from '../features/form-initialization/ConfigLoader.js'
import { Data as DataPreloader } from '../features/form-initialization/DataPreloader.js'
import { Event as EventBus } from './EventBus.js'
import { Service as SalesforceMapper } from '../features/form-submission/SalesforceMapper.js'

export class FormManager {
  constructor(selector, config = {}) {
    this.selector = selector
    this.isInitialized = false

    // Stores Zustand
    this.systemStore = useSystemStore
    this.validationStore = useValidationStore
    this.fieldStore = useFieldStore

    // Módulos core (mantener lógica actual)
    this.config = new ConfigLoader({ config, selector })
    this.logger = new Logger({ config: this.config.getLoggingConfig() })
    this.domManager = new DomManager({
      config: this.config.getUiConfig(),
      logger: this.logger
    })

    // Data preloader
    this.dataPreloader = new DataPreloader({
      config: this.config.getConfig(),
      logger: this.logger
    })

    // Salesforce integration
    this.salesforceMapper = new SalesforceMapper({
      config: this.config.getConfig(),
      logger: this.logger
    })

    // Controllers y engines modernos
    this.validationEngine = new ValidationEngine(this.logger)
    this.fieldController = null // Se inicializa después de obtener formElement

    // Adaptadores individuales (para casos específicos)
    this.tomSelectAdapter = new TomSelectAdapter(this.logger)
    this.cleaveAdapter = new CleaveAdapter(this.logger)

    // Form element
    this.formElement = null

    // Event system (se inicializa después)
    this.eventBus = null
  }

  async initialize() {
    try {
      this.logger.info(`🚀 Inicializando FormManager v2.0 para: ${this.selector} (${this.config.getConfig().eventName})`)

      // 1. Configurar stores con modos
      this._initializeModes()

      // 2. Obtener elemento del formulario
      this._initializeFormElement()

      // 3. Cargar datos preconfigurados primero
      await this._loadData()

      // 4. Inicializar field controller con DataPreloader y configuración
      this.fieldController = new FieldController(this.logger, this.formElement, this.dataPreloader, this.config)

      // 5. Configurar event bus
      this._initializeEventBus()

      // 6. Configurar formulario
      await this._configureForm()

      // 7. Setup eventos
      this._setupEvents()

      // 8. Marcar como inicializado
      this.systemStore.getState().setSystemState('isInitialized', true)
      this.isInitialized = true

      this.logger.info('✅ FormManager inicializado correctamente')

      // 9. Callback personalizado
      if (this.config.callbacks?.onFormLoad) {
        this.config.callbacks.onFormLoad(this)
      }

      return this
    } catch (error) {
      this.logger.error('❌ Error al inicializar FormManager:', error)
      throw error
    }
  }

  /**
   * Inicializar configuraciones de modo en stores
   */
  _initializeModes() {
    const config = this.config.getConfig()

    if (config.development) {
      this.systemStore.getState().setMode('development', config.development)
      this.logger.info(`🔧 Development mode: ${config.development}`)
    }

    if (config.debug) {
      this.systemStore.getState().setMode('debug', config.debug)
      this.logger.info(`🐛 Debug mode: ${config.debug}`)
    }

    if (config.test !== undefined) {
      this.systemStore.getState().setMode('test', config.test)
      this.logger.info(`🧪 Test mode: ${config.test}`)
    }

    // Establecer configuración en store
    this.systemStore.getState().setConfig(config)
  }

  /**
   * Inicializar elemento del formulario
   */
  _initializeFormElement() {
    this.formElement = this.domManager.getFormContext()

    if (!this.formElement) {
      throw new Error(`❌ No se encontró formulario con selector: ${this.selector}`)
    }

    this.logger.debug(`📋 Formulario encontrado: ${this.formElement.id || this.selector}`)
  }

  /**
   * Inicializar event bus
   */
  _initializeEventBus() {
    this.eventBus = new EventBus({
      formElement: this.formElement,
      systemStore: this.systemStore,
      validationStore: this.validationStore,
      fieldStore: this.fieldStore,
      ui: this.domManager,
      logger: this.logger
    })
  }

  /**
   * Cargar datos preconfigurados
   */
  async _loadData() {
    try {
      this.logger.info('📊 Cargando datos preconfigurados...')
      await this.dataPreloader.loadAll()
      this.logger.info('✅ Datos cargados correctamente')
    } catch (error) {
      this.logger.warn('⚠️ Error cargando datos preconfigurados:', error.message)
      // No es crítico, continuar
    }
  }

  /**
   * Configurar formulario
   */
  async _configureForm() {
    this.logger.info('⚙️ Configurando formulario...')

    // 1. Inicializar todos los campos con sus respectivos adaptadores
    await this.fieldController.initializeAllFields()

    // 2. Configurar validaciones
    this._setupValidations()

    // 3. Configurar lógica condicional
    this._setupConditionalLogic()

    this.logger.info('✅ Formulario configurado correctamente')
  }

  /**
   * Configurar validaciones
   */
  _setupValidations() {
    // Validación en tiempo real para campos específicos
    const criticalFields = ['first_name', 'last_name', 'email', 'type_doc', 'document', 'type_attendee']

    criticalFields.forEach(fieldName => {
      const field = this.formElement.querySelector(`[name="${fieldName}"]`)
      if (field) {
        field.addEventListener('blur', async e => {
          const value = e.target.value
          const formData = this._getFormData()
          const validationResult = await this.validationEngine.validateField(fieldName, value, formData)

          // Mostrar error si la validación falló
          if (!validationResult.isValid && validationResult.error) {
            this.domManager.showFieldError(field, validationResult.error)
          } else {
            // Limpiar error si la validación pasó
            this.domManager.hideFieldError(field)
          }
        })
      }
    })

    this.logger.debug('🛡️ Validaciones configuradas')
  }

  /**
   * Configurar lógica condicional
   */
  _setupConditionalLogic() {
    // Lógica condicional para tipo de asistente
    const typeAttendeeField = this.formElement.querySelector('[name="type_attendee"]')
    if (typeAttendeeField) {
      typeAttendeeField.addEventListener('change', e => {
        this._handleTypeAttendeeChange(e.target.value)
      })
    }

    // Lógica condicional para tipo de documento → máscara de documento
    const typeDocField = this.formElement.querySelector('[name="type_doc"]')
    const documentField = this.formElement.querySelector('[name="document"]')

    if (typeDocField && documentField) {
      typeDocField.addEventListener('change', e => {
        this._handleDocumentTypeChange(e.target.value, documentField)
      })
    }

    this.logger.debug('🔀 Lógica condicional configurada')
  }

  /**
   * Manejar cambio de tipo de asistente
   */
  _handleTypeAttendeeChange(typeValue) {
    switch (typeValue) {
      case 'aspirante':
        this.fieldController.showField('academic_level')
        this.fieldController.showField('program')
        this.fieldController.hideField('company')
        break

      case 'empresa':
        this.fieldController.showField('company')
        this.fieldController.hideField('academic_level')
        this.fieldController.hideField('program')
        break

      default:
        this.fieldController.hideField('academic_level')
        this.fieldController.hideField('program')
        this.fieldController.hideField('company')
    }

    this.logger.debug(`🔄 Lógica condicional aplicada para: ${typeValue}`)
  }

  /**
   * Manejar cambio de tipo de documento
   */
  _handleDocumentTypeChange(documentType, documentField) {
    if (!documentType || !documentField) return

    // Acceder al CleaveAdapter a través del fieldController
    const cleaveAdapter = this.fieldController?.adapters?.cleave

    if (cleaveAdapter && cleaveAdapter.updateDocumentMask) {
      cleaveAdapter.updateDocumentMask(documentField, documentType)
      this.logger.debug(`🆔 Máscara de documento actualizada a: ${documentType}`)
    } else {
      this.logger.warn('⚠️ CleaveAdapter no encontrado para actualizar máscara')
    }
  }

  /**
   * Configurar eventos del formulario
   */
  _setupEvents() {
    // Evento de envío
    this.formElement.addEventListener('submit', e => {
      e.preventDefault()
      this.handleSubmit(e)
    })

    // Eventos de cambio para actualizar stores
    this.formElement.addEventListener('change', e => {
      if (e.target.name) {
        this.validationStore.getState().updateField(e.target.name, e.target.value)
        this.fieldStore.getState().updateFieldValue(e.target.name, e.target.value)
      }
    })

    this.logger.debug('👂 Eventos configurados')
  }

  /**
   * Manejar envío de formulario
   */
  async handleSubmit(event) {
    event.preventDefault()

    try {
      this.systemStore.getState().setSystemState('isSubmitting', true)
      this.logger.info('📤 Iniciando envío de formulario...')

      // 1. Validar formulario completo
      const formData = this._getFormData()
      const validationResult = await this.validationEngine.validateForm(formData)

      if (!validationResult.isValid) {
        this.logger.warn('❌ Formulario inválido:', validationResult.errors)
        this._showValidationErrors(validationResult.errors)
        return false
      }

      // 2. Procesar envío
      await this._processFormSubmission(formData)

      this.logger.info('✅ Formulario enviado correctamente')
      return true
    } catch (error) {
      this.logger.error('❌ Error en envío:', error)
      this._showSubmissionError(error)
      return false
    } finally {
      this.systemStore.getState().setSystemState('isSubmitting', false)
    }
  }

  /**
   * Procesar envío del formulario
   */
  async _processFormSubmission(formData) {
    // Usar SalesforceMapper para procesar envío
    const submissionResult = await this.salesforceMapper.submitForm(formData)

    if (submissionResult.success) {
      this._showSuccessMessage()

      // Callback personalizado
      if (this.config.callbacks?.onFormSubmit) {
        this.config.callbacks.onFormSubmit(formData, submissionResult)
      }
    } else {
      throw new Error(submissionResult.error || 'Error en envío a Salesforce')
    }
  }

  /**
   * Obtener datos del formulario
   */
  _getFormData() {
    const formData = new FormData(this.formElement)
    const data = {}

    for (let [key, value] of formData.entries()) {
      data[key] = value
    }

    // Procesar campos especiales de teléfono
    this._processPhoneFields(data)

    return data
  }

  /**
   * Procesar campos de teléfono para mantener indicativo y número por separado
   */
  _processPhoneFields(data) {
    // Si tenemos tanto phone_code como mobile, crear campos separados
    if (data.phone_code && data.mobile) {
      // Obtener información del país seleccionado
      const phoneCodeElement = this.formElement.querySelector('[name="phone_code"]')
      let selectedCountry = null

      if (phoneCodeElement && phoneCodeElement.tomSelect) {
        const selectedValue = phoneCodeElement.tomSelect.getValue()
        selectedCountry = phoneCodeElement.tomSelect.options[selectedValue]
      }

      // Mantener campos separados
      data.phone_country_code = data.phone_code // ISO2 del país
      data.phone_prefix = selectedCountry ? selectedCountry.phoneCode : data.phone_code
      data.phone_number = data.mobile

      // Crear campo combinado para compatibilidad
      const prefix = selectedCountry ? `+${selectedCountry.phoneCode}` : ''
      data.phone_full = prefix ? `${prefix} ${data.mobile}` : data.mobile

      this.logger?.debug(
        `📱 Teléfono procesado - País: ${data.phone_country_code}, Prefijo: +${data.phone_prefix}, Número: ${data.phone_number}`
      )
    }
  }

  /**
   * Mostrar errores de validación
   */
  _showValidationErrors(errors) {
    Object.entries(errors).forEach(([fieldName, message]) => {
      const fieldElement = this.formElement.querySelector(`[name="${fieldName}"]`)
      if (fieldElement) {
        this.domManager.showFieldError(fieldElement, message)
      } else {
        this.logger.warn(`Campo con error no encontrado en DOM: ${fieldName}`)
      }
    })
  }

  /**
   * Mostrar error de envío
   */
  _showSubmissionError(error) {
    this.domManager.showFormError('Error al enviar formulario: ' + error.message)
  }

  /**
   * Mostrar mensaje de éxito
   */
  _showSuccessMessage() {
    this.domManager.showFormSuccess('Formulario enviado correctamente')
  }

  // ===== MÉTODOS DE COMPATIBILIDAD =====

  /**
   * Obtener configuración (compatibilidad)
   */
  getConfig() {
    return this.config.getConfig()
  }

  /**
   * Obtener elemento del formulario (compatibilidad)
   */
  getFormElement() {
    return this.formElement
  }

  /**
   * Validar formulario (compatibilidad)
   */
  async validateForm() {
    const formData = this._getFormData()
    return await this.validationEngine.validateForm(formData)
  }

  // ===== DESTRUCTOR =====

  /**
   * Destruir instancia del FormManager
   */
  destroy() {
    this.logger.info('🗑️ Destruyendo FormManager...')

    // Limpiar adaptadores
    if (this.fieldController) {
      this.fieldController.destroy()
    }

    this.tomSelectAdapter.destroyAll()
    this.cleaveAdapter.destroyAll()

    // Limpiar stores
    this.validationStore.getState().reset()
    this.systemStore.getState().setSystemState('isInitialized', false)

    // Limpiar event bus
    if (this.eventBus) {
      this.eventBus.destroy()
    }

    // Limpiar referencias
    this.formElement = null
    this.isInitialized = false

    this.logger.info('✅ FormManager destruido correctamente')
  }
}
