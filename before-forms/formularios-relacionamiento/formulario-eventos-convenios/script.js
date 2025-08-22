/**
 * Formulario de inscripción a eventos - Pontificia Universidad Javeriana
 * Configuración para Eventos Convenios
 * @version 2.0
 */

// ============================================
// CONFIGURACIÓN CENTRALIZADA
// ============================================
class FormConfig {
  static PERSONALIZATION = {
    // ============================================
    // INICIO - PERSONALIZACIÓN DEL FORMULARIO
    // ============================================

    CAMPAIGN: 'EVENTOS_CONVENIOS', // Código de campaña para seguimiento

    // TIPOS DE ASISTENTE
    // Define qué opciones aparecerán en el campo "Tipo de asistente"
    TYPE_ATTENDEE: [
      'Aspirante', // ✅ Activo - Personas interesadas en estudiar
      'Padre de familia y/o acudiente', // ✅ Activo - Familiares de aspirantes
      'Docente y/o psicoorientador', // ✅ Activo - Personal educativo
      'Visitante PUJ', // ✅ Activo - Visitantes de la universidad
      'Administrativo PUJ' // ✅ Activo - Personal administrativo
    ],

    // NIVELES ACADÉMICOS DISPONIBLES
    // Para convenios pueden ser múltiples niveles
    LEVEL_ACADEMIC: [
      { code: 'PREG', name: 'Pregrado' },
      { code: 'GRAD', name: 'Posgrado' },
      { code: 'ECLE', name: 'Eclesiástico' },
      { code: 'ETDH', name: 'Técnico' }
    ],

    // CAMPOS A OCULTAR DEL FORMULARIO
    // Se oculta nivel académico por defecto, se muestra según el programa
    REMOVE_FIELDS: ['nivel_academico'],

    // CONFIGURACIONES DE DESARROLLO Y DEBUG
    DEV_MODE: true, // true = Simula envío | false = Envía realmente
    DEBUG_MODE: true, // true = Entorno de pruebas (IDs test) | false = Producción (IDs prod)
    EMAIL_DEBUG: 'DesarrolladorDMPA@javeriana.edu.co' // Email para recibir datos de prueba

    // ============================================
    // FIN - PERSONALIZACIÓN DEL FORMULARIO
    // ============================================
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
      test: '00N04000002IUPh',
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
      test: '00NO4000000sTR',
      prod: '00NJw000001J3g6'
    },
    EMPRESA_CONVENIO: {
      test: '00N04000005begL',
      prod: '00NJw000006f1BC'
    },
    ORIGEN_SOLICITUD: {
      test: '00N04000002ZeP',
      prod: '00NJw000001J3Hl'
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
      test: '00N04000001lzt',
      prod: '00NJw000001J3g8'
    },
    CAMPANA: {
      test: '00N7j000002BfKF',
      prod: '00N5G00000Wmi8x'
    },
    ARTICULO: {
      test: '00N0400000D2PvT',
      prod: '00NJw000006f1BB'
    },
    NOMBRE_EVENTO: {
      test: '00N0400000AIaXR',
      prod: '00NJw000006f1BF'
    },
    FECHA_EVENTO: {
      test: '00N0400000AIanI',
      prod: '00NJw000006f1BE'
    },
    AUTORIZACION_DATOS: {
      test: '00N7j000002BI3m',
      prod: 'autorizacion'
    }
  }

  // ============================================
  // URLS SEGÚN AMBIENTE
  // ============================================
  static URLS = {
    THANK_YOU: 'https://cloud.cx.javeriana.edu.co/EVENTOS_TKY',
    PRIVACY_POLICY: 'https://www.javeriana.edu.co/informacion/politica-y-tratamiento-de-datos-personales',

    SALESFORCE: {
      test: 'https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
      prod: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'
    },

    DATA_SOURCES: {
      LOCATIONS: 'https://www.javeriana.edu.co/recursosdb/1372208/10609114/ubicaciones.json',
      PREFIXES: 'https://www.javeriana.edu.co/recursosdb/1372208/10609114/codigos_pais.json',
      PROGRAMS: 'https://www.javeriana.edu.co/recursosdb/1372208/10609114/programas.json',
      PERIODS: 'https://www.javeriana.edu.co/recursosdb/1372208/10609114/periodos.json'
    }
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
   * Configura el formulario según el ambiente actual
   */
  static configureForm() {
    const form = document.getElementById('form_SF')
    if (form) {
      // Configurar action del formulario
      form.action = this.getSalesforceUrl()

      // Configurar campos debug
      const debugField = document.querySelector('input[name="debug"]')
      const debugEmailField = document.querySelector('input[name="debugEmail"]')

      if (debugField) {
        debugField.value = this.PERSONALIZATION.DEBUG_MODE ? '1' : '0'
      }

      if (debugEmailField) {
        debugEmailField.value = this.PERSONALIZATION.DEBUG_MODE ? this.PERSONALIZATION.EMAIL_DEBUG : ''
      }

      // Configurar retURL
      const retURLField = document.getElementById('retURL')
      if (retURLField) {
        retURLField.value = this.URLS.THANK_YOU
      }
    }
  }

  /**
   * Actualiza los IDs de los campos del formulario según el ambiente
   */
  static updateFieldIds() {
    // Mapeo de IDs de elementos del DOM a claves de configuración
    const fieldMappings = {
      tipo_doc: 'TIPO_DOCUMENTO',
      numero_doc: 'NUMERO_DOCUMENTO',
      prefijoCel: 'PREFIJO_CELULAR',
      pais: 'PAIS_RESIDENCIA',
      departamento: 'DEPARTAMENTO_RESIDENCIA',
      ciudad: 'CIUDAD_RESIDENCIA',
      periodo_esperado: 'PERIODO_INGRESO',
      fuenteAutoriza: 'FUENTE_AUTORIZACION',
      programa: 'CODIGO_SAE',
      programa_noap: 'CODIGO_SAE',
      tipo_asistente: 'TIPO_ASISTENTE',
      empresa_convenio: 'EMPRESA_CONVENIO',
      origen_sol: 'ORIGEN_SOLICITUD',
      fuente: 'FUENTE',
      subfuente: 'SUBFUENTE',
      medio: 'MEDIO',
      campana: 'CAMPANA',
      articulo: 'ARTICULO',
      nevento: 'NOMBRE_EVENTO',
      fevento: 'FECHA_EVENTO'
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
    const autorizacionFields = document.querySelectorAll('input[type="radio"]')
    autorizacionFields.forEach(field => {
      if (field.id && (field.id === 'autoriza-si' || field.id === 'autoriza-no')) {
        const authId = this.getFieldId('AUTORIZACION_DATOS')
        if (authId) {
          field.name = authId
        }
      }
    })
  }

  /**
   * Cambia el modo de debug y actualiza la configuración del formulario
   * @param {boolean} debugMode - true para modo test, false para modo producción
   */
  static toggleDebugMode(debugMode) {
    this.PERSONALIZATION.DEBUG_MODE = debugMode

    // Reconfigurar formulario
    this.configureForm()
    this.updateFieldIds()

    console.log(`Modo cambiado a: ${debugMode ? 'TEST' : 'PRODUCCIÓN'}`)

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
  }

  static setProductionMode() {
    this.toggleDebugMode(false)
  }
}

// ============================================
// VARIABLES GLOBALES Y ESTADO DEL FORMULARIO
// ============================================

// Global variables
let prefijoCel = []
let programas = []
let periodos = []
let ubicaciones = []
let periodoSel = []
let formInValid = true
let isSubmitting = false

// Form data object
let formData = {
  nevento: '',
  fevento: '',
  first_name: '',
  last_name: '',
  tipo_doc: '',
  numero_doc: '',
  email: '',
  mobile: '',
  prefijoCel: '',
  pais: '',
  departamento: '',
  ciudad: '',
  tipo_asistente: '',
  nivelacademico: 'PREG',
  facultad: '',
  programa: 'NOAP',
  empresa_convenio: '',
  periodo_esperado: '',
  origen_sol: 'Web to Lead',
  fuenteAutoriza: 'Landing Eventos',
  lead: 'Landing Pages',
  company: 'NA',
  fuente: 'Javeriana',
  subfuente: 'Organico',
  medio: 'Landing',
  articulo: 'Articulo',
  campana: '',
  autoriza: ''
}

// Error tracking object
let errors = {
  nevento: false,
  fevento: false,
  first_name: false,
  last_name: false,
  tipo_doc: false,
  numero_doc: false,
  email: false,
  mobile: false,
  prefijoCel: false,
  pais: false,
  departamento: false,
  ciudad: false,
  tipo_asistente: false,
  nivelacademico: false,
  facultad: false,
  programa: false,
  empresa_convenio: false,
  periodo_esperado: false,
  autoriza: false
}

// ============================================
// FUNCIONES UTILITARIAS
// ============================================

function cleanNumbers(text) {
  return text.replace(/[^0-9 ]/g, '')
}

function cleanText(text) {
  return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '')
}

