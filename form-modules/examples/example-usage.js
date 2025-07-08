/**
 * Ejemplo de uso de los módulos de formulario
 * Este archivo muestra cómo instanciar y configurar múltiples formularios
 */

import { FormManager } from '../modules/FormManager.js';

// ===================================================
// EJEMPLO 1: Formulario básico de eventos
// ===================================================

const eventoOpenDayConfig = {
  eventName: 'Open Day 2025',
  eventDate: '15/03/2025',
  university: 'Pontificia Universidad Javeriana',
  
  typeAttendee: [
    'Aspirante',
    'Padre de familia y/o acudiente'
  ],
  
  attendanceDays: [
    'Viernes 15 de marzo',
    'Sábado 16 de marzo'
  ],
  
  // Configuración de ambiente
  debugMode: true,
  devMode: false,
  debugEmail: 'test@javeriana.edu.co',
  
  // UTM tracking
  campaign: 'OPEN_DAY_2025',
  source: 'Website',
  medium: 'Organic',
  
  // Callbacks personalizados
  callbacks: {
    onFormLoad: (formManager) => {
      console.log('📋 Formulario Open Day cargado');
      console.log('⚙️ Configuración:', formManager.getConfig());
    },
    
    onFormSubmit: async (formData, formManager) => {
      console.log('🚀 Enviando formulario Open Day');
      console.log('📊 Datos:', formData);
      
      // Lógica personalizada antes del envío
      // Retornar false para cancelar el envío
      return true;
    },
    
    onFieldChange: (fieldName, value, formManager) => {
      console.log(`🔄 Campo ${fieldName} cambió a: ${value}`);
    }
  }
};

// Instanciar formulario Open Day
const openDayForm = new FormManager(eventoOpenDayConfig);

// ===================================================
// EJEMPLO 2: Formulario específico para posgrados
// ===================================================

const posgradoConfig = {
  eventName: 'Feria de Posgrados 2025',
  eventDate: '20/04/2025',
  university: 'Pontificia Universidad Javeriana',
  
  typeAttendee: ['Aspirante'], // Solo aspirantes
  
  attendanceDays: ['Sábado 20 de abril'],
  
  // Filtrar solo programas de posgrado
  academicLevels: [
    { code: 'GRAD', name: 'Posgrado' }
  ],
  
  // Filtrar facultades específicas
  faculties: [
    'Facultad de Ciencias',
    'Facultad de Ingeniería'
  ],
  
  // Configuración específica
  debugMode: false,
  devMode: false,
  
  campaign: 'POSGRADO_2025',
  source: 'Email',
  medium: 'Newsletter',
  
  callbacks: {
    onFormLoad: (formManager) => {
      console.log('📋 Formulario Posgrado cargado');
      
      // Configuración específica para posgrados
      formManager.ui.createNotification('Formulario especializado para posgrados', 'info');
    }
  }
};

const posgradoForm = new FormManager(posgradoConfig);

// ===================================================
// EJEMPLO 3: Formulario para convenios empresariales
// ===================================================

const convenioConfig = {
  eventName: 'Evento Corporativo XYZ',
  eventDate: '10/05/2025',
  university: 'Pontificia Universidad Javeriana',
  company: 'Empresa XYZ S.A.S.',
  
  typeAttendee: [
    'Empleado',
    'Directivo',
    'Familiar'
  ],
  
  attendanceDays: ['Viernes 10 de mayo'],
  
  // Configuración de validación personalizada
  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true
  },
  
  // UTM específico para convenios
  campaign: 'CONVENIO_XYZ',
  source: 'Corporate',
  medium: 'Partnership',
  
  callbacks: {
    onFormLoad: (formManager) => {
      console.log('📋 Formulario Convenio cargado');
      
      // Personalizar mensajes para convenios
      formManager.validator.addErrorMessage('required', 'Este campo es requerido para el evento corporativo');
    },
    
    onFormSubmit: async (formData, formManager) => {
      console.log('🏢 Enviando formulario corporativo');
      
      // Validaciones adicionales para convenios
      if (!formData.company) {
        formManager.ui.createNotification('Empresa requerida para evento corporativo', 'error');
        return false;
      }
      
      return true;
    }
  }
};

const convenioForm = new FormManager(convenioConfig);

// ===================================================
// FUNCIONES DE INICIALIZACIÓN
// ===================================================

/**
 * Inicializar formulario según el tipo de página
 */
