/**
 * FormManager - Gestor principal de formularios de eventos
 * Orquesta todos los módulos y gestiona el ciclo de vida del formulario
 * @version 1.0
 */

import { Validation } from "./Validation.js";
import { Data } from "./Data.js";
import { Service } from "./Service.js";
import { Ui } from "./Ui.js";
import { Logger } from "./Logger.js";
import { Config } from "./Config.js";
import { State } from "./State.js";
import { Event } from "./Event.js";
import { Academic } from "./Academic.js";
import { Locations } from "./Locations.js";
import { Constants } from "./Constants.js";

export class FormManager {
  constructor(selector, config = {}) {
    this.selector = selector;
    this.formElement = null;
    this.isInitialized = false;
    this.isSubmitting = false;

    // Inicializar gestores principales
    this._initializeManagers(config);

    // Inicializar módulos básicos
    this._initializeBasicModules();
  }

  // ===============================
  // INICIALIZACIÓN
  // ===============================

  /**
   * Inicializar el formulario y todos sus módulos
   */
  async init() {
    try {
      Logger.info(`Inicializando FormManager para: ${this.selector} (${this.config.eventName})`);

      await this._setupFormElement();
      await this._loadData();
      await this._setupModules();
      await this._configureForm();

      this.isInitialized = true;
      Logger.info("FormManager inicializado correctamente");

      // Callback personalizado
      if (this.config.callbacks?.onFormLoad) {
        this.config.callbacks.onFormLoad(this);
      }
    } catch (error) {
      Logger.error("Error al inicializar FormManager:", error);
      throw error;
    }
  }

  /**
   * DestrUir instancia y limpiar recursos
   */
  destroy() {
    if (this.Event) {
      this.Event.destroy();
    }

    this.formElement = null;
    this.isInitialized = false;

    Logger.info("FormManager destrUido");
  }

  // ===============================
  // GESTIÓN DE ESTADO Y DATOS
  // ===============================

  /**
   * Obtener datos del formulario
   */
  getFormData() {
    return this.stateManager.getFormData();
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return Config.getConfig();
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    Config.updateConfig(newConfig);
    this.config = Config.getConfig();

    if (this.isInitialized) {
      this._configureForm();
    }
  }

  /**
   * Limpiar formulario y resetear estado
   */
  reset() {
    this.formElement.reset();
    this.stateManager.reset();
    this.isSubmitting = false;
    this.Ui.clearAllErrors(this.formElement);
    this._setInitialFormValues();
  }

  // ===============================
  // MANEJADORES DE EVENTOS DE FORMULARIO
  // ===============================

  /**
   * Manejar cambio de tipo de asistente
   */

  /**
   * Alternar estado del botón de envío
   */
  toggleSubmitButton(enabled) {
    const submitBtn = this.formElement.querySelector(this.inputSelectors.submitButton);
    if (submitBtn) {
      submitBtn.disabled = !enabled;
      this.stateManager.setFieldDisabled("submit", !enabled);
    }
  }

  /**
   * Manejar envío del formulario
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) {
      Logger.warn("⚠️ Envío ya en progreso, ignorando intento adicional");
      return;
    }

    Logger.info("🚀 Iniciando proceso de envío del formulario");

    // Validación completa
    const formData = this.stateManager.getFormData();
    const validationResult = this.validator.validateFullForm(this.formElement, formData);

    if (!validationResult.isValid) {
      this._handleValidationErrors(validationResult.errors);
      return;
    }

    await this._processFormSubmission(formData);
  }

  // ===============================
  // CONFIGURACIÓN Y CONTROL
  // ===============================

  /**
   * Cambiar modo de depuración
   */
  setDebugMode(enabled) {
    this.stateManager.setDebugMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
    this._addHiddenFields();
  }

  /**
   * Cambiar modo de desarrollo
   */
  setDevMode(enabled) {
    this.stateManager.setDevMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
  }

  /**
   * Cambiar modo sandbox
   */
  setSandboxMode(enabled) {
    this.stateManager.setSandboxMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
    this._addHiddenFields();
  }

  // ===============================
  // MÉTODOS DE LOGGING
  // ===============================