function isValidEmail(email) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

// ============================================
// SISTEMA DE VALIDACIÓN MEJORADO
// ============================================

const Validators = {
  required(value) {
    return value && value.trim().length > 0
  },

  name(value) {
    return value && value.trim().length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value.trim())
  },

  email(value) {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return value && emailRegex.test(value.trim())
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
    const fieldName = fieldElement.name
    const value = fieldElement.value
    let isValid = true
    let message = ''

    // Mapear IDs de elementos a nombres de validación
    const fieldMapping = {
      first_name: 'name',
      last_name: 'name',
      email: 'email',
      mobile: 'phone',
      numero_doc: 'document',
      nevento: 'required',
      fevento: 'required',
      tipo_doc: 'required',
      prefijoCel: 'required',
      pais: 'required',
      departamento: 'required',
      ciudad: 'required',
      tipo_asistente: 'required',
      nivelacademico: 'required',
      facultad: 'required',
      programa: 'required',
      periodo_esperado: 'required',
      empresa_convenio: 'required'
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
        // Para campos no mapeados, solo verificar si es requerido
        if (fieldElement.hasAttribute('required')) {
          isValid = this.required(value)
          message = 'Este campo es obligatorio'
        }
        break
    }

    // Validaciones especiales
    if (fieldId === 'programa' && value === 'NOAP' && formData.tipo_asistente === 'Aspirante') {
      isValid = false
      message = 'Debes seleccionar un programa específico'
    }

    // Mostrar/ocultar errores con el nuevo sistema
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

    this.clearError(fieldId)

    if (message) {
      this.showError(fieldId)
      if (errorElement) {
        errorElement.textContent = message
        errorElement.style.display = 'block'
      }
    } else {
      if (errorElement) {
        errorElement.style.display = 'none'
      }
    }
  },

  clearFieldError(input) {
    const fieldId = input.id
    const errorElement = document.getElementById(`error_${fieldId}`)

    if (errorElement) {
      errorElement.style.display = 'none'
    }

    this.clearError(fieldId)
  },

  showError(fieldId) {
    const field = document.getElementById(fieldId)
    const label = field?.parentElement.querySelector('label')

    if (field) {
      field.classList.add('error')
      field.classList.remove('validated')
      if (label) {
        label.classList.add('error')
      }
    }
  },

  clearError(fieldId) {
    const field = document.getElementById(fieldId)
    const label = field?.parentElement.querySelector('label')

    if (field) {
      field.classList.remove('error')
      if (label) label.classList.remove('error')
    }
  },

  markAsValid(fieldElement) {
    const fieldId = fieldElement.id
    const field = document.getElementById(fieldId)
    const label = field?.parentElement.querySelector('label')

    if (field) {
      field.classList.add('validated')
      field.classList.remove('error')
      if (label) {
        label.classList.remove('error')
      }
    }

    return true
  },

  // Validar campos ocultos cuando se muestran
  validateHiddenFields() {
    let isValid = true

    // Validar campos según el tipo de asistente
    if (formData.tipo_asistente === 'Aspirante') {
      const fieldsToValidate = ['nivelacademico', 'facultad', 'programa', 'periodo_esperado', 'empresa_convenio']
      fieldsToValidate.forEach(fieldId => {
        const fieldElement = document.getElementById(fieldId)
        if (fieldElement && !this.validateField(fieldElement)) {
          isValid = false
        }
      })
    } else if (formData.tipo_asistente === 'Docente y/o psicoorientador') {
      const fieldElement = document.getElementById('empresa_convenio')
      if (fieldElement && !this.validateField(fieldElement)) {
        isValid = false
      }
    }

    return isValid
  },

  // Limpiar errores de campos ocultos
  clearHiddenFieldErrors() {
    const hiddenFields = ['nivelacademico', 'facultad', 'programa', 'periodo_esperado', 'empresa_convenio']
    hiddenFields.forEach(fieldId => {
      showError(fieldId, false)
      this.clearError(fieldId)
    })
  }
}

