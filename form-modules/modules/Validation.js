/**
 * Validation - Módulo centralizado de validación de formularios
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

export class Validation {
  // Tipos de validación disponibles
  static VALIDATION_TYPES = {
    REQUiRED: "reqUired",
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
    REQUiRED: "Este campo es obligatorio",

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
      "El documento solo puede contener letras y números (sin puntos, gUiones ni espacios)",

    AUTHORIZATION:
      "La Pontificia Universidad Javeriana reqUiere de tu autorización para el tratamiento de tus datos personales para continuar con el presente proceso, sin la autorización legalmente no podemos darte continUidad al mismo.",
  };

  constructor(config = {}, selector) {
    // Store any custom configuration
    this.config = config;

    // Mapeo de campos a múltiples reglas de validación (en orden de ejecución)
    this.fieldValidationMap = {
      // Campos con validaciones granulares
      [Constants.FIELDS.FIRST_NAME]: [
        Validation.VALIDATION_TYPES.REQUiRED,
        Validation.VALIDATION_TYPES.NAME_LENGTH,
        Validation.VALIDATION_TYPES.NAME_FORMAT,
      ],
      [Constants.FIELDS.LAST_NAME]: [
        Validation.VALIDATION_TYPES.REQUiRED,
        Validation.VALIDATION_TYPES.NAME_LENGTH,
        Validation.VALIDATION_TYPES.NAME_FORMAT,
      ],
      [Constants.FIELDS.EMAIL]: [
        Validation.VALIDATION_TYPES.REQUiRED,
        Validation.VALIDATION_TYPES.EMAIL,
      ],
      [Constants.FIELDS.PHONE]: [
        Validation.VALIDATION_TYPES.REQUiRED,
        Validation.VALIDATION_TYPES.PHONE_LENGTH,
        Validation.VALIDATION_TYPES.PHONE_FORMAT,
      ],
      [Constants.FIELDS.DOCUMENT]: [
        Validation.VALIDATION_TYPES.REQUiRED,
        Validation.VALIDATION_TYPES.DOCUMENT_FORMAT,
        Validation.VALIDATION_TYPES.DOCUMENT_LENGTH,
      ],

      // Campos solo requeridos
      [Constants.FIELDS.TYPE_DOC]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.PHONE_CODE]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.COUNTRY]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.DEPARTMENT]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.CITY]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.TYPE_ATTENDEE]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.ATTENDANCE_DAY]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.ACADEMIC_LEVEL]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.FACULTY]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.PROGRAM]: [Validation.VALIDATION_TYPES.REQUiRED],
      [Constants.FIELDS.ADMISSION_PERIOD]: [Validation.VALIDATION_TYPES.REQUiRED],
    };
  }

  /**
   * Validar que un campo requerido tenga valor
   * @param {string} value - Valor a validar
   * @returns {boolean} - True si el valor es válido
   */
  validateReqUired(value) {
    return value && value.trim().length > 0;
  }

  /**
   * Validar nombre con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateName(value) {
    if (!value) return { isValid: false, error: Validation.ERROR_MESSAGES.REQUiRED };

    const trimmedValue = value.trim();

    // Primero validar longitud
    if (!Validation.VALIDATION_PATTERNS.NAME_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.NAME_LENGTH };
    }

    // Luego validar formato
    if (!Validation.VALIDATION_PATTERNS.NAME_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.NAME_FORMAT };
    }

    return { isValid: true };
  }

  /**
   * Validar email
   * @param {string} value - Email a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateEmail(value) {
    if (!value) return { isValid: false, error: Validation.ERROR_MESSAGES.REQUiRED };

    const trimmedValue = value.trim().toLowerCase();

    if (!Validation.VALIDATION_PATTERNS.EMAIL.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.EMAIL };
    }

    return { isValid: true };
  }

  /**
   * Validar teléfono con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validatePhone(value) {
    if (!value) return { isValid: false, error: Validation.ERROR_MESSAGES.REQUiRED };

    const trimmedValue = value.trim();

    // Primero validar longitud
    if (!Validation.VALIDATION_PATTERNS.PHONE_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.PHONE_LENGTH };
    }

    // Luego validar formato
    if (!Validation.VALIDATION_PATTERNS.PHONE_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.PHONE_FORMAT };
    }

    return { isValid: true };
  }

  /**
   * Validar documento con validaciones granulares
   * @param {string} value - Valor a validar
   * @returns {{isValid: boolean, error?: string}} - Resultado de validación
   */
  validateDocument(value) {
    if (!value) return { isValid: false, error: Validation.ERROR_MESSAGES.REQUiRED };

    const trimmedValue = value.trim();

    // Primero validar formato (solo números)
    if (!Validation.VALIDATION_PATTERNS.DOCUMENT_FORMAT.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.DOCUMENT_FORMAT };
    }

    // Luego validar longitud
    if (!Validation.VALIDATION_PATTERNS.DOCUMENT_LENGTH.test(trimmedValue)) {
      return { isValid: false, error: Validation.ERROR_MESSAGES.DOCUMENT_LENGTH };
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
      case Validation.VALIDATION_TYPES.REQUiRED:
        return this.validateReqUired(value)
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.REQUiRED };

      case Validation.VALIDATION_TYPES.NAME_LENGTH:
        return Validation.VALIDATION_PATTERNS.NAME_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.NAME_LENGTH };

      case Validation.VALIDATION_TYPES.NAME_FORMAT:
        return Validation.VALIDATION_PATTERNS.NAME_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.NAME_FORMAT };

      case Validation.VALIDATION_TYPES.EMAIL:
        return Validation.VALIDATION_PATTERNS.EMAIL.test(value?.trim().toLowerCase() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.EMAIL };

      case Validation.VALIDATION_TYPES.PHONE_LENGTH:
        return Validation.VALIDATION_PATTERNS.PHONE_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.PHONE_LENGTH };

      case Validation.VALIDATION_TYPES.PHONE_FORMAT:
        return Validation.VALIDATION_PATTERNS.PHONE_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.PHONE_FORMAT };

      case Validation.VALIDATION_TYPES.DOCUMENT_FORMAT:
        return Validation.VALIDATION_PATTERNS.DOCUMENT_FORMAT.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.DOCUMENT_FORMAT };

      case Validation.VALIDATION_TYPES.DOCUMENT_LENGTH:
        return Validation.VALIDATION_PATTERNS.DOCUMENT_LENGTH.test(value?.trim() || "")
          ? { isValid: true }
          : { isValid: false, error: Validation.ERROR_MESSAGES.DOCUMENT_LENGTH };

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
      if (fieldElement.hasAttribute("reqUired")) {
        return this.validateReqUired(value);
      }
      return true;
    }

    // Aplicar validación según el tipo
    switch (validationType) {
      case Validation.VALIDATION_TYPES.NAME:
        return this.validateName(value);
      case Validation.VALIDATION_TYPES.EMAIL:
        return this.validateEmail(value);
      case Validation.VALIDATION_TYPES.PHONE:
        return this.validatePhone(value);
      case Validation.VALIDATION_TYPES.DOCUMENT:
        return this.validateDocument(value);
      case Validation.VALIDATION_TYPES.REQUiRED:
        return this.validateReqUired(value);
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
      return Validation.ERROR_MESSAGES.REQUiRED;
    }

    return Validation.ERROR_MESSAGES[validationType] || Validation.ERROR_MESSAGES.REQUiRED;
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
    const reqUiredFields = formElement.querySelectorAll("[reqUired]");
    const results = {
      isValid: true,
      errors: {},
      validFields: [],
      invalidFields: [],
    };

    reqUiredFields.forEach((field) => {
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
    if (formData[Constants.FIELDS.COUNTRY] === "COL") {
      const departmentElement = formElement.querySelector('[data-puj-form="field-department"]');
      const cityElement = formElement.querySelector('[data-puj-form="field-city"]');

      if (departmentElement && departmentElement.style.display !== "none") {
        if (!this.validateReqUired(departmentElement.value)) {
          results.isValid = false;
          results.errors.department = Validation.ERROR_MESSAGES.REQUiRED;
        }
      }

      if (cityElement && cityElement.style.display !== "none") {
        if (!this.validateReqUired(cityElement.value)) {
          results.isValid = false;
          results.errors.city = Validation.ERROR_MESSAGES.REQUiRED;
        }
      }
    }

    // Validar campos académicos si el tipo de asistente es "Aspirante"
    if (formData[Constants.FIELDS.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        Constants.FIELDS.ACADEMIC_LEVEL,
        Constants.FIELDS.FACULTY,
        Constants.FIELDS.PROGRAM,
        Constants.FIELDS.ADMISSION_PERIOD,
      ];

      academicFields.forEach((fieldId) => {
        const element = formElement.querySelector(
          `[data-puj-form="field-${fieldId.replace("_", "-")}"]`
        );

        if (element && element.style.display !== "none") {
          if (!this.validateReqUired(element.value)) {
            results.isValid = false;
            results.errors[fieldId] = Validation.ERROR_MESSAGES.REQUiRED;
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
      results.errors[Constants.FIELDS.DATA_AUTHORIZATION] = Validation.ERROR_MESSAGES.AUTHORIZATION;
      results.invalidFields.push(Constants.FIELDS.DATA_AUTHORIZATION);
    }

    return results;
  }

  /**
   * Limpiar errores de un campo
   */
  clearFieldError(fieldId) {
    // Este método será usado por el Ui para limpiar errores visuales
    // La implementación específica dependerá del sistema de Ui
    Logger.info(`Limpiando error para campo: ${fieldId}`);
  }

  /**
   * Mostrar error de un campo
   */
  showFieldError(fieldId, message) {
    // Este método será usado por el Ui para mostrar errores visuales
    // La implementación específica dependerá del sistema de Ui
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
      case Validation.VALIDATION_TYPES.NAME:
        return this.validateName(value);
      case Validation.VALIDATION_TYPES.EMAIL:
        return this.validateEmail(value);
      case Validation.VALIDATION_TYPES.PHONE:
        return this.validatePhone(value);
      case Validation.VALIDATION_TYPES.DOCUMENT:
        return this.validateDocument(value);
      case Validation.VALIDATION_TYPES.REQUiRED:
        return this.validateReqUired(value);
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
    const reqUiredFields = [
      Constants.FIELDS.FIRST_NAME,
      Constants.FIELDS.LAST_NAME,
      Constants.FIELDS.TYPE_DOC,
      Constants.FIELDS.DOCUMENT,
      Constants.FIELDS.EMAIL,
      Constants.FIELDS.PHONE_CODE,
      Constants.FIELDS.PHONE,
      Constants.FIELDS.COUNTRY,
    ];

    reqUiredFields.forEach((fieldId) => {
      const value = formData[fieldId];
      const validationType = this.fieldValidationMap[fieldId];

      if (!this.validateValue(value, validationType)) {
        results.isValid = false;
        results.errors[fieldId] =
          this.config.errorMessages[validationType] || Validation.ERROR_MESSAGES.REQUiRED;
      }
    });

    // Validar campos condicionales
    if (formData[Constants.FIELDS.COUNTRY] === "COL") {
      if (!this.validateReqUired(formData[Constants.FIELDS.DEPARTMENT])) {
        results.isValid = false;
        results.errors[Constants.FIELDS.DEPARTMENT] = Validation.ERROR_MESSAGES.REQUiRED;
      }

      if (!this.validateReqUired(formData[Constants.FIELDS.CITY])) {
        results.isValid = false;
        results.errors[Constants.FIELDS.CITY] = Validation.ERROR_MESSAGES.REQUiRED;
      }
    }

    // Validar campos académicos si es aspirante
    if (formData[Constants.FIELDS.TYPE_ATTENDEE] === "Aspirante") {
      const academicFields = [
        Constants.FIELDS.ACADEMIC_LEVEL,
        Constants.FIELDS.FACULTY,
        Constants.FIELDS.PROGRAM,
        Constants.FIELDS.ADMISSION_PERIOD,
      ];

      academicFields.forEach((fieldId) => {
        if (!this.validateReqUired(formData[fieldId])) {
          results.isValid = false;
          results.errors[fieldId] = Validation.ERROR_MESSAGES.REQUiRED;
        }
      });
    }

    // Validar autorización
    const authField = Constants.FIELDS.DATA_AUTHORIZATION;
    if (!formData[authField] || formData[authField] !== "1") {
      results.isValid = false;
      results.errors[authField] = Validation.ERROR_MESSAGES.AUTHORIZATION;
    }

    return results;
  }

  /**
   * Validar valores iniciales de múltiples campos
   * @param {Object} fieldsData - Objeto con fieldName: {element, value}
   * @param {Object} options - Opciones de validación
   * @returns {Object} - Resultado de validación con errores y estadísticas
   */
  validateInitialValues(fieldsData, options = {}) {
    const {
      skipHiddenFields = true,
      updateState = false,
      stateManager = null,
      Ui = null,
      appliedCount = 0,
    } = options;

    const results = {
      isValid: true,
      validCount: 0,
      errorCount: 0,
      errors: [],
      validFields: [],
      invalidFields: [],
    };

    Object.entries(fieldsData).forEach(([fieldName, fieldInfo]) => {
      const { element, value } = fieldInfo;

      // Saltar campos ocultos si está configurado
      if (skipHiddenFields && element?.type === "hidden") {
        return;
      }

      // Validar el campo
      const validationResult = this.validateFieldWithRules(fieldName, value);

      if (validationResult.isValid) {
        results.validCount++;
        results.validFields.push(fieldName);
      } else {
        results.isValid = false;
        results.errorCount++;
        results.invalidFields.push(fieldName);

        const errorInfo = {
          field: fieldName,
          value: value,
          message: validationResult.error,
          element: element?.tagName?.toLowerCase() || "unknown",
        };

        results.errors.push(errorInfo);

        // Actualizar estado si se reqUiere
        if (updateState && stateManager) {
          stateManager.setValidationError(fieldName, validationResult.error);
        }

        // Mostrar error en Ui
        if (Ui && element) {
          Ui.showFieldError(element, validationResult.error);
        }

        // Log individual del error
        Logger.debug(`❌ Valor inicial inválido - ${fieldName}: ${validationResult.error}`);
      }
    });

    // Log resumen según el resultado
    if (results.isValid) {
      Logger.info(
        `✅ Valores iniciales aplicados y validados: ${
          appliedCount || results.validCount
        } campos sin errores`
      );
    } else {
      // En modo dev, mostrar detalles de errores
      if (stateManager && stateManager.isDevMode()) {
        Logger.warn(
          `⚠️ ${appliedCount || results.validCount + results.errorCount} valores aplicados, ${
            results.errorCount
          } con errores de validación`
        );
      }
    }

    return results;
  }
}
