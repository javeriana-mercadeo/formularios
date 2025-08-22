/**
 * Service - Servicio de integración con APIs externas
 *
 * Responsabilidades principales:
 * - Gestionar envío de formularios a Salesforce Web-to-Lead
 * - Mapear campos del formulario a campos de Salesforce
 * - Manejar configuración de ambientes (test/producción)
 * - Implementar reintentos y manejo de errores
 * - Mantener historial de envíos para auditoría
 *
 * @version 1.0
 */

import { Logger } from './Logger.js'
import { Constants } from './Constants.js'
import { Config } from './Config.js'

export class Service {
  constructor({ config = null, logger = null }) {
    this.isSubmitting = false
    this.submitHistory = []
    this.config = config
    this.logger = logger
  }

  /**
   * Obtener ID de campo de Salesforce según el ambiente actual
   * @param {string} fieldKey - Clave del campo en el mapeo
   * @returns {string} - ID de campo de Salesforce
   */
  getFieldId(fieldKey) {
    const mapping = Constants.FIELD_MAPPING[fieldKey]
    if (!mapping) {
      this.logger?.warn(`Campo no encontrado en mapeo: ${fieldKey}`)
      return ''
    }

    // Manejar diferentes estructuras de mapeo
    if (typeof mapping.id === 'object' && mapping.id.test && mapping.id.prod) {
      return this.config?.sandboxMode ? mapping.id.test : mapping.id.prod
    } else {
      return mapping.id
    }
  }

  /**
   * Crear mapeo completo de campos del formulario a Salesforce
   * Centraliza toda la lógica de mapeo usando FIELD_MAPPING
   * @returns {Object} - Mapeo completo de campos
   */
  createFieldMapping() {
    const mapping = Constants.FIELD_MAPPING
    const isTest = this.config?.sandboxMode || false

    return {
      // Campos personales
      oid: isTest ? mapping.OID?.id?.test : mapping.OID?.id?.prod,
      first_name: mapping.NAME?.id || mapping.NAME?.field,
      last_name: mapping.LAST_NAME?.id || mapping.LAST_NAME?.field,
      type_doc: isTest ? mapping.DOCUMENT_TYPE?.id?.test : mapping.DOCUMENT_TYPE?.id?.prod,
      document: isTest ? mapping.DOCUMENT_NUMBER?.id?.test : mapping.DOCUMENT_NUMBER?.id?.prod,
      email: mapping.EMAIL?.id || mapping.EMAIL?.field,
      phone_prefix: isTest ? mapping.PHONE_PREFIX?.id?.test : mapping.PHONE_PREFIX?.id?.prod,
      phone: mapping.PHONE?.id || mapping.PHONE?.field,

      // Campos de ubicación
      country: isTest ? mapping.COUNTRY?.id?.test : mapping.COUNTRY?.id?.prod,
      department: isTest ? mapping.DEPARTMENT?.id?.test : mapping.DEPARTMENT?.id?.prod,
      city: isTest ? mapping.CITY?.id?.test : mapping.CITY?.id?.prod,

      // Campos de evento
      type_attendee: isTest ? mapping.ATTENDEE_TYPE?.id?.test : mapping.ATTENDEE_TYPE?.id?.prod,
      attendance_day: isTest ? mapping.ATTENDANCE_DAY?.id?.test : mapping.ATTENDANCE_DAY?.id?.prod,

      // Campos académicos
      academic_level: isTest ? mapping.ACADEMIC_LEVEL?.id?.test : mapping.ACADEMIC_LEVEL?.id?.prod,
      program: isTest ? mapping.PROGRAM?.id?.test : mapping.PROGRAM?.id?.prod,
      admission_period: isTest ? mapping.ADMISSION_PERIOD?.id?.test : mapping.ADMISSION_PERIOD?.id?.prod,

      // Autorización
      authorization_data: isTest ? mapping.DATA_AUTHORIZATION?.id?.test : mapping.DATA_AUTHORIZATION?.id?.prod,

      // Campos adicionales del evento
      event_name: isTest ? mapping.EVENT_NAME?.id?.test : mapping.EVENT_NAME?.id?.prod,
      event_date: isTest ? mapping.EVENT_DATE?.id?.test : mapping.EVENT_DATE?.id?.prod,
      university: isTest ? mapping.UNIVERSITY?.id?.test : mapping.UNIVERSITY?.id?.prod,
      article: isTest ? mapping.ARTICLE?.id?.test : mapping.ARTICLE?.id?.prod,
      source: isTest ? mapping.SOURCE?.id?.test : mapping.SOURCE?.id?.prod,
      subSource: isTest ? mapping.SUB_SOURCE?.id?.test : mapping.SUB_SOURCE?.id?.prod,
      medium: isTest ? mapping.MEDIUM?.id?.test : mapping.MEDIUM?.id?.prod,
      campaign: isTest ? mapping.CAMPAIGN?.id?.test : mapping.CAMPAIGN?.id?.prod,

      // Campos de empresa (si existen)
      empresaConvenio: isTest ? mapping.PARTNER_COMPANY?.id?.test : mapping.PARTNER_COMPANY?.id?.prod
    }
  }