// ============================================
// MANEJO DE ERRORES
// ============================================

// Show/hide error messages
function showError(fieldId, show = true) {
  const errorElement = document.getElementById(`error_${fieldId}`)
  const fieldElement = document.getElementById(fieldId)

  if (errorElement) {
    errorElement.style.display = show ? 'block' : 'none'
  }

  if (fieldElement) {
    if (show) {
      fieldElement.classList.add('error')
    } else {
      fieldElement.classList.remove('error')
    }
  }

  errors[fieldId] = show
}

// Clear errors for a field
function deleteInvalid(field) {
  if (formData[field] && formData[field] !== '') {
    showError(field, false)
  }
}

// ============================================
// MANEJO DE PARÁMETROS URL
// ============================================

// Get URL parameters
function getParametersGet() {
  const urlParams = new URLSearchParams(window.location.search)
  formData.fuente = urlParams.get('utm_source') || 'Javeriana'
  formData.subfuente = urlParams.get('utm_subsource') || 'Organico'
  formData.medio = urlParams.get('utm_medium') || 'Landing'
  formData.articulo = urlParams.get('utm_article') || 'articulo'
  formData.campana = urlParams.get('utm_campaign') || 'Vive_la_Javeriana'
  formData.fevento = urlParams.get('fevento') || ''
  formData.nevento = urlParams.get('nevento') || ''

  // Update form fields
  document.getElementById('nevento').value = formData.nevento
  document.getElementById('fevento').value = formData.fevento
  document.getElementById('fuente').value = formData.fuente
  document.getElementById('subfuente').value = formData.subfuente
  document.getElementById('medio').value = formData.medio
  document.getElementById('articulo').value = formData.articulo
  document.getElementById('campana').value = formData.campana
}

