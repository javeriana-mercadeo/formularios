/**
 * State - Maneja el estado del formulario
 * Centraliza la lógica de estado y emite eventos de cambios
 * @version 1.0
 */

import { Constants } from './Constants.js'

export class State {
  constructor({ config, event, validator, ui, formElement, logger }) {
    this.config = config
    this.ui = ui
    this.validator = validator
    this.logger = logger
    this.formElement = formElement
    this.event = event

    this.state = this._getInitialState()
    this.uiState = this._getInitialUiState()
    this.validationState = this._getInitialValidationState()
    this.systemState = this._getInitialSystemState()

    // Configuración de validación automática
    this.autoValidation = {
      enabled: true
    }
  }

  // ===============================
  // CONFIGURACIÓN DE VALIDACIÓN AUTOMÁTICA
  // ===============================

  /**
   * Configurar validación automática
   * @param {Object} config - Configuración de validación
   */
  setupAutoValidation(config = {}) {
    this.autoValidation = {
      enabled: true
    }

    this.logger.info('🔧 Validación automática configurada:', this.autoValidation)
  }

  /**
   * Configurar dependencias para validación
   * @param {Object} dependencies - Objetos validator, ui, formElement
   */
  setValidationDependencies(dependencies = {}) {
    if (dependencies.validator) this.validator = dependencies.validator
    if (dependencies.ui) this.ui = dependencies.ui
    if (dependencies.formElement) this.formElement = dependencies.formElement

    this.logger.debug('🔗 Dependencias de validación establecidas')
  }

  // ===============================
  // GESTIÓN DE ESTADO DE FORMULARIO
  // ===============================

  /**
   * Actualizar campo específico del formulario
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Nuevo valor
   * @returns {boolean} - True si se actualizó correctamente
   */
  updateField(fieldName, value) {
    if (!this.state.hasOwnProperty(fieldName)) {
      this.logger.warn(`Intento de actualizar campo inexistente: ${fieldName}`)

      return false
    }

    const previousValue = this.state[fieldName]
    const hasChanged = previousValue !== value
    const isTouched = this.isFieldTouched(fieldName)

    // Actualizar si el valor cambió
    if (hasChanged) {
      this.state[fieldName] = value

      this.logger.info(`🔄 Campo actualizado: ${fieldName} "${previousValue}" → "${value}"`)

      // Emitir eventos de cambio
      this._emitFieldChangeEvents(fieldName, previousValue, value)
    } else {
      this.logger.info(`⚪ Sin cambios en ${fieldName}: "${value}"`)
    }

    // Validación automática si está habilitada Y el campo ha sido tocado
    // (validar incluso si no cambió el valor, para detectar errores en blur)
    if (isTouched) {
      this.logger.info(`🔍 Ejecutando validación por campo tocado: ${fieldName}`)

      this._autoValidateField(fieldName)
    }

    return true
  }

  /**
   * Establecer múltiples campos
   * @param {Object} fields - Objeto con campos y valores
   */
  setFields(fields) {
    Object.entries(fields).forEach(([fieldName, value]) => {
      this.updateField(fieldName, value)
    })
  }

  /**
   * Obtener valor de campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {any} - Valor del campo
   */
  getField(fieldName) {
    return this.state[fieldName]
  }

  /**
   * Obtener todo el estado del formulario
   * @returns {Object} - Copia del estado completo
   */
  getFormData() {
    return { ...this.state }
  }

  /**
   * Resetear formulario al estado inicial
   */
  reset() {
    const previousState = { ...this.state }
    this.state = this._getInitialState()
    this.validationState = this._getInitialValidationState()
    this.systemState.isSubmitting = false

    this.logger.info('Estado del formulario reseteado')

    // Emitir evento de reset
    this._emitEvent('stateReset', {
      previousState,
      newState: { ...this.state },
      timestamp: new Date().toISOString()
    })
  }

  // ===============================
  // GESTIÓN DE ESTADO DE VALIDACIÓN
  // ===============================

