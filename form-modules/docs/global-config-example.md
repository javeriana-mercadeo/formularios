# Acceso a Configuración Global

## Introducción

El sistema FormManager implementa un patrón singleton en ConfigManager para permitir el acceso a la configuración global desde cualquier módulo del sistema.

## Funcionamiento

### 1. Configuración Global Automática

Cuando se crea una instancia de `FormManager`, automáticamente establece una instancia global de `ConfigManager`:

```javascript
// Al crear FormManager, ConfigManager se hace disponible globalmente
const form = new FormManager('mi-formulario', {
  eventName: 'Open Day 2025',
  debugMode: true,
  logging: {
    level: 'debug',
    prefix: 'OpenDay2025'
  }
});
```

### 2. Uso en otros módulos

Cualquier módulo puede acceder a la configuración global:

```javascript
// En cualquier módulo
import { Logger } from './Logger.js';

// Logger automáticamente usa configuración global si está disponible
const logger = new Logger();
// Usará prefix 'OpenDay2025', level 'debug', etc.

// O combinar con configuración personalizada
const customLogger = new Logger({
  prefix: 'MiModulo',  // Sobrescribe el prefix global
  level: 'info'        // Sobrescribe el level global
});
```

### 3. Métodos estáticos disponibles

```javascript
// Verificar si existe configuración global
if (ConfigManager.hasGlobalInstance()) {
  console.log('Configuración global disponible');
}

// Obtener configuración de logging
const loggingConfig = ConfigManager.getGlobalLoggingConfig();

// Obtener configuración completa
const globalConfig = ConfigManager.getGlobalConfig();

// Obtener instancia del ConfigManager
const configInstance = ConfigManager.getGlobalInstance();
```

### 4. Ejemplo práctico

```javascript
import { Logger } from './Logger.js';
import { ConfigManager } from './ConfigManager.js';

class MiModuloPersonalizado {
  constructor() {
    // Logger automáticamente hereda configuración global
    this.logger = new Logger({
      prefix: 'MiModulo'  // Solo cambiar prefix
    });
    
    // Acceder a configuración del evento
    const globalConfig = ConfigManager.getGlobalConfig();
    this.eventName = globalConfig?.eventName || 'Evento Desconocido';
    
    this.logger.info(`Módulo inicializado para evento: ${this.eventName}`);
  }
  
  hacerAlgo() {
    // El logger ya tiene la configuración correcta
    this.logger.debug('Ejecutando funcionalidad...');
  }
}

// Uso
const miModulo = new MiModuloPersonalizado();
```

## Ventajas

1. **Configuración Centralizada**: Un solo lugar para configurar logging y otros aspectos
2. **Consistencia**: Todos los módulos usan la misma configuración base
3. **Flexibilidad**: Permite sobrescribir configuraciones específicas cuando sea necesario
4. **Facilidad de Uso**: No necesita pasar configuración explícitamente a cada módulo

## Fallbacks

Si no hay configuración global disponible, cada módulo usa sus valores por defecto:

```javascript
// Si no hay configuración global
const logger = new Logger(); // Usa defaults: level='info', prefix='FormSystem'

// Si hay configuración global
const logger = new Logger(); // Usa: level='debug', prefix='OpenDay2025' (del ejemplo)
```

## Demostración en Vivo

Abre la consola del navegador en la página de ejemplos y ejecuta:

```javascript
// Función disponible globalmente en examples.js
demonstrateGlobalConfig();
```

Esta función mostrará cómo funciona el acceso a la configuración global en tiempo real.