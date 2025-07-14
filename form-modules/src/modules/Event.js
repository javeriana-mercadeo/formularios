/**
 * Event - Maneja todos los event listeners del formulario
 * Centraliza la configuración de eventos DOM y sistema de eventos personalizados
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";

export class Event {
  constructor({ formElement, state, ui, logger = null }) {
    this.formElement = formElement;
    this.state = state;
    this.ui = ui;
    this.logger = logger;

    // External handlers para lógica específica del formulario
    this.handlers = new Map();

    // Custom event listeners para eventos de estado
    this.customEvents = new Map();

    // Configuración de campos del formulario desde Constants
    this.fieldConfigs = Constants.FIELD_CONFIGS;

    // Mapeo de handlers especiales internos
    this.specialHandlers = {
      country: this._handleCountryChange.bind(this),
      department: this._handleDepartmentChange.bind(this),
      typeAttendee: this._handleTypeAttendeeChange.bind(this),
      academicLevel: this._handleAcademicLevelChange.bind(this),
      faculty: this._handleFacultyChange.bind(this),
      program: this._handleProgramChange.bind(this),
      authorization: this._handleAuthorizationChange.bind(this),
    };
  }

  // ===============================
  // CONFIGURACIÓN DE EVENT LISTENERS
  // ===============================

  /**
   * Configurar todos los event listeners del formulario
   */
  setupAllEvents() {
    this.logger.info("🎧 Configurando todos los event listeners...");

    this._setupFormFieldListeners();
    this._setupSubmitListener();

    this.logger.info("✅ Event listeners configurados exitosamente");
  }

  /**
   * Configurar listeners para campos de formulario básicos
   * @private
   */
  _setupFormFieldListeners() {
    this.fieldConfigs.forEach((config) => {
      // Verificar si el elemento existe en el DOM usando la utilidad de UI
      const { exists } = this.ui.checkElementExists(config.selector);
      
      if (!exists) {
        return; // El logging ya se maneja en checkElementExists
      }

      // Determinar el callback apropiado
      let callback;
      
      if (config.handler && this.specialHandlers[config.handler]) {
        // Usar handler especial
        callback = this.specialHandlers[config.handler];
      } else if (config.type === "text") {
        // Handler básico para texto con limpieza
        callback = (value) => {
          if (config.cleanMethod && this.ui[config.cleanMethod]) {
            value = this.ui[config.cleanMethod](value);
          }
          return this._handleTextInput(value, config.stateKey, config.cleanMethod);
        };
      } else {
        // Handler básico para select/otros
        callback = (value) => this._handleSimpleSelect(value, config.stateKey);
      }

      // Agregar listener según el tipo
      if (config.type === "text") {
        this.addInputListener(config.selector, callback);
      } else if (config.type === "radio") {
        this.addRadioListener(config.selector, callback);
      } else {
        // select y otros tipos
        this.addChangeListener(config.selector, callback);
      }
    });
  }


  /**
   * Configurar listener para envío del formulario
   * @private
   */
  _setupSubmitListener() {
    this.formElement.addEventListener("submit", this._handleFormSubmit.bind(this));
  }

  // ===============================
  // MANEJADORES DE EVENTOS
  // ===============================

  /**
   * Manejar entrada de texto con limpieza
   * @private
   */
  _handleTextInput(value, stateKey, cleanMethod) {
    let cleanValue = value;
    if (cleanMethod && this.ui[cleanMethod]) {
      cleanValue = this.ui[cleanMethod](value);
    }
    this.state.updateField(stateKey, cleanValue);
    return cleanValue;
  }

  /**
   * Manejar selección simple
   * @private
   */
  _handleSimpleSelect(value, stateKey) {
    this.state.updateField(stateKey, value);
  }

  /**
   * Manejar cambio de autorización
   * @private
   */
  _handleAuthorizationChange(value) {
    this.state.updateField(Constants.FIELDS.DATA_AUTHORIZATION, value);
    this._delegateToHandler(Constants.HANDLER_TYPES.AUTHORIZATION_CHANGE, value);
  }

  /**
   * Manejar envío del formulario
   * @private
   */
  _handleFormSubmit(event) {
    const handler = this.handlers.get(Constants.HANDLER_TYPES.FORM_SUBMIT);
    if (handler) {
      handler(event);
    } else {
      this.logger.warn(`No hay handler registrado para ${Constants.HANDLER_TYPES.FORM_SUBMIT}`);
      event.preventDefault();
    }
  }

  /**
   * Manejadores para campos especiales (delegan a handlers externos)
   * @private
   */
  _handleCountryChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.COUNTRY_CHANGE, value);
  }

  _handleDepartmentChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.DEPARTMENT_CHANGE, value);
  }

  _handleTypeAttendeeChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.TYPE_ATTENDEE_CHANGE, value);
  }

  _handleAcademicLevelChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.ACADEMIC_LEVEL_CHANGE, value);
  }

  _handleFacultyChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.FACULTY_CHANGE, value);
  }

  _handleProgramChange(value) {
    this._delegateToHandler(Constants.HANDLER_TYPES.PROGRAM_CHANGE, value);
  }

  /**
   * Delegar manejo a handler externo registrado
   * @private
   */
  _delegateToHandler(handlerType, value) {
    const handler = this.handlers.get(handlerType);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${handlerType}`);
    }
  }

  // ===============================
  // GESTIÓN DE HANDLERS EXTERNOS
  // ===============================

  /**
   * Registrar handler externo para un tipo de evento
   * @param {string} eventType - Tipo de evento
   * @param {Function} handler - Función manejadora
   */
  registerHandler(eventType, handler) {
    this.handlers.set(eventType, handler);
    this.logger.debug(`Handler registrado para: ${eventType}`);
  }

  /**
   * Verificar si un handler está registrado
   * @param {string} eventType - Tipo de evento
   * @returns {boolean}
   */
  hasHandler(eventType) {
    return this.handlers.has(eventType);
  }

  /**
   * Remover un handler específico
   * @param {string} eventType - Tipo de evento
   * @returns {boolean} - True si se removió
   */
  removeHandler(eventType) {
    const removed = this.handlers.delete(eventType);
    if (removed) {
      this.logger.debug(`Handler removido: ${eventType}`);
    }
    return removed;
  }

  /**
   * Limpiar todos los handlers
   */
  clearHandlers() {
    this.handlers.clear();
    this.logger.debug("🧹 Todos los handlers han sido limpiados");
  }

  /**
   * Obtener estadísticas de handlers registrados
   */
  getHandlerStats() {
    return {
      totalHandlers: this.handlers.size,
      registeredHandlers: Array.from(this.handlers.keys()),
      formElement: this.formElement ? "attached" : "detached",
    };
  }

  // ===============================
  // SISTEMA DE EVENTOS PERSONALIZADOS
  // ===============================

  /**
   * Suscribirse a un evento personalizado
   * @param {string} eventName - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando ocurra el evento
   * @returns {Function} - Función para desuscribirse
   */
  on(eventName, callback) {
    if (!this.customEvents.has(eventName)) {
      this.customEvents.set(eventName, []);
    }

    this.customEvents.get(eventName).push(callback);
    this.logger.debug(`Event listener agregado para evento: ${eventName}`);

    return () => this.off(eventName, callback);
  }

  /**
   * Desuscribirse de un evento personalizado
   * @param {string} eventName - Nombre del evento
   * @param {Function} callback - Función a remover
   */
  off(eventName, callback) {
    const listeners = this.customEvents.get(eventName);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
        this.logger.debug(`Event listener removido para evento: ${eventName}`);
      }
    }
  }

  /**
   * Suscribirse a un evento solo una vez
   * @param {string} eventName - Nombre del evento
   * @param {Function} callback - Función a ejecutar
   */
  once(eventName, callback) {
    const wrapper = (data) => {
      callback(data);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  /**
   * Emitir un evento personalizado
   * @param {string} eventName - Nombre del evento
   * @param {any} data - Datos del evento
   */
  emit(eventName, data) {
    const listeners = this.customEvents.get(eventName);
    if (listeners && listeners.length > 0) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.logger.error(`Error en listener del evento ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Remover todos los listeners de un evento
   * @param {string} eventName - Nombre del evento (opcional)
   */
  removeAllCustomListeners(eventName) {
    if (eventName) {
      this.customEvents.delete(eventName);
      this.logger.debug(`Todos los listeners removidos para evento: ${eventName}`);
    } else {
      this.customEvents.clear();
      this.logger.debug("Todos los custom event listeners removidos");
    }
  }

  /**
   * Obtener lista de eventos disponibles
   * @returns {Array<string>}
   */
  getAvailableEvents() {
    return [
      "fieldChanged", // CualqUier campo cambió
      "field:*:changed", // Campo específico cambió (ej: field:email:changed)
      "validationStateChanged", // Estado de validación cambió
      "fieldTouched", // Campo marcado como tocado
      "fieldVisibilityChanged", // Visibilidad de campo cambió
      "fieldDisabledChanged", // Estado habilitado/deshabilitado cambió
      "systemStateChanged", // Estado del sistema cambió
      "stateReset", // Formulario reseteado
    ];
  }

  /**
   * Obtener estadísticas de custom event listeners
   * @returns {Object}
   */
  getCustomEventStats() {
    const stats = {
      totalEvents: this.customEvents.size,
      events: {},
    };

    this.customEvents.forEach((listeners, eventName) => {
      stats.events[eventName] = listeners.length;
    });

    return stats;
  }

  // ===============================
  // UTILIDADES Y LIMPIEZA
  // ===============================

  /**
   * Remover todos los event listeners del formulario
   */
  removeAllListeners() {
    this.logger.info("🧹 Removiendo todos los event listeners");

    // Clonar el formulario para remover todos los listeners DOM
    const newForm = this.formElement.cloneNode(true);
    this.formElement.parentNode.replaceChild(newForm, this.formElement);
    this.formElement = newForm;

    // Limpiar event listeners personalizados
    this.customEvents.clear();

    this.logger.info("✅ Event listeners removidos");
  }

  /**
   * DestrUir la instancia y limpiar recursos
   */
  destroy() {
    this.removeAllListeners();
    this.clearHandlers();
    this.formElement = null;
    this.state = null;
    this.ui = null;

    this.logger.debug("Event destrUido");
  }

  // ===============================
  // MÉTODOS CONTROLADORES DE EVENTOS
  // (Reemplazan los métodos de UI.js)
  // ===============================

  /**
   * Agregar listener de input con limpieza automática
   * @param {string} selector - Selector del campo
   * @param {Function} cleanFunction - Función de limpieza (opcional)
   * @returns {HTMLElement|null} - Elemento configurado
   */
  addInputListener(selector, cleanFunction = null) {
    const element = this.ui.findElement(selector);
    if (!element) {
      this.logger.warn(`No se encontró elemento para input listener: ${selector}`);
      return null;
    }

    // Listener para marcar como tocado en focus
    element.addEventListener("focus", (e) => {
      const fieldName = e.target.name || e.target.id;
      if (fieldName && this.state) {
        this.state.markFieldAsTouched(fieldName);
      }
    });

    // Listener para validar en blur (cuando sale del campo)
    element.addEventListener("blur", (e) => {
      const fieldName = e.target.name || e.target.id;
      const value = this.ui.getFieldValue(e.target);
      
      if (fieldName && this.state) {
        // Si el campo está vacío y es requerido, ejecutar validación
        if (!value || value.trim() === '') {
          this.state.updateField(fieldName, value);
        }
      }
    });

    element.addEventListener("input", (e) => {
      let value = this.ui.getFieldValue(e.target);

      // Aplicar función de limpieza si existe
      if (cleanFunction) {
        value = cleanFunction(value);
        this.ui.setFieldValue(e.target, value);
      }

      // Actualizar estado y marcar como tocado
      const fieldName = e.target.name || e.target.id;
      if (fieldName && this.state) {
        this.state.markFieldAsTouched(fieldName);
        this.state.updateField(fieldName, value);
      }
    });

    this.logger.debug(`Input listener agregado para: ${selector}`);
    return element;
  }

  /**
   * Agregar listener de change
   * @param {string} selector - Selector del campo
   * @param {Function} callback - Función callback (opcional)
   * @returns {HTMLElement|null} - Elemento configurado
   */
  addChangeListener(selector, callback = null) {
    const element = this.ui.findElement(selector);
    if (!element) {
      this.logger.warn(`No se encontró elemento para change listener: ${selector}`);
      return null;
    }

    // Listener para marcar como tocado en focus
    element.addEventListener("focus", (e) => {
      const fieldName = e.target.name || e.target.id;
      if (fieldName && this.state) {
        this.state.markFieldAsTouched(fieldName);
      }
    });

    // Listener para validar en blur (cuando sale del campo)
    element.addEventListener("blur", (e) => {
      const fieldName = e.target.name || e.target.id;
      const value = this.ui.getFieldValue(e.target);
      
      if (fieldName && this.state) {
        // Si el campo está vacío y es requerido, ejecutar validación
        if (!value || value.trim() === '') {
          this.state.updateField(fieldName, value);
        }
      }
    });

    element.addEventListener("change", (e) => {
      const value = this.ui.getFieldValue(e.target);

      // Ejecutar callback personalizado
      if (callback) {
        callback(value, e.target);
      }

      // Actualizar estado y marcar como tocado
      const fieldName = e.target.name || e.target.id;
      if (fieldName && this.state) {
        this.state.markFieldAsTouched(fieldName);
        this.state.updateField(fieldName, value);
      }
    });

    this.logger.debug(`Change listener agregado para: ${selector}`);
    return element;
  }

  /**
   * Agregar listeners para grupo de radio buttons
   * @param {string} selector - Selector CSS para los radio buttons
   * @param {Function} callback - Función callback (opcional)
   * @returns {NodeList} - Lista de radio buttons configurados
   */
  addRadioListener(selector, callback = null) {
    const radioButtons = this.formElement.querySelectorAll(`input[type="radio"]${selector}`);

    if (radioButtons.length === 0) {
      this.logger.warn(`No se encontraron radio buttons para: ${selector}`);
      return [];
    }

    radioButtons.forEach((radio) => {
      // Listener para marcar como tocado en focus
      radio.addEventListener("focus", (e) => {
        const fieldName = e.target.name || e.target.id;
        if (fieldName && this.state) {
          this.state.markFieldAsTouched(fieldName);
        }
      });

      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          const value = this.ui.getFieldValue(e.target);

          // Ejecutar callback personalizado
          if (callback) {
            callback(value, e.target);
          }

          // Actualizar estado y marcar como tocado
          const fieldName = e.target.name || e.target.id;
          if (fieldName && this.state) {
            this.state.markFieldAsTouched(fieldName);
            this.state.updateField(fieldName, value);
          }
        }
      });
    });

    this.logger.debug(
      `Radio listeners agregados para: ${selector} (${radioButtons.length} elementos)`
    );
    return radioButtons;
  }
}
