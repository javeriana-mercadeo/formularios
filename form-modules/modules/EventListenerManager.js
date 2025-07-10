/**
 * EventListenerManager - Maneja todos los event listeners del formulario
 * Centraliza la configuración de eventos y simplifica el código del FormManager
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class EventListenerManager {
  // Constants for event handler types
  static HANDLER_TYPES = {
    COUNTRY_CHANGE: "countryChange",
    DEPARTMENT_CHANGE: "departmentChange", 
    TYPE_ATTENDEE_CHANGE: "typeAttendeeChange",
    ACADEMIC_LEVEL_CHANGE: "academicLevelChange",
    FACULTY_CHANGE: "facultyChange",
    AUTHORIZATION_CHANGE: "authorizationChange",
    FORM_SUBMIT: "formSubmit"
  };

  // Field selector mappings
  static FIELD_SELECTORS = {
    TEXT_FIELDS: {
      FIRST_NAME: "firstName",
      LAST_NAME: "lastName", 
      DOCUMENT: "document",
      PHONE: "phone"
    },
    SELECT_FIELDS: {
      TYPE_DOC: "typeDoc",
      EMAIL: "email",
      PHONE_CODE: "phoneCode",
      CITY: "city",
      ATTENDANCE_DAY: "attendanceDay",
      PROGRAM: "program",
      ADMISSION_PERIOD: "admissionPeriod"
    },
    SPECIAL_FIELDS: {
      COUNTRY: "country",
      DEPARTMENT: "department",
      TYPE_ATTENDEE: "typeAttendee"
    },
    ACADEMIC_FIELDS: {
      ACADEMIC_LEVEL: "academicLevel",
      FACULTY: "faculty"
    }
  };

  // State key mappings for form fields
  static STATE_KEYS = {
    TYPE_DOC: "type_doc",
    EMAIL: "email",
    PHONE_CODE: "phone_code",
    CITY: "city",
    ATTENDANCE_DAY: "attendance_day",
    PROGRAM: "program",
    ADMISSION_PERIOD: "admission_period"
  };

  // Text cleaning method mappings
  static CLEAN_METHODS = {
    TEXT: "cleanText",
    NUMBERS: "cleanNumbers"
  };

  constructor(formElement, stateManager, ui, inputSelectors, loggerConfig = {}) {
    this.formElement = formElement;
    this.stateManager = stateManager;
    this.ui = ui;
    this.inputSelectors = inputSelectors;
    this.logger = new Logger("EventListenerManager", loggerConfig);
    
    // External handlers that can be registered
    this.handlers = new Map();
  }

  /**
   * Registrar handler externo para un tipo de evento
   */
  registerHandler(eventType, handler) {
    this.handlers.set(eventType, handler);
  }

  /**
   * Configurar todos los event listeners del formulario
   */
  setupAllEventListeners() {
    this.logger.info("🎧 Configurando todos los event listeners...");
    
    this._setupTextInputListeners();
    this._setupSelectListeners();
    this._setupSpecialFieldListeners();
    this._setupAcademicFieldListeners();
    this._setupAuthorizationListener();
    this._setupSubmitListener();
    
    this.logger.info("✅ Event listeners configurados exitosamente");
  }

  /**
   * Configurar listeners para campos de texto
   */
  _setupTextInputListeners() {
    const textFields = [
      { selector: EventListenerManager.FIELD_SELECTORS.TEXT_FIELDS.FIRST_NAME, stateKey: 'first_name', cleanMethod: EventListenerManager.CLEAN_METHODS.TEXT },
      { selector: EventListenerManager.FIELD_SELECTORS.TEXT_FIELDS.LAST_NAME, stateKey: 'last_name', cleanMethod: EventListenerManager.CLEAN_METHODS.TEXT },
      { selector: EventListenerManager.FIELD_SELECTORS.TEXT_FIELDS.DOCUMENT, stateKey: 'document', cleanMethod: EventListenerManager.CLEAN_METHODS.NUMBERS },
      { selector: EventListenerManager.FIELD_SELECTORS.TEXT_FIELDS.PHONE, stateKey: 'phone', cleanMethod: EventListenerManager.CLEAN_METHODS.NUMBERS }
    ];

    textFields.forEach(({ selector, stateKey, cleanMethod }) => {
      this.ui.addInputListener(
        this.formElement, 
        this.inputSelectors[selector], 
        (value) => this._handleTextInput(value, stateKey, cleanMethod)
      );
    });
  }

  /**
   * Configurar listeners para campos de selección simples
   */
  _setupSelectListeners() {
    const selectFields = [
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.TYPE_DOC, stateKey: EventListenerManager.STATE_KEYS.TYPE_DOC },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.EMAIL, stateKey: EventListenerManager.STATE_KEYS.EMAIL },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.PHONE_CODE, stateKey: EventListenerManager.STATE_KEYS.PHONE_CODE },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.CITY, stateKey: EventListenerManager.STATE_KEYS.CITY },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.ATTENDANCE_DAY, stateKey: EventListenerManager.STATE_KEYS.ATTENDANCE_DAY },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.PROGRAM, stateKey: EventListenerManager.STATE_KEYS.PROGRAM },
      { selector: EventListenerManager.FIELD_SELECTORS.SELECT_FIELDS.ADMISSION_PERIOD, stateKey: EventListenerManager.STATE_KEYS.ADMISSION_PERIOD }
    ];

    selectFields.forEach(({ selector, stateKey }) => {
      this.ui.addChangeListener(
        this.formElement,
        this.inputSelectors[selector],
        (value) => this._handleSimpleSelect(value, stateKey)
      );
    });
  }

  /**
   * Configurar listeners para campos especiales (país, departamento)
   */
  _setupSpecialFieldListeners() {
    // País - requiere lógica especial para mostrar/ocultar departamentos
    this.ui.addChangeListener(
      this.formElement,
      this.inputSelectors[EventListenerManager.FIELD_SELECTORS.SPECIAL_FIELDS.COUNTRY],
      (value) => this._handleCountryChange(value)
    );

    // Departamento - requiere lógica especial para mostrar/ocultar ciudades  
    this.ui.addChangeListener(
      this.formElement,
      this.inputSelectors[EventListenerManager.FIELD_SELECTORS.SPECIAL_FIELDS.DEPARTMENT],
      (value) => this._handleDepartmentChange(value)
    );

    // Tipo de asistente - requiere lógica especial para campos académicos
    this.ui.addChangeListener(
      this.formElement,
      this.inputSelectors[EventListenerManager.FIELD_SELECTORS.SPECIAL_FIELDS.TYPE_ATTENDEE],
      (value) => this._handleTypeAttendeeChange(value)
    );
  }

  /**
   * Configurar listeners para campos académicos
   */
  _setupAcademicFieldListeners() {
    // Nivel académico
    this.ui.addChangeListener(
      this.formElement,
      this.inputSelectors[EventListenerManager.FIELD_SELECTORS.ACADEMIC_FIELDS.ACADEMIC_LEVEL],
      (value) => this._handleAcademicLevelChange(value)
    );

    // Facultad
    this.ui.addChangeListener(
      this.formElement,
      this.inputSelectors[EventListenerManager.FIELD_SELECTORS.ACADEMIC_FIELDS.FACULTY],
      (value) => this._handleFacultyChange(value)
    );
  }

  /**
   * Configurar listener para autorización
   */
  _setupAuthorizationListener() {
    this.ui.addRadioListener(
      this.formElement,
      this.inputSelectors.authorizationData,
      (value) => this._handleAuthorizationChange(value)
    );
  }

  /**
   * Configurar listener para envío del formulario
   */
  _setupSubmitListener() {
    this.formElement.addEventListener("submit", (e) => {
      this._handleFormSubmit(e);
    });
  }

  /**
   * Manejar entrada de texto con limpieza
   */
  _handleTextInput(value, stateKey, cleanMethod) {
    const cleanValue = this.ui[cleanMethod](value);
    this.stateManager.updateField(stateKey, cleanValue);
    return cleanValue;
  }

  /**
   * Manejar selección simple
   */
  _handleSimpleSelect(value, stateKey) {
    this.stateManager.updateField(stateKey, value);
  }

  /**
   * Manejar cambio de país (delegar al handler)
   */
  _handleCountryChange(value) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.COUNTRY_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.COUNTRY_CHANGE}`);
    }
  }

  /**
   * Manejar cambio de departamento (delegar al handler)
   */
  _handleDepartmentChange(value) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.DEPARTMENT_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.DEPARTMENT_CHANGE}`);
    }
  }

  /**
   * Manejar cambio de tipo de asistente (delegar al handler)
   */
  _handleTypeAttendeeChange(value) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.TYPE_ATTENDEE_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.TYPE_ATTENDEE_CHANGE}`);
    }
  }

  /**
   * Manejar cambio de nivel académico (delegar al handler)
   */
  _handleAcademicLevelChange(value) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.ACADEMIC_LEVEL_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.ACADEMIC_LEVEL_CHANGE}`);
    }
  }

  /**
   * Manejar cambio de facultad (delegar al handler)
   */
  _handleFacultyChange(value) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.FACULTY_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.FACULTY_CHANGE}`);
    }
  }

  /**
   * Manejar cambio de autorización (delegar al handler)
   */
  _handleAuthorizationChange(value) {
    this.stateManager.updateField('authorization_data', value);
    
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.AUTHORIZATION_CHANGE);
    if (handler) {
      handler(value);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.AUTHORIZATION_CHANGE}`);
    }
  }

  /**
   * Manejar envío del formulario (delegar al handler)
   */
  _handleFormSubmit(event) {
    const handler = this.handlers.get(EventListenerManager.HANDLER_TYPES.FORM_SUBMIT);
    if (handler) {
      handler(event);
    } else {
      this.logger.warn(`No hay handler registrado para ${EventListenerManager.HANDLER_TYPES.FORM_SUBMIT}`);
      event.preventDefault();
    }
  }

  /**
   * Remover todos los event listeners
   */
  removeAllListeners() {
    this.logger.info("🧹 Removiendo todos los event listeners");
    
    // Clonar el formulario para remover todos los listeners
    const newForm = this.formElement.cloneNode(true);
    this.formElement.parentNode.replaceChild(newForm, this.formElement);
    this.formElement = newForm;
    
    this.logger.info("✅ Event listeners removidos");
  }

  /**
   * Obtener estadísticas de handlers registrados
   */
  getHandlerStats() {
    return {
      totalHandlers: this.handlers.size,
      registeredHandlers: Array.from(this.handlers.keys()),
      formElement: this.formElement ? 'attached' : 'detached'
    };
  }

  /**
   * Verificar si un handler está registrado
   */
  hasHandler(eventType) {
    return this.handlers.has(eventType);
  }

  /**
   * Remover un handler específico
   */
  removeHandler(eventType) {
    const removed = this.handlers.delete(eventType);
    if (removed) {
      this.logger.info(`Handler removido: ${eventType}`);
    }
    return removed;
  }

  /**
   * Limpiar todos los handlers
   */
  clearHandlers() {
    this.handlers.clear();
    this.logger.info("🧹 Todos los handlers han sido limpiados");
  }
}