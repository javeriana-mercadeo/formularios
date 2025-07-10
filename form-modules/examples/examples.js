/**
 * Sistema de ejemplos y mini biblioteca para Form Modules
 * Contiene configuraciones, templates y funciones de gestión
 */

import { FormManager } from "../modules/FormManager.js";

// ========================================
// CONFIGURACIONES DE EJEMPLO
// ========================================

// Configuración avanzada
const advancedConfig = {
  eventName: "Open Day Avanzado 2025",
  eventDate: "23/01/2025 12:00 PM" || "23%2F01%2F2025%2012%3A00%20PM",
  company: "Universidad Javeriana",

  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Estudiante actual", "Graduado"],

  attendanceDays: ["Día 1 - Pregrado", "Día 2 - Posgrado", "Día 3 - Educación Continua"],

  academicLevels: [
    // Vacío para usar detección automática desde programas.json
  ],

  faculties: ["Ingeniería", "Ciencias", "Humanidades", "Ciencias Económicas y Administrativas"],

  formSelector: "#advanced_form",

  cacheEnabled: false,
  cacheExpirationHours: 12,

  styles: {
    enabled: true,
    basePath: "../",
    autoLoad: true,
    useCombined: true,
    customVariables: {
      "primary-color": "#2563eb",
      "primary-hover": "#1d4ed8",
      "success-color": "#10b981",
      "border-radius": "8px",
    },
  },

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  logging: {
    enabled: true,
    level: "debug",
    prefix: "Formulario avanzado",
    colors: true,
    persistLogs: true,
    maxLogs: 1000,
  },

  debugMode: true,
  devMode: true,

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("⚙️ Formulario avanzado cargado");
      console.log("📊 Estadísticas de datos:", formManager.dataManager?.getDataStats());
    },

    onFormSubmit: async (formData, formManager) => {
      console.log("🚀 Enviando formulario avanzado:", formData);

      // Validaciones personalizadas
      if (formData.type_attendee === "Aspirante" && !formData.program) {
        alert("Por favor selecciona un programa académico");
        return false;
      }

      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("¡Registro avanzado completado! (Modo demo)");

      return true;
    },

    onFieldChange: (field, value, formManager) => {
      console.log(`🔄 Campo ${field.name} cambió a: ${value}`);

      // Lógica personalizada por campo
      if (field.name === "type_attendee" && value === "Aspirante") {
        console.log("🎯 Aspirante detectado - Mostrando campos académicos");
      }
    },
  },
};

// ========================================
// FUNCIONES DE GESTIÓN DE CÓDIGO Y TEMPLATES
// ========================================

// Almacenar configuraciones para mostrar código
window.formConfigs = {
  advanced: advancedConfig,
};

// Tabs activos
window.activeTabs = {
  basic: "js",
  advanced: "js",
  custom: "js",
};

// Función para cambiar tabs
window.showCodeTab = function (example, type) {
  // Actualizar tabs visuales
  const tabs = document.querySelectorAll(`#${example}_form`).length
    ? document.querySelectorAll(`.code-section .code-tab`)
    : [];

  const exampleTabs = Array.from(tabs).filter(
    (tab) => tab.onclick && tab.onclick.toString().includes(`'${example}'`)
  );

  exampleTabs.forEach((tab) => tab.classList.remove("active"));
  event.target.classList.add("active");

  // Mostrar contenido correspondiente
  ["js", "html", "config"].forEach((t) => {
    const element = document.getElementById(`${example}-${t}-code`);
    if (element) {
      element.classList.toggle("hidden", t !== type);
    }
  });

  // Actualizar tab activo
  window.activeTabs[example] = type;
};

// Función para copiar código
window.copyCode = function (example) {
  const activeTab = window.activeTabs[example];
  const element = document.getElementById(`${example}-${activeTab}-content`);

  if (element) {
    const text = element.textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Mostrar feedback visual
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = "✅ Copiado";
        button.classList.add("copied");

        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove("copied");
        }, 2000);
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        alert("Error al copiar el código");
      });
  }
};

// ========================================
// TEMPLATES DE CÓDIGO LISTOS PARA USAR
// ========================================