async function initializeFormBasedOnPage() {
  const pageType = document.body.dataset.pageType || 'default';
  
  switch (pageType) {
    case 'open-day':
      await openDayForm.init();
      break;
      
    case 'posgrado':
      await posgradoForm.init();
      break;
      
    case 'convenio':
      await convenioForm.init();
      break;
      
    default:
      // Formulario por defecto
      await openDayForm.init();
  }
}

/**
 * Inicializar múltiples formularios en la misma página
 */
async function initializeMultipleForms() {
  // Ejemplo: página con varios formularios
  const openDayFormElement = document.querySelector('#form-open-day');
  const posgradoFormElement = document.querySelector('#form-posgrado');
  
  if (openDayFormElement) {
    const openDayInstance = new FormManager({
      ...eventoOpenDayConfig,
      formSelector: '#form-open-day'
    });
    await openDayInstance.init();
  }
  
  if (posgradoFormElement) {
    const posgradoInstance = new FormManager({
      ...posgradoConfig,
      formSelector: '#form-posgrado'
    });
    await posgradoInstance.init();
  }
}

/**
 * Configuración dinámica basada en parámetros URL
 */
async function initializeDynamicForm() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Configuración base
  const baseConfig = {
    debugMode: urlParams.get('debug') === 'true',
    devMode: urlParams.get('dev') === 'true'
  };
  
  // Configuración específica según parámetros
  const eventType = urlParams.get('event') || 'default';
  
  let specificConfig = {};
  
  switch (eventType) {
    case 'open-day':
      specificConfig = eventoOpenDayConfig;
      break;
    case 'posgrado':
      specificConfig = posgradoConfig;
      break;
    case 'convenio':
      specificConfig = convenioConfig;
      break;
    default:
      specificConfig = eventoOpenDayConfig;
  }
  
  // Combinar configuraciones
  const finalConfig = { ...specificConfig, ...baseConfig };
  
  // Configurar datos desde URL
  if (urlParams.get('eventName')) {
    finalConfig.eventName = urlParams.get('eventName');
  }
  
  if (urlParams.get('eventDate')) {
    finalConfig.eventDate = urlParams.get('eventDate');
  }
  
  if (urlParams.get('campaign')) {
    finalConfig.campaign = urlParams.get('campaign');
  }
  
  // Inicializar formulario
  const dynamicForm = new FormManager(finalConfig);
  await dynamicForm.init();
  
  return dynamicForm;
}

// ===================================================
// FUNCIONES DE UTILIDAD
// ===================================================

/**
 * Cambiar configuración de un formulario existente
 */
function updateFormConfig(formInstance, newConfig) {
  formInstance.updateConfig(newConfig);
  console.log('⚙️ Configuración actualizada');
}

/**
 * Obtener estadísticas de un formulario
 */
function getFormStats(formInstance) {
  return {
    config: formInstance.getConfig(),
    formData: formInstance.getFormData(),
    isInitialized: formInstance.isInitialized,
    dataStats: formInstance.dataManager.getDataStats(),
    apiStats: formInstance.apiService.getSubmitStats()
  };
}

/**
 * Limpiar y reiniciar formulario
 */
function resetForm(formInstance) {
  formInstance.reset();
  console.log('🔄 Formulario reiniciado');
}

/**
 * Cambiar modo debug en tiempo real
 */
function toggleDebugMode(formInstance, enabled) {
  formInstance.setDebugMode(enabled);
  formInstance.apiService.setDebugMode(enabled);
  console.log(`🔧 Modo debug: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
}

// ===================================================
// INICIALIZACIÓN AUTOMÁTICA
// ===================================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Inicializar según el contexto
    const hasMultipleForms = document.querySelectorAll('form').length > 1;
    
    if (hasMultipleForms) {
      await initializeMultipleForms();
    } else {
      await initializeDynamicForm();
    }
    
    console.log('✅ Formularios inicializados correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar formularios:', error);
  }
});

// ===================================================
// EXPORTAR PARA USO GLOBAL
// ===================================================

// Hacer disponible globalmente para debugging
window.FormManager = FormManager;
window.formUtils = {
  updateFormConfig,
  getFormStats,
  resetForm,
  toggleDebugMode
};

// Exportar configuraciones de ejemplo
export {
  eventoOpenDayConfig,
  posgradoConfig,
  convenioConfig,
  initializeFormBasedOnPage,
  initializeMultipleForms,
  initializeDynamicForm
};