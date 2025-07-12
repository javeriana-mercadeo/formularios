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
import { Constants } from "./Constants.js";

export class ValidationModule {
  // Tipos de validación disponibles
  static VALIDATION_TYPES = {
    REQUIRED: "required",
    NAME: "name",
    NAME_LENGTH: "name_length",
    NAME_FORMAT: "name_format",
    EMAIL: "email",
    PHONE: "phone",
    PHONE_LENGTH: "phone_length",
    PHONE_FORMAT: "phone_format",
    DOCUMENT: "document",
    DOCUMENT_LENGTH: "document_length",
    DOCUMENT_FORMAT: "document_format",
  };

  // Patrones de validación granulares
  static VALIDATION_PATTERNS = {
    // Nombres - formato y longitud separados
    NAME_FORMAT: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, // Solo letras y espacios
    NAME_LENGTH: /^.{2,}$/, // Mínimo 2 caracteres

    // Email - validación completa
    EMAIL:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

    // Teléfono - formato y longitud separados
    PHONE_FORMAT: /^\d+$/, // Solo números
    PHONE_LENGTH: /^.{7,}$/, // Mínimo 7 caracteres

    // Documento - formato alfanumérico internacional (sin símbolos de formateo)
    DOCUMENT_FORMAT: /^[A-Za-z0-9]+$/, // Solo letras y números
    DOCUMENT_LENGTH: /^.{6,18}$/, // Entre 6 y 18 caracteres
  };

  // Mensajes de error específicos y granulares
  static ERROR_MESSAGES = {
    REQUIRED: "Este campo es obligatorio",

    // Nombres
    NAME_LENGTH: "El nombre debe tener al menos 2 caracteres",
    NAME_FORMAT: "El nombre solo puede contener letras y espacios",

    // Email
    EMAIL: "Ingrese un correo electrónico válido",

    // Teléfono
    PHONE_LENGTH: "El teléfono debe tener al menos 7 dígitos",
    PHONE_FORMAT: "El teléfono solo puede contener números",

    // Documento
    DOCUMENT_LENGTH: "El documento debe tener entre 6 y 18 caracteres",
    DOCUMENT_FORMAT:
      "El documento solo puede contener letras y números (sin puntos, guiones ni espacios)",

    AUTHORIZATION:
      "La Pontificia Universidad Javeriana requiere de tu autorización para el tratamiento de tus datos personales para continuar con el presente proceso, sin la autorización legalmente no podemos darte continuidad al mismo.",
  };

