/**
 * FormManager - Gestor principal de formularios de eventos
 * Orquesta todos los módulos y gestiona el ciclo de vida del formulario
 * @version 1.0
 */

import { Validation } from "./Validation.js";
import { Data } from "./Data.js";
import { Service } from "./Service.js";
import { Ui } from "./UI.js";
import { Logger } from "./Logger.js";
import { Config } from "./Config.js";
import { State } from "./State.js";
import { Event } from "./Event.js";
import { Academic } from "./Academic.js";
import { Locations } from "./Locations.js";
import { UtmParameters } from "./UtmParameters.js";
import { Constants } from "./Constants.js";

export class FormManager {
  constructor(selector, config = {}) {
    this.selector = selector;
    this.isInitialized = false;
    this.isSubmitting = false;

    // Módulos
    this.config = new Config({ config, selector });
    this.logger = new Logger({ config: this.config.getLoggingConfig() });
    this.ui = new Ui({ config: this.config.getUiConfig(), logger: this.logger });
    this.validator = new Validation({ logger: this.logger });

    this.state = new State({
      config: this.config,
      ui: this.ui,
      validator: this.validator,
      logger: this.logger,
      formElement: this.ui.getFormContext(),
      event: null, // Se asignará después de crear el Event
    });

    this.event = new Event({
      formElement: this.ui.getFormContext(),
      state: this.state,
      ui: this.ui,
      logger: this.logger,
    });

    this.state.setEventManager(this.event); // Configurar Event en State

    this.data = new Data({
      cache: this.config.getConfig().cache,
      urls: this.config.getConfig().urls,
      logger: this.logger,
    });

    this.service = new Service({
      config: this.config,
      logger: this.logger,
    });

    this.formElement = this.ui.getFormContext();
  }

  // ===============================
  // INICIALIZACIÓN
  // ===============================

  /**
   * Inicializar el formulario y todos sus módulos
   */
  async initialize() {
    try {
      this.logger.info(
        `Inicializando FormManager para: ${this.selector} (${this.config.getConfig().eventName})`
      );

      await this._loadData();
      await this._setupModules();
      await this._configureForm();

      this.isInitialized = true;
      this.logger.info("FormManager inicializado correctamente");

      // Callback personalizado
      if (this.config.callbacks?.onFormLoad) {
        this.config.callbacks.onFormLoad(this);
      }
    } catch (error) {
      this.logger.error("Error al inicializar FormManager:", error);
      throw error;
    }
  }

