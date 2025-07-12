/**
 * ConfigManager - Maneja la configuración centralizada del FormManager
 * Separa la lógica de configuración del FormManager principal
 * @version 1.0
 */

export class ConfigManager {
  // Instancia global estática para acceso desde cualquier módulo
  static _instance = null;

  constructor(config = {}, selector) {
    // Establecer como instancia global si no existe una
    if (!ConfigManager._instance) {
      ConfigManager._instance = this;
    }

    this.selector = selector;
    this.config = this.getDefaultConfig(config);

    ConfigManager._instance = this;

    return this;
  }

  /**
   * Obtener configuración fusionada con valores por defecto
   * @param {Object} customConfig - Configuración personalizada
   * @returns {Object} - Configuración completa con valores por defecto
   */
  getDefaultConfig(customConfig = {}) {
    const defaultConfig = {
      // DATOS DE EVENTO
      eventName: "",
      eventDate: "",
      campaign: "",
      article: "",
      source: "",
      subSource: "",
      medium: "",
      leadSource: "Landing Pages",
      originRequest: "web_to_lead_eventos",

      // LISTAS
      departments: [],
      cities: [],
      countries: [],
      typeAttendee: [],
      attendanceDays: [],
      academicLevels: [],
      faculties: [],
      programs: [],
      university: [],
      company: [],

      // CONFIGURACIONES
      sandboxMode: false,
      debugMode: false,
      devMode: false,
      debugEmail: "",
      cacheEnabled: false,
      cacheExpirationHours: 12,

      // URLs
      dataUrls: {
        locations: "",
        prefixes: "",
        programs: "",
        periods: "",
      },
      thankYouUrl: "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",
      privacyPolicyUrl:
        "https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html",

      // VALIDACIÓN
      validation: {
        realTimeValidation: true,
        showErrorsOnBlur: true,
      },

      // LOGGING
      logging: {
        prefix: this.selector || "form-manager",
        enabled: true,
        level: "info",
        showTimestamp: true,
        showLevel: true,
        colors: true,
        persistLogs: false,
        maxLogs: 1000,
      },

      // CALLBACKS
      callbacks: {
        onFormLoad: null,
        onFormSubmit: null,
        onFieldChange: null,
        onValidationError: null,
      },
    };

    // Fusión profunda usando structuredClone
    const merged = structuredClone(defaultConfig);
    return this.deepMerge(merged, customConfig);
  }

  /**
   * Fusionar configuración con valores por defecto
   * @param {Object} config - Configuración personalizada
   * @returns {Object} - Configuración fusionada
   * */
  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
        target[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  /**
   * Método estático para obtener/crear la instancia singleton
   */
  static getInstance(config = {}, selector) {
    if (!ConfigManager._instance) {
      ConfigManager._instance = new ConfigManager(config, selector);
    }
    return ConfigManager._instance;
  }

  /**
   * Obtener configuración completa
   */
  getConfig() {
    return this.config;
  }

  /**
   * Obtener configuración de logging
   */
  getLoggingConfig() {
    return this.config.logging;
  }

  /**
   * Actualizar configuración del singleton
   */
  updateConfig(newConfig) {
    this.config = this.deepMerge(this.config, newConfig);
    return this.config;
  }

  /**
   * Obtener configuración completa global
   * @returns {Object|null} - Configuración completa o null si no hay instancia global
   */
  static getConfig() {
    return ConfigManager.getInstance().getConfig();
  }

  /**
   * Obtener configuración global de logging
   * @returns {Object|null} - Configuración de logging o null si no hay instancia global
   */
  static getLoggingConfig() {
    return ConfigManager.getInstance().getLoggingConfig();
  }

  /**
   * Actualizar configuración global
   * @param {Object} newConfig - Nueva configuración a aplicar
   * @returns {Object} - Configuración actualizada
   */
  static updateConfig(newConfig) {
    return ConfigManager.getInstance().updateConfig(newConfig);
  }

  /**
   * Verificar si existe una instancia global
   * @returns {boolean} - True si existe una instancia global
   */
  static hasGlobalInstance() {
    return ConfigManager._instance !== null;
  }

  /**
   * Obtener configuración específica por clave
   */
  static get(key) {
    return ConfigManager.getInstance().get(key);
  }

  /**
   * Establecer configuración específica
   */
  static set(key, value) {
    return ConfigManager.getInstance().set(key, value);
  }

  /**
   * Obtener selector del formulario actual
   * @returns {string|null} - Selector del formulario o null si no hay instancia
   */
  static getSelector() {
    return ConfigManager._instance ? ConfigManager._instance.selector : null;
  }

  /**
   * Obtener elemento del formulario actual
   * @returns {HTMLElement|null} - Elemento del formulario o null si no existe
   */
  static getFormElement() {
    const selector = ConfigManager.getSelector();
    return selector ? document.getElementById(selector) : null;
  }

  /**
   * Obtener configuración específica por clave (método de instancia)
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Establecer configuración específica (método de instancia)
   */
  set(key, value) {
    this.config[key] = value;
    return this.config[key];
  }
}
