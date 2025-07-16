/**
 * Ui - Utilidades para manipulación del DOM e interfaz de usuario
 *
 * Responsabilidades:
 * - Manipulación segura de elementos DOM
 * - Gestión de errores visuales y mensajes
 * - Poblado dinámico de campos select
 * - Manejo de animaciones y transiciones
 *
 * @version 1.0
 */

export class Ui {
  constructor({ config = {}, logger = null } = {}) {
    // Configuración por defecto
    this.config = config;
    this.logger = logger;

    // Buscar el elemento del formulario
    const formElement = document.getElementById(this.config.selector);
    if (!formElement && this.logger) {
      this.logger.warn(`⚠️ No se encontró el elemento con ID: ${this.config.selector}`);
    }

    this.formContext = formElement || document;
  }

  /**
   * Obtener contexto del formulario actual
   * @returns {HTMLElement} - Elemento del formulario o document si no hay contexto
   */
  getFormContext() {
    return this.formContext;
  }

  /**
   * Crear elemento HTML con atributos y contenido
   * @param {string} tag - Etiqueta HTML
   * @param {Object} attributes - Atributos del elemento
   * @param {string} content - Contenido de texto
   * @returns {HTMLElement} - Elemento creado
   */
  createElement(tag, attributes = {}, content = "") {
    const element = document.createElement(tag);

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "innerHTML") {
        element.innerHTML = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    if (content) {
      element.textContent = content;
    }

    return element;
  }

  /**
   * Buscar elemento en el DOM con manejo seguro de errores
   * @param {string} selector - Selector CSS
   * @param {HTMLElement} context - Contexto de búsqueda (opcional, usa formContext por defecto)
   * @returns {HTMLElement|null} - Elemento encontrado o null
   */
  findElement(selector, context = null) {
    try {
      const searchContext = context || this.formContext;
      return searchContext.querySelector(selector);
    } catch (error) {
      this.logger.error(`Error al buscar elemento: ${selector}`, error);
      return null;
    }
  }

  /**
   * Buscar múltiples elementos con manejo de errores
   * @param {string} selector - Selector CSS
   * @param {HTMLElement} context - Contexto de búsqueda (opcional, usa formContext por defecto)
   * @returns {NodeList} - Lista de elementos encontrados
   */
  findElements(selector, context = null) {
    try {
      const searchContext = context || this.formContext;
      return searchContext.querySelectorAll(selector);
    } catch (error) {
      this.logger.error(`Error al buscar elementos: ${selector}`, error);
      return [];
    }
  }

  /**
   * Verificar si un elemento existe en el DOM
   * @param {string|Object} selector - Selector CSS directo o configuración con selectorKey
   * @returns {Object} - { exists: boolean, element: HTMLElement|null, selector: string }
   */
  checkElementExists(selector) {
    if (!selector) {
      this.logger.warn(`Selector no definido para: ${selector}`);
      return { exists: false, element: null, selector: null };
    }

    const element = this.findElement(selector);
    const exists = !!element;

    if (!exists) {
      this.logger.debug(`Elemento no encontrado en DOM para: ${selector}`);
      return { exists: false, element: null, selector: null };
    }

    return { exists, element, selector };
  }

  /**
   * Método centralizado para todas las operaciones DOM con scope del formulario
   * Asegura que todas las consultas estén limitadas al contexto del formulario específico
   * @param {string} selector - Selector CSS
   * @returns {HTMLElement|null} - Elemento encontrado o null
   */
  scopedQuery(selector) {
    return this.findElement(selector);
  }

  /**
   * Método centralizado para múltiples elementos DOM con scope del formulario
   * @param {string} selector - Selector CSS
   * @returns {NodeList} - Lista de elementos encontrados
   */
  scopedQueryAll(selector) {
    return this.findElements(selector);
  }

