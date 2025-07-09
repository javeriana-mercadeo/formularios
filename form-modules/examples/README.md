# 📁 Ejemplos y Demos

Esta carpeta contiene ejemplos prácticos y demos del sistema modular de formularios.

## 🎮 Ejemplos Disponibles

### 1. **`demo.html`** - Demo Completa Interactiva

La demostración principal con todas las funcionalidades:

- ✅ Formulario completo funcional
- 🎨 Controles para cambiar temas
- 🖌️ Aplicación de estilos personalizados
- 🔧 Modo debug y desarrollo
- 📝 Carga de datos de ejemplo
- 📋 Sistema de logging avanzado
- 💾 Exportación de logs

**Uso:** Abre en un servidor local para ver todas las características.

### 2. **`basic-form.html`** - Formulario Básico

Ejemplo simple para comenzar rápidamente:

- ⚡ Configuración mínima
- 🎨 Estilos automáticos
- ✅ Validación incluida
- 📱 Responsive design

**Ideal para:** Primeros pasos y implementaciones simples.

### 3. **`custom-styles.html`** - Estilos Personalizados

Demostración avanzada de personalización visual:

- 🎭 Múltiples temas predefinidos
- 🌈 Variables CSS dinámicas
- ✨ Animaciones y transiciones
- 🎨 Gradientes y efectos

**Ideal para:** Proyectos que requieren branding específico.

### 4. **`multiple-forms.html`** - Múltiples Formularios

Ejemplo de gestión de varios formularios independientes:

- 📚 Formulario de Pregrado
- 🎓 Formulario de Posgrado
- 🎪 Formulario de Eventos
- 📊 Panel de control centralizado
- 📋 Logging independiente por formulario

**Ideal para:** Aplicaciones complejas con múltiples tipos de registro.

### 5. **`logging-demo.html`** - Demo de Sistema de Logging

Demostración completa del sistema de logging:

- 📊 Control de niveles de logging
- 🎨 Logs con colores y timestamps
- 💾 Persistencia y exportación
- 🔄 Listeners en tiempo real
- 🧪 Pruebas de estrés

**Ideal para:** Entender y probar el sistema de logging.

### 6. **`example-usage.js`** - Código de Ejemplo

Archivo JavaScript con ejemplos de configuración:

- 📋 Configuraciones comentadas
- 🔧 Casos de uso específicos
- 💡 Mejores prácticas
- 📚 Documentación inline

**Ideal para:** Referencia rápida y aprendizaje.

## 🚀 Cómo Usar los Ejemplos

### Requisitos Previos

- **Servidor web local** (no funciona con `file://`)
- **Navegador moderno** con soporte para ES6 modules

### Opciones para Servidor Local

**1. Con Python:**

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**2. Con Node.js:**

```bash
npx http-server -p 8000
```

**3. Con PHP:**

```bash
php -S localhost:8000
```

**4. Con VS Code:**

- Instalar extensión "Live Server"
- Click derecho → "Open with Live Server"

### Acceder a los Ejemplos

Una vez iniciado el servidor, accede a:

- `http://localhost:8000/form-modules/examples/demo.html`
- `http://localhost:8000/form-modules/examples/basic-form.html`
- `http://localhost:8000/form-modules/examples/custom-styles.html`
- `http://localhost:8000/form-modules/examples/multiple-forms.html`
- `http://localhost:8000/form-modules/examples/logging-demo.html`

## 📋 Guía Paso a Paso

### Para Principiantes

1. **Comienza con `basic-form.html`**

   - Formulario simple y funcional
   - Configuración mínima
   - Fácil de entender

2. **Continúa con `demo.html`**

   - Funcionalidades completas
   - Controles interactivos
   - Casos de uso reales

3. **Explora `custom-styles.html`**
   - Personalización visual
   - Temas y variables CSS
   - Efectos avanzados

### Para Desarrolladores Avanzados

1. **Revisa `example-usage.js`**

   - Configuraciones avanzadas
   - Patrones de implementación
   - Mejores prácticas

