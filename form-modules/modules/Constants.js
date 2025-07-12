/**
 * Constants - Constantes compartidas del sistema de formularios
 *
 * Centraliza todas las constantes utilizadas en múltiples módulos
 * para evitar duplicación y facilitar el mantenimiento
 *
 * @version 1.0
 */

export class Constants {
  // Nombres de campos para validación y estado
  static FIELD_NAMES = {
    PERSONAL: {
      FIRST_NAME: "first_name",
      LAST_NAME: "last_name",
      TYPE_DOC: "type_doc",
      DOCUMENT: "document",
      EMAIL: "email",
      PHONE_CODE: "phone_code",
      PHONE: "phone",
    },
    LOCATION: {
      COUNTRY: "country",
      DEPARTMENT: "department",
      CITY: "city",
    },
    EVENT: {
      TYPE_ATTENDEE: "type_attendee",
      ATTENDANCE_DAY: "attendance_day",
    },
    ACADEMIC: {
      ACADEMIC_LEVEL: "academic_level",
      FACULTY: "faculty",
      PROGRAM: "program",
      ADMISSION_PERIOD: "admission_period",
    },
    AUTHORIZATION: {
      DATA_AUTHORIZATION: "authorization_data",
    },
  };

  // Selectores de campos del formulario
  static INPUT_SELECTORS = {
    PERSONAL: {
      FIRST_NAME: `[name="${Constants.FIELD_NAMES.PERSONAL.FIRST_NAME}"]`,
      LAST_NAME: `[name="${Constants.FIELD_NAMES.PERSONAL.LAST_NAME}"]`,
      TYPE_DOC: `[name="${Constants.FIELD_NAMES.PERSONAL.TYPE_DOC}"]`,
      DOCUMENT: `[name="${Constants.FIELD_NAMES.PERSONAL.DOCUMENT}"]`,
      EMAIL: `[name="${Constants.FIELD_NAMES.PERSONAL.EMAIL}"]`,
      PHONE_CODE: `[name="${Constants.FIELD_NAMES.PERSONAL.PHONE_CODE}"]`,
      PHONE: `[name="${Constants.FIELD_NAMES.PERSONAL.PHONE}"]`,
    },
    LOCATION: {
      COUNTRY: `[name="${Constants.FIELD_NAMES.LOCATION.COUNTRY}"]`,
      DEPARTMENT: `[name="${Constants.FIELD_NAMES.LOCATION.DEPARTMENT}"]`,
      CITY: `[name="${Constants.FIELD_NAMES.LOCATION.CITY}"]`,
    },
    EVENT: {
      ATTENDANCE_DAY: `[name="${Constants.FIELD_NAMES.EVENT.ATTENDANCE_DAY}"]`,
      TYPE_ATTENDEE: `[name="${Constants.FIELD_NAMES.EVENT.TYPE_ATTENDEE}"]`,
    },
    ACADEMIC: {
      ACADEMIC_LEVEL: `[name="${Constants.FIELD_NAMES.ACADEMIC.ACADEMIC_LEVEL}"]`,
      FACULTY: `[name="${Constants.FIELD_NAMES.ACADEMIC.FACULTY}"]`,
      PROGRAM: `[name="${Constants.FIELD_NAMES.ACADEMIC.PROGRAM}"]`,
      ADMISSION_PERIOD: `[name="${Constants.FIELD_NAMES.ACADEMIC.ADMISSION_PERIOD}"]`,
    },
    FORM_CONTROLS: {
      SUBMIT_BUTTON: '[type="submit"]',
      AUTHORIZATION_DATA: "authorization_data",
    },
  };

  static ATTENDEE_TYPES = {
    APPLICANT: "Aspirante",
    FAMILY_MEMBER: "Padre de familia y/o acudiente",
    CURRENT_STUDENT: "Estudiante actual",
    GRADUATE: "Graduado",
    TEACHER: "Docente y/o psicoorientador",
    VISITOR: "Visitante PUJ",
    ADMINISTRATIVE: "Administrativo PUJ",
    BUSINESS: "Empresario",
  };

  static ACADEMIC_LEVELS = {
    UNDERGRADUATE: {
      code: "PREG",
      name: "Pregrado",
    },
    GRADUATE: {
      code: "GRAD",
      name: "Posgrado",
    },
    ECCLESIASTICAL: {
      code: "ECLE",
      name: "Eclesiástico",
    },
    TECHNICAL: {
      code: "ETDH",
      name: "Técnico",
    },
    CONTINUING_EDUCATION: {
      code: "EDCO",
      name: "Educación Continua",
    },
  };

  // Tipos de campos para auto-selección
  static AUTO_SELECT_TYPES = {
    ATTENDEE_TYPE: "typeAttendee",
    ATTENDANCE_DAY: "attendanceDay",
    ACADEMIC_LEVEL: "academicLevel",
    FACULTY: "faculty",
    PROGRAM: "program",
  };