  /**
   * Establecer error de validación
   * @param {string} fieldName - Nombre del campo
   * @param {string} error - Mensaje de error
   */
  setValidationError(fieldName, error) {
    this.logger.info(`📝 [STATE] ESTABLECIENDO ERROR para ${fieldName}: "${error}"`)

    const hadErrors = this.hasValidationErrors()
    this.validationState.errors[fieldName] = error
    this._updateValidationState()

    // Emitir evento si cambió el estado de validación
    if (!hadErrors && this.hasValidationErrors()) {
      this._emitEvent('validationStateChanged', {
        isValid: false,
        newError: { fieldName, error },
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Limpiar error de validación
   * @param {string} fieldName - Nombre del campo
   */
  clearValidationError(fieldName) {
    this.logger.info(`🧹 [STATE] LIMPIANDO ERROR para ${fieldName}`)

    const hadErrors = this.hasValidationErrors()
    delete this.validationState.errors[fieldName]
    this._updateValidationState()

    // Emitir evento si cambió el estado de validación
    if (hadErrors && !this.hasValidationErrors()) {
      this._emitEvent('validationStateChanged', {
        isValid: true,
        clearedError: fieldName,
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Limpiar todos los errores de validación
   */
  clearValidationErrors() {
    const hadErrors = this.hasValidationErrors()
    this.validationState.errors = {}
    this.validationState.touchedFields.clear()
    this._updateValidationState()

    if (hadErrors) {
      this._emitEvent('validationStateChanged', {
        isValid: true,
        allErrorsCleared: true,
        timestamp: new Date().toISOString()
      })
    }
  }

  /**
   * Marcar campo como tocado
   * @param {string} fieldName - Nombre del campo
   */
  markFieldAsTouched(fieldName) {
    if (!this.validationState.touchedFields.has(fieldName)) {
      this.logger.info(`👆 [STATE] Campo marcado como TOCADO: ${fieldName}`)

      this.validationState.touchedFields.add(fieldName)

      this._emitEvent('fieldTouched', {
        fieldName,
        timestamp: new Date().toISOString()
      })
    } else {
      this.logger.debug(`👆 [STATE] Campo ya estaba tocado: ${fieldName}`)
    }
  }

  /**
   * Verificar si campo ha sido tocado
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean}
   */
  isFieldTouched(fieldName) {
    return this.validationState.touchedFields.has(fieldName)
  }

  /**
   * Obtener errores de validación
   * @returns {Object} - Copia de los errores
   */
  getValidationErrors() {
    return { ...this.validationState.errors }
  }

  /**
   * Verificar si hay errores de validación
   * @returns {boolean}
   */
  hasValidationErrors() {
    return Object.keys(this.validationState.errors).length > 0
  }

  /**
   * Verificar si el formulario es válido
   * @returns {boolean}
   */
  isValid() {
    return this.validationState.isValid
  }

  // ===============================
  // GESTIÓN DE ESTADO DE Ui
  // ===============================

  /**
   * Mostrar/ocultar campo en Ui
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} visible - Si es visible o no
   */
  setFieldVisibility(fieldName, visible) {
    if (this.uiState.fieldsVisible.hasOwnProperty(fieldName)) {
      const previousValue = this.uiState.fieldsVisible[fieldName]

      if (previousValue !== visible) {
        this.uiState.fieldsVisible[fieldName] = visible

        this.logger.debug(`Visibilidad de campo ${fieldName}: ${visible}`)

        this._emitEvent('fieldVisibilityChanged', {
          fieldName,
          visible,
          previousValue,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  /**
   * Habilitar/deshabilitar campo en Ui
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} disabled - Si está deshabilitado
   */
  setFieldDisabled(fieldName, disabled) {
    if (this.uiState.fieldsDisabled.hasOwnProperty(fieldName)) {
      const previousValue = this.uiState.fieldsDisabled[fieldName]

      if (previousValue !== disabled) {
        this.uiState.fieldsDisabled[fieldName] = disabled

        this.logger.debug(`Campo ${fieldName} ${disabled ? 'deshabilitado' : 'habilitado'}`)

        this._emitEvent('fieldDisabledChanged', {
          fieldName,
          disabled,
          previousValue,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  /**
   * Obtener estado de Ui
   * @returns {Object} - Copia del estado de Ui
   */
  getUiState() {
    return { ...this.uiState }
  }

  // ===============================
  // GESTIÓN DE ESTADO DEL SISTEMA
  // ===============================

  /**
   * Establecer estado del sistema
   * @param {string} key - Clave del estado
   * @param {any} value - Nuevo valor
   */
  setSystemState(key, value) {
    if (this.systemState.hasOwnProperty(key)) {
      const previousValue = this.systemState[key]

      if (previousValue !== value) {
        this.systemState[key] = value

        this.logger.debug(`Estado del sistema actualizado: ${key} = ${value}`)

        this._emitEvent('systemStateChanged', {
          key,
          value,
          previousValue,
          timestamp: new Date().toISOString()
        })
      }
    }
  }

  /**
   * Obtener estado del sistema
   * @returns {Object} - Copia del estado del sistema
   */
  getSystemState() {
    return { ...this.systemState }
  }

  // ===============================
  // GESTIÓN DE MODOS DEL SISTEMA
  // ===============================

  /**
   * Establecer modo de desarrollo
   * @param {boolean} enabled - Si está habilitado
   */
  setDevelopmentMode(enabled) {
    this.setSystemState('developmentMode', enabled)

    this.logger.info(`🔧 Modo desarrollo: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`)
  }

  /**
   * Establecer modo sandbox
   * @param {boolean} enabled - Si está habilitado
   */
  setTestMode(enabled) {
    this.setSystemState('testMode', enabled)

    this.logger.info(`🧪 Modo test: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`)
  }

  /**
   * Establecer modo debug
   * @param {boolean} enabled - Si está habilitado
   */
  setDebugMode(enabled) {
    this.setSystemState('debugMode', enabled)

    this.logger.info(`🐛 Modo debug: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`)
  }

  /**
   * Verificar si está en modo desarrollo
   * @returns {boolean}
   */
  isDevMode() {
    return this.systemState.developmentMode
  }

  /**
   * Verificar si está en modo sandbox
   * @returns {boolean}
   */
  isTestMode() {
    return this.systemState.testMode
  }

  /**
   * Verificar si está en modo debug
   * @returns {boolean}
   */
  isDebugMode() {
    return this.systemState.debugMode
  }

  /**
   * Establecer logger instance
   * @param {Logger} logger - Instancia del logger
   */
  setLogger(logger) {
    this.logger = logger
  }

  // ===============================
  // MÉTODOS DE UTILIDAD
  // ===============================

  /**
   * Verificar si el formulario está listo para enviar
   * @returns {boolean}
   */
  isReadyToSubmit() {
    const authField = Constants.FIELDS.DATA_AUTHORIZATION

    // En modo desarrollo, los reqUisitos son más flexibles
    if (this.systemState.devMode) {
      return !this.systemState.isSubmitting
    }

    // En modo normal, se reqUiere validación y autorización
    return this.validationState.isValid && !this.systemState.isSubmitting && this.state[authField] === '1'
  }

  /**
   * Obtener resumen completo del estado
   * @returns {Object} - Resumen del estado
   */
  getStateSummary() {
    return {
      formData: this.getFormData(),
      UiState: this.getUiState(),
      validationState: {
        isValid: this.validationState.isValid,
        errorsCount: Object.keys(this.validationState.errors).length,
        touchedFieldsCount: this.validationState.touchedFields.size,
        errors: this.getValidationErrors()
      },
      systemState: this.getSystemState(),
      isReadyToSubmit: this.isReadyToSubmit()
    }
  }

  // ===============================
  // GESTIÓN DE EVENTOS
  // ===============================

  /**
   * Establecer el Event
   * @param {Event} event - Instancia del Event
   */
  setEventManager(event) {
    this.event = event

    this.logger.debug('Event configurado en State')
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Obtener estado inicial del formulario
   * @private
   */
  _getInitialState() {
    const { FIELDS } = Constants

    return {
      // Campos ocultos
      [FIELDS.OID]: '',
      [FIELDS.RET_URL]: this.config.retUrl || '',
      [FIELDS.DEBUG]: '0',
      [FIELDS.DEBUG_EMAIL]: this.config.debugEmail || '',

      // Campos ocultos obligatorios para el flujo en Salesforce
      [FIELDS.AUTHORIZATION_SOURCE]: this.config.authorizationSource || 'Landing Eventos',
      [FIELDS.REQUEST_ORIGIN]: this.config.requestOrigin || 'web_to_lead_eventos',
      [FIELDS.LEAD_SOURCE]: this.config.leadSource || 'Landing Pages',

      // Campos personales
      [FIELDS.FIRST_NAME]: '',
      [FIELDS.LAST_NAME]: '',
      [FIELDS.TYPE_DOC]: '',
      [FIELDS.DOCUMENT]: '',
      [FIELDS.EMAIL]: '',
      [FIELDS.PHONE_CODE]: '57',
      [FIELDS.PHONE]: '',

      // Campos de ubicación
      [FIELDS.COUNTRY]: 'COL',
      [FIELDS.DEPARTMENT]: '',
      [FIELDS.CITY]: '',

      // Campos académicos
      [FIELDS.ACADEMIC_LEVEL]: '',
      [FIELDS.FACULTY]: '',
      [FIELDS.PROGRAM]: '',
      [FIELDS.ADMISSION_PERIOD]: '',

      // Campos del evento
      [FIELDS.TYPE_ATTENDEE]: 'Aspirante',
      [FIELDS.ATTENDANCE_DAY]: '',
      [FIELDS.COLLEGE]: '',
      [FIELDS.UNIVERSITY]: '',
      [FIELDS.COMPANY]: 'NA',
      [FIELDS.DATA_AUTHORIZATION]: '',

      // Campos parámetros URL - PRIORIDAD: configuración > valores por defecto
      [FIELDS.SOURCE]: this.config.getConfig().source || 'Javeriana',
      [FIELDS.SUB_SOURCE]: this.config.getConfig().subSource || 'Organico',
      [FIELDS.MEDIUM]: this.config.getConfig().medium || 'Landing',
      [FIELDS.CAMPAIGN]: this.config.getConfig().campaign || '',
      [FIELDS.ARTICLE]: this.config.getConfig().article || '',
      [FIELDS.EVENT_NAME]: this.config.getConfig().eventName || '',
      [FIELDS.EVENT_DATE]: this.config.getConfig().eventDate || ''
    }
  }

  /**
   * Obtener estado inicial de Ui
   * @private
   */
  _getInitialUiState() {
    const { FIELDS } = Constants

    return {
      fieldsVisible: {
        [FIELDS.DEPARTMENT]: false,
        [FIELDS.CITY]: false,
        [FIELDS.ACADEMIC_LEVEL]: false,
        [FIELDS.FACULTY]: false,
        [FIELDS.PROGRAM]: false,
        [FIELDS.ADMISSION_PERIOD]: false
      },
      fieldsDisabled: {
        submit: true
      }
    }
  }

  /**
   * Obtener estado inicial de validación
   * @private
   */
  _getInitialValidationState() {
    return {
      errors: {},
      touchedFields: new Set(),
      isValid: false
    }
  }

  /**
   * Obtener estado inicial del sistema
   * @private
   */
  _getInitialSystemState() {
    return {
      isInitialized: false,
      isSubmitting: false,
      isLoading: false,
      developmentMode: false,
      testMode: false,
      debugMode: false
    }
  }

  /**
   * Actualizar estado de validación general
   * @private
   */
  _updateValidationState() {
    this.validationState.isValid = !this.hasValidationErrors()
  }

  /**
   * Emitir eventos de cambio de campo
   * @private
   */
  _emitFieldChangeEvents(fieldName, previousValue, currentValue) {
    // Evento general de cambio de campo
    this._emitEvent('fieldChanged', {
      fieldName,
      previousValue,
      currentValue,
      timestamp: new Date().toISOString()
    })

    // Evento específico del campo
    this._emitEvent(`field:${fieldName}:changed`, {
      previousValue,
      currentValue,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Emitir un evento usando Event
   * @private
   */
  _emitEvent(eventName, data) {
    if (this.event) {
      this.event.emit(eventName, data)
    }
  }

  /**
   * Validar automáticamente un campo cuando cambia
   * @private
   * @param {string} fieldName - Nombre del campo que cambió
   */
  _autoValidateField(fieldName) {
    // Solo validar si está habilitado y tenemos las dependencias necesarias
    if (!this.autoValidation.enabled || !this.validator || !this.ui || !this.formElement) {
      this.logger.debug(`⚠️ Validación automática deshabilitada o faltan dependencias para: ${fieldName}`, {
        enabled: this.autoValidation.enabled,
        hasValidator: !!this.validator,
        hasUi: !!this.ui,
        hasFormElement: !!this.formElement
      })

      return
    }

    // Solo validar si el campo ha sido tocado por el usuario
    if (!this.isFieldTouched(fieldName)) {
      this.logger.debug(`⚠️ Campo ${fieldName} no ha sido tocado, saltando validación`)

      return
    }

    this.logger.info(`🔍 Ejecutando validación automática para: ${fieldName}`)

    try {
      // Obtener el elemento del campo en el DOM
      const fieldElement = this._getFieldElement(fieldName)
      if (!fieldElement) {
        this.logger.debug(`⚠️ Elemento no encontrado para campo: ${fieldName}`)

        return
      }

      // Realizar validación completa del formulario
      const formData = this.getFormData()

      this.logger.info(`📊 Datos del formulario para validación:`, formData[fieldName])

      const validationResult = this.validator.validateFullForm(this.formElement, formData)

      this.logger.info(`📋 Resultado de validación para ${fieldName}:`, {
        isValid: validationResult.isValid,
        hasErrorForField: !!validationResult.errors[fieldName],
        fieldError: validationResult.errors[fieldName],
        allErrors: Object.keys(validationResult.errors)
      })

      // Manejar resultado de validación
      if (!validationResult.isValid && validationResult.errors[fieldName]) {
        // Hay error en este campo
        this.setValidationError(fieldName, validationResult.errors[fieldName])
        this.ui.showFieldError(fieldElement, validationResult.errors[fieldName])

        this.logger.info(`❌ Error mostrado para ${fieldName}: ${validationResult.errors[fieldName]}`)
      } else {
        // No hay error en este campo

        this.logger.info(`✅ Campo válido, limpiando errores para: ${fieldName}`)
        this.logger.info(`🔍 Debug - Estado antes de limpiar:`, {
          fieldName,
          fieldValue: formData[fieldName],
          allErrorsCount: Object.keys(validationResult.errors).length,
          hasThisFieldError: !!validationResult.errors[fieldName]
        })

        this.clearValidationError(fieldName)
        this.ui.hideFieldError(fieldElement)
      }
    } catch (error) {
      this.logger.error(`Error en validación automática para ${fieldName}:`, error)
    }
  }

  /**
   * Obtener elemento del DOM para un campo específico
   * @private
   * @param {string} fieldName - Nombre del campo
   * @returns {HTMLElement|null} - Elemento del campo o null
   */
  _getFieldElement(fieldName) {
    if (!this.formElement) return null

    // Buscar por name, id, o selector de constantes
    const selectors = [`[name="${fieldName}"]`, `#${fieldName}`, Constants.SELECTORS[fieldName.toUpperCase()] || null].filter(Boolean)

    for (const selector of selectors) {
      const element = this.formElement.querySelector(selector)
      if (element) return element
    }

    return null
  }
}