  /**
   * Verificar si el contexto del formulario está configurado correctamente
   * @returns {boolean} - True si hay un contexto específico configurado
   */
  hasValidFormContext() {
    return this.formContext && this.formContext !== document;
  }

  /**
   * Log de advertencia si no hay contexto de formulario específico
   * @private
   */
  _logContextWarning(method) {
    if (!this.hasValidFormContext()) {
      this.logger.warn(
        `⚠️ Método ${method} ejecutado sin contexto específico de formulario. Esto puede afectar múltiples instancias.`
      );
    }
  }

  /**
   * Obtener valor de un campo (input, select, textarea)
   * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
   * @returns {string} - Valor del campo
   */
  getFieldValue(elementOrSelector) {
    this._logContextWarning("getFieldValue");
    const element =
      typeof elementOrSelector === "string"
        ? this.scopedQuery(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      this.logger.warn(`Campo no encontrado para obtener valor: ${elementOrSelector}`);
      return "";
    }

    return element.value || "";
  }

  /**
   * Establecer valor de un campo (input, select, textarea)
   * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
   * @param {string|number} value - Valor a establecer
   * @returns {boolean} - True si se estableció correctamente
   */
  setFieldValue(elementOrSelector, value) {
    this._logContextWarning("setFieldValue");
    const element =
      typeof elementOrSelector === "string"
        ? this.scopedQuery(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      this.logger.warn(`Campo no encontrado para establecer valor: ${elementOrSelector}`);
      return false;
    }

    const oldValue = element.value;
    element.value = value;

    this.logger.debug(
      `Campo ${element.name || element.id || "sin-nombre"}: "${oldValue}" → "${value}"`
    );
    return true;
  }

  /**
   * Obtener texto de un elemento
   * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
   * @returns {string} - Texto del elemento
   */
  getFieldText(elementOrSelector) {
    this._logContextWarning("getFieldText");
    const element =
      typeof elementOrSelector === "string"
        ? this.scopedQuery(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      this.logger.warn(`Elemento no encontrado para obtener texto: ${elementOrSelector}`);
      return "";
    }

    return element.textContent || "";
  }

  /**
   * Establecer texto de un elemento
   * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
   * @param {string} text - Texto a establecer
   * @returns {boolean} - True si se estableció correctamente
   */
  setFieldText(elementOrSelector, text) {
    this._logContextWarning("setFieldText");
    const element =
      typeof elementOrSelector === "string"
        ? this.scopedQuery(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      this.logger.warn(`Elemento no encontrado para establecer texto: ${elementOrSelector}`);
      return false;
    }

    const oldText = element.textContent;
    element.textContent = text;

    this.logger.debug(
      `Texto de elemento ${element.id || element.tagName}: "${oldText}" → "${text}"`
    );
    return true;
  }

  /**
   * Verificar si un elemento es visible
   * @param {HTMLElement|string} elementOrSelector - Elemento o selector CSS
   * @returns {boolean} - True si el elemento es visible
   */
  isElementVisible(elementOrSelector) {
    this._logContextWarning("isElementVisible");
    const element =
      typeof elementOrSelector === "string"
        ? this.scopedQuery(elementOrSelector)
        : elementOrSelector;

    if (!element) {
      return false;
    }

    const computedStyle = window.getComputedStyle(element);
    return (
      computedStyle.display !== "none" &&
      computedStyle.visibility !== "hidden" &&
      element.offsetParent !== null
    );
  }

  /**
   * Mostrar elemento con animación opcional
   * @param {HTMLElement} element - Elemento a mostrar
   * @param {string} display - Tipo de display CSS
   */
  showElement(element, display = "block") {
    if (!element) return;

    element.style.display = display;
    element.classList.remove(this.config.hiddenClass);

    if (this.config.enableAnimations) {
      element.style.opacity = "0";
      element.style.transition = `opacity ${this.config.animationDuration}ms`;

      setTimeout(() => {
        element.style.opacity = "1";
      }, 10);
    }
  }