  enableLogging() {
    Logger.enable();
  }
  disableLogging() {
    Logger.disable();
  }
  toggleLogging() {
    Logger.toggle();
  }
  setLogLevel(level) {
    Logger.setLevel(level);
  }
  getLoggingConfig() {
    return Logger.getLoggingConfig();
  }
  getLogs() {
    return Logger.getLogs();
  }
  clearLogs() {
    Logger.clearLogs();
  }
  getLoggingStats() {
    return Logger.getStats();
  }
  exportLogs(format = "json") {
    return Logger.exportLogs(format);
  }
  addLogListener(callback) {
    Logger.addListener(callback);
  }

  setLogPersistence(persist = true, maxLogs = 1000) {
    Config.updateConfig({
      logging: { persistLogs: persist, maxLogs: maxLogs },
    });
    Logger.info(
      `Persistencia de logs ${persist ? "habilitada" : "deshabilitada"} (max: ${maxLogs})`
    );
  }

  // ===============================
  // MÉTODOS PRIVADOS - INICIALIZACIÓN
  // ===============================

  /**
   * Inicializar gestores de configuración y estado
   * @private
   */
  _initializeManagers(config) {
    new Config(config, this.selector);
    new Logger();
    this.config = Config.getConfig();
    this.stateManager = new State();
  }

  /**
   * Inicializar módulos básicos del sistema
   * @private
   */
  _initializeBasicModules() {
    this.validator = new Validation({}, this.selector);
    this.Data = new Data(this.config.dataUrls, this.config.cacheEnabled);
    this.Service = new Service();
    this.Ui = new Ui();

    // Configurar selectores de campos
    this.inputSelectors = this._getInputSelectors();
  }

  /**
   * Configurar elemento del formulario
   * @private
   */
  async _setupFormElement() {
    this.formElement = document.getElementById(this.selector);
    if (!this.formElement) {
      throw new Error(`Formulario no encontrado: ${this.selector}`);
    }
  }

  /**
   * Cargar solo los datos necesarios basado en los campos presentes en el formulario
   * @private
   */
  async _loadData() {
    const { DATA_FILES } = Constants;
    const reqUiredData = this._detectReqUiredDataSources();
    Logger.info(`🎯 Cargando solo los datos necesarios: ${reqUiredData.join(", ")}`);

    const loadPromises = [];

    // Cargar datos basándose en campos detectados
    if (reqUiredData.includes(DATA_FILES.LOCATIONS)) {
      loadPromises.push(this.Data.loadLocations());
    }
    if (reqUiredData.includes(DATA_FILES.PREFIXES)) {
      loadPromises.push(this.Data.loadPrefixes());
    }
    if (reqUiredData.includes(DATA_FILES.PROGRAMS)) {
      loadPromises.push(this.Data.loadPrograms());
    }
    if (reqUiredData.includes(DATA_FILES.PERIODS)) {
      loadPromises.push(this.Data.loadPeriods());
    }
    if (reqUiredData.includes(DATA_FILES.UNIVERSITIES)) {
      loadPromises.push(this.Data.loadUniversity());
    }
    if (reqUiredData.includes(DATA_FILES.COLLEGES)) {
      loadPromises.push(this.Data.loadCollege());
    }

    // Cargar todos los datos requeridos en paralelo
    await Promise.allSettled(loadPromises);
  }

  /**
   * Detectar qué fuentes de datos son necesarias basado en los campos del formulario
   * @private
   * @returns {Array<string>} - Lista de fuentes de datos requeridas
   */
  _detectReqUiredDataSources() {
    const reqUiredData = [];
    const { DATA_FILES } = Constants;

    // Mapeo de campos del formulario a fuentes de datos
    const fieldToDataMapping = {
      // Ubicaciones (países, departamentos, ciudades)
      [Constants.SELECTORS.COUNTRY]: DATA_FILES.LOCATIONS,
      [Constants.SELECTORS.DEPARTMENT]: DATA_FILES.LOCATIONS,
      [Constants.SELECTORS.CITY]: DATA_FILES.LOCATIONS,

      // Códigos de teléfono
      [Constants.SELECTORS.PHONE_CODE]: DATA_FILES.PREFIXES,

      // Campos académicos
      [Constants.SELECTORS.ACADEMIC_LEVEL]: DATA_FILES.PROGRAMS,
      [Constants.SELECTORS.FACULTY]: DATA_FILES.PROGRAMS,
      [Constants.SELECTORS.PROGRAM]: DATA_FILES.PROGRAMS,

      // Períodos de admisión
      [Constants.SELECTORS.ADMISSION_PERIOD]: DATA_FILES.PERIODS,

      // Universidad
      [Constants.SELECTORS.UNIVERSITY]: DATA_FILES.UNIVERSITIES,

      // Colegio
      [Constants.SELECTORS.COLLEGE]: DATA_FILES.COLLEGES,
    };

    // Verificar qué campos existen en el formulario HTML
    Object.entries(fieldToDataMapping).forEach(([selector, dataSource]) => {
      const fieldExists = this.formElement.querySelector(selector);
      if (fieldExists && !reqUiredData.includes(dataSource)) {
        reqUiredData.push(dataSource);
      }
    });

    // Si no se detectaron fuentes de datos, cargar las básicas por defecto
    if (reqUiredData.length === 0) {
      Logger.warn("⚠️ No se detectaron campos específicos");
    }

    return reqUiredData;
  }

