/**
 * UIUtils - Utilidades para manipulación del DOM y gestión de interfaz
 * Maneja la creación, modificación y gestión de elementos del formulario
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class UIUtils {
  constructor(loggerConfig = {}) {
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

    this.logger = new Logger("UIUtils", loggerConfig);
  }

  /**
   * Limpiar texto (solo letras y espacios)
   */
  cleanText(text) {
    return text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "");
  }

  /**
   * Limpiar números (solo dígitos y espacios)
   */
  cleanNumbers(text) {
    return text.replace(/[^0-9 ]/g, "");
  }

  /**
   * Validar formato de email
   */
  isValidEmail(email) {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  }

  /**
   * Crear elemento HTML
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
   * Buscar elemento con manejo de errores
   */
  findElement(selector, context = document) {
    try {
      return context.querySelector(selector);
    } catch (error) {
      this.logger.error(`Error al buscar elemento: ${selector}`, error);
      return null;
    }
  }

  /**
   * Buscar múltiples elementos
   */
  findElements(selector, context = document) {
    try {
      return context.querySelectorAll(selector);
    } catch (error) {
      this.logger.error(`Error al buscar elementos: ${selector}`, error);
      return [];
    }
  }

  /**
   * Mostrar elemento
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
   * Ocultar elemento
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
   * Alternar visibilidad de elemento
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
   * Poblar select con opciones
   */
  populateSelect(selector, options, valueKey = null, textKey = null, priorityItems = []) {
    this.logger.info(`PopulateSelect - Iniciando con selector: ${selector}`);
    this.logger.info(`PopulateSelect - Opciones recibidas:`, options);
    this.logger.info(`PopulateSelect - ValueKey: ${valueKey}, TextKey: ${textKey}`);
    
    // Validar que options sea un array válido
    if (!Array.isArray(options)) {
      this.logger.error(`PopulateSelect - Las opciones deben ser un array, recibido:`, typeof options);
      return;
    }
    
    if (options.length === 0) {
      this.logger.warn(`PopulateSelect - Array de opciones está vacío`);
      return;
    }

    const selectElement = typeof selector === "string" ? this.findElement(selector) : selector;

    if (!selectElement) {
      this.logger.error(`PopulateSelect - No se encontró el elemento select con selector: ${selector}`);
      return;
    }

    this.logger.info(`PopulateSelect - Elemento select encontrado:`, selectElement);
    this.logger.info(`PopulateSelect - Selector usado: ${selector}`);
    this.logger.info(`PopulateSelect - Opciones existentes antes de limpiar: ${selectElement.options.length}`);

    // Limpiar opciones existentes (excepto la primera que suele ser el placeholder)
    const firstOption = selectElement.querySelector("option");
    this.logger.info(`PopulateSelect - Primera opción encontrada:`, firstOption);
    
    selectElement.innerHTML = "";
    this.logger.info(`PopulateSelect - Select limpiado, opciones restantes: ${selectElement.options.length}`);

    if (firstOption) {
      selectElement.appendChild(firstOption);
      this.logger.info(`PopulateSelect - Primera opción restaurada, opciones actuales: ${selectElement.options.length}`);
    }

    // Separar opciones prioritarias y normales
    const priorityOptions = [];
    const normalOptions = [];
    
    options.forEach((option) => {
      let optionValue, optionText;
      
      if (typeof option === "string") {
        optionValue = option;
        optionText = option;
      } else if (typeof option === "object" && option !== null) {
        optionValue = valueKey ? option[valueKey] : option.value || option.code;
        optionText = textKey ? option[textKey] : option.text || option.name || optionValue;
      }
      
      // Evitar valores undefined o null
      if (optionValue === undefined || optionValue === null || 
          optionText === undefined || optionText === null ||
          optionValue === "" || optionText === "") {
        this.logger.warn(`PopulateSelect - Saltando opción con valor inválido:`, { option, optionValue, optionText });
        return; // Saltar esta opción
      }
      
      
      // Verificar si esta opción es prioritaria
      const isPriority = priorityItems.some(priorityItem => {
        if (typeof priorityItem === "string") {
          return optionText.toLowerCase().includes(priorityItem.toLowerCase()) || 
                 optionValue.toString().toLowerCase().includes(priorityItem.toLowerCase());
        }
        return false;
      });
      
      if (isPriority) {
        priorityOptions.push(option);
      } else {
        normalOptions.push(option);
      }
    });

    // Agregar opciones prioritarias primero
    this.logger.info(`PopulateSelect - Agregando ${priorityOptions.length} opciones prioritarias`);
    let addedCount = 0;
    
    priorityOptions.forEach((option, index) => {
      const optionElement = this.createElement("option");

      if (typeof option === "string") {
        optionElement.value = option;
        optionElement.textContent = option;
        this.logger.info(`PopulateSelect - Opción prioritaria string: value="${option}", text="${option}"`);
      } else if (typeof option === "object") {
        const value = valueKey ? option[valueKey] : option.value || option.code;
        const text = textKey ? option[textKey] : option.text || option.name || value;

        optionElement.value = value;
        optionElement.textContent = text;
        // Destacar opciones prioritarias
        optionElement.style.fontWeight = "bold";
        this.logger.info(`PopulateSelect - Opción prioritaria object: value="${value}", text="${text}"`);
      }

      selectElement.appendChild(optionElement);
      addedCount++;
    });
    
    // Agregar opciones normales después
    this.logger.info(`PopulateSelect - Agregando ${normalOptions.length} opciones normales`);
    
    normalOptions.forEach((option, index) => {
      const optionElement = this.createElement("option");

      if (typeof option === "string") {
        optionElement.value = option;
        optionElement.textContent = option;
      } else if (typeof option === "object") {
        const value = valueKey ? option[valueKey] : option.value || option.code;
        const text = textKey ? option[textKey] : option.text || option.name || value;

        optionElement.value = value;
        optionElement.textContent = text;
      }

      selectElement.appendChild(optionElement);
      addedCount++;
    });

    this.logger.info(`PopulateSelect - Completado. Opciones agregadas: ${addedCount}, Total opciones finales: ${selectElement.options.length}`);
    this.logger.info(`PopulateSelect - Select final:`, selectElement);
    this.logger.info(`PopulateSelect - Verificando visibilidad del select:`, {
      display: selectElement.style.display,
      visibility: selectElement.style.visibility,
      opacity: selectElement.style.opacity,
      offsetHeight: selectElement.offsetHeight,
      offsetWidth: selectElement.offsetWidth,
      clientHeight: selectElement.clientHeight,
      clientWidth: selectElement.clientWidth
    });

    // Verificar que las opciones estén realmente en el DOM
    const finalOptions = selectElement.querySelectorAll("option");
    this.logger.info(`PopulateSelect - Opciones finales en DOM (querySelectorAll):`, finalOptions.length);
    finalOptions.forEach((opt, idx) => {
      this.logger.info(`PopulateSelect - Opción ${idx}: value="${opt.value}", text="${opt.textContent}"`);
    });
  }

  /**
   * Poblar select de países
   */
  populateCountries(locations) {
    if (!locations) return;

    const countrySelect = this.findElement('[name="country"]');
    if (!countrySelect) {
      this.logger.error('No se encontró el elemento select con name="country"');
      return;
    }

    // Convertir object locations a array para usar populateSelect
    const countries = Object.entries(locations).map(([code, country]) => ({
      codigo: code,
      nombre: country.nombre
    }));

    // Usar populateSelect con prioridad para Colombia
    this.populateSelect('[name="country"]', countries, "codigo", "nombre", ["colombia"]);

    // Establecer Colombia como default
    countrySelect.value = "COL";
  }

  /**
   * Poblar select de prefijos telefónicos
   */
  populatePrefixes(prefixes) {
    if (!prefixes) {
      this.logger.error('No se recibieron prefijos para poblar');
      return;
    }

    const prefixSelect = this.findElement('[name="phone_code"]');
    if (!prefixSelect) {
      this.logger.error('No se encontró el elemento select con name="phone_code"');
      return;
    }

    this.logger.info('Poblando prefijos telefónicos:', prefixes.length);

    // Limpiar opciones existentes
    prefixSelect.innerHTML = '<option value="">(+) Indicativo</option>';

    prefixes.forEach((prefix) => {
      const option = this.createElement(
        "option",
        {
          value: prefix.phoneCode,
        },
        `(+${prefix.phoneCode}) ${prefix.phoneName}`
      );

      // Destacar Colombia
      if (prefix.phoneName === "Colombia") {
        option.style.backgroundColor = "aliceBlue";
        option.style.color = "#000000";
        option.style.fontWeight = "900";
      }

      prefixSelect.appendChild(option);
    });

    // Establecer Colombia como default (+57)
    prefixSelect.value = "57";
    this.logger.info('Prefijo de Colombia (+57) establecido como predeterminado');
  }

  /**
   * Crear campo de nivel académico dinámicamente
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
      required: "required",
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
   * Agregar campo oculto
   */
  addHiddenField(formElement, name, value = "", id = "") {
    if (!formElement) return null;

    // Verificar si ya existe
    let hiddenField = formElement.querySelector(`input[name="${name}"]`);

    if (!hiddenField) {
      hiddenField = this.createElement("input", {
        type: "hidden",
        name: name,
      });

      if (id) {
        hiddenField.id = id;
      }

      formElement.appendChild(hiddenField);
    }

    hiddenField.value = value;
    return hiddenField;
  }

  /**
   * Establecer valor de campo oculto
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
   * Mostrar error en campo
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
   * Crear elemento de error dinámicamente
   */
  createErrorElement(fieldElement) {
    if (!fieldElement) return null;

    const fieldId = fieldElement.id || fieldElement.name;
    const errorId = `error_${fieldId}`;

    // Verificar si ya existe
    const existingError = document.getElementById(errorId);
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
   * Encontrar el punto de inserción para el elemento de error
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
   * Ocultar error en campo
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
   * Limpiar todos los errores del formulario
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
      errorElement.textContent = "";
    });
  }

  /**
   * Obtener o crear elemento de error para un campo
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
   * Mostrar mensaje de éxito
   */
  showSuccessMessage(message, container = null) {
    const targetContainer =
      container || this.findElement("[data-puj-form='message-success']") || this.findElement("[data-success-msg]");

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
   * Ocultar mensaje de éxito
   */
  hideSuccessMessage(container = null) {
    const targetContainer =
      container || this.findElement("[data-puj-form='message-success']") || this.findElement("[data-success-msg]");

    if (targetContainer) {
      this.hideElement(targetContainer);
    }
  }

  /**
   * Agregar event listener para input con limpieza
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
   * Agregar event listener para change
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
   * Agregar event listener para radio buttons
   */
  addRadioListener(formElement, name, callback) {
    const radioButtons = formElement.querySelectorAll(`input[type="radio"][name="${name}"]`);

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
   * Validar y limpiar valor de campo
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
   * Deshabilitar elemento
   */
  disableElement(element) {
    if (!element) return;

    element.disabled = true;
    element.classList.add("disabled");
  }

  /**
   * Habilitar elemento
   */
  enableElement(element) {
    if (!element) return;

    element.disabled = false;
    element.classList.remove("disabled");
  }

  /**
   * Mostrar indicador de carga
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
   * Ocultar indicador de carga
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
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return { ...this.config };
  }
}
