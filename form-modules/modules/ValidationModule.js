/**
 * ValidationModule - Módulo centralizado de validación de formularios
 * 
 * Responsabilidades:
 * - Definir reglas de validación para diferentes tipos de campos
 * - Validar campos individuales y formularios completos
 * - Gestionar mensajes de error personalizables
 * - Manejar validación condicional según el contexto
 * 
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class ValidationModule {
  // Constantes para tipos de validación
  static VALIDATION_TYPES = {
    REQUIRED: "required",
    NAME: "name",
    EMAIL: "email",
    PHONE: "phone",
    DOCUMENT: "document"
  };

  // Constantes para nombres de campos
  static FIELD_NAMES = {
    PERSONAL: {
      FIRST_NAME: "first_name",
      LAST_NAME: "last_name",
      EMAIL: "email",
      PHONE: "phone",
      DOCUMENT: "document",
      TYPE_DOC: "type_doc",
      PHONE_CODE: "phone_code"
    },
    LOCATION: {
      COUNTRY: "country",
      DEPARTMENT: "department",
      CITY: "city"
    },
    EVENT: {
      TYPE_ATTENDEE: "type_attendee",
      ATTENDANCE_DAY: "attendance_day"
    },
    ACADEMIC: {
      ACADEMIC_LEVEL: "academic_level",
      FACULTY: "faculty",
      PROGRAM: "program",
      ADMISSION_PERIOD: "admission_period"
    },
    AUTHORIZATION: {
      DATA_AUTHORIZATION: "authorization_data"
    }
  };

  // Constantes para patrones de validación
  static VALIDATION_PATTERNS = {
    NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PHONE: /^[\d\s\-\+\(\)]+$/,
    DOCUMENT: /^\d{6,12}$/
  };

  // Constantes de configuración por defecto
  static DEFAULT_CONFIG = {
    MIN_NAME_LENGTH: 2,
    MIN_PHONE_LENGTH: 7,
    MIN_DOCUMENT_LENGTH: 6,
    MAX_DOCUMENT_LENGTH: 12
  };

  // Constantes para mensajes de error
  static ERROR_MESSAGES = {
    REQUIRED: "Este campo es obligatorio",
    NAME: "Mínimo 2 caracteres, solo letras",
    EMAIL: "Ingrese un correo electrónico válido",
    PHONE: "Número de teléfono válido (mínimo 7 dígitos)",
    DOCUMENT: "Solo números, entre 6 y 12 dígitos",
    AUTHORIZATION: "Debe autorizar el tratamiento de datos personales"
  };

  constructor(config = {}, loggerConfig = {}) {
    this.config = {
      // Configuración de validación
      minNameLength: ValidationModule.DEFAULT_CONFIG.MIN_NAME_LENGTH,
      minPhoneLength: ValidationModule.DEFAULT_CONFIG.MIN_PHONE_LENGTH,
      minDocumentLength: ValidationModule.DEFAULT_CONFIG.MIN_DOCUMENT_LENGTH,
      maxDocumentLength: ValidationModule.DEFAULT_CONFIG.MAX_DOCUMENT_LENGTH,

      // Patrones de validación
      patterns: {
        name: ValidationModule.VALIDATION_PATTERNS.NAME,
        email: ValidationModule.VALIDATION_PATTERNS.EMAIL,
        phone: ValidationModule.VALIDATION_PATTERNS.PHONE,
        document: ValidationModule.VALIDATION_PATTERNS.DOCUMENT,
      },

      // Mensajes de error personalizables
      errorMessages: {
        required: ValidationModule.ERROR_MESSAGES.REQUIRED,
        name: ValidationModule.ERROR_MESSAGES.NAME,
        email: ValidationModule.ERROR_MESSAGES.EMAIL,
        phone: ValidationModule.ERROR_MESSAGES.PHONE,
        document: ValidationModule.ERROR_MESSAGES.DOCUMENT,
        authorization: ValidationModule.ERROR_MESSAGES.AUTHORIZATION,
      },

      ...config,
    };

    this.logger = new Logger("ValidationModule", loggerConfig);

    // Mapeo de tipos de campo a reglas de validación
    this.fieldValidationMap = {
      [ValidationModule.FIELD_NAMES.PERSONAL.FIRST_NAME]: ValidationModule.VALIDATION_TYPES.NAME,
      [ValidationModule.FIELD_NAMES.PERSONAL.LAST_NAME]: ValidationModule.VALIDATION_TYPES.NAME,
      [ValidationModule.FIELD_NAMES.PERSONAL.EMAIL]: ValidationModule.VALIDATION_TYPES.EMAIL,
      [ValidationModule.FIELD_NAMES.PERSONAL.PHONE]: ValidationModule.VALIDATION_TYPES.PHONE,
      [ValidationModule.FIELD_NAMES.PERSONAL.DOCUMENT]: ValidationModule.VALIDATION_TYPES.DOCUMENT,
      [ValidationModule.FIELD_NAMES.PERSONAL.TYPE_DOC]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.PERSONAL.PHONE_CODE]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.LOCATION.COUNTRY]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.LOCATION.DEPARTMENT]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.LOCATION.CITY]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.EVENT.TYPE_ATTENDEE]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.EVENT.ATTENDANCE_DAY]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.ACADEMIC.FACULTY]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.ACADEMIC.PROGRAM]: ValidationModule.VALIDATION_TYPES.REQUIRED,
      [ValidationModule.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD]: ValidationModule.VALIDATION_TYPES.REQUIRED,
    };
  }

  /**
   * Validar que un campo requerido tenga valor
   * @param {string} value - Valor a validar
   * @returns {boolean} - True si el valor es válido
   */
  validateRequired(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Validar formato de nombre (solo letras, espacios y acentos)
   * @param {string} value - Nombre a validar
   * @returns {boolean} - True si el formato es válido
   */
  validateName(value) {
    if (!value || value.trim().length < this.config.minNameLength) {
      return false;
    }
    return this.config.patterns.name.test(value.trim());
  }

  /**
   * Validar formato de correo electrónico
   * @param {string} value - Email a validar
   * @returns {boolean} - True si el email es válido
   */
  validateEmail(value) {
    if (!value) return false;
    return this.config.patterns.email.test(value.trim().toLowerCase());
  }

  /**
   * Validar formato de número telefónico
   * @param {string} value - Número a validar
   * @returns {boolean} - True si el teléfono es válido
   */
  validatePhone(value) {
    if (!value || value.trim().length < this.config.minPhoneLength) {
      return false;
    }
    return this.config.patterns.phone.test(value.trim());
  }

  /**
   * Validar formato de documento de identidad
   * @param {string} value - Documento a validar
   * @returns {boolean} - True si el documento es válido
   */
  validateDocument(value) {
    if (!value) return false;
    return this.config.patterns.document.test(value.trim());
  }

  /**
   * Validar un campo individual del formulario
   * @param {HTMLElement} fieldElement - Elemento del campo a validar
   * @returns {boolean} - True si el campo es válido
   */
  validateField(fieldElement) {
    const fieldId = fieldElement.id || fieldElement.getAttribute('data-puj-form');
    const value = fieldElement.value;

    // Obtener tipo de validación
    const validationType = this.fieldValidationMap[fieldId];

    if (!validationType) {
      // Si no hay mapeo específico, verificar si es requerido
      if (fieldElement.hasAttribute("required")) {
        return this.validateRequired(value);
      }
      return true;
    }

    // Aplicar validación según el tipo
    switch (validationType) {
      case ValidationModule.VALIDATION_TYPES.NAME:
        return this.validateName(value);
      case ValidationModule.VALIDATION_TYPES.EMAIL:
        return this.validateEmail(value);
      case ValidationModule.VALIDATION_TYPES.PHONE:
        return this.validatePhone(value);
      case ValidationModule.VALIDATION_TYPES.DOCUMENT:
        return this.validateDocument(value);
      case ValidationModule.VALIDATION_TYPES.REQUIRED:
        return this.validateRequired(value);
      default:
        return true;
    }
  }

  /**
   * Obtener el mensaje de error apropiado para un campo
   * @param {HTMLElement} fieldElement - Elemento del campo
   * @returns {string} - Mensaje de error correspondiente
   */
  getErrorMessage(fieldElement) {
    const fieldId = fieldElement.id || fieldElement.getAttribute('data-puj-form');
    const validationType = this.fieldValidationMap[fieldId];

    if (!validationType) {
      return this.config.errorMessages.required;
    }

    return this.config.errorMessages[validationType] || this.config.errorMessages.required;
  }

  /**
   * Validar múltiples campos
   */
  validateFields(fields) {
    const results = {};

    fields.forEach((field) => {
      const fieldElement = typeof field === "string" 
        ? document.getElementById(field) || document.querySelector(`[data-puj-form="${field}"]`)
        : field;

      if (fieldElement) {
        const fieldId = fieldElement.id || fieldElement.getAttribute('data-puj-form');
        results[fieldId] = this.validateField(fieldElement);
      }
    });

    return results;
  }

  /**
   * Validar formulario completo
   */
  validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll("[required]");
    const results = {
      isValid: true,
      errors: {},
      validFields: [],
      invalidFields: [],
    };

    requiredFields.forEach((field) => {
      const isValid = this.validateField(field);
      const fieldId = field.id || field.getAttribute('data-puj-form');

      if (isValid) {
        results.validFields.push(fieldId);
      } else {
        results.invalidFields.push(fieldId);
        results.errors[fieldId] = this.getErrorMessage(field);
        results.isValid = false;
      }
    });

    return results;
  }

  /**
   * Validar autorización de datos
   */
  validateAuthorization(formElement) {
    const authRadios = formElement.querySelectorAll('input[type="radio"][name*="authorization"]');

    for (let radio of authRadios) {
      if (radio.checked && radio.value === "1") {
        return true;
      }
    }

    return false;
  }

  /**
   * Validar campos condicionales (departamento y ciudad para Colombia)
   */
  validateConditionalFields(formElement, formData) {
    const results = {
      isValid: true,
      errors: {},
    };

    // Validar departamento y ciudad si el país es Colombia
    if (formData[ValidationModule.FIELD_NAMES.LOCATION.COUNTRY] === "COL") {
      const departmentElement = formElement.querySelector('[data-puj-form="field-department"]');
      const cityElement = formElement.querySelector('[data-puj-form="field-city"]');

      if (departmentElement && departmentElement.style.display !== "none") {
        if (!this.validateRequired(departmentElement.value)) {
          results.isValid = false;
          results.errors.department = this.config.errorMessages.required;
        }
      }

      if (cityElement && cityElement.style.display !== "none") {
        if (!this.validateRequired(cityElement.value)) {
          results.isValid = false;
          results.errors.city = this.config.errorMessages.required;
        }
      }
    }

    // Validar campos académicos si el tipo de asistente es "Aspirante"
    if (formData[ValidationModule.FIELD_NAMES.EVENT.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        ValidationModule.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL,
        ValidationModule.FIELD_NAMES.ACADEMIC.FACULTY,
        ValidationModule.FIELD_NAMES.ACADEMIC.PROGRAM,
        ValidationModule.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD
      ];

      academicFields.forEach((fieldId) => {
        const element = formElement.querySelector(`[data-puj-form="field-${fieldId.replace('_', '-')}"]`);

        if (element && element.style.display !== "none") {
          if (!this.validateRequired(element.value)) {
            results.isValid = false;
            results.errors[fieldId] = this.config.errorMessages.required;
          }
        }
      });
    }

    return results;
  }

  /**
   * Validación completa del formulario incluyendo campos condicionales
   */
  validateFullForm(formElement, formData) {
    // Validar campos básicos
    const basicValidation = this.validateForm(formElement);

    // Validar autorización
    const authorizationValid = this.validateAuthorization(formElement);

    // Validar campos condicionales
    const conditionalValidation = this.validateConditionalFields(formElement, formData);

    // Combinar resultados
    const results = {
      isValid: basicValidation.isValid && authorizationValid && conditionalValidation.isValid,
      errors: {
        ...basicValidation.errors,
        ...conditionalValidation.errors,
      },
      validFields: basicValidation.validFields,
      invalidFields: basicValidation.invalidFields,
    };

    // Agregar error de autorización si es necesario
    if (!authorizationValid) {
      results.errors[ValidationModule.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION] = this.config.errorMessages.authorization;
      results.invalidFields.push(ValidationModule.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION);
    }

    return results;
  }

  /**
   * Limpiar errores de un campo
   */
  clearFieldError(fieldId) {
    // Este método será usado por el UI para limpiar errores visuales
    // La implementación específica dependerá del sistema de UI
    this.logger.info(`Limpiando error para campo: ${fieldId}`);
  }

  /**
   * Mostrar error de un campo
   */
  showFieldError(fieldId, message) {
    // Este método será usado por el UI para mostrar errores visuales
    // La implementación específica dependerá del sistema de UI
    this.logger.info(`Mostrando error para campo ${fieldId}: ${message}`);
  }

  /**
   * Actualizar configuración de validación
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Agregar regla de validación personalizada
   */
  addValidationRule(fieldId, validationType, customValidator = null) {
    this.fieldValidationMap[fieldId] = validationType;

    if (customValidator && typeof customValidator === "function") {
      // Agregar validador personalizado
      this[`validate${validationType.charAt(0).toUpperCase() + validationType.slice(1)}`] =
        customValidator;
    }
  }

  /**
   * Agregar mensaje de error personalizado
   */
  addErrorMessage(type, message) {
    this.config.errorMessages[type] = message;
  }

  /**
   * Validar valor individual sin elemento DOM
   */
  validateValue(value, type) {
    switch (type) {
      case ValidationModule.VALIDATION_TYPES.NAME:
        return this.validateName(value);
      case ValidationModule.VALIDATION_TYPES.EMAIL:
        return this.validateEmail(value);
      case ValidationModule.VALIDATION_TYPES.PHONE:
        return this.validatePhone(value);
      case ValidationModule.VALIDATION_TYPES.DOCUMENT:
        return this.validateDocument(value);
      case ValidationModule.VALIDATION_TYPES.REQUIRED:
        return this.validateRequired(value);
      default:
        return true;
    }
  }

  /**
   * Obtener todas las reglas de validación
   */
  getValidationRules() {
    return { ...this.fieldValidationMap };
  }

  /**
   * Obtener todos los mensajes de error
   */
  getErrorMessages() {
    return { ...this.config.errorMessages };
  }

  /**
   * Validar datos del formulario como objeto
   */
  validateFormData(formData) {
    const results = {
      isValid: true,
      errors: {},
    };

    // Validar campos requeridos básicos
    const requiredFields = [
      ValidationModule.FIELD_NAMES.PERSONAL.FIRST_NAME,
      ValidationModule.FIELD_NAMES.PERSONAL.LAST_NAME,
      ValidationModule.FIELD_NAMES.PERSONAL.TYPE_DOC,
      ValidationModule.FIELD_NAMES.PERSONAL.DOCUMENT,
      ValidationModule.FIELD_NAMES.PERSONAL.EMAIL,
      ValidationModule.FIELD_NAMES.PERSONAL.PHONE_CODE,
      ValidationModule.FIELD_NAMES.PERSONAL.PHONE,
      ValidationModule.FIELD_NAMES.LOCATION.COUNTRY,
    ];

    requiredFields.forEach((fieldId) => {
      const value = formData[fieldId];
      const validationType = this.fieldValidationMap[fieldId];

      if (!this.validateValue(value, validationType)) {
        results.isValid = false;
        results.errors[fieldId] =
          this.config.errorMessages[validationType] || this.config.errorMessages.required;
      }
    });

    // Validar campos condicionales
    if (formData[ValidationModule.FIELD_NAMES.LOCATION.COUNTRY] === "COL") {
      if (!this.validateRequired(formData[ValidationModule.FIELD_NAMES.LOCATION.DEPARTMENT])) {
        results.isValid = false;
        results.errors[ValidationModule.FIELD_NAMES.LOCATION.DEPARTMENT] = this.config.errorMessages.required;
      }

      if (!this.validateRequired(formData[ValidationModule.FIELD_NAMES.LOCATION.CITY])) {
        results.isValid = false;
        results.errors[ValidationModule.FIELD_NAMES.LOCATION.CITY] = this.config.errorMessages.required;
      }
    }

    // Validar campos académicos si es aspirante
    if (formData[ValidationModule.FIELD_NAMES.EVENT.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        ValidationModule.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL,
        ValidationModule.FIELD_NAMES.ACADEMIC.FACULTY,
        ValidationModule.FIELD_NAMES.ACADEMIC.PROGRAM,
        ValidationModule.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD
      ];

      academicFields.forEach((fieldId) => {
        if (!this.validateRequired(formData[fieldId])) {
          results.isValid = false;
          results.errors[fieldId] = this.config.errorMessages.required;
        }
      });
    }

    // Validar autorización
    const authField = ValidationModule.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION;
    if (!formData[authField] || formData[authField] !== "1") {
      results.isValid = false;
      results.errors[authField] = this.config.errorMessages.authorization;
    }

    return results;
  }
}
