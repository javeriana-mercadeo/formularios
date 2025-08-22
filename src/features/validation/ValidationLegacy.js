/**
 * Validation - Módulo simplificado de validación de formularios
 *
 * Responsabilidades:
 * - Validar que todos los campos presentes en el DOM estén completos
 * - Validar autorización de datos
 * - Validar campos condicionales (Colombia, Aspirante)
 * - Gestionar mensajes de error
 *
 * @version 1.0 - Simplificado para validación automática por DOM
 */

import { Constants } from '../../core/Constants.js'

export class Validation {
  // Mensajes de error específicos
  static ERROR_MESSAGES = {
    REQUIRED: 'Este campo es obligatorio',
    EMAIL: 'Ingresa un correo electrónico válido',
    EMAIL_INVALID: 'El formato del correo electrónico no es válido',
    PHONE: 'Ingresa tu número de teléfono',
    PHONE_INVALID: 'El número de teléfono debe contener solo números',
    SELECT: 'Selecciona una opción',
    CHECKBOX: 'Debes marcar esta casilla',
    RADIO: 'Selecciona una opción',
    NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres',
    NAME_INVALID: 'El nombre solo puede contener letras y espacios',
    DOCUMENT_TOO_SHORT: 'El documento debe tener al menos 6 caracteres',
    DOCUMENT_INVALID: 'El documento debe contener solo números',
    AUTHORIZATION:
      'La Pontificia Universidad Javeriana requiere de tu autorización para el tratamiento de tus datos personales para continuar con el presente proceso, sin la autorización legalmente no podemos darte continuidad al mismo.'
  }

  constructor({ logger = null }) {
    this.logger = logger
  }

