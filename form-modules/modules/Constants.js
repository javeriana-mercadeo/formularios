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
  static FIELDS = {
    // Campos ocultos
    OID: "oid",
    RET_URL: "retURL",
    DEBUG: "debug",
    DEBUG_EMAIL: "debugEmail",
    AUTHORIZATION_SOURCE: "authorizationSource", // Verificar campo en html
    REQUEST_ORIGIN: "requestOrigin",
    LEAD_SOURCE: "lead_source",
    COMPANY: "company",

    // Campos personales
    FIRST_NAME: "first_name",
    LAST_NAME: "last_name",
    TYPE_DOC: "type_doc",
    DOCUMENT: "document",
    EMAIL: "email",
    PHONE_CODE: "phone_code",
    PHONE: "mobile",

    // Campos de ubicación
    COUNTRY: "country",
    DEPARTMENT: "department",
    CITY: "city",

    // Campos académicos
    ACADEMIC_LEVEL: "academic_level",
    FACULTY: "faculty",
    PROGRAM: "program",
    ADMISSION_PERIOD: "admission_period",

    // Campos de evento
    TYPE_ATTENDEE: "type_attendee",
    ATTENDANCE_DAY: "attendance_day",
    COLLEGE: "college",
    UNIVERSITY: "university",
    DATA_AUTHORIZATION: "authorization_data",

    // Campos parámetros URL
    SOURCE: "utm_source",
    SUB_SOURCE: "utm_subsource",
    MEDIUM: "utm_medium",
    CAMPAIGN: "utm_campaign",
    ARTICLE: "utm_article",
    EVENT_NAME: "utm_eventname",
    EVENT_DATE: "utm_eventdate",
  };

  // Selectores de campos del formulario (incluye TODOS los campos de FIELDS)
  static SELECTORS = {
    // Campos ocultos
    OID: `[name="${Constants.FIELDS.OID}"]`,
    RET_URL: `[name="${Constants.FIELDS.RET_URL}"]`,
    DEBUG: `[name="${Constants.FIELDS.DEBUG}"]`,
    DEBUG_EMAIL: `[name="${Constants.FIELDS.DEBUG_EMAIL}"]`,
    AUTHORIZATION_SOURCE: `[name="${Constants.FIELDS.AUTHORIZATION_SOURCE}"]`,
    REQUEST_ORIGIN: `[name="${Constants.FIELDS.REQUEST_ORIGIN}"]`,
    LEAD_SOURCE: `[name="${Constants.FIELDS.LEAD_SOURCE}"]`,
    COMPANY: `[name="${Constants.FIELDS.COMPANY}"]`,

    // Campos personales
    FIRST_NAME: `[name="${Constants.FIELDS.FIRST_NAME}"]`,
    LAST_NAME: `[name="${Constants.FIELDS.LAST_NAME}"]`,
    TYPE_DOC: `[name="${Constants.FIELDS.TYPE_DOC}"]`,
    DOCUMENT: `[name="${Constants.FIELDS.DOCUMENT}"]`,
    EMAIL: `[name="${Constants.FIELDS.EMAIL}"]`,
    PHONE_CODE: `[name="${Constants.FIELDS.PHONE_CODE}"]`,
    PHONE: `[name="${Constants.FIELDS.PHONE}"]`,

    // Campos de ubicación
    COUNTRY: `[name="${Constants.FIELDS.COUNTRY}"]`,
    DEPARTMENT: `[name="${Constants.FIELDS.DEPARTMENT}"]`,
    CITY: `[name="${Constants.FIELDS.CITY}"]`,

    // Campos académicos
    ACADEMIC_LEVEL: `[name="${Constants.FIELDS.ACADEMIC_LEVEL}"]`,
    FACULTY: `[name="${Constants.FIELDS.FACULTY}"]`,
    PROGRAM: `[name="${Constants.FIELDS.PROGRAM}"]`,
    ADMISSION_PERIOD: `[name="${Constants.FIELDS.ADMISSION_PERIOD}"]`,

    // Campos de evento
    TYPE_ATTENDEE: `[name="${Constants.FIELDS.TYPE_ATTENDEE}"]`,
    ATTENDANCE_DAY: `[name="${Constants.FIELDS.ATTENDANCE_DAY}"]`,
    COLLEGE: `[name="${Constants.FIELDS.COLLEGE}"]`,
    UNIVERSITY: `[name="${Constants.FIELDS.UNIVERSITY}"]`,
    DATA_AUTHORIZATION: `[name="${Constants.FIELDS.DATA_AUTHORIZATION}"]`,

    // Campos parámetros URL
    SOURCE: `[name="${Constants.FIELDS.SOURCE}"]`,
    SUB_SOURCE: `[name="${Constants.FIELDS.SUB_SOURCE}"]`,
    MEDIUM: `[name="${Constants.FIELDS.MEDIUM}"]`,
    CAMPAIGN: `[name="${Constants.FIELDS.CAMPAIGN}"]`,
    ARTICLE: `[name="${Constants.FIELDS.ARTICLE}"]`,
    EVENT_NAME: `[name="${Constants.FIELDS.EVENT_NAME}"]`,
    EVENT_DATE: `[name="${Constants.FIELDS.EVENT_DATE}"]`,

    // Selectores especiales (no basados en name)
    SUBMIT_BUTTON: '[type="submit"]',
  };

  static DATA_FILES = {
    LOCATIONS: "location",
    PREFIXES: "prefixes",
    PROGRAMS: "programs",
    PERIODS: "periods",
    UNIVERSITIES: "universities",
    COLLEGES: "colleges",
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

  // Handler types para eventos de formulario
  static HANDLER_TYPES = {
    COUNTRY_CHANGE: "countryChange",
    DEPARTMENT_CHANGE: "departmentChange",
    TYPE_ATTENDEE_CHANGE: "typeAttendeeChange",
    ACADEMIC_LEVEL_CHANGE: "academicLevelChange",
    FACULTY_CHANGE: "facultyChange",
    PROGRAM_CHANGE: "programChange",
    AUTHORIZATION_CHANGE: "authorizationChange",
    FORM_SUBMIT: "formSubmit",
  };

  // Configuración de campos del formulario para Events
  static FIELD_CONFIGS = [
    // Campos de texto con limpieza
    {
      selectorKey: "firstName",
      stateKey: Constants.FIELDS.FIRST_NAME,
      type: "text",
      cleanMethod: "cleanText",
    },
    {
      selectorKey: "lastName",
      stateKey: Constants.FIELDS.LAST_NAME,
      type: "text",
      cleanMethod: "cleanText",
    },
    {
      selectorKey: "document",
      stateKey: Constants.FIELDS.DOCUMENT,
      type: "text",
      cleanMethod: "cleanNumbers",
    },
    {
      selectorKey: "phone",
      stateKey: Constants.FIELDS.PHONE,
      type: "text",
      cleanMethod: "cleanNumbers",
    },

    // Campos de selección simple
    {
      selectorKey: "typeDoc",
      stateKey: Constants.FIELDS.TYPE_DOC,
      type: "select",
    },
    {
      selectorKey: "email",
      stateKey: Constants.FIELDS.EMAIL,
      type: "select",
    },
    {
      selectorKey: "phoneCode",
      stateKey: Constants.FIELDS.PHONE_CODE,
      type: "select",
    },
    {
      selectorKey: "admissionPeriod",
      stateKey: Constants.FIELDS.ADMISSION_PERIOD,
      type: "select",
    },
    {
      selectorKey: "college",
      stateKey: Constants.FIELDS.COLLEGE,
      type: "select",
    },
    {
      selectorKey: "university",
      stateKey: Constants.FIELDS.UNIVERSITY,
      type: "select",
    },
  ];

  // Configuración de animaciones
  static ANIMATION_CONFIG = {
    DURATION: 300,
    ENABLED: true,
  };

  // Textos de interfaz
  static Ui_TEXTS = {
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

  // Mapeo de campos de Salesforce para Service
  static FIELD_MAPPING = {
    // ==========================
    // CAMPOS OCULTOS
    // ==========================
    OID: {
      name: Constants.FIELDS.OID,
      field: Constants.FIELDS.OID,
      id: {
        test: "00D7j0000004eQD",
        prod: "00Df4000003l8Bf",
      },
    },

    RET_URL: {
      name: "URL de redirección",
      field: Constants.FIELDS.RET_URL,
      id: Constants.FIELDS.RET_URL,
    },

    DEBUG: {
      name: "Modo depuración",
      field: Constants.FIELDS.DEBUG,
      id: Constants.FIELDS.DEBUG,
    },

    DEBUG_EMAIL: {
      name: "Email de depuración",
      field: Constants.FIELDS.DEBUG_EMAIL,
      id: Constants.FIELDS.DEBUG_EMAIL,
    },

    AUTHORIZATION_SOURCE: {
      name: "Fuente de autorización",
      field: Constants.FIELDS.AUTHORIZATION_SOURCE,
      id: {
        test: "00N7j000002BY26",
        prod: "00N5G00000WmhvT",
      },
    },

    REQUEST_ORIGIN: {
      name: "Origen de la solicitud (Landing Page, Facebook, etc.)",
      field: Constants.FIELDS.REQUEST_ORIGIN,
      id: {
        test: "00NO40000002ZeP",
        prod: "00NJw000001J3HI",
      },
    },
    LEAD_SOURCE: {
      name: "Fuente del lead",
      field: Constants.FIELDS.LEAD_SOURCE,
      id: Constants.FIELDS.LEAD_SOURCE,
    },

    COMPANY: {
      name: "Empresa",
      field: Constants.FIELDS.COMPANY,
      id: {
        test: "00NO400000B68fh",
        prod: "00NJw000006F1BC",
      },
    },

    // ==========================
    // CAMPOS PERSONALES
    // ==========================
    FIRST_NAME: {
      name: "Nombres",
      field: Constants.FIELDS.FIRST_NAME,
      id: Constants.FIELDS.FIRST_NAME,
    },

    LAST_NAME: {
      name: "Apellidos",
      field: Constants.FIELDS.LAST_NAME,
      id: Constants.FIELDS.LAST_NAME,
    },

    TYPE_DOC: {
      name: "Tipo de documento",
      field: Constants.FIELDS.TYPE_DOC,
      id: {
        test: "00N7j000002BI3X",
        prod: "00N5G00000WmhsT",
      },
    },

    DOCUMENT: {
      name: "Número de documento",
      field: Constants.FIELDS.DOCUMENT,
      id: {
        test: "00N7j000002BI3V",
        prod: "00N5G00000WmhsR",
      },
    },

    EMAIL: {
      name: "Email",
      field: Constants.FIELDS.EMAIL,
      id: Constants.FIELDS.EMAIL,
    },

    PHONE_CODE: {
      name: "Código de país",
      field: Constants.FIELDS.PHONE_CODE,
      id: {
        test: "00NO4000002IUPh",
        prod: "00NJw000002mzb7",
      },
    },

    PHONE: {
      name: "Teléfono",
      field: Constants.FIELDS.PHONE,
      id: Constants.FIELDS.PHONE,
    },

    // ==========================
    // CAMPOS DE UBICACIÓN
    // ==========================
    COUNTRY: {
      name: "País",
      field: Constants.FIELDS.COUNTRY,
      id: {
        test: "00N7j000002BY1c",
        prod: "00N5G00000WmhvJ",
      },
    },

    DEPARTMENT: {
      name: "Departamento",
      field: Constants.FIELDS.DEPARTMENT,
      id: {
        test: "00N7j000002BY1h",
        prod: "00N5G00000WmhvX",
      },
    },

    CITY: {
      name: "Ciudad",
      field: Constants.FIELDS.CITY,
      id: {
        test: "00N7j000002BY1i",
        prod: "00N5G00000WmhvO",
      },
    },

    // ==========================
    // CAMPOS ACADÉMICOS
    // ==========================
    ACADEMIC_LEVEL: {
      name: "Nivel académico",
      field: Constants.FIELDS.ACADEMIC_LEVEL,
      id: "nivelacademico",
    },

    FACULTY: {
      name: "Facultad",
      field: Constants.FIELDS.FACULTY,
      id: "Facultad",
    },

    PROGRAM: {
      name: "Programa - Código SAE",
      field: Constants.FIELDS.PROGRAM,
      id: {
        test: "00N7j000002BI3p",
        prod: "00N5G00000WmhvV",
      },
    },

    ADMISSION_PERIOD: {
      name: "Período de admisión",
      field: Constants.FIELDS.ADMISSION_PERIOD,
      id: {
        test: "00N7j000002BY2L",
        prod: "00N5G00000WmhvI",
      },
    },

    // ==========================
    // CAMPOS DE EVENTO
    // ==========================
    ATTENDEE_TYPE: {
      name: "Tipo de asistente",
      field: Constants.FIELDS.TYPE_ATTENDEE,
      id: {
        test: "00NO40000000sTR",
        prod: "00NJw000001J3g6",
      },
    },

    ATTENDANCE_DAY: {
      name: "Día de asistencia",
      field: Constants.FIELDS.ATTENDANCE_DAY,
      id: {
        test: "00NO4000007qrPB",
        prod: "00NJw000004iulj",
      },
    },

    COLLEGE: {
      name: "Colegio",
      field: "college",
      id: {
        test: "00NO4000005begL",
        prod: "00NJw0000041omr",
      },
    },

    UNIVERSITY: {
      name: "Universidad",
      field: Constants.FIELDS.UNIVERSITY,
      id: {
        test: "00NO400000B66Z3",
        prod: "00NJw000006f1BG",
      },
    },

    DATA_AUTHORIZATION: {
      name: "Autorización de datos personales",
      field: Constants.FIELDS.DATA_AUTHORIZATION,
      id: {
        test: "00N7j000002BI3m",
        prod: "00N5G00000WmhvF",
      },
    },

    // ==========================
    // CAMPOS DINÁMICOS DE URL
    // ==========================
    SOURCE: {
      name: "Fuente UTM",
      field: Constants.FIELDS.SOURCE,
      id: {
        test: "00N7j000002BKgW",
        prod: "00N5G00000WmhvW",
      },
    },

    SUB_SOURCE: {
      name: "Sub-fuente UTM",
      field: Constants.FIELDS.SUB_SOURCE,
      id: {
        test: "00N7j000002BKgb",
        prod: "00N5G00000WmhvZ",
      },
    },

    MEDIUM: {
      name: "Medio UTM",
      field: Constants.FIELDS.MEDIUM,
      id: {
        test: "00NO40000001izt",
        prod: "00NJw000001J3g8",
      },
    },

    CAMPAIGN: {
      name: "Campaña UTM",
      field: Constants.FIELDS.CAMPAIGN,
      id: {
        test: "00N7j000002BfKF",
        prod: "00N5G00000Wmi8X",
      },
    },

    ARTICLE: {
      name: "Artículo UTM",
      field: Constants.FIELDS.ARTICLE,
      id: {
        test: "00NO400000D2PVt",
        prod: "00NJw000006f1BB",
      },
    },

    EVENT_NAME: {
      name: "Nombre del evento UTM",
      field: Constants.FIELDS.EVENT_NAME,
      id: {
        test: "00NO400000AIAxR",
        prod: "00NJw000006f1BF",
      },
    },

    EVENT_DATE: {
      name: "Fecha del evento UTM",
      field: Constants.FIELDS.EVENT_DATE,
      id: {
        test: "00NO400000AIanI",
        prod: "00NJw000006f1BE",
      },
    },
  };

  /**
   * Obtener selector de campo por categoría y tipo
   * @param {string} category - Categoría del campo (PERSONAL, LOCATION, etc.)
   * @param {string} fieldType - Tipo específico del campo
   * @returns {string} - Selector CSS del campo
   */
  static getFieldSelector(category, fieldType) {
    const categorySelectors = this.SELECTORS[category];
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
    const categoryNames = this.FIELDS[category];
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
   * @param {string} moduleType - Tipo de módulo (Ui, autoSelect, logging)
   * @returns {Object} - Configuración del módulo
   */
  static getModuleConfig(moduleType) {
    const configs = {
      Ui: {
        animation: this.ANIMATION_CONFIG,
        texts: this.Ui_TEXTS,
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