2. **Estudia `multiple-forms.html`**

   - Gestión de múltiples instancias
   - Separación de responsabilidades
   - Escalabilidad

3. **Experimenta con personalizaciones**
   - Crea tus propios temas
   - Modifica configuraciones
   - Integra con tu aplicación

## 🎯 Casos de Uso por Ejemplo

| Ejemplo               | Caso de Uso         | Complejidad   | Tiempo Estimado |
| --------------------- | ------------------- | ------------- | --------------- |
| `basic-form.html`     | Landing page simple | 🟢 Básico     | 15 min          |
| `demo.html`           | Prototipo completo  | 🟡 Intermedio | 30 min          |
| `custom-styles.html`  | Branding específico | 🟡 Intermedio | 45 min          |
| `multiple-forms.html` | App empresarial     | 🔴 Avanzado   | 60 min          |
| `example-usage.js`    | Referencia código   | 🟢 Básico     | 20 min          |

## 🔧 Personalización de Ejemplos

### Modificar Configuración

```javascript
// En cualquier ejemplo, puedes cambiar:
const config = {
  eventName: "Tu Evento", // Nombre del evento
  eventDate: "2025-12-31", // Fecha
  university: "Tu Universidad", // Institución

  // Tipos de asistente personalizados
  typeAttendee: ["Tu Tipo 1", "Tu Tipo 2"],

  // Estilos personalizados
  styles: {
    customVariables: {
      "primary-color": "#tu-color",
      "form-max-width": "800px",
    },
  },
};
```

### Agregar Nuevos Campos

```javascript
// En el HTML, agregar después de los campos existentes:
<input type="text" placeholder="*Tu Campo" id="tu_campo" name="tu_campo" required>
<div class="error_text" id="error_tu_campo"></div>

// En el JavaScript, agregar listener:
form.ui.addInputListener(form.formElement, '#tu_campo', (value) => {
    form.formData.tu_campo = value;
    return value;
});
```

### Crear Temas Personalizados

```javascript
const miTema = {
  "primary-color": "#ff6b6b",
  "primary-hover": "#ee5a52",
  "form-background": "#fff5f5",
  "form-shadow": "0 10px 30px rgba(255, 107, 107, 0.2)",
};

// Aplicar tema
form.applyCustomStyles(miTema);
```

## 🐛 Debugging en Ejemplos

### Consola del Navegador

Todos los ejemplos incluyen logging extensivo:

```javascript
// Verificar estado del formulario
console.log("Config:", window.formInstance.getConfig());
console.log("Data:", window.formInstance.getFormData());
console.log("Styles:", window.formInstance.getLoadedStyles());

// Funciones de debug disponibles
window.showFormData(); // Ver datos actuales
window.showAllStats(); // Ver estadísticas completas
window.resetAllForms(); // Limpiar todos los formularios

// Controles de logging disponibles
window.toggleLogging(); // Activar/desactivar logging
window.setLogLevel("debug"); // Cambiar nivel de logging
window.showLogs(); // Ver logs del sistema
window.clearLogs(); // Limpiar logs
window.exportLogs(); // Exportar logs
```

### Problemas Comunes

**1. Error: "Module not found"**

```
✅ Solución: Usar servidor web local, no file://
```

**2. Estilos no se cargan**

```
✅ Solución: Verificar que la ruta basePath sea correcta
```

**3. Formulario no se inicializa**

```
✅ Solución: Revisar la consola para errores específicos
```

## 📚 Próximos Pasos

Después de explorar los ejemplos:

1. **Lee la documentación principal** en `../README.md`
2. **Consulta ejemplos avanzados** en `../usage-examples.md`
3. **Revisa la guía de migración** en `../MIGRATION.md`
4. **Implementa en tu proyecto** adaptando los ejemplos

## 🆘 Soporte

Si tienes problemas con los ejemplos:

1. **Revisa la consola del navegador** para errores
2. **Verifica que usas un servidor local** (no file://)
3. **Confirma las rutas** de imports son correctas
4. **Consulta la documentación** principal para más detalles

---

**¡Disfruta experimentando con los ejemplos!** 🚀
