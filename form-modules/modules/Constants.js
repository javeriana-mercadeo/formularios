/**
 * Constants - Constantes compartidas del sistema de formularios
 * 
 * Centraliza todas las constantes utilizadas en múltiples módulos
 * para evitar duplicación y facilitar el mantenimiento
 * 
 * @version 1.0
 */

export class Constants {
  // Selectores de campos del formulario
  static INPUT_SELECTORS = {
    PERSONAL: {
      FIRST_NAME: '[name="first_name"]',
      LAST_NAME: '[name="last_name"]',
      TYPE_DOC: '[name="type_doc"]',
      DOCUMENT: '[name="document"]',
      EMAIL: '[name="email"]',
      PHONE_CODE: '[name="phone_code"]',
      PHONE: '[name="phone"]'
    },
    LOCATION: {
      COUNTRY: '[name="country"]',
      DEPARTMENT: '[name="department"]',
      CITY: '[name="city"]'
    },
    EVENT: {
      ATTENDANCE_DAY: '[name="attendance_day"]',
      TYPE_ATTENDEE: '[name="type_attendee"]'
    },
    ACADEMIC: {
      ACADEMIC_LEVEL: '[name="academic_level"]',
      FACULTY: '[name="Facultad"]',
      PROGRAM: '[name="program"]',
      ADMISSION_PERIOD: '[name="admission_period"]'
    },
    FORM_CONTROLS: {
      SUBMIT_BUTTON: '[type="submit"]',
      AUTHORIZATION_DATA: "authorization_data"
    }
  };

  // Nombres de campos para validación y estado
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

  // Valores por defecto del sistema
  static DEFAULT_VALUES = {
    COUNTRY_CODE: "COL",
    PHONE_CODE: "57",
    DEPARTMENT_BOGOTA: "11",
    CITY_BOGOTA: "11001",
    ATTENDEE_TYPE_APPLICANT: "Aspirante"
  };

  // Estados del sistema
  static SYSTEM_STATE = {
    INITIALIZED: "initialized",
    SUBMITTING: "submitting",
    LOADING: "loading"
  };

  // Tipos de validación
  static VALIDATION_TYPES = {
    REQUIRED: "required",
    NAME: "name",
    EMAIL: "email",
    PHONE: "phone",
    DOCUMENT: "document"
  };

  // Patrones de validación
  static VALIDATION_PATTERNS = {
    NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    EMAIL: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PHONE: /^[\d\s\-\+\(\)]+$/,
    DOCUMENT: /^\d{6,12}$/
  };

  // Mensajes de error estándar
  static ERROR_MESSAGES = {
    REQUIRED: "Este campo es obligatorio",
    NAME: "Mínimo 2 caracteres, solo letras",
    EMAIL: "Ingrese un correo electrónico válido",
    PHONE: "Número de teléfono válido (mínimo 7 dígitos)",
    DOCUMENT: "Solo números, entre 6 y 12 dígitos",
    AUTHORIZATION: "Debe autorizar el tratamiento de datos personales"
  };

  // Configuración por defecto de validación
  static VALIDATION_CONFIG = {
    MIN_NAME_LENGTH: 2,
    MIN_PHONE_LENGTH: 7,
    MIN_DOCUMENT_LENGTH: 6,
    MAX_DOCUMENT_LENGTH: 12
  };

  // Clases CSS estándar
  static CSS_CLASSES = {
    ERROR: "error",
    VALID: "validated",
    ERROR_TEXT: "error_text",
    HIDDEN: "hidden",
    LOADING: "loading",
    DISABLED: "disabled"
  };

  // Tipos de campos para auto-selección
  static AUTO_SELECT_TYPES = {
    ATTENDEE_TYPE: "typeAttendee",
    ATTENDANCE_DAY: "attendanceDay", 
    ACADEMIC_LEVEL: "academicLevel",
    FACULTY: "faculty",
    PROGRAM: "program"
  };

  // Delays para auto-selección (en milisegundos)
  static AUTO_SELECT_DELAYS = {
    TYPE_ATTENDEE: 50,
    ACADEMIC_LEVEL: 100,
    FACULTY: 100,
    PROGRAM: 0,
    ATTENDANCE_DAY: 0
  };

