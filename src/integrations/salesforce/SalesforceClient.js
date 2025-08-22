/**
 * SalesforceClient - Cliente para integración con Salesforce Web-to-Lead
 * Maneja envío de formularios a Salesforce con mapeo dinámico test/prod
 * @version 1.0
 */

import { Constants } from '../../core/Constants.js'
import { useSystemStore } from '../../core/stores/system-store.js'
import { useSubmissionStore } from '../../features/form-submission/stores/submission-store.js'

export class SalesforceClient {
  constructor(logger) {
    this.logger = logger
    this.systemStore = useSystemStore
    this.submissionStore = useSubmissionStore
  }

  /**
   * Obtener URL de Salesforce según el modo actual
   * @returns {string} - URL de Salesforce
   */
  getSalesforceUrl() {
    return this.systemStore.getState().getSalesforceUrl()
  }

  /**
   * Mapear datos del formulario a campos de Salesforce
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Datos mapeados para Salesforce
   */
  mapFormDataToSalesforce(formData) {
    const isTestMode = this.systemStore.getState().isTestMode()
    const { FIELD_MAPPING } = Constants
    const mappedData = {}

    this.logger?.info(`🔧 Mapeando datos para: ${isTestMode ? 'SANDBOX' : 'PRODUCTION'}`)

    // Iterar sobre los datos del formulario y mapear según el ambiente
    Object.entries(formData).forEach(([fieldName, value]) => {
      const mapping = Object.values(FIELD_MAPPING).find(m => m.field === fieldName)

      if (mapping && mapping.id) {
        let salesforceId

        if (typeof mapping.id === 'object' && mapping.id.test && mapping.id.prod) {
          // Mapeo con diferentes IDs para test/prod
          salesforceId = isTestMode ? mapping.id.test : mapping.id.prod
          this.logger?.debug(`📝 Campo mapeado (${isTestMode ? 'test' : 'prod'}): ${fieldName} -> ${salesforceId} = ${value}`)
        } else {
          // Mapeo con ID único
          salesforceId = mapping.id
          this.logger?.debug(`📝 Campo mapeado (único): ${fieldName} -> ${salesforceId} = ${value}`)
        }

        mappedData[salesforceId] = value
      } else {
        // Campo sin mapeo específico, usar nombre original
        mappedData[fieldName] = value
        this.logger?.debug(`📝 Campo sin mapeo: ${fieldName} = ${value}`)
      }
    })

    // Agregar campos obligatorios de Salesforce
    this._addRequiredSalesforceFields(mappedData, isTestMode)

    this.logger?.info(`✅ Datos mapeados: ${Object.keys(mappedData).length} campos`)
    return mappedData
  }

  /**
   * Enviar formulario a Salesforce
   * @param {Object} formData - Datos del formulario sin mapear
   * @returns {Promise<Object>} - Resultado del envío
   */
  async submitToSalesforce(formData) {
    try {
      // Iniciar proceso de envío en store
      this.submissionStore.getState().startSubmission()

      // Mapear datos
      const mappedData = this.mapFormDataToSalesforce(formData)
      this.submissionStore.getState().setPreparedData(mappedData)

      // Verificar modo de desarrollo
      const isDevelopmentMode = this.systemStore.getState().isDevelopmentMode()
      if (isDevelopmentMode) {
        this.logger?.warn('🚫 MODO DESARROLLO: Simulando envío (no se envía realmente)')
        this._simulateSubmission(mappedData)
        return { success: true, mode: 'development', data: mappedData }
      }

      // Obtener URL de Salesforce
      const salesforceUrl = this.getSalesforceUrl()

      // Configurar timeout
      const timeoutConfig = this.submissionStore.getState().submissionConfig
      this.submissionStore.getState().setSubmissionConfig({ url: salesforceUrl })

      this.logger?.info(`🚀 Enviando formulario a: ${salesforceUrl}`)

      // Crear formulario temporal para envío
      const result = await this._submitFormToSalesforce(mappedData, salesforceUrl)

      // Completar envío exitoso
      this.submissionStore.getState().completeSubmission('Formulario enviado exitosamente a Salesforce')

      this.logger?.info('✅ Formulario enviado exitosamente a Salesforce')
      return result
    } catch (error) {
      // Fallar envío
      this.submissionStore.getState().failSubmission(error.message)

      this.logger?.error('❌ Error enviando formulario a Salesforce:', error)
      throw error
    }
  }

