/**
 * ===================================================================
 * 🎨 GESTIÓN DE LA PÁGINA DE EJEMPLOS
 * ===================================================================
 *
 * Archivo dedicado a la funcionalidad de la página de ejemplos:
 *
 * 🔧 FUNCIONES DE NAVEGACIÓN Y UI
 *    └─ Tabs de código, botones de copia, navegación
 *
 * 🎭 CONTROLES DE FORMULARIO
 *    └─ Reset, debug, dev mode, mostrar datos
 *
 * 🎨 EFECTOS VISUALES
 *    └─ Modales, tooltips, feedback visual
 *
 * Para modificar la funcionalidad de la página, edita este archivo
 */

// ============================================================================
// 🎨 FUNCIONES DEL VISOR DE CÓDIGO
// ============================================================================

// Estado de las pestañas activas
window.activeTabs = {
  advanced: 'js',
  programs: 'js',
  custom: 'js'
}

// Función global para cambiar tabs de código
window.showCodeTab = function (example, type) {
  console.log(`Switching to ${type} tab for ${example}`)

  // Actualizar tabs visuales - buscar por onclick exacto para ser más específico
  const jsTab = document.querySelector(`button[onclick="showCodeTab('${example}', 'js')"]`)
  const htmlTab = document.querySelector(`button[onclick="showCodeTab('${example}', 'html')"]`)

  if (jsTab && htmlTab) {
    // Remover clase activa de ambas pestañas
    jsTab.classList.remove('gh-code-tab-active')
    htmlTab.classList.remove('gh-code-tab-active')

    // Activar la pestaña seleccionada
    if (type === 'js') {
      jsTab.classList.add('gh-code-tab-active')
      console.log('Activated JS tab')
    } else if (type === 'html') {
      htmlTab.classList.add('gh-code-tab-active')
      console.log('Activated HTML tab')
    }
  } else {
    console.log('Tabs not found for example:', example)
  }

  // Ocultar todos los contenidos de código para este ejemplo
  const jsContent = document.getElementById(`${example}-js-code`)
  const htmlContent = document.getElementById(`${example}-html-code`)

  if (jsContent) jsContent.classList.add('gh-code-hidden')
  if (htmlContent) htmlContent.classList.add('gh-code-hidden')

  // Mostrar el contenido seleccionado
  const selectedContent = document.getElementById(`${example}-${type}-code`)
  if (selectedContent) {
    selectedContent.classList.remove('gh-code-hidden')
    console.log(`Showing content for ${type}`)
  }

  // Actualizar tab activo
  if (!window.activeTabs) window.activeTabs = {}
  window.activeTabs[example] = type
}

/**
 * Copiar código del visor integrado
 */
window.copyCode = function (example, buttonElement) {
  // Determinar qué pestaña está activa
  const activeTab = document.querySelector(`[onclick*="showCodeTab('${example}',"][class*="active"]`)
  let type = 'js' // default

  if (activeTab) {
    const onclickAttr = activeTab.getAttribute('onclick')
    if (onclickAttr.includes("'html'")) type = 'html'
  }

  // Obtener el contenido del código
  const codeElement = document.getElementById(`${example}-${type}-content`)

  if (codeElement) {
    const text = codeElement.textContent
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Mostrar feedback visual
        const originalText = buttonElement.textContent
        buttonElement.textContent = '¡Copiado!'
        buttonElement.style.backgroundColor = '#22c55e'
        buttonElement.style.color = 'white'

        setTimeout(() => {
          buttonElement.textContent = originalText
          buttonElement.style.backgroundColor = ''
          buttonElement.style.color = ''
        }, 2000)
      })
      .catch(err => {
        console.error('Error al copiar:', err)
        alert('Error al copiar el código')
      })
  }
}

// ============================================================================
// 🎛️ CONTROLES DE FORMULARIO
// ============================================================================

/**
 * Resetear formulario
 */
window.resetForm = function () {
  if (window.FORM_INSTANCE) {
    window.FORM_INSTANCE.reset()
    console.log('Formulario reseteado')
    showToast('Formulario limpiado correctamente', 'success')
  }
}

