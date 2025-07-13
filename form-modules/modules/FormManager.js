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
    this.formElement = null;
    this.isInitialized = false;
    this.isSubmitting = false;

    // Inicializar gestores principales
    this._initializeManagers(config);
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
        `Inicializando FormManager para: ${this.selector} (${this.config.eventName})`
      );

      // Inicializar elemento del formulario
      this.formElement = document.getElementById(this.selector);
      if (!this.formElement) {
        throw new Error(`No se encontró elemento del formulario con selector: ${this.selector}`);
      }

      // Crear Event ahora que formElement está disponible
      this.event = new Event({
        formElement: this.formElement,
        state: this.state,
        ui: this.ui,
        logger: this.logger,
      });

      // Configurar Event en State y actualizar formElement
      this.state.setEventManager(this.event);
      this.state.formElement = this.formElement;

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
   * Manejar cambio de tipo de asistente
   */

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
      this.logger.error.warn("⚠️ Envío ya en progreso, ignorando intento adicional");
      return;
    }

    this.logger.error.info("🚀 Iniciando proceso de envío del formulario");

    // 1. Detectar y validar campos requeridos presentes en el DOM
    this.logger.error.debug("🔍 Ejecutando validación de campos requeridos...");
    const requiredFieldsValidation = this.validator.validateAllRequiredFields(this.formElement);
    this.logger.error.debug(
      "📊 Resultado de validación de campos requeridos:",
      requiredFieldsValidation
    );

    if (!requiredFieldsValidation.isValid) {
      this.logger.error.warn(
        `❌ Campos requeridos faltantes: ${requiredFieldsValidation.missingCount}/${requiredFieldsValidation.totalRequired}`
      );
      this._handleMissingRequiredFields(requiredFieldsValidation.missingFields);
      this.ui.showGeneralError("Por favor completa todos los campos requeridos");
      return;
    }

    this.logger.error.info(
      `✅ Todos los campos requeridos están completos (${requiredFieldsValidation.totalRequired} campos)`
    );

    // 2. Validación completa de formato y reglas de negocio
    const formData = this.state.getFormData();
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
    this.state.setDebugMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
    this._addHiddenFields();
  }

  /**
   * Cambiar modo de desarrollo
   */
  setDevMode(enabled) {
    this.state.setDevMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
  }

  /**
   * Cambiar modo sandbox
   */
  setSandboxMode(enabled) {
    this.state.setSandboxMode(enabled);
    this.config = Config.getConfig(); // Refrescar config local
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
   * Inicializar gestores de configuración y estado
   * @private
   */
  _initializeManagers(config) {
    this.config = new Config({
      config: config,
      selector: this.selector,
    });

    this.logger = new Logger({
      config: this.config.getLoggingConfig(),
    });

    this.ui = new Ui({
      config: this.config.getUiConfig(),
      logger: this.logger,
    });

    this.validator = new Validation({
      logger: this.logger,
    });

    this.state = new State({
      event: null,
      validator: this.validator,
      ui: this.ui,
      formElement: null, // Se asignará después en initialize()
      logger: this.logger,
    });

    // Event se creará después en initialize() cuando formElement esté disponible
    this.event = null;

    this.data = new Data(this.config.cache, this.config.urls, this.logger);

    this.service = new Service();
  }

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
    // Módulo académico
    this.academic = new Academic(this.data, this.ui, this.state, this.logger);

    // Módulo de ubicaciones
    this.locations = new Locations(this.data, this.ui, this.state, this.logger);

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
    this._addHiddenFields();
    this._setInitialFormValues();
    this._initializeFormHiddenFields();
    this.academic.initializeAcademicFields();
    this.locations.initializeLocationFields();
    this.event.setupAllEvents();
    this._setupStateValidation();
    this._processUrlParameters();
  }

  // ===============================
  // MÉTODOS PRIVADOS - CONFIGURACIÓN
  // ===============================

  /**
   * Añadir campos ocultos requeridos para Salesforce
   * @private
   */
  _addHiddenFields() {
    const { FIELDS, FIELD_MAPPING } = Constants;
    const env = this.state.isSandboxMode() ? "test" : "prod";

    const fields = [
      {
        info: FIELD_MAPPING.OID.name,
        name: FIELD_MAPPING.OID.field,
        value: FIELD_MAPPING.OID.id[env],
      },
      {
        info: FIELD_MAPPING.RET_URL.name,
        name: FIELD_MAPPING.RET_URL.field,
        value: this.config.thankYouUrl,
      },
      {
        info: FIELD_MAPPING.DEBUG.name,
        name: FIELD_MAPPING.DEBUG.field,
        value: this.state.getField(FIELDS.DEBUG),
      },
      {
        info: FIELD_MAPPING.DEBUG_EMAIL.name,
        name: FIELD_MAPPING.DEBUG_EMAIL.field,
        value: this.state.isDebugMode() ? this.config.debugEmail : "",
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
          // Actualizar el estado - ahora todos los campos Salesforce están incluidos
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
        options: this.data.getCountries().map((country) => ({
          value: country.code,
          text: country.name,
        })),
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
          this.logger.info("📋 Envío cancelado por callback personalizado");
          return;
        }
      }

      // Modo desarrollo
      if (this.state.isDevMode()) {
        this.logger.info("🔧 DEV_MODE: Simulando envío exitoso");
        this.logger.debug("Datos que se enviarían:", formData);
        return;
      }

      // Envío real
      this.logger.info("📡 Enviando datos a Salesforce...");
      const result = await this.service.submitForm(this.formElement);

      this.logger.info("✅ Formulario enviado exitosamente");
      if (this.config.callbacks?.onFormSuccess) {
        this.config.callbacks.onFormSuccess(result, this);
      }
    } catch (error) {
      this.logger.error("❌ Error durante el envío:", error);

      if (this.config.callbacks?.onValidationError) {
        this.config.callbacks.onValidationError(error, this);
      }

      this.ui.showErrorMessage("Error al enviar el formulario. Por favor, intente nuevamente.");
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
