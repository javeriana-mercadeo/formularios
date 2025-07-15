# Guía de Clases CSS - Form Modules

## Problema Resuelto
Se eliminaron las clases CSS genéricas que podían generar conflictos con estilos externos del sitio web donde se use el módulo.

## Clases Específicas del Módulo

### Container Classes (Recomendadas)
```css
.fm-form-container    /* Contenedor principal del formulario */
.form-module-container /* Contenedor alternativo específico del módulo */
```

### Utility Classes (Nuevas)
```css
.form-card .fm-text-center    /* Centrar texto */
.form-card .fm-text-left      /* Alinear texto a la izquierda */
.form-card .fm-text-right     /* Alinear texto a la derecha */
.form-card .fm-hidden         /* Ocultar elemento */
.form-card .fm-visible        /* Mostrar elemento */
.form-card .fm-w-full         /* Ancho completo */
.form-card .fm-w-half         /* Ancho 50% */
.form-card .fm-mt-small       /* Margin top pequeño */
.form-card .fm-mb-large       /* Margin bottom grande */
.form-card .fm-dropdown-list  /* Lista desplegable */
```

## Compatibilidad Legacy
Las siguientes clases se mantienen temporalmente para compatibilidad:

```css
.form-container     /* ⚠️ Usar .fm-form-container en nuevos proyectos */
.form-card .hidden  /* ⚠️ Usar .fm-hidden en nuevos proyectos */
.form-card .visible /* ⚠️ Usar .fm-visible en nuevos proyectos */
.form-card .dropdown-list /* ⚠️ Usar .fm-dropdown-list en nuevos proyectos */
```

## Clases Eliminadas ❌
```css
.container          /* REMOVIDA - causaba conflictos */
.text-center        /* REMOVIDA - usar .fm-text-center */
.text-left          /* REMOVIDA - usar .fm-text-left */
.text-right         /* REMOVIDA - usar .fm-text-right */
.hidden             /* REMOVIDA - usar .fm-hidden */
.visible            /* REMOVIDA - usar .fm-visible */
.w-full             /* REMOVIDA - usar .fm-w-full */
.w-half             /* REMOVIDA - usar .fm-w-half */
.dropdown-list      /* REMOVIDA - usar .fm-dropdown-list */
```

## Recomendaciones para Desarrolladores

### ✅ Hacer:
- Usar clases con prefijo `fm-` para nuevos desarrollos
- Mantener todas las clases dentro de `.form-card` para máxima especificidad
- Usar `.fm-form-container` como contenedor principal

### ❌ Evitar:
- Usar clases genéricas como `container`, `row`, `col`, etc.
- Crear clases sin prefijo que puedan entrar en conflicto
- Usar clases legacy en nuevos proyectos

## Estructura HTML Recomendada
```html
<div class="fm-form-container">
  <div class="form-card" data-form-module="true">
    <!-- Contenido del formulario -->
  </div>
</div>
```

## Migración
Para migrar código existente:

1. Reemplazar `form-container` → `fm-form-container`
2. Reemplazar clases utility genéricas por las específicas con prefijo `fm-`
3. Verificar que no hay conflictos con CSS externo
4. Probar en entorno de desarrollo antes de producción

## Especificidad CSS
Todas las clases del módulo tienen alta especificidad:
- `.form-card .fm-*` = 20 puntos de especificidad
- `.form-card[data-form-module] .fm-*` = 21 puntos de especificidad

Esto asegura que los estilos del módulo no sean sobrescritos por estilos externos.