  constructor(config = {}, selector) {
    // Store any custom configuration
    this.config = config;

    // Mapeo de campos a múltiples reglas de validación (en orden de ejecución)
    this.fieldValidationMap = {
      // Campos con validaciones granulares
      [Constants.FIELD_NAMES.PERSONAL.FIRST_NAME]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
        ValidationModule.VALIDATION_TYPES.NAME_LENGTH,
        ValidationModule.VALIDATION_TYPES.NAME_FORMAT,
      ],
      [Constants.FIELD_NAMES.PERSONAL.LAST_NAME]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
        ValidationModule.VALIDATION_TYPES.NAME_LENGTH,
        ValidationModule.VALIDATION_TYPES.NAME_FORMAT,
      ],
      [Constants.FIELD_NAMES.PERSONAL.EMAIL]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
        ValidationModule.VALIDATION_TYPES.EMAIL,
      ],
      [Constants.FIELD_NAMES.PERSONAL.PHONE]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
        ValidationModule.VALIDATION_TYPES.PHONE_LENGTH,
        ValidationModule.VALIDATION_TYPES.PHONE_FORMAT,
      ],
      [Constants.FIELD_NAMES.PERSONAL.DOCUMENT]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
        ValidationModule.VALIDATION_TYPES.DOCUMENT_FORMAT,
        ValidationModule.VALIDATION_TYPES.DOCUMENT_LENGTH,
      ],

      // Campos solo requeridos
      [Constants.FIELD_NAMES.PERSONAL.TYPE_DOC]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.PERSONAL.PHONE_CODE]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.LOCATION.COUNTRY]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.LOCATION.DEPARTMENT]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.LOCATION.CITY]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.EVENT.TYPE_ATTENDEE]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.EVENT.ATTENDANCE_DAY]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.ACADEMIC.FACULTY]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.ACADEMIC.PROGRAM]: [ValidationModule.VALIDATION_TYPES.REQUIRED],
      [Constants.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD]: [
        ValidationModule.VALIDATION_TYPES.REQUIRED,
      ],
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
   * Validar nombre con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateName(value) {
    if (!value) return { isValid: false, error: ValidationModule.ERROR_MESSAGES.REQUIRED };

    const trimmedValue = value.trim();

    // Primero validar longitud
    if (!ValidationModule.VALIDATION_PATTERNS.NAME_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.NAME_LENGTH };
    }

    // Luego validar formato
    if (!ValidationModule.VALIDATION_PATTERNS.NAME_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.NAME_FORMAT };
    }

    return { isValid: true };
  }

  /**
   * Validar email
   * @param {string} value - Email a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateEmail(value) {
    if (!value) return { isValid: false, error: ValidationModule.ERROR_MESSAGES.REQUIRED };

    const trimmedValue = value.trim().toLowerCase();

    if (!ValidationModule.VALIDATION_PATTERNS.EMAIL.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.EMAIL };
    }

    return { isValid: true };
  }

  /**
   * Validar teléfono con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validatePhone(value) {
    if (!value) return { isValid: false, error: ValidationModule.ERROR_MESSAGES.REQUIRED };

    const trimmedValue = value.trim();

    // Primero validar longitud
    if (!ValidationModule.VALIDATION_PATTERNS.PHONE_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.PHONE_LENGTH };
    }

    // Luego validar formato
    if (!ValidationModule.VALIDATION_PATTERNS.PHONE_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.PHONE_FORMAT };
    }

    return { isValid: true };
  }

  /**
   * Validar documento con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateDocument(value) {
    if (!value) return { isValid: false, error: ValidationModule.ERROR_MESSAGES.REQUIRED };

    const trimmedValue = value.trim();

    // Primero validar formato (solo números)
    if (!ValidationModule.VALIDATION_PATTERNS.DOCUMENT_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.DOCUMENT_FORMAT };
    }

    // Luego validar longitud
    if (!ValidationModule.VALIDATION_PATTERNS.DOCUMENT_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: ValidationModule.ERROR_MESSAGES.DOCUMENT_LENGTH };
    }

    return { isValid: true };
  }

  /**
   * Ejecutar validación específica por tipo
   * @param {string} validationType - Tipo de validación a ejecutar
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  executeValidation(validationType, value) {
    switch (validationType) {
      case ValidationModule.VALIDATION_TYPES.REQUIRED:
        return this.validateRequired(value)
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.REQUIRED };

      case ValidationModule.VALIDATION_TYPES.NAME_LENGTH:
        return ValidationModule.VALIDATION_PATTERNS.NAME_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.NAME_LENGTH };

      case ValidationModule.VALIDATION_TYPES.NAME_FORMAT:
        return ValidationModule.VALIDATION_PATTERNS.NAME_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.NAME_FORMAT };

      case ValidationModule.VALIDATION_TYPES.EMAIL:
        return ValidationModule.VALIDATION_PATTERNS.EMAIL.test(value?.trim().toLowerCase() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.EMAIL };

      case ValidationModule.VALIDATION_TYPES.PHONE_LENGTH:
        return ValidationModule.VALIDATION_PATTERNS.PHONE_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.PHONE_LENGTH };

      case ValidationModule.VALIDATION_TYPES.PHONE_FORMAT:
        return ValidationModule.VALIDATION_PATTERNS.PHONE_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.PHONE_FORMAT };

      case ValidationModule.VALIDATION_TYPES.DOCUMENT_FORMAT:
        return ValidationModule.VALIDATION_PATTERNS.DOCUMENT_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.DOCUMENT_FORMAT };

      case ValidationModule.VALIDATION_TYPES.DOCUMENT_LENGTH:
        return ValidationModule.VALIDATION_PATTERNS.DOCUMENT_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: ValidationModule.ERROR_MESSAGES.DOCUMENT_LENGTH };

      default:
        return { isValid: true };
    }
  }

  /**
   * Validar un campo con múltiples reglas de validación
   * @param {string} fieldName - Nombre del campo
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateFieldWithRules(fieldName, value) {
    const validationRules = this.fieldValidationMap[fieldName];

    if (!validationRules || validationRules.length === 0) {
      return { isValid: true };
    }

    // Ejecutar validaciones en orden hasta encontrar un error
    for (const validationType of validationRules) {
      const result = this.executeValidation(validationType, value);
      if (!result.isValid) {
        return result; // Retorna el primer error encontrado
      }
    }

    return { isValid: true };
  }

  /**
   * Validar un campo individual del formulario
   * @param {HTMLElement} fieldElement - Elemento del campo a validar
   * @returns {boolean} - True si el campo es válido
   */
  validateField(fieldElement) {
    const fieldId = fieldElement.id || fieldElement.getAttribute("data-puj-form");
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
    const fieldId = fieldElement.id || fieldElement.getAttribute("data-puj-form");
    const validationType = this.fieldValidationMap[fieldId];

    if (!validationType) {
      return ValidationModule.ERROR_MESSAGES.REQUIRED;
    }

    return (
      ValidationModule.ERROR_MESSAGES[validationType] || ValidationModule.ERROR_MESSAGES.REQUIRED
    );
  }

  /**
   * Validar múltiples campos
   */
  validateFields(fields) {
    const results = {};

    fields.forEach((field) => {
      const fieldElement =
        typeof field === "string"
          ? document.getElementById(field) || document.querySelector(`[data-puj-form="${field}"]`)
          : field;

      if (fieldElement) {
        const fieldId = fieldElement.id || fieldElement.getAttribute("data-puj-form");
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
      const fieldId = field.id || field.getAttribute("data-puj-form");

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
    if (formData[Constants.FIELD_NAMES.LOCATION.COUNTRY] === "COL") {
      const departmentElement = formElement.querySelector('[data-puj-form="field-department"]');
      const cityElement = formElement.querySelector('[data-puj-form="field-city"]');

      if (departmentElement && departmentElement.style.display !== "none") {
        if (!this.validateRequired(departmentElement.value)) {
          results.isValid = false;
          results.errors.department = ValidationModule.ERROR_MESSAGES.REQUIRED;
        }
      }

      if (cityElement && cityElement.style.display !== "none") {
        if (!this.validateRequired(cityElement.value)) {
          results.isValid = false;
          results.errors.city = ValidationModule.ERROR_MESSAGES.REQUIRED;
        }
      }
    }

    // Validar campos académicos si el tipo de asistente es "Aspirante"
    if (formData[Constants.FIELD_NAMES.EVENT.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        Constants.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL,
        Constants.FIELD_NAMES.ACADEMIC.FACULTY,
        Constants.FIELD_NAMES.ACADEMIC.PROGRAM,
        Constants.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD,
      ];

      academicFields.forEach((fieldId) => {
        const element = formElement.querySelector(
          `[data-puj-form="field-${fieldId.replace("_", "-")}"]`
        );

        if (element && element.style.display !== "none") {
          if (!this.validateRequired(element.value)) {
            results.isValid = false;
            results.errors[fieldId] = ValidationModule.ERROR_MESSAGES.REQUIRED;
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
      results.errors[Constants.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION] =
        ValidationModule.ERROR_MESSAGES.AUTHORIZATION;
      results.invalidFields.push(Constants.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION);
    }

    return results;
  }

  /**
   * Limpiar errores de un campo
   */
  clearFieldError(fieldId) {
    // Este método será usado por el UI para limpiar errores visuales
    // La implementación específica dependerá del sistema de UI
    Logger.info(`Limpiando error para campo: ${fieldId}`);
  }

  /**
   * Mostrar error de un campo
   */
  showFieldError(fieldId, message) {
    // Este método será usado por el UI para mostrar errores visuales
    // La implementación específica dependerá del sistema de UI
    Logger.info(`Mostrando error para campo ${fieldId}: ${message}`);
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
      Constants.FIELD_NAMES.PERSONAL.FIRST_NAME,
      Constants.FIELD_NAMES.PERSONAL.LAST_NAME,
      Constants.FIELD_NAMES.PERSONAL.TYPE_DOC,
      Constants.FIELD_NAMES.PERSONAL.DOCUMENT,
      Constants.FIELD_NAMES.PERSONAL.EMAIL,
      Constants.FIELD_NAMES.PERSONAL.PHONE_CODE,
      Constants.FIELD_NAMES.PERSONAL.PHONE,
      Constants.FIELD_NAMES.LOCATION.COUNTRY,
    ];

    requiredFields.forEach((fieldId) => {
      const value = formData[fieldId];
      const validationType = this.fieldValidationMap[fieldId];

      if (!this.validateValue(value, validationType)) {
        results.isValid = false;
        results.errors[fieldId] =
          this.config.errorMessages[validationType] || ValidationModule.ERROR_MESSAGES.REQUIRED;
      }
    });

    // Validar campos condicionales
    if (formData[Constants.FIELD_NAMES.LOCATION.COUNTRY] === "COL") {
      if (!this.validateRequired(formData[Constants.FIELD_NAMES.LOCATION.DEPARTMENT])) {
        results.isValid = false;
        results.errors[Constants.FIELD_NAMES.LOCATION.DEPARTMENT] =
          ValidationModule.ERROR_MESSAGES.REQUIRED;
      }

      if (!this.validateRequired(formData[Constants.FIELD_NAMES.LOCATION.CITY])) {
        results.isValid = false;
        results.errors[Constants.FIELD_NAMES.LOCATION.CITY] =
          ValidationModule.ERROR_MESSAGES.REQUIRED;
      }
    }

    // Validar campos académicos si es aspirante
    if (formData[Constants.FIELD_NAMES.EVENT.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        Constants.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL,
        Constants.FIELD_NAMES.ACADEMIC.FACULTY,
        Constants.FIELD_NAMES.ACADEMIC.PROGRAM,
        Constants.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD,
      ];

      academicFields.forEach((fieldId) => {
        if (!this.validateRequired(formData[fieldId])) {
          results.isValid = false;
          results.errors[fieldId] = ValidationModule.ERROR_MESSAGES.REQUIRED;
        }
      });
    }

    // Validar autorización
    const authField = Constants.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION;
    if (!formData[authField] || formData[authField] !== "1") {
      results.isValid = false;
      results.errors[authField] = ValidationModule.ERROR_MESSAGES.AUTHORIZATION;
    }

    return results;
  }
}