/**
 * Alternar modo debug
 */
window.toggleDebugMode = function () {
  if (window.FORM_INSTANCE) {
    const currentState = window.FORM_INSTANCE.getConfig().debugMode
    window.FORM_INSTANCE.setDebugMode(!currentState)
    console.log(`Debug mode: ${!currentState ? 'ON' : 'OFF'}`)
    showToast(`Modo debug ${!currentState ? 'activado' : 'desactivado'}`, 'info')
  }
}

/**
 * Alternar modo desarrollo
 */
window.toggleDevMode = function () {
  if (window.FORM_INSTANCE) {
    const currentState = window.FORM_INSTANCE.getConfig().devMode
    window.FORM_INSTANCE.setDevMode(!currentState)
    console.log(`Dev mode: ${!currentState ? 'ON' : 'OFF'}`)
    showToast(`Modo desarrollo ${!currentState ? 'activado' : 'desactivado'}`, 'info')
  }
}

/**
 * Mostrar datos del formulario
 */
window.showFormData = function () {
  if (window.FORM_INSTANCE) {
    const data = window.FORM_INSTANCE.getFormData()
    console.log('📊 Datos del formulario:', data)

    // Mostrar en modal
    const formattedData = JSON.stringify(data, null, 2)
    showModal(
      'Datos del Formulario',
      `<pre style="background: #f5f5f5; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto;"><code>${formattedData}</code></pre>`
    )
  }
}

/**
 * Mostrar logs del sistema
 */
window.showLogs = function () {
  if (window.FORM_INSTANCE) {
    const logs = window.FORM_INSTANCE.getLogs()
    console.log('📋 Logs del sistema:', logs)

    // Formatear logs para mostrar
    let logContent = logs
      .map(
        log =>
          `<div style="margin-bottom: 10px; padding: 8px; background: ${getLogLevelColor(log.level)}; border-radius: 4px;">
        <strong>[${log.level.toUpperCase()}]</strong> ${log.timestamp} - ${log.message}
      </div>`
      )
      .join('')

    if (logContent === '') {
      logContent = '<p>No hay logs disponibles</p>'
    }

    showModal('Logs del Sistema', `<div style="max-height: 400px; overflow-y: auto;">${logContent}</div>`)
  }
}

/**
 * Obtener color para nivel de log
 */
function getLogLevelColor(level) {
  const colors = {
    debug: '#e3f2fd',
    info: '#e8f5e8',
    warn: '#fff3cd',
    error: '#f8d7da'
  }
  return colors[level] || '#f8f9fa'
}

// ============================================================================
// 🎭 SISTEMA DE MODALES Y TOASTS
// ============================================================================

/**
 * Mostrar modal genérico
 */
function showModal(title, content) {
  // Crear modal si no existe
  let modal = document.getElementById('generic-modal')
  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'generic-modal'
    modal.className = 'gh-modal'
    modal.innerHTML = `
      <div class="gh-modal-content">
        <div class="gh-modal-header">
          <h3 class="gh-modal-title"></h3>
          <button class="gh-modal-close" onclick="closeModal('generic-modal')">&times;</button>
        </div>
        <div class="gh-modal-body"></div>
      </div>
    `
    document.body.appendChild(modal)
  }

  // Actualizar contenido
  modal.querySelector('.gh-modal-title').textContent = title
  modal.querySelector('.gh-modal-body').innerHTML = content

  // Mostrar modal
  modal.style.display = 'flex'

  // Cerrar con Escape
  const closeHandler = e => {
    if (e.key === 'Escape') {
      closeModal('generic-modal')
      document.removeEventListener('keydown', closeHandler)
    }
  }
  document.addEventListener('keydown', closeHandler)
}

/**
 * Cerrar modal
 */
window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = 'none'
  }
}

/**
 * Mostrar toast notification
 */