  /**
   * Obtener URL de endpoint de Salesforce para el ambiente
   * @returns {string} - URL de Salesforce Web-to-Lead
   */
  getSalesforceUrl() {
    return this.config?.sandboxMode ? Constants.SALESFORCE_SUBMIT_URLS.test : Constants.SALESFORCE_SUBMIT_URLS.prod
  }

  /**
   * Obtener Organization ID de Salesforce para el ambiente
   * @returns {string} - OID de Salesforce
   */
  getOID() {
    return this.config?.sandboxMode ? this.config.oids?.test : this.config.oids?.prod
  }

  /**
   * Transformar datos del formulario al formato requerido por Salesforce
   * Mapea campos locales a IDs de Salesforce basándose en lo que existe en el DOM
   * @param {HTMLFormElement} formElement - Elemento del formulario del DOM
   * @returns {FormData} - Datos preparados para envío
   */
  prepareFormData(formElement) {
    // Obtener todos los datos del formulario del DOM
    const originalFormData = new FormData(formElement)
    const preparedData = new FormData()

    this.logger?.debug('📋 Preparando datos del formulario para envío')
    this.logger?.debug(`📋 Número de campos en formulario: ${formElement.elements.length}`)

    // Crear mapeo inverso: nombre del campo → nombre Salesforce
    const fieldMapping = this.createFieldMapping()

    // Procesar cada campo que existe en el DOM para ser mapeado si se necesita
    for (let [fieldName, value] of originalFormData.entries()) {
      const salesForceField = fieldMapping[fieldName]
      if (salesForceField) {
        preparedData.append(salesForceField, value)
      } else {
        preparedData.append(fieldName, value)
      }
    }

    return preparedData
  }