  /**
   * Ocultar elemento con animación opcional
   * @param {HTMLElement} element - Elemento a ocultar
   */
  hideElement(element) {
    if (!element) return;

    if (this.config.enableAnimations) {
      element.style.transition = `opacity ${this.config.animationDuration}ms`;
      element.style.opacity = "0";

      setTimeout(() => {
        element.style.display = "none";
        element.classList.add(this.config.hiddenClass);
      }, this.config.animationDuration);
    } else {
      element.style.display = "none";
      element.classList.add(this.config.hiddenClass);
    }
  }

  /**
   * Alternar visibilidad de un elemento
   * @param {HTMLElement} element - Elemento a alternar
   * @param {boolean|null} show - Forzar mostrar/ocultar
   */
  toggleElement(element, show = null) {
    if (!element) return;

    const isHidden =
      element.style.display === "none" || element.classList.contains(this.config.hiddenClass);

    if (show === null) {
      show = isHidden;
    }

    if (show) {
      this.showElement(element);
    } else {
      this.hideElement(element);
    }
  }

  /**
   * Poblar elemento select con opciones dinámicamente
   * Incluye manejo de prioridades, validación de datos y auto-ocultación
   * @param {string|HTMLElement} selector - Selector o elemento
   * @param {Array} options - Opciones a agregar
   * @param {string} valueKey - Clave para el valor
   * @param {string} textKey - Clave para el texto
   * @param {string} priorityItems - Item prioritario (un solo valor)
   * @param {boolean} autoHide - Si auto-ocultar cuando hay una sola opción (default: true)
   */
  populateSelect({ selector, options, priorityItems = null, autoHide = true }) {
    // Validación básica (el módulo que llama debe validar los datos)
    if (!Array.isArray(options) || options.length === 0) {
      this.logger.error("Array de opciones inválido o vacío para el selector:", selector);
      return;
    }

    const selectElement = typeof selector === "string" ? this.findElement(selector) : selector;

    if (!selectElement) {
      this.logger.error(`No se encontró el elemento select con selector: ${selector}`);
      return;
    }

    // Limpiar opciones existentes (excepto la primera que suele ser el placeholder)
    const firstOption = selectElement.querySelector("option");
    selectElement.innerHTML = "";

    if (firstOption) selectElement.appendChild(firstOption);

    // Separar opciones prioritarias y normales
    const priorityOptions = [];
    const normalOptions = [];

    options.forEach((option) => {
      let optionValue, optionText;

      if (typeof option === "string") {
        optionValue = option;
        optionText = option;
      } else if (typeof option === "object" && option !== null) {
        optionValue = option.value;
        optionText = option.text;
      }

      // Evitar valores undefined o null
      if (!optionValue && !optionText) {
        this.logger.warn(`Saltando opción con valor inválido:`, { option });
        return; // Saltar esta opción
      }

      // Verificar si esta opción es prioritaria
      const isPriority =
        priorityItems &&
        typeof priorityItems === "string" &&
        (optionText.toLowerCase() === priorityItems.toLowerCase() ||
          optionValue.toString().toLowerCase() === priorityItems.toLowerCase());

      if (isPriority) {
        priorityOptions.push(option);
      } else {
        normalOptions.push(option);
      }
    });

    // Agregar opciones prioritarias primero
    let addedCount = 0;

    priorityOptions.forEach((option, index) => {
      const optionElement = this.createElement("option");

      if (typeof option === "string") {
        optionElement.value = option;
        optionElement.textContent = option;
      } else if (typeof option === "object") {
        const value = option.value;
        const text = option.text;

        optionElement.value = value;
        optionElement.textContent = text;
        // Destacar opciones prioritarias
        optionElement.style.fontWeight = "bold";
      }

      selectElement.appendChild(optionElement);
      addedCount++;
    });

    normalOptions.forEach((option, index) => {
      const optionElement = this.createElement("option");

      if (typeof option === "string") {
        optionElement.value = option;
        optionElement.textContent = option;
      } else if (typeof option === "object") {
        const value = option.value;
        const text = option.text;

        optionElement.value = value;
        optionElement.textContent = text;
      }

      selectElement.appendChild(optionElement);
      addedCount++;
    });

    // Auto-ocultar y preseleccionar si solo hay una opción válida
    if (autoHide) {
      this.autoHideAndSelectSingleOption(selectElement);
    }

    this.logger.debug(`${addedCount} opciones agregadas a ${selector}`);
  }

