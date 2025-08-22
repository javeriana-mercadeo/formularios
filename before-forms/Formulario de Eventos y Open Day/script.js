/**
 * Formulario de Eventos y Open Day - Pontificia Universidad Javeriana
 * @version 5.0
 */

// ============================================
// CONFIGURACIÓN CENTRALIZADA
// ============================================
class FormConfig {
  static PERSONALIZATION = {
    // ============================================
    // INICIO - PERSONALIZACIÓN DEL FORMULARIO
    // ============================================

    // NOMBRE DEL EVENTO
    EVENT_NAME: 'Eventos Open Day 2025 Prueba',

    // UNIVERSIDAD
    // TODO: Paras a lista
    UNIVERSITY: '',

    // EMPRESA DE CONVENIO
    COMPANY: '',

    // TIPOS DE ASISTENTE
    TYPE_ATTENDEE: [
      'Aspirante',
      'Padre de familia y/o acudiente'
      //'Docente y/o psicoorientador',
      //'Visitante PUJ',
      //'Administrativo PUJ'
    ],

    // FECHA DEL EVENTO
    EVENT_DATE: '14/11/2025',

    // DÍAS DE ASISTENCIA AL EVENTO
    ATTENDANCE_DAYS: ['Martes 14 de noviembre', 'Miércoles 15 de noviembre'],

    // NIVELES ACADÉMICOS DISPONIBLES
    // Si está vacío, se auto-detectan todos los niveles disponibles de los datos
    LEVEL_ACADEMIC: [
      //{ code: "PREG", name: "Pregrado" },
      //{ code: "GRAD", name: "Posgrado" },
      //{ code: "ECLE", name: "Eclesiástico" },
      //{ code: "ETDH", name: "Técnico" },
    ],

    // FILTRO DE FACULTADES (OPCIONAL)
    FACULTY: [],

    // FILTRO DE PROGRAMAS (OPCIONAL)
    PROGRAMS: [],

    // CAMPOS A OCULTAR DEL FORMULARIO
    REMOVE_FIELDS: [],

    // CONFIGURACIONES DE DESARROLLO Y DEBUG
    DEV_MODE: false,
    DEBUG_MODE: true,
    EMAIL_DEBUG: 'gavilanm-j@javeriana.edu.co',

    // CONFIGURACIÓN DE CACHÉ
    CACHE_ENABLED: false,
    CACHE_EXPIRATION_HOURS: 12,

    // CONFIGURACIÓN DE UTM's

    // Código de campaña para seguimiento
    CAMPAIGN: 'MERCA_ENFER_ENFER',

    // ARTÍCULO/CONTENIDO
    ARTICLE: 'Articulo',

    // FUENTE DE SEGUIMIENTO
    SOURCE: 'Fuente',

    // SUB-FUENTE DE SEGUIMIENTO
    SUB_SOURCE: 'Subfuente',

    // MEDIO DE MARKETING
    MEDIUM: 'Medio'
  }

  // ============================================
  // MAPEO DE IDS SEGÚN AMBIENTE
  // ============================================
  static FIELD_MAPPING = {
    // Campos que cambian entre test y producción
    TIPO_DOCUMENTO: {
      test: '00N7j000002BI3X',
      prod: '00N5G00000WmhsT'
    },
    NUMERO_DOCUMENTO: {
      test: '00N7j000002BI3V',
      prod: '00N5G00000WmhsR'
    },
    PREFIJO_CELULAR: {
      test: '00NO4000002IUPh',
      prod: '00NJw000002mzb7'
    },
    PAIS_RESIDENCIA: {
      test: '00N7j000002BY1c',
      prod: '00N5G00000WmhvJ'
    },
    DEPARTAMENTO_RESIDENCIA: {
      test: '00N7j000002BY1h',
      prod: '00N5G00000WmhvX'
    },
    CIUDAD_RESIDENCIA: {
      test: '00N7j000002BY1i',
      prod: '00N5G00000WmhvO'
    },
    PERIODO_INGRESO: {
      test: '00N7j000002BY2L',
      prod: '00N5G00000WmhvI'
    },
    FUENTE_AUTORIZACION: {
      test: '00N7j000002BY26',
      prod: '00N5G00000WmhvT'
    },
    CODIGO_SAE: {
      test: '00N7j000002BI3p',
      prod: '00N5G00000WmhvV'
    },
    TIPO_ASISTENTE: {
      test: '00NO40000000sTR',
      prod: '00NJw000001J3g6'
    },
    DIA_ASISTENCIA: {
      test: '00NO4000007qrPB',
      prod: '00NJw000004iulj'
    },
    ORIGEN_SOLICITUD: {
      test: '00NO40000002ZeP',
      prod: '00NJw000001J3HI'
    },
    FUENTE: {
      test: '00N7j000002BKgW',
      prod: '00N5G00000WmhvW'
    },
    SUBFUENTE: {
      test: '00N7j000002BKgb',
      prod: '00N5G00000WmhvZ'
    },
    MEDIO: {
      test: '00NO40000001izt',
      prod: '00NJw000001J3g8'
    },
    CAMPANA: {
      test: '00N7j000002BfKF',
      prod: '00N5G00000Wmi8X'
    },
    AUTORIZACION_DATOS: {
      test: '00N7j000002BI3m',
      prod: '00N5G00000WmhvF'
    },
    ARTICULO: {
      test: '00NO400000D2PVt',
      prod: '00NJw000006f1BB'
    },
    NOMBRE_EVENTO: {
      test: '00NO400000AIAxR',
      prod: '00NJw000006f1BF'
    },
    FECHA_EVENTO: {
      test: '00NO400000AIanI',
      prod: '00NJw000006f1BE'
    },
    UNIVERSIDAD: {
      test: '00NO400000B66Z3',
      prod: '00NJw000006f1BG'
    },
    EMPRESA_CONVENIO: {
      test: '00NO400000B68fh',
      prod: '00NJw000006F1BC'
    },
    NIVEL_ACADEMICO: {
      test: 'nivelacademico',
      prod: 'nivelacademico'
    }
  }

  static URLS = {
    THANK_YOU: 'https://cloud.cx.javeriana.edu.co/EVENTOS_TKY',
    PRIVACY_POLICY: 'https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html',

    SALESFORCE: {
      test: 'https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
      prod: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'
    },

    OID: {
      test: '00D7j0000004eQD',
      prod: '00Df4000003l8Bf'
    },

    DATA_SOURCES: {
      LOCATIONS: '../data/ubicaciones.json',
      PREFIXES: '../data/codigos_pais.json',
      PROGRAMS: '../data/programas.json',
      PERIODS: '../data/periodos.json'
    }

    /* DATA_SOURCES: {
    LOCATIONS: "https://www.javeriana.edu.co/recursosdb/1372208/10609114/ubicaciones.json",
    PREFIXES: "https://www.javeriana.edu.co/recursosdb/1372208/10609114/codigos_pais.json",
    PROGRAMS: "https://www.javeriana.edu.co/recursosdb/1372208/10609114/programas.json",
    PERIODS: "https://www.javeriana.edu.co/recursosdb/1372208/10609114/periodos.json",
  }, */
  }

  // ============================================
  // MÉTODOS UTILITARIOS
  // ============================================

  /**
   * Obtiene el ID del campo según el ambiente actual
   * @param {string} fieldKey - Clave del campo en FIELD_MAPPING
   * @returns {string} ID del campo para el ambiente actual
   */
  static getFieldId(fieldKey) {
    const mapping = this.FIELD_MAPPING[fieldKey]
    if (!mapping) {
      console.warn(`Campo no encontrado en mapeo: ${fieldKey}`)
      return ''
    }

    return this.PERSONALIZATION.DEBUG_MODE ? mapping.test : mapping.prod
  }

  /**
   * Obtiene la URL de Salesforce según el ambiente actual
   * @returns {string} URL de Salesforce para el ambiente actual
   */
  static getSalesforceUrl() {
    return this.PERSONALIZATION.DEBUG_MODE ? this.URLS.SALESFORCE.test : this.URLS.SALESFORCE.prod
  }

  /**
   * Obtiene el OID según el ambiente actual
   * @returns {string} OID para el ambiente actual
   */
  static getOID() {
    return this.PERSONALIZATION.DEBUG_MODE ? this.URLS.OID.test : this.URLS.OID.prod
  }

  /**
   * Configura el formulario según el ambiente actual
   */
  static configureForm() {
    const form = document.getElementById('form_inscription')
    if (form) {
      // Configurar action del formulario
      form.action = this.getSalesforceUrl()

      // Agregar campos ocultos de Salesforce si no existen
      this.addHiddenSalesforceFields()
    }
  }

