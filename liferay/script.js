/**
 * Liferay Fragment Script para Formularios de Eventos PUJ
 * Conecta la configuración del fragmento con FormManager
 * @version 1.0
 */

// ===============================
// UTILIDADES DE CONFIGURACIÓN
// ===============================

/**
 * Parsear string separado por comas a array o devolver array si ya es array
 * Maneja también valores que pueden venir como objetos JSON de Liferay
 * @param {string|Array|Object} input - String con valores separados por comas, Array, u Objeto JSON
 * @returns {Array} - Array de valores
 */
function parseCommaSeparatedString(input) {
  // Si ya es un array, devolverlo directamente (caso multiSelect de Liferay)
  if (Array.isArray(input)) {
    return input;
  }
  
  // Si es un objeto con propiedades de Liferay (como {dataTheme: "value"})
  if (typeof input === 'object' && input !== null) {
    // Si tiene una propiedad conocida de Liferay, extraer el valor
    if (input.value) return [input.value];
    if (input.dataTheme) return [input.dataTheme];
    // Si es un objeto plano, intentar obtener los valores
    const values = Object.values(input).filter(v => v && typeof v === 'string');
    if (values.length > 0) return values;
  }
  
  // Si es string que comienza con '{', intentar parsear como JSON
  if (typeof input === 'string' && input.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(input);
      if (parsed.value) return [parsed.value];
      if (parsed.dataTheme) return [parsed.dataTheme];
      return [input]; // Si no se puede parsear correctamente, devolver como string
    } catch (error) {
      // Si falla el parsing, tratar como string normal
      console.warn('Error parsing JSON string:', input, error);
    }
  }
  
  // Si es string, parsear por comas
  if (typeof input === 'string' && input.trim().length > 0) {
    return input.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
  
  // Si no es string ni array, devolver array vacío
  return [];
}

/**
 * Parsear niveles académicos desde códigos separados por comas
 * Convierte códigos como "PREG,GRAD" a objetos con code y name
 * @param {string} input - String con códigos separados por comas
 * @returns {Array} - Array de objetos con code y name
 */
function parseAcademicLevels(input) {
  const levelMap = {
    'PREG': { code: 'PREG', name: 'Pregrado' },
    'GRAD': { code: 'GRAD', name: 'Posgrado' },
    'CONT': { code: 'CONT', name: 'Educación Continua' }
  };
  
  if (typeof input === 'string' && input.trim().length > 0) {
    const codes = input.split(',').map(code => code.trim()).filter(code => code.length > 0);
    return codes.map(code => levelMap[code]).filter(level => level !== undefined);
  }
  
  return [];
}

/**
 * Obtener configuración desde Liferay Fragment Configuration
 * @returns {Object} - Configuración del formulario
 */
function getLiferayConfiguration() {
  // En Liferay, la configuración está disponible en la variable configuration
  const config = typeof configuration !== 'undefined' ? configuration : {};
  
  console.log('📋 Configuración recibida de Liferay:', config);
  
  return config;
}

/**
 * Transformar configuración de Liferay a formato FormManager
 * @param {Object} liferayConfig - Configuración desde Liferay
 * @returns {Object} - Configuración para FormManager
 */
