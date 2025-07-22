# 🎨 Guía de Estilos CSS - Sistema Modular de Formularios PUJ

## Arquitectura CSS

El sistema utiliza una arquitectura CSS modular basada en SCSS con las siguientes características:

- **SCSS Modular**: Archivos separados por funcionalidad
- **Variables CSS**: Personalización fácil mediante custom properties
- **Clases con Prefijo**: Sistema `fm-*` para evitar conflictos
- **BEM Methodology**: Para nomenclatura de componentes específicos
- **Tailwind Integration**: Utilidades opcionales

## Estructura de Archivos SCSS

```
src/styles/
├── form-modules.scss          # Archivo principal que importa todo
├── _vars.scss                 # Variables CSS y SCSS
└── modules/
    ├── _base.scss             # Reset y estilos base
    ├── _layout.scss           # Sistema de layout
    ├── _forms.scss            # Componentes de formulario
    ├── _fields.scss           # Campos específicos
    ├── _buttons.scss          # Estilos de botones
    ├── _validation.scss       # Estados de validación
    ├── _utilities.scss        # Clases utilitarias
    └── _demo-theme.scss       # Tema de demostración
```

## Variables CSS Disponibles

### Variables de Color (`src/styles/_vars.scss`)

El sistema utiliza variables CSS bajo el prefijo `form-modules:root`:

```scss
form-modules:root {
  // Paleta de colores primarios (azul)
  --form-modules-primary-50: #f3f6fc;
  --form-modules-primary-100: #e7edf7;
  --form-modules-primary-200: #c9d7ee;
  --form-modules-primary-300: #99b6e0;
  --form-modules-primary-400: #6290ce;
  --form-modules-primary-500: #3e72b9; // Color principal
  --form-modules-primary-600: #2c5697;
  --form-modules-primary-700: #26477e;
  --form-modules-primary-800: #233e69;
  --form-modules-primary-900: #223658;
  --form-modules-primary-950: #16223b;
  --form-modules-primary: var(--form-modules-primary-500);

  // Variaciones con transparencia
  --form-modules-primary-500-30: rgba(62, 114, 185, 0.3);
  --form-modules-primary-500-40: rgba(62, 114, 185, 0.4);
}
```

### Selector Principal

El sistema usa un selector con prefijo para aislamiento:

```scss
$selector-prefix: "form-modules";

.#{$selector-prefix} {
  // Todos los estilos están contenidos aquí
  // Usa clases de TailwindCSS dentro del contenedor
}
```

## Sistema de Clases Reales

### Contenedor Principal

```css
.form-modules {
  /* Contenedor principal con clases Tailwind aplicadas */
  /* @apply font-segoe bg-white rounded-2xl p-6 my-0 mx-auto w-full max-w-lg */
  /* @apply flex flex-col max-h-[90vh] overflow-y-auto box-border shadow-lg */
}
```

### Clases Utilitarias Disponibles

```css
// Visibilidad (crítica para JavaScript)
.fm-hidden                  /* @apply hidden; - usada por UI.js */

/* @apply hidden; - usada por UI.js */

/* @apply hidden; - usada por UI.js */

/* @apply hidden; - usada por UI.js */

// Mensajes de error
.form-general-error         /* Mensajes de error generales */

// Contenedores de campos
.field-container           /* @apply mb-4; */
.form-group               /* @apply mb-4; */
.input-group              /* @apply flex gap-2; */

// Grupos de radio
.radio-group              /* @apply flex gap-6 items-center; */
.radio-option            /* @apply flex items-center gap-2; */
.radio-inline-group      /* Grupos de radio inline */

// Layout específico
.phone-row               /* @apply flex gap-4 w-full; */
.name-row                /* @apply flex gap-4 w-full; */
.name-field              /* @apply flex-1; */
.prefix-field            /* @apply w-32 flex-shrink-0; */
.mobile-field; /* @apply flex-1; */
```

### Componentes de Botón

```css
.submit-button {
  /* Botón principal con variables CSS personalizadas */
  background-color: var(--form-modules-primary);

  &:hover {
    background-color: var(--form-modules-primary-600);
    box-shadow: 0 4px 12px var(--form-modules-primary-500-30);
  }

  &:active {
    background-color: var(--form-modules-primary-700);
    box-shadow: 0 2px 8px var(--form-modules-primary-500-40);
  }
}
```

### Estados de Validación