  /**
   * Configurar módulos especializados
   * @private
   */
  async _setupModules() {
    // Módulos especializados
    this.Event = new Event(this.formElement, this.stateManager, this.Ui, this.inputSelectors);

    // Módulo académico
    this.academic = new Academic(this.Data, this.Ui, this.stateManager, this.inputSelectors);

    // Módulo de ubicaciones
    this.locations = new Locations(this.Data, this.Ui, this.stateManager, this.inputSelectors);

    // Configurar Event en State
    this.stateManager.setEventManager(this.Event);

    // Registrar callbacks y handlers
    this._registerEventHandlers();
  }

  /**
   * Configurar formulario completo
   * @private
   */
  async _configureForm() {
    this._addHiddenFields();
    this._setInitialFormValues();
    this._initializeFormHiddenFields();
    this.academic.initializeAcademicFields();
    this.locations.initializeLocationFields();
    this.Event.setupAllEvents();
    this._setupValidation();
    this._processUrlParameters();
  }

  // ===============================
  // MÉTODOS PRIVADOS - CONFIGURACIÓN
  // ===============================

  /**
   * Obtener selectores de campos del formulario
   * @private
   */
  _getInputSelectors() {
    return {
      // Campos ocultos
      oid: Constants.SELECTORS.OID,
      retUrl: Constants.SELECTORS.RET_URL,
      debug: Constants.SELECTORS.DEBUG,
      debugEmail: Constants.SELECTORS.DEBUG_EMAIL,
      authorizationSource: Constants.SELECTORS.AUTHORIZATION_SOURCE,
      requestOrigin: Constants.SELECTORS.REQUEST_ORIGIN,
      leadSource: Constants.SELECTORS.LEAD_SOURCE,
      company: Constants.SELECTORS.COMPANY,

      // Campos personales
      firstName: Constants.SELECTORS.FIRST_NAME,
      lastName: Constants.SELECTORS.LAST_NAME,
      typeDoc: Constants.SELECTORS.TYPE_DOC,
      document: Constants.SELECTORS.DOCUMENT,
      email: Constants.SELECTORS.EMAIL,
      phoneCode: Constants.SELECTORS.PHONE_CODE,
      phone: Constants.SELECTORS.PHONE,

      // Campos de ubicación
      country: Constants.SELECTORS.COUNTRY,
      department: Constants.SELECTORS.DEPARTMENT,
      city: Constants.SELECTORS.CITY,

      // Campos académicos
      academicLevel: Constants.SELECTORS.ACADEMIC_LEVEL,
      faculty: Constants.SELECTORS.FACULTY,
      program: Constants.SELECTORS.PROGRAM,
      admissionPeriod: Constants.SELECTORS.ADMISSION_PERIOD,

      // Campos de evento
      typeAttendee: Constants.SELECTORS.TYPE_ATTENDEE,
      attendanceDay: Constants.SELECTORS.ATTENDANCE_DAY,
      college: Constants.SELECTORS.COLLEGE,
      university: Constants.SELECTORS.UNIVERSITY,
      authorizationData: Constants.SELECTORS.DATA_AUTHORIZATION,

      // Campos parámetros URL
      source: Constants.SELECTORS.SOURCE,
      subSource: Constants.SELECTORS.SUB_SOURCE,
      medium: Constants.SELECTORS.MEDIUM,
      campaign: Constants.SELECTORS.CAMPAIGN,
      article: Constants.SELECTORS.ARTICLE,
      eventName: Constants.SELECTORS.EVENT_NAME,
      eventDate: Constants.SELECTORS.EVENT_DATE,

      // Selectores especiales
      submitButton: Constants.SELECTORS.SUBMIT_BUTTON,
    };
  }