const templates = {
  "simple-event": `
// Configuración simple para evento
import { FormManager } from "./modules/FormManager.js";

const eventConfig = {
  eventName: "Mi Evento 2025",
  eventDate: "15/04/2025",
  typeAttendee: ["Aspirante", "Visitante"],

  styles: {
    enabled: true,
    basePath: "./",
    autoLoad: true,
  },

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  debugMode: true,
  devMode: true,

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("✅ Formulario cargado");
    },
    onFormSubmit: async (formData) => {
      console.log("📤 Enviando:", formData);
      alert("¡Registro exitoso!");
      return true;
    }
  }
};

const form = new FormManager(eventConfig);
form.init().then(() => {
  console.log("🚀 Formulario inicializado");
});`,

  "simple-event-html": `
<form id="form_inscription">
  <div class="name-row">
    <input type="text" placeholder="*Nombre(s)" name="first_name" required />
    <input type="text" placeholder="*Apellidos" name="last_name" required />
  </div>

  <input type="email" placeholder="*Email" name="email" required />

  <div class="phone-row">
    <select name="phone_code" required>
      <option value="">(+) Indicativo</option>
    </select>
    <input type="text" placeholder="*Teléfono" name="phone" required />
  </div>

  <select name="country" required>
    <option value="">*País de residencia</option>
  </select>

  <select name="type_attendee" required>
    <option value="">*Tipo de asistente</option>
  </select>

  <div class="radio-group">
    <p>¿Autorizas el tratamiento de datos?</p>
    <input type="radio" name="authorization_data" value="1" /> Sí
    <input type="radio" name="authorization_data" value="0" /> No
  </div>

  <button type="submit" disabled>Registrarme</button>
</form>`,

  "academic-form": `
// Configuración para formulario académico completo
import { FormManager } from "./modules/FormManager.js";

const academicConfig = {
  eventName: "Open Day Académico 2025",
  eventDate: "20/04/2025",

  typeAttendee: [
    "Aspirante",
    "Padre de familia",
    "Estudiante actual",
    "Graduado"
  ],

  attendanceDays: [
    "Día 1 - Pregrado",
    "Día 2 - Posgrado"
  ],

  academicLevels: [
    { code: "pregrado", name: "Pregrado" },
    { code: "posgrado", name: "Posgrado" }
  ],

  faculties: [
    "Ingeniería",
    "Ciencias",
    "Humanidades"
  ],

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  styles: {
    enabled: true,
    basePath: "./",
    autoLoad: true,
    customVariables: {
      "primary-color": "#2563eb",
      "success-color": "#10b981"
    }
  },

  logging: {
    enabled: true,
    level: "info",
    persistLogs: true
  },

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("✅ Formulario académico cargado");
    },
    onFormSubmit: async (formData) => {
      console.log("📤 Enviando datos académicos:", formData);
      return true;
    }
  }
};

const academicForm = new FormManager(academicConfig);
academicForm.init();`,

  "custom-form": `
// Configuración personalizada avanzada
import { FormManager } from "./modules/FormManager.js";

const customConfig = {
  eventName: "Evento Personalizado VIP",
  eventDate: "25/04/2025",

  typeAttendee: ["VIP", "Premium", "Elite"],

  styles: {
    enabled: true,
    basePath: "./",
    autoLoad: true,
    includeTheme: true,
    customVariables: {
      "primary-color": "#7c3aed",
      "primary-hover": "#6d28d9",
      "border-radius": "12px",
      "font-family": "'Inter', sans-serif"
    }
  },

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  logging: {
    enabled: true,
    level: "debug",
    persistLogs: true,
    maxLogs: 1000
  },

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("🎨 Formulario VIP cargado");

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

const customForm = new FormManager(customConfig);
customForm.init();`,

  "js-only": `
// Solo JavaScript - Para integrar en HTML existente
import { FormManager } from "./modules/FormManager.js";

const config = {
  eventName: "Tu Evento",
  typeAttendee: ["Tipo1", "Tipo2"],
  formSelector: "#tu_formulario", // Cambia por tu selector

  styles: { enabled: true, basePath: "./" },
  validation: { realTimeValidation: true },
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

new FormManager(config).init();`,

  "dev-config": `
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
    colors: true,
    persistLogs: true,
    maxLogs: 1000
  },

  // Caché deshabilitado para desarrollo
  cacheEnabled: false,

  // Validación en tiempo real para testing
  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
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
    },

    onFieldChange: (field, value) => {
      console.log(\`🔄 Campo \${field.name}: \${value}\`);
    },

    onValidationError: (error) => {
      console.warn("⚠️ Error de validación:", error);
    }
  }
};

const devForm = new FormManager(devConfig);
devForm.init().then(() => {
  // Funciones de debugging disponibles globalmente
  window.devForm = devForm;
  window.debugForm = () => console.log(devForm.getFormData());
  window.exportLogs = () => console.log(devForm.exportLogs());
});`,

  "prod-config": `
// Configuración optimizada para producción
import { FormManager } from "./modules/FormManager.js";

const prodConfig = {
  eventName: "Evento Producción 2025",
  eventDate: "30/04/2025",

  typeAttendee: ["Aspirante", "Visitante"],

  // Configuración de producción
  debugMode: false,
  devMode: false,

  // Logging mínimo en producción
  logging: {
    enabled: true,
    level: "error", // Solo errores críticos
    persistLogs: false,
    maxLogs: 50
  },

  // Caché habilitado para mejor rendimiento
  cacheEnabled: true,
  cacheExpirationHours: 12,

  // Validación optimizada
  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  // Estilos optimizados
  styles: {
    enabled: true,
    basePath: "./",
    autoLoad: true,
  },

  // URLs de producción
  thankYouUrl: "https://tusitio.com/gracias",
  privacyPolicyUrl: "https://tusitio.com/privacidad",

  callbacks: {
    onFormLoad: () => {
      // Tracking de analytics en producción
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_loaded', {
          'event_category': 'formulario',
          'event_label': 'carga_exitosa'
        });
      }
    },

    onFormSubmit: async (formData) => {
      try {
        // Tracking de conversión
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submitted', {
            'event_category': 'formulario',
            'event_label': 'envio_exitoso'
          });
        }

        console.log("✅ Formulario enviado exitosamente");
        return true;

      } catch (error) {
        // Tracking de errores
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_error', {
            'event_category': 'formulario',
            'event_label': error.message
          });
        }

        console.error("❌ Error en envío:", error);
        return false;
      }
    }
  }
};

const prodForm = new FormManager(prodConfig);
prodForm.init().catch(error => {
  console.error("Error crítico inicializando formulario:", error);
});`,
};