  /**
   * Agrega campos ocultos necesarios para Salesforce
   */
  static addHiddenSalesforceFields() {
    const form = document.getElementById('form_inscription')
    if (!form) return

    // Limpiar campos ocultos previos para evitar duplicación al cambiar de modo
    this.cleanupHiddenFields()

    // Campos ocultos necesarios para Salesforce
    const hiddenFields = [
      { name: 'oid', value: this.getOID() },
      { name: 'retURL', value: this.URLS.THANK_YOU },
      { name: 'debug', value: this.PERSONALIZATION.DEBUG_MODE ? '1' : '0' },
      {
        name: 'debugEmail',
        value: this.PERSONALIZATION.DEBUG_MODE ? this.PERSONALIZATION.EMAIL_DEBUG : ''
      },
      { name: 'lead_source', value: 'Landing Pages' },
      { name: 'company', value: 'NA' },
      {
        name: this.getFieldId('NOMBRE_EVENTO'),
        value: ''
      },
      {
        name: this.getFieldId('FECHA_EVENTO'),
        value: this.PERSONALIZATION.EVENT_DATE || ''
      },
      {
        name: this.getFieldId('UNIVERSIDAD'),
        value: ''
      },
      {
        name: this.getFieldId('ARTICULO'),
        value: ''
      },
      {
        name: this.getFieldId('EMPRESA_CONVENIO'),
        value: ''
      },
      {
        name: this.getFieldId('FUENTE'),
        value: ''
      },
      {
        name: this.getFieldId('SUBFUENTE'),
        value: ''
      },
      {
        name: this.getFieldId('MEDIO'),
        value: this.PERSONALIZATION.MEDIUM || ''
      },
      {
        name: this.getFieldId('CAMPANA'),
        value: ''
      },
      {
        name: this.getFieldId('NIVEL_ACADEMICO'),
        value: ''
      }
    ]

    hiddenFields.forEach(field => {
      let input = document.querySelector(`input[name="${field.name}"]`)
      if (!input) {
        input = document.createElement('input')
        input.type = 'hidden'
        input.name = field.name
        if (field.name === this.getFieldId('NOMBRE_EVENTO')) {
          input.id = 'nevento'
        } else if (field.name === this.getFieldId('FECHA_EVENTO')) {
          input.id = 'fevento'
        } else if (field.name === this.getFieldId('UNIVERSIDAD')) {
          input.id = 'universidad'
        } else if (field.name === this.getFieldId('ARTICULO')) {
          input.id = 'articulo'
        } else if (field.name === this.getFieldId('EMPRESA_CONVENIO')) {
          input.id = 'empresa-convenio'
        } else if (field.name === this.getFieldId('FUENTE')) {
          input.id = 'fuente'
        } else if (field.name === this.getFieldId('SUBFUENTE')) {
          input.id = 'subfuente'
        } else if (field.name === this.getFieldId('MEDIO')) {
          input.id = 'medio'
        } else if (field.name === this.getFieldId('CAMPANA')) {
          input.id = 'campana'
        } else if (field.name === this.getFieldId('NIVEL_ACADEMICO')) {
          input.id = 'nivel-academico'
        } else {
          input.id = ''
        }
        form.appendChild(input)
      }
      input.value = field.value
    })
  }

  /**
   * Limpia los campos ocultos específicos para evitar duplicación al cambiar de modo
   */
  static cleanupHiddenFields() {
    const form = document.getElementById('form_inscription')
    if (!form) return

    // Lista de campos que pueden duplicarse al cambiar de modo
    const fieldsToClean = [
      // NOMBRE_EVENTO en ambos modos
      this.FIELD_MAPPING.NOMBRE_EVENTO.test,
      this.FIELD_MAPPING.NOMBRE_EVENTO.prod,
      // FECHA_EVENTO en ambos modos
      this.FIELD_MAPPING.FECHA_EVENTO.test,
      this.FIELD_MAPPING.FECHA_EVENTO.prod,
      // UNIVERSIDAD en ambos modos
      this.FIELD_MAPPING.UNIVERSIDAD.test,
      this.FIELD_MAPPING.UNIVERSIDAD.prod,
      // ARTICULO en ambos modos
      this.FIELD_MAPPING.ARTICULO.test,
      this.FIELD_MAPPING.ARTICULO.prod,
      // EMPRESA_CONVENIO en ambos modos
      this.FIELD_MAPPING.EMPRESA_CONVENIO.test,
      this.FIELD_MAPPING.EMPRESA_CONVENIO.prod,
      // FUENTE en ambos modos
      this.FIELD_MAPPING.FUENTE.test,
      this.FIELD_MAPPING.FUENTE.prod,
      // SUBFUENTE en ambos modos
      this.FIELD_MAPPING.SUBFUENTE.test,
      this.FIELD_MAPPING.SUBFUENTE.prod,
      // MEDIO en ambos modos
      this.FIELD_MAPPING.MEDIO.test,
      this.FIELD_MAPPING.MEDIO.prod,
      // CAMPANA en ambos modos
      this.FIELD_MAPPING.CAMPANA.test,
      this.FIELD_MAPPING.CAMPANA.prod,
      // NIVEL_ACADEMICO en ambos modos
      this.FIELD_MAPPING.NIVEL_ACADEMICO.test,
      this.FIELD_MAPPING.NIVEL_ACADEMICO.prod,
      // Otros campos críticos
      'oid',
      'debug',
      'debugEmail'
    ]

    fieldsToClean.forEach(fieldName => {
      const existingField = form.querySelector(`input[name="${fieldName}"]`)
      if (existingField) {
        existingField.remove()
      }
    })

    // También limpiar por ID para los campos de evento
    const existingEventNameField = form.querySelector(`input#nevento`)
    if (existingEventNameField) {
      existingEventNameField.remove()
    }

    const existingEventDateField = form.querySelector(`input#fevento`)
    if (existingEventDateField) {
      existingEventDateField.remove()
    }

    const existingUniversityField = form.querySelector(`input#universidad`)
    if (existingUniversityField) {
      existingUniversityField.remove()
    }

    const existingArticleField = form.querySelector(`input#articulo`)
    if (existingArticleField) {
      existingArticleField.remove()
    }

    const existingCompanyField = form.querySelector(`input#empresa-convenio`)
    if (existingCompanyField) {
      existingCompanyField.remove()
    }

    const existingSourceField = form.querySelector(`input#fuente`)
    if (existingSourceField) {
      existingSourceField.remove()
    }

    const existingSubSourceField = form.querySelector(`input#subfuente`)
    if (existingSubSourceField) {
      existingSubSourceField.remove()
    }

    const existingMediumField = form.querySelector(`input#medio`)
    if (existingMediumField) {
      existingMediumField.remove()
    }

    const existingCampaignField = form.querySelector(`input#campana`)
    if (existingCampaignField) {
      existingCampaignField.remove()
    }

    const existingNivelAcademicoField = form.querySelector(`input#nivel-academico`)
    if (existingNivelAcademicoField) {
      existingNivelAcademicoField.remove()
    }
  }

  /**
   * Configura el nombre del evento desde parámetros URL o valor directo
   * @param {string} eventName - Nombre del evento
   */
  static setEventName(eventName) {
    const eventField = document.getElementById('nevento') || document.querySelector(`input[name="${this.getFieldId('NOMBRE_EVENTO')}"]`)
    if (eventField) {
      eventField.value = eventName
      console.log(`✅ Nombre del evento configurado: ${eventName}`)
    }
  }

  /**
   * Configura la fecha del evento desde parámetros URL o valor directo
   * @param {string} eventDate - Fecha del evento
   */
  static setEventDate(eventDate) {
    const eventDateField = document.getElementById('fevento') || document.querySelector(`input[name="${this.getFieldId('FECHA_EVENTO')}"]`)
    if (eventDateField) {
      eventDateField.value = eventDate
      console.log(`✅ Fecha del evento configurada: ${eventDate}`)
    }
  }

  /**
   * Configura la universidad
   * @param {string} university - Universidad
   */
  static setUniversity(university) {
    const universityField =
      document.getElementById('universidad') || document.querySelector(`input[name="${this.getFieldId('UNIVERSIDAD')}"]`)
    if (universityField) {
      universityField.value = university
      console.log(`✅ Universidad configurada: ${university}`)
    }
  }

  /**
   * Configura el artículo/contenido
   * @param {string} article - Artículo/contenido
   */
  static setArticle(article) {
    const articleField = document.getElementById('articulo') || document.querySelector(`input[name="${this.getFieldId('ARTICULO')}"]`)
    if (articleField) {
      articleField.value = article
      console.log(`✅ Artículo/contenido configurado: ${article}`)
    }
  }