  /**
   * Añadir campos ocultos requeridos para Salesforce
   * @private
   */
  _addHiddenFields() {
    const { FIELDS, FIELD_MAPPING } = Constants;
    const env = this.stateManager.isSandboxMode() ? "test" : "prod";

    const fields = [
      {
        info: FIELD_MAPPING.OID.name,
        name: FIELD_MAPPING.OID.field,
        value: FIELD_MAPPING.OID.id[env],
      },
      {
        info: FIELD_MAPPING.RET_URL.name,
        name: FIELD_MAPPING.RET_URL.id,
        value: this.config.thankYouUrl,
      },
      {
        info: FIELD_MAPPING.DEBUG.name,
        name: FIELD_MAPPING.DEBUG.id,
        value: this.stateManager.getField(FIELDS.DEBUG),
      },
      {
        info: FIELD_MAPPING.DEBUG_EMAIL.name,
        name: FIELD_MAPPING.DEBUG_EMAIL.id,
        value: this.stateManager.isDebugMode() ? this.config.debugEmail : "",
      },
      {
        info: FIELD_MAPPING.AUTHORIZATION_SOURCE.name,
        name: FIELD_MAPPING.AUTHORIZATION_SOURCE.id[env],
        value: this.stateManager.getField(FIELDS.AUTHORIZATION_SOURCE),
      },
      {
        info: FIELD_MAPPING.REQUEST_ORIGIN.name,
        name: FIELD_MAPPING.REQUEST_ORIGIN.id[env],
        value: this.stateManager.getField(FIELDS.REQUEST_ORIGIN),
      },
      {
        info: FIELD_MAPPING.LEAD_SOURCE.name,
        name: FIELD_MAPPING.LEAD_SOURCE.id,
        value: this.stateManager.getField(FIELDS.LEAD_SOURCE),
      },
      {
        info: FIELD_MAPPING.COMPANY.name,
        name: FIELD_MAPPING.COMPANY.id[env],
        value: this.stateManager.getField(FIELDS.COMPANY),
      },

      // Campos que dependen de la configuración
      {
        info: FIELD_MAPPING.SOURCE.name,
        name: FIELD_MAPPING.SOURCE.id[env],
        value: this.stateManager.getField(FIELDS.SOURCE),
      },
      {
        info: FIELD_MAPPING.SUB_SOURCE.name,
        name: FIELD_MAPPING.SUB_SOURCE.id[env],
        value: this.stateManager.getField(FIELDS.SUB_SOURCE),
      },
      {
        info: FIELD_MAPPING.MEDIUM.name,
        name: FIELD_MAPPING.MEDIUM.id[env],
        value: this.stateManager.getField(FIELDS.MEDIUM),
      },
      {
        info: FIELD_MAPPING.CAMPAIGN.name,
        name: FIELD_MAPPING.CAMPAIGN.id[env],
        value: this.stateManager.getField(FIELDS.CAMPAIGN),
      },
      {
        info: FIELD_MAPPING.ARTICLE.name,
        name: FIELD_MAPPING.ARTICLE.id[env],
        value: this.stateManager.getField(FIELDS.ARTICLE),
      },
      {
        info: FIELD_MAPPING.EVENT_NAME.name,
        name: FIELD_MAPPING.EVENT_NAME.id[env],
        value: this.stateManager.getField(FIELDS.EVENT_NAME),
      },
      {
        info: FIELD_MAPPING.EVENT_DATE.name,
        name: FIELD_MAPPING.EVENT_DATE.id[env],
        value: this.stateManager.getField(FIELDS.EVENT_DATE),
      },
    ];

    fields
      .filter((field) => field.value)
      .forEach((field) => {
        if (field) {
          this.Ui.addHiddenField(this.formElement, field.name, field.value, field.info);
          this.stateManager.updateField(field.name, field.value);
        }
      });
  }

