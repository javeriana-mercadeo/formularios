/**
 * ConfigManager - Maneja la configuración centralizada del FormManager
 * Separa la lógica de configuración del FormManager principal
 * @version 1.0
 */

export class ConfigManager {
  // Constants for field types and validation
  static FIELD_TYPES = {
    ATTENDEE_TYPES: {
      APPLICANT: "Aspirante",
      FAMILY_MEMBER: "Padre de familia y/o acudiente",
      CURRENT_STUDENT: "Estudiante actual",
      GRADUATE: "Graduado",
      TEACHER: "Docente y/o psicoorientador",
      VISITOR: "Visitante PUJ",
      ADMINISTRATIVE: "Administrativo PUJ",
      BUSINESS: "Empresario"
    },
    ACADEMIC_LEVELS: {
      UNDERGRADUATE: { code: "PREG", name: "Pregrado" },
      GRADUATE: { code: "GRAD", name: "Posgrado" },
      ECCLESIASTICAL: { code: "ECLE", name: "Eclesiástico" },
      TECHNICAL: { code: "ETDH", name: "Técnico" },
      CONTINUING_EDUCATION: { code: "EDCO", name: "Educación Continua" }
    }
  };

  // Default URLs for external data sources
  static DEFAULT_URLS = {
    SALESFORCE: {
      TEST: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
      PROD: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8"
    },
    THANK_YOU: "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",
    PRIVACY_POLICY: "https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html"
  };

  // Default Organization IDs
  static DEFAULT_OIDS = {
    TEST: "00D7j0000004eQD",
    PROD: "00Df4000003l8Bf"
  };

  // Default field mapping for Salesforce
  static DEFAULT_FIELD_MAPPING = {
    DOCUMENT_TYPE: { test: "00N7j000002BI3X", prod: "00N5G00000WmhsT" },
    DOCUMENT_NUMBER: { test: "00N7j000002BI3V", prod: "00N5G00000WmhsR" }
  };

  constructor(config = {}) {
    this.config = this.mergeWithDefaults(config);
  }

  /**
   * Obtener configuración por defecto
   */
  getDefaultConfig() {
    return {
      // Basic event information
      eventName: "",
      eventDate: "",
      university: "",
      company: "",

      // Attendee types - using constants
      typeAttendee: [
        ConfigManager.FIELD_TYPES.ATTENDEE_TYPES.APPLICANT,
        ConfigManager.FIELD_TYPES.ATTENDEE_TYPES.FAMILY_MEMBER,
      ],

      // Event attendance days
      attendanceDays: [],

      // Available academic levels
      academicLevels: [],

      // Faculty filter (optional)
      faculties: [],

      // Program filter (optional)
      programs: [],

      // Fields to hide from form
      hiddenFields: [],

      // Development and debug settings
      debugMode: false,
      devMode: false,
      debugEmail: "",

      // Cache configuration
      cacheEnabled: false,
      cacheExpirationHours: 12,

      // Campaign and tracking configuration
      campaign: "",
      article: "",
      source: "",
      subSource: "",
      medium: "",

      // Data URLs configuration
      dataUrls: {
        locations: "",
        prefixes: "",
        programs: "",
        periods: "",
      },

      // Salesforce configuration - using constants
      fieldMapping: ConfigManager.DEFAULT_FIELD_MAPPING,
      salesforceUrls: ConfigManager.DEFAULT_URLS.SALESFORCE,
      oids: ConfigManager.DEFAULT_OIDS,

      // Response URLs - using constants
      thankYouUrl: ConfigManager.DEFAULT_URLS.THANK_YOU,
      privacyPolicyUrl: ConfigManager.DEFAULT_URLS.PRIVACY_POLICY,

      // HTML form configuration
      formSelector: '[data-puj-form="main-form"]',

      // Validation configuration
      validation: {
        realTimeValidation: true,
        showErrorsOnBlur: true,
      },

      // Styles configuration
      styles: {
        enabled: true,
        basePath: "../",
        autoLoad: true,
        includeTheme: false,
        themePath: "styles/themes/custom-theme.css",
        customVariables: {},
        useCombined: false,
        customFile: null,
      },

      // Logging configuration
      logging: {
        enabled: true,
        level: "info",
        showTimestamp: true,
        showLevel: true,
        colors: true,
        persistLogs: false,
        maxLogs: 1000,
      },

      // Custom callbacks
      callbacks: {
        onFormLoad: null,
        onFormSubmit: null,
        onFieldChange: null,
        onValidationError: null,
      },
    };
  }

  /**
   * Fusionar configuración personalizada con valores por defecto
   */
  mergeWithDefaults(customConfig) {
    const defaultConfig = this.getDefaultConfig();
    return this.deepMerge(defaultConfig, customConfig);
  }

  /**
   * Fusión profunda de objetos
   */
  deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.config = this.deepMerge(this.config, newConfig);
  }

  /**
   * Obtener configuración específica por clave
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Establecer configuración específica
   */
  set(key, value) {
    this.config[key] = value;
  }

  /**
   * Validar configuración requerida
   */
  validateConfig() {
    const requiredFields = ['eventName', 'salesforceUrls', 'oids'];
    const missingFields = requiredFields.filter(key => !this.config[key]);
    
    if (missingFields.length > 0) {
      throw new Error(`Configuración requerida faltante: ${missingFields.join(', ')}`);
    }
    
    return true;
  }

  /**
   * Obtener configuración para el ambiente actual
   */
  getEnvironmentConfig() {
    const isDebugMode = this.config.debugMode;
    
    return {
      salesforceUrl: isDebugMode ? this.config.salesforceUrls.test : this.config.salesforceUrls.prod,
      organizationId: isDebugMode ? this.config.oids.test : this.config.oids.prod,
      environmentMode: isDebugMode ? 'TEST' : 'PRODUCTION'
    };
  }
}