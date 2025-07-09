/**
 * UIUtils - Utilidades para manipulación del DOM y gestión de interfaz
 * Maneja la creación, modificación y gestión de elementos del formulario
 * @version 1.0
 */

export class UIUtils {
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
      console.error(`Error al buscar elemento: ${selector}`, error);
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
      console.error(`Error al buscar elementos: ${selector}`, error);
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
  populateSelect(selector, options, valueKey = null, textKey = null) {
    const selectElement = typeof selector === "string" ? this.findElement(selector) : selector;

    if (!selectElement) return;

    // Limpiar opciones existentes (excepto la primera que suele ser el placeholder)
    const firstOption = selectElement.querySelector("option");
    selectElement.innerHTML = "";

    if (firstOption) {
      selectElement.appendChild(firstOption);
    }

    // Agregar nuevas opciones
    options.forEach((option) => {
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
    });
  }

  /**
   * Poblar select de países
   */
  populateCountries(locations) {
    if (!locations) return;

    const countrySelect = this.findElement('[name="country"]');
    if (!countrySelect) return;

    // Limpiar opciones existentes
    countrySelect.innerHTML = '<option value="">*País de residencia</option>';

    Object.entries(locations).forEach(([code, country]) => {
      const option = this.createElement(
        "option",
        {
          value: code,
        },
        country.nombre
      );

      // Destacar Colombia
      if (code === "COL") {
        option.style.fontWeight = "700";
      }

      countrySelect.appendChild(option);
    });

    // Establecer Colombia como default
    countrySelect.value = "COL";
  }

  /**
   * Poblar select de prefijos telefónicos
   */
  populatePrefixes(prefixes) {
    if (!prefixes) return;

    const prefixSelect = this.findElement('[name="phone_code"]');
    if (!prefixSelect) return;

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
    const errorElement =
      this.findElement(`[data-error-for="${fieldId}"]`) || this.findElement(`#error_${fieldId}`);

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
        }, this.config.animationDuration);
      } else {
        errorElement.style.display = "none";
      }
    }
  }

  /**
   * Mostrar mensaje de éxito
   */
  showSuccessMessage(message, container = null) {
    const targetContainer =
      container || this.findElement("[data-success-msg]") || this.findElement("#successMsg");

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
      container || this.findElement("[data-success-msg]") || this.findElement("#successMsg");

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