  // Delays para auto-selección (en milisegundos)
  static AUTO_SELECT_DELAYS = {
    TYPE_ATTENDEE: 50,
    ACADEMIC_LEVEL: 100,
    FACULTY: 100,
    PROGRAM: 0,
    ATTENDANCE_DAY: 0,
  };

  // Configuración de animaciones
  static ANIMATION_CONFIG = {
    DURATION: 300,
    ENABLED: true,
  };

  // Textos de interfaz
  static UI_TEXTS = {
    LOADING: "Cargando...",
    SUCCESS: "Enviado correctamente",
    ERROR: "Error al procesar",
  };

  // Configuración de logs por defecto
  static LOG_CONFIG = {
    LEVEL: "info",
    ENABLED: true,
    PERSIST: false,
    MAX_LOGS: 1000,
  };

  static THANK_YOU_PAGE = "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY";

  static SALESFORCE_SUBMIT_URLS = {
    test: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
    prod: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
  };

  // Mapeo de campos de Salesforce para APIService
  static SALESFORCE_FIELD_MAPPING = {
    // Campos estáticos
    OID: { test: "00D7j0000004eQD", prod: "00Df4000003l8Bf" },
    RET_URL: "retURL",
    DEBUG: "debug",
    DEBUG_EMAIL: "debugEmail",

    // Campos personales
    NAME: "first_name",
    LAST_NAME: "last_name",
    DOCUMENT_TYPE: { test: "00N7j000002BI3X", prod: "00N5G00000WmhsT" },
    DOCUMENT_NUMBER: { test: "00N7j000002BI3V", prod: "00N5G00000WmhsR" },
    EMAIL: "email",
    PHONE_PREFIX: { test: "00NO4000002IUPh", prod: "00NJw000002mzb7" },
    PHONE: "phone",
    COUNTRY_RESIDENCE: { test: "00N7j000002BY1c", prod: "00N5G00000WmhvJ" },
    DEPARTMENT_RESIDENCE: { test: "00N7j000002BY1h", prod: "00N5G00000WmhvX" },
    CITY_RESIDENCE: { test: "00N7j000002BY1i", prod: "00N5G00000WmhvO" },
    ADMISSION_PERIOD: { test: "00N7j000002BY2L", prod: "00N5G00000WmhvI" },
    LEAD_SOURCE: "lead_source",
    AUTHORIZATION_SOURCE: { test: "00N7j000002BY26", prod: "00N5G00000WmhvT" },
    SAE_CODE: { test: "00N7j000002BI3p", prod: "00N5G00000WmhvV" },

    // Datos de eventos
    ATTENDEE_TYPE: { test: "00NO40000000sTR", prod: "00NJw000001J3g6" },
    ACADEMIC_LEVEL: { test: "nivelacademico", prod: "nivelacademico" },
    FACULTY: { test: "Facultad", prod: "Facultad" },
    ATTENDANCE_DAY: { test: "00NO4000007qrPB", prod: "00NJw000004iulj" },
    COLLEGE: { test: "00NO4000005begL", prod: "00NJw0000041omr" },

    REQUEST_ORIGIN: { test: "00NO40000002ZeP", prod: "00NJw000001J3HI" },
    SOURCE: { test: "00N7j000002BKgW", prod: "00N5G00000WmhvW" },
    SUB_SOURCE: { test: "00N7j000002BKgb", prod: "00N5G00000WmhvZ" },
    MEDIUM: { test: "00NO40000001izt", prod: "00NJw000001J3g8" },
    CAMPAIGN: { test: "00N7j000002BfKF", prod: "00N5G00000Wmi8X" },
    DATA_AUTHORIZATION: { test: "00N7j000002BI3m", prod: "00N5G00000WmhvF" },
    ARTICLE: { test: "00NO400000D2PVt", prod: "00NJw000006f1BB" },
    EVENT_NAME: { test: "00NO400000AIAxR", prod: "00NJw000006f1BF" },
    EVENT_DATE: { test: "00NO400000AIanI", prod: "00NJw000006f1BE" },
    UNIVERSITY: { test: "00NO400000B66Z3", prod: "00NJw000006f1BG" },
    PARTNER_COMPANY: { test: "00NO400000B68fh", prod: "00NJw000006F1BC" },
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
   * Obtener configuración completa para un módulo específico
   * @param {string} moduleType - Tipo de módulo (ui, autoSelect, logging)
   * @returns {Object} - Configuración del módulo
   */
  static getModuleConfig(moduleType) {
    const configs = {
      ui: {
        animation: this.ANIMATION_CONFIG,
        texts: this.UI_TEXTS,
      },
      autoSelect: {
        types: this.AUTO_SELECT_TYPES,
        delays: this.AUTO_SELECT_DELAYS,
      },
      logging: {
        ...this.LOG_CONFIG,
      },
    };

    const config = configs[moduleType];
    if (!config) {
      throw new Error(`Configuración de módulo no encontrada: ${moduleType}`);
    }

    return { ...config };
  }
}