```css
// Estados de campos
.form-field--valid              /* Campo válido (verde) */
/* Campo válido (verde) */
/* Campo válido (verde) */
/* Campo válido (verde) */
.form-field--invalid            /* Campo inválido (rojo) */
.form-field--loading            /* Campo en proceso de validación */

// Mensajes
.validation-message             /* Mensaje de validación base */
.validation-message--error      /* Mensaje de error */
.validation-message--success    /* Mensaje de éxito */
.validation-message--warning; /* Mensaje de advertencia */
```

### Componentes Específicos del Formulario

```css
// Campos de formulario
.form-field                     /* Contenedor de campo */
/* Contenedor de campo */
/* Contenedor de campo */
/* Contenedor de campo */
.form-field__label              /* Etiqueta del campo */
.form-field__input              /* Input del campo */
.form-field__error              /* Mensaje de error del campo */

// Botones
.btn                            /* Botón base */
.btn--form-modules-primary                   /* Botón primario */
.btn--secondary                 /* Botón secundario */
.btn--loading                   /* Botón en estado de carga */
.btn--disabled                  /* Botón deshabilitado */

// Dropdown/Select personalizado
.custom-select                  /* Select personalizado */
.custom-select__trigger         /* Trigger del select */
.custom-select__options         /* Lista de opciones */
.custom-select__option          /* Opción individual */
.custom-select__option--selected; /* Opción seleccionada */
```

## Personalización del Sistema

### Cambiar Colores del Tema

Para personalizar los colores, puedes sobrescribir las variables CSS:

```css
/* Crear archivo personalizado después del CSS compilado */
form-modules:root {
  --form-modules-primary: #e91e63; /* Rosa como color principal */
  --form-modules-primary-500: #e91e63;
  --form-modules-primary-600: #c2185b; /* Hover */
  --form-modules-primary-700: #ad1457; /* Active */
  --form-modules-primary-500-30: rgba(233, 30, 99, 0.3); /* Transparencia */
  --form-modules-primary-500-40: rgba(233, 30, 99, 0.4);
}
```

### Personalización con TailwindCSS

El sistema usa extensivamente TailwindCSS, por lo que puedes modificar `tailwind.config.js`:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f8",
          500: "#e91e63", // Tu color personalizado
          600: "#c2185b",
          700: "#ad1457",
        },
      },
    },
  },
};
```

### Personalización JavaScript Runtime

```javascript
// Cambiar variables CSS dinámicamente
const formContainer = document.querySelector(".form-modules");
formContainer.style.setProperty("--form-modules-primary", "#ff5722");
formContainer.style.setProperty("--form-modules-primary-600", "#e64a19");
formContainer.style.setProperty("--form-modules-primary-700", "#d84315");

// Actualizar transparencias también
formContainer.style.setProperty("--form-modules-primary-500-30", "rgba(255, 87, 34, 0.3)");
```

### Estructura HTML Real

```html
<div class="form-modules">
  <!-- Todo el contenido del formulario va aquí -->
  <!-- Las clases Tailwind se aplican automáticamente -->

  <form>
    <div class="field-container">
      <input type="text" />
    </div>

    <div class="radio-inline-group">
      <div class="radio-option">
        <input type="radio" />
        <label>Opción</label>
      </div>
    </div>

    <button class="submit-button">Enviar</button>
  </form>
</div>
```

## Responsive Design

### Breakpoints del Sistema

```scss
// Variables de breakpoints
$breakpoints: (
  "xs": 0,
  "sm": 576px,
  "md": 768px,
  "lg": 992px,
  "xl": 1200px,
  "xxl": 1400px,
);

