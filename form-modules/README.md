# 📋 Sistema Modular de Formularios

Un sistema completo y modular para crear formularios de eventos con JavaScript y CSS modulares.

## 🏗️ Estructura del Proyecto

```
form-modules/
├── 📁 modules/           # Módulos JavaScript
│   ├── FormManager.js    # Gestor principal del formulario
│   ├── ValidationModule.js # Validación de campos
│   ├── DataManager.js    # Gestión de datos
│   ├── APIService.js     # Servicios API
│   ├── UIUtils.js        # Utilidades de interfaz
│   └── StyleLoader.js    # Cargador de estilos CSS
├── 📁 styles/            # Estilos CSS modulares
│   ├── base.css          # Estilos base y variables
│   ├── layout.css        # Layout y contenedores
│   ├── form-elements.css # Elementos de formulario
│   ├── validation.css    # Estilos de validación
│   ├── form-fields.css   # Campos específicos
│   ├── form-styles.css   # Archivo principal CSS
│   └── 📁 themes/        # Temas personalizados
│       └── custom-theme.css
├── 📁 examples/          # Ejemplos y demos
│   ├── demo.html         # Demo completa interactiva
│   ├── basic-form.html   # Formulario básico
│   ├── custom-styles.html # Estilos personalizados
│   ├── multiple-forms.html # Múltiples formularios
│   ├── example-usage.js  # Código de ejemplo
│   └── README.md         # Documentación de ejemplos
├── 📄 usage-examples.md  # Documentación detallada
├── 📄 MIGRATION.md       # Guía de migración
└── 📄 README.md          # Este archivo
```

## 🚀 Inicio Rápido

### 1. Formulario Básico

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi Formulario</title>
  </head>
  <body>
    <div class="container">
      <div class="form-card">
        <form id="form_inscription">
          <input type="text" placeholder="Nombre" required />
          <input type="email" placeholder="Email" required />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>

    <script type="module">
      import { FormManager } from "./form-modules/modules/FormManager.js";

      const form = new FormManager({
        eventName: "Mi Evento 2025",
        styles: {
          enabled: true,
          autoLoad: true,
        },
      });

      await form.init();
    </script>
  </body>
</html>
```

### 2. Formulario con Personalización

```javascript
import { FormManager } from "./form-modules/modules/FormManager.js";

const form = new FormManager({
  eventName: "Open Day 2025",
  eventDate: "15/03/2025",

  // Configuración de estilos
  styles: {
    enabled: true,
    autoLoad: true,
    includeTheme: true,
    customVariables: {
      "primary-color": "#4d7fcb",
      "form-max-width": "600px",
    },
  },

  // Tipos de asistente
  typeAttendee: ["Aspirante", "Padre de familia"],

  // Días de asistencia
  attendanceDays: ["Viernes 15", "Sábado 16"],

  // Callbacks
  callbacks: {
    onFormLoad: (formManager) => {
      console.log("Formulario cargado");
    },
    onFormSubmit: async (formData) => {
      console.log("Datos enviados:", formData);
      return true;
    },
  },
});

await form.init();
```

## 🎨 Personalización CSS

### Variables CSS Disponibles

```css
:root {
  --primary-color: #4d7fcb;
  --primary-hover: #3f6fb5;
  --form-background: white;
  --form-max-width: 427px;
  --form-border-radius: 16px;
  --form-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  --form-padding: 30px;
  --form-gap: 15px;
}
```

### Aplicar Estilos Personalizados

```javascript
// Cambiar variables CSS dinámicamente
form.applyCustomStyles({
  "primary-color": "#e91e63",
  "form-background": "#f8f9fa",
  "form-max-width": "500px",
});

// Cargar tema personalizado
await form.loadStylesManually({
  includeTheme: true,
  themePath: "mi-tema.css",
});
```

## 🔧 Configuración Avanzada

### Configuración Completa

```javascript
const config = {
  // Información del evento
  eventName: "Mi Evento",
  eventDate: "15/03/2025",
  university: "Mi Universidad",

  // Asistentes y días
  typeAttendee: ["Aspirante", "Padre de familia"],
  attendanceDays: ["Día 1", "Día 2"],

  // Configuración de estilos
  styles: {
    enabled: true,
    basePath: "./form-modules/",
    autoLoad: true,
    includeTheme: false,
    themePath: "styles/themes/custom-theme.css",
    customVariables: {
      "primary-color": "#4d7fcb",
    },
  },

  // Validación
  validation: {
  },

  // Configuración de logging
  logging: {
    enabled: true,
    level: "info",
    prefix: "FormManager",
    showTimestamp: true,
    showLevel: true,
  },

  // Modo desarrollo
  debugMode: false,
  devMode: false,

  // URLs de datos
  dataUrls: {
    locations: "./data/ubicaciones.json",
    prefixes: "./data/codigos_pais.json",
    programs: "./data/programas.json",
    periods: "./data/periodos.json",
  },
};