// ========================================
// FUNCIONES DE GESTIÓN DE TEMPLATES
// ========================================

// Función para copiar template
window.copyTemplate = function (templateKey, buttonElement) {
  const template = templates[templateKey];
  if (template) {
    navigator.clipboard
      .writeText(template.trim())
      .then(() => {
        // Feedback visual
        const button = buttonElement || document.querySelector(`[onclick*="copyTemplate('${templateKey}')"]`);
        if (button) {
          const originalText = button.innerHTML;
          button.innerHTML = "✅ Copiado";
          button.style.background = "rgba(16, 185, 129, 0.2)";

          setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = "";
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Error al copiar template:", err);
        alert("Error al copiar el template");
      });
  }
};

// Función para mostrar template en modal
window.showTemplate = function (templateKey) {
  const template = templates[templateKey];
  if (template) {
    // Crear modal simple
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `;

    const content = document.createElement("div");
    content.style.cssText = `
      background: #1e293b;
      color: #e2e8f0;
      border-radius: 10px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
      position: relative;
    `;

    const header = document.createElement("div");
    header.style.cssText = `
      padding: 20px;
      border-bottom: 1px solid #374151;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <h3 style="margin: 0; color: #60a5fa;">Template: ${templateKey}</h3>
      <button onclick="this.closest('[style*=fixed]').remove()"
              style="background: #ef4444; color: white; border: none;
                     border-radius: 5px; padding: 8px 12px; cursor: pointer;">
        ✕ Cerrar
      </button>
    `;

    const code = document.createElement("pre");
    code.style.cssText = `
      margin: 0;
      padding: 20px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      line-height: 1.4;
      white-space: pre-wrap;
    `;
    code.textContent = template.trim();

    content.appendChild(header);
    content.appendChild(code);
    modal.appendChild(content);
    document.body.appendChild(modal);

    // Cerrar con click fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
};


// Función para aplicar syntax highlighting seguro usando CSS
function applySafeSyntaxHighlighting(preElement, code, language) {
  // Agregar data attribute para el lenguaje
  preElement.setAttribute('data-language', language);
  
  // Agregar estilos CSS si no existen
  if (!document.getElementById('syntax-highlight-styles')) {
    const style = document.createElement('style');
    style.id = 'syntax-highlight-styles';
    style.textContent = `
      /* JavaScript */
      pre[data-language="js"] .token-keyword { color: #8b5cf6; font-weight: 600; }
      pre[data-language="js"] .token-string { color: #10b981; }
      pre[data-language="js"] .token-comment { color: #6b7280; font-style: italic; }
      pre[data-language="js"] .token-number { color: #f59e0b; }
      pre[data-language="js"] .token-function { color: #3b82f6; font-weight: 500; }
      pre[data-language="js"] .token-property { color: #ef4444; }
      
      /* HTML */
      pre[data-language="html"] .token-tag { color: #8b5cf6; font-weight: 600; }
      pre[data-language="html"] .token-attr-name { color: #ef4444; }
      pre[data-language="html"] .token-attr-value { color: #10b981; }
      
      /* Config (JSON) */
      pre[data-language="config"] .token-property { color: #ef4444; }
      pre[data-language="config"] .token-string { color: #10b981; }
      pre[data-language="config"] .token-number { color: #f59e0b; }
      pre[data-language="config"] .token-boolean { color: #8b5cf6; font-weight: 600; }
    `;
    document.head.appendChild(style);
  }
  
  // Aplicar tokenización segura línea por línea
  const lines = code.split('\n');
  const highlightedLines = lines.map(line => tokenizeLine(line, language));
  
  // Usar innerHTML solo después de procesar todas las líneas
  preElement.innerHTML = highlightedLines.join('\n');
}

// Función para tokenizar una línea de código de forma segura
function tokenizeLine(line, language) {
  if (!line.trim()) return line; // Líneas vacías sin procesar
  
  let result = line;
  
  // Escapar HTML primero para seguridad
  result = result
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  switch(language) {
    case 'js':
      result = tokenizeJavaScript(result);
      break;
    case 'html':
      result = tokenizeHTML(result);
      break;
    case 'config':
      result = tokenizeJSON(result);
      break;
  }
  
  return result;
}

// Tokenizadores específicos por lenguaje
function tokenizeJavaScript(line) {
  // Keywords
  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 
                   'import', 'export', 'from', 'default', 'class', 'extends', 'new', 'this',
                   'async', 'await', 'try', 'catch', 'finally', 'throw', 'true', 'false',
                   'null', 'undefined', 'typeof', 'instanceof', 'in', 'of', 'delete'];
  
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
    line = line.replace(regex, '<span class="token-keyword">$1</span>');
  });
  
  // Strings (solo si no están ya dentro de un span)
  line = line.replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, (match, quote, content) => {
    if (match.includes('<span')) return match; // Ya procesado
    return `<span class="token-string">${quote}${content}${quote}</span>`;
  });
  
  // Comments
  line = line.replace(/\/\/(.*)$/, '<span class="token-comment">//$1</span>');
  line = line.replace(/\/\*(.*?)\*\//, '<span class="token-comment">/*$1*/</span>');
  
  // Numbers
  line = line.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="token-number">$1</span>');
  
  // Functions (word followed by parentheses)
  line = line.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, '<span class="token-function">$1</span>');
  
  // Properties (after dots)
  line = line.replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, '.<span class="token-property">$1</span>');
  
  return line;
}

function tokenizeHTML(line) {
  // HTML tags
  line = line.replace(/&lt;(\/?[a-zA-Z][a-zA-Z0-9-]*)([^&]*?)&gt;/g, (match, tagName, attrs) => {
    let result = `&lt;<span class="token-tag">${tagName}</span>`;
    
    // Attributes
    if (attrs.trim()) {
      attrs = attrs.replace(/\s+([a-zA-Z-]+)=([\"'])([^\"']*?)\2/g, 
        ' <span class="token-attr-name">$1</span>=<span class="token-attr-value">$2$3$2</span>');
      result += attrs;
    }
    
    result += '<span class="token-tag">&gt;</span>';
    return result;
  });
  
  return line;
}

function tokenizeJSON(line) {
  // Property names in quotes
  line = line.replace(/"([^"]+)"(\s*:)/g, '<span class="token-property">"$1"</span>$2');
  
  // String values
  line = line.replace(/:\s*"([^"]*)"/g, ': <span class="token-string">"$1"</span>');
  
  // Numbers
  line = line.replace(/:\s*(\d+(?:\.\d+)?)/g, ': <span class="token-number">$1</span>');
  
  // Booleans
  line = line.replace(/:\s*(true|false)/g, ': <span class="token-boolean">$1</span>');
  
  return line;
}

// Función para mostrar código en modal
window.showCodeModal = function (example) {
  const config = window.formConfigs[example];
  if (!config) return;

  const formId = `${example}_form`;
  
  // Crear modal
  const modal = document.createElement("div");
  modal.id = `code-modal-${example}`;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  `;

  const content = document.createElement("div");
  
  // Responsive sizing based on viewport
  const isMobile = window.innerWidth <= 480;
  const isTablet = window.innerWidth <= 768;
  const isSmallDesktop = window.innerWidth <= 1024;

  let modalWidth, modalHeight, modalMinWidth, modalPadding, borderRadius;

  if (isMobile) {
    modalWidth = '100vw';
    modalHeight = '100vh';
    modalMinWidth = '100vw';
    modalPadding = '0';
    borderRadius = '0';
  } else if (isTablet) {
    modalWidth = '95vw';
    modalHeight = '95vh';
    modalMinWidth = '320px';
    modalPadding = '10px';
    borderRadius = '8px';
  } else if (isSmallDesktop) {
    modalWidth = '90vw';
    modalHeight = '90vh';
    modalMinWidth = '700px';
    modalPadding = '20px';
    borderRadius = '12px';
  } else {
    modalWidth = '85vw';
    modalHeight = '85vh';
    modalMinWidth = '900px';
    modalPadding = '20px';
    borderRadius = '12px';
  }

  content.style.cssText = `
    background: white;
    color: #24292f;
    border-radius: ${borderRadius};
    width: ${modalWidth};
    max-width: ${isMobile ? '100vw' : '1400px'};
    min-width: ${modalMinWidth};
    height: ${modalHeight};
    overflow: hidden;
    position: relative;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  `;

  // Update modal padding
  modal.style.padding = modalPadding;

  // Header del modal
  const header = document.createElement("div");
  const headerPadding = isMobile ? '16px' : '20px 24px 16px';
  const headerDirection = isMobile ? 'column' : 'row';
  const headerAlign = isMobile ? 'flex-start' : 'center';
  const headerGap = isMobile ? '12px' : '0';
  
  header.style.cssText = `
    padding: ${headerPadding};
    border-bottom: 1px solid #d0d7de;
    display: flex;
    flex-direction: ${headerDirection};
    justify-content: space-between;
    align-items: ${headerAlign};
    background: #f6f8fa;
    flex-shrink: 0;
    gap: ${headerGap};
  `;
  
  const titleSection = document.createElement("div");
  const titleSize = isMobile ? '1rem' : '1.125rem';
  const subtitleSize = isMobile ? '0.8rem' : '0.875rem';
  
  titleSection.innerHTML = `
    <h3 style="margin: 0; color: #24292f; font-size: ${titleSize}; font-weight: 600; line-height: 1.2;">
      ${isMobile ? 'Código de Ejemplo' : `Código de Ejemplo - ${config.eventName || 'Formulario'}`}
    </h3>
    <p style="margin: 4px 0 0; color: #656d76; font-size: ${subtitleSize};">
      Configuración ${example}
    </p>
  `;

  const closeButton = document.createElement("button");
  const buttonPadding = isMobile ? '10px 14px' : '8px 12px';
  const buttonFontSize = isMobile ? '0.9rem' : '0.875rem';
  
  closeButton.style.cssText = `
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    padding: ${buttonPadding};
    cursor: pointer;
    font-size: ${buttonFontSize};
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: background-color 0.2s;
    ${isMobile ? 'align-self: flex-end;' : ''}
  `;
  closeButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.146 2.146a.5.5 0 0 1 .708 0L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854a.5.5 0 0 1 0-.708z"/>
    </svg>
    ${isMobile ? '' : 'Cerrar'}
  `;
  closeButton.onmouseover = () => closeButton.style.backgroundColor = '#dc2626';
  closeButton.onmouseout = () => closeButton.style.backgroundColor = '#ef4444';
  closeButton.onclick = () => modal.remove();

  header.appendChild(titleSection);
  header.appendChild(closeButton);

  // Tabs del modal
  const tabsContainer = document.createElement("div");
  tabsContainer.style.cssText = `
    padding: 0 24px;
    background: #f6f8fa;
    border-bottom: 1px solid #d0d7de;
    display: flex;
    gap: 0;
    flex-shrink: 0;
  `;

  const tabs = ['js', 'html', 'config'];
  const tabLabels = { js: 'JavaScript', html: 'HTML', config: 'Config' };
  
  tabs.forEach((tabType, index) => {
    const tab = document.createElement("button");
    tab.className = `modal-code-tab ${index === 0 ? 'modal-code-tab-active' : ''}`;
    tab.style.cssText = `
      padding: 12px 16px;
      border: none;
      background: transparent;
      color: ${index === 0 ? '#0969da' : '#656d76'};
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      border-bottom: 2px solid ${index === 0 ? '#0969da' : 'transparent'};
      transition: all 0.2s;
    `;
    tab.textContent = tabLabels[tabType];
    tab.onclick = () => showModalCodeTab(example, tabType);
    tabsContainer.appendChild(tab);
  });

  // Contenido del código
  const codeContainer = document.createElement("div");
  codeContainer.style.cssText = `
    flex: 1;
    overflow: auto;
    position: relative;
  `;

  // Crear contenidos para cada tab
  tabs.forEach((tabType, index) => {
    const codeContent = document.createElement("div");
    codeContent.id = `modal-${example}-${tabType}-code`;
    codeContent.className = `modal-code-content ${index !== 0 ? 'modal-code-hidden' : ''}`;
    codeContent.style.cssText = `
      display: ${index === 0 ? 'block' : 'none'};
      height: 100%;
      position: relative;
    `;

    const pre = document.createElement("pre");
    pre.id = `modal-${example}-${tabType}-content`;
    pre.style.cssText = `
      margin: 0;
      padding: 24px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      background: #1e1e1e;
      color: #d4d4d4;
      overflow: auto;
      height: 100%;
      box-sizing: border-box;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;
    
    // Generar contenido según el tipo
    let content = '';
    switch(tabType) {
      case 'js':
        content = generateExampleJS(config, formId);
        break;
      case 'html':
        content = generateExampleHTML(formId);
        break;
      case 'config':
        content = JSON.stringify(config, null, 2);
        break;
    }
    
    // Aplicar syntax highlighting seguro con CSS
    applySafeSyntaxHighlighting(pre, content, tabType);

    // Botón de copiar para cada tab
    const copyButton = document.createElement("button");
    copyButton.style.cssText = `
      position: absolute;
      top: 16px;
      right: 16px;
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 1;
      transition: background-color 0.2s;
    `;
    copyButton.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
        <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
        <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
      </svg>
      Copiar
    `;
    copyButton.onmouseover = () => copyButton.style.backgroundColor = '#e5e7eb';
    copyButton.onmouseout = () => copyButton.style.backgroundColor = '#f3f4f6';
    copyButton.onclick = () => copyModalCode(example, tabType, copyButton);

    codeContent.appendChild(pre);
    codeContent.appendChild(copyButton);
    codeContainer.appendChild(codeContent);
  });

  content.appendChild(header);
  content.appendChild(tabsContainer);
  content.appendChild(codeContainer);
  modal.appendChild(content);
  document.body.appendChild(modal);

  // Desactivar scroll de la página
  document.body.style.overflow = 'hidden';

  // Función para restaurar scroll
  const restoreBodyScroll = () => {
    document.body.style.overflow = '';
  };

  // Cerrar con click fuera
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
      restoreBodyScroll();
    }
  });

  // Cerrar con ESC
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      restoreBodyScroll();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  // Actualizar el botón de cerrar para restaurar scroll
  closeButton.onclick = () => {
    modal.remove();
    restoreBodyScroll();
  };

  // Guardar referencia para las funciones de tab
  window.currentModalExample = example;
};

// ========================================
// FUNCIONES DE GENERACIÓN DE CÓDIGO
// ========================================

// Función para generar código HTML de ejemplo
function generateExampleHTML(formId) {
  const htmlTemplates = {
    basic: `<form id="${formId}">
  <div class="name-row">
    <input type="text" placeholder="*Nombre(s)" name="first_name" required />
    <input type="text" placeholder="*Apellidos" name="last_name" required />
  </div>
  <input type="email" placeholder="*Email" name="email" required />
  <div class="phone-row">
    <select name="phone_code" required>
      <option value="">(+) Indicativo</option>
    </select>
    <input type="text" placeholder="*Teléfono" name="phone" required />
  </div>
  <select name="country" required>
    <option value="">*País</option>
  </select>
  <select name="type_attendee" required>
    <option value="">*Tipo de asistente</option>
  </select>
  <div class="radio-group">
    <input type="radio" name="authorization_data" value="1" /> Sí
    <input type="radio" name="authorization_data" value="0" /> No
  </div>
  <button type="submit" disabled>Registrarme</button>
</form>`,

    advanced: `<form id="${formId}">
  <div class="name-row">
    <input type="text" placeholder="*Nombre(s)" name="first_name" required />
    <input type="text" placeholder="*Apellidos" name="last_name" required />
  </div>
  <select name="type_doc" required>
    <option value="">*Tipo de documento</option>
    <option value="CC">Cédula</option>
    <option value="CE">Cédula Extranjería</option>
  </select>
  <input type="text" placeholder="*Documento" name="document" required />
  <input type="email" placeholder="*Email" name="email" required />
  <div class="phone-row">
    <select name="phone_code" required><option value="">(+)</option></select>
    <input type="text" placeholder="*Teléfono" name="phone" required />
  </div>
  <select name="country" required><option value="">*País</option></select>
  <select name="department" style="display:none"><option value="">*Departamento</option></select>
  <select name="city" style="display:none"><option value="">*Ciudad</option></select>
  <select name="type_attendee" required><option value="">*Tipo</option></select>
  <select name="attendance_day" required><option value="">*Día</option></select>
  <select name="academic_level" style="display:none"><option value="">*Nivel</option></select>
  <select name="faculty" style="display:none"><option value="">*Facultad</option></select>
  <select name="program" style="display:none"><option value="">*Programa</option></select>
  <select name="admission_period" style="display:none"><option value="">*Período</option></select>
  <div class="radio-group">
    <input type="radio" name="authorization_data" value="1" /> Sí
    <input type="radio" name="authorization_data" value="0" /> No
  </div>
  <button type="submit" disabled>Registrarme</button>
</form>`,

    custom: `<form id="${formId}">
  <div class="name-row">
    <input type="text" placeholder="*Nombre(s)" name="first_name" required />
    <input type="text" placeholder="*Apellidos" name="last_name" required />
  </div>
  <input type="email" placeholder="*Email VIP" name="email" required />
  <div class="phone-row">
    <select name="phone_code" required><option value="">(+)</option></select>
    <input type="text" placeholder="*Teléfono" name="phone" required />
  </div>
  <select name="country" required><option value="">*País</option></select>
  <select name="type_attendee" required><option value="">*Tipo VIP</option></select>
  <div class="radio-group">
    <input type="radio" name="authorization_data" value="1" /> Sí, autorizo
    <input type="radio" name="authorization_data" value="0" /> No autorizo
  </div>
  <button type="submit" disabled>🎯 Confirmar VIP</button>
</form>`,
  };

  return htmlTemplates[formId.replace("_form", "")] || htmlTemplates.basic;
}

// Función para generar código JavaScript completo
function generateExampleJS(config, formId) {
  return `import { FormManager } from "./modules/FormManager.js";

const config = ${JSON.stringify(config, null, 2)};

const formManager = new FormManager(config);

formManager.init().then(() => {
  console.log("✅ Formulario inicializado correctamente");
}).catch(error => {
  console.error("❌ Error al inicializar:", error);
});

// Hacer disponible globalmente para debugging
window.formManager = formManager;`;
}

// Función para mostrar código de configuración
function displayCode() {
  // Generar código para cada ejemplo
  Object.keys(window.formConfigs).forEach((example) => {
    const config = window.formConfigs[example];
    const formId = `${example}_form`;

    // JavaScript
    const jsElement = document.getElementById(`${example}-js-content`);
    if (jsElement) {
      const jsCode = generateExampleJS(config, formId);
      applySafeSyntaxHighlighting(jsElement, jsCode, 'js');
    }

    // HTML
    const htmlElement = document.getElementById(`${example}-html-content`);
    if (htmlElement) {
      const htmlCode = generateExampleHTML(formId);
      applySafeSyntaxHighlighting(htmlElement, htmlCode, 'html');
    }

    // Config
    const configElement = document.getElementById(`${example}-config-content`);
    if (configElement) {
      const configCode = JSON.stringify(config, null, 2);
      applySafeSyntaxHighlighting(configElement, configCode, 'config');
    }
  });
}

// ========================================
// NAVEGACIÓN Y FUNCIONALIDAD DE PÁGINA
// ========================================

// Navegación suave entre secciones
function initSmoothNavigation() {
  const navLinks = document.querySelectorAll(".gh-nav-link");
  const headerHeight = 80; // Altura del header sticky

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Solo manejar enlaces internos (que empiecen con #)
      if (href && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Remover clase active de todos los enlaces
          navLinks.forEach((nav) => nav.classList.remove("gh-nav-link-active"));

          // Agregar clase active al enlace clickeado
          link.classList.add("gh-nav-link-active");

          // Scroll suave al elemento
          const offsetTop = targetElement.offsetTop - headerHeight;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Detectar sección activa en el scroll
function initActiveSection() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".gh-nav-link");
  const headerHeight = 80;

  function updateActiveSection() {
    let current = "";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.pageYOffset - headerHeight;
      const sectionBottom = sectionTop + rect.height;

      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionBottom) {
        current = section.id;
      }
    });

    // Actualizar enlaces activos
    navLinks.forEach((link) => {
      link.classList.remove("gh-nav-link-active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("gh-nav-link-active");
      }
    });
  }

  // Ejecutar al cargar y al hacer scroll
  window.addEventListener("scroll", updateActiveSection);
  window.addEventListener("load", updateActiveSection);
}

// Función para cambiar tabs en el modal
window.showModalCodeTab = function (example, type) {
  const modal = document.getElementById(`code-modal-${example}`);
  if (!modal) return;

  // Actualizar tabs visuales
  const tabs = modal.querySelectorAll(".modal-code-tab");
  tabs.forEach((tab) => {
    tab.classList.remove("modal-code-tab-active");
    tab.style.color = "#656d76";
    tab.style.borderBottomColor = "transparent";
  });

  // Mapear tipos a labels de tabs para encontrar el correcto
  const tabLabels = { js: 'JavaScript', html: 'HTML', config: 'Config' };
  const targetLabel = tabLabels[type];
  
  // Encontrar y activar el tab correcto usando el label exacto
  const targetTab = Array.from(tabs).find((tab) =>
    tab.textContent.trim() === targetLabel
  );
  if (targetTab) {
    targetTab.classList.add("modal-code-tab-active");
    targetTab.style.color = "#0969da";
    targetTab.style.borderBottomColor = "#0969da";
  }

  // Mostrar contenido correspondiente
  ["js", "html", "config"].forEach((t) => {
    const element = document.getElementById(`modal-${example}-${t}-code`);
    if (element) {
      element.style.display = t === type ? "block" : "none";
    }
  });

  // Actualizar tab activo
  window.activeTabs[example] = type;
};

// Función para copiar código del modal
window.copyModalCode = function (example, type, buttonElement) {
  const element = document.getElementById(`modal-${example}-${type}-content`);
  
  if (element) {
    const text = element.textContent;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Mostrar feedback visual
        const button = buttonElement || document.querySelector(`#modal-${example}-${type}-code button`);
        if (button) {
          const originalHTML = button.innerHTML;
          button.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"/>
            </svg>
            Copiado
          `;
          button.style.backgroundColor = '#10b981';

          setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.backgroundColor = '#f3f4f6';
          }, 2000);
        }
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
        alert("Error al copiar el código");
      });
  }
};

// Funcionalidad para tabs de código (página principal - mantener por compatibilidad)
function initCodeTabs() {
  // Actualizar función existente para usar las nuevas clases
  window.showCodeTab = function (example, type) {
    const parentSection = document.querySelector(`#${example}-js-code`).closest(".gh-code-section");
    if (!parentSection) return;

    // Actualizar tabs visuales
    const tabs = parentSection.querySelectorAll(".gh-code-tab");
    tabs.forEach((tab) => tab.classList.remove("gh-code-tab-active"));

    // Mapear tipos a labels de tabs para encontrar el correcto
    const tabLabels = { js: 'JavaScript', html: 'HTML', config: 'Config' };
    const targetLabel = tabLabels[type];
    
    // Encontrar y activar el tab correcto usando el label exacto
    const targetTab = Array.from(tabs).find((tab) =>
      tab.textContent.trim() === targetLabel
    );
    if (targetTab) {
      targetTab.classList.add("gh-code-tab-active");
    }

    // Mostrar contenido correspondiente
    ["js", "html", "config"].forEach((t) => {
      const element = document.getElementById(`${example}-${t}-code`);
      if (element) {
        element.classList.toggle("gh-code-hidden", t !== type);
      }
    });

    // Actualizar tab activo
    window.activeTabs[example] = type;
  };
}

// Funcionalidad para botones de copy mejorada
function initCopyButtons() {
  // Actualizar función existente para usar las nuevas clases
  window.copyCode = function (example, buttonElement) {
    const activeTab = window.activeTabs[example];
    const element = document.getElementById(`${example}-${activeTab}-content`);

    if (element) {
      const text = element.textContent;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // Mostrar feedback visual
          const button = buttonElement || document.querySelector(`.gh-copy-btn[onclick*="${example}"]`);
          if (button) {
            const originalHTML = button.innerHTML;
            button.innerHTML = `
              <svg class="gh-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L6.75 9.19 5.28 7.72a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4.5-4.5z"/>
              </svg>
              Copiado
            `;

            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 2000);
          }
        })
        .catch((err) => {
          console.error("Error al copiar:", err);
          alert("Error al copiar el código");
        });
    }
  };
}

// Funcionalidad para enlaces del footer
function initFooterLinks() {
  const footerLinks = document.querySelectorAll(".gh-footer-link");

  footerLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (href && href.startsWith("#")) {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    }
  });
}

// Efectos adicionales para mejorar la experiencia
function initUIEffects() {
  // Efecto de scroll en el header
  const header = document.querySelector(".gh-header");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "none";
    }
  });

  // Efecto de hover en las cards
  const cards = document.querySelectorAll(
    ".gh-step-card, .gh-feature-card, .gh-docs-card, .gh-example-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-4px)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
    });
  });
}

// Inicialización de todas las funcionalidades de navegación
function initPageFunctionality() {
  initSmoothNavigation();
  initActiveSection();
  initCodeTabs();
  initCopyButtons();
  initFooterLinks();
  initUIEffects();

  console.log("🎯 Funcionalidades de navegación inicializadas");
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar formulario avanzado
const advancedForm = new FormManager("advanced_form", advancedConfig);
window.advancedForm = advancedForm;

// Inicializar funcionalidades de la página
document.addEventListener("DOMContentLoaded", () => {
  initPageFunctionality();
});

// Inicializar todos los formularios
Promise.all([
  advancedForm.init().then(() => {
    console.log("⚙️ Formulario avanzado inicializado");
  }),
])
  .then(() => {
    console.log("✅ Todos los formularios inicializados correctamente");

    // Generar y mostrar código después de la inicialización
    displayCode();
  })
  .catch((error) => {
    console.error("❌ Error inicializando formularios:", error);
  });

// Exportar funciones para uso global
export {
  advancedConfig,
  templates,
  generateExampleHTML,
  generateExampleJS,
  displayCode,
  initSmoothNavigation,
  initActiveSection,
  initPageFunctionality,
};