// Mixins para media queries
@mixin media-up($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

@mixin media-down($breakpoint) {
  @media (max-width: (map-get($breakpoints, $breakpoint) - 1px)) {
    @content;
  }
}
```

### Estilos Responsive Automáticos

```scss
.form-card {
  // Desktop (por defecto)
  width: var(--form-max-width);
  padding: var(--form-padding);

  // Tablet
  @include media-down("md") {
    width: 100%;
    max-width: 90%;
    padding: var(--spacing-lg);
  }

  // Móvil
  @include media-down("sm") {
    padding: var(--spacing-md);
    border-radius: calc(var(--form-border-radius) * 0.75);

    .form-field__input {
      font-size: 16px; // Evita zoom en iOS
    }
  }
}
```

## Buenas Prácticas

### ✅ Recomendaciones

- **Usar prefijo `fm-`** para todas las clases nuevas del módulo
- **Mantener especificidad alta** con `.form-card .fm-*`
- **Usar variables CSS** para valores que puedan cambiar
- **Aplicar metodología BEM** para componentes complejos
- **Hacer responsive-first** con mobile como base
- **Probar en diferentes dispositivos** antes de producción

### ❌ Evitar

- **Clases genéricas** como `.container`, `.row`, `.col`
- **Estilos inline** excepto para personalización dinámica
- **!important** a menos que sea absolutamente necesario
- **Valores hardcoded** que deberían ser variables
- **Especificidad baja** que pueda ser sobrescrita
- **Estilos sin prefijo** que puedan causar conflictos

## Arquitectura CSS Real

### Enfoque TailwindCSS + Variables CSS

El sistema combina:

1. **TailwindCSS** para la mayoría de estilos utilitarios
2. **Variables CSS personalizadas** para el tema de colores
3. **Selector con prefijo** `.form-modules` para aislamiento
4. **SCSS** solo para organización y variables

### Ejemplo de Implementación Real

```scss
// src/styles/modules/_buttons.scss
.submit-button {
  // Clases Tailwind aplicadas via @apply
  @apply appearance-none outline-none border-0 bg-transparent;
  @apply cursor-pointer relative inline-flex items-center justify-center;
  @apply min-w-16 min-h-10 font-medium leading-6 text-sm rounded-xl px-4 py-2;
  @apply transition-all duration-300 ease-in-out select-none;
  @apply text-white w-full max-w-[424px] mx-auto;

  // Variables CSS personalizadas para colores
  background-color: var(--form-modules-primary);

  &:hover {
    background-color: var(--form-modules-primary-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px var(--form-modules-primary-500-30);
  }
}
```

### Diferencias con Sistemas CSS Tradicionales

❌ **NO usa:**

- Clases con prefijo `fm-*` extensivamente
- Variables CSS globales en `:root`
- Sistema BEM tradicional
- CSS puro sin framework

✅ **SÍ usa:**

- TailwindCSS para utilidades
- Variables CSS específicas con prefijo `form-modules:root`
- Selector de aislamiento `.form-modules`
- SCSS solo para organización
- Clases específicas solo cuando es necesario

## Migración desde Sistema Legacy

### 1. Actualizar Contenedor Principal

```diff
- <div class="container">
- <div class="form-container">
+ <div class="form-modules">
    <!-- Todo el contenido del formulario -->
    <!-- Las clases Tailwind se aplican automáticamente -->
  </div>
```

### 2. Usar Clases Específicas Reales

```diff
- <div class="hidden">
+ <div class="fm-hidden">

- <div class="my-custom-container">
+ <div class="field-container">

- <div class="phone-container">
+ <div class="phone-row">
```

### 3. Variables CSS Correctas

```diff
- :root {
-   --form-modules-primary-color: #4d7fcb;
- }
+ form-modules:root {
+   --form-modules-primary: #4d7fcb;
+   --form-modules-primary-600: #3f6fb5;
+ }
```

## Debugging de Estilos

### Verificar Implementación Real

```javascript
// Verificar variables CSS del sistema
const formElement = document.querySelector(".form-modules");
const styles = getComputedStyle(formElement);

// Variables disponibles en form-modules:root
console.log("Primary:", styles.getPropertyValue("--form-modules-primary"));
console.log("Primary 600:", styles.getPropertyValue("--form-modules-primary-600"));
console.log("Primary transparent:", styles.getPropertyValue("--form-modules-primary-500-30"));

// Verificar clases Tailwind aplicadas
console.log("Clases aplicadas:", formElement.classList);
```

### Problemas Comunes y Soluciones

#### 1. Variables CSS no funcionan

```scss
// ❌ Incorrecto
:root {
  --form-modules-primary: #blue;
}

// ✅ Correcto - usar el prefijo del sistema
form-modules:root {
  --form-modules-primary: #3e72b9;
}
```

#### 2. Estilos no se aplican

```scss
// ❌ Incorrecto - fuera del contenedor
.mi-clase {
  color: red;
}

// ✅ Correcto - dentro del selector principal
.form-modules .mi-clase {
  color: red;
}
```

#### 3. TailwindCSS no funciona

```javascript
// Verificar que tailwind.config.js incluya los archivos correctos
module.exports = {
  content: [
    "./examples/**/*.html", // ← Importante
    "./src/**/*.js", // ← Importante
  ],
};
```

#### 4. Clases no disponibles

```javascript
// Verificar que las clases estén compiladas en build/
// Solo estas clases específicas están disponibles:
const availableClasses = [
  "fm-hidden",
  "form-general-error",
  "field-container",
  "radio-group",
  "phone-row",
  "submit-button",
  // etc...
];
```