  /**
   * Enviar formulario completo a Salesforce con manejo de errores
   * @param {HTMLElement} formElement - Elemento del formulario
   * @param {Object} formData - Datos a enviar
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitForm(formElement, formData) {
    if (this.isSubmitting) {
      this.logger?.warn('⚠️ Formulario ya está siendo enviado')
      return
    }

    this.isSubmitting = true

    try {
      this.logger?.info('🚀 Enviando formulario...')

      // Preparar datos del DOM
      const preparedData = this.prepareFormData(formElement)

      // Log de datos en modo debug
      if (this.config?.sandboxMode) {
        this.logger?.debug('🔍 Datos preparados para envío:')
        for (let [key, value] of preparedData.entries()) {
          this.logger?.debug(`  ${key}: ${value}`)
        }
      }

      // Enviar con reintentos
      const result = await this.submitWithRetry(preparedData)

      // Registrar envío exitoso
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: 'success',
        data: formData,
        response: result
      })

      this.logger?.info('✅ Formulario enviado exitosamente')
      return result
    } catch (error) {
      // Registrar error
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: 'error',
        data: formData,
        error: error.message
      })

      this.logger?.error('❌ Error al enviar formulario:', error)
      throw error
    } finally {
      this.isSubmitting = false
    }
  }

  /**
   * Ejecutar envío con lógica de reintentos automáticos
   * @param {FormData} formData - Datos a enviar
   * @param {number} attempt - Número de intento actual
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitWithRetry(formData, attempt = 1) {
    try {
      return await this.performSubmit(formData)
    } catch (error) {
      if (attempt >= (this.config?.maxRetries || 3)) {
        throw error
      }

      this.logger?.warn(`⚠️ Intento ${attempt} falló, reintentando en ${this.config?.retryDelay || 1000}ms...`)

      await new Promise(resolve => setTimeout(resolve, this.config?.retryDelay || 1000))

      return this.submitWithRetry(formData, attempt + 1)
    }
  }

  /**
   * Ejecutar una sola petición HTTP a Salesforce
   * @param {FormData} formData - Datos a enviar
   * @returns {Promise} - Promesa con respuesta HTTP
   */
  async performSubmit(formData) {
    const url = this.getSalesforceUrl()

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Configurar timeout
      xhr.timeout = this.config?.timeout || 30000

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText
          })
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Error de red al enviar formulario'))
      }

      xhr.ontimeout = () => {
        reject(new Error('Timeout al enviar formulario'))
      }

      xhr.open('POST', url, true)
      xhr.send(formData)
    })
  }

  /**
   * Configurar el form action con la URL correcta según el modo
   * @param {HTMLElement} formElement - Formulario a configurar
   */
  configureFormAction(formElement) {
    if (!formElement) {
      this.logger?.warn('⚠️ Elemento de formulario no encontrado para configurar action')
      return
    }

    const salesforceUrl = this.getSalesforceUrl()

    // Configurar acción del formulario
    formElement.action = salesforceUrl
    formElement.method = 'POST'
    formElement.enctype = 'multipart/form-data'

    this.logger?.info(`🔗 Form action configurado: ${salesforceUrl}`)
    this.logger?.info(`📝 Modo sandbox: ${this.config?.sandboxMode ? 'SÍ' : 'NO'}`)
  }

  /**
   * Transformar campos del formulario para usar IDs de Salesforce
   * @param {HTMLElement} formElement - Formulario a transformar
   * @private
   */
  _transformFormFieldsForSalesforce(formElement) {
    if (!formElement) return

    const isTest = this.config?.sandboxMode
    const transformedFields = []

    this.logger?.info(`🔧 Transformando campos para Salesforce - Modo: ${isTest ? 'TEST/SANDBOX' : 'PRODUCCIÓN'}`)

    // Iterar sobre todos los campos del formulario
    const formFields = formElement.querySelectorAll('input, select, textarea')

    formFields.forEach(field => {
      const fieldName = field.name
      if (!fieldName) return

      // Buscar el mapeo correspondiente
      const mappingKey = Object.keys(Constants.FIELD_MAPPING).find(key => Constants.FIELD_MAPPING[key].field === fieldName)

      if (mappingKey) {
        // Usar el método getFieldId para obtener el ID correcto según el ambiente
        const salesforceId = this.getFieldId(mappingKey)
        this.logger?.debug(`📋 ${fieldName}: ${isTest ? 'TEST' : 'PROD'} -> ${salesforceId}`)

        // Solo transformar si el ID es diferente al nombre del campo
        // Esto evita transformar campos como 'oid', 'email', 'first_name', etc.
        // El campo OID nunca debe ser transformado, debe mantener su nombre como "oid"
        if (salesforceId && salesforceId !== fieldName && fieldName !== 'oid') {
          this.logger?.debug(`Transformando campo: ${fieldName} → ${salesforceId}`)
          field.name = salesforceId
          transformedFields.push({
            original: fieldName,
            transformed: salesforceId,
            value: field.value
          })
        } else {
          this.logger?.debug(`Campo mantiene su nombre: ${fieldName} (ID: ${salesforceId})`)
        }
      }
    })

    if (transformedFields.length > 0) {
      this.logger?.info(`✅ ${transformedFields.length} campos transformados para Salesforce`)
      this.logger?.debug('Campos transformados:', transformedFields)
    }
  }

  /**
   * Enviar datos del formulario a Salesforce
   * @param {Object} formData - Datos del formulario preparados
   * @param {string} salesforceUrl - URL de Salesforce para envío
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitFormData(formData, salesforceUrl) {
    if (this.isSubmitting) {
      throw new Error('⚠️ Formulario ya está siendo enviado')
    }

    this.isSubmitting = true

    try {
      this.logger?.info('🚀 Enviando datos del formulario a Salesforce...')
      this.logger?.debug(`📡 URL de destino: ${salesforceUrl}`)

      // Preparar FormData para envío
      const formDataToSend = new FormData()

      // Agregar todos los campos al FormData
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
        this.logger?.debug(`📝 Campo agregado: ${key} = ${value}`)
      })

      // Log de datos en modo debug
      if (this.logger) {
        this.logger.debug(`📊 Total de campos a enviar: ${Object.keys(formData).length}`)
      }

      // Enviar con reintentos usando la URL específica
      const result = await this.submitWithRetryToUrl(formDataToSend, salesforceUrl)

      // Registrar envío exitoso
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: 'success',
        data: formData,
        url: salesforceUrl,
        response: result
      })

      this.logger?.info('✅ Datos enviados exitosamente a Salesforce')
      return result
    } catch (error) {
      // Registrar error
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: 'error',
        data: formData,
        url: salesforceUrl,
        error: error.message
      })

      this.logger?.error('❌ Error al enviar datos a Salesforce:', error)
      throw error
    } finally {
      this.isSubmitting = false
    }
  }

  /**
   * Ejecutar envío con lógica de reintentos automáticos a URL específica
   * @param {FormData} formData - Datos a enviar
   * @param {string} url - URL de destino
   * @param {number} attempt - Número de intento actual
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitWithRetryToUrl(formData, url, attempt = 1) {
    try {
      return await this.performSubmitToUrl(formData, url)
    } catch (error) {
      if (attempt >= (this.config?.maxRetries || 3)) {
        throw error
      }

      this.logger?.warn(`⚠️ Intento ${attempt} falló, reintentando en ${this.config?.retryDelay || 1000}ms...`)

      await new Promise(resolve => setTimeout(resolve, this.config?.retryDelay || 1000))

      return this.submitWithRetryToUrl(formData, url, attempt + 1)
    }
  }

  /**
   * Ejecutar una sola petición HTTP a URL específica
   * @param {FormData} formData - Datos a enviar
   * @param {string} url - URL de destino
   * @returns {Promise} - Promesa con respuesta HTTP
   */
  async performSubmitToUrl(formData, url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Configurar timeout
      xhr.timeout = this.config?.timeout || 30000

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText
          })
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Error de red al enviar formulario'))
      }

      xhr.ontimeout = () => {
        reject(new Error('Timeout al enviar formulario'))
      }

      xhr.open('POST', url, true)
      xhr.send(formData)
    })
  }

  /**
   * Método de respaldo: envío tradicional con submit del formulario
   * @param {HTMLElement} formElement - Formulario a enviar
   */
  submitFormNative(formElement) {
    if (!formElement) {
      throw new Error('Elemento de formulario no encontrado')
    }

    // Configurar el form action antes del envío
    this.configureFormAction(formElement)

    // Transformar campos para usar IDs de Salesforce
    this._transformFormFieldsForSalesforce(formElement)

    this.logger?.info('🚀 Ejecutando submit nativo del formulario...')

    // Enviar formulario
    formElement.submit()
  }

  /**
   * Verificar que la configuración de API esté completa
   * @returns {boolean} - True si la configuración es válida
   * @throws {Error} - Si hay errores de configuración
   */
  validateConfig() {
    const errors = []

    if (!Constants.SALESFORCE_SUBMIT_URLS.test || !Constants.SALESFORCE_SUBMIT_URLS.prod) {
      errors.push('URLs de Salesforce no configuradas correctamente')
    }

    if (!this.config?.oids?.test || !this.config?.oids?.prod) {
      errors.push('OIDs de Salesforce no configurados correctamente')
    }

    if (!this.config?.thankYouUrl) {
      errors.push('URL de agradecimiento no configurada')
    }

    if (errors.length > 0) {
      throw new Error('Configuración inválida: ' + errors.join(', '))
    }

    return true
  }

  /**
   * Ejecutar prueba de conectividad con Salesforce
   * @returns {Promise} - Promesa con resultado de la prueba
   */
  async testConnection() {
    try {
      const testData = new FormData()
      testData.append('oid', this.getOID())
      testData.append('debug', '1')
      testData.append('debugEmail', this.config?.debugEmail || 'test@example.com')

      const response = await this.performSubmit(testData)

      this.logger?.info('✅ Conexión con Salesforce exitosa')
      return response
    } catch (error) {
      this.logger?.error('❌ Error de conexión con Salesforce:', error)
      throw error
    }
  }

  /**
   * Recuperar historial completo de envíos realizados
   * @returns {Array} - Lista de envíos con timestamps y resultados
   */
  getSubmitHistory() {
    return [...this.submitHistory]
  }

  /**
   * Borrar todo el historial de envíos almacenado
   */
  clearSubmitHistory() {
    this.submitHistory = []
  }

  /**
   * Calcular estadísticas de éxito/fallo de envíos
   * @returns {Object} - Estadísticas con totales y tasas de éxito
   */
  getSubmitStats() {
    const total = this.submitHistory.length
    const successful = this.submitHistory.filter(entry => entry.status === 'success').length
    const failed = this.submitHistory.filter(entry => entry.status === 'error').length

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  }

  /**
   * Activar/desactivar modo de depuración
   * @param {boolean} enabled - Si activar el modo debug
   * @param {string} debugEmail - Email para recibir copias de debug
   */
  setsandboxMode(enabled, debugEmail = '') {
    Config.sandboxMode = enabled
    Config.debugEmail = debugEmail

    this.logger?.info(`🔧 Modo debug API: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`)
    if (enabled && debugEmail) {
      this.logger?.info(`📧 Email debug: ${debugEmail}`)
    }
  }

  /**
   * Actualizar configuración del servicio API
   * @param {Object} newConfig - Nueva configuración a aplicar
   */
  updateConfig(newConfig) {
    Config = { ...Config, ...newConfig }
  }

  /**
   * Recuperar copia de la configuración actual
   * @returns {Object} - Configuración completa del servicio
   */
  getConfig() {
    return { ...Config }
  }

  /**
   * Añadir nuevo mapeo de campo para Salesforce
   * @param {string} fieldKey - Clave del campo local
   * @param {string} testId - ID de Salesforce para ambiente de prueba
   * @param {string} prodId - ID de Salesforce para ambiente de producción
   */
  addFieldMapping(fieldKey, testId, prodId) {
    Constants.FIELD_MAPPING[fieldKey] = {
      test: testId,
      prod: prodId
    }
  }

  /**
   * Eliminar mapeo de campo existente
   * @param {string} fieldKey - Clave del campo a remover
   */
  removeFieldMapping(fieldKey) {
    delete Constants.FIELD_MAPPING[fieldKey]
  }

  /**
   * Recuperar información detallada del ambiente de ejecución
   * @returns {Object} - Información del ambiente (URLs, OIDs, etc.)
   */
  getEnvironmentInfo() {
    return {
      mode: Config.sandboxMode ? 'TEST' : 'PRODUCTION',
      salesforceUrl: this.getSalesforceUrl(),
      oid: this.getOID(),
      thankYouUrl: Config.thankYouUrl,
      debugEmail: Config.debugEmail
    }
  }

  /**
   * Exportar configuración actual a formato JSON
   * @returns {string} - Configuración en formato JSON
   */
  exportConfig() {
    return JSON.stringify(Config, null, 2)
  }

  /**
   * Importar configuración desde JSON
   * @param {string} configJson - Configuración en formato JSON
   * @throws {Error} - Si el JSON es inválido
   */
  importConfig(configJson) {
    try {
      const newConfig = JSON.parse(configJson)
      this.updateConfig(newConfig)
      this.logger?.info('✅ Configuración importada exitosamente')
    } catch (error) {
      this.logger?.error('❌ Error al importar configuración:', error)
      throw error
    }
  }
}