  /**
   * Obtener estadísticas de envío
   * @returns {Object} - Estadísticas
   */
  getSubmissionStats() {
    const store = this.submissionStore.getState()
    return {
      totalSubmissions: store.getSubmissionCount(),
      successfulSubmissions: store.getSuccessfulSubmissions().length,
      failedSubmissions: store.getFailedSubmissions().length,
      lastSubmission: store.getLastSubmission(),
      isCurrentlySubmitting: store.isSubmitting()
    }
  }

  // Métodos privados

  /**
   * Agregar campos obligatorios de Salesforce
   * @private
   */
  _addRequiredSalesforceFields(mappedData, isTestMode) {
    const { FIELD_MAPPING } = Constants
    const config = this.systemStore.getState().config

    // OID (Organization ID) - CRÍTICO
    const oidField = isTestMode ? FIELD_MAPPING.OID.id.test : FIELD_MAPPING.OID.id.prod
    mappedData[oidField] = isTestMode ? '00D7j0000004eQD' : '00Df4000003l8Bf'

    // URL de retorno
    if (config.retUrl && FIELD_MAPPING.RET_URL) {
      mappedData[FIELD_MAPPING.RET_URL.field] = config.retUrl
    }

    // Campos de debug
    if (this.systemStore.getState().isDebugMode()) {
      if (FIELD_MAPPING.DEBUG && FIELD_MAPPING.DEBUG_EMAIL) {
        mappedData[FIELD_MAPPING.DEBUG.field] = '1'
        mappedData[FIELD_MAPPING.DEBUG_EMAIL.field] = config.debugEmail || ''
      }
    }

    this.logger?.debug('🔧 Campos obligatorios de Salesforce agregados')
  }

  /**
   * Simular envío en modo desarrollo
   * @private
   */
  _simulateSubmission(mappedData) {
    // Simular delay
    setTimeout(() => {
      this.submissionStore.getState().completeSubmission('Envío simulado en modo desarrollo')
      this.logger?.info('✅ Envío simulado completado')
    }, 1000)
  }

  /**
   * Enviar formulario real a Salesforce usando formulario temporal
   * @private
   */
  async _submitFormToSalesforce(mappedData, salesforceUrl) {
    return new Promise((resolve, reject) => {
      try {
        // Crear formulario temporal
        const tempForm = document.createElement('form')
        tempForm.method = 'POST'
        tempForm.action = salesforceUrl
        tempForm.style.display = 'none'
        tempForm.target = '_blank' // Abrir en nueva ventana para evitar redirigir

        // Agregar todos los campos como inputs hidden
        Object.entries(mappedData).forEach(([key, value]) => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = value || ''
          tempForm.appendChild(input)
        })

        // Event listeners para capturar resultado
        let submitted = false

        const handleSubmit = () => {
          if (!submitted) {
            submitted = true
            // Cleanup
            setTimeout(() => {
              if (document.body.contains(tempForm)) {
                document.body.removeChild(tempForm)
              }
            }, 1000)

            resolve({
              success: true,
              url: salesforceUrl,
              timestamp: new Date().toISOString(),
              fieldsCount: Object.keys(mappedData).length
            })
          }
        }

        // Agregar al DOM y enviar
        document.body.appendChild(tempForm)

        // Setup timeout
        const timeout = setTimeout(() => {
          if (!submitted) {
            submitted = true
            document.body.removeChild(tempForm)
            reject(new Error('Timeout: El envío a Salesforce excedió el tiempo límite'))
          }
        }, 30000) // 30 segundos timeout

        // Enviar formulario
        tempForm.addEventListener('submit', handleSubmit)
        tempForm.submit()

        // Asumir éxito después de un corto delay (ya que Salesforce redirige)
        setTimeout(() => {
          clearTimeout(timeout)
          handleSubmit()
        }, 2000)
      } catch (error) {
        reject(error)
      }
    })
  }
}