  /**
   * Establecer valores iniciales del formulario
   * @private
   */
  _setInitialFormValues() {
    const initialState = this.stateManager.getFormData();
    const allInputs = this.formElement.querySelectorAll("input, select, textarea");
    let appliedCount = 0;
    const fieldsToValidate = {};

    // Aplicar valores iniciales a los campos
    allInputs.forEach((element) => {
      const elementName = element.name || element.id;
      if (elementName && initialState.hasOwnProperty(elementName)) {
        const defaultValue = initialState[elementName];
        if (defaultValue || defaultValue === 0) {
          element.value = defaultValue;
          appliedCount++;

          // Recopilar para validación
          fieldsToValidate[elementName] = {
            element: element,
            value: defaultValue,
          };
        }
      }
    });

    // Delegar validación completa al Validation
    this.validator.validateInitialValues(fieldsToValidate, {
      skipHiddenFields: true,
      updateState: this.config.validation?.strictInitialValidation || false,
      stateManager: this.stateManager,
      Ui: this.Ui,
      appliedCount: appliedCount,
    });
  }

  /**
   * Inicializar campos del formulario con datos
   * @private
   */
  _initializeFormHiddenFields() {
    const fieldConfigs = [
      {
        selector: Constants.SELECTORS.PHONE_CODE,
        priorityItem: this.stateManager.getField(Constants.FIELDS.PHONE_CODE),
        options: this.Data.getPrefixes().map((prefix) => ({
          value: prefix.phoneCode,
          text: `${prefix.phoneCode} - ${prefix.phoneName}`,
        })),
      },
      {
        selector: Constants.SELECTORS.COUNTRY,
        priorityItem: this.stateManager.getField(Constants.FIELDS.COUNTRY),
        options: this.Data.getCountries().map((country) => ({
          value: country.code,
          text: country.name,
        })),
      },
      {
        selector: Constants.SELECTORS.TYPE_ATTENDEE,
        priorityItem: this.stateManager.getField(Constants.FIELDS.TYPE_ATTENDEE),
        options: this.config.typeAttendee,
      },
      {
        selector: Constants.SELECTORS.ATTENDANCE_DAY,
        priorityItem: this.stateManager.getField(Constants.FIELDS.ATTENDANCE_DAY),
        options: this.config.attendanceDays,
      },
    ];

    fieldConfigs.forEach((config) => {
      this.Ui.populateSelect({
        selector: config.selector,
        priorityItems: config.priorityItem,
        options: config.options,
      });
    });
  }

  /**
   * Configurar validación en tiempo real
   * @private
   */
  _setupValidation() {
    if (!this.config.validation?.realTimeValidation) return;

    const fields = this.formElement.querySelectorAll("input, select");
    fields.forEach((field) => {
      field.addEventListener("focus", () => {
        this.stateManager.markFieldAsTouched(field.id || field.name);
      });

      if (this.config.validation.showErrorsOnBlur) {
        field.addEventListener("blur", () => {
          this._validateField(field);
        });
      }
    });
  }

  /**
   * Procesar parámetros URL
   * @private
   */
  _processUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName =
      urlParams.get("event_name") || urlParams.get("nevento") || urlParams.get("evento");

