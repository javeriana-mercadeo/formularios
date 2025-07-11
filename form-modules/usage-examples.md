# 📝 Guía de Uso del Sistema Modular de Formularios

## 🚀 Introducción

El sistema modular de formularios ahora incluye **CSS modular** además de la funcionalidad JavaScript, permitiendo una personalización completa y fácil mantenimiento.

## 🎨 Estructura del Sistema CSS Modular

```
form-modules/
├── modules/
│   ├── FormManager.js        # Manager principal
│   ├── ValidationModule.js   # Módulo de validación
│   ├── DataManager.js        # Gestión de datos
│   ├── APIService.js         # Servicios API
│   └── UIUtils.js           # Utilidades de interfaz
├── styles/
│   ├── base.css              # Estilos base y variables CSS
│   ├── layout.css            # Contenedor y layout del formulario
│   ├── form-elements.css     # Estilos de inputs, selects, botones
│   ├── validation.css        # Estilos de validación y errores
│   ├── form-fields.css       # Layouts específicos de campos
│   ├── form-styles.css       # Archivo principal que importa todo
│   └── themes/
│       └── custom-theme.css  # Tema personalizado de ejemplo
├── demo.html                 # Demostración interactiva
├── example-usage.js          # Ejemplos de uso
└── README.md                 # Documentación principal
```

## 📦 Uso Básico

### 1. Formulario Simple (Solo CSS)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario Simple</title>
    <!-- Cargar estilos manualmente -->
    <link rel="stylesheet" href="form-modules/styles/form-styles.css" />
  </head>
  <body>
    <div class="container">
      <div class="form-card">
        <form id="form_inscription">
          <div class="name-row">
            <div class="name-field">
              <input type="text" placeholder="Nombre" required />
            </div>
            <div class="name-field">
              <input type="text" placeholder="Apellido" required />
            </div>
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  </body>
</html>
```

### 2. Formulario con JavaScript (Estilos CSS manuales)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario con FormManager</title>
    <!-- Cargar estilos CSS manualmente -->
    <link rel="stylesheet" href="form-modules/styles/base.css" />
    <link rel="stylesheet" href="form-modules/styles/layout.css" />
    <link rel="stylesheet" href="form-modules/styles/form-elements.css" />
    <link rel="stylesheet" href="form-modules/styles/form-fields.css" />
    <link rel="stylesheet" href="form-modules/styles/validation.css" />
  </head>
  <body>
    <div class="container">
      <div class="form-card">
        <form id="form_inscription">
          <!-- Contenido del formulario -->
        </form>
      </div>
    </div>

    <script type="module">
      import { FormManager } from "./form-modules/modules/FormManager.js";

      const form = new FormManager({
        eventName: "Mi Evento",
        debugMode: true,
      });

      await form.init();
    </script>
  </body>
</html>
```

## 🎨 Personalización de Estilos

### 1. Variables CSS Personalizadas

```javascript
const form = new FormManager({
  eventName: "Mi Evento",
});

await form.init();

// Aplicar variables CSS personalizadas
form.applyCustomVariables({
  "primary-color": "#e91e63",
  "primary-hover": "#c2185b",
  "form-background": "#f8f9fa",
  "form-max-width": "500px",
  "form-border-radius": "12px",
});
```

### 2. Cargar Tema Personalizado

```html
<!-- Agregar tema personalizado en el HTML -->
<link rel="stylesheet" href="form-modules/styles/base.css" />
<link rel="stylesheet" href="form-modules/styles/layout.css" />
<link rel="stylesheet" href="form-modules/styles/form-elements.css" />
<link rel="stylesheet" href="form-modules/styles/form-fields.css" />
<link rel="stylesheet" href="form-modules/styles/validation.css" />
<link rel="stylesheet" href="form-modules/styles/themes/custom-theme.css" />
```

### 3. Crear Tema Personalizado

```css
/* mi-tema.css */
:root {
  --primary-color: #6c5ce7;
  --primary-hover: #5a4fcf;
  --form-background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --form-shadow: 0 20px 40px rgba(108, 92, 231, 0.3);
}

.form-card {
  background: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.form-card input:focus {
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
}
```

## 🔧 Uso Avanzado

### 1. Aplicar Estilos Dinámicamente

```javascript
const form = new FormManager({
  eventName: "Mi Evento",
});

await form.init();

// Cambiar estilos en tiempo real
form.applyCustomVariables({
  "primary-color": "#ff6b6b",
  "form-background": "#fff5f5",
});
```

## 🎯 Casos de Uso Específicos

### 1. Múltiples Formularios con Estilos Diferentes

```javascript
// Formulario 1 - Tema azul
const form1 = new FormManager({
  formSelector: "#form1",
});
await form1.init();
form1.applyCustomVariables({
  "primary-color": "#2196f3",
  "primary-hover": "#1976d2",
});

// Formulario 2 - Tema verde
const form2 = new FormManager({
  formSelector: "#form2",
});
await form2.init();
form2.applyCustomVariables({
  "primary-color": "#4caf50",
  "primary-hover": "#388e3c",
});
```

### 2. Formulario con Tema Dinámico

```javascript
const form = new FormManager();
await form.init();

// Función para cambiar tema
function changeTheme(themeName) {
  const themes = {
    dark: {
      "primary-color": "#bb86fc",
      "form-background": "#121212",
      "form-text-color": "#ffffff",
    },
    light: {
      "primary-color": "#6200ee",
      "form-background": "#ffffff",
      "form-text-color": "#000000",
    },
  };

  form.applyCustomVariables(themes[themeName]);
}
```