  // Configuración de animaciones
  static ANIMATION_CONFIG = {
    DURATION: 300,
    ENABLED: true
  };

  // Textos de interfaz
  static UI_TEXTS = {
    LOADING: "Cargando...",
    SUCCESS: "Enviado correctamente",
    ERROR: "Error al procesar"
  };

  // Configuración de logs por defecto
  static LOG_CONFIG = {
    LEVEL: "info",
    ENABLED: true,
    PERSIST: false,
    MAX_LOGS: 1000
  };

  /**
   * Obtener selector de campo por categoría y tipo
   * @param {string} category - Categoría del campo (PERSONAL, LOCATION, etc.)
   * @param {string} fieldType - Tipo específico del campo
   * @returns {string} - Selector CSS del campo
   */
  static getFieldSelector(category, fieldType) {
    const categorySelectors = this.INPUT_SELECTORS[category];
    if (!categorySelectors) {
      throw new Error(`Categoría de campo no encontrada: ${category}`);
    }
    
    const selector = categorySelectors[fieldType];
    if (!selector) {
      throw new Error(`Tipo de campo no encontrado: ${fieldType} en categoría ${category}`);
    }
    
    return selector;
  }

  /**
   * Obtener nombre de campo por categoría y tipo
   * @param {string} category - Categoría del campo
   * @param {string} fieldType - Tipo específico del campo
   * @returns {string} - Nombre del campo
   */
  static getFieldName(category, fieldType) {
    const categoryNames = this.FIELD_NAMES[category];
    if (!categoryNames) {
      throw new Error(`Categoría de campo no encontrada: ${category}`);
    }
    
    const fieldName = categoryNames[fieldType];
    if (!fieldName) {
      throw new Error(`Tipo de campo no encontrado: ${fieldType} en categoría ${category}`);
    }
    
    return fieldName;
  }

  /**
   * Obtener patrón de validación por tipo
   * @param {string} validationType - Tipo de validación
   * @returns {RegExp} - Patrón de validación
   */
  static getValidationPattern(validationType) {
    const pattern = this.VALIDATION_PATTERNS[validationType];
    if (!pattern) {
      throw new Error(`Patrón de validación no encontrado: ${validationType}`);
    }
    return pattern;
  }

  /**
   * Obtener mensaje de error por tipo
   * @param {string} errorType - Tipo de error
   * @returns {string} - Mensaje de error
   */
  static getErrorMessage(errorType) {
    const message = this.ERROR_MESSAGES[errorType];
    if (!message) {
      throw new Error(`Mensaje de error no encontrado: ${errorType}`);
    }
    return message;
  }

  /**
   * Verificar si un valor es un valor por defecto del sistema
   * @param {string} value - Valor a verificar
   * @returns {boolean} - True si es un valor por defecto
   */
  static isDefaultValue(value) {
    return Object.values(this.DEFAULT_VALUES).includes(value);
  }

  /**
   * Obtener configuración completa para un módulo específico
   * @param {string} moduleType - Tipo de módulo (validation, ui, autoSelect, etc.)
   * @returns {Object} - Configuración del módulo
   */
  static getModuleConfig(moduleType) {
    const configs = {
      validation: {
        patterns: this.VALIDATION_PATTERNS,
        messages: this.ERROR_MESSAGES,
        config: this.VALIDATION_CONFIG,
        types: this.VALIDATION_TYPES
      },
      ui: {
        classes: this.CSS_CLASSES,
        animation: this.ANIMATION_CONFIG,
        texts: this.UI_TEXTS
      },
      autoSelect: {
        types: this.AUTO_SELECT_TYPES,
        delays: this.AUTO_SELECT_DELAYS
      },
      logging: {
        ...this.LOG_CONFIG
      }
    };

    const config = configs[moduleType];
    if (!config) {
      throw new Error(`Configuración de módulo no encontrada: ${moduleType}`);
    }
    
    return { ...config };
  }
}