  /**
   * DestrUir instancia y limpiar recursos
   */
  destroy() {
    if (this.event) {
      this.event.destroy();
    }

    // Limpiar animaciones de flechas
    if (this.ui && typeof this.ui.cleanupSelectArrowAnimations === "function") {
      this.ui.cleanupSelectArrowAnimations();
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
    return this.state.getFormData();
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
    this.state.reset();
    this.isSubmitting = false;
    this.ui.clearAllErrors(this.formElement);
    this._setInitialFormValues();
  }

  // ===============================
  // MANEJADORES DE EVENTOS DE FORMULARIO
  // ===============================

  /**
   * Alternar estado del botón de envío
   */
  toggleSubmitButton(enabled) {
    const { exists, element: submitBtn } = this.ui.checkElementExists(
      Constants.SELECTORS.SUBMIT_BUTTON
    );
    if (exists && submitBtn) {
      submitBtn.disabled = !enabled;
      this.state.setFieldDisabled("submit", !enabled);
    }
  }

  /**
   * Manejar envío del formulario
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) {
      this.logger.warn("⚠️ Envío ya en progreso, ignorando intento adicional");
      return;
    }

    this.logger.info("🚀 Iniciando proceso de envío del formulario");

    // Validación completa del formulario
    const rawFormData = this.state.getFormData();
    const validationResult = this.validator.validateFormComplete(this.formElement, rawFormData);

    if (!validationResult.isValid) {
      this._handleMissingRequiredFields(validationResult.missingFields);
      this._handleValidationErrors(validationResult.errors);
      this.ui.showGeneralError("Por favor completa todos los campos requeridos");
      return;
    }

    // 3. Filtrar campos vacíos antes del envío
    const formData = this._filterEmptyFields(rawFormData);
    console.log(formData);

    await this._processFormSubmission(formData);
  }

  // ===============================
  // CONFIGURACIÓN Y CONTROL
  // ===============================

  /**
   * Cambiar modo de depuración
   */
  setDebugMode(enabled) {
    this.state.setDebugMode(enabled);
    this.config = Config.getConfig();
    this._addHiddenFields();
  }

  /**
   * Cambiar modo de desarrollo
   */
  setDevelopmentMode(enabled) {
    this.state.setDevelopmentMode(enabled);
    this.config = Config.getConfig();
  }

  /**
   * Cambiar modo sandbox
   */
  setTestMode(enabled) {
    this.state.setTestMode(enabled);
    this.config = Config.getConfig();
    this._addHiddenFields();
  }

  // ===============================
  // MÉTODOS UTM
  // ===============================

  /**
   * Re-procesar parámetros UTM de la URL
   * @returns {Object} - Resumen del procesamiento
   */
  refreshUtmParameters() {
    return this.utmParameters.processUrlParameters();
  }

  /**
   * Obtener parámetro UTM específico
   * @param {string} paramName - Nombre del parámetro
   * @returns {string|null} - Valor del parámetro
   */
  getUtmParameter(paramName) {
    return this.utmParameters.getUtmParameter(paramName);
  }

  /**
   * Obtener todos los parámetros UTM
   * @returns {Object} - Objeto con todos los parámetros UTM
   */
  getAllUtmParameters() {
    return this.utmParameters.getAllUtmParameters();
  }

  /**
   * Verificar si hay parámetros UTM en la URL
   * @returns {boolean} - True si hay parámetros UTM
   */
  hasUtmParameters() {
    return this.utmParameters.hasUtmParameters();
  }

  /**
   * Generar URL con parámetros UTM del estado actual
   * @param {string} baseUrl - URL base (opcional)
   * @returns {string} - URL con parámetros UTM
   */
  generateUtmUrl(baseUrl = null) {
    return this.utmParameters.generateUtmUrl(baseUrl);
  }

  // ===============================
  // MÉTODOS DE LOGGING
  // ===============================

  enableLogging() {
    this.logger.enable();
  }
  disableLogging() {
    this.logger.disable();
  }
  toggleLogging() {
    this.logger.toggle();
  }
  setLogLevel(level) {
    this.logger.setLevel(level);
  }
  getLoggingConfig() {
    return this.logger.getLoggingConfig();
  }
  addLogListener(callback) {
    this.logger.addListener(callback);
  }

  // ===============================
  // MÉTODOS PRIVADOS - INICIALIZACIÓN
  // ===============================

  /**
   * Cargar solo los datos necesarios basado en los campos presentes en el formulario
   * @private
   */
  async _loadData() {
    const { DATA_FILES } = Constants;
    const reqUiredData = this._detectReqUiredDataSources();
    this.logger.info(`🎯 Cargando solo los datos necesarios: ${reqUiredData.join(", ")}`);

    const loadPromises = [];

    // Cargar datos basándose en campos detectados
    if (reqUiredData.includes(DATA_FILES.LOCATIONS)) {
      loadPromises.push(this.data.loadLocations());
    }
    if (reqUiredData.includes(DATA_FILES.PREFIXES)) {
      loadPromises.push(this.data.loadPrefixes());
    }
    if (reqUiredData.includes(DATA_FILES.PROGRAMS)) {
      loadPromises.push(this.data.loadPrograms());
    }
    if (reqUiredData.includes(DATA_FILES.PERIODS)) {
      loadPromises.push(this.data.loadPeriods());
    }
    if (reqUiredData.includes(DATA_FILES.UNIVERSITIES)) {
      loadPromises.push(this.data.loadUniversity());
    }
    if (reqUiredData.includes(DATA_FILES.COLLEGES)) {
      loadPromises.push(this.data.loadCollege());
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
      const { exists } = this.ui.checkElementExists(selector);
      if (exists && !reqUiredData.includes(dataSource)) {
        reqUiredData.push(dataSource);
      }
    });

    // Si no se detectaron fuentes de datos, cargar las básicas por defecto
    if (reqUiredData.length === 0) {
      this.logger.warn("⚠️ No se detectaron campos específicos");
    }

    return reqUiredData;
  }

  /**
   * Configurar módulos especializados
   * @private
   */
  async _setupModules() {
    // Módulo académico - IMPORTANTE: pasar configuración para filtros
    this.academic = new Academic(this.data, this.ui, this.state, this.logger, this.config);

    // Módulo de ubicaciones - IMPORTANTE: pasar configuración para filtros
    this.locations = new Locations(this.data, this.ui, this.state, this.logger, this.config);

    // Módulo de parámetros UTM
    this.utmParameters = new UtmParameters(this.formElement, this.state, this.ui, this.logger);

    // Registrar callbacks y handlers
    this._registerEventHandlers();
  }