  /**
   * Configura la empresa de convenio
   * @param {string} company - Empresa de convenio
   */
  static setCompany(company) {
    const companyField =
      document.getElementById('empresa-convenio') || document.querySelector(`input[name="${this.getFieldId('EMPRESA_CONVENIO')}"]`)
    if (companyField) {
      companyField.value = company
      console.log(`✅ Empresa de convenio configurada: ${company}`)
    }
  }

  /**
   * Configura la fuente de seguimiento desde parámetros URL o valor directo
   * @param {string} source - Fuente de seguimiento
   */
  static setSource(source) {
    const sourceField = document.getElementById('fuente') || document.querySelector(`input[name="${this.getFieldId('FUENTE')}"]`)
    if (sourceField) {
      sourceField.value = source
      console.log(`✅ Fuente de seguimiento configurada: ${source}`)
    }
  }

  /**
   * Configura la sub-fuente de seguimiento
   * @param {string} subSource - Sub-fuente de seguimiento
   */
  static setSubSource(subSource) {
    const subSourceField = document.getElementById('subfuente') || document.querySelector(`input[name="${this.getFieldId('SUBFUENTE')}"]`)
    if (subSourceField) {
      subSourceField.value = subSource
      console.log(`✅ Sub-fuente de seguimiento configurada: ${subSource}`)
    }
  }

  /**
   * Configura el medio de marketing
   * @param {string} medium - Medio de marketing
   */
  static setMedium(medium) {
    const mediumField = document.getElementById('medio') || document.querySelector(`input[name="${this.getFieldId('MEDIO')}"]`)
    if (mediumField) {
      mediumField.value = medium
      console.log(`✅ Medio de marketing configurado: ${medium}`)
    }
  }

  /**
   * Configura la campaña de marketing
   * @param {string} campaign - Campaña de marketing
   */
  static setCampaign(campaign) {
    const campaignField = document.getElementById('campana') || document.querySelector(`input[name="${this.getFieldId('CAMPANA')}"]`)
    if (campaignField) {
      campaignField.value = campaign
      console.log(`✅ Campaña de marketing configurada: ${campaign}`)
    }
  }

  /**
   * Configura el nivel académico
   * @param {string} academicLevel - Nivel académico
   */
  static setAcademicLevel(academicLevel) {
    const academicLevelField =
      document.getElementById('nivel-academico') || document.querySelector(`input[name="${this.getFieldId('NIVEL_ACADEMICO')}"]`)
    if (academicLevelField) {
      academicLevelField.value = academicLevel
      console.log(`✅ Nivel académico configurado: ${academicLevel}`)
    }
  }

  /**
   * Actualiza los IDs de los campos del formulario según el ambiente
   */
  static updateFieldIds() {
    // Mapeo de IDs de elementos del DOM a claves de configuración
    const fieldMappings = {
      type_doc: 'TIPO_DOCUMENTO',
      document: 'NUMERO_DOCUMENTO',
      phone_code: 'PREFIJO_CELULAR',
      country: 'PAIS_RESIDENCIA',
      department: 'DEPARTAMENTO_RESIDENCIA',
      city: 'CIUDAD_RESIDENCIA',
      admission_period: 'PERIODO_INGRESO',
      program: 'CODIGO_SAE',
      type_attendee: 'TIPO_ASISTENTE',
      attendance_day: 'DIA_ASISTENCIA',
      academic_level: 'NIVEL_ACADEMICO'
    }

    // Actualizar campos con name que cambia según ambiente
    Object.entries(fieldMappings).forEach(([elementId, configKey]) => {
      const element = document.getElementById(elementId)
      if (element) {
        const newId = this.getFieldId(configKey)
        if (newId) {
          element.name = newId
        }
      }
    })

    // Configurar campo de autorización de datos (radio buttons)
    const autorizacionFields = document.querySelectorAll('input[type="radio"][id^="autorizacion_"]')
    autorizacionFields.forEach(field => {
      const authId = this.getFieldId('AUTORIZACION_DATOS')
      if (authId) {
        field.name = authId
      }
    })
  }