const form = new FormManager(config);
await form.init();
```

## 🎯 Funcionalidades Principales

### ✅ Gestión de Formularios

- Validación en tiempo real
- Manejo de errores
- Envío automático a Salesforce
- Soporte para múltiples tipos de eventos

### ✅ Sistema CSS Modular

- Carga automática de estilos
- Variables CSS personalizables
- Temas intercambiables
- Responsive design incluido

### ✅ Gestión de Datos

- Carga automática de ubicaciones
- Filtrado dinámico de programas
- Caché de datos opcional
- Manejo de prefijos telefónicos

### ✅ Validación Avanzada

- Validación de emails
- Validación de números de documento
- Validación de teléfonos
- Mensajes de error personalizables

### ✅ Sistema de Logging Avanzado

- Niveles configurables (error, warn, info, debug)
- Logging con colores y timestamps
- Persistencia opcional de logs
- Exportación de logs (JSON, CSV, TXT)
- Control en tiempo real

## 📱 Responsive Design

Los estilos incluyen diseño responsive automático:

```css
/* Móvil */
@media (max-width: 480px) {
  .form-card {
    padding: 15px;
    border-radius: 12px;
  }

  .form-card input {
    font-size: 16px; /* Previene zoom en iOS */
  }
}

/* Tablet */
@media (max-width: 768px) {
  .form-card {
    width: 100%;
    padding: 20px;
  }
}
```

## 🔍 Debugging y Desarrollo

### Verificar Estado

```javascript
// Verificar si los estilos están cargados
console.log("Estilos cargados:", form.areStylesLoaded());

// Obtener estadísticas
console.log("Configuración:", form.getConfig());
console.log("Datos del formulario:", form.getFormData());
console.log("Estilos cargados:", form.getLoadedStyles());

// Verificar configuración de logging
console.log("Config logging:", form.getLoggingConfig());
console.log("Estadísticas logging:", form.getLoggingStats());
```

### Modo Desarrollo

```javascript
// Activar modo desarrollo
form.setDevMode(true);

// Activar modo debug
form.setDebugMode(true);
```

### Control de Logging

```javascript
// Activar/Desactivar logging
form.enableLogging();
form.disableLogging();
form.toggleLogging();

// Cambiar nivel de logging
form.setLogLevel("debug"); // 'error', 'warn', 'info', 'debug'

// Configurar persistencia
form.setLogPersistence(true, 500); // persistir, max logs

// Obtener y exportar logs
const logs = form.getLogs();
const jsonLogs = form.exportLogs("json");
const csvLogs = form.exportLogs("csv");

// Limpiar logs
form.clearLogs();

// Listener para logs en tiempo real
form.addLogListener((logEntry) => {
  console.log("Nuevo log:", logEntry);
});
```

## 🎮 Ejemplos y Demos

Explora la carpeta `/examples` con múltiples demos:

### **Demo Principal** - `examples/demo.html`

- ✅ Formulario completo funcional
- ✅ Controles para cambiar temas
- ✅ Aplicación de estilos personalizados
- ✅ Modo debug y desarrollo
- ✅ Carga de datos de ejemplo

### **Otros Ejemplos Disponibles**

- **`basic-form.html`** - Formulario básico para comenzar
- **`custom-styles.html`** - Personalización avanzada de estilos
- **`multiple-forms.html`** - Múltiples formularios independientes
- **`example-usage.js`** - Código de ejemplo comentado

## 📚 Documentación Adicional

- **`usage-examples.md`** - Ejemplos detallados de uso
- **`examples/README.md`** - Guía de ejemplos y demos
- **`MIGRATION.md`** - Guía de migración desde versiones anteriores

## 🔧 Requisitos

- **Navegador moderno** con soporte para ES6 modules
- **Servidor web** para desarrollo (no funciona con `file://`)

## 🚀 Migración desde Versión Anterior

Si ya tienes formularios usando la versión anterior:

1. **Actualizar imports:**

```javascript
// Antes
import { FormManager } from "./FormManager.js";

// Después
import { FormManager } from "./modules/FormManager.js";
```

2. **Configurar estilos:**

```javascript
const form = new FormManager({
  styles: {
    enabled: true,
    autoLoad: true,
  },
});
```

3. **Mantener funcionalidad:**
   Todo el código existente seguirá funcionando sin cambios adicionales.

## 🆘 Soporte

Para problemas o preguntas:

1. Revisa la documentación en `usage-examples.md`
2. Examina el código en `example-usage.js`
3. Prueba la demo en `demo.html`
4. Verifica la consola del navegador para errores

---

**Versión:** 2.0.0 - Sistema Modular Completo
**Última actualización:** 2025
