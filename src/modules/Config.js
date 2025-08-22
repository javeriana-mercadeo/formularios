/**
 * Config - Maneja la configuración de una instancia específica del FormManager
 * Cada FormManager tiene su propia instancia de Config
 * @version 2.0 - Eliminado patrón singleton
 */

export class Config {
  constructor({ config = {}, selector }) {
    const defaultConfig = {
      // DATOS DE EVENTO
      retUrl: 'https://cloud.cx.javeriana.edu.co/EVENTOS_TKY',
      debugEmail: '',

      // CAMPOS OCULTOS
      authorizationSource: '',
      requestOrigin: '',
      leadSource: 'Landing Pages',

      // FILTROS
      // Ubicaciones
      countries: [],
      departments: [],
      cities: [],

      // Datos académicos
      academicLevels: [],
      faculties: [],
      programs: [],

      // Datos del evento
      typeAttendee: ['Aspirante', 'Padre de familia y/o acudiente', 'Docente y/o psicoorientador', 'Visitante PUJ', 'Administrativo PUJ'],
      attendanceDays: [],
      colleges: [],
      universities: [],
      companies: [],

      // UTMs
      source: '',
      subSource: '',
      medium: '',
      campaign: '',
      article: '',
      eventName: '',
      eventDate: '', // Formato: DD/MM/YYYY HH:mm AM/PM

      // CONFIGURACIONES
      test: false,
      debug: false,
      development: false,

      cache: {
        enabled: false,
        expirationHours: 12
      },

      // URLs
      urls: {
        locations: '',
        prefixes: '',
        programs: '',
        periods: ''
      },

      privacyPolicyUrl: 'https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html',

      // LOGGING
      logging: {
        prefix: `${selector} | ${config.eventName || ''}` || 'form-manager',
        enabled: false,
        level: 'info',
        showTimestamp: true,
        showLevel: true
      },

      // UI
      ui: {
        selector: selector,

        errorClass: 'error',
        validClass: 'validated',
        errorTextClass: 'error_text',
        hiddenClass: 'fm-hidden',

        // Configuración de animaciones
        animationDuration: 300,
        enableAnimations: true,

        // Configuración de mensajes
        loadingText: 'Cargando...',
        successText: 'Enviado correctamente',
        errorText: 'Error al procesar'
      },

      // CALLBACKS
      callbacks: {
        onFormLoad: null,
        onFormSubmit: null,
        onFieldChange: null,
        onValidationError: null
      }
    }

    this.config = this.deepMerge(structuredClone(defaultConfig), config)
    this.selector = selector
  }

  /**
   * Fusionar configuración con valores por defecto
   * @param {Object} config - Configuración personalizada
   * @returns {Object} - Configuración fusionada
   * */
  deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = this.deepMerge(target[key] || {}, source[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  // ===============================
  // MÉTODOS DE INSTANCIA
  // ===============================

  /**
   * Obtener configuración completa
   */
  getConfig() {
    return this.config
  }

  /**
   * Obtener configuración de logging
   */
  getLoggingConfig() {
    return this.config.logging
  }

  getUiConfig() {
    return this.config.ui
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.config = this.deepMerge(this.config, newConfig)
    return this.config
  }

  /**
   * Obtener configuración específica por clave
   */
  get(key) {
    return this.config[key]
  }

  /**
   * Establecer configuración específica
   */
  set(key, value) {
    this.config[key] = value
    return this.config[key]
  }

  /**
   * Obtener selector del formulario
   * @returns {string} - Selector del formulario
   */
  getSelector() {
    return this.selector
  }
}
