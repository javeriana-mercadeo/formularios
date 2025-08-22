# Tokens de Diseño - Librería Form Modules

Esta librería utiliza un sistema de tokens de diseño de tres capas para permitir máxima flexibilidad y mantenibilidad.

## Arquitectura del Sistema de Tokens

### 1. **Tokens Primitivos** (Capa Base)

Los tokens primitivos definen los valores fundamentales del sistema de diseño.

```css
/* Colores primitivos */
--fm-color-primary-500: #3e72b9;
--fm-color-neutral-900: #111827;

/* Espaciado primitivo */
--fm-space-4: 1rem; /* 16px */
--fm-space-6: 1.5rem; /* 24px */

/* Tipografía primitiva */
--fm-font-size-base: 1rem; /* 16px */
--fm-font-weight-medium: 500;
```

### 2. **Tokens Semánticos** (Capa Semántica)

Los tokens semánticos definen el propósito y contexto de uso.

```css
/* Texto semántico */
--fm-text-primary: var(--fm-color-neutral-900);
--fm-text-secondary: var(--fm-color-neutral-600);

/* Superficies semánticas */
--fm-surface-primary: var(--fm-color-neutral-0);
--fm-border-default: var(--fm-color-neutral-300);

/* Interacción semántica */
--fm-interactive-primary: var(--fm-color-primary-600);
--fm-interactive-primary-hover: var(--fm-color-primary-700);
```

### 3. **Tokens de Componente** (Capa de Componente)

Los tokens de componente definen valores específicos para componentes individuales.

```css
/* Contenedor de formulario */
--fm-container-max-width: 32rem;
--fm-container-padding: var(--fm-space-6);

/* Campos de entrada */
--fm-input-height: 2.75rem;
--fm-input-border-radius: var(--fm-radius-md);

/* Botones */
--fm-button-height: var(--fm-input-height);
--fm-button-padding-x: var(--fm-space-6);
```

## Personalización por Capas

### Nivel 1: Personalización Básica (Tokens Primitivos)

Cambiar los colores principales de la marca:

```css
:root {
  /* Reemplazar colores primarios */
  --fm-color-primary-500: #tu-color-de-marca;
  --fm-color-primary-600: #tu-color-mas-oscuro;
  --fm-color-primary-700: #tu-color-aun-mas-oscuro;
}
```

### Nivel 2: Personalización Semántica

Redefinir el propósito de los elementos:

```css
:root {
  /* Cambiar colores de texto */
  --fm-text-primary: #tu-color-de-texto-personalizado;

  /* Cambiar colores de superficie */
  --fm-surface-primary: #tu-color-de-fondo;

  /* Cambiar comportamiento de interacción */
  --fm-interactive-primary: #tu-color-de-interaccion;
}
```

### Nivel 3: Personalización de Componente

Ajustar componentes específicos:

```css
:root {
  /* Cambiar tamaño del contenedor */
  --fm-container-max-width: 40rem;

  /* Cambiar altura de campos de entrada */
  --fm-input-height: 3rem;

  /* Cambiar espaciado interno */
  --fm-container-padding: 2rem;
}
```

## Tokens Disponibles por Categoría

### Colores

#### Primarios

- `--fm-color-primary-{50-950}`: Escala completa de colores primarios
- `--fm-color-neutral-{0,50-900}`: Escala de grises neutros

#### Semánticos

- `--fm-color-success-{50,500,600}`: Verde para éxito
- `--fm-color-error-{50,500,600}`: Rojo para errores
- `--fm-color-warning-{50,500,600}`: Amarillo para advertencias
- `--fm-color-info-{50,500,600}`: Azul para información

### Espaciado

- `--fm-space-{0,1,2,3,4,5,6,8,10,12,16}`: Escala de espaciado de 0 a 64px

### Tipografía

- `--fm-font-size-{xs,sm,base,lg,xl,2xl}`: Tamaños de fuente
- `--fm-font-weight-{normal,medium,semibold,bold}`: Pesos de fuente
- `--fm-line-height-{tight,normal,relaxed}`: Alturas de línea

### Bordes

- `--fm-radius-{none,sm,base,md,lg,xl,2xl,full}`: Radio de bordes

### Sombras

- `--fm-shadow-{sm,base,md,lg,xl}`: Escalas de sombras

### Transiciones

- `--fm-duration-{fast,normal,slow}`: Duraciones de animación
- `--fm-easing-{linear,ease,ease-in,ease-out,ease-in-out}`: Funciones de easing

## Ejemplos de Theming

### Tema Oscuro

```css
[data-theme='dark'] {
  --fm-color-neutral-0: #000000;
  --fm-color-neutral-50: #1f2937;
  --fm-color-neutral-900: #ffffff;

  --fm-surface-primary: var(--fm-color-neutral-900);
  --fm-text-primary: var(--fm-color-neutral-0);
}
```

### Tema de Marca Personalizada

```css
.custom-brand {
  --fm-color-primary-500: #ff6b35;
  --fm-color-primary-600: #e55a2b;
  --fm-color-primary-700: #cc4e21;

  --fm-container-border-radius: var(--fm-radius-lg);
  --fm-input-border-radius: var(--fm-radius-lg);
}
```

### Tema Compacto

```css
.compact-theme {
  --fm-space-2: 0.25rem;
  --fm-space-3: 0.5rem;
  --fm-space-4: 0.75rem;
  --fm-space-6: 1rem;

  --fm-input-height: 2.25rem;
  --fm-container-padding: var(--fm-space-4);
}
```

## Mejores Prácticas

### 1. **Usar Tokens Semánticos**

Siempre prefiere tokens semánticos sobre primitivos:

```css
/* ✅ Recomendado */
color: var(--fm-text-primary);

/* ❌ Evitar */
color: var(--fm-color-neutral-900);
```

### 2. **Mantener Consistencia**

Usa el mismo token para propósitos similares:

```css
/* ✅ Consistente */
.field {
  margin-bottom: var(--fm-space-4);
}

.button {
  margin-bottom: var(--fm-space-4);
}
```

### 3. **Customización Gradual**

Comienza con tokens de alto nivel y ve específico según necesites:

```css
/* Paso 1: Cambiar color primario */
--fm-color-primary-500: #your-brand;

/* Paso 2: Si necesitas más control */
--fm-interactive-primary: #specific-color;

/* Paso 3: Si necesitas control granular */
--fm-button-background: #very-specific-color;
```

### 4. **Documentar Customizaciones**

Siempre documenta las razones de tus customizaciones:

```css
:root {
  /* Requisito de accesibilidad: contraste mínimo AA */
  --fm-text-primary: #1a1a1a;

  /* Requisito de marca: color corporativo */
  --fm-color-primary-500: #company-blue;
}
```

## Validación y Testing

### Verificar Contraste

Asegúrate de que las combinaciones de colores cumplan con los estándares de accesibilidad:

- **AA Normal**: Ratio de contraste mínimo 4.5:1
- **AA Large**: Ratio de contraste mínimo 3:1
- **AAA**: Ratio de contraste mínimo 7:1

### Testing de Tokens

Verifica que tus customizaciones funcionen en todos los componentes:

```html
<!-- Aplicar tema personalizado -->
<div class="form-modules custom-theme">
  <!-- Todos los componentes heredarán los tokens customizados -->
</div>
```
