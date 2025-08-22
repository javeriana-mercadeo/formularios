# 📋 Sistema Modular de Formularios PUJ

Un sistema completo y modular para crear formularios de eventos con JavaScript y CSS modulares, optimizado para los formularios de eventos
de la Pontificia Universidad Javeriana.

## 🏗️ Estructura del Proyecto

```
formularios/
├── 📁 src/                    # Código fuente
│   ├── index.js              # Punto de entrada principal
│   ├── 📁 modules/           # Módulos JavaScript
│   │   ├── FormManager.js    # Gestor principal del formulario
│   │   ├── Validation.js     # Validación de campos
│   │   ├── Data.js           # Gestión de datos
│   │   ├── Service.js        # Servicios API y envío
│   │   ├── UI.js             # Utilidades de interfaz
│   │   ├── Logger.js         # Sistema de logging
│   │   ├── Config.js         # Configuración del sistema
│   │   ├── State.js          # Manejo de estado
│   │   ├── Event.js          # Manejo de eventos del DOM
│   │   ├── Academic.js       # Funciones académicas
│   │   ├── Locations.js      # Gestión de ubicaciones
│   │   ├── UtmParameters.js  # Parámetros UTM
│   │   ├── Constants.js      # Constantes del sistema
│   │   └── Cache.js          # Sistema de caché
│   └── 📁 styles/            # Estilos SCSS modulares
│       ├── form-modules.scss # Archivo principal SCSS
│       ├── _vars.scss        # Variables CSS/SCSS
│       └── 📁 modules/       # Módulos de estilos
│           ├── _base.scss    # Estilos base
│           ├── _layout.scss  # Layout y contenedores
│           ├── _forms.scss   # Elementos de formulario
│           ├── _fields.scss  # Campos específicos
│           ├── _buttons.scss # Estilos de botones
│           ├── _validation.scss # Estilos de validación
│           ├── _utilities.scss # Clases utilitarias
│           └── _demo-theme.scss # Tema de demostración
├── 📁 build/                 # Archivos compilados (generados)
│   ├── form-modules-script.js # JavaScript compilado
│   └── form-modules-style.css # CSS compilado
├── 📁 data/                  # Archivos de datos JSON
│   ├── universidades.json   # Lista de universidades
│   ├── programas.json       # Programas académicos
│   ├── ubicaciones.json     # Ciudades y departamentos
│   ├── periodos.json        # Períodos académicos
│   └── codigos_pais.json    # Códigos telefónicos
├── 📁 examples/              # Ejemplos y demos
│   ├── index.html           # Demo principal
│   ├── test.html            # Formulario de prueba
│   ├── examples.js          # Código de ejemplo
│   └── examples.css         # Estilos de ejemplo
├── 📁 before-forms/          # Formularios anteriores (legacy)
├── 📄 package.json           # Configuración npm
├── 📄 webpack.config.js      # Configuración Webpack
├── 📄 tailwind.config.js     # Configuración Tailwind CSS
└── 📄 postcss.config.js      # Configuración PostCSS
```

## 🚀 Instalación y Configuración

### 1. Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd formularios

# Instalar dependencias
npm install

# Compilar el proyecto
npm run build
```

### 2. Uso Básico - Archivos Compilados

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi Formulario</title>
    <!-- Incluir CSS compilado -->
    <link rel="stylesheet" href="build/form-modules-style.css" />
  </head>
  <body>
    <div class="fm-form-container">
      <div class="form-card">
        <form id="form_inscription">
          <input type="text" name="nombre" placeholder="Nombre completo" required />
          <input type="email" name="email" placeholder="Email" required />
          <select name="tipo_asistente">
            <option value="">Selecciona el tipo de asistente</option>
            <option value="aspirante">Aspirante</option>
            <option value="padre">Padre de familia</option>
          </select>
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>

    <!-- Incluir JavaScript compilado -->
    <script src="build/form-modules-script.js"></script>
    <script>
      // FormManager está disponible como variable global
      const formManager = new FormModules('#form_inscription', {
        eventName: 'Mi Evento 2025',
        eventDate: '15/03/2025'
      })

      formManager.initialize()
    </script>
  </body>
</html>
```

