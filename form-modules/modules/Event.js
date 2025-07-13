/**
 * Event - Maneja todos los event listeners del formulario
 * Centraliza la configuración de eventos DOM y sistema de eventos personalizados
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";

export class Event {
  constructor(formElement, stateManager, Ui, inputSelectors) {
    this.formElement = formElement;
    this.stateManager = stateManager;
    this.Ui = Ui;
    this.inputSelectors = inputSelectors;

    // External handlers para lógica específica del formulario
    this.handlers = new Map();

    // Custom event listeners para eventos de estado
    this.customEvents = new Map();

    // Configuración de campos del formulario desde Constants
    this.fieldConfigs = Constants.FIELD_CONFIGS;
  }

  // ===============================
  // CONFIGURACIÓN DE EVENT LISTENERS
  // ===============================

  /**
   * Configurar todos los event listeners del formulario
   */
  setupAllEvents() {
    Logger.info("🎧 Configurando todos los event listeners...");

    this._setupFormFieldListeners();
    this._setupSpecialFieldListeners();
    this._setupSubmitListener();

    Logger.info("✅ Event listeners configurados exitosamente");
  }

  /**
   * Configurar listeners para campos de formulario básicos
   * @private
   */
  _setupFormFieldListeners() {
    this.fieldConfigs.forEach((config) => {
      const selector = this.inputSelectors[config.selectorKey];
      if (!selector) {
        Logger.warn(`Selector no encontrado para: ${config.selectorKey}`);
        return;
      }

      if (config.type === "text") {
        this.Ui.addInputListener(this.formElement, selector, (value) =>
          this._handleTextInput(value, config.stateKey, config.cleanMethod)
        );
      } else if (config.type === "select") {
        this.Ui.addChangeListener(this.formElement, selector, (value) =>
          this._handleSimpleSelect(value, config.stateKey)
        );
      }
    });
  }

  /**
   * Configurar listeners para campos especiales que reqUieren lógica custom
   * @private
   */
  _setupSpecialFieldListeners() {
    const specialFields = [
      { selector: "country", handler: this._handleCountryChange.bind(this) },
      { selector: "department", handler: this._handleDepartmentChange.bind(this) },
      { selector: "typeAttendee", handler: this._handleTypeAttendeeChange.bind(this) },
      { selector: "academicLevel", handler: this._handleAcademicLevelChange.bind(this) },
      { selector: "faculty", handler: this._handleFacultyChange.bind(this) },
      { selector: "program", handler: this._handleProgramChange.bind(this) },
    ];

    specialFields.forEach(({ selector, handler }) => {
      const selectorValue = this.inputSelectors[selector];
      if (selectorValue) {
        this.Ui.addChangeListener(this.formElement, selectorValue, handler);
      }
    });

    // Listener especial para autorización (radio buttons)
    if (this.inputSelectors.authorizationData) {
      this.Ui.addRadioListener(
        this.formElement,
        this.inputSelectors.authorizationData,
        this._handleAuthorizationChange.bind(this)
      );
    }
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
    const cleanValue = this.Ui[cleanMethod](value);
    this.stateManager.updateField(stateKey, cleanValue);
    return cleanValue;
  }

  /**
   * Manejar selección simple
   * @private
   */
  _handleSimpleSelect(value, stateKey) {
    this.stateManager.updateField(stateKey, value);
  }

  /**
   * Manejar cambio de autorización
   * @private
   */
  _handleAuthorizationChange(value) {
    this.stateManager.updateField(Constants.FIELDS.DATA_AUTHORIZATION, value);
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
      Logger.warn(`No hay handler registrado para ${Constants.HANDLER_TYPES.FORM_SUBMIT}`);
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
      Logger.warn(`No hay handler registrado para ${handlerType}`);
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
    Logger.debug(`Handler registrado para: ${eventType}`);
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
      Logger.debug(`Handler removido: ${eventType}`);
    }
    return removed;
  }

  /**
   * Limpiar todos los handlers
   */
  clearHandlers() {
    this.handlers.clear();
    Logger.debug("🧹 Todos los handlers han sido limpiados");
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
    Logger.debug(`Event listener agregado para evento: ${eventName}`);

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
        Logger.debug(`Event listener removido para evento: ${eventName}`);
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
          Logger.error(`Error en listener del evento ${eventName}:`, error);
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
      Logger.debug(`Todos los listeners removidos para evento: ${eventName}`);
    } else {
      this.customEvents.clear();
      Logger.debug("Todos los custom event listeners removidos");
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
    Logger.info("🧹 Removiendo todos los event listeners");

    // Clonar el formulario para remover todos los listeners DOM
    const newForm = this.formElement.cloneNode(true);
    this.formElement.parentNode.replaceChild(newForm, this.formElement);
    this.formElement = newForm;

    // Limpiar event listeners personalizados
    this.customEvents.clear();

    Logger.info("✅ Event listeners removidos");
  }

  /**
   * DestrUir la instancia y limpiar recursos
   */
  destroy() {
    this.removeAllListeners();
    this.clearHandlers();
    this.formElement = null;
    this.stateManager = null;
    this.Ui = null;
    this.inputSelectors = null;

    Logger.debug("Event destrUido");
  }
}
