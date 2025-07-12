# Logger Simplificado - Uso Centralizado

## Concepto

El Logger ahora usa **exclusivamente** la configuración de ConfigManager. No acepta configuración personalizada en el constructor.

## ✅ Cómo usar correctamente

### 1. Configuración centralizada
```javascript
// ConfigManager establece la configuración de logging
const form = new FormManager('form-id', {
  eventName: 'Open Day 2025',
  logging: {
    level: 'debug',
    prefix: 'OpenDay2025',
    enabled: true,
    colors: true
  }
});
```

### 2. Logger sin parámetros
```javascript
// En cualquier módulo - Logger usa configuración de ConfigManager
const logger = new Logger(); // ✅ Sin parámetros

// Todos los loggers son la misma instancia (singleton)
const logger2 = new Logger(); // ✅ Misma instancia que logger
console.log(logger === logger2); // true
```

### 3. Control global
```javascript
// Cambiar configuración globalmente
ConfigManager.updateConfig({
  logging: {
    level: 'error',
    prefix: 'Sistema'
  }
});
// Logger se sincroniza automáticamente

// Usar métodos estáticos
Logger.info('Mensaje global');
Logger.debug('Debug global');
```

## ❌ Lo que ya NO se debe hacer

```javascript
// ❌ NO pasar configuración al constructor
const logger = new Logger({ level: 'debug' }); // Ya no funciona

// ❌ NO crear loggers independientes
const customLogger = new Logger({ prefix: 'MiModulo' }); // Ya no funciona
```

## 🎯 Casos de uso prácticos

### En un módulo personalizado:
```javascript
class MiModuloPersonalizado {
  constructor() {
    // Logger automáticamente usa la configuración de ConfigManager
    this.logger = new Logger();
  }
  
  hacerAlgo() {
    this.logger.info('Ejecutando función');
    
    // O usar directamente los métodos estáticos
    Logger.debug('Debug desde MiModulo');
  }
}
```

### Cambiar configuración dinámicamente:
```javascript
// Cambiar nivel para todo el sistema
ConfigManager.updateConfig({
  logging: { level: 'warn' }
});
// Logger se actualiza automáticamente

// Cambiar prefix para todo el sistema
ConfigManager.updateConfig({
  logging: { prefix: 'NuevoEvento' }
});
// Todos los logs futuros usarán el nuevo prefix
```

### Control completo del sistema:
```javascript
// Deshabilitar todo el logging
ConfigManager.updateConfig({
  logging: { enabled: false }
});

// Habilitar solo errores
ConfigManager.updateConfig({
  logging: { 
    enabled: true,
    level: 'error' 
  }
});

// Obtener todos los logs del sistema
const logs = Logger.getLogs();
console.log(`Sistema tiene ${logs.length} logs`);
```

## 🔄 Sincronización automática

Cuando ConfigManager actualiza su configuración de logging, Logger se sincroniza automáticamente:

```javascript
// 1. Configuración inicial
const form = new FormManager('form-id', {
  logging: { level: 'info', prefix: 'Inicial' }
});

const logger = new Logger(); // Usa level='info', prefix='Inicial'

// 2. Actualización de configuración
ConfigManager.updateConfig({
  logging: { level: 'debug', prefix: 'Actualizado' }
});

// 3. Logger se sincroniza automáticamente
logger.debug('Este mensaje ya usa la nueva configuración'); // ✅ Funciona
```

## 🎯 Ventajas de este enfoque

1. **Configuración única**: Un solo lugar para controlar todo el logging
2. **Consistencia garantizada**: Todos los loggers usan la misma configuración
3. **Simplicidad**: No hay que pasar configuración a cada Logger
4. **Sincronización automática**: Los cambios se aplican inmediatamente
5. **Control global**: Fácil cambiar logging para todo el sistema

## 📋 API simplificada

```javascript
// Crear logger (siempre singleton)
const logger = new Logger();

// Métodos estáticos para control global
Logger.info('Mensaje');
Logger.error('Error');
Logger.setLevel('debug');    // Cambiar nivel globalmente
Logger.setEnabled(false);    // Deshabilitar globalmente
Logger.getLogs();           // Obtener todos los logs
Logger.hasInstance();       // Verificar si existe singleton

// Control desde ConfigManager
ConfigManager.updateConfig({ logging: { level: 'error' } });
ConfigManager.getLoggingConfig(); // Ver configuración actual
```

¡Ahora tienes un sistema de logging completamente centralizado y simplificado!