### 3. Uso Avanzado - Módulos ES6

```javascript
import { FormManager } from './src/modules/FormManager.js'

const formManager = new FormManager('#form_inscription', {
  eventName: 'Open Day 2025',
  eventDate: '15/03/2025',

  // Tipos de asistente personalizados
  typeAttendee: ['Aspirante', 'Padre de familia', 'Estudiante actual'],

  // Configuración de datos
  dataConfig: {
    universitiesUrl: './data/universidades.json',
    programsUrl: './data/programas.json',
    locationsUrl: './data/ubicaciones.json'
  },

  // Configuración de logging
  logging: {
    enabled: true,
    level: 'info'
  }
})

// Inicializar el formulario
await formManager.initialize()
```

## 🎨 Personalización de Estilos

### Variables CSS/SCSS Disponibles

El sistema utiliza variables CSS personalizables definidas en `src/styles/_vars.scss`:

```scss
// Variables principales
:root {
  --form-modules-primary-color: #4d7fcb;
  --form-modules-primary-hover: #3f6fb5;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
  --warning-color: #ffc107;

  // Formulario
  --form-background: #ffffff;
  --form-max-width: 427px;
  --form-border-radius: 16px;
  --form-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  --form-padding: 30px;
  --form-gap: 15px;

  // Campos
  --input-border: #ced4da;
  --input-border-focus: var(--form-modules-primary-color);
  --input-border-radius: 8px;
  --input-padding: 12px 16px;
}
```

### Clases CSS Específicas

Para evitar conflictos, usar clases con prefijo `fm-`:

```css
.fm-form-container    /* Contenedor principal */
/* Contenedor principal */
.fm-text-center      /* Centrar texto */
.fm-hidden           /* Ocultar elemento */
.fm-visible          /* Mostrar elemento */
.fm-w-full           /* Ancho completo */
.fm-dropdown-list; /* Lista desplegable */
```

### Personalización Avanzada

```scss
// Crear tema personalizado en un archivo .scss
@import 'src/styles/vars';

:root {
  --form-modules-primary-color: #e91e63; // Rosa
  --form-background: #f8f9fa; // Gris claro
  --form-max-width: 500px; // Ancho mayor
  --form-border-radius: 12px; // Bordes más suaves
}

// Compilar con PostCSS o incluir directamente
```

## 🔧 Configuración del Sistema

### Opciones de Configuración

```javascript
const config = {
  // Información básica del evento
  eventName: 'Mi Evento',
  eventDate: '15/03/2025',
  university: 'Pontificia Universidad Javeriana',

  // Tipos de asistente disponibles
  typeAttendee: ['Aspirante', 'Padre de familia', 'Estudiante actual', 'Egresado'],

  // Configuración de datos JSON
  dataConfig: {
    universitiesUrl: './data/universidades.json',
    programsUrl: './data/programas.json',
    locationsUrl: './data/ubicaciones.json',
    periodsUrl: './data/periodos.json',
    phoneCodesUrl: './data/codigos_pais.json'
  },

  // Configuración de logging y debugging
  logging: {
    enabled: true,
    level: 'info', // error, warn, info, debug
    prefix: 'FormManager',
    showTimestamp: true,
    showLevel: true
  },

  // Configuración de validación
  validation: {
    enabled: true,
    realTimeValidation: true,
    showErrorMessages: true
  },

  // Configuración de envío
  submission: {
    endpoint: 'https://api.salesforce.com/submit',
    method: 'POST',
    timeout: 10000,
    retryAttempts: 3
  }
}

const formManager = new FormManager('#form_inscription', config)
await formManager.initialize()
```

### Métodos Principales del FormManager

```javascript
// Inicialización
await formManager.initialize()

// Obtener datos del formulario
const formData = formManager.getFormData()

// Validar formulario
const isValid = formManager.validateForm()

// Enviar formulario manualmente
await formManager.submitForm()

// Configurar callbacks
formManager.onSubmitSuccess = data => {
  console.log('Formulario enviado exitosamente:', data)
}

formManager.onSubmitError = error => {
  console.error('Error al enviar formulario:', error)
}
```

