# 🔄 Guía de Migración - Nueva Estructura

Esta guía te ayuda a migrar a la nueva estructura organizada del sistema modular.

## 📁 Cambios en la Estructura

### **Antes** (Versión 1.x)

```
form-modules/
├── FormManager.js
├── ValidationModule.js
├── DataManager.js
├── APIService.js
├── UIUtils.js
├── StyleLoader.js
├── styles/
├── demo.html
└── README.md
```

### **Después** (Versión 2.0)

```
form-modules/
├── 📁 modules/           # ✨ Nueva carpeta para JS
│   ├── FormManager.js
│   ├── ValidationModule.js
│   ├── DataManager.js
│   ├── APIService.js
│   ├── UIUtils.js
│   └── StyleLoader.js
├── 📁 styles/            # Estilos CSS modulares
├── 📁 examples/          # ✨ Nueva carpeta para ejemplos
│   ├── demo.html         # Demo completa
│   ├── basic-form.html   # Formulario básico
│   ├── custom-styles.html # Estilos personalizados
│   ├── multiple-forms.html # Múltiples formularios
│   ├── example-usage.js  # Ejemplos de código
│   └── README.md         # Guía de ejemplos
├── 📄 usage-examples.md  # Documentación detallada
├── 📄 MIGRATION.md       # Esta guía
└── 📄 README.md          # Documentación principal
```

## 🚀 Migración Automática

### Paso 1: Actualizar Imports

**En todos tus archivos HTML y JS**, cambia:

```javascript
// ❌ Versión anterior
import { FormManager } from "./form-modules/FormManager.js";

// ✅ Nueva versión
import { FormManager } from "./form-modules/modules/FormManager.js";
```

### Paso 2: Verificar Configuración CSS

Si usas estilos personalizados, verifica la configuración:

```javascript
const form = new FormManager({
  styles: {
    enabled: true,
    basePath: "./form-modules/", // ✅ Correcto
    autoLoad: true,
  },
});
```

## 🔧 Casos de Migración Específicos

### 1. Formulario Simple

**Antes:**

```html
<script type="module">
  import { FormManager } from "./form-modules/FormManager.js";

  const form = new FormManager({
    eventName: "Mi Evento",
  });

  await form.init();
</script>
```

**Después:**

```html
<script type="module">
  import { FormManager } from "./form-modules/modules/FormManager.js";

  const form = new FormManager({
    eventName: "Mi Evento",
    styles: {
      enabled: true,
      autoLoad: true,
    },
  });

  await form.init();
</script>
```

### 2. Imports Múltiples

**Antes:**

```javascript
import { FormManager } from "./form-modules/FormManager.js";
import { ValidationModule } from "./form-modules/ValidationModule.js";
import { DataManager } from "./form-modules/DataManager.js";
```

**Después:**

```javascript
import { FormManager } from "./form-modules/modules/FormManager.js";
import { ValidationModule } from "./form-modules/modules/ValidationModule.js";
import { DataManager } from "./form-modules/modules/DataManager.js";
```

### 3. Configuración de Rutas

Si tienes configuraciones personalizadas de rutas:

**Antes:**

```javascript
const form = new FormManager({
  dataUrls: {
    locations: "./data/ubicaciones.json",
  },
});
```

**Después:**

```javascript
const form = new FormManager({
  dataUrls: {
    locations: "./data/ubicaciones.json", // Sin cambios
  },
  styles: {
    basePath: "./form-modules/", // Asegurar ruta correcta
  },
});
```

## ✅ Lista de Verificación

Usa esta lista para asegurar una migración exitosa:

### Archivos HTML

- [ ] Actualizar todos los imports de `FormManager.js`
- [ ] Actualizar otros imports de módulos si los usas
- [ ] Verificar que los estilos se cargan correctamente
- [ ] Probar la funcionalidad completa

### Archivos JavaScript

- [ ] Actualizar imports en archivos .js personalizados
- [ ] Verificar configuración de `basePath` para CSS
- [ ] Probar imports de módulos individuales

### Configuración

- [ ] Verificar rutas de archivos de datos
- [ ] Confirmar configuración de estilos
- [ ] Probar modo debug y desarrollo

### Pruebas

- [ ] Cargar formulario sin errores
- [ ] Verificar estilos aplicados correctamente
- [ ] Probar envío de formulario
- [ ] Verificar responsive design

## 🛠️ Script de Migración Automática

Si tienes muchos archivos, puedes usar este script para ayudar:

```bash
# Buscar y reemplazar en archivos .html
find . -name "*.html" -type f -exec sed -i 's|form-modules/FormManager.js|form-modules/modules/FormManager.js|g' {} \;

# Buscar y reemplazar en archivos .js
find . -name "*.js" -type f -exec sed -i 's|form-modules/FormManager.js|form-modules/modules/FormManager.js|g' {} \;
```

**⚠️ Nota:** Haz backup de tus archivos antes de ejecutar scripts automáticos.

## 🐛 Solución de Problemas

### Error: "Module not found"

```
Error: Failed to resolve module specifier "./form-modules/FormManager.js"
```

**Solución:** Actualizar el import:

```javascript
// ✅ Correcto
import { FormManager } from "./form-modules/modules/FormManager.js";
```

### Error: "CSS not loading"

```
Error: Failed to load CSS: styles/form-styles.css
```

**Solución:** Verificar configuración basePath:

```javascript
const form = new FormManager({
  styles: {
    basePath: "./form-modules/", // Asegurar ruta correcta
  },
});
```

### Error: "Cannot read property of undefined"

```
TypeError: Cannot read property 'enabled' of undefined
```

**Solución:** Agregar configuración de estilos:

```javascript
const form = new FormManager({
  eventName: "Mi Evento",
  styles: {
    // ✅ Agregar configuración
    enabled: true,
    autoLoad: true,
  },
});
```

## 🎯 Beneficios de la Nueva Estructura

### ✅ Organización Mejorada

- Código JavaScript separado en `/modules`
- Estilos CSS organizados en `/styles`
- Documentación clara y accesible

### ✅ Mantenimiento Más Fácil

- Archivos agrupados por función
- Imports más claros
- Estructura escalable

### ✅ Desarrollo Mejorado

- Navegación más fácil entre archivos
- Separación clara de responsabilidades
- Mejor experiencia de desarrollador

## 🆘 Soporte

Si encuentras problemas durante la migración:

1. **Revisa la consola del navegador** para errores específicos
2. **Verifica los imports** están actualizados
3. **Confirma las rutas** de archivos son correctas
4. **Prueba el demo.html** para verificar funcionamiento
5. **Consulta la documentación** en README.md

---

**¿Necesitas ayuda?**

- 📖 Revisa `README.md` para documentación completa
- 🎮 Prueba `examples/demo.html` para ver ejemplos funcionales
- 📚 Consulta `examples/README.md` para guía de ejemplos
- 📋 Revisa `usage-examples.md` para casos detallados
