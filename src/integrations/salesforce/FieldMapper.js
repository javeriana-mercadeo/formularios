/**
 * FieldMapper - Utilidad para mapeo de campos entre formulario y Salesforce
 * Centraliza la lógica de mapeo y transformación de datos
 * @version 1.0
 */

import { Constants } from '../../core/Constants.js'

export class FieldMapper {
  constructor(logger) {
    this.logger = logger
  }

  /**
   * Obtener ID de campo de Salesforce según el ambiente
   * @param {string} fieldKey - Clave del campo en FIELD_MAPPING
   * @param {boolean} isTestMode - Si está en modo test
   * @returns {string|null} - ID de campo de Salesforce
   */
  getSalesforceFieldId(fieldKey, isTestMode = false) {
    const mapping = Constants.FIELD_MAPPING[fieldKey]
    if (!mapping) {
      this.logger?.warn(`Campo no encontrado en mapeo: ${fieldKey}`)
      return null
    }

    if (typeof mapping.id === 'object' && mapping.id.test && mapping.id.prod) {
      return isTestMode ? mapping.id.test : mapping.id.prod
    } else {
      return mapping.id
    }
  }

  /**
   * Crear mapeo completo de campos del formulario a Salesforce
   * @param {boolean} isTestMode - Si está en modo test
   * @returns {Object} - Mapeo completo de campos
   */
  createFieldMapping(isTestMode = false) {
    const { FIELD_MAPPING } = Constants
    const mapping = {}

    Object.entries(FIELD_MAPPING).forEach(([key, config]) => {
      if (config.field && config.id) {
        let salesforceId

        if (typeof config.id === 'object' && config.id.test && config.id.prod) {
          salesforceId = isTestMode ? config.id.test : config.id.prod
        } else {
          salesforceId = config.id
        }

        mapping[config.field] = {
          salesforceId,
          name: config.name,
          required: config.required || false,
          type: config.type || 'text'
        }
      }
    })

    this.logger?.info(`📋 Mapeo creado para ${isTestMode ? 'TEST' : 'PROD'}: ${Object.keys(mapping).length} campos`)
    return mapping
  }

  /**
   * Transformar datos del formulario según reglas específicas
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Datos transformados
   */
  transformFormData(formData) {
    const transformedData = { ...formData }

    // Transformaciones específicas
    this._transformPhoneData(transformedData)
    this._transformLocationData(transformedData)
    this._transformAcademicData(transformedData)
    this._transformDocumentData(transformedData)

    this.logger?.debug('🔧 Datos transformados según reglas específicas')
    return transformedData
  }

  /**
   * Validar datos antes del mapeo
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Resultado de validación
   */
  validateDataForMapping(formData) {
    const issues = []
    const warnings = []

    // Validar campos críticos
    const criticalFields = ['first_name', 'last_name', 'email', 'type_attendee']
    criticalFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        issues.push(`Campo crítico vacío: ${field}`)
      }
    })

    // Validar email
    if (formData.email && !this._isValidEmail(formData.email)) {
      issues.push('Formato de email inválido')
    }

    // Validar documento
    if (formData.document && formData.document.length < 6) {
      warnings.push('Documento parece muy corto')
    }

    // Validar teléfono
    if (formData.mobile && formData.mobile.replace(/\D/g, '').length < 10) {
      warnings.push('Teléfono móvil parece incompleto')
    }

    // Validar campos condicionales
    if (formData.type_attendee === 'aspirante') {
      const requiredForAspirant = ['academic_level', 'program']
      requiredForAspirant.forEach(field => {
        if (!formData[field]) {
          issues.push(`Campo requerido para aspirante: ${field}`)
        }
      })
    }

    const isValid = issues.length === 0

    if (!isValid) {
      this.logger?.error(`❌ Validación de mapeo falló: ${issues.join(', ')}`)
    }
    if (warnings.length > 0) {
      this.logger?.warn(`⚠️ Advertencias de mapeo: ${warnings.join(', ')}`)
    }

    return { isValid, issues, warnings }
  }

  /**
   * Obtener campos requeridos según configuración
   * @param {Object} formData - Datos del formulario para contexto
   * @returns {Array} - Lista de campos requeridos
   */
  getRequiredFields(formData = {}) {
    const requiredFields = []

    // Campos siempre requeridos
    const alwaysRequired = ['first_name', 'last_name', 'email', 'type_attendee', 'attendance_day', 'authorization_data']
    requiredFields.push(...alwaysRequired)

    // Campos requeridos condicionalmente
    if (formData.type_attendee === 'aspirante') {
      requiredFields.push('academic_level', 'program')
    }

    if (formData.country === 'Colombia') {
      requiredFields.push('department', 'city')
    }

    return requiredFields
  }

  /**
   * Obtener información detallada de un campo
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} isTestMode - Si está en modo test
   * @returns {Object|null} - Información del campo
   */
  getFieldInfo(fieldName, isTestMode = false) {
    const fieldMapping = Object.entries(Constants.FIELD_MAPPING).find(([key, config]) => config.field === fieldName)

    if (!fieldMapping) return null

    const [key, config] = fieldMapping
    let salesforceId = config.id

    if (typeof config.id === 'object' && config.id.test && config.id.prod) {
      salesforceId = isTestMode ? config.id.test : config.id.prod
    }

    return {
      key,
      fieldName: config.field,
      salesforceId,
      name: config.name,
      required: config.required || false,
      type: config.type || 'text',
      description: config.description || ''
    }
  }

  // Métodos privados de transformación

  /**
   * Transformar datos de teléfono
   * @private
   */
  _transformPhoneData(data) {
    // Limpiar teléfono móvil (solo números)
    if (data.mobile) {
      data.mobile = data.mobile.replace(/\D/g, '')
    }

    // Formatear código de teléfono
    if (data.phone_code && !data.phone_code.startsWith('+')) {
      data.phone_code = `+${data.phone_code}`
    }
  }

  /**
   * Transformar datos de ubicación
   * @private
   */
  _transformLocationData(data) {
    // Capitalizar nombres de país, departamento, ciudad
    ;['country', 'department', 'city'].forEach(field => {
      if (data[field]) {
        data[field] = this._capitalizeWords(data[field])
      }
    })
  }

  /**
   * Transformar datos académicos
   * @private
   */
  _transformAcademicData(data) {
    // Si no es aspirante, asegurar que programa sea NOAP
    if (data.type_attendee && data.type_attendee !== 'aspirante') {
      data.program = 'NOAP'
      // Limpiar campos académicos innecesarios
      delete data.academic_level
      delete data.faculty
      delete data.admission_period
    }
  }

  /**
   * Transformar datos de documento
   * @private
   */
  _transformDocumentData(data) {
    // Limpiar número de documento (solo números)
    if (data.document) {
      data.document = data.document.replace(/\D/g, '')
    }
  }

  /**
   * Validar formato de email
   * @private
   */
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  /**
   * Capitalizar palabras
   * @private
   */
  _capitalizeWords(str) {
    return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
  }
}