function showToast(message, type = 'info') {
  // Crear container de toasts si no existe
  let container = document.getElementById('toast-container')
  if (!container) {
    container = document.createElement('div')
    container.id = 'toast-container'
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `
    document.body.appendChild(container)
  }

  // Crear toast
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.style.cssText = `
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    min-width: 300px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    ${getToastStyle(type)}
  `
  toast.textContent = message

  container.appendChild(toast)

  // Animar entrada
  requestAnimationFrame(() => {
    toast.style.opacity = '1'
    toast.style.transform = 'translateX(0)'
  })

  // Auto-remove después de 3 segundos
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, 3000)
}

/**
 * Obtener estilos para toast según tipo
 */
function getToastStyle(type) {
  const styles = {
    success: 'background-color: #22c55e;',
    error: 'background-color: #ef4444;',
    warning: 'background-color: #f59e0b;',
    info: 'background-color: #3b82f6;'
  }
  return styles[type] || styles.info
}

// ============================================================================
// 📋 TEMPLATES DE CÓDIGO DE EJEMPLO
// ============================================================================

// Exponer configuraciones para que los templates puedan acceder a ellas
window.formConfigs = {
  advanced: null, // Se asignará desde examples.js
  testPrograms: null,
  testLocations: null,
  testLogging: null
}

const templates = {
  basic: `
// Configuración básica para evento
import { FormManager } from "./modules/FormManager.js";

const eventConfig = {
  eventName: "Mi Evento 2025",
  company: "Mi Universidad",
  typeAttendee: ["Aspirante", "Visitante"],
  attendanceDays: ["Día único"],
  
  // Configuración básica
  country: "CO",
  validation: { },
  debugMode: false
};

const form = new FormManager("form_id", eventConfig);
form.init().then(() => {
  console.log("🚀 Formulario inicializado");
});`,

  academic: `
// Configuración para formulario académico completo
import { FormManager } from "./modules/FormManager.js";

const academicConfig = {
  eventName: "Open Day Académico 2025",
  company: "Universidad Javeriana",
  
  // Configuración académica específica
  typeAttendee: ["Aspirante"],
  faculties: ["Ingeniería", "Ciencias"],
  programs: ["ISIST", "IINDS", "BIOLG"],
  
  // Validación estricta para aspirantes
  validation: {
    strictInitialValidation: true
  },
  
  // Callbacks específicos para aspirantes
  callbacks: {
    onFormLoad: (form) => {
      console.log("📚 Formulario académico listo");
    },
    onFormSubmit: async (data) => {
      console.log("🎓 Datos de aspirante:", data);
      return true;
    }
  }
};

const academicForm = new FormManager("form_id", academicConfig);
academicForm.init();`,

  'custom-form': `
// Configuración personalizada avanzada
import { FormManager } from "./modules/FormManager.js";

const customConfig = {
  eventName: "Evento Personalizado VIP",
  company: "Universidad Javeriana",
  
  // Configuración VIP
  typeAttendee: ["VIP", "Invitado Especial"],
  attendanceDays: ["Sesión Exclusiva"],
  
  // Configuración avanzada
  debugMode: true,
  autoSave: true,
  
  // Callbacks personalizados
  callbacks: {
    onFormLoad: (formManager) => {
      console.log("🌟 Formulario VIP cargado");
      
      // Personalización visual avanzada
      const form = document.querySelector("#form_inscription");
      form.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      form.style.padding = "30px";
      form.style.borderRadius = "15px";
    },

    onFormSubmit: async (formData) => {
      console.log("🎯 Enviando datos VIP:", formData);

      // Validación personalizada
      if (formData.email && !formData.email.includes('vip')) {
        console.warn("Email no parece ser VIP");
      }

      return true;
    },

    onFieldChange: (field, value) => {
      if (field.name === 'email' && value.includes('vip')) {
        field.style.background = "linear-gradient(45deg, #ffd700, #ffed4e)";
        console.log("🌟 Email VIP detectado!");
      }
    }
  }
};

const customForm = new FormManager("form_id", customConfig);
customForm.init();`,

  'js-only': `
// Solo JavaScript - Para integrar en HTML existente
import { FormManager } from "./modules/FormManager.js";

const config = {
  eventName: "Tu Evento",
  typeAttendee: ["Tipo1", "Tipo2"],
  
  styles: { enabled: true, basePath: "./" },
  validation: { },
  debugMode: true,

  callbacks: {
    onFormLoad: () => console.log("✅ Listo"),
    onFormSubmit: async (data) => {
      // Tu lógica de envío aquí
      console.log(data);
      return true;
    }
  }
};

new FormManager("form_id", config).init();`,

  'dev-config': `
// Configuración optimizada para desarrollo
import { FormManager } from "./modules/FormManager.js";

const devConfig = {
  eventName: "Desarrollo - Test Event",
  typeAttendee: ["Test User", "Developer"],

  // Configuración de desarrollo
  debugMode: true,
  devMode: true,

  // Logging completo
  logging: {
    enabled: true,
    level: "debug",
    showTimestamp: true,
  },

  // Caché deshabilitado para desarrollo
  cacheEnabled: false,

  // Validación en tiempo real para testing
  validation: {
  },

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("🔧 Modo desarrollo activo");
      console.log("Config:", formManager.getConfig());
    },

    onFormSubmit: async (formData, formManager) => {
      console.log("🧪 Test - Datos del formulario:", formData);
      console.log("📊 Estadísticas:", formManager.getLoggingStats());

      // Simular delay de red en desarrollo
      await new Promise(resolve => setTimeout(resolve, 1000));

      alert("✅ Envío simulado exitoso (dev mode)");
      return true;
    }
  }
};