  /**
   * Validar que todos los campos presentes en el DOM estén completos
   * Detecta automáticamente TODOS los campos de entrada y los trata como requeridos
   * @param {HTMLElement} formElement - Elemento del formulario
   * @returns {Object} Resultado de la validación con campos faltantes
   */
  validateAllRequiredFields(formElement) {
    const missingFields = []

    // Buscar TODOS los campos de entrada en el formulario
    const allFields = formElement.querySelectorAll('input, select, textarea')

    // Filtrar campos que NO deben ser validados usando constantes
    const fieldsToValidate = Array.from(allFields).filter(field => {
      const fieldName = field.name || field.id || 'sin-nombre'

      // Excluir tipos de campos definidos en constantes
      const excludedTypes = Object.values(Constants.EXCLUDED_FIELD_TYPES)
      if (excludedTypes.includes(field.type)) {
        this.logger.debug(`⚪ Campo excluido por tipo (${field.type}): ${fieldName}`)

        return false
      }

      // Excluir campos que no tienen name ni id
      if (!field.name && !field.id) {
        this.logger.debug(`⚪ Campo excluido sin name/id: ${field.tagName}`)

        return false
      }

      // Excluir campos que no están visibles (display: none)
      const computedStyle = window.getComputedStyle(field)
      if (computedStyle.display === 'none') {
        this.logger.debug(`👁️ Campo excluido por visibilidad (display: none): ${fieldName}`)

        return false
      }

      // También verificar si algún elemento padre está oculto
      let parent = field.parentElement
      while (parent && parent !== formElement) {
        const parentStyle = window.getComputedStyle(parent)
        if (parentStyle.display === 'none') {
          this.logger.debug(`👁️ Campo excluido por padre oculto: ${fieldName} (padre: ${parent.tagName})`)

          return false
        }
        parent = parent.parentElement
      }

      return true
    })

    const totalFields = allFields.length
    const visibleFields = fieldsToValidate.length
    const hiddenFields = totalFields - visibleFields

    this.logger.debug(`🔍 Campos en el DOM: ${totalFields} total, ${visibleFields} visibles, ${hiddenFields} ocultos/excluidos`)

    // Validar cada campo presente en el DOM
    fieldsToValidate.forEach(field => {
      const fieldName = field.name || field.id
      const fieldType = field.type
      let isEmpty = false
      let errorMessage = Validation.ERROR_MESSAGES.REQUIRED

      // Validar según el tipo de campo
      if (fieldType === 'radio') {
        // Para radio buttons, verificar si alguno del grupo está seleccionado
        const radioGroup = formElement.querySelectorAll(`input[name="${field.name}"]`)
        const hasSelection = Array.from(radioGroup).some(radio => radio.checked)
        if (!hasSelection) {
          isEmpty = true
          errorMessage = Validation.ERROR_MESSAGES.RADIO
        }
      } else if (fieldType === 'checkbox') {
        // Para checkbox, verificar si está marcado
        isEmpty = !field.checked
        errorMessage = Validation.ERROR_MESSAGES.CHECKBOX
      } else if (field.tagName.toLowerCase() === 'select') {
        // Para select, el valor no debe estar vacío
        const fieldValue = this._getFieldValue(field)
        isEmpty = !fieldValue || fieldValue === ''
        errorMessage = Validation.ERROR_MESSAGES.SELECT
      } else {
        // Para inputs de texto, email, etc.
        const fieldValue = this._getFieldValue(field)
        isEmpty = !fieldValue || fieldValue.trim() === ''

        // Si no está vacío, validar formato específico
        if (!isEmpty) {
          const specificError = this._validateFieldFormat(fieldName, fieldValue, fieldType)
          if (specificError) {
            isEmpty = true // Marcar como "error" para que se agregue a la lista
            errorMessage = specificError
          }
        }

        // Mensaje por defecto si está vacío
        if (isEmpty && !errorMessage) {
          switch (fieldType) {
            case 'email':
              errorMessage = Validation.ERROR_MESSAGES.EMAIL
              break
            case 'tel':
              errorMessage = Validation.ERROR_MESSAGES.PHONE
              break
            default:
              errorMessage = Validation.ERROR_MESSAGES.REQUIRED
          }
        }
      }

      // Log cada campo que se está validando

      this.logger.debug(`🔍 Validando campo: ${fieldName} (${fieldType}) - Vacío: ${isEmpty} - Valor: "${this._getFieldValue(field)}"`)

      // Solo agregar si está vacío y evitar duplicados para radio buttons
      if (isEmpty && !missingFields.some(missing => missing.name === fieldName)) {
        missingFields.push({
          name: fieldName,
          element: field,
          type: fieldType,
          message: errorMessage
        })

        this.logger.debug(`❌ Campo faltante agregado: ${fieldName}`)
      }
    })

    const result = {
      isValid: missingFields.length === 0,
      missingFields: missingFields,
      totalRequired: fieldsToValidate.length,
      missingCount: missingFields.length
    }

    this.logger.debug(
      `📊 Resumen validación: ${result.isValid ? 'VÁLIDO' : 'INVÁLIDO'} - ${result.missingCount}/${result.totalRequired} campos faltantes`
    )

    return result
  }

  /**
   * Validar autorización de datos
   * @param {HTMLElement} formElement - Elemento del formulario
   * @returns {boolean} - True si está autorizado
   */
  validateAuthorization(formElement) {
    const authRadios = formElement.querySelectorAll(Constants.SELECTORS.DATA_AUTHORIZATION)

    for (let radio of authRadios) {
      if (radio.checked && this._getFieldValue(radio) === '1') {
        return true
      }
    }

    return false
  }