function transformLiferayConfig(liferayConfig) {
  console.log('🔄 Transformando configuración de Liferay...');
  
  // Log de tipos de datos recibidos para debugging
  console.log('📊 Tipos de datos recibidos:', {
    typeAttendee: typeof liferayConfig.typeAttendee,
    countries: typeof liferayConfig.countries,
    faculties: typeof liferayConfig.faculties,
    academicLevels: typeof liferayConfig.academicLevels,
    test: typeof liferayConfig.test,
    debug: typeof liferayConfig.debug,
    cacheEnabled: typeof liferayConfig.cacheEnabled
  });
  
  const transformedConfig = {
    // DATOS BÁSICOS DEL EVENTO
    eventName: liferayConfig.eventName || "",
    eventDate: liferayConfig.eventDate || "",
    
    // PARÁMETROS UTM
    source: liferayConfig.source || "",
    subSource: liferayConfig.subSource || "",
    medium: liferayConfig.medium || "",
    campaign: liferayConfig.campaign || "",
    article: liferayConfig.article || "",
    
    // CONFIGURACIÓN DEL EVENTO
    typeAttendee: parseCommaSeparatedString(liferayConfig.typeAttendee),
    attendanceDays: parseCommaSeparatedString(liferayConfig.attendanceDays),
    
    // FILTROS ACADÉMICOS
    academicLevels: parseAcademicLevels(liferayConfig.academicLevels),
    faculties: parseCommaSeparatedString(liferayConfig.faculties),
    programs: parseCommaSeparatedString(liferayConfig.programs),
    
    // FILTROS GEOGRÁFICOS
    countries: parseCommaSeparatedString(liferayConfig.countries),
    departments: parseCommaSeparatedString(liferayConfig.departments),
    cities: parseCommaSeparatedString(liferayConfig.cities),
    
    // ENTIDADES EXTERNAS
    universities: parseCommaSeparatedString(liferayConfig.universities),
    colleges: parseCommaSeparatedString(liferayConfig.colleges),
    companies: parseCommaSeparatedString(liferayConfig.companies),
    
    // CAMPOS OCULTOS
    authorizationSource: liferayConfig.authorizationSource || "Landing Eventos",
    requestOrigin: liferayConfig.requestOrigin || "Web to Lead",
    leadSource: liferayConfig.leadSource || "Landing Pages",
    
    // URLS
    retUrl: liferayConfig.retUrl || "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",
    privacyPolicyUrl: liferayConfig.privacyPolicyUrl || "https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html",
    
    // CONFIGURACIÓN TÉCNICA
    test: Boolean(liferayConfig.test),
    debug: Boolean(liferayConfig.debug),
    development: Boolean(liferayConfig.development),
    debugEmail: liferayConfig.debugEmail || "",
    
    // CONFIGURACIÓN DE CACHE
    cache: {
      enabled: Boolean(liferayConfig.cacheEnabled),
      expirationHours: parseInt(liferayConfig.cacheExpirationHours) || 12,
    },
    
    // CONFIGURACIÓN DE LOGGING
    logging: {
      enabled: Boolean(liferayConfig.loggingEnabled),
      level: liferayConfig.loggingLevel || "info",
      showTimestamp: liferayConfig.loggingShowTimestamp !== false, // Default true
      showLevel: true,
      prefix: `Liferay Form | ${liferayConfig.eventName || 'Evento'}`
    },
    
    // CONFIGURACIÓN DE UI (valores por defecto)
    ui: {
      errorClass: "error",
      validClass: "validated",
      errorTextClass: "error_text",
      hiddenClass: "fm-hidden",
      animationDuration: 300,
      enableAnimations: true,
      loadingText: "Cargando...",
      successText: "Enviado correctamente",
      errorText: "Error al procesar",
    },
    
    // CALLBACKS - Pueden ser definidos por el desarrollador
    callbacks: {
      onFormLoad: null,
      onFormSubmit: null,
      onFieldChange: null,
      onValidationError: null,
    },
  };
  
  console.log('🔄 Configuración transformada para FormManager:', transformedConfig);
  
  return transformedConfig;
}

/**
 * Configuración de fallback cuando no hay configuración de Liferay
 * @returns {Object} - Configuración por defecto
 */
function getDefaultConfiguration() {
  return {
    eventName: "Evento PUJ",
    eventDate: "",
    typeAttendee: [
      "Aspirante",
      "Padre de familia y/o acudiente",
      "Docente y/o psicoorientador",
      "Visitante PUJ",
      "Administrativo PUJ"
    ],
    attendanceDays: [],
    test: false,
    debug: false,
    development: false,
    logging: {
      enabled: false,
      level: "info",
      showTimestamp: true,
      showLevel: true,
      prefix: "Liferay Form | Default"
    }
  };
}

// ===============================
// INICIALIZACIÓN DEL FORMULARIO
// ===============================

/**
 * Buscar automáticamente el formulario en el fragmento
 * @returns {Object|null} - Objeto con id y elemento del formulario
 */
