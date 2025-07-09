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
    { code: "pregrado", name: "Pregrado" },
    { code: "posgrado", name: "Posgrado" },
    { code: "educacion_continua", name: "Educación Continua" },
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
    prefix: "AdvancedForm",
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

// Configuración básica
const basicConfig = {
  eventName: "Open Day Básico 2025",
  eventDate: "15/03/2025",

  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],

  formSelector: "#basic_form",

  styles: {
    enabled: true,
    basePath: "../",
    autoLoad: true,
    useCombined: true,
  },

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  logging: {
    enabled: false,
    level: "info",
    prefix: "BasicForm",
    colors: true,
  },

  debugMode: true,
  devMode: true,

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("✅ Formulario básico cargado correctamente");
      console.log("📝 Configuración:", formManager.getConfig());
    },

    onFormSubmit: async (formData, formManager) => {
      console.log("📤 Enviando formulario básico:", formData);

      // Simular envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("¡Registro exitoso! (Modo demo)");

      return true;
    },
  },
};

// Configuración personalizada
const customConfig = {
  eventName: "Open Day VIP 2025",
  eventDate: "22/03/2025",
  company: "Universidad Javeriana - VIP Experience",

  typeAttendee: ["VIP", "Premium", "Elite"],

  formSelector: "#custom_form",

  styles: {
    enabled: true,
    basePath: "../",
    autoLoad: true,
    useCombined: true,
    includeTheme: false,
    customVariables: {
      "primary-color": "#7c3aed",
      "primary-hover": "#6d28d9",
      "success-color": "#059669",
      "border-radius": "12px",
      "font-family": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
  },

  validation: {
    realTimeValidation: true,
    showErrorsOnBlur: true,
  },

  logging: {
    enabled: false,
    level: "debug",
    prefix: "CustomVIP",
    colors: true,
    persistLogs: true,
    maxLogs: 1000,
  },

  debugMode: true,
  devMode: true,

  callbacks: {
    onFormLoad: (formManager) => {
      console.log("🎨 Formulario VIP cargado");

      // Personalización visual avanzada
      const form = document.querySelector("#custom_form");
      if (form) {
        form.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        form.style.padding = "30px";
        form.style.borderRadius = "15px";
        form.style.boxShadow = "0 20px 40px rgba(0,0,0,0.1)";
      }
    },

    onFormSubmit: async (formData, formManager) => {
      console.log("🎯 Enviando formulario VIP:", formData);

      // Validación VIP personalizada
      if (formData.email && !formData.email.includes("vip")) {
        console.warn("⚠️ Email no parece ser VIP");
      }

      // Simular proceso VIP
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("🌟 ¡Registro VIP completado con éxito! (Modo demo)");

      return true;
    },

    onFieldChange: (field, value, formManager) => {
      if (field.name === "email" && value.includes("vip")) {
        field.style.background = "linear-gradient(45deg, #ffd700, #ffed4e)";
        field.style.border = "2px solid #ffd700";
        console.log("🌟 Email VIP detectado!");
      }
    },

    onValidationError: (error, formManager) => {
      console.error("🚨 Error de validación VIP:", error);

      // Notificación personalizada
      const notification = document.createElement("div");
      notification.textContent = "Por favor, completa todos los campos VIP";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 1000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      `;
      document.body.appendChild(notification);

      setTimeout(() => notification.remove(), 3000);
    },
  },
};

// ========================================
// FUNCIONES DE GESTIÓN DE CÓDIGO Y TEMPLATES
// ========================================

// Almacenar configuraciones para mostrar código
window.formConfigs = {
  basic: basicConfig,
  advanced: advancedConfig,
  custom: customConfig,
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
window.copyTemplate = function (templateKey) {
  const template = templates[templateKey];
  if (template) {
    navigator.clipboard
      .writeText(template.trim())
      .then(() => {
        // Feedback visual
        const button = event.target;
        const originalText = button.innerHTML;
        button.innerHTML = "✅ Copiado";
        button.style.background = "rgba(16, 185, 129, 0.2)";

        setTimeout(() => {
          button.innerHTML = originalText;
          button.style.background = "";
        }, 2000);
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
      jsElement.textContent = generateExampleJS(config, formId);
    }

    // HTML
    const htmlElement = document.getElementById(`${example}-html-content`);
    if (htmlElement) {
      htmlElement.textContent = generateExampleHTML(formId);
    }

    // Config
    const configElement = document.getElementById(`${example}-config-content`);
    if (configElement) {
      configElement.textContent = JSON.stringify(config, null, 2);
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

// Funcionalidad para tabs de código
function initCodeTabs() {
  // Actualizar función existente para usar las nuevas clases
  window.showCodeTab = function (example, type) {
    const parentSection = document.querySelector(`#${example}-js-code`).closest(".gh-code-section");
    if (!parentSection) return;

    // Actualizar tabs visuales
    const tabs = parentSection.querySelectorAll(".gh-code-tab");
    tabs.forEach((tab) => tab.classList.remove("gh-code-tab-active"));

    // Encontrar y activar el tab correcto
    const targetTab = Array.from(tabs).find((tab) =>
      tab.textContent.toLowerCase().includes(type.toLowerCase())
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
  window.copyCode = function (example) {
    const activeTab = window.activeTabs[example];
    const element = document.getElementById(`${example}-${activeTab}-content`);

    if (element) {
      const text = element.textContent;
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // Mostrar feedback visual
          const button = event.target.closest(".gh-copy-btn");
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
  let lastScrollY = window.scrollY;
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

    lastScrollY = currentScrollY;
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

// Inicializar formulario básico
const basicForm = new FormManager(basicConfig);
window.basicForm = basicForm;

// Inicializar formulario avanzado
const advancedForm = new FormManager(advancedConfig);
window.advancedForm = advancedForm;

// Inicializar formulario personalizado
const customForm = new FormManager(customConfig);
window.customForm = customForm;

// Inicializar funcionalidades de la página
document.addEventListener("DOMContentLoaded", () => {
  initPageFunctionality();
});

// Inicializar todos los formularios
Promise.all([
  basicForm.init().then(() => {
    console.log("🚀 Formulario básico inicializado");
  }),

  advancedForm.init().then(() => {
    console.log("⚙️ Formulario avanzado inicializado");
  }),

  customForm.init().then(() => {
    console.log("🎨 Formulario personalizado inicializado");
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
  basicConfig,
  advancedConfig,
  customConfig,
  templates,
  generateExampleHTML,
  generateExampleJS,
  displayCode,
  initSmoothNavigation,
  initActiveSection,
  initPageFunctionality,
};
