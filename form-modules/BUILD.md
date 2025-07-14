# Build System - Formularios PUJ

## Descripción
Sistema de build configurado con Webpack para compilar los módulos de formularios en archivos únicos distribuibles.

## Archivos generados
- `form-modules/build/form-modules.js` - JavaScript compilado y minificado (95.7 KiB)
- `form-modules/build/form-modules.css` - CSS compilado y optimizado (9.52 KiB)

## Comandos disponibles

```bash
# Navegar al directorio form-modules
cd form-modules

# Build de producción (minificado)
npm run build

# Build de desarrollo
npm run build:dev

# Build con watch mode (desarrollo)
npm run build:watch

# Limpiar directorio build
npm run clean
```

## Uso de los archivos compilados

### En HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="form-modules/build/form-modules.css">
</head>
<body>
    <form id="mi-formulario">
        <!-- campos del formulario -->
    </form>
    
    <script src="form-modules/build/form-modules.js"></script>
    <script>
        // Usar FormManager (disponible globalmente como FormModules)
        const formManager = new FormModules('mi-formulario', {
            eventName: 'Mi Evento',
            // otras configuraciones...
        });
        
        formManager.initialize();
    </script>
</body>
</html>
```

### Como módulo ES6:
```javascript
import FormManager from './form-modules/build/form-modules.js';

const formManager = new FormManager('mi-formulario', config);
formManager.initialize();
```

### Como módulo UMD:
```javascript
// En navegador
const FormManager = window.FormModules;

// En Node.js
const FormManager = require('./form-modules/build/form-modules.js');
```

## Estructura del proyecto
```
formularios/
├── form-modules/
│   ├── build/              # Archivos compilados
│   │   ├── form-modules.js # JavaScript bundle
│   │   └── form-modules.css# CSS bundle
│   ├── src/
│   │   └── index.js        # Entry point
│   ├── modules/            # Módulos JavaScript
│   ├── styles/             # Archivos CSS
│   ├── package.json
│   └── webpack.config.js
└── otros archivos del proyecto...
```

## Configuración de build
- **Webpack 5** para bundling
- **Mini CSS Extract Plugin** para extraer CSS
- **UMD** como formato de salida (compatible con browsers y Node.js)
- **Minificación** en modo producción