function findFormInFragment() {
  console.log('🔍 Buscando formulario en el fragmento...');
  
  // Prioridad 1: Buscar formularios con clase 'form-modules' (nuestro identificador específico)
  const formWithClass = document.querySelector('form.form-modules');
  if (formWithClass && formWithClass.id) {
    console.log(`✅ Formulario encontrado con clase 'form-modules': ${formWithClass.id}`);
    return {
      id: formWithClass.id,
      element: formWithClass
    };
  }
  
  // Prioridad 2: Buscar por IDs conocidos
  const knownIds = ['genericForm', 'eventForm', 'formEvent', 'mainForm'];
  for (const knownId of knownIds) {
    const formById = document.getElementById(knownId);
    if (formById && formById.tagName.toLowerCase() === 'form') {
      console.log(`✅ Formulario encontrado por ID conocido: ${knownId}`);
      return {
        id: knownId,
        element: formById
      };
    }
  }
  
  // Prioridad 3: Buscar cualquier formulario con ID
  const anyForm = document.querySelector('form[id]');
  if (anyForm) {
    console.log(`✅ Formulario encontrado genérico: ${anyForm.id}`);
    return {
      id: anyForm.id,
      element: anyForm
    };
  }
  
  // Último recurso: buscar cualquier formulario (incluso sin ID)
  const anyFormNoId = document.querySelector('form');
  if (anyFormNoId) {
    // Generar un ID temporal
    const tempId = 'liferayForm_' + Math.random().toString(36).substr(2, 9);
    anyFormNoId.id = tempId;
    console.log(`⚠️ Formulario sin ID encontrado, asignando ID temporal: ${tempId}`);
    return {
      id: tempId,
      element: anyFormNoId
    };
  }
  
  console.error('❌ No se encontró ningún formulario en el fragmento');
  return null;
}

/**
 * Inicializar el formulario con la configuración desde Liferay
 */
function initializeForm() {
  try {
    // Buscar el formulario automáticamente en el HTML
    const formInfo = findFormInFragment();
    
    if (!formInfo) {
      console.error('❌ No se encontró ningún formulario con ID en el fragmento');
      return;
    }
    
    const { id: formId, element: formElement } = formInfo;
    console.log(`🔍 Formulario detectado automáticamente con ID: ${formId}`);
    
    // Obtener configuración desde Liferay
    const liferayConfig = getLiferayConfiguration();
    
    // Transformar a formato FormManager
    const formConfig = Object.keys(liferayConfig).length > 0 
      ? transformLiferayConfig(liferayConfig)
      : getDefaultConfiguration();
    
    console.log(`🚀 Inicializando formulario con ID: ${formId}`);
    
    // Verificar que FormManager está disponible
    if (typeof FormManager === 'undefined') {
      console.error('❌ FormManager no está disponible. Asegúrate de que el script principal esté cargado.');
      return;
    }
    
    // Inicializar FormManager
    const formManager = new FormManager(formId, formConfig);
    
    // Inicializar el formulario
    formManager.initialize().then(() => {
      console.log('✅ Formulario inicializado correctamente');
      
      // Exponer la instancia globalmente para debugging
      if (formConfig.debug) {
        window.formManagerInstance = formManager;
        console.log('🐛 Instancia de FormManager disponible en window.formManagerInstance');
      }
    }).catch((error) => {
      console.error('❌ Error al inicializar el formulario:', error);
    });
    
  } catch (error) {
    console.error('❌ Error en inicialización del formulario:', error);
  }
}

// ===============================
// AUTO-INICIALIZACIÓN
// ===============================

/**
 * Función de inicialización que se ejecuta cuando el DOM está listo
 */
function onDOMReady() {
  console.log('📄 DOM listo, inicializando formulario Liferay');
  
  // Pequeño delay para asegurar que todas las dependencias estén cargadas
  setTimeout(() => {
    initializeForm();
  }, 100);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onDOMReady);
} else {
  // DOM ya está listo
  onDOMReady();
}

// ===============================
// UTILIDADES PARA DESARROLLO
// ===============================

/**
 * Utilidad para actualizar configuración dinámicamente (solo para desarrollo)
 */
window.updateFormConfig = function(newConfig) {
  if (window.formManagerInstance) {
    window.formManagerInstance.updateConfig(newConfig);
    console.log('🔄 Configuración actualizada:', newConfig);
  } else {
    console.warn('⚠️ No hay instancia de FormManager disponible');
  }
};

/**
 * Utilidad para obtener configuración actual (solo para desarrollo)
 */
window.getFormConfig = function() {
  if (window.formManagerInstance) {
    return window.formManagerInstance.getConfig();
  } else {
    console.warn('⚠️ No hay instancia de FormManager disponible');
    return null;
  }
};

console.log('📦 Script de Liferay Fragment cargado correctamente');
