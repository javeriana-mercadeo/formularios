/**
 * Formulario de Eventos y Open Day - Pontificia Universidad Javeriana
 * Basado completamente en la arquitectura del formulario de posgrado
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

    CAMPAIGN: 'EVENTOS_OPEN_DAY', // Código de campaña para seguimiento

    // TIPOS DE ASISTENTE
    // Define qué opciones aparecerán en el campo "Tipo de asistente"
    // Comentar con "//" las opciones que NO quieres mostrar
    TYPE_ATTENDEE: [
      'Aspirante', // ✅ Activo - Personas interesadas en estudiar
      //'Padre de familia y/o acudiente', // ❌ Desactivado - Familiares de aspirantes
      //'Docente y/o psicoorientador',    // ❌ Desactivado - Personal educativo
      //'Visitante PUJ',                  // ❌ Desactivado - Visitantes externos
      //'Administrativo PUJ',             // ❌ Desactivado - Personal administrativo
    ],

    // NIVELES ACADÉMICOS DISPONIBLES
    // Define qué niveles educativos se mostrarán en el formulario
    // Si hay solo uno activo, se auto-selecciona y oculta el campo
    LEVEL_ACADEMIC: [
      //{ code: 'PREG', name: 'Pregrado' }, // ✅ Programas de pregrado
      //{ code: 'GRAD', name: 'Posgrado' },       // ❌ Desactivado - Maestrías y Doctorados
      //{ code: 'ECLE', name: 'Eclesiástico' },   // ❌ Desactivado - Programas eclesiásticos
      //{ code: 'ETDH', name: 'Técnico' },        // ❌ Desactivado - Programas técnicos
    ],

    // FILTRO DE FACULTADES (OPCIONAL)
    // Si está VACÍO [], muestra todas las facultades disponibles
    // Si tiene valores, SOLO muestra las facultades listadas
    FACULTY: [
      //"Enfermería",        // Ejemplo: Solo mostrar Enfermería
      //"Educación",         // Ejemplo: Solo mostrar Educación
      //"Ciencias",          // Ejemplo: Solo mostrar Ciencias
      //"Ingeniería",        // Ejemplo: Solo mostrar Ingeniería
      //"Ciencias Sociales", // Ejemplo: Solo mostrar Ciencias Sociales
      //"Derecho"            // Ejemplo: Solo mostrar Derecho
    ],

    // FILTRO DE PROGRAMAS (OPCIONAL)
    // Si está VACÍO [], muestra todos los programas disponibles
    // Si tiene valores, SOLO muestra los programas con esos CÓDIGOS
    PROGRAMS: [
      //"DGPEX",  // Ejemplo: Código de programa específico
      //"MACOM",  // Ejemplo: Código de programa específico
      //"MPERC",  // Ejemplo: Código de programa específico
      //"ELITI",  // Ejemplo: Código de programa específico
      //"MAHIS",  // Ejemplo: Código de programa específico
      //"ELIGS",  // Ejemplo: Código de programa específico
      //"MSAME"   // Ejemplo: Código de programa específico
    ],

    // DÍAS DE ASISTENCIA AL EVENTO
    // Define qué fechas estarán disponibles para seleccionar
    // Si hay solo una fecha, se auto-selecciona y oculta el campo
    ATTENDANCE_DAYS: [
      "Martes 14 de noviembre", // ✅ Activo - Primera fecha disponible
      //"Miércoles 15 de noviembre",   // ❌ Desactivado - Segunda fecha disponible
      //"Jueves 16 de noviembre",      // ❌ Desactivado - Tercera fecha no disponible
    ],

    // CAMPOS A OCULTAR DEL FORMULARIO
    // Permite ocultar campos que no necesitas para tu evento específico
    // Los campos ocultos se auto-completan con valores por defecto
    REMOVE_FIELDS: [
      // CAMPOS PERSONALES
      //"first_name",        // Ocultar campo de nombre
      //"last_name",         // Ocultar campo de apellido
      //"type_doc",          // Ocultar tipo de documento
      //"document",          // Ocultar número de documento
      //"email",             // Ocultar correo electrónico
      //"phone",             // Ocultar teléfono
      //"phone_code",        // Ocultar prefijo telefónico
      //"country",           // Ocultar país
      //"department",        // Ocultar departamento
      //"city",              // Ocultar ciudad
      //"attendance_day",    // Ocultar día de asistencia al evento
      //"type_attendee",     // Ocultar tipo de asistente
      //"academic_level",    // Ocultar nivel académico de interés
      //"faculty",           // Ocultar facultad de interés
      //"program",           // Ocultar programa de interés
      //"admission_period",  // Ocultar periodo esperado de ingreso
    ],

    // ============================================
    // FIN - PERSONALIZACIÓN DEL FORMULARIO
    // ============================================

    // CONFIGURACIONES DE DESARROLLO Y DEBUG
    DEV_MODE: false,
    DEBUG_MODE: false,
    EMAIL_DEBUG: 'DesarrolladorDMPA@javeriana.edu.co',

    // CONFIGURACIÓN DE CACHÉ
    CACHE_ENABLED: true,
    CACHE_EXPIRATION_HOURS: 12
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
    }
  }

  static URLS = {
    THANK_YOU: 'https://cloud.cx.javeriana.edu.co/EVENTOS_TKY',
    PRIVACY_POLICY: 'https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html',

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

    // Campos ocultos necesarios para Salesforce
    const hiddenFields = [
      { name: 'oid', value: '00Df4000003l8Bf' },
      { name: 'retURL', value: this.URLS.THANK_YOU },
      { name: 'debug', value: this.PERSONALIZATION.DEBUG_MODE ? '1' : '0' },
      { name: 'debugEmail', value: this.PERSONALIZATION.DEBUG_MODE ? this.PERSONALIZATION.EMAIL_DEBUG : '' },
      { name: 'lead_source', value: 'Landing Pages' },
      { name: 'company', value: 'NA' }
    ]

    hiddenFields.forEach(field => {
      let input = document.querySelector(`input[name="${field.name}"]`)
      if (!input) {
        input = document.createElement('input')
        input.type = 'hidden'
        input.name = field.name
        form.appendChild(input)
      }
      input.value = field.value
    })
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
      attendance_day: 'DIA_ASISTENCIA'
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
// GESTOR DE CAMPOS REMOVIBLES
// ============================================
class FieldRemovalManager {
  constructor() {
    this.fieldMapping = {
      first_name: 'first_name',
      last_name: 'last_name',
      type_doc: 'type_doc',
      document: 'document',
      email: 'email',
      phone: 'phone',
      phone_code: 'phone_code',
      country: 'country',
      department: 'department',
      city: 'city',
      type_attendee: 'type_attendee',
      attendance_day: 'attendance_day',
      academic_level: 'academic_level',
      faculty: 'faculty',
      program: 'program',
      admission_period: 'admission_period'
    }
  }

  removeConfiguredFields() {
    const fieldsToRemove = FormConfig.PERSONALIZATION.REMOVE_FIELDS || []

    if (fieldsToRemove.length === 0) return

    console.log('🔧 Removiendo campos configurados:', fieldsToRemove)

    fieldsToRemove.forEach((fieldName) => {
      this.removeField(fieldName)
    })

    // Casos especiales
    this.handleSpecialCases(fieldsToRemove)
  }

  removeField(fieldName) {
    const fieldId = this.fieldMapping[fieldName]

    if (!fieldId) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en el mapeo`)
      return
    }

    const element = document.getElementById(fieldId)
    if (!element) {
      console.warn(`⚠️ Elemento "${fieldId}" no encontrado en el DOM`)
      return
    }

    // Para algunos campos, ocultar directamente en lugar de buscar contenedor
    if (fieldName === 'academic_level' || fieldName === 'faculty' || fieldName === 'program' || fieldName === 'admission_period') {
      element.style.display = 'none'
      element.removeAttribute('required')
      
      // Ocultar mensaje de error asociado
      const errorElement = document.getElementById(`error_${fieldId}`)
      if (errorElement) {
        errorElement.style.display = 'none'
      }
      
      console.log(`✅ Campo "${fieldName}" ocultado directamente`)
      
      // Configurar valor por defecto
      this.setFieldDefault(element, fieldName)
      
      // Actualizar estado del formulario
      this.updateFormState(fieldName, element.value)
      return
    }

    // Para otros campos, buscar contenedor
    const container = this.findFieldContainer(element)

    if (container) {
      container.style.display = 'none'
      console.log(`✅ Campo "${fieldName}" ocultado correctamente`)

      // Configurar valor por defecto
      this.setFieldDefault(element, fieldName)

      // Actualizar estado del formulario
      this.updateFormState(fieldName, element.value)
    } else {
      console.warn(`⚠️ No se encontró contenedor para "${fieldName}"`)
    }
  }

  findFieldContainer(element) {
    // Buscar el contenedor más apropiado
    return (
      element.closest('.form-group') ||
      element.closest('.form-card') ||
      element.closest('.name-row') ||
      element.closest('.document-row') ||
      element.closest('.phone-row') ||
      element.closest('div[class*="row"]') ||
      element.parentElement
    )
  }

  setFieldDefault(element, fieldName) {
    // Remover atributo required
    if (element.hasAttribute('required')) {
      element.removeAttribute('required')
    }

    // Establecer valor por defecto según el tipo de campo
    if (element.tagName === 'SELECT') {
      this.setSelectDefault(element, fieldName)
    } else if (element.type === 'radio') {
      this.setRadioDefault(element, fieldName)
    } else {
      this.setInputDefault(element, fieldName)
    }
  }

  setSelectDefault(element, fieldName) {
    const defaults = {
      type_doc: 'CC',
      country: 'COL',
      department: '11',
      city: '11001',
      type_attendee: 'Aspirante',
      academic_level: 'PREG'
    }

    if (defaults[fieldName]) {
      element.value = defaults[fieldName]
    } else if (element.options.length > 1) {
      element.selectedIndex = 1 // Primera opción válida
    }
  }

  setRadioDefault(element, fieldName) {
    if (fieldName === 'authorization_data') {
      const yesRadio = document.getElementById('autorizacion_si')
      if (yesRadio) {
        yesRadio.checked = true
      }
    }
  }

  setInputDefault(element, fieldName) {
    const defaults = {
      first_name: 'Usuario',
      last_name: 'Evento',
      document: '12345678',
      email: 'eventos@javeriana.edu.co',
      phone: '3001234567'
    }

    if (defaults[fieldName]) {
      element.value = defaults[fieldName]
    }
  }

  updateFormState(fieldName, value) {
    const formFieldMapping = {
      first_name: 'first_name',
      last_name: 'last_name',
      type_doc: 'type_doc',
      document: 'document',
      email: 'email',
      phone: 'phone',
      phone_code: 'phone_code',
      country: 'country',
      department: 'department',
      city: 'city',
      type_attendee: 'type_attendee',
      attendance_day: 'attendance_day',
      academic_level: 'academic_level',
      faculty: 'faculty',
      program: 'program',
      admission_period: 'admission_period'
    }

    const formField = formFieldMapping[fieldName]
    if (formField && formData.hasOwnProperty(formField)) {
      formData[formField] = value
      // Marcar como válido en el sistema de errores
      errors[formField] = false
    }
  }

  handleSpecialCases(fieldsToRemove) {
    // Casos especiales para campos dependientes
    if (fieldsToRemove.includes('country') && !fieldsToRemove.includes('department')) {
      // Si se oculta país pero no departamento, forzar Colombia y mostrar departamento
      const countryElement = document.getElementById('country')
      if (countryElement) {
        countryElement.value = 'COL'
        formData.country = 'COL'
        handleCountryChange()
      }
    }

    if (fieldsToRemove.includes('type_attendee') && !fieldsToRemove.includes('academic_level')) {
      // Si se oculta tipo de asistente pero no nivel académico, forzar Aspirante
      const typeElement = document.getElementById('type_attendee')
      if (typeElement) {
        typeElement.value = 'Aspirante'
        formData.type_attendee = 'Aspirante'
        handleTypeAttendeeChange()
      }
    }
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
  authorization_data: ''
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
// FUNCIONES AUXILIARES PARA AUTO-SELECCIÓN
// ============================================

function hideAndSelectSingle(selectElement, value, container = null) {
  // Ocultar contenedor si se proporciona
  if (container) {
    container.style.display = 'none'
  } else {
    const row = selectElement.closest('.form-group')
    if (row) row.style.display = 'none'
  }

  // Limpiar y establecer opción única
  selectElement.innerHTML = ''
  const option = document.createElement('option')
  option.value = value
  option.textContent = value
  option.selected = true
  selectElement.appendChild(option)

  // Habilitar para que funcione aunque esté oculto
  selectElement.disabled = false
  selectElement.required = true

  console.log(`✅ Campo auto-seleccionado y ocultado: ${value}`)
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
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email.toLowerCase())
}

// ============================================
// SISTEMA DE VALIDACIÓN ROBUSTO
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
      'first_name': 'name',
      'last_name': 'name',
      'email': 'email',
      'phone': 'phone',
      'document': 'document',
      'type_doc': 'required',
      'phone_code': 'required',
      'country': 'required',
      'department': 'required',
      'city': 'required',
      'type_attendee': 'required',
      'attendance_day': 'required',
      'academic_level': 'required',
      'faculty': 'required',
      'program': 'required',
      'admission_period': 'required'
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
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PROGRAMS)
  if (data) {
    programas = data
  }
}

async function getPeriodos() {
  const data = await loadData(FormConfig.URLS.DATA_SOURCES.PERIODS)
  if (data) {
    periodos = data
    console.log('✅ Períodos cargados:', periodos)
  } else {
    console.error('❌ Error al cargar períodos')
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

  const types = FormConfig.PERSONALIZATION.TYPE_ATTENDEE

  if (types.length === 1) {
    // Auto-seleccionar si solo hay una opción
    hideAndSelectSingle(typeAttendeeSelect, types[0])
    formData.type_attendee = types[0]
    handleTypeAttendeeChange()
  } else {
    typeAttendeeSelect.innerHTML = '<option value="">*Tipo de asistente</option>'
    types.forEach(type => {
      const option = document.createElement('option')
      option.value = type
      option.textContent = type
      typeAttendeeSelect.appendChild(option)
    })
  }
}

function initializeAttendanceDay() {
  const attendanceDaySelect = document.getElementById('attendance_day')
  if (!attendanceDaySelect) return

  const attendanceDays = FormConfig.PERSONALIZATION.ATTENDANCE_DAYS || []

  if (attendanceDays.length === 0) {
    // Sin días configurados: ocultar campo
    const dayRow = attendanceDaySelect.closest('.form-group')
    if (dayRow) {
      dayRow.style.display = 'none'
    }
    console.log('📅 No hay días de asistencia configurados - campo oculto')
    return
  }

  if (attendanceDays.length === 1) {
    // Solo un día: ocultar campo y preseleccionar
    hideAndSelectSingle(attendanceDaySelect, attendanceDays[0])
    formData.attendance_day = attendanceDays[0]
    console.log(`📅 Día de asistencia configurado automáticamente: ${attendanceDays[0]}`)
  } else {
    // Múltiples días: mostrar select normalmente
    attendanceDaySelect.innerHTML = '<option value="">*Día de asistencia</option>'
    attendanceDays.forEach(day => {
      const option = document.createElement('option')
      option.value = day
      option.textContent = day
      attendanceDaySelect.appendChild(option)
    })
    console.log(`📅 Select de día de asistencia inicializado con ${attendanceDays.length} opciones`)
  }
}

function initializeAcademicLevel() {
  const academicLevelSelect = document.getElementById('academic_level')
  if (!academicLevelSelect) return

  const levels = FormConfig.PERSONALIZATION.LEVEL_ACADEMIC
  console.log(`🎓 Inicializando nivel académico con ${levels.length} opciones:`, levels)

  if (levels.length === 1) {
    // Solo una opción: ocultar el campo pero mantenerlo funcional
    academicLevelSelect.style.display = 'none'
    
    // Limpiar y establecer la única opción
    academicLevelSelect.innerHTML = ''
    const option = document.createElement('option')
    option.value = levels[0].code
    option.textContent = levels[0].name
    option.selected = true
    academicLevelSelect.appendChild(option)
    
    // IMPORTANTE: Mantener habilitado y required para validación
    academicLevelSelect.disabled = false
    academicLevelSelect.required = true
    
    // Actualizar estado inmediatamente
    formData.academic_level = levels[0].code
    errors.academic_level = false
    
    console.log(`🔧 Campo nivel académico configurado automáticamente y oculto: ${levels[0].name}`)
    
    // Si el tipo ya es aspirante, cargar facultades
    if (formData.type_attendee === 'Aspirante') {
      setTimeout(() => loadFaculties(levels[0].code), 100)
    }
  } else if (levels.length === 0) {
    // Sin opciones: ocultar campo y deshabilitar
    academicLevelSelect.style.display = 'none'
    academicLevelSelect.disabled = true
    academicLevelSelect.required = false
    
    const errorElement = document.getElementById('error_academic_level')
    if (errorElement) {
      errorElement.style.display = 'none'
    }
    
    console.log('❌ No hay niveles académicos configurados - campo oculto')
  } else {
    // Múltiples opciones: mostrar el select normalmente
    academicLevelSelect.style.display = 'block'
    academicLevelSelect.innerHTML = '<option value="">*Nivel académico de interés</option>'
    
    levels.forEach(level => {
      const option = document.createElement('option')
      option.value = level.code
      option.textContent = level.name
      academicLevelSelect.appendChild(option)
    })
    
    academicLevelSelect.disabled = false
    academicLevelSelect.required = true
    
    console.log(`📋 Select de nivel académico inicializado con ${levels.length} opciones`)
  }
}

function handleTypeAttendeeChange() {
  const typeAttendeeSelect = document.getElementById('type_attendee')
  const academicLevelElement = document.getElementById('academic_level')
  const facultyElement = document.getElementById('faculty')
  const programElement = document.getElementById('program')
  const periodElement = document.getElementById('admission_period')

  formData.type_attendee = typeAttendeeSelect.value
  const isAspirant = formData.type_attendee === 'Aspirante'
  
  console.log(`🎓 Tipo de asistente: "${formData.type_attendee}" - Es aspirante: ${isAspirant}`)

  if (isAspirant) {
    console.log('✅ Configurando campos académicos para aspirante')
    
    // Verificar configuración de niveles académicos
    const levels = FormConfig.PERSONALIZATION.LEVEL_ACADEMIC
    
    if (levels.length === 1) {
      // Un solo nivel: mantener oculto pero funcional
      if (academicLevelElement) {
        academicLevelElement.style.display = 'none'
        
        // Asegurar que el valor esté configurado correctamente
        if (!academicLevelElement.value || academicLevelElement.value === '') {
          academicLevelElement.innerHTML = ''
          const option = document.createElement('option')
          option.value = levels[0].code
          option.textContent = levels[0].name
          option.selected = true
          academicLevelElement.appendChild(option)
        }
        
        // IMPORTANTE: Mantener required para validación
        academicLevelElement.disabled = false
        academicLevelElement.required = true
        
        formData.academic_level = levels[0].code
        errors.academic_level = false
        
        console.log('🔧 Nivel académico único configurado correctamente')
        
        // Cargar facultades automáticamente
        setTimeout(() => loadFaculties(levels[0].code), 100)
      }
    } else if (levels.length > 1) {
      // Múltiples niveles: mostrar select
      if (academicLevelElement) {
        academicLevelElement.style.display = 'block'
        academicLevelElement.disabled = false
        academicLevelElement.required = true
        academicLevelElement.classList.remove('error')
      }
    }
    
    // Mostrar otros campos académicos según corresponda
    showAcademicFieldsIfNeeded()
    
    // Reset valores de campos dependientes
    resetDependentAcademicFields()
    
    // Si ya hay un nivel académico configurado, cargar facultades
    const currentLevel = formData.academic_level || (academicLevelElement && academicLevelElement.value)
    if (currentLevel && currentLevel !== '') {
      console.log(`🔄 Cargando facultades para nivel: ${currentLevel}`)
      setTimeout(() => loadFaculties(currentLevel), 100)
    }
  } else {
    console.log('❌ Ocultando campos académicos para no-aspirante')
    
    // Ocultar todos los campos académicos
    if (academicLevelElement) {
      academicLevelElement.style.display = 'none'
      academicLevelElement.disabled = true
      academicLevelElement.required = false
      academicLevelElement.value = ''
      formData.academic_level = ''
    }
    if (facultyElement) {
      facultyElement.style.display = 'none'
      facultyElement.disabled = true
      facultyElement.required = false
      facultyElement.value = ''
      formData.faculty = ''
    }
    if (programElement) {
      programElement.style.display = 'none'
      programElement.disabled = true
      programElement.required = false
      programElement.value = ''
      formData.program = ''
    }
    if (periodElement) {
      periodElement.style.display = 'none'
      periodElement.disabled = true
      periodElement.required = false
      periodElement.value = ''
      formData.admission_period = ''
    }
    
    // Establecer valores por defecto para no-aspirantes
    setNonAspirantDefaults()
  }

  deleteInvalid('type_attendee')
}

// ============================================
// FUNCIONES AUXILIARES PARA CAMPOS ACADÉMICOS
// ============================================

function showAcademicFieldsIfNeeded() {
  const academicLevel = formData.academic_level
  const faculty = formData.faculty
  const program = formData.program

  // Mostrar facultad si hay nivel académico
  if (academicLevel) {
    const facultyElement = document.getElementById('faculty')
    if (facultyElement) {
      facultyElement.style.display = 'block'
      facultyElement.disabled = false
      facultyElement.required = true
    }
  }

  // Mostrar programa si hay facultad
  if (faculty) {
    const programElement = document.getElementById('program')
    if (programElement) {
      programElement.style.display = 'block'
      programElement.disabled = false
      programElement.required = true
    }
  }

  // Mostrar período si hay programa
  if (program) {
    const periodElement = document.getElementById('admission_period')
    if (periodElement) {
      periodElement.style.display = 'block'
      periodElement.disabled = false
      periodElement.required = true
    }
  }
}

function resetDependentAcademicFields() {
  // Solo resetear campos dependientes, no el nivel académico
  const dependentFields = ['faculty', 'program', 'admission_period']
  
  dependentFields.forEach(fieldName => {
    formData[fieldName] = ''
    errors[fieldName] = false
    
    const element = document.getElementById(fieldName)
    if (element) {
      element.value = ''
      element.classList.remove('error')
    }
  })
  
  console.log('🔄 Campos académicos dependientes reseteados')
}

function setNonAspirantDefaults() {
  const defaults = {
    academic_level: 'PREG',
    faculty: 'NOAP',
    program: 'NOAP',
    admission_period: '2025-1'
  }
  
  Object.entries(defaults).forEach(([field, value]) => {
    formData[field] = value
    errors[field] = false
  })
  
  console.log('🔧 Valores por defecto establecidos para no-aspirante:', defaults)
}

function handleAcademicLevelChange() {
  const academicLevelSelect = document.getElementById('academic_level')
  formData.academic_level = academicLevelSelect.value

  if (formData.academic_level) {
    loadFaculties(formData.academic_level)
    loadPeriods(formData.academic_level)
  } else {
    hideFacultyField()
    hideProgramField()
    hidePeriodField()
  }

  deleteInvalid('academic_level')
}

function loadFaculties(academicLevel) {
  const facultySelect = document.getElementById('faculty')
  if (!facultySelect || !programas) return

  console.log(`🔄 Cargando facultades para nivel: ${academicLevel}`)
  console.log('📊 Datos de programas disponibles:', programas)

  // Check if programas has the expected structure
  let levelPrograms = []
  
  if (programas[academicLevel]) {
    // Structure: programas.PREG, programas.GRAD, etc.
    let facultyKeys = Object.keys(programas[academicLevel])
    
    // Apply faculty filter if configured and not empty
    const { FACULTY } = FormConfig.PERSONALIZATION
    if (FACULTY && FACULTY.length > 0) {
      facultyKeys = facultyKeys.filter(faculty => FACULTY.includes(faculty))
      console.log(`🔍 Filtro de facultades aplicado. Facultades filtradas:`, facultyKeys)
    } else {
      console.log(`📋 Sin filtro de facultades. Mostrando todas las facultades disponibles:`, facultyKeys)
    }
    
    if (facultyKeys.length === 0) {
      console.warn(`❌ No hay facultades disponibles después del filtro para nivel: ${academicLevel}`)
      hideFacultyField()
      return
    }

    facultySelect.innerHTML = '<option value="">*Facultad de interés</option>'
    facultyKeys.forEach(facultyKey => {
      const option = document.createElement('option')
      option.value = facultyKey
      option.textContent = facultyKey
      facultySelect.appendChild(option)
    })
    
    facultySelect.style.display = 'block'
    facultySelect.setAttribute('required', 'required')
    console.log(`✅ ${facultyKeys.length} facultades cargadas en el select`)
    return
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
  const periodSelect = document.getElementById('admission_period')
  if (!periodSelect || !periodos) {
    console.warn('❌ No se puede cargar períodos - elemento o datos faltantes')
    return
  }

  console.log(`🔄 Cargando períodos para nivel: ${academicLevel}`)
  console.log('📊 Datos de períodos disponibles:', periodos)

  // Get periods for the specific academic level
  const levelPeriods = periodos[academicLevel]

  if (!levelPeriods || Object.keys(levelPeriods).length === 0) {
    console.warn(`❌ No hay períodos disponibles para nivel: ${academicLevel}`)
    hidePeriodField()
    return
  }

  console.log(`✅ Períodos encontrados para ${academicLevel}:`, levelPeriods)

  periodSelect.innerHTML = '<option value="">*Periodo esperado de Ingreso de interés</option>'
  
  // Iterate over the periods object (periodo name -> codigo)
  Object.entries(levelPeriods).forEach(([periodo, codigo]) => {
    const option = document.createElement('option')
    option.value = codigo
    option.textContent = periodo
    periodSelect.appendChild(option)
  })

  periodSelect.style.display = 'block'
  periodSelect.setAttribute('required', 'required')
  
  console.log(`✅ ${Object.keys(levelPeriods).length} períodos cargados en el select`)
}

function handleFacultyChange() {
  const facultySelect = document.getElementById('faculty')
  formData.faculty = facultySelect.value

  if (formData.faculty) {
    // Show and populate programs
    loadPrograms(formData.academic_level, formData.faculty)
    
    // Show and populate periods (like in posgrados)
    showPeriodField()
    loadPeriods(formData.academic_level)
  } else {
    hideProgramField()
    hidePeriodField()
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
    filteredPrograms = programas.filter(program => 
      program.codigo_nivel === academicLevel && program.facultad === faculty
    )
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

function showPeriodField() {
  const periodElement = document.getElementById('admission_period')
  if (periodElement) {
    periodElement.style.display = 'block'
    periodElement.setAttribute('required', 'required')
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
  const requiredFields = [
    'first_name', 'last_name', 'type_doc', 'document', 'email', 'phone_code', 'phone', 'country'
  ]

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

  // Add event fields
  requiredFields.push('type_attendee', 'attendance_day')

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
  console.log('🔍 Validando autorización...')
  const authRadios = document.querySelectorAll('input[type="radio"][id^="autorizacion_"]')
  console.log('📻 Radio buttons encontrados en validación:', authRadios.length)
  
  let authSelected = false
  authRadios.forEach(radio => {
    console.log(`📻 Radio ${radio.id}: checked=${radio.checked}, value=${radio.value}`)
    if (radio.checked && radio.value === '1') {
      authSelected = true
    }
  })

  console.log('✅ Autorización válida:', authSelected)

  if (!authSelected) {
    console.log('❌ Autorización faltante - mostrando error')
    showError('authorization_data', true)
    valid = false
  } else {
    console.log('✅ Autorización concedida - limpiando error')
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
      console.log('Formulario válido - modo desarrollo')
      console.log('Datos:', formData)
      
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
  document.getElementById('first_name').addEventListener('input', e => {
    const cleaned = cleanText(e.target.value)
    e.target.value = cleaned
    formData.first_name = cleaned
    deleteInvalid('first_name')
  })

  document.getElementById('first_name').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

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
  document.getElementById('academic_level').addEventListener('change', e => {
    handleAcademicLevelChange()
    Validators.validateField(e.target)
  })

  document.getElementById('academic_level').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

  document.getElementById('faculty').addEventListener('change', e => {
    handleFacultyChange()
    Validators.validateField(e.target)
  })

  document.getElementById('faculty').addEventListener('blur', e => {
    Validators.validateField(e.target)
  })

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
  console.log('🔄 Radio buttons encontrados:', authRadios.length)
  
  authRadios.forEach(radio => {
    console.log('📻 Configurando radio:', radio.id, 'value:', radio.value)
    
    radio.addEventListener('change', e => {
      formData.authorization_data = e.target.value
      deleteInvalid('authorization_data')
      
      console.log('📻 Radio seleccionado:', e.target.id, 'value:', e.target.value)
      
      if (e.target.value === '1') {
        // Authorization granted - enable submit and clear error
        document.getElementById('submit_btn').disabled = false
        showError('authorization_data', false)
        console.log('✅ Autorización concedida - botón habilitado')
      } else {
        // Authorization denied - disable submit and show error immediately
        document.getElementById('submit_btn').disabled = true
        showError('authorization_data', true)
        console.log('❌ Autorización denegada - mostrando error')
      }
    })
  })

  // Form submission
  document.getElementById('form_inscription').addEventListener('submit', validateForm)

  console.log('✅ Event listeners configurados')
}

// ============================================
// INICIALIZACIÓN
// ============================================

async function initForm() {
  try {
    console.log('🚀 Inicializando formulario de eventos...')

    // Load data
    await Promise.all([
      getUbicaciones(),
      getPrefijos(),
      getProgramas(),
      getPeriodos()
    ])

    // Initialize form fields
    initializeTypeAttendee()
    initializeAttendanceDay()
    initializeAcademicLevel()

    // Apply field personalization
    const fieldRemovalManager = new FieldRemovalManager()
    fieldRemovalManager.removeConfiguredFields()

    // Configure form based on environment
    FormConfig.configureForm()
    FormConfig.updateFieldIds()

    // Setup event listeners
    setupEventListeners()

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

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', initForm)

// Log inicial del modo actual
console.log(
  `%c🔧 Formulario inicializado en modo: ${FormConfig.PERSONALIZATION.DEBUG_MODE ? 'TEST' : 'PRODUCCIÓN'}`,
  'color: #2196F3; font-weight: bold;'
)
console.log('%c💡 Para cambiar el modo, usa:', 'color: #666;')
console.log('%c   • setTestMode()       - Cambiar a modo TEST', 'color: #FF9800;')
console.log('%c   • setProductionMode() - Cambiar a modo PRODUCCIÓN', 'color: #4CAF50;')
console.log('%c   • getCurrentMode()    - Ver modo actual', 'color: #2196F3;')