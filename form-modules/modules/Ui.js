/**
 * Ui - Utilidades para manipulación del DOM e interfaz de usuario
 *
 * Responsabilidades:
 * - Manipulación segura de elementos DOM
 * - Gestión de errores visuales y mensajes
 * - Poblado dinámico de campos select
 * - Manejo de animaciones y transiciones
 * - Utilidades de validación y limpieza de datos
 *
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Config } from "./Config.js";

export class Ui {
  constructor() {
    // Configuración por defecto
    this.config = {
      errorClass: "error",
      validClass: "validated",
      errorTextClass: "error_text",
      hiddenClass: "hidden",

      // Configuración de animaciones
      animationDuration: 300,
      enableAnimations: true,

      // Configuración de mensajes
      loadingText: "Cargando...",
      successText: "Enviado correctamente",
      errorText: "Error al procesar",
    };

    // Contexto del formulario desde Config
    this.formContext = null;
  }

  /**
   * Obtener contexto del formulario actual desde Config
   * @returns {HTMLElement} - Elemento del formulario o document si no hay contexto
   */
  getFormContext() {
    if (!this.formContext) {
      this.formContext = Config.getFormElement();
    }
    return this.formContext || document;
  }

  /**
   * Actualizar contexto del formulario (útil cuando cambia dinámicamente)
   * @param {HTMLElement} newContext - Nuevo contexto del formulario
   */
  setFormContext(newContext) {
    this.formContext = newContext;
    Logger.debug(`Contexto de Ui actualizado:`, newContext ? newContext.id : "document");
  }

  /**
   * Refrescar contexto del formulario desde Config
   */
  refreshFormContext() {
    this.formContext = Config.getFormElement();
    Logger.debug(`Contexto de Ui refrescado desde Config`);
  }

  /**
   * Limpiar texto para permitir solo letras, espacios y acentos
   * @param {string} text - Texto a limpiar
   * @returns {string} - Texto limpio
   */
  cleanText(text) {
    return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
  }

  /**
   * Limpiar texto para permitir solo números y espacios
   * @param {string} text - Texto a limpiar
   * @returns {string} - Solo números
   */
  cleanNumbers(text) {
    return text.replace(/[^0-9 ]/g, "");
  }

  /**
   * Verificar si un email tiene formato válido
   * @param {string} email - Email a validar
   * @returns {boolean} - True si es válido
   */
  isValidEmail(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
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
      const searchContext = context || this.getFormContext();
      return searchContext.querySelector(selector);
    } catch (error) {
      Logger.error(`Error al buscar elemento: ${selector}`, error);
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
      const searchContext = context || this.getFormContext();
      return searchContext.querySelectorAll(selector);
    } catch (error) {
      Logger.error(`Error al buscar elementos: ${selector}`, error);
      return [];
    }
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
    // Validar que las opciones sean un array válido
    if (!this._validateOptionsArray(options)) {
      return;
    }

    const selectElement = typeof selector === "string" ? this.findElement(selector) : selector;

    if (!selectElement) {
      Logger.error(`No se encontró el elemento select con selector: ${selector}`);
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
        Logger.warn(`Saltando opción con valor inválido:`, { option });
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

    Logger.debug(`${addedCount} opciones agregadas a ${selector}`);
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

      Logger.info(
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
   * Procesar todos los selects en un formulario para auto-ocultación
   * @param {HTMLElement} formElement - Elemento del formulario
   */
  processAllSelectsForAutoHide(formElement) {
    if (!formElement) return;

    const allSelects = formElement.querySelectorAll("select");
    let processedCount = 0;

    allSelects.forEach((selectElement) => {
      this.autoHideAndSelectSingleOption(selectElement);
      processedCount++;
    });

    Logger.info(`Procesados ${processedCount} selects para auto-ocultación`);
  }

  /**
   * Mostrar select que fue auto-ocultado (para casos especiales)
   * @param {HTMLElement} selectElement - Elemento select
   */
  showAutoHiddenSelect(selectElement) {
    if (!selectElement) return;

    if (selectElement.dataset.autoHidden === "true") {
      this.showElement(selectElement);
      selectElement.dataset.autoHidden = "false";
      Logger.info(`Select auto-ocultado restaurado a visible`);
    }
  }

  /**
   * Crear campo de nivel académico de forma dinámica
   * @param {HTMLElement} formElement - Elemento del formulario
   * @returns {HTMLElement|null} - Elemento creado o existente
   */
  createAcademicLevelField(formElement) {
    const typeAttendeeElement = formElement.querySelector('[name="type_attendee"]');
    if (!typeAttendeeElement) return null;

    // Verificar si ya existe
    let academicLevelElement = formElement.querySelector('[name="academic_level"]');
    if (academicLevelElement) return academicLevelElement;

    // Crear select de nivel académico
    academicLevelElement = this.createElement("select", {
      name: "academic_level",
      reqUired: "reqUired",
      style: "display: none;",
    });

    academicLevelElement.innerHTML = '<option value="">*Nivel académico de interés</option>';

    // Crear div de error
    const errorDiv = this.createElement(
      "div",
      {
        className: this.config.errorTextClass,
        style: "display: none;",
      },
      "Selecciona un nivel académico de interés"
    );

    // Insertar después del tipo de asistente
    typeAttendeeElement.parentNode.insertBefore(
      academicLevelElement,
      typeAttendeeElement.nextSibling
    );

    academicLevelElement.parentNode.insertBefore(errorDiv, academicLevelElement.nextSibling);

    return academicLevelElement;
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
    if (!fieldElement) return;

    const fieldId = fieldElement.id || fieldElement.name;
    let errorElement =
      this.findElement(`[data-error-for="${fieldId}"]`) || this.findElement(`#error_${fieldId}`);

    // Crear elemento de error si no existe
    if (!errorElement) {
      errorElement = this.createErrorElement(fieldElement);
    }

    // Marcar campo como error
    fieldElement.classList.add(this.config.errorClass);
    fieldElement.classList.remove(this.config.validClass);

    // Mostrar mensaje de error
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = "block";

      if (this.config.enableAnimations) {
        errorElement.style.opacity = "0";
        errorElement.style.transition = `opacity ${this.config.animationDuration}ms`;

        setTimeout(() => {
          errorElement.style.opacity = "1";
        }, 10);
      }
    }
  }

  /**
   * Crear elemento de error de forma dinámica si no existe
   * @param {HTMLElement} fieldElement - Campo para el error
   * @returns {HTMLElement|null} - Elemento de error creado
   */
  createErrorElement(fieldElement) {
    if (!fieldElement) return null;

    const fieldId = fieldElement.id || fieldElement.name;
    const errorId = `error_${fieldId}`;

    // Verificar si ya existe
    const existingError = this.getFormContext().querySelector(`#${errorId}`);
    if (existingError) return existingError;

    // Crear elemento de error
    const errorElement = document.createElement("div");
    errorElement.id = errorId;
    errorElement.className = "error_text";
    errorElement.setAttribute("data-error-for", fieldId);
    errorElement.style.display = "none";

    // Encontrar dónde insertar el elemento
    const insertionPoint = this.findErrorInsertionPoint(fieldElement);

    if (insertionPoint.parent && insertionPoint.nextSibling) {
      insertionPoint.parent.insertBefore(errorElement, insertionPoint.nextSibling);
    } else if (insertionPoint.parent) {
      insertionPoint.parent.appendChild(errorElement);
    } else {
      // Fallback: insertar después del campo
      fieldElement.parentNode.insertBefore(errorElement, fieldElement.nextSibling);
    }

    return errorElement;
  }

  /**
   * Determinar la mejor ubicación para insertar el mensaje de error
   * @param {HTMLElement} fieldElement - Campo de referencia
   * @returns {Object} - Información de inserción
   */
  findErrorInsertionPoint(fieldElement) {
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
   * Obtener elemento de error existente o crear uno nuevo
   * @param {HTMLElement} fieldElement - Campo de referencia
   * @returns {HTMLElement|null} - Elemento de error
   */
  getOrCreateErrorElement(fieldElement) {
    if (!fieldElement) return null;

    const fieldId = fieldElement.id || fieldElement.name;
    let errorElement =
      this.findElement(`[data-error-for="${fieldId}"]`) || this.findElement(`#error_${fieldId}`);

    if (!errorElement) {
      errorElement = this.createErrorElement(fieldElement);
    }

    return errorElement;
  }

  /**
   * Mostrar mensaje de éxito en el contenedor apropiado
   * @param {string} message - Mensaje a mostrar
   * @param {HTMLElement} container - Contenedor específico (opcional)
   */
  showSuccessMessage(message, container = null) {
    const targetContainer =
      container ||
      this.findElement("[data-puj-form='message-success']") ||
      this.findElement("[data-success-msg]");

    if (targetContainer) {
      targetContainer.textContent = message;
      targetContainer.style.display = "block";

      if (this.config.enableAnimations) {
        targetContainer.style.opacity = "0";
        targetContainer.style.transition = `opacity ${this.config.animationDuration}ms`;

        setTimeout(() => {
          targetContainer.style.opacity = "1";
        }, 10);
      }
    }
  }

  /**
   * Ocultar mensaje de éxito del contenedor
   * @param {HTMLElement} container - Contenedor específico (opcional)
   */
  hideSuccessMessage(container = null) {
    const targetContainer =
      container ||
      this.findElement("[data-puj-form='message-success']") ||
      this.findElement("[data-success-msg]");

    if (targetContainer) {
      this.hideElement(targetContainer);
    }
  }

  /**
   * Añadir listener de input con función de limpieza automática
   * @param {HTMLElement} formElement - Formulario contenedor
   * @param {string} selector - Selector del campo
   * @param {Function} cleanFunction - Función de limpieza
   * @returns {HTMLElement|null} - Elemento configurado
   */
  addInputListener(formElement, selector, cleanFunction) {
    const element = formElement.querySelector(selector);
    if (!element) return;

    element.addEventListener("input", (e) => {
      if (cleanFunction) {
        e.target.value = cleanFunction(e.target.value);
      }

      // Limpiar error si existe
      this.hideFieldError(e.target);
    });

    return element;
  }

  /**
   * Añadir listener de cambio para un campo
   * @param {HTMLElement} formElement - Formulario contenedor
   * @param {string} selector - Selector del campo
   * @param {Function} callback - Función callback
   * @returns {HTMLElement|null} - Elemento configurado
   */
  addChangeListener(formElement, selector, callback) {
    const element = formElement.querySelector(selector);
    if (!element) return;

    element.addEventListener("change", (e) => {
      if (callback) {
        callback(e.target.value);
      }

      // Limpiar error si existe
      this.hideFieldError(e.target);
    });

    return element;
  }

  /**
   * Añadir listeners para grupo de radio buttons
   * @param {HTMLElement} formElement - Formulario contenedor
   * @param {string} selector - Selector CSS completo para los radio buttons
   * @param {Function} callback - Función callback
   * @returns {NodeList} - Lista de radio buttons configurados
   */
  addRadioListener(formElement, selector, callback) {
    const radioButtons = formElement.querySelectorAll(`input[type="radio"]${selector}`);

    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (callback) {
          callback(e.target.value);
        }
      });
    });

    return radioButtons;
  }

  /**
   * Validar y limpiar el valor de un campo según su tipo
   * @param {HTMLElement} field - Campo a procesar
   * @param {string} type - Tipo de validación ('text', 'number', 'email')
   * @returns {string} - Valor limpio
   */
  validateAndCleanField(field, type = "text") {
    if (!field) return "";

    let value = field.value;

    switch (type) {
      case "text":
        value = this.cleanText(value);
        break;
      case "number":
        value = this.cleanNumbers(value);
        break;
      case "email":
        value = value.trim().toLowerCase();
        break;
      default:
        value = value.trim();
    }

    field.value = value;
    return value;
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
   * Mostrar indicador de carga en un elemento (generalmente botones)
   * @param {HTMLElement} element - Elemento a modificar
   * @param {string} text - Texto de carga personalizado
   */
  showLoadingIndicator(element, text = null) {
    if (!element) return;

    const loadingText = text || this.config.loadingText;

    // Guardar texto original
    element.dataset.originalText = element.textContent;

    // Mostrar indicador
    element.textContent = loadingText;
    element.disabled = true;
    element.classList.add("loading");
  }

  /**
   * Restaurar elemento qUitando el indicador de carga
   * @param {HTMLElement} element - Elemento a restaurar
   */
  hideLoadingIndicator(element) {
    if (!element) return;

    // Restaurar texto original
    element.textContent = element.dataset.originalText || "";
    element.disabled = false;
    element.classList.remove("loading");

    delete element.dataset.originalText;
  }

  /**
   * Limpiar formulario
   */
  clearForm(formElement) {
    if (!formElement) return;

    // Limpiar campos
    const fields = formElement.querySelectorAll("input, select, textarea");
    fields.forEach((field) => {
      if (field.type === "radio" || field.type === "checkbox") {
        field.checked = false;
      } else {
        field.value = "";
      }

      // Limpiar clases de validación
      field.classList.remove(this.config.errorClass, this.config.validClass);
    });

    // Ocultar errores
    const errorElements = formElement.querySelectorAll(`.${this.config.errorTextClass}`);
    errorElements.forEach((error) => {
      error.style.display = "none";
    });

    // Ocultar mensajes de éxito
    this.hideSuccessMessage();
  }

  /**
   * Obtener datos del formulario
   */
  getFormData(formElement) {
    if (!formElement) return {};

    const formData = {};
    const fields = formElement.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      if (field.type === "radio" || field.type === "checkbox") {
        if (field.checked) {
          formData[field.name] = field.value;
        }
      } else {
        formData[field.name] = field.value;
      }
    });

    return formData;
  }

  /**
   * Establecer datos del formulario
   */
  setFormData(formElement, data) {
    if (!formElement || !data) return;

    Object.entries(data).forEach(([name, value]) => {
      const field = formElement.querySelector(`[name="${name}"]`);
      if (field) {
        if (field.type === "radio" || field.type === "checkbox") {
          field.checked = field.value === value;
        } else {
          field.value = value;
        }
      }
    });
  }

  /**
   * Crear notificación temporal
   */
  createNotification(message, type = "info", duration = 3000) {
    const notification = this.createElement(
      "div",
      {
        className: `notification notification-${type}`,
        style: `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "error" ? "#f44336" : type === "success" ? "#4caf50" : "#2196f3"};
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      `,
      },
      message
    );

    document.body.appendChild(notification);

    if (this.config.enableAnimations) {
      notification.style.opacity = "0";
      notification.style.transition = `opacity ${this.config.animationDuration}ms`;

      setTimeout(() => {
        notification.style.opacity = "1";
      }, 10);
    }

    // Auto-ocultar después del tiempo especificado
    setTimeout(() => {
      if (document.body.contains(notification)) {
        if (this.config.enableAnimations) {
          notification.style.opacity = "0";
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, this.config.animationDuration);
        } else {
          document.body.removeChild(notification);
        }
      }
    }, duration);

    return notification;
  }

  /**
   * Validar que el array de opciones sea válido
   * @param {Array} options - Opciones a validar
   * @returns {boolean} - True si es válido
   */
  _validateOptionsArray(options) {
    if (!Array.isArray(options)) {
      Logger.error(`Las opciones deben ser un array, recibido: ${typeof options}`);
      return false;
    }

    if (options.length === 0) {
      Logger.warn(`Array de opciones está vacío`);
      return false;
    }

    return true;
  }

  /**
   * Actualizar configuración del módulo
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtener copia de la configuración actual
   * @returns {Object} - Configuración actual
   */
  getConfig() {
    return { ...this.config };
  }
}