    if (eventName) {
      this.stateManager.updateField(Constants.FIELDS.EVENT_NAME, eventName);
      this.Ui.setHiddenFieldValue(this.formElement, "event_name", eventName);
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - HANDLERS
  // ===============================

  /**
   * Registrar manejadores de eventos
   * @private
   */
  _registerEventHandlers() {
    const handlers = [
      [
        Constants.HANDLER_TYPES.COUNTRY_CHANGE,
        this.locations.handleCountryChange.bind(this.locations),
      ],
      [
        Constants.HANDLER_TYPES.DEPARTMENT_CHANGE,
        this.locations.handleDepartmentChange.bind(this.locations),
      ],
      [
        Constants.HANDLER_TYPES.TYPE_ATTENDEE_CHANGE,
        this.academic.handleTypeAttendeeChange.bind(this.academic),
      ],
      [
        Constants.HANDLER_TYPES.ACADEMIC_LEVEL_CHANGE,
        this.academic.handleAcademicLevelChange.bind(this.academic),
      ],
      [
        Constants.HANDLER_TYPES.FACULTY_CHANGE,
        this.academic.handleFacultyChange.bind(this.academic),
      ],
      [
        Constants.HANDLER_TYPES.PROGRAM_CHANGE,
        this.academic.handleProgramChange.bind(this.academic),
      ],
      [
        Constants.HANDLER_TYPES.AUTHORIZATION_CHANGE,
        (value) => {
          this.toggleSubmitButton(value === "1");
          this._handleAuthorizationUi(value);
        },
      ],
      [Constants.HANDLER_TYPES.FORM_SUBMIT, this.handleSubmit.bind(this)],
    ];

    handlers.forEach(([type, handler]) => {
      this.Event.registerHandler(type, handler);
    });
  }

  // ===============================
  // MÉTODOS PRIVADOS - LÓGICA DE NEGOCIO
  // ===============================

  /**
   * Manejar Ui de autorización
   * @private
   */
  _handleAuthorizationUi(value) {
    const errorAuthElement = this.formElement.querySelector('[data-puj-form="error_auth"]');
    if (errorAuthElement) {
      errorAuthElement.style.display = value === "0" ? "block" : "none";
      Logger.info(`${value === "0" ? "Showing" : "Hiding"} authorization error message`);
    }
  }

  /**
   * Validar campo individual
   * @private
   */
  _validateField(field) {
    const fieldName = field.id || field.name;
    if (this.stateManager.isFieldTouched(fieldName)) {
      const validationResult = this.validator.validateFieldWithRules(fieldName, field.value);

      if (!validationResult.isValid) {
        this.stateManager.setValidationError(fieldName, validationResult.error);
        this.Ui.showFieldError(field, validationResult.error);
      } else {
        this.stateManager.clearValidationError(fieldName);
        this.Ui.hideFieldError(field);
      }
    }
  }

  /**
   * Manejar errores de validación
   * @private
   */
  _handleValidationErrors(errors) {
    Logger.error(`❌ Formulario inválido. Errores: ${Object.keys(errors).length}`);

    Object.entries(errors).forEach(([fieldName, errorMessage]) => {
      const field = this.formElement.querySelector(`[name="${fieldName}"], [id="${fieldName}"]`);

      if (field) {
        this.stateManager.markFieldAsTouched(fieldName);
        this.stateManager.setValidationError(fieldName, errorMessage);
        this.Ui.showFieldError(field, errorMessage);
      } else {
        Logger.warn(`Campo con error no encontrado en DOM: ${fieldName}`);
      }
    });
  }

  /**
   * Procesar envío del formulario
   * @private
   */
  async _processFormSubmission(formData) {
    this.isSubmitting = true;
    this.stateManager.setSystemState("isSubmitting", true);

    const submitBtn = this.formElement.querySelector(this.inputSelectors.submitButton);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.dataset.loadingText || "Enviando...";
    }

    try {
      // Callback pre-envío
      if (this.config.callbacks?.onFormSubmit) {
        const shouldContinue = await this.config.callbacks.onFormSubmit(formData, this);
        if (!shouldContinue) {
          Logger.info("📋 Envío cancelado por callback personalizado");
          return;
        }
      }

      // Modo desarrollo
      if (this.stateManager.isDevMode()) {
        Logger.info("🔧 DEV_MODE: Simulando envío exitoso");
        Logger.debug("Datos que se enviarían:", formData);
        this.Ui.showSuccessMessage("Formulario enviado correctamente (modo desarrollo)");
        return;
      }

      // Envío real
      Logger.info("📡 Enviando datos a Salesforce...");
      const result = await this.Service.submitForm(this.formElement);

      Logger.info("✅ Formulario enviado exitosamente");
      if (this.config.callbacks?.onFormSuccess) {
        this.config.callbacks.onFormSuccess(result, this);
      }
    } catch (error) {
      Logger.error("❌ Error durante el envío:", error);

      if (this.config.callbacks?.onValidationError) {
        this.config.callbacks.onValidationError(error, this);
      }

      this.Ui.showErrorMessage("Error al enviar el formulario. Por favor, intente nuevamente.");
    } finally {
      this.isSubmitting = false;
      this.stateManager.setSystemState("isSubmitting", false);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Enviar";
      }
    }
  }
}