### 3. Integración con Frameworks CSS

```html
<!-- Usar solo algunos módulos CSS con frameworks externos -->
<link rel="stylesheet" href="bootstrap.css" />
<!-- Solo cargar validación del sistema modular -->
<link rel="stylesheet" href="form-modules/styles/validation.css" />
```

## 📱 Responsive Design

Los estilos incluyen responsive design automático:

```css
/* Los estilos se adaptan automáticamente */
@media (max-width: 768px) {
  .form-card {
    padding: 20px;
    margin: 0;
  }
}

@media (max-width: 480px) {
  .form-card input,
  .form-card select {
    font-size: 16px; /* Previene zoom en iOS */
  }
}
```

## 🔍 Debugging y Desarrollo

### 1. Verificar Formulario

```javascript
// Verificar estado del formulario
console.log("Datos del formulario:", form.getFormData());
console.log("Configuración:", form.getConfig());

// Habilitar logs detallados
form.setLogLevel("debug");
```

## 🎁 Ejemplos Completos

### Ejemplo 1: Formulario de Eventos con Tema Personalizado

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario de Eventos</title>
    <!-- Cargar estilos CSS -->
    <link rel="stylesheet" href="form-modules/styles/base.css" />
    <link rel="stylesheet" href="form-modules/styles/layout.css" />
    <link rel="stylesheet" href="form-modules/styles/form-elements.css" />
    <link rel="stylesheet" href="form-modules/styles/form-fields.css" />
    <link rel="stylesheet" href="form-modules/styles/validation.css" />
    <link rel="stylesheet" href="form-modules/styles/themes/custom-theme.css" />
  </head>
  <body>
    <div class="container">
      <div class="form-card">
        <form id="form_inscription">
          <!-- Formulario completo -->
        </form>
      </div>
    </div>

    <script type="module">
      import { FormManager } from "./form-modules/modules/FormManager.js";

      const eventForm = new FormManager({
        eventName: "Open Day 2025",
        eventDate: "15/03/2025",
        typeAttendee: ["Aspirante", "Padre de familia"],
        attendanceDays: ["Viernes 15", "Sábado 16"],
      });

      await eventForm.init();

      // Aplicar estilos personalizados
      eventForm.applyCustomVariables({
        "primary-color": "#6c5ce7",
        "form-max-width": "600px",
        "form-shadow": "0 10px 30px rgba(108, 92, 231, 0.2)",
      });
    </script>
  </body>
</html>
```

### Ejemplo 2: Formulario con Cambio de Tema Dinámico

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Formulario con Temas</title>
    <!-- Cargar estilos CSS -->
    <link rel="stylesheet" href="form-modules/styles/base.css" />
    <link rel="stylesheet" href="form-modules/styles/layout.css" />
    <link rel="stylesheet" href="form-modules/styles/form-elements.css" />
    <link rel="stylesheet" href="form-modules/styles/form-fields.css" />
    <link rel="stylesheet" href="form-modules/styles/validation.css" />
  </head>
  <body>
    <div class="theme-controls">
      <button onclick="changeTheme('blue')">Tema Azul</button>
      <button onclick="changeTheme('green')">Tema Verde</button>
      <button onclick="changeTheme('purple')">Tema Morado</button>
    </div>

    <div class="container">
      <div class="form-card">
        <form id="form_inscription">
          <!-- Formulario -->
        </form>
      </div>
    </div>

    <script type="module">
      import { FormManager } from "./form-modules/modules/FormManager.js";

      const form = new FormManager();
      await form.init();

      window.changeTheme = function (theme) {
        const themes = {
          blue: { "primary-color": "#2196f3", "primary-hover": "#1976d2" },
          green: { "primary-color": "#4caf50", "primary-hover": "#388e3c" },
          purple: { "primary-color": "#9c27b0", "primary-hover": "#7b1fa2" },
        };

        form.applyCustomVariables(themes[theme]);
      };
    </script>
  </body>
</html>
```

## 🚀 Migración desde CSS Estático

Para migrar desde CSS estático al sistema modular:

1. **Reemplazar el CSS estático:**

```html
<!-- Antes -->
<link rel="stylesheet" href="mi-formulario.css" />

<!-- Después -->
<link rel="stylesheet" href="form-modules/styles/base.css" />
<link rel="stylesheet" href="form-modules/styles/layout.css" />
<link rel="stylesheet" href="form-modules/styles/form-elements.css" />
<link rel="stylesheet" href="form-modules/styles/form-fields.css" />
<link rel="stylesheet" href="form-modules/styles/validation.css" />
```

2. **Configurar el FormManager:**

```javascript
const form = new FormManager({
  eventName: "Mi Evento",
  debugMode: true,
});
await form.init();
```

3. **Mantener tus personalizaciones:**

```javascript
// Aplicar tus estilos personalizados
form.applyCustomVariables({
  "primary-color": "#tu-color",
  "form-background": "#tu-fondo",
});
```

## 📚 Referencia de Variables CSS

### Variables Principales

- `--primary-color`: Color principal
- `--primary-hover`: Color hover del botón
- `--primary-light`: Color de foco
- `--form-background`: Fondo del formulario
- `--form-shadow`: Sombra del formulario
- `--form-border-radius`: Radio de bordes
- `--form-max-width`: Ancho máximo
- `--form-padding`: Padding interno
- `--form-gap`: Espaciado entre campos

### Variables de Validación

- `--danger-500`: Color de error
- `--success-600`: Color de éxito
- `--danger-rgb`: RGB del color de error
- `--success-rgb`: RGB del color de éxito