  /**
   * Configurar formulario completo
   * @private
   */
  async _configureForm() {
    this._initializeModes();
    this._addHiddenFields();
    this._initializeFormHiddenFields();
    this.academic.initializeAcademicFields();
    this.locations.initializeLocationFields();
    // Establecer valores iniciales DESPUÉS de que se hayan poblado los selects
    this._setInitialFormValues();
    this.event.setupAllEvents();
    this._setupStateValidation();
    this._processUrlParameters();
    this._initializeSelectArrowAnimations();

    // Configurar form action con la URL correcta según el modo
    const isSandboxMode = this.state.isTestMode();
    const salesforceUrl = this._getSalesforceUrl(isSandboxMode);
    this.formElement.action = salesforceUrl;
    this.formElement.method = "POST";
    this.formElement.enctype = "multipart/form-data";

    this.logger.info(`🔗 Form action configurado: ${salesforceUrl}`);
    this.logger.info(`📝 Modo sandbox: ${isSandboxMode ? "SÍ" : "NO"}`);
  }

  // ===============================
  // MÉTODOS PRIVADOS - CONFIGURACIÓN
  // ===============================

  /**
   * Inicializar modos desde la configuración
   * @private
   */
  _initializeModes() {
    const config = this.config.getConfig();

    if (config.development) {
      this.state.setDevelopmentMode(config.development);
      this.logger.info(`development configurado: ${config.development}`);
      this.logger.warn("ADVERTENCIA: development está ACTIVO - Los formularios NO se enviarán");
    }

    if (config.debug) {
      this.state.setDebugMode(config.debug);
      this.logger.info(`DebugMode configurado: ${config.debug}`);
    }

    if (config.test !== undefined) {
      this.state.setTestMode(config.test);
      this.logger.info(`TestMode configurado: ${config.test}`);
    }

    // Log final del estado de modos
    this.logger.info(
      `🔍 Estado final de modos - Desarrollo: ${this.state.isDevMode()}, Test: ${this.state.isTestMode()}, Debug: ${this.state.isDebugMode()}`
    );
  }

  /**
   * Añadir campos ocultos requeridos para Salesforce
   * @private
   */
  _addHiddenFields() {
    const { FIELDS, FIELD_MAPPING } = Constants;
    const config = this.config.getConfig();

    const fields = [
      {
        info: FIELD_MAPPING.OID.name,
        name: FIELD_MAPPING.OID.field,
        value: this.state.isTestMode() ? "00D7j0000004eQD" : "00Df4000003l8Bf",
      },
      {
        info: FIELD_MAPPING.RET_URL.name,
        name: FIELD_MAPPING.RET_URL.field,
        value: config.retUrl,
      },
      {
        info: FIELD_MAPPING.DEBUG.name,
        name: FIELD_MAPPING.DEBUG.field,
        value: this.state.isDebugMode() ? "1" : "0",
      },
      {
        info: FIELD_MAPPING.DEBUG_EMAIL.name,
        name: FIELD_MAPPING.DEBUG_EMAIL.field,
        value: this.state.isDebugMode() ? config.debugEmail : "",
      },
      {
        info: FIELD_MAPPING.AUTHORIZATION_SOURCE.name,
        name: FIELD_MAPPING.AUTHORIZATION_SOURCE.field,
        value: this.state.getField(FIELDS.AUTHORIZATION_SOURCE),
      },
      {
        info: FIELD_MAPPING.REQUEST_ORIGIN.name,
        name: FIELD_MAPPING.REQUEST_ORIGIN.field,
        value: this.state.getField(FIELDS.REQUEST_ORIGIN),
      },
      {
        info: FIELD_MAPPING.LEAD_SOURCE.name,
        name: FIELD_MAPPING.LEAD_SOURCE.field,
        value: this.state.getField(FIELDS.LEAD_SOURCE),
      },
      {
        info: FIELD_MAPPING.COMPANY.name,
        name: FIELD_MAPPING.COMPANY.field,
        value: this.state.getField(FIELDS.COMPANY),
      },

      // Campos que dependen de la configuración
      {
        info: FIELD_MAPPING.SOURCE.name,
        name: FIELD_MAPPING.SOURCE.field,
        value: this.state.getField(FIELDS.SOURCE),
      },
      {
        info: FIELD_MAPPING.SUB_SOURCE.name,
        name: FIELD_MAPPING.SUB_SOURCE.field,
        value: this.state.getField(FIELDS.SUB_SOURCE),
      },
      {
        info: FIELD_MAPPING.MEDIUM.name,
        name: FIELD_MAPPING.MEDIUM.field,
        value: this.state.getField(FIELDS.MEDIUM),
      },
      {
        info: FIELD_MAPPING.CAMPAIGN.name,
        name: FIELD_MAPPING.CAMPAIGN.field,
        value: this.state.getField(FIELDS.CAMPAIGN),
      },
      {
        info: FIELD_MAPPING.ARTICLE.name,
        name: FIELD_MAPPING.ARTICLE.field,
        value: this.state.getField(FIELDS.ARTICLE),
      },
      {
        info: FIELD_MAPPING.EVENT_NAME.name,
        name: FIELD_MAPPING.EVENT_NAME.field,
        value: this.state.getField(FIELDS.EVENT_NAME),
      },
      {
        info: FIELD_MAPPING.EVENT_DATE.name,
        name: FIELD_MAPPING.EVENT_DATE.field,
        value: this.state.getField(FIELDS.EVENT_DATE),
      },
    ];

    fields
      .filter((field) => field.value)
      .forEach((field) => {
        if (field) {
          this.ui.addHiddenField(this.formElement, field.name, field.value, field.info);
          this.state.updateField(field.name, field.value);
        }
      });
  }