## 🎯 Funcionalidades Principales

### ✅ Arquitectura Modular

- **FormManager**: Orquestador principal del sistema
- **Validation**: Validación en tiempo real de campos
- **Data**: Gestión y carga de datos JSON
- **Service**: Servicios de envío y comunicación con APIs
- **UI**: Manipulación de la interfaz de usuario
- **Logger**: Sistema avanzado de logging y debugging
- **Config**: Gestión centralizada de configuración
- **State**: Manejo de estado del formulario
- **Event**: Gestión de eventos del DOM
- **Locations**: Manejo específico de ubicaciones (ciudades/departamentos)
- **Academic**: Funciones específicas académicas (programas, períodos)

### ✅ Gestión de Datos Inteligente

- Carga automática de archivos JSON desde `/data/`
- Filtrado dinámico de programas por universidad
- Gestión de ubicaciones (departamentos y ciudades)
- Caché inteligente de datos para mejor rendimiento
- Soporte para códigos telefónicos internacionales
- Validación de períodos académicos

### ✅ Validación Robusta

- Validación en tiempo real mientras el usuario escribe
- Validación de emails con patrones avanzados
- Validación de números de documento colombianos
- Validación de números telefónicos internacionales
- Mensajes de error personalizables y contextuales
- Indicadores visuales de estado de validación

### ✅ Sistema de Estilos Avanzado

- Arquitectura SCSS modular y mantenible
- Variables CSS/SCSS personalizables
- Sistema de clases con prefijo `fm-` para evitar conflictos
- Responsive design optimizado para móviles
- Soporte para temas personalizados
- Integración con TailwindCSS para utilidades

### ✅ Logging y Debugging Profesional

- Niveles configurables: error, warn, info, debug
- Timestamps y colores para mejor legibilidad
- Persistencia de logs en memoria
- Exportación de logs en múltiples formatos
- Monitoreo en tiempo real del estado del formulario

## 📱 Desarrollo y Build

### Comandos Disponibles

```bash
# Desarrollo con watch mode
npm run dev

# Build de producción (minificado)
npm run build

# Build de desarrollo (sin minificar)
npm run build:dev

# Compilar solo estilos SCSS
npm run build:style

# Generar utilidades Tailwind
npm run build:tailwind

# Limpiar directorio build
npm run clean
```

### Estructura de Archivos Generados

```
build/
├── form-modules-script.js    # JavaScript compilado (UMD)
└── form-modules-style.css    # CSS compilado y optimizado
```

### Desarrollo Local

Para desarrollar y probar el sistema:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar build con watch mode
npm run dev

# 3. Abrir examples/index.html en un servidor local
# (no funciona con file://, necesita servidor HTTP)

# 4. Hacer cambios en src/ - se recompila automáticamente
```

## 🔍 Debugging y Troubleshooting

### Debugging del FormManager

```javascript
// Obtener información del estado actual
console.log('Estado del formulario:', formManager.getState())
console.log('Configuración actual:', formManager.getConfig())
console.log('Datos cargados:', formManager.getLoadedData())
console.log('Errores de validación:', formManager.getValidationErrors())

// Habilitar logging detallado
formManager.setLogLevel('debug')
formManager.enableLogging()

// Verificar carga de módulos
console.log('Módulos inicializados:', formManager.getInitializedModules())
```

### Problemas Comunes

#### 1. Formulario no se inicializa

```javascript
// Verificar que el selector existe
const formElement = document.querySelector('#form_inscription')
if (!formElement) {
  console.error('Elemento de formulario no encontrado')
}

// Verificar que los archivos JSON se cargan correctamente
formManager.onDataLoadError = error => {
  console.error('Error cargando datos:', error)
}
```

#### 2. Estilos no se aplican

```html
<!-- Verificar que el CSS está incluido -->
<link rel="stylesheet" href="build/form-modules-style.css" />

<!-- Verificar estructura HTML correcta -->
<div class="fm-form-container">
  <div class="form-card">
    <!-- contenido del formulario -->
  </div>