const devForm = new FormManager("form_id", devConfig);
devForm.init().then(() => {
  // Funciones de debugging disponibles globalmente
  window.devForm = devForm;
  window.showDevInfo = () => console.table(devForm.getFormData());
});`,

  'prod-config': `
// Configuración optimizada para producción
import { FormManager } from "./modules/FormManager.js";

const prodConfig = {
  eventName: "Evento Producción 2025",
  company: "Universidad Javeriana",
  
  // Configuración de producción
  debugMode: false,
  devMode: false,
  
  // Logging mínimo en producción
  logging: {
    enabled: true,
    level: "warn", // Solo warnings y errores
    showTimestamp: false,
  },
  
  // Optimizaciones de rendimiento
  cacheEnabled: true,
  autoSave: true,
  
  // Validación optimizada
  validation: {
    strictInitialValidation: false
  },
  
  // URLs de producción
  thankYouUrl: "https://www.javeriana.edu.co/inscripcion-exitosa",
  
  callbacks: {
    onFormSubmit: async (formData, formManager) => {
      // Analytics en producción
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          event_category: 'formulario',
          event_label: formData.eventName
        });
      }
      
      return true;
    },
    
    onFormSuccess: (result, formManager) => {
      // Redirección automática en producción
      setTimeout(() => {
        window.location.href = formManager.getConfig().thankYouUrl;
      }, 2000);
    }
  }
};

const prodForm = new FormManager("form_id", prodConfig);
prodForm.init().catch(error => {
  console.error("Error crítico inicializando formulario:", error);
});`
}

// Exponer templates globalmente
window.templates = templates

// ============================================================================
// 🚀 INICIALIZACIÓN DE LA PÁGINA
// ============================================================================

/**
 * Inicializar funcionalidades de la página
 */
function initializePageFunctionality() {
  console.log('🎨 Inicializando funcionalidades de la página de ejemplos')

  // Configurar event listeners globales
  document.addEventListener('click', e => {
    // Cerrar modales al hacer click fuera
    if (e.target.classList.contains('gh-modal')) {
      e.target.style.display = 'none'
    }
  })

  console.log('✅ Página de ejemplos inicializada')
}

// ============================================================================
// 🔧 UTILIDADES
// ============================================================================

/**
 * Formatear JSON para mostrar
 */
function formatJSON(obj) {
  return JSON.stringify(obj, null, 2)
}

/**
 * Debounce function para optimizar eventos
 */
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// ============================================================================
// 🚀 AUTO-INICIALIZACIÓN
// ============================================================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePageFunctionality)
} else {
  initializePageFunctionality()
}

// Exportar funciones principales para uso externo
window.pageUtils = {
  showModal,
  showToast,
  formatJSON,
  debounce
}

// ============================================================================
// 📤 EXPORTACIONES
// ============================================================================

export { templates, showModal, showToast, formatJSON, debounce }