  /**
   * Auto-ocultar select y preseleccionar si solo tiene una opción válida
   * @param {HTMLElement} selectElement - Elemento select
   */
  autoHideAndSelectSingleOption(selectElement) {
    if (!selectElement) return;

    // Contar opciones válidas (excluyendo placeholder vacío)
    const validOptions = Array.from(selectElement.options).filter(
      (option) => option.value && option.value.trim() !== ""
    );

    if (validOptions.length === 1) {
      const singleOption = validOptions[0];

      // Preseleccionar la única opción
      selectElement.value = singleOption.value;

      // Ocultar el select
      this.hideElement(selectElement);

      // Marcar como auto-oculto para referencia
      selectElement.dataset.autoHidden = "true";

      this.logger.info(
        `Select auto-ocultado y preseleccionado: ${singleOption.textContent} (${singleOption.value})`
      );

      // Disparar evento change para que otros módulos sepan del cambio
      const changeEvent = new Event("change", { bubbles: true });
      selectElement.dispatchEvent(changeEvent);
    } else {
      // Mostrar el select si tiene múltiples opciones
      this.showElement(selectElement);
      selectElement.dataset.autoHidden = "false";
    }
  }

  /**
   * Añadir campo oculto al formulario
   * @param {HTMLElement} formElement - Formulario destino
   * @param {string} name - Nombre del campo
   * @param {string} value - Valor inicial
   * @param {string} id - ID opcional del campo
   * @returns {HTMLElement|null} - Campo creado
   */
  addHiddenField(formElement, name, value = "", info = "") {
    if (!formElement) return null;

    // Verificar si ya existe
    let hiddenField = formElement.querySelector(`input[name="${name}"]`);

    if (!hiddenField) {
      hiddenField = this.createElement("input", {
        type: "hidden",
        name: name,
        info: info,
      });

      formElement.appendChild(hiddenField);
    }

    hiddenField.value = value;
    return hiddenField;
  }

  /**
   * Establecer valor de un campo oculto existente
   * @param {HTMLElement} formElement - Formulario contenedor
   * @param {string} name - Nombre del campo
   * @param {string} value - Nuevo valor
   * @returns {boolean} - True si se estableció correctamente
   */
  setHiddenFieldValue(formElement, name, value) {
    const field =
      formElement.querySelector(`input[name="${name}"]`) || formElement.querySelector(`#${name}`);

    if (field) {
      field.value = value;
      return true;
    }

    return false;
  }