  /**
   * Establecer valores iniciales del formulario
   * @private
   */
  _setInitialFormValues() {
    const initialState = this.state.getFormData();
    const allInputs = this.formElement.querySelectorAll("input, select, textarea");
    let appliedCount = 0;
    const fieldsToValidate = {};

    // Aplicar valores iniciales a los campos
    allInputs.forEach((element) => {
      const elementName = element.name || element.id;
      if (elementName && initialState.hasOwnProperty(elementName)) {
        const defaultValue = initialState[elementName];
        if (defaultValue || defaultValue === 0) {
          this.ui.setFieldValue(element, defaultValue);
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
      updateState: true,
      stateManager: this.state,
      Ui: this.ui,
      appliedCount: appliedCount,
    });
  }

  /**
   * Inicializar campos del formulario con datos
   * @private
   */
  _initializeFormHiddenFields() {
    const { config } = this.config;
    const fieldConfigs = [
      {
        selector: Constants.SELECTORS.PHONE_CODE,
        priorityItem: this.state.getField(Constants.FIELDS.PHONE_CODE),
        options: this.data.getPrefixes().map((prefix) => ({
          value: prefix.phoneCode,
          text: `${prefix.phoneCode} - ${prefix.phoneName}`,
        })),
      },
      {
        selector: Constants.SELECTORS.COUNTRY,
        priorityItem: this.state.getField(Constants.FIELDS.COUNTRY),
        options: this.locations.getFilteredCountries(),
      },
      {
        selector: Constants.SELECTORS.TYPE_ATTENDEE,
        priorityItem: this.state.getField(Constants.FIELDS.TYPE_ATTENDEE),
        options: config.typeAttendee,
      },
      {
        selector: Constants.SELECTORS.ATTENDANCE_DAY,
        priorityItem: this.state.getField(Constants.FIELDS.ATTENDANCE_DAY),
        options: config.attendanceDays,
      },
    ];

    fieldConfigs.forEach((config) => {
      this.ui.populateSelect({
        selector: config.selector,
        priorityItems: config.priorityItem,
        options: config.options,
      });
    });

    // Manejar auto-selección de tipo de asistente "Aspirante"
    this._handleTypeAttendeeAutoSelection();
  }

  /**
   * Manejar auto-selección automática cuando solo hay "Aspirante" como opción
   * @private
   */
  _handleTypeAttendeeAutoSelection() {
    const { config } = this.config;
    const typeAttendeeOptions = config.typeAttendee || [];

    // Verificar si solo hay "Aspirante" como opción
    const aspiranteValue = Constants.ATTENDEE_TYPES.APPLICANT;
    const hasOnlyAspiranteOption =
      typeAttendeeOptions.length === 1 && typeAttendeeOptions.includes(aspiranteValue);

    if (hasOnlyAspiranteOption) {
      this.logger.info(`🔧 Auto-seleccionando único tipo de asistente: ${aspiranteValue}`);

      // Actualizar el estado con "Aspirante"
      this.state.updateField(Constants.FIELDS.TYPE_ATTENDEE, aspiranteValue);

      // Ocultar el campo de tipo de asistente si existe
      const typeAttendeeElement = this.ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
      if (typeAttendeeElement) {
        this.ui.setFieldValue(typeAttendeeElement, aspiranteValue);
        this.state.setFieldVisibility(Constants.FIELDS.TYPE_ATTENDEE, false);
        this.logger.info(`👁️ Campo tipo de asistente ocultado y preseleccionado`);
      }

      // Mostrar automáticamente los campos académicos
      this.logger.info(`🎓 Mostrando automáticamente campos académicos para Aspirante`);
      this.academic.handleTypeAttendeeChange(aspiranteValue);
    } else {
      this.logger.info(
        `📋 Múltiples tipos de asistente disponibles (${typeAttendeeOptions.length}), mostrando selector normal`
      );
    }
  }

  /**
   * Configurar validación automática en State
   * @private
   */
  _setupStateValidation() {
    // Configurar dependencias de validación en State
    this.state.setValidationDependencies({
      validator: this.validator,
      ui: this.ui,
      formElement: this.formElement,
    });

    // Configurar validación automática
    this.state.setupAutoValidation(this.config.validation || {});

    this.logger.info("🔧 Validación automática configurada en State:", this.config.validation);
  }

  /**
   * Procesar parámetros URL usando el módulo UTM
   * @private
   */
  _processUrlParameters() {
    this.logger.info("🔗 Procesando parámetros URL con módulo UTM");

    // Usar el módulo UTM para procesar todos los parámetros
    const summary = this.utmParameters.processUrlParameters();

    // Log del resumen
    if (summary.updated > 0) {
      this.logger.info(`✅ ${summary.updated} parámetros UTM aplicados al formulario`);
    }

    return summary;
  }

  /**
   * Inicializar animaciones de flechas para elementos select
   * @private
   */
  _initializeSelectArrowAnimations() {
    this.logger.info("🎯 Inicializando animaciones de flechas para elementos select");

    if (this.ui && typeof this.ui.initializeSelectArrowAnimations === "function") {
      this.ui.initializeSelectArrowAnimations();
    } else {
      this.logger.warn(
        "⚠️ UI module no disponible o método initializeSelectArrowAnimations no encontrado"
      );
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
      this.event.registerHandler(type, handler);
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
    const errorAuthElement = this.ui.scopedQuery('[data-puj-form="error_auth"]');
    if (errorAuthElement) {
      if (value === "0") {
        this.ui.showElement(errorAuthElement);
      } else {
        this.ui.hideElement(errorAuthElement);
      }
      this.logger.info(`${value === "0" ? "Showing" : "Hiding"} authorization error message`);
    }
  }

  /**
   * Manejar errores de validación
   * @private
   */
  _handleValidationErrors(errors) {
    this.logger.error(`❌ Formulario inválido. Errores: ${Object.keys(errors).length}`);

    Object.entries(errors).forEach(([fieldName, errorMessage]) => {
      console.log(fieldName);

      const { exists, element: field } = this.ui.checkElementExists(
        `[name="${fieldName}"], [id="${fieldName}"]`
      );

      if (exists && field) {
        this.state.markFieldAsTouched(fieldName);
        this.state.setValidationError(fieldName, errorMessage);
        this.ui.showFieldError(field, errorMessage);
      } else {
        this.logger.warn(`Campo con error no encontrado en DOM: ${fieldName}`);
      }
    });
  }

  /**
   * Manejar campos requeridos faltantes
   * @private
   * @param {Array} missingFields - Lista de campos faltantes del módulo Validation
   */
  _handleMissingRequiredFields(missingFields) {
    missingFields.forEach((fieldInfo) => {
      const { name, element, message } = fieldInfo;

      // Marcar el campo como tocado y mostrar error
      this.state.markFieldAsTouched(name);
      this.state.setValidationError(name, message);
      this.ui.showFieldError(element, message);

      this.logger.debug(`Campo requerido faltante: ${name} - ${message}`);
    });
  }

  /**
   * Filtrar campos vacíos, null o undefined antes del envío
   * @private
   * @param {Object} formData - Datos del formulario sin filtrar
   * @returns {Object} - Datos del formulario filtrados
   */
  _filterEmptyFields(formData) {
    const filteredData = {};
    let filteredCount = 0;
    const originalCount = Object.keys(formData).length;

    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      // Incluir el campo si tiene un valor válido
      const isValidValue =
        fieldValue !== null &&
        fieldValue !== undefined &&
        fieldValue !== "" &&
        (typeof fieldValue !== "string" || fieldValue.trim() !== "");

      if (isValidValue) {
        filteredData[fieldName] = fieldValue;
      } else {
        filteredCount++;
        this.logger.debug(`Campo filtrado (vacío): ${fieldName} = "${fieldValue}"`);
      }
    });

    this.logger.info(
      `🧹 Campos filtrados: ${filteredCount} campos vacíos removidos de ${originalCount} total`
    );
    this.logger.debug(
      `📊 Campos que se enviarán: ${Object.keys(filteredData).length}`,
      Object.keys(filteredData)
    );

    return filteredData;
  }

  /**
   * Registrar detalles del envío del formulario en formato tabla
   * @private
   * @param {Object} formData - Datos del formulario
   * @param {string} mode - Modo de envío (DEV_MODE, PRODUCTION, etc.)
   */
  _logFormSubmissionDetails(formData, mode) {
    // Preparar datos del formulario (solo datos enviados)
    const formTableData = [];

    // Agregar campos del formulario
    Object.entries(formData).forEach(([fieldName, fieldValue]) => {
      const fieldElement = this.formElement.querySelector(`[name="${fieldName}"]`);
      const fieldLabel = this._getFieldLabel(fieldName, fieldElement);
      const fieldId = fieldElement ? fieldElement.id || fieldName : fieldName;
      
      // Para modo dev, mostrar el name del FIELD_MAPPING en lugar del fieldName
      let displayName = fieldName;
      if (this.state.isDevMode()) {
        // Buscar el name en FIELD_MAPPING
        const fieldMapping = Object.values(Constants.FIELD_MAPPING).find(
          (mapping) => {
            // Buscar por field
            if (mapping.field === fieldName) return true;
            // Buscar por ID
            if (typeof mapping.id === 'string' && mapping.id === fieldName) return true;
            if (typeof mapping.id === 'object' && mapping.id.test && mapping.id.prod) {
              return mapping.id.test === fieldName || mapping.id.prod === fieldName;
            }
            return false;
          }
        );
        
        if (fieldMapping && fieldMapping.name) {
          displayName = fieldMapping.name;
        }
      }

      formTableData.push({
        "Campo (Label)": fieldLabel,
        "Campo (Name)": displayName,
        "Campo (ID)": fieldId,
        Valor: fieldValue,
      });
    });

    // Preparar datos del estado
    const stateTableData = [];
    const metadata = {
      "Modo de envío": mode,
      Timestamp: new Date().toISOString(),
      "Total de campos": Object.keys(formData).length,
      "Form ID": this.formElement.id || "N/A",
      "Form Action": this.formElement.action || "N/A",
      "Modo Dev": this.state.isDevMode(),
      "Modo Sandbox": this.state.isTestMode(),
    };

    // Agregar metadatos del estado
    Object.entries(metadata).forEach(([key, value]) => {
      stateTableData.push({
        Propiedad: key,
        Valor: value,
      });
    });

    // Mostrar tabla de datos del formulario
    this.logger.table("📋 Datos enviados del formulario", formTableData);

    // Mostrar tabla de datos del estado
    this.logger.table("⚙️ Estado del sistema", stateTableData);

    // Log adicional con resumen
    this.logger.debug(
      `📊 Resumen: ${Object.keys(formData).length} campos enviados en modo ${mode}`
    );
  }

  /**
   * Obtener ID del campo según el entorno (test/prod)
   * @private
   * @param {string} fieldName - Nombre del campo
   * @returns {string} ID del campo o el nombre si no se encuentra
   */
  _getFieldId(fieldName) {
    // Buscar el campo en FIELD_MAPPING por su field value
    const fieldMapping = Object.values(Constants.FIELD_MAPPING).find(
      (mapping) => mapping.field === fieldName
    );

    if (!fieldMapping) {
      return fieldName; // Si no se encuentra en el mapeo, devolver el nombre original
    }

    // Si el ID es un objeto con test/prod, usar el ambiente apropiado
    if (typeof fieldMapping.id === "object" && fieldMapping.id.test && fieldMapping.id.prod) {
      const isSandbox = this.state.isTestMode();
      return isSandbox ? fieldMapping.id.test : fieldMapping.id.prod;
    }

    // Si es un string simple, devolverlo
    return fieldMapping.id;
  }

  /**
   * Obtener etiqueta legible para un campo
   * @private
   * @param {string} fieldName - Nombre del campo
   * @param {HTMLElement} fieldElement - Elemento del campo
   * @returns {string} Etiqueta legible
   */
  _getFieldLabel(fieldName, fieldElement) {
    // Primero intentar obtener el nombre del FIELD_MAPPING por el campo (field)
    let fieldMapping = Object.values(Constants.FIELD_MAPPING).find(
      (mapping) => mapping.field === fieldName
    );

    // Si no se encuentra por field, intentar buscar por ID
    if (!fieldMapping) {
      fieldMapping = Object.values(Constants.FIELD_MAPPING).find(
        (mapping) => {
          // Verificar si el ID es un string simple
          if (typeof mapping.id === 'string') {
            return mapping.id === fieldName;
          }
          // Verificar si el ID es un objeto con test/prod
          if (typeof mapping.id === 'object' && mapping.id.test && mapping.id.prod) {
            return mapping.id.test === fieldName || mapping.id.prod === fieldName;
          }
          return false;
        }
      );
    }

    if (fieldMapping && fieldMapping.name) {
      return fieldMapping.name;
    }

    // Mapeo de respaldo para campos que no estén en FIELD_MAPPING
    const fieldLabels = {
      // Campos UTM que pueden no estar en FIELD_MAPPING
      utm_source: "UTM Source",
      utm_subsource: "UTM Subsource",
      utm_medium: "UTM Medium",
      utm_campaign: "UTM Campaign",
      utm_article: "UTM Article",
      utm_eventname: "UTM Event Name",
      utm_eventdate: "UTM Event Date",
    };

    // Intentar obtener la etiqueta del mapeo de respaldo
    if (fieldLabels[fieldName]) {
      return fieldLabels[fieldName];
    }

    // Intentar obtener el label asociado desde el DOM
    if (fieldElement) {
      const labelElement = this.formElement.querySelector(`label[for="${fieldElement.id}"]`);
      if (labelElement && labelElement.textContent.trim()) {
        return labelElement.textContent.trim().replace("*", "").trim();
      }

      // Verificar si el campo tiene un placeholder descriptivo
      if (fieldElement.placeholder && fieldElement.placeholder.trim()) {
        return fieldElement.placeholder.trim();
      }
    }

    // Fallback: convertir el nombre del campo a título
    return fieldName
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * Obtener URL de Salesforce según el modo
   * @param {boolean} isSandboxMode - Si está en modo sandbox
   * @returns {string} - URL de Salesforce
   * @private
   */
  _getSalesforceUrl(isSandboxMode) {
    return isSandboxMode
      ? Constants.SALESFORCE_SUBMIT_URLS.test
      : Constants.SALESFORCE_SUBMIT_URLS.prod;
  }

  /**
   * Preparar datos del formulario con las keys correctas según el entorno
   * @param {Object} formData - Datos del formulario
   * @param {boolean} isSandboxMode - Si está en modo sandbox
   * @returns {Object} - Datos preparados con las keys correctas
   * @private
   */
  _prepareFormDataForEnvironment(formData, isSandboxMode) {
    const { FIELD_MAPPING } = Constants;
    const preparedData = {};

    this.logger.info(
      `🔧 Preparando datos para entorno: ${isSandboxMode ? "SANDBOX" : "PRODUCTION"}`
    );

    // Iterar sobre los datos del formulario
    Object.entries(formData).forEach(([fieldName, value]) => {
      // Buscar el mapping correspondiente
      const mapping = Object.values(FIELD_MAPPING).find((m) => m.field === fieldName);

      if (mapping && mapping.id) {
        let correctId;

        if (typeof mapping.id === "object" && mapping.id.test && mapping.id.prod) {
          // Mapping con diferentes IDs para test/prod
          correctId = isSandboxMode ? mapping.id.test : mapping.id.prod;
          this.logger.debug(
            `📝 Campo mapeado (${
              isSandboxMode ? "test" : "prod"
            }): ${fieldName} -> ${correctId} = ${value}`
          );
        } else {
          // Mapping con ID único (string)
          correctId = mapping.id;
          this.logger.debug(`📝 Campo mapeado (único): ${fieldName} -> ${correctId} = ${value}`);
        }

        preparedData[correctId] = value;
      } else {
        // Si no hay mapping específico, usar el nombre original
        preparedData[fieldName] = value;
        this.logger.debug(`📝 Campo sin mapeo: ${fieldName} = ${value}`);
      }
    });

    this.logger.info(`✅ Datos preparados: ${Object.keys(preparedData).length} campos`);
    return preparedData;
  }

  /**
   * Configurar formulario para envío nativo con datos preparados
   * @param {Object} preparedData - Datos preparados con keys correctas
   * @param {string} salesforceUrl - URL de Salesforce
   * @private
   */
  _configureFormForNativeSubmit(preparedData, salesforceUrl) {
    // Configurar action del formulario
    this.formElement.action = salesforceUrl;
    this.formElement.method = "POST";
    this.formElement.enctype = "multipart/form-data";

    // PASO 1: Remover todos los campos existentes (para evitar duplicados)
    const existingFields = this.formElement.querySelectorAll("input, select, textarea");
    existingFields.forEach((field) => {
      // Deshabilitar el campo en lugar de eliminarlo (para no romper la UI)
      field.disabled = true;
      field.name = ""; // Limpiar name para que no se envíe
    });

    // PASO 2: Crear nuevos campos hidden con los datos preparados
    Object.entries(preparedData).forEach(([key, value]) => {
      const hiddenField = document.createElement("input");
      hiddenField.type = "hidden";
      hiddenField.name = key;
      hiddenField.value = value;
      this.formElement.appendChild(hiddenField);

      this.logger.debug(`Campo agregado para envío: ${key} = ${value}`);
    });

    this.logger.debug(
      `🔧 Formulario configurado para envío nativo: ${Object.keys(preparedData).length} campos`
    );
  }

  /**
   * Procesar envío del formulario
   * @private
   */
  async _processFormSubmission(formData) {
    this.isSubmitting = true;
    this.state.setSystemState("isSubmitting", true);

    const submitBtn = this.ui.scopedQuery(Constants.SELECTORS.SUBMIT_BUTTON);
    if (submitBtn) {
      this.ui.disableElement(submitBtn);
      this.ui.setFieldText(submitBtn, submitBtn.dataset.loadingText || "Enviando...");
    }

    try {
      // Callback pre-envío
      if (this.config.callbacks?.onFormSubmit) {
        const shouldContinue = await this.config.callbacks.onFormSubmit(formData, this);
        if (!shouldContinue) {
          this.logger.info("Envío cancelado por callback personalizado");
          return;
        }
      }

      // Verificar estado de modos antes del envío
      const isDevelopmentMode = this.state.isDevMode();
      const isTestMode = this.state.isTestMode();

      // MODO DESARROLLO: Solo imprime en consola, NO envía
      if (isDevelopmentMode) {
        this.logger.info("DEV_MODE: Datos del formulario - NO SE ENVIARÁ");
        const preparedData = this._prepareFormDataForEnvironment(formData, isTestMode);
        this._logFormSubmissionDetails(preparedData, "DEV_MODE");
        this.logger.warn("FORMULARIO NO ENVIADO - MODO DESARROLLO ACTIVO");
        return;
      } else {
        // MODO PRODUCCIÓN o SANDBOX: Envío real
        const targetEnv = isTestMode ? "SANDBOX" : "PRODUCCIÓN";
        this.logger.info(`Enviando formulario a ${targetEnv}...`);
        const preparedData = this._prepareFormDataForEnvironment(formData, isTestMode);
        const salesforceUrl = this._getSalesforceUrl(isTestMode);
        
        // Crear formulario temporal con los datos preparados
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = salesforceUrl;
        tempForm.style.display = 'none';
        
        // Agregar todos los campos como inputs hidden
        Object.entries(preparedData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          tempForm.appendChild(input);
        });
        
        // Agregar al DOM, enviar y remover
        document.body.appendChild(tempForm);
        tempForm.submit();
        document.body.removeChild(tempForm);

        this.logger.info(`✅ Formulario enviado exitosamente a ${targetEnv}: ${salesforceUrl}`);
        return;
      }
    } catch (error) {
      this.logger.error("❌ Error durante el envío:", error);
      this.ui.showGeneralError("Error al enviar el formulario. Por favor, intente nuevamente.");
    } finally {
      this.isSubmitting = false;
      this.state.setSystemState("isSubmitting", false);

      if (submitBtn) {
        this.ui.enableElement(submitBtn);
        this.ui.setFieldText(submitBtn, submitBtn.dataset.originalText || "Enviar");
      }
    }
  }
}