  /**
   * Validar campos condicionales (departamento y ciudad para Colombia)
   * @param {HTMLElement} formElement - Elemento del formulario
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Resultado de validación condicional
   */
  validateConditionalFields(formElement, formData) {
    const results = {
      isValid: true,
      errors: {}
    }

    // Validar departamento y ciudad si el país es Colombia Y el campo país fue realmente seleccionado por el usuario
    const countryElement = formElement.querySelector(Constants.SELECTORS.COUNTRY)
    const isCountryReallySelected = countryElement && this._isElementVisible(countryElement) && this._getFieldValue(countryElement)

    if (formData[Constants.FIELDS.COUNTRY] === 'COL' && isCountryReallySelected) {
      const departmentElement = formElement.querySelector(Constants.SELECTORS.DEPARTMENT)
      const cityElement = formElement.querySelector(Constants.SELECTORS.CITY)

      if (departmentElement && this._isElementVisible(departmentElement)) {
        const departmentValue = this._getFieldValue(departmentElement)
        if (!departmentValue || departmentValue.trim() === '') {
          results.isValid = false
          results.errors[Constants.FIELDS.DEPARTMENT] = Validation.ERROR_MESSAGES.SELECT
        }
      }

      if (cityElement && this._isElementVisible(cityElement)) {
        const cityValue = this._getFieldValue(cityElement)
        if (!cityValue || cityValue.trim() === '') {
          results.isValid = false
          results.errors[Constants.FIELDS.CITY] = Validation.ERROR_MESSAGES.SELECT
        }
      }
    }

    // Validar campos académicos si el tipo de asistente es "Aspirante"
    if (formData[Constants.FIELDS.TYPE_ATTENDEE] === Constants.ATTENDEE_TYPES.APPLICANT) {
      const academicFields = [
        { id: Constants.FIELDS.ACADEMIC_LEVEL, selector: Constants.SELECTORS.ACADEMIC_LEVEL },
        { id: Constants.FIELDS.FACULTY, selector: Constants.SELECTORS.FACULTY },
        { id: Constants.FIELDS.PROGRAM, selector: Constants.SELECTORS.PROGRAM },
        { id: Constants.FIELDS.ADMISSION_PERIOD, selector: Constants.SELECTORS.ADMISSION_PERIOD }
      ]

      academicFields.forEach(field => {
        const element = formElement.querySelector(field.selector)

        if (element && this._isElementVisible(element)) {
          const elementValue = this._getFieldValue(element)
          if (!elementValue || elementValue.trim() === '') {
            results.isValid = false
            results.errors[field.id] = Validation.ERROR_MESSAGES.SELECT
          }
        }
      })
    }

    return results
  }

  /**
   * Validación completa del formulario incluyendo campos condicionales
   * @param {HTMLElement} formElement - Elemento del formulario
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Resultado completo de validación
   */
  validateFullForm(formElement, formData) {
    // 1. Validar que todos los campos del DOM estén completos
    const basicValidation = this.validateAllRequiredFields(formElement)

    // 2. Validar autorización
    const authorizationValid = this.validateAuthorization(formElement)

    // 3. Validar campos condicionales
    const conditionalValidation = this.validateConditionalFields(formElement, formData)

    // Combinar resultados
    const results = {
      isValid: basicValidation.isValid && authorizationValid && conditionalValidation.isValid,
      errors: {
        ...conditionalValidation.errors
      },
      missingFields: basicValidation.missingFields,
      totalRequired: basicValidation.totalRequired,
      missingCount: basicValidation.missingCount
    }

    // Agregar errores de campos básicos requeridos faltantes
    basicValidation.missingFields.forEach(fieldInfo => {
      results.errors[fieldInfo.name] = fieldInfo.message
    })

    // Agregar error de autorización si es necesario
    if (!authorizationValid) {
      results.errors[Constants.FIELDS.DATA_AUTHORIZATION] = Validation.ERROR_MESSAGES.AUTHORIZATION
    }

    return results
  }

  /**
   * Validación unificada para el formulario - Simplifica las dos validaciones en una
   * @param {HTMLElement} formElement - Elemento del formulario
   * @param {Object} formData - Datos del formulario
   * @returns {Object} - Resultado completo de validación
   */
  validateFormComplete(formElement, formData) {
    this.logger.debug('🔍 Ejecutando validación completa del formulario...')

    const validationResult = this.validateFullForm(formElement, formData)

    this.logger.debug('📊 Resultado de validación completa:', validationResult)

    if (!validationResult.isValid) {
      this.logger.warn(
        `❌ Formulario inválido: ${validationResult.missingCount} campos faltantes, ${Object.keys(validationResult.errors).length} errores totales`
      )
    } else {
      this.logger.info(`✅ Formulario válido: ${validationResult.totalRequired} campos completados correctamente`)
    }

    return validationResult
  }