  /**
   * Mostrar mensaje de error para un campo específico
   * @param {HTMLElement} fieldElement - Campo con error
   * @param {string} message - Mensaje de error a mostrar
   */
  showFieldError(fieldElement, message) {
    if (!fieldElement) {
      this.logger.warn("🚫 [UI] showFieldError: fieldElement es null");
      return;
    }

    const fieldId = fieldElement.id || fieldElement.name;
    this.logger.info(`🔴 [UI] MOSTRANDO ERROR para ${fieldId}: "${message}"`);

    let errorElement =
      this.findElement(`[data-error-for="${fieldId}"]`) || this.findElement(`#error_${fieldId}`);

    // Crear elemento de error si no existe
    if (!errorElement) {
      this.logger.debug(`📝 Creando elemento de error para: ${fieldId}`);
      errorElement = this.createErrorElement(fieldElement);
    }

    // Marcar campo como error
    fieldElement.classList.add(this.config.errorClass);
    fieldElement.classList.remove(this.config.validClass);
    this.logger.debug(`✅ Clases de error aplicadas a: ${fieldId}`);

    // Mostrar mensaje de error
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
      this.logger.debug(`💬 Mensaje de error mostrado: ${fieldId} -> ${message}`);

      if (this.config.enableAnimations) {
        errorElement.style.opacity = "0";
        errorElement.style.transition = `opacity ${this.config.animationDuration}ms`;

        setTimeout(() => {
          errorElement.style.opacity = "1";
        }, 10);
      }
    } else {
      this.logger.warn(`⚠️ No se pudo crear elemento de error para: ${fieldId}`);
    }
  }

  /**
   * Mostrar mensaje de error general del formulario
   * @param {string} message - Mensaje de error a mostrar
   */
  showGeneralError(message) {
    let errorContainer = this.formContext.querySelector(".form-general-error");

    // Crear contenedor de error general si no existe
    if (!errorContainer) {
      errorContainer = document.createElement("div");
      errorContainer.className = "form-general-error error_text";
      errorContainer.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        padding: 10px;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        margin-bottom: 15px;
        display: none;
      `;

      // Insertar al inicio del formulario
      this.formContext.insertAdjacentElement("afterbegin", errorContainer);
    }

    // Mostrar el mensaje
    errorContainer.textContent = message;
    errorContainer.style.display = "block";

    // Animación si está habilitada
    if (this.config.enableAnimations) {
      errorContainer.style.opacity = "0";
      errorContainer.style.transition = `opacity ${this.config.animationDuration}ms`;

      setTimeout(() => {
        errorContainer.style.opacity = "1";
      }, 10);
    }

    // Desplazar hasta el error
    errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });

    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      this.hideGeneralError();
    }, 10000);

    this.logger.debug("Mensaje de error general mostrado:", message);
  }

  /**
   * Ocultar mensaje de error general del formulario
   */
  hideGeneralError() {
    const errorContainer = this.formContext.querySelector(".form-general-error");

    if (errorContainer) {
      if (this.config.enableAnimations) {
        errorContainer.style.transition = `opacity ${this.config.animationDuration}ms`;
        errorContainer.style.opacity = "0";

        setTimeout(() => {
          errorContainer.style.display = "none";
        }, this.config.animationDuration);
      } else {
        errorContainer.style.display = "none";
      }
    }
  }

  /**
   * Crear elemento de error de forma dinámica si no existe
   * @param {HTMLElement} fieldElement - Campo para el error
   * @returns {HTMLElement|null} - Elemento de error creado
   */
  createErrorElement(fieldElement) {
    if (!fieldElement) {
      this.logger.debug("🚫 createErrorElement: fieldElement es null");
      return null;
    }

    const fieldId = fieldElement.id || fieldElement.name;
    const errorId = `error_${fieldId}`;
    this.logger.debug(`🏗️ createErrorElement para: ${fieldId} (ID: ${errorId})`);

    // Verificar si ya existe
    this.logger.debug(`📋 Buscando en contexto: ${this.formContext.id || "document"}`);

    const existingError = this.formContext.querySelector(`#${errorId}`);
    if (existingError) {
      this.logger.debug(`✅ Elemento de error ya existe: ${errorId}`);
      return existingError;
    }

    // Crear elemento de error
    const errorElement = document.createElement("div");
    errorElement.id = errorId;
    errorElement.className = "error_text";
    errorElement.setAttribute("data-error-for", fieldId);
    errorElement.style.display = "none";
    this.logger.debug(`🆕 Elemento de error creado: ${errorId}`);

    // Encontrar dónde insertar el elemento
    const insertionPoint = this.findErrorInsertionPoint(fieldElement);
    this.logger.debug(`📍 Punto de inserción encontrado:`, insertionPoint);

    if (insertionPoint.parent && insertionPoint.nextSibling) {
      insertionPoint.parent.insertBefore(errorElement, insertionPoint.nextSibling);
      this.logger.debug(`✅ Error insertado antes de nextSibling`);
    } else if (insertionPoint.parent) {
      insertionPoint.parent.appendChild(errorElement);
      this.logger.debug(`✅ Error agregado al parent`);
    } else {
      // Fallback: insertar después del campo
      fieldElement.parentNode.insertBefore(errorElement, fieldElement.nextSibling);
      this.logger.debug(`✅ Error insertado como fallback después del campo`);
    }

    return errorElement;
  }

  /**
   * Determinar la mejor ubicación para insertar el mensaje de error
   * @param {HTMLElement} fieldElement - Campo de referencia
   * @returns {Object} - Información de inserción
   */
  findErrorInsertionPoint(fieldElement) {
    // Manejo especial para radio buttons
    if (fieldElement.type === "radio") {
      // Buscar el contenedor del grupo de radio buttons
      const radioGroupContainer =
        fieldElement.closest(".radio-inline-group, .radio-group") || fieldElement.closest("div");

      if (radioGroupContainer) {
        return {
          parent: radioGroupContainer.parentElement,
          nextSibling: radioGroupContainer.nextSibling,
        };
      }
    }

    // Buscar contenedor padre más apropiado
    const fieldContainer =
      fieldElement.closest(
        ".field-container, .form-group, .input-group, .name-field, .prefix-field, .mobile-field, .phone-row, .name-row"
      ) || fieldElement.parentElement;

    // Si el campo está en un contenedor específico, insertar al final de ese contenedor
    if (fieldContainer !== fieldElement.parentElement) {
      return {
        parent: fieldContainer,
        nextSibling: null,
      };
    }

    // Caso por defecto: insertar después del campo
    return {
      parent: fieldElement.parentElement,
      nextSibling: fieldElement.nextSibling,
    };
  }

  /**
   * Ocultar mensaje de error de un campo
   * @param {HTMLElement} fieldElement - Campo a limpiar
   */
  hideFieldError(fieldElement) {
    if (!fieldElement) return;

    const fieldId = fieldElement.id || fieldElement.name;
    this.logger.info(`🟢 [UI] OCULTANDO ERROR para ${fieldId}`);

    const errorElement =
      this.findElement(`[data-error-for="${fieldId}"]`) || this.findElement(`#error_${fieldId}`);

    // Limpiar clases de error
    fieldElement.classList.remove(this.config.errorClass);
    fieldElement.classList.add(this.config.validClass);

    // Ocultar mensaje de error
    if (errorElement) {
      if (this.config.enableAnimations) {
        errorElement.style.transition = `opacity ${this.config.animationDuration}ms`;
        errorElement.style.opacity = "0";

        setTimeout(() => {
          errorElement.style.display = "none";
          errorElement.textContent = ""; // Limpiar contenido
        }, this.config.animationDuration);
      } else {
        errorElement.style.display = "none";
        errorElement.textContent = ""; // Limpiar contenido
      }
    }
  }

  /**
   * Limpiar todos los mensajes de error del formulario
   * @param {HTMLElement} formElement - Formulario a limpiar
   */
  clearAllErrors(formElement) {
    if (!formElement) return;

    // Limpiar clases de error de todos los campos
    const fields = formElement.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      field.classList.remove(this.config.errorClass);
      field.classList.remove(this.config.validClass);
    });

    // Ocultar y limpiar todos los elementos de error
    const errorElements = formElement.querySelectorAll(".error_text");
    errorElements.forEach((errorElement) => {
      errorElement.style.display = "none";

      // No limpiar contenido de elementos con data-puj-form que tienen contenido predefinido
      if (!errorElement.hasAttribute("data-puj-form")) {
        errorElement.textContent = "";
      }
    });
  }

  /**
   * Deshabilitar un elemento de formulario
   * @param {HTMLElement} element - Elemento a deshabilitar
   */
  disableElement(element) {
    if (!element) return;

    element.disabled = true;
    element.classList.add("disabled");
  }

  /**
   * Habilitar un elemento de formulario
   * @param {HTMLElement} element - Elemento a habilitar
   */
  enableElement(element) {
    if (!element) return;

    element.disabled = false;
    element.classList.remove("disabled");
  }

  /**
   * Inicializar animaciones de flechas para elementos select
   * Maneja la rotación de flechas cuando los select se abren/cierran
   */
  initializeSelectArrowAnimations() {
    const selectElements = this.scopedQueryAll("select");
    
    selectElements.forEach((select) => {
      this.setupSelectArrowAnimation(select);
    });

    this.logger.debug(`Animaciones de flecha inicializadas para ${selectElements.length} selects`);
  }

  /**
   * Configurar animación de flecha para un select específico
   * @param {HTMLElement} selectElement - Elemento select
   */
  setupSelectArrowAnimation(selectElement) {
    if (!selectElement) return;

    // Remover listeners existentes para evitar duplicados
    this.removeSelectArrowListeners(selectElement);

    // Variables para rastrear el estado del dropdown
    let isOpen = false;
    let clickCount = 0;
    let clickTimeout = null;

    // Función para actualizar la flecha
    const updateArrow = (open) => {
      if (open) {
        selectElement.classList.add("select-open");
      } else {
        selectElement.classList.remove("select-open");
      }
      isOpen = open;
    };

    // Evento click - maneja la lógica de apertura/cierre
    const handleClick = (event) => {
      clickCount++;
      
      // Limpiar timeout anterior
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      
      // Esperar un poco para detectar doble click
      clickTimeout = setTimeout(() => {
        if (clickCount === 1) {
          // Single click - alternar estado
          updateArrow(!isOpen);
        } else if (clickCount === 2) {
          // Double click - cerrar
          updateArrow(false);
        }
        clickCount = 0;
      }, 250);
    };

    // Evento blur - cerrar cuando pierde el foco
    const handleBlur = (event) => {
      // Pequeño delay para permitir que el click se procese
      setTimeout(() => {
        updateArrow(false);
        clickCount = 0;
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          clickTimeout = null;
        }
      }, 100);
    };

    // Evento keydown - manejar teclas
    const handleKeydown = (event) => {
      if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp") {
        updateArrow(true);
      } else if (event.key === "Escape") {
        updateArrow(false);
      }
    };

    // Evento change - cerrar después de seleccionar
    const handleChange = (event) => {
      setTimeout(() => {
        updateArrow(false);
      }, 100);
    };

    // Agregar event listeners
    selectElement.addEventListener("click", handleClick);
    selectElement.addEventListener("blur", handleBlur);
    selectElement.addEventListener("keydown", handleKeydown);
    selectElement.addEventListener("change", handleChange);

    // Guardar referencias para poder removerlos después
    selectElement._arrowListeners = {
      click: handleClick,
      blur: handleBlur,
      keydown: handleKeydown,
      change: handleChange
    };
  }

  /**
   * Remover listeners de animación de flecha de un select
   * @param {HTMLElement} selectElement - Elemento select
   */
  removeSelectArrowListeners(selectElement) {
    if (!selectElement || !selectElement._arrowListeners) return;

    const listeners = selectElement._arrowListeners;
    selectElement.removeEventListener("click", listeners.click);
    selectElement.removeEventListener("blur", listeners.blur);
    selectElement.removeEventListener("keydown", listeners.keydown);
    selectElement.removeEventListener("change", listeners.change);

    delete selectElement._arrowListeners;
  }

  /**
   * Limpiar todas las animaciones de flechas
   */
  cleanupSelectArrowAnimations() {
    const selectElements = this.scopedQueryAll("select");
    
    selectElements.forEach((select) => {
      this.removeSelectArrowListeners(select);
      select.classList.remove("select-open");
    });
  }
}