// ============================================
// CARGA DE DATOS JSON
// ============================================

// Load JSON data functions
async function loadData(url) {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (error) {
    console.error(`Error loading ${url}:`, error)
    return null
  }
}

async function getProgramas() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PROGRAMS)
  if (data) {
    programas = data
  }
}

async function getPeriodos() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PERIODS)
  if (data) {
    periodos = data
  }
}

async function getUbicaciones() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.LOCATIONS)
  if (data) {
    ubicaciones = data

    // Populate countries
    const paisSelect = document.getElementById('pais')
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
  }
}

async function getPrefijoCel() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PREFIXES)
  if (data) {
    prefijoCel = data.map(pais => ({
      iso2: pais.iso2,
      phoneCode: pais.phoneCode,
      phoneName: pais.nameES
    }))

    // Populate phone prefix select
    const prefijoSelect = document.getElementById('prefijoCel')
    prefijoSelect.innerHTML = '<option value="">(+) Indicativo</option>'

    prefijoCel.forEach(pais => {
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
  }
}

// ============================================
// MANEJO DE UBICACIONES
// ============================================

// Location handling
function getCiudades(departamentoCode) {
  if (!ubicaciones.COL || !ubicaciones.COL.departamentos) return []

  const departamento = ubicaciones.COL.departamentos.find(dep => dep.codigo === departamentoCode)
  return departamento ? departamento.ciudades : []
}

function handlePaisChange() {
  const paisSelect = document.getElementById('pais')
  const depSelect = document.getElementById('departamento')
  const ciudadSelect = document.getElementById('ciudad')
  const depError = document.getElementById('error_departamento')
  const ciudadError = document.getElementById('error_ciudad')

  formData.pais = paisSelect.value

  if (formData.pais === 'COL') {
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
  } else {
    // Hide department and city selects
    depSelect.style.display = 'none'
    ciudadSelect.style.display = 'none'
    depError.style.display = 'none'
    ciudadError.style.display = 'none'
    formData.departamento = ''
    formData.ciudad = ''
  }

  deleteInvalid('pais')
}

function handleDepartamentoChange() {
  const depSelect = document.getElementById('departamento')
  const ciudadSelect = document.getElementById('ciudad')
  const ciudadError = document.getElementById('error_ciudad')

  formData.departamento = depSelect.value

  if (formData.departamento) {
    // Show city select and populate it
    ciudadSelect.style.display = 'block'
    ciudadError.style.display = 'none'

    const ciudades = getCiudades(formData.departamento)
    ciudadSelect.innerHTML = '<option value="">*Selecciona la Ciudad</option>'
    ciudades.forEach(ciudad => {
      const option = document.createElement('option')
      option.value = ciudad.codigo
      option.textContent = ciudad.nombre
      ciudadSelect.appendChild(option)
    })
  } else {
    ciudadSelect.style.display = 'none'
    ciudadError.style.display = 'none'
    formData.ciudad = ''
  }

  deleteInvalid('departamento')
}

function handleCiudadChange() {
  const ciudadSelect = document.getElementById('ciudad')
  formData.ciudad = ciudadSelect.value
  deleteInvalid('ciudad')
}

// ============================================
// MANEJO DE TIPOS DE ASISTENTE
// ============================================

// Attendee type handling
function handleTipoAsistenteChange() {
  const tipoSelect = document.getElementById('tipo_asistente')
  const empresaSection = document.getElementById('empresa_section')
  const programaSection = document.getElementById('programa_section')
  const periodoSection = document.getElementById('periodo_section')
  const nivelSelect = document.getElementById('nivelacademico')
  const programaNoap = document.getElementById('programa_noap')

  formData.tipo_asistente = tipoSelect.value

  // Limpiar errores de campos ocultos primero
  Validators.clearHiddenFieldErrors()

  // Reset dependent fields
  formData.nivelacademico = ''
  formData.facultad = ''
  formData.empresa_convenio = ''
  formData.programa = ''

  if (formData.tipo_asistente === 'Aspirante') {
    // Show empresa, program and period sections
    empresaSection.style.display = 'block'
    programaSection.style.display = 'block'

    // Set nivel academico to PREG by default
    formData.nivelacademico = 'PREG'
    nivelSelect.value = 'PREG'

    // Load periods for PREG
    if (periodos.PREG) {
      periodoSel = periodos.PREG
    }

    // Clear NOAP
    programaNoap.value = ''

    // Load faculties
    loadFacultades()
  } else if (formData.tipo_asistente === 'Docente y/o psicoorientador') {
    // Show only empresa section
    empresaSection.style.display = 'block'
    programaSection.style.display = 'none'
    periodoSection.style.display = 'none'

    // Set program to NOAP
    formData.programa = 'NOAP'
    programaNoap.value = 'NOAP'
  } else {
    // Hide all sections
    empresaSection.style.display = 'none'
    programaSection.style.display = 'none'
    periodoSection.style.display = 'none'

    // Set program to NOAP for others
    formData.programa = 'NOAP'
    programaNoap.value = 'NOAP'
  }

  deleteInvalid('tipo_asistente')
}

// ============================================
// MANEJO DE FACULTADES Y PROGRAMAS
// ============================================

// Faculty and program handling
function loadFacultades() {
  const facultadSelect = document.getElementById('facultad')
  facultadSelect.innerHTML = '<option value="">*Selecciona la facultad</option>'

  if (programas.PREG) {
    Object.keys(programas.PREG).forEach(facultadCode => {
      const option = document.createElement('option')
      option.value = facultadCode
      option.textContent = facultadCode
      facultadSelect.appendChild(option)
    })
  }
}

function handleFacultadChange() {
  const facultadSelect = document.getElementById('facultad')
  const programaSelect = document.getElementById('programa')
  const periodoSection = document.getElementById('periodo_section')

  formData.facultad = facultadSelect.value

  if (formData.facultad) {
    // Show program select
    programaSelect.style.display = 'block'

    // Populate programs
    programaSelect.innerHTML = '<option value="">*Selecciona el programa</option><option value="NOAP" style="display: none;">NOAP</option>'

    if (programas.PREG && programas.PREG[formData.facultad] && programas.PREG[formData.facultad].Programas) {
      programas.PREG[formData.facultad].Programas.forEach(prog => {
        const option = document.createElement('option')
        option.value = prog.Codigo
        option.textContent = prog.Nombre
        programaSelect.appendChild(option)
      })
    }

    // Show period section and populate periods
    periodoSection.style.display = 'block'
    loadPeriodos()
  } else {
    programaSelect.style.display = 'none'
    periodoSection.style.display = 'none'
    formData.programa = ''
    formData.periodo_esperado = ''
  }

  deleteInvalid('facultad')
}

function handleProgramaChange() {
  const programaSelect = document.getElementById('programa')
  formData.programa = programaSelect.value
  deleteInvalid('programa')
}

function loadPeriodos() {
  const periodoSelect = document.getElementById('periodo_esperado')
  periodoSelect.innerHTML = '<option value="">*Periodo esperado de Ingreso</option>'

  if (periodoSel) {
    Object.entries(periodoSel).forEach(([periodo, codigo]) => {
      const option = document.createElement('option')
      option.value = codigo
      option.textContent = periodo
      periodoSelect.appendChild(option)
    })
  }
}

function handlePeriodoChange() {
  const periodoSelect = document.getElementById('periodo_esperado')
  formData.periodo_esperado = periodoSelect.value
  deleteInvalid('periodo_esperado')
}

// ============================================
// MANEJO DE AUTORIZACIÓN
// ============================================

// Authorization handling
function validateAutoriza() {
  const submitBtn = document.getElementById('submit_btn')

  if (formData.autoriza === '1') {
    showError('autoriza', false)
    formInValid = false
    submitBtn.disabled = false
  } else if (formData.autoriza === '0') {
    showError('autoriza', true)
    formInValid = true
    submitBtn.disabled = true
  }
}

// ============================================
// VALIDACIÓN DEL FORMULARIO
// ============================================

// Form validation
function validateInputs() {
  let valid = true

  // Reset all errors
  Object.keys(errors).forEach(key => {
    errors[key] = false
  })

  // Required fields
  const requiredFields = ['nevento', 'fevento', 'first_name', 'last_name', 'tipo_doc', 'numero_doc', 'pais', 'prefijoCel', 'tipo_asistente']

  requiredFields.forEach(field => {
    if (!formData[field] || formData[field] === '') {
      valid = false
      showError(field, true)
    }
  })

  // Conditional required fields for Colombia
  if (formData.pais === 'COL') {
    if (!formData.departamento || formData.departamento === '') {
      valid = false
      showError('departamento', true)
    }
    if (!formData.ciudad || formData.ciudad === '') {
      valid = false
      showError('ciudad', true)
    }
  }

  // Email validation
  if (!formData.email || formData.email === '') {
    valid = false
    showError('email', true)
  } else if (!isValidEmail(formData.email)) {
    valid = false
    showError('email', true)
  }

  // Mobile validation
  if (!formData.mobile || formData.mobile === '' || formData.mobile.length < 8) {
    valid = false
    showError('mobile', true)
  }

  // Aspirante specific validations
  if (formData.tipo_asistente === 'Aspirante') {
    if (!formData.nivelacademico || formData.nivelacademico === '') {
      valid = false
      showError('nivelacademico', true)
    }
    if (!formData.facultad || formData.facultad === '') {
      valid = false
      showError('facultad', true)
    }
    if (!formData.programa || formData.programa === '' || formData.programa === 'NOAP') {
      valid = false
      showError('programa', true)
    }
    if (!formData.periodo_esperado || formData.periodo_esperado === '') {
      valid = false
      showError('periodo_esperado', true)
    }
    if (!formData.empresa_convenio || formData.empresa_convenio === '') {
      valid = false
      showError('empresa_convenio', true)
    }
  }

  // Company validation for Docente and Aspirante
  if (formData.tipo_asistente === 'Aspirante' || formData.tipo_asistente === 'Docente y/o psicoorientador') {
    if (!formData.empresa_convenio || formData.empresa_convenio === '') {
      valid = false
      showError('empresa_convenio', true)
    }
  }

  // Authorization validation (required)
  if (!formData.autoriza || formData.autoriza === '' || formData.autoriza === '0') {
    valid = false
    showError('autoriza', true)
  }

  // Validate hidden fields that are currently visible
  if (!Validators.validateHiddenFields()) {
    valid = false
  }

  return valid
}

// ============================================
// ENVÍO DEL FORMULARIO
// ============================================

// Form submission
function validateForm(e) {
  e.preventDefault()

  if (!validateInputs()) {
    return false
  } else {
    isSubmitting = true
    document.getElementById('submit_btn').disabled = true
    document.getElementById('form_SF').submit()
  }
}

// ============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

// Event listeners setup
function setupEventListeners() {
  // Form fields con validación mejorada
  document.getElementById('first_name').addEventListener('input', e => {
    formData.first_name = e.target.value
    deleteInvalid('first_name')
  })

  document.getElementById('first_name').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('last_name').addEventListener('input', e => {
    formData.last_name = e.target.value
    deleteInvalid('last_name')
  })

  document.getElementById('last_name').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('tipo_doc').addEventListener('change', e => {
    formData.tipo_doc = e.target.value
    deleteInvalid('tipo_doc')
    Validators.validateField(e.target)
  })

  document.getElementById('tipo_doc').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('numero_doc').addEventListener('input', e => {
    const cleaned = cleanNumbers(e.target.value)
    e.target.value = cleaned
    formData.numero_doc = cleaned
    deleteInvalid('numero_doc')
  })

  document.getElementById('numero_doc').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('email').addEventListener('input', e => {
    formData.email = e.target.value
    // Validación en tiempo real para email
    if (e.target.value.trim() !== '') {
      Validators.validateField(e.target)
    }
  })

  document.getElementById('email').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('mobile').addEventListener('input', e => {
    const cleaned = cleanNumbers(e.target.value)
    e.target.value = cleaned
    formData.mobile = cleaned
    deleteInvalid('mobile')
  })

  document.getElementById('mobile').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('prefijoCel').addEventListener('change', e => {
    formData.prefijoCel = e.target.value
    deleteInvalid('prefijoCel')
    Validators.validateField(e.target)
  })

  document.getElementById('prefijoCel').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Location selects
  document.getElementById('pais').addEventListener('change', handlePaisChange)
  document.getElementById('pais').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('departamento').addEventListener('change', handleDepartamentoChange)
  document.getElementById('departamento').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('ciudad').addEventListener('change', handleCiudadChange)
  document.getElementById('ciudad').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Attendee type
  document.getElementById('tipo_asistente').addEventListener('change', handleTipoAsistenteChange)
  document.getElementById('tipo_asistente').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Academic fields with validation
  document.getElementById('facultad').addEventListener('change', e => {
    handleFacultadChange()
    Validators.validateField(e.target)
  })

  document.getElementById('facultad').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('programa').addEventListener('change', e => {
    handleProgramaChange()
    Validators.validateField(e.target)
  })

  document.getElementById('programa').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('periodo_esperado').addEventListener('change', e => {
    handlePeriodoChange()
    Validators.validateField(e.target)
  })

  document.getElementById('periodo_esperado').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Level académico (hidden but validated)
  document.getElementById('nivelacademico').addEventListener('change', e => {
    formData.nivelacademico = e.target.value
    Validators.validateField(e.target)
  })

  document.getElementById('nivelacademico').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Empresa field
  document.getElementById('empresa_convenio').addEventListener('input', e => {
    formData.empresa_convenio = e.target.value
    deleteInvalid('empresa_convenio')
  })

  document.getElementById('empresa_convenio').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  // Authorization radio buttons with validation
  document.getElementById('autoriza-si').addEventListener('change', e => {
    formData.autoriza = e.target.value
    validateAutoriza()
    // Limpiar error si selecciona "Sí"
    if (e.target.value === '1') {
      showError('autoriza', false)
    }
  })

  document.getElementById('autoriza-no').addEventListener('change', e => {
    formData.autoriza = e.target.value
    validateAutoriza()
    // Mostrar error si selecciona "No"
    if (e.target.value === '0') {
      showError('autoriza', true)
    }
  })

  // Form submission
  document.getElementById('form_SF').addEventListener('submit', validateForm)
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

// Initialize application
async function init() {
  // Load all data
  await Promise.all([getProgramas(), getPeriodos(), getUbicaciones(), getPrefijoCel()])

  // Get URL parameters
  getParametersGet()

  // Configure form based on environment
  FormConfig.configureForm()
  FormConfig.updateFieldIds()

  // Setup event listeners
  setupEventListeners()

  console.log('Form initialized successfully')
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init)

// ============================================
// FUNCIONES GLOBALES PARA CONTROL DE MODO
// ============================================

// Exponer funciones al scope global para facilitar el uso desde la consola
window.setTestMode = () => FormConfig.setTestMode()
window.setProductionMode = () => FormConfig.setProductionMode()
window.toggleDebugMode = mode => FormConfig.toggleDebugMode(mode)
window.getCurrentMode = () => (FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCTION')

// Log inicial del modo actual
console.log(
  `%c🔧 Formulario inicializado en modo: ${FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`,
  'color: #2196F3; font-weight: bold;'
)
console.log('%c💡 Para cambiar el modo, usa:', 'color: #666;')
console.log('%c   • setTestMode()       - Cambiar a modo TEST', 'color: #FF9800;')
console.log('%c   • setProductionMode() - Cambiar a modo PRODUCCIÓN', 'color: #4CAF50;')
console.log('%c   • getCurrentMode()    - Ver modo actual', 'color: #2196F3;')
