# 🏗️ Build System - Sistema Modular de Formularios PUJ

## Descripción

Sistema de build moderno configurado con Webpack 5, PostCSS y TailwindCSS para compilar los módulos de formularios en archivos distribuibles
optimizados.

## Archivos Generados

- `build/form-modules-script.js` - JavaScript compilado (UMD format)
- `build/form-modules-style.css` - CSS compilado y optimizado con SCSS + Tailwind

## Comandos Disponibles

```bash
# Build de producción (minificado y optimizado)
npm run build

# Build de desarrollo (sin minificar, con source maps)
npm run build:dev

# Desarrollo con watch mode (recompila automáticamente)
npm run dev

# Compilar solo estilos SCSS
npm run build:style

# Generar utilidades Tailwind CSS
npm run build:tailwind

# Generar utilidades Tailwind legacy
npm run build:tailwind-legacy

# Limpiar directorio build
npm run clean
```

## Stack Tecnológico

### Webpack 5

- **Entry Point**: `src/index.js`
- **Output Format**: UMD (Universal Module Definition)
- **Global Variable**: `FormModules`
- **Output Files**: `build/form-modules-script.js` y `build/form-modules-style.css`

### Procesamiento de Estilos

- **SCSS/Sass**: Para variables y mixins avanzados
- **PostCSS**: Para autoprefixer y optimizaciones
- **Tailwind CSS**: Para utilidades CSS
- **Mini CSS Extract Plugin**: Para extraer CSS en archivo separado

### Configuración de Webpack

```javascript
// webpack.config.js (resumen)
module.exports = {
  entry: { 'form-modules': './src/index.js' },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]-script.js',
    library: { name: 'FormModules', type: 'umd' }
  },
  module: {
    rules: [{ test: /\.s[ac]ss$/i, use: ['css-loader', 'postcss-loader', 'sass-loader'] }]
  }
}
```

## Uso de los Archivos Compilados

### 1. Uso Global en HTML (Recomendado)

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
          <!-- campos del formulario -->
        </form>
      </div>
    </div>

    <!-- Incluir JavaScript compilado -->
    <script src="build/form-modules-script.js"></script>
    <script>
      // FormManager disponible globalmente como FormModules
      const formManager = new FormModules('#form_inscription', {
        eventName: 'Mi Evento 2025',
        eventDate: '15/03/2025'
      })

      formManager.initialize()
    </script>
  </body>
</html>
```

### 2. Como Módulo ES6

```javascript
// Importar desde archivos fuente (desarrollo)
import FormManager from './src/index.js'

// O importar desde build compilado
import FormManager from './build/form-modules-script.js'

const formManager = new FormManager('#form_inscription', {
  eventName: 'Mi Evento'
  // configuración...
})
await formManager.initialize()
```

### 3. Integración en Frameworks

#### React/Vue/Angular

```javascript
// En un componente
import FormManager from './build/form-modules-script.js'
import './build/form-modules-style.css'

// En useEffect (React) o mounted (Vue)
const formManager = new FormManager('#form_inscription', config)
await formManager.initialize()
```

#### WordPress/CMS

```php
// En functions.php o equivalente
wp_enqueue_style('form-modules', '/path/to/build/form-modules-style.css');
wp_enqueue_script('form-modules', '/path/to/build/form-modules-script.js');
```

## Estructura del Proyecto

```
formularios/
├── src/                           # Código fuente
│   ├── index.js                   # Entry point principal
│   ├── modules/                   # Módulos JavaScript
│   │   ├── FormManager.js         # Gestor principal
│   │   ├── Validation.js          # Validaciones
│   │   ├── Data.js                # Gestión de datos
│   │   └── ...                    # Otros módulos
│   └── styles/                    # Estilos SCSS
│       ├── form-modules.scss      # Archivo principal SCSS
│       ├── _vars.scss             # Variables
│       └── modules/               # Módulos de estilos
├── build/                         # Archivos compilados (generados)
│   ├── form-modules-script.js     # JavaScript compilado
│   └── form-modules-style.css     # CSS compilado
├── data/                          # Archivos de datos JSON
├── examples/                      # Demos y ejemplos
├── package.json                   # Configuración npm
├── webpack.config.js              # Configuración Webpack
├── tailwind.config.js             # Configuración Tailwind
└── postcss.config.js              # Configuración PostCSS
```

## Características del Build

### JavaScript (Webpack 5)

- **Formato de salida**: UMD (funciona en navegador y Node.js)
- **Variable global**: `FormModules`
- **Tree shaking**: Eliminación de código no usado
- **Source maps**: En modo desarrollo
- **Minificación**: En modo producción

### CSS (SCSS + PostCSS + Tailwind)

- **SCSS compilation**: Variables, mixins, anidación
- **PostCSS processing**: Autoprefixer, optimizaciones
- **Tailwind utilities**: Clases utilitarias opcionales
- **CSS extraction**: Archivo separado del JavaScript
- **Minificación**: En modo producción

## Desarrollo vs Producción

### Modo Desarrollo (`npm run dev`)

- Source maps habilitados
- Sin minificación
- Watch mode para recompilación automática
- Logging extendido

### Modo Producción (`npm run build`)

- Código minificado y optimizado
- Sin source maps
- Tree shaking aplicado
- Archivos optimizados para distribución

## Resolución de Problemas

### Error: "Cannot resolve module"

```bash
# Verificar dependencias
npm install

# Limpiar cache de Webpack
npm run clean
rm -rf node_modules/.cache
```

### Error: "PostCSS plugin not found"

```bash
# Reinstalar dependencias de PostCSS
npm install --save-dev autoprefixer postcss postcss-cli
```

### Build muy lento

```bash
# Usar build de desarrollo para pruebas
npm run build:dev

# O usar watch mode
npm run dev
```