  /**
   * Cambia el modo de debug y actualiza la configuración del formulario
   * @param {boolean} debugMode - true para modo test, false para modo producción
   */
  static toggleDebugMode(debugMode) {
    // Preservar los valores actuales de los campos de evento ANTES de cambiar el modo
    const currentEventField =
      document.getElementById('nevento') || document.querySelector(`input[name="${this.getFieldId('NOMBRE_EVENTO')}"]`)
    const currentEventValue = currentEventField ? currentEventField.value : ''

    const currentEventDateField =
      document.getElementById('fevento') || document.querySelector(`input[name="${this.getFieldId('FECHA_EVENTO')}"]`)
    const currentEventDateValue = currentEventDateField ? currentEventDateField.value : ''

    const currentUniversityField =
      document.getElementById('universidad') || document.querySelector(`input[name="${this.getFieldId('UNIVERSIDAD')}"]`)
    const currentUniversityValue = currentUniversityField ? currentUniversityField.value : ''

    const currentArticleField =
      document.getElementById('articulo') || document.querySelector(`input[name="${this.getFieldId('ARTICULO')}"]`)
    const currentArticleValue = currentArticleField ? currentArticleField.value : ''

    const currentCompanyField =
      document.getElementById('empresa-convenio') || document.querySelector(`input[name="${this.getFieldId('EMPRESA_CONVENIO')}"]`)
    const currentCompanyValue = currentCompanyField ? currentCompanyField.value : ''

    const currentSourceField = document.getElementById('fuente') || document.querySelector(`input[name="${this.getFieldId('FUENTE')}"]`)
    const currentSourceValue = currentSourceField ? currentSourceField.value : ''

    const currentSubSourceField =
      document.getElementById('subfuente') || document.querySelector(`input[name="${this.getFieldId('SUBFUENTE')}"]`)
    const currentSubSourceValue = currentSubSourceField ? currentSubSourceField.value : ''

    const currentMediumField = document.getElementById('medio') || document.querySelector(`input[name="${this.getFieldId('MEDIO')}"]`)
    const currentMediumValue = currentMediumField ? currentMediumField.value : ''

    const currentCampaignField = document.getElementById('campana') || document.querySelector(`input[name="${this.getFieldId('CAMPANA')}"]`)
    const currentCampaignValue = currentCampaignField ? currentCampaignField.value : ''

    // Cambiar el modo
    this.PERSONALIZATION.DEBUG_MODE = debugMode

    // Reconfigurar formulario
    this.configureForm()
    this.updateFieldIds()

    // Restaurar los valores de los campos de evento después del cambio de modo
    if (currentEventValue) {
      this.setEventName(currentEventValue)
    }
    if (currentEventDateValue) {
      this.setEventDate(currentEventDateValue)
    }
    if (currentUniversityValue) {
      this.setUniversity(currentUniversityValue)
    }
    if (currentArticleValue) {
      this.setArticle(currentArticleValue)
    }
    if (currentCompanyValue) {
      this.setCompany(currentCompanyValue)
    }
    if (currentSourceValue) {
      this.setSource(currentSourceValue)
    }
    if (currentSubSourceValue) {
      this.setSubSource(currentSubSourceValue)
    }
    if (currentMediumValue) {
      this.setMedium(currentMediumValue)
    }
    if (currentCampaignValue) {
      this.setCampaign(currentCampaignValue)
    }

    // Preservar el nivel académico actual
    const currentAcademicLevelField =
      document.getElementById('nivel-academico') || document.querySelector(`input[name="${this.getFieldId('NIVEL_ACADEMICO')}"]`)
    const currentAcademicLevelValue = currentAcademicLevelField ? currentAcademicLevelField.value : ''

    if (currentAcademicLevelValue) {
      this.setAcademicLevel(currentAcademicLevelValue)
    }

    console.log(`Modo cambiado a: ${this.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`)

    // Log dinámico con el mismo formato que el inicial
    console.log(
      `%c🔧 Formulario ahora en modo: ${this.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`,
      'color: #2196F3; font-weight: bold;'
    )

    // Mostrar notificación visual del cambio
    const notification = document.createElement('div')
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${debugMode ? '#ff9800' : '#4caf50'};
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-weight: bold;
    `
    notification.textContent = `Modo ${debugMode ? 'TEST' : 'PRODUCCIÓN'} activado`
    document.body.appendChild(notification)

    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 3000)
  }

  /**
   * Función global para cambiar fácilmente entre modos desde la consola
   */
  static setTestMode() {
    this.toggleDebugMode(true)
    return 'Modo TEST activado'
  }

  static setProductionMode() {
    this.toggleDebugMode(false)
    return 'Modo PRODUCCIÓN activado'
  }
}

// ============================================
// VARIABLES GLOBALES
// ============================================

// Global variables
let prefijos = []
let programas = []
let periodos = []
let ubicaciones = []
let filteredColegios = []
let formInValid = true
let isSubmitting = false

// Form data object
let formData = {
  first_name: '',
  last_name: '',
  type_doc: '',
  document: '',
  email: '',
  phone: '',
  phone_code: '',
  country: '',
  department: '',
  city: '',
  type_attendee: '',
  attendance_day: '',
  academic_level: '',
  faculty: '',
  program: '',
  admission_period: '',
  authorization_data: '',
  // Event data
  nevento: '',
  fevento: '',
  universidad: '',
  articulo: '',
  empresaConvenio: '',
  fuente: '',
  subfuente: '',
  medio: '',
  campana: ''
}

// Error tracking
let errors = {
  first_name: false,
  last_name: false,
  type_doc: false,
  document: false,
  email: false,
  phone_code: false,
  phone: false,
  country: false,
  department: false,
  city: false,
  type_attendee: false,
  attendance_day: false,
  academic_level: false,
  faculty: false,
  program: false,
  admission_period: false,
  authorization_data: false
}

// ============================================
// FUNCIONES DE LIMPIEZA DE DATOS
// ============================================

function cleanNumbers(text) {
  return text.replace(/[^0-9 ]/g, '')
}

function cleanText(text) {
  return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')
}

function isValidEmail(email) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email.toLowerCase())
}

// ============================================
// SISTEMA DE VALIDACIÓN
// ============================================

const Validators = {
  required(value) {
    return value && value.trim().length > 0
  },

  name(value) {
    return value && value.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())
  },

  email(value) {
    return value && isValidEmail(value.trim())
  },

  phone(value) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return value && value.trim().length >= 7 && phoneRegex.test(value.trim())
  },

  document(value) {
    const docRegex = /^\d{6,12}$/
    return value && docRegex.test(value.trim())
  },

  validateField(fieldElement) {
    const fieldId = fieldElement.id
    const value = fieldElement.value
    let isValid = true
    let message = ''

    // Mapear IDs de elementos a nombres de validación
    const fieldMapping = {
      first_name: 'name',
      last_name: 'name',
      email: 'email',
      phone: 'phone',
      document: 'document',
      type_doc: 'required',
      phone_code: 'required',
      country: 'required',
      department: 'required',
      city: 'required',
      type_attendee: 'required',
      attendance_day: 'required',
      academic_level: 'required',
      faculty: 'required',
      program: 'required',
      admission_period: 'required'
    }

    const validationType = fieldMapping[fieldId]

    switch (validationType) {
      case 'name':
        isValid = this.name(value)
        message = 'Mínimo 2 caracteres, solo letras'
        break
      case 'email':
        isValid = this.email(value)
        message = 'Ingrese un correo electrónico válido'
        break
      case 'phone':
        isValid = this.phone(value)
        message = 'Número de teléfono válido (mínimo 7 dígitos)'
        break
      case 'document':
        isValid = this.document(value)
        message = 'Solo números, entre 6 y 12 dígitos'
        break
      case 'required':
        isValid = this.required(value)
        message = 'Este campo es obligatorio'
        break
      default:
        if (fieldElement.hasAttribute('required')) {
          isValid = this.required(value)
          message = 'Este campo es obligatorio'
        }
        break
    }

    // Mostrar/ocultar errores
    if (isValid) {
      this.clearFieldError(fieldElement)
      this.markAsValid(fieldElement)
    } else {
      this.showFieldError(fieldElement, message)
    }

    return isValid
  },

  showFieldError(input, message) {
    const fieldId = input.id
    const errorElement = document.getElementById(`error_${fieldId}`)

    showError(fieldId, true)

    if (errorElement && message) {
      errorElement.textContent = message
      errorElement.style.display = 'block'
    }
  },

  clearFieldError(input) {
    const fieldId = input.id
    const errorElement = document.getElementById(`error_${fieldId}`)

    if (errorElement) {
      errorElement.style.display = 'none'
    }

    showError(fieldId, false)
  },

  markAsValid(fieldElement) {
    const fieldId = fieldElement.id
    const field = document.getElementById(fieldId)

    if (field) {
      field.classList.add('validated')
      field.classList.remove('error')
    }

    errors[fieldId] = false
    return true
  }
}

// ============================================
// FUNCIONES AUXILIARES DE VALIDACIÓN
// ============================================

function deleteInvalid(field) {
  if (errors[field]) {
    showError(field, false)
  }
}

function showError(fieldId, show = true) {
  const errorElement = document.getElementById(`error_${fieldId}`)
  const fieldElement = document.getElementById(fieldId)

  if (errorElement) {
    errorElement.style.display = show ? 'block' : 'none'
  }

  if (fieldElement) {
    if (show) {
      fieldElement.classList.add('error')
      fieldElement.classList.remove('validated')
    } else {
      fieldElement.classList.remove('error')
    }
  }

  errors[fieldId] = show
}

// ============================================
// CARGA DE DATOS
// ============================================

async function loadData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error loading data from', url, ':', error)
    return null
  }
}

async function getUbicaciones() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.LOCATIONS)
  if (data) {
    ubicaciones = data

    // Populate country select
    const paisSelect = document.getElementById('country')
    paisSelect.innerHTML = '<option value="">*País de residencia</option>'

    Object.keys(ubicaciones).forEach(key => {
      const option = document.createElement('option')
      option.value = key
      option.textContent = ubicaciones[key].nombre
      if (key === 'COL') {
        option.style.fontWeight = '700'
      }
      paisSelect.appendChild(option)
    })

    // Set default country to Colombia
    paisSelect.value = 'COL'
    formData.country = 'COL'
    handleCountryChange()
  }
}

async function getPrefijos() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PREFIXES)
  if (data) {
    prefijos = data.map(pais => ({
      iso2: pais.iso2,
      phoneCode: pais.phoneCode,
      phoneName: pais.nameES
    }))

    // Populate phone prefix select
    const prefijoSelect = document.getElementById('phone_code')
    prefijoSelect.innerHTML = '<option value="">(+) Indicativo</option>'

    prefijos.forEach(pais => {
      const option = document.createElement('option')
      option.value = pais.phoneCode
      option.textContent = `(+${pais.phoneCode}) ${pais.phoneName}`
      if (pais.phoneName === 'Colombia') {
        option.style.backgroundColor = 'aliceBlue'
        option.style.color = '#000000'
        option.style.fontWeight = '900'
      }
      prefijoSelect.appendChild(option)
    })

    // Set default to Colombia +57
    prefijoSelect.value = '57'
    formData.phone_code = '57'
  }
}

async function getProgramas() {
  console.log(`🔄 Cargando programas desde: ${FormConfig.URLS.DATA_SOURCES.PROGRAMS}`)
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PROGRAMS)
  if (data) {
    programas = data
    console.log('✅ Programas cargados:', programas)
    console.log('📊 Niveles disponibles:', Object.keys(programas))
  } else {
    console.error('❌ Error cargando programas')
  }
}

async function getPeriodos() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PERIODS)
  if (data) {
    periodos = data
    console.log('✅ Períodos cargados:', periodos)
    console.log('📊 Estructura detectada:', Array.isArray(periodos) ? 'Array' : 'Object')
    if (!Array.isArray(periodos)) {
      console.log('🎯 Niveles disponibles:', Object.keys(periodos))
    }
  }
}

// ============================================
// MANEJO DE UBICACIONES
// ============================================

function getCiudades(departamentoCode) {
  if (!ubicaciones.COL || !ubicaciones.COL.departamentos) return []

  const departamento = ubicaciones.COL.departamentos.find(dep => dep.codigo === departamentoCode)
  return departamento ? departamento.ciudades : []
}

function handleCountryChange() {
  const paisSelect = document.getElementById('country')
  const depSelect = document.getElementById('department')
  const ciudadSelect = document.getElementById('city')
  const depError = document.getElementById('error_department')
  const ciudadError = document.getElementById('error_city')

  formData.country = paisSelect.value

  if (formData.country === 'COL') {
    // Show department and city selects
    depSelect.style.display = 'block'
    depError.style.display = 'none'

    // Populate departments
    depSelect.innerHTML = '<option value="">*Selecciona el departamento</option>'
    if (ubicaciones.COL && ubicaciones.COL.departamentos) {
      ubicaciones.COL.departamentos.forEach(dep => {
        const option = document.createElement('option')
        option.value = dep.codigo
        option.textContent = dep.nombre
        depSelect.appendChild(option)
      })
    }

    ciudadSelect.style.display = 'none'
    ciudadSelect.innerHTML = '<option value="">*Selecciona la Ciudad</option>'
    ciudadError.style.display = 'none'
  } else {
    // Hide department and city for other countries
    depSelect.style.display = 'none'
    ciudadSelect.style.display = 'none'
    depError.style.display = 'none'
    ciudadError.style.display = 'none'
    formData.department = ''
    formData.city = ''
  }

  deleteInvalid('country')
}

function handleDepartmentChange() {
  const depSelect = document.getElementById('department')
  const ciudadSelect = document.getElementById('city')
  const ciudadError = document.getElementById('error_city')

  formData.department = depSelect.value

  if (formData.department) {
    const ciudades = getCiudades(formData.department)

    ciudadSelect.innerHTML = '<option value="">*Selecciona la Ciudad</option>'
    ciudades.forEach(ciudad => {
      const option = document.createElement('option')
      option.value = ciudad.codigo
      option.textContent = ciudad.nombre
      ciudadSelect.appendChild(option)
    })

    ciudadSelect.style.display = 'block'
    ciudadError.style.display = 'none'
  } else {
    ciudadSelect.style.display = 'none'
    ciudadError.style.display = 'none'
    formData.city = ''
  }

  deleteInvalid('department')
}

// ============================================
// MANEJO DE CAMPOS ACADÉMICOS
// ============================================

function initializeTypeAttendee() {
  const typeAttendeeSelect = document.getElementById('type_attendee')
  if (!typeAttendeeSelect) return

  typeAttendeeSelect.innerHTML = '<option value="">*Tipo de asistente</option>'
  FormConfig.PERSONALIZATION.TYPE_ATTENDEE.forEach(type => {
    const option = document.createElement('option')
    option.value = type
    option.textContent = type
    typeAttendeeSelect.appendChild(option)
  })

  // Note: autoSelectSingleTypeAttendee() se ejecutará después de inicializar todos los campos
}

/**
 * Auto-selecciona el tipo de asistente si solo hay uno disponible
 */
function autoSelectSingleTypeAttendee() {
  const typeAttendeeElement = document.getElementById('type_attendee')
  if (!typeAttendeeElement) return

  const availableTypes = FormConfig.PERSONALIZATION.TYPE_ATTENDEE

  // Si hay exactamente un tipo disponible
  if (availableTypes.length === 1) {
    const singleType = availableTypes[0]

    // Auto-seleccionar el tipo
    typeAttendeeElement.value = singleType
    formData.type_attendee = singleType

    // Ocultar el campo ya que solo hay una opción
    typeAttendeeElement.style.display = 'none'

    // Ejecutar la lógica de cambio para mostrar campos dependientes
    handleTypeAttendeeChange()

    console.log(`✅ Tipo de asistente auto-seleccionado: ${singleType}`)
  }
}

function initializeAttendanceDay() {
  const attendanceDaySelect = document.getElementById('attendance_day')
  if (!attendanceDaySelect) return

  attendanceDaySelect.innerHTML = '<option value="">*Día de asistencia</option>'
  FormConfig.PERSONALIZATION.ATTENDANCE_DAYS.forEach(day => {
    const option = document.createElement('option')
    option.value = day
    option.textContent = day
    attendanceDaySelect.appendChild(option)
  })
}

function initializeAcademicLevel() {
  console.log('🔄 Inicializando nivel académico...')
  let academicLevelSelect = document.getElementById('academic_level')
  console.log('📍 Elemento academic_level existente:', !!academicLevelSelect)

  // Create the element if it doesn't exist
  if (!academicLevelSelect) {
    console.log('🔧 Creando elemento academic_level...')
    const form = document.getElementById('form_inscription')
    const typeAttendeeElement = document.getElementById('type_attendee')

    console.log('📋 Form encontrado:', !!form)
    console.log('📋 TypeAttendee encontrado:', !!typeAttendeeElement)

    if (!form || !typeAttendeeElement) {
      console.log('❌ No se puede crear academic_level - faltan elementos padre')
      return
    }

    // Create the academic level select
    academicLevelSelect = document.createElement('select')
    academicLevelSelect.id = 'academic_level'
    academicLevelSelect.name = FormConfig.getFieldId('NIVEL_ACADEMICO')
    academicLevelSelect.style.display = 'none'
    academicLevelSelect.setAttribute('required', 'required')

    // Create error div
    const errorDiv = document.createElement('div')
    errorDiv.className = 'error_text'
    errorDiv.id = 'error_academic_level'
    errorDiv.style.display = 'none'
    errorDiv.textContent = 'Selecciona un nivel académico de interés'

    // Insert after type_attendee
    typeAttendeeElement.parentNode.insertBefore(academicLevelSelect, typeAttendeeElement.nextSibling)
    academicLevelSelect.parentNode.insertBefore(errorDiv, academicLevelSelect.nextSibling)

    console.log('✅ Elemento academic_level creado e insertado en el DOM')
  } else {
    console.log('✅ Elemento academic_level ya existía')
  }

  academicLevelSelect.innerHTML = '<option value="">*Nivel académico de interés</option>'

  // Si no hay niveles configurados o el array está vacío, usar todos los niveles disponibles de los datos
  let levelsToShow = FormConfig.PERSONALIZATION.LEVEL_ACADEMIC

  if (!levelsToShow || levelsToShow.length === 0) {
    console.log('📋 No hay niveles académicos configurados, usando todos los disponibles de los datos')
    levelsToShow = []

    // Obtener todos los niveles disponibles de los datos de programas
    if (programas && typeof programas === 'object') {
      Object.keys(programas).forEach(levelCode => {
        // Mapear códigos a nombres más amigables
        const levelNames = {
          PREG: 'Pregrado',
          GRAD: 'Posgrado',
          ECLE: 'Eclesiástico',
          ETDH: 'Técnico'
        }

        levelsToShow.push({
          code: levelCode,
          name: levelNames[levelCode] || levelCode
        })
      })
    }

    console.log('✅ Niveles académicos auto-detectados:', levelsToShow)
  } else {
    console.log('📋 Usando niveles académicos configurados:', levelsToShow)
  }

  levelsToShow.forEach(level => {
    const option = document.createElement('option')
    option.value = level.code
    option.textContent = level.name
    academicLevelSelect.appendChild(option)
  })
}

function handleTypeAttendeeChange() {
  console.log('🔄 handleTypeAttendeeChange ejecutada')
  const typeAttendeeSelect = document.getElementById('type_attendee')
  const academicLevelElement = document.getElementById('academic_level')
  const facultyElement = document.getElementById('faculty')
  const programElement = document.getElementById('program')
  const periodElement = document.getElementById('admission_period')

  formData.type_attendee = typeAttendeeSelect.value
  console.log(`👤 Tipo de asistente: ${formData.type_attendee}`)

  if (formData.type_attendee === 'Aspirante') {
    console.log('🎓 Procesando lógica de Aspirante')
    // Show academic fields for applicants
    if (academicLevelElement) {
      console.log('✅ Elemento academic_level encontrado')
      academicLevelElement.style.display = 'block'
      academicLevelElement.setAttribute('required', 'required')

      // Check if we can auto-select academic level immediately
      const availableLevels = FormConfig.PERSONALIZATION.LEVEL_ACADEMIC
      console.log('📋 Niveles académicos disponibles:', availableLevels)
      console.log('📊 Cantidad de niveles:', availableLevels.length)

      if (availableLevels.length === 1) {
        console.log('🔄 Auto-seleccionando nivel único')
        const singleLevel = availableLevels[0]

        // Auto-seleccionar el nivel
        academicLevelElement.value = singleLevel.code
        formData.academic_level = singleLevel.code

        // Actualizar el campo oculto de Salesforce
        FormConfig.setAcademicLevel(singleLevel.code)

        // Ocultar el campo ya que solo hay una opción
        academicLevelElement.style.display = 'none'
        academicLevelElement.removeAttribute('required')

        console.log(`✅ Nivel académico auto-seleccionado: ${singleLevel.name}`)

        // Cargar facultades y períodos con delay para permitir actualización del DOM
        setTimeout(() => {
          console.log(`🚀 Auto-cargando facultades y períodos para: ${singleLevel.code}`)
          loadFaculties(singleLevel.code)
          loadPeriods(singleLevel.code)
        }, 100)
      } else {
        console.log('📊 Múltiples niveles disponibles, mostrando selector')
      }
    } else {
      console.log('❌ Elemento academic_level no encontrado')
    }
  } else {
    console.log('👤 No es aspirante, ocultando campos académicos')
    // Hide academic fields for non-applicants
    if (academicLevelElement) {
      academicLevelElement.style.display = 'none'
      academicLevelElement.removeAttribute('required')
      academicLevelElement.value = ''
      formData.academic_level = ''
    }
    if (facultyElement) {
      facultyElement.style.display = 'none'
      facultyElement.removeAttribute('required')
      facultyElement.value = ''
      formData.faculty = ''
    }
    if (programElement) {
      programElement.style.display = 'none'
      programElement.removeAttribute('required')
      programElement.value = ''
      formData.program = ''
    }
    if (periodElement) {
      periodElement.style.display = 'none'
      periodElement.removeAttribute('required')
      periodElement.value = ''
      formData.admission_period = ''
    }
  }

  deleteInvalid('type_attendee')
}

function handleAcademicLevelChange() {
  const academicLevelSelect = document.getElementById('academic_level')
  formData.academic_level = academicLevelSelect.value

  if (formData.academic_level) {
    console.log(`🎯 Nivel académico cambiado a: ${formData.academic_level}`)

    // Actualizar el campo oculto de Salesforce
    FormConfig.setAcademicLevel(formData.academic_level)

    loadFaculties(formData.academic_level)
    loadPeriods(formData.academic_level)
  } else {
    console.log('❌ Sin nivel académico seleccionado, ocultando campos')

    // Limpiar el campo oculto de Salesforce
    FormConfig.setAcademicLevel('')

    hideFacultyField()
    hideProgramField()
    hidePeriodField()
  }

  deleteInvalid('academic_level')
}

function loadFaculties(academicLevel) {
  const facultySelect = document.getElementById('faculty')
  if (!facultySelect || !programas) {
    console.log('❌ loadFaculties: Missing facultySelect or programas', {
      facultySelect: !!facultySelect,
      programas: !!programas
    })
    return
  }

  console.log(`🔄 Cargando facultades para nivel: ${academicLevel}`)
  console.log('📊 Estructura de programas:', programas)

  // Check if programas has the expected structure
  let levelPrograms = []

  if (programas[academicLevel]) {
    // Structure: programas.PREG, programas.GRAD, etc.
    console.log(`✅ Encontrado nivel ${academicLevel} en programas`)
    const facultyKeys = Object.keys(programas[academicLevel])
    console.log(`📋 Facultades encontradas:`, facultyKeys)

    if (facultyKeys.length > 0) {
      facultySelect.innerHTML = '<option value="">*Facultad de interés</option>'
      facultyKeys.forEach(facultyKey => {
        const option = document.createElement('option')
        option.value = facultyKey
        option.textContent = facultyKey
        facultySelect.appendChild(option)
      })

      facultySelect.style.display = 'block'
      facultySelect.setAttribute('required', 'required')
      console.log('✅ Campo de facultades mostrado correctamente')
      return
    }
  } else if (Array.isArray(programas)) {
    // Structure: array of programs with codigo_nivel property
    levelPrograms = programas.filter(program => program.codigo_nivel === academicLevel)

    if (levelPrograms.length === 0) {
      hideFacultyField()
      return
    }

    // Get unique faculties
    let faculties = [...new Set(levelPrograms.map(program => program.facultad))]

    // Apply faculty filter if configured
    const { FACULTY } = FormConfig.PERSONALIZATION
    if (FACULTY && FACULTY.length > 0) {
      faculties = faculties.filter(faculty => FACULTY.includes(faculty))
    }

    if (faculties.length === 0) {
      hideFacultyField()
      return
    }

    facultySelect.innerHTML = '<option value="">*Facultad de interés</option>'
    faculties.forEach(faculty => {
      const option = document.createElement('option')
      option.value = faculty
      option.textContent = faculty
      facultySelect.appendChild(option)
    })

    facultySelect.style.display = 'block'
    facultySelect.setAttribute('required', 'required')
    return
  }

  // If no valid structure found, hide the field
  hideFacultyField()
}

function loadPeriods(academicLevel) {
  console.log(`🔄 Cargando períodos para nivel: ${academicLevel}`)

  const periodSelect = document.getElementById('admission_period')
  if (!periodSelect || !periodos) {
    console.log('❌ No se encontró periodSelect o periodos están vacíos')
    return
  }

  // Handle both array format (legacy) and object format (current API)
  let levelPeriods = []

  if (Array.isArray(periodos)) {
    console.log('📋 Usando formato array (legacy)')
    // Legacy array format
    levelPeriods = periodos.filter(period => period.nivel_academico === academicLevel || period.nivel_academico === 'TODOS')
  } else if (periodos[academicLevel]) {
    console.log(`📋 Usando formato objeto para nivel: ${academicLevel}`)
    // Current object format from API
    const periodsForLevel = periodos[academicLevel]
    console.log('📊 Períodos encontrados:', periodsForLevel)
    levelPeriods = Object.entries(periodsForLevel).map(([nombre, codigo]) => ({
      codigo: codigo,
      nombre: nombre
    }))
  } else {
    console.log(`❌ No se encontraron períodos para nivel: ${academicLevel}`)
    console.log('🔍 Niveles disponibles:', Object.keys(periodos))
  }

  console.log(`📈 Total de períodos procesados: ${levelPeriods.length}`)

  if (levelPeriods.length === 0) {
    console.log('❌ Sin períodos disponibles, ocultando campo')
    hidePeriodField()
    return
  }

  periodSelect.innerHTML = '<option value="">*Periodo esperado de Ingreso de interés</option>'
  levelPeriods.forEach(period => {
    const option = document.createElement('option')
    option.value = period.codigo
    option.textContent = period.nombre
    periodSelect.appendChild(option)
  })

  periodSelect.style.display = 'block'
  periodSelect.setAttribute('required', 'required')
  console.log('✅ Campo de períodos mostrado correctamente')
}

function handleFacultyChange() {
  const facultySelect = document.getElementById('faculty')
  formData.faculty = facultySelect.value

  if (formData.faculty) {
    loadPrograms(formData.academic_level, formData.faculty)
  } else {
    hideProgramField()
  }

  deleteInvalid('faculty')
}

function loadPrograms(academicLevel, faculty) {
  const programSelect = document.getElementById('program')
  if (!programSelect || !programas) return

  let filteredPrograms = []

  // Check structure: programas.PREG.FACULTAD.Programas vs array format
  if (programas[academicLevel] && programas[academicLevel][faculty] && programas[academicLevel][faculty].Programas) {
    // Structure: programas.PREG.FACULTAD.Programas
    filteredPrograms = programas[academicLevel][faculty].Programas
  } else if (Array.isArray(programas)) {
    // Structure: array of programs with codigo_nivel property
    filteredPrograms = programas.filter(program => program.codigo_nivel === academicLevel && program.facultad === faculty)
  }

  // Apply program filter if configured
  const { PROGRAMS } = FormConfig.PERSONALIZATION
  if (PROGRAMS && PROGRAMS.length > 0) {
    if (filteredPrograms[0] && filteredPrograms[0].Codigo) {
      // Structure with Codigo property
      filteredPrograms = filteredPrograms.filter(program => PROGRAMS.includes(program.Codigo))
    } else {
      // Structure with codigo property
      filteredPrograms = filteredPrograms.filter(program => PROGRAMS.includes(program.codigo))
    }
  }

  if (filteredPrograms.length === 0) {
    hideProgramField()
    return
  }

  programSelect.innerHTML = '<option value="">*Programa de interés</option>'
  filteredPrograms.forEach(program => {
    const option = document.createElement('option')
    // Handle both Codigo and codigo properties
    option.value = program.Codigo || program.codigo
    option.textContent = program.Nombre || program.nombre
    programSelect.appendChild(option)
  })

  programSelect.style.display = 'block'
  programSelect.setAttribute('required', 'required')
}

function hideFacultyField() {
  const facultyElement = document.getElementById('faculty')
  if (facultyElement) {
    facultyElement.style.display = 'none'
    facultyElement.removeAttribute('required')
    facultyElement.value = ''
    formData.faculty = ''
  }
  hideProgramField()
}

function hideProgramField() {
  const programElement = document.getElementById('program')
  if (programElement) {
    programElement.style.display = 'none'
    programElement.removeAttribute('required')
    programElement.value = ''
    formData.program = ''
  }
}

function hidePeriodField() {
  const periodElement = document.getElementById('admission_period')
  if (periodElement) {
    periodElement.style.display = 'none'
    periodElement.removeAttribute('required')
    periodElement.value = ''
    formData.admission_period = ''
  }
}

// ============================================
// VALIDACIÓN COMPLETA DEL FORMULARIO
// ============================================

function validateInputs() {
  let valid = true

  // Required fields validation
  const requiredFields = ['first_name', 'last_name', 'type_doc', 'document', 'email', 'phone_code', 'phone', 'country']

  // Add conditional fields
  if (formData.country === 'COL') {
    const deptElement = document.getElementById('department')
    const cityElement = document.getElementById('city')
    if (deptElement && deptElement.style.display !== 'none') {
      requiredFields.push('department')
    }
    if (cityElement && cityElement.style.display !== 'none') {
      requiredFields.push('city')
    }
  }

  // Add event fields (only if visible)
  const typeAttendeeElement = document.getElementById('type_attendee')
  if (typeAttendeeElement && typeAttendeeElement.style.display !== 'none') {
    requiredFields.push('type_attendee')
  }

  const attendanceDayElement = document.getElementById('attendance_day')
  if (attendanceDayElement && attendanceDayElement.style.display !== 'none') {
    requiredFields.push('attendance_day')
  }

  // Add academic fields if applicable
  if (formData.type_attendee === 'Aspirante') {
    const academicLevelElement = document.getElementById('academic_level')
    if (academicLevelElement && academicLevelElement.style.display !== 'none') {
      requiredFields.push('academic_level')
    }

    const facultyElement = document.getElementById('faculty')
    if (facultyElement && facultyElement.style.display !== 'none') {
      requiredFields.push('faculty')
    }

    const programElement = document.getElementById('program')
    if (programElement && programElement.style.display !== 'none') {
      requiredFields.push('program')
    }

    const periodElement = document.getElementById('admission_period')
    if (periodElement && periodElement.style.display !== 'none') {
      requiredFields.push('admission_period')
    }
  }

  // Validate each field
  requiredFields.forEach(fieldId => {
    const element = document.getElementById(fieldId)
    if (element && !Validators.validateField(element)) {
      valid = false
    }
  })

  // Check authorization
  const authRadios = document.querySelectorAll('input[type="radio"][id^="autorizacion_"]')
  let authSelected = false
  authRadios.forEach(radio => {
    if (radio.checked && radio.value === '1') {
      authSelected = true
    }
  })

  if (!authSelected) {
    showError('authorization_data', true)
    valid = false
  } else {
    // Clear error if authorization is granted
    showError('authorization_data', false)
  }

  return valid
}

// ============================================
// ENVÍO DEL FORMULARIO
// ============================================

function validateForm(e) {
  e.preventDefault()

  if (!validateInputs()) {
    return false
  } else {
    isSubmitting = true
    document.getElementById('submit_btn').disabled = true

    if (FormConfig.PERSONALIZATION.DEV_MODE) {
      console.log('%c🔧 DEV_MODE: Formulario válido - modo desarrollo', 'color: #2196F3; font-weight: bold;')

      // Detailed form data analysis
      console.group('📋 Análisis detallado del formulario')
      console.log('📊 Datos del formulario:', formData)

      // Form fields analysis
      const form = document.getElementById('form_inscription')
      const formDataObj = new FormData(form)

      console.log('📝 FormData completo:')
      for (let [key, value] of formDataObj.entries()) {
        console.log(`  ${key}: ${value}`)
      }

      // Validate required fields
      const requiredFields = [
        'first_name',
        'last_name',
        'email',
        'type_doc',
        'document',
        'phone_code',
        'phone',
        'country',
        'attendance_day',
        'type_attendee'
      ]
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field] === '')

      if (missingFields.length > 0) {
        console.warn('⚠️ Campos requeridos faltantes:', missingFields)
      } else {
        console.log('✅ Todos los campos requeridos están completos')
      }

      // Environment information
      console.log('🔧 Información del ambiente:')
      console.log(`  Modo actual: ${FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`)
      console.log(`  URL Salesforce: ${FormConfig.getSalesforceUrl()}`)
      console.log(`  Email debug: ${FormConfig.PERSONALIZATION.EMAIL_DEBUG}`)

      console.groupEnd()

      const successMsg = document.getElementById('successMsg')
      if (successMsg) {
        successMsg.style.display = 'block'
        successMsg.textContent = '✅ Formulario enviado correctamente (modo desarrollo)'
      }

      setTimeout(() => {
        if (confirm('¿Deseas limpiar el formulario?')) {
          location.reload()
        }
      }, 2000)
    } else {
      document.getElementById('form_inscription').submit()
    }
  }
}

// ============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

function setupEventListeners() {
  // Name fields
  const firstNameElement = document.getElementById('first_name')
  if (firstNameElement) {
    firstNameElement.addEventListener('input', e => {
      const cleaned = cleanText(e.target.value)
      e.target.value = cleaned
      formData.first_name = cleaned
      deleteInvalid('first_name')
    })

    firstNameElement.addEventListener('blur', e => {
      Validators.validateField(e.target)
    })
  }

  document.getElementById('last_name').addEventListener('input', e => {
    const cleaned = cleanText(e.target.value)
    e.target.value = cleaned
    formData.last_name = cleaned
    deleteInvalid('last_name')
  })

  document.getElementById('last_name').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Document fields
  document.getElementById('type_doc').addEventListener('change', e => {
    formData.type_doc = e.target.value
    deleteInvalid('type_doc')
    Validators.validateField(e.target)
  })

  document.getElementById('type_doc').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('document').addEventListener('input', e => {
    const cleaned = cleanNumbers(e.target.value)
    e.target.value = cleaned
    formData.document = cleaned
    deleteInvalid('document')
  })

  document.getElementById('document').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Email field
  document.getElementById('email').addEventListener('input', e => {
    formData.email = e.target.value
    // Real-time validation for email
    if (e.target.value.trim() !== '') {
      Validators.validateField(e.target)
    } else {
      deleteInvalid('email')
    }
  })

  document.getElementById('email').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Phone fields
  document.getElementById('phone').addEventListener('input', e => {
    const cleaned = cleanNumbers(e.target.value)
    e.target.value = cleaned
    formData.phone = cleaned
    deleteInvalid('phone')
  })

  document.getElementById('phone').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('phone_code').addEventListener('change', e => {
    formData.phone_code = e.target.value
    deleteInvalid('phone_code')
    Validators.validateField(e.target)
  })

  document.getElementById('phone_code').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Location fields
  document.getElementById('country').addEventListener('change', e => {
    handleCountryChange()
    Validators.validateField(e.target)
  })

  document.getElementById('country').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('department').addEventListener('change', e => {
    handleDepartmentChange()
    Validators.validateField(e.target)
  })

  document.getElementById('department').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('city').addEventListener('change', e => {
    formData.city = e.target.value
    deleteInvalid('city')
    Validators.validateField(e.target)
  })

  document.getElementById('city').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Event fields
  document.getElementById('type_attendee').addEventListener('change', e => {
    handleTypeAttendeeChange()
    Validators.validateField(e.target)
  })

  document.getElementById('type_attendee').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('attendance_day').addEventListener('change', e => {
    formData.attendance_day = e.target.value
    deleteInvalid('attendance_day')
    Validators.validateField(e.target)
  })

  document.getElementById('attendance_day').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Academic fields
  const academicLevelElement = document.getElementById('academic_level')
  if (academicLevelElement) {
    academicLevelElement.addEventListener('change', e => {
      handleAcademicLevelChange()
      Validators.validateField(e.target)
    })

    academicLevelElement.addEventListener('blur', e => {
      Validators.validateField(e.target)
    })
  }

  const facultyElement = document.getElementById('faculty')
  if (facultyElement) {
    facultyElement.addEventListener('change', e => {
      handleFacultyChange()
      Validators.validateField(e.target)
    })

    facultyElement.addEventListener('blur', e => {
      Validators.validateField(e.target)
    })
  }

  document.getElementById('program').addEventListener('change', e => {
    formData.program = e.target.value
    deleteInvalid('program')
    Validators.validateField(e.target)
  })

  document.getElementById('program').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('admission_period').addEventListener('change', e => {
    formData.admission_period = e.target.value
    deleteInvalid('admission_period')
    Validators.validateField(e.target)
  })

  document.getElementById('admission_period').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Authorization radios
  const authRadios = document.querySelectorAll('input[type="radio"][id^="autorizacion_"]')
  authRadios.forEach(radio => {
    radio.addEventListener('change', e => {
      formData.authorization_data = e.target.value
      deleteInvalid('authorization_data')

      if (e.target.value === '1') {
        // Authorization granted - enable submit and clear error
        document.getElementById('submit_btn').disabled = false
        showError('authorization_data', false)
      } else {
        // Authorization denied - disable submit and show error immediately
        document.getElementById('submit_btn').disabled = true
        showError('authorization_data', true)
      }
    })
  })

  // Form submission
  document.getElementById('form_inscription').addEventListener('submit', validateForm)

  console.log('✅ Event listeners configurados')
}

// ============================================
// MANEJO DE PARÁMETROS URL
// ============================================

/**
 * Obtiene y procesa parámetros de la URL para configurar el evento
 */
function getParametersFromURL() {
  const urlParams = new URLSearchParams(window.location.search)

  // Obtener nombre del evento desde URL
  const eventName = urlParams.get('nevento') || urlParams.get('evento') || ''
  if (eventName) {
    formData.nevento = eventName
    FormConfig.setEventName(eventName)
  }

  console.log('🌐 Parámetros URL procesados:', {
    nevento: formData.nevento
  })
}

// ============================================
// INICIALIZACIÓN
// ============================================

async function initForm() {
  try {
    console.log('🚀 Inicializando formulario de eventos...')

    // Load data
    await Promise.all([getUbicaciones(), getPrefijos(), getProgramas(), getPeriodos()])

    // Initialize form fields
    initializeTypeAttendee()
    initializeAttendanceDay()
    initializeAcademicLevel()

    // Configure form based on environment
    FormConfig.configureForm()
    FormConfig.updateFieldIds()

    // Get URL parameters for event configuration
    getParametersFromURL()

    // Set event name from configuration if specified
    if (FormConfig.PERSONALIZATION.EVENT_NAME) {
      FormConfig.setEventName(FormConfig.PERSONALIZATION.EVENT_NAME)
    }

    // Set event date from configuration if specified
    if (FormConfig.PERSONALIZATION.EVENT_DATE) {
      FormConfig.setEventDate(FormConfig.PERSONALIZATION.EVENT_DATE)
    }

    // Set university from configuration if specified
    if (FormConfig.PERSONALIZATION.UNIVERSITY) {
      FormConfig.setUniversity(FormConfig.PERSONALIZATION.UNIVERSITY)
    }

    // Set article from configuration if specified
    if (FormConfig.PERSONALIZATION.ARTICLE) {
      FormConfig.setArticle(FormConfig.PERSONALIZATION.ARTICLE)
    }

    // Set company from configuration if specified
    if (FormConfig.PERSONALIZATION.COMPANY) {
      FormConfig.setCompany(FormConfig.PERSONALIZATION.COMPANY)
    }

    // Set source from configuration if specified
    if (FormConfig.PERSONALIZATION.SOURCE) {
      FormConfig.setSource(FormConfig.PERSONALIZATION.SOURCE)
    }

    // Set sub-source from configuration if specified
    if (FormConfig.PERSONALIZATION.SUB_SOURCE) {
      FormConfig.setSubSource(FormConfig.PERSONALIZATION.SUB_SOURCE)
    }

    // Set medium from configuration if specified
    if (FormConfig.PERSONALIZATION.MEDIUM) {
      FormConfig.setMedium(FormConfig.PERSONALIZATION.MEDIUM)
    }

    // Set campaign from configuration if specified
    if (FormConfig.PERSONALIZATION.CAMPAIGN) {
      FormConfig.setCampaign(FormConfig.PERSONALIZATION.CAMPAIGN)
    }

    // Setup event listeners
    setupEventListeners()

    // Auto-select single type attendee after all fields are initialized
    autoSelectSingleTypeAttendee()

    console.log('✅ Formulario inicializado correctamente')
  } catch (error) {
    console.error('❌ Error al inicializar:', error)
  }
}

// ============================================
// FUNCIONES GLOBALES PARA CONTROL DE MODO
// ============================================

// Exponer funciones al scope global para facilitar el uso desde la consola
window.setTestMode = () => FormConfig.setTestMode()
window.setProductionMode = () => FormConfig.setProductionMode()
window.toggleDebugMode = mode => FormConfig.toggleDebugMode(mode)
window.getCurrentMode = () => (FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCTION')

// Funciones adicionales para DEV_MODE
window.toggleDevMode = enabled => {
  FormConfig.PERSONALIZATION.DEV_MODE = enabled !== undefined ? enabled : !FormConfig.PERSONALIZATION.DEV_MODE
  console.log(`🔧 DEV_MODE ${FormConfig.PERSONALIZATION.DEV_MODE ? 'activado' : 'desactivado'}`)
  return FormConfig.PERSONALIZATION.DEV_MODE
}

window.getDevMode = () => FormConfig.PERSONALIZATION.DEV_MODE

window.showFormConfig = () => {
  console.group('⚙️ Configuración actual del formulario')
  console.log('🎯 Personalización:', FormConfig.PERSONALIZATION)
  console.log('🔗 URLs:', FormConfig.URLS)
  console.log('📝 Mapeo de campos:', FormConfig.FIELD_MAPPING)
  console.groupEnd()

  console.log(Date)
}

window.showFieldMappingTable = () => {
  console.group('📋 Tabla de Mapeo de Campos - Sandbox vs Producción')

  // Preparar datos para la tabla
  const tableData = []
  Object.entries(FormConfig.FIELD_MAPPING).forEach(([fieldName, mapping]) => {
    // Obtener el valor actual del campo
    let currentValue = ''
    const activeFieldId = FormConfig.getFieldId(fieldName)

    // Buscar el elemento por ID activo o por name
    let element = document.querySelector(`[name="${activeFieldId}"]`)
    if (!element) {
      // Intentar buscar por ID específicos conocidos
      const elementMappings = {
        NOMBRE_EVENTO: 'nevento',
        FECHA_EVENTO: 'fevento',
        UNIVERSIDAD: 'universidad',
        ARTICULO: 'articulo',
        EMPRESA_CONVENIO: 'empresa-convenio',
        FUENTE: 'fuente',
        SUBFUENTE: 'subfuente',
        MEDIO: 'medio',
        CAMPANA: 'campana',
        NIVEL_ACADEMICO: 'nivel-academico'
      }

      if (elementMappings[fieldName]) {
        element = document.getElementById(elementMappings[fieldName])
      }
    }

    if (element) {
      if (element.type === 'radio') {
        // Para radio buttons, buscar el seleccionado
        const radioGroup = document.querySelectorAll(`[name="${activeFieldId}"]`)
        const selectedRadio = Array.from(radioGroup).find(radio => radio.checked)
        currentValue = selectedRadio ? selectedRadio.value : ''
      } else {
        currentValue = element.value || ''
      }
    } else {
      currentValue = '❌ No encontrado'
    }

    tableData.push({
      Campo: fieldName,
      'ID Sandbox (TEST)': mapping.test,
      'ID Producción (PROD)': mapping.prod,
      'Modo Actual': FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PROD',
      'Valor Actual': currentValue || '⚪ Vacío'
    })
  })

  // Mostrar tabla
  console.table(tableData)

  // Información adicional
  console.log(`🔧 Modo actual: ${FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST (Sandbox)' : 'PRODUCCIÓN'}`)
  console.log(`📊 Total de campos mapeados: ${Object.keys(FormConfig.FIELD_MAPPING).length}`)

  // Mostrar también los valores de formData para comparación
  console.group('📄 Valores en formData (objeto JavaScript)')
  console.table(formData)
  console.groupEnd()

  console.groupEnd()
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initForm)

// Log inicial del modo actual
console.log(
  `%c🔧 Formulario inicializado en modo: ${FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`,
  'color: #2196F3; font-weight: bold;'
)
console.log(
  `%c🚀 DEV_MODE: ${FormConfig.PERSONALIZATION.DEV_MODE ? 'ACTIVADO' : 'DESACTIVADO'}`,
  `color: ${FormConfig.PERSONALIZATION.DEV_MODE ? '#4CAF50' : '#FF5722'}; font-weight: bold;`
)
console.log('%c💡 Para cambiar el modo, usa:', 'color: #666;')
console.log('%c   • setTestMode()       - Cambiar a modo TEST', 'color: #FF9800;')
console.log('%c   • setProductionMode() - Cambiar a modo PRODUCCIÓN', 'color: #4CAF50;')
console.log('%c   • getCurrentMode()    - Ver modo actual', 'color: #2196F3;')
console.log('%c   • toggleDevMode()     - Alternar DEV_MODE', 'color: #9C27B0;')
console.log('%c   • getDevMode()        - Ver estado DEV_MODE', 'color: #9C27B0;')
console.log('%c   • showFormConfig()    - Mostrar configuración', 'color: #607D8B;')
console.log('%c   • showFieldMappingTable() - Tabla de mapeo de campos', 'color: #795548;')

// Mostrar tabla de campos automáticamente en DEV_MODE
if (FormConfig.PERSONALIZATION.DEV_MODE) {
  console.log('%c🔧 DEV_MODE activado - Mostrando tabla de mapeo de campos:', 'color: #FF9800; font-weight: bold;')
  setTimeout(() => {
    window.showFieldMappingTable()
  }, 1000)
}