</div>
```

#### 3. Datos no se cargan

```bash
# Verificar que los archivos JSON existen
ls data/
# Debe mostrar: universidades.json, programas.json, ubicaciones.json, etc.

# Verificar formato JSON válido
npm install -g jsonlint
jsonlint data/universidades.json
```

### Logging Avanzado

```javascript
// Configurar logging detallado
const formManager = new FormManager('#form_inscription', {
  logging: {
    enabled: true,
    level: 'debug',
    showTimestamp: true,
    showLevel: true,
    prefix: 'MyForm'
  }
})

// Escuchar eventos de logging
formManager.onLogEntry = entry => {
  if (entry.level === 'error') {
    // Enviar error a servicio de monitoreo
    console.error('Error crítico:', entry)
  }
}
```

## 🎮 Ejemplos y Demos

### Archivos de Ejemplo Disponibles

```
examples/
├── index.html          # Demo principal interactiva
├── test.html          # Formulario de prueba simple
├── examples.js        # Código JavaScript de ejemplo
└── examples.css       # Estilos de demostración
```

### Demo Principal - `examples/index.html`

La demo principal incluye:

- ✅ Formulario completo con todos los campos
- ✅ Integración con archivos de datos JSON
- ✅ Validación en tiempo real
- ✅ Logging y debugging habilitado
- ✅ Ejemplo de personalización de estilos

### Ejecutar los Ejemplos

```bash
# Opción 1: Servidor Python
cd formularios
python -m http.server 8000
# Abrir http://localhost:8000/examples/

# Opción 2: Node.js con live-server
npm install -g live-server
live-server --port=8000
# Abrir http://localhost:8000/examples/

# Opción 3: VS Code Live Server extension
# Clic derecho en examples/index.html > "Open with Live Server"
```

## 🚀 Migración desde Formularios Legacy

### Desde formularios en `before-forms/`

Los formularios antiguos están disponibles en `/before-forms/` para referencia. Para migrar:

1. **Estructura HTML**: Mantener la estructura básica pero usar clases `fm-*`
2. **JavaScript**: Reemplazar código custom por `FormManager`
3. **CSS**: Usar el sistema de estilos compilado

```javascript
// Antes (formulario legacy)
document.getElementById('submit-btn').addEventListener('click', function () {
  // código personalizado de validación y envío
})

// Después (sistema modular)
const formManager = new FormManager('#form_inscription', {
  eventName: 'Mi Evento'
  // configuración automática de validación y envío
})
await formManager.initialize()
```

## 📋 Datos JSON

### Archivos de Datos Incluidos

- `universidades.json`: Lista de universidades colombianas
- `programas.json`: Programas académicos por universidad
- `ubicaciones.json`: Departamentos y ciudades de Colombia
- `periodos.json`: Períodos académicos disponibles
- `codigos_pais.json`: Códigos telefónicos internacionales

### Formato de Datos

```json
// ubicaciones.json
{
  "departamentos": [
    {
      "codigo": "05",
      "nombre": "Antioquia",
      "ciudades": [
        { "codigo": "05001", "nombre": "Medellín" },
        { "codigo": "05266", "nombre": "Envigado" }
      ]
    }
  ]
}
```

## 🔧 Requisitos Técnicos

- **Navegador moderno** con soporte para:
  - ES6 modules (import/export)
  - Async/await
  - CSS Custom Properties (variables CSS)
  - Fetch API
- **Servidor web** para desarrollo (CORS issues con `file://`)
- **Node.js 16+** para build system

## 🆘 Soporte y Documentación

### Documentos Adicionales

- `BUILD.md`: Instrucciones detalladas del sistema de build
- `CSS_GUIDELINES.md`: Guías de estilos y clases CSS
- `TODO.md`: Funcionalidades pendientes y roadmap

### Para Problemas o Preguntas

1. Revisar la consola del navegador para errores
2. Verificar que todos los archivos JSON están disponibles
3. Comprobar configuración de red/CORS
4. Activar logging en modo debug para más detalles

---

**Versión:** 1.0.0 - Sistema Modular de Formularios PUJ  
**Última actualización:** Enero 2025  
**Compatibilidad:** ES6+, Navegadores modernos