  /**
   * Validar valores iniciales de múltiples campos
   * @param {Object} fieldsData - Objeto con fieldName: {element, value}
   * @param {Object} options - Opciones de validación
   * @returns {Object} - Resultado de validación con errores y estadísticas
   */
  validateInitialValues(fieldsData, options = {}) {
    const { skipHiddenFields = true, updateState = false, stateManager = null, Ui = null, appliedCount = 0 } = options

    const results = {
      isValid: true,
      validCount: 0,
      errorCount: 0,
      errors: [],
      validFields: [],
      invalidFields: []
    }

    Object.entries(fieldsData).forEach(([fieldName, fieldInfo]) => {
      const { element, value } = fieldInfo

      // Saltar campos ocultos si está configurado
      if (skipHiddenFields && element?.type === 'hidden') {
        return
      }

      // Para validación inicial, solo verificar si el campo tiene valor
      // (no aplicamos validaciones estrictas en valores iniciales)
      const hasValue = value && value.toString().trim() !== ''

      if (hasValue) {
        results.validCount++
        results.validFields.push(fieldName)
      } else {
        results.errorCount++
        results.invalidFields.push(fieldName)

        const errorInfo = {
          field: fieldName,
          value: value,
          message: 'Campo vacío',
          element: element?.tagName?.toLowerCase() || 'unknown'
        }

        results.errors.push(errorInfo)

        // Actualizar estado si se requiere
        if (updateState && stateManager) {
          stateManager.setValidationError(fieldName, 'Campo vacío')
        }

        // Mostrar error en UI si se requiere
        if (Ui && element) {
          Ui.showFieldError(element, 'Campo vacío')
        }

        this.logger.debug(`❌ Valor inicial vacío - ${fieldName}`)
      }
    })

    // Log resumen según el resultado

    if (results.errorCount === 0) {
      this.logger.info(`✅ Valores iniciales aplicados y validados: ${appliedCount || results.validCount} campos sin errores`)
    } else {
      this.logger.warn(
        `⚠️ ${appliedCount || results.validCount + results.errorCount} valores aplicados, ${results.errorCount} con valores vacíos`
      )
    }

    return results
  }

  /**
   * Obtener todos los mensajes de error
   * @returns {Object} - Mensajes de error disponibles
   */
  getErrorMessages() {
    return { ...Validation.ERROR_MESSAGES }
  }

  // ===============================
  // MÉTODOS HELPER PRIVADOS
  // ===============================

  /**
   * Obtener valor de un campo de forma centralizada
   * @param {HTMLElement} field - Elemento del campo
   * @returns {string} - Valor del campo
   * @private
   */
  _getFieldValue(field) {
    if (!field) return ''
    return field.value || ''
  }

  /**
   * Verificar si un elemento es visible de forma centralizada
   * @param {HTMLElement} element - Elemento a verificar
   * @returns {boolean} - True si el elemento es visible
   * @private
   */
  _isElementVisible(element) {
    if (!element) return false

    const computedStyle = window.getComputedStyle(element)
    return computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && element.offsetParent !== null
  }

  /**
   * Validar formato específico de un campo
   * @param {string} fieldName - Nombre del campo
   * @param {string} value - Valor del campo
   * @param {string} fieldType - Tipo del campo
   * @returns {string|null} - Mensaje de error o null si es válido
   * @private
   */
  _validateFieldFormat(fieldName, value, fieldType) {
    // Validaciones por nombre de campo
    switch (fieldName) {
      case 'first_name':
      case 'last_name':
        return this._validateName(value)

      case 'email':
        return this._validateEmail(value)

      case 'document':
        return this._validateDocument(value)

      case 'mobile':
        return this._validatePhone(value)

      default:
        // Validaciones por tipo de campo
        switch (fieldType) {
          case 'email':
            return this._validateEmail(value)
          case 'tel':
            return this._validatePhone(value)
          default:
            return null // Sin validaciones específicas
        }
    }
  }

  /**
   * Validar nombre (mínimo 2 caracteres, solo letras y espacios)
   * @private
   */
  _validateName(value) {
    if (value.length < 2) {
      return Validation.ERROR_MESSAGES.NAME_TOO_SHORT
    }

    // Solo letras, espacios y acentos
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    if (!nameRegex.test(value)) {
      return Validation.ERROR_MESSAGES.NAME_INVALID
    }

    return null
  }

  /**
   * Validar email
   * @private
   */
  _validateEmail(value) {
    if (!Validation.isValidEmailFormat(value)) {
      return Validation.ERROR_MESSAGES.EMAIL_INVALID
    }
    return null
  }

  /**
   * Validar documento (mínimo 6 caracteres, solo números)
   * @private
   */
  _validateDocument(value) {
    if (value.length < 6) {
      return Validation.ERROR_MESSAGES.DOCUMENT_TOO_SHORT
    }

    // Solo números
    const documentRegex = /^\d+$/
    if (!documentRegex.test(value)) {
      return Validation.ERROR_MESSAGES.DOCUMENT_INVALID
    }

    return null
  }

  /**
   * Validar teléfono (solo números, mínimo 7 dígitos)
   * @private
   */
  _validatePhone(value) {
    // Remover espacios y caracteres especiales
    const cleanValue = value.replace(/[\s\-\(\)]/g, '')

    if (cleanValue.length < 7) {
      return 'El teléfono debe tener al menos 7 dígitos'
    }

    // Solo números
    const phoneRegex = /^\d+$/
    if (!phoneRegex.test(cleanValue)) {
      return Validation.ERROR_MESSAGES.PHONE_INVALID
    }

    return null
  }

  // ===============================
  // MÉTODOS DE LIMPIEZA Y VALIDACIÓN DE FORMATO
  // (Movidos desde UI.js para mejor separación de responsabilidades)
  // ===============================

  /**
   * Limpiar texto para permitir solo letras, espacios y acentos
   * @param {string} text - Texto a limpiar
   * @returns {string} - Texto limpio
   */
  static cleanText(text) {
    if (!text) return ''
    return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')
  }

  /**
   * Limpiar texto para permitir solo números y espacios
   * @param {string} text - Texto a limpiar
   * @returns {string} - Solo números
   */
  static cleanNumbers(text) {
    if (!text) return ''
    return text.replace(/[^0-9 ]/g, '')
  }

  /**
   * Verificar si un email tiene formato válido (versión robusta)
   * @param {string} email - Email a validar
   * @returns {boolean} - True si es válido
   */
  static isValidEmailFormat(email) {
    if (!email) return false
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email.toLowerCase())
  }

  /**
   * Validar y limpiar un campo según su tipo
   * @param {string} value - Valor a validar y limpiar
   * @param {string} type - Tipo de campo ('text', 'number', 'email')
   * @returns {object} - {cleanValue, isValid, error}
   */
  static validateAndCleanField(value, type = 'text') {
    if (!value) {
      return { cleanValue: '', isValid: true, error: null }
    }

    let cleanValue = value
    let isValid = true
    let error = null

    switch (type) {
      case 'text':
      case 'name':
        cleanValue = this.cleanText(value)
        if (cleanValue.length < 2) {
          isValid = false
          error = Validation.ERROR_MESSAGES.NAME_TOO_SHORT
        }
        break

      case 'number':
      case 'document':
        cleanValue = this.cleanNumbers(value)
        if (cleanValue.length < 6 && type === 'document') {
          isValid = false
          error = Validation.ERROR_MESSAGES.DOCUMENT_TOO_SHORT
        }
        break

      case 'email':
        cleanValue = value.trim().toLowerCase()
        if (!this.isValidEmailFormat(cleanValue)) {
          isValid = false
          error = Validation.ERROR_MESSAGES.EMAIL_INVALID
        }
        break

      default:
        cleanValue = value.trim()
    }

    return { cleanValue, isValid, error }
  }

  /**
   * Validar un array de opciones
   * @param {Array} options - Array de opciones a validar
   * @returns {boolean} - True si las opciones son válidas
   */
  static validateOptionsArray(options) {
    if (!Array.isArray(options)) return false
    if (options.length === 0) return false

    return options.every(option => {
      return typeof option === 'string' || (typeof option === 'object' && option.value !== undefined)
    })
  }
}
