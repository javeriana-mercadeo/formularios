/**
 * FormManager - Gestor principal de formularios de eventos
 * Orquesta todos los módulos y gestiona el ciclo de vida del formulario
 *
 * Funcionalidades principales:
 * - Inicialización y configuración del formulario
 * - Coordinación entre módulos especializados
 * - Gestión del estado global del formulario
 * - Manejo de eventos de envío y validación
 *
 * @version 1.0
 */

import { ValidationModule } from "./ValidationModule.js";
import { DataManager } from "./DataManager.js";
import { APIService } from "./APIService.js";
import { UIUtils } from "./UIUtils.js";
import { Logger } from "./Logger.js";
import { ConfigManager } from "./ConfigManager.js";
import { FormStateManager } from "./FormStateManager.js";
import { AutoSelectManager } from "./AutoSelectManager.js";
import { AcademicFieldsManager } from "./AcademicFieldsManager.js";
import { EventListenerManager } from "./EventListenerManager.js";
import { Constants } from "./Constants.js";

export class FormManager {
  // Referencia a constantes centralizadas
  static INPUT_SELECTORS = Constants.INPUT_SELECTORS;
  static DEFAULT_VALUES = Constants.DEFAULT_VALUES;
  static SYSTEM_STATE = Constants.SYSTEM_STATE;

  constructor(selector, config = {}) {
    this.selector = selector;

    // Inicializar gestores principales
    this._initializeManagers(config);

    // Configurar selectores de campos
    this._setupInputSelectors();

    // Inicializar módulos básicos
    this._initializeBasicModules();

    // Inicializar estado interno
    this._initializeInternalState();
  }

  /**
   * Inicializar gestores de configuración y estado
   */
  _initializeManagers(config) {
    this.configManager = new ConfigManager(config);
    this.stateManager = new FormStateManager(this.configManager.get("logging"));
    this.config = this.configManager.getConfig();
  }

  /**
   * Configurar selectores de campos del formulario
   */
  _setupInputSelectors() {
    this.inputSelectors = {
      firstName: Constants.INPUT_SELECTORS.PERSONAL.FIRST_NAME,
      lastName: Constants.INPUT_SELECTORS.PERSONAL.LAST_NAME,
      typeDoc: Constants.INPUT_SELECTORS.PERSONAL.TYPE_DOC,
      document: Constants.INPUT_SELECTORS.PERSONAL.DOCUMENT,
      email: Constants.INPUT_SELECTORS.PERSONAL.EMAIL,
      phoneCode: Constants.INPUT_SELECTORS.PERSONAL.PHONE_CODE,
      phone: Constants.INPUT_SELECTORS.PERSONAL.PHONE,
      country: Constants.INPUT_SELECTORS.LOCATION.COUNTRY,
      department: Constants.INPUT_SELECTORS.LOCATION.DEPARTMENT,
      city: Constants.INPUT_SELECTORS.LOCATION.CITY,
      attendanceDay: Constants.INPUT_SELECTORS.EVENT.ATTENDANCE_DAY,
      typeAttendee: Constants.INPUT_SELECTORS.EVENT.TYPE_ATTENDEE,
      academicLevel: Constants.INPUT_SELECTORS.ACADEMIC.ACADEMIC_LEVEL,
      faculty: Constants.INPUT_SELECTORS.ACADEMIC.FACULTY,
      program: Constants.INPUT_SELECTORS.ACADEMIC.PROGRAM,
      admissionPeriod: Constants.INPUT_SELECTORS.ACADEMIC.ADMISSION_PERIOD,
      submitButton: Constants.INPUT_SELECTORS.FORM_CONTROLS.SUBMIT_BUTTON,
      authorizationData: Constants.INPUT_SELECTORS.FORM_CONTROLS.AUTHORIZATION_DATA,
    };
  }

  /**
   * Inicializar módulos básicos del sistema
   */
  _initializeBasicModules() {
    this.logger = new Logger(this.config.eventName, this.config.logging);
    this.validator = new ValidationModule({}, this.config.logging);
    this.dataManager = new DataManager(
      this.config.logging,
      this.config.dataUrls,
      this.config.cacheEnabled
    );
    this.apiService = new APIService(this.config);
    this.ui = new UIUtils(this.config.logging);

    // Módulos especializados (se inicializarán después del DOM)
    this.autoSelectManager = null;
    this.academicFieldsManager = null;
    this.eventListenerManager = null;
  }

  /**
   * Inicializar estado interno del formulario
   */
  _initializeInternalState() {
    // Referencias a estados (delegamos al StateManager)
    this.formState = this.stateManager.state;
    this.uiState = this.stateManager.uiState;

    // Referencias DOM
    this.formElement = null;
    this.submitButton = null;

    // Estado del sistema
    this.isInitialized = false;
    this.isSubmitting = false;
  }

  /**
   * Inicializar el formulario y todos sus módulos
   * Proceso principal que coordina la carga de datos y configuración
   */
  async init() {
    try {
      this.logger.info(`Inicializando FormManager para: ${this.selector}`);

      // Buscar el formulario
      this.formElement = document.getElementById(this.selector);
      if (!this.formElement) {
        const error = `Formulario no encontrado: ${this.selector}`;
        this.logger.error(error);
        throw new Error(error);
      }

      // Cargar datos
      await this.dataManager.loadAll();

      // Inicializar módulos especializados
      this._initializeSpecializedModules();

      // Configurar formulario
      this.configureForm();

      // Inicializar campos
      this.initializeFields();

      // Configurar event listeners
      this.setupEventListeners();

      // Configurar validación
      this.setupValidation();

      // Inicializar estado de errores
      this.initializeErrorState();

      // Procesar parámetros URL
      this.processUrlParameters();

      // Ejecutar callback personalizado
      if (this.config.callbacks.onFormLoad) {
        this.config.callbacks.onFormLoad(this);
      }

      this.isInitialized = true;
      this.logger.info("FormManager inicializado correctamente");
    } catch (error) {
      this.logger.error("Error al inicializar FormManager:", error);
      throw error;
    }
  }

  /**
   * Inicializar módulos especializados que requieren acceso al DOM
   * Se ejecuta después de que el formulario esté disponible
   */
  _initializeSpecializedModules() {
    // Auto-select manager
    this.autoSelectManager = new AutoSelectManager(
      this.formElement,
      this.stateManager,
      this.ui,
      this.inputSelectors,
      this.config.logging
    );

    // Academic fields manager
    this.academicFieldsManager = new AcademicFieldsManager(
      this.formElement,
      this.stateManager,
      this.dataManager,
      this.ui,
      this.autoSelectManager,
      this.inputSelectors,
      this.config,
      this.config.logging
    );

    // Event listener manager
    this.eventListenerManager = new EventListenerManager(
      this.formElement,
      this.stateManager,
      this.ui,
      this.inputSelectors,
      this.config.logging
    );

    // Registrar callbacks y handlers
    this._registerAutoSelectCallbacks();
    this._registerEventHandlers();
  }

  /**
   * Configurar callbacks para la lógica de auto-selección de campos
   */
  _registerAutoSelectCallbacks() {
    this.autoSelectManager.onAutoSelect(AutoSelectManager.FIELD_TYPES.ATTENDEE_TYPE, (value) => {
      this.handleTypeAttendeeChange(value);
    });

    this.autoSelectManager.onAutoSelect(AutoSelectManager.FIELD_TYPES.ACADEMIC_LEVEL, (value) => {
      this.academicFieldsManager.handleAcademicLevelChange(value);
    });

    this.autoSelectManager.onAutoSelect(AutoSelectManager.FIELD_TYPES.FACULTY, (value) => {
      this.academicFieldsManager.handleFacultyChange(value);
    });
  }

  /**
   * Configurar manejadores de eventos del formulario
   */
  _registerEventHandlers() {
    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.COUNTRY_CHANGE,
      (value) => {
        this.handleCountryChange(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.DEPARTMENT_CHANGE,
      (value) => {
        this.handleDepartmentChange(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.TYPE_ATTENDEE_CHANGE,
      (value) => {
        this.handleTypeAttendeeChange(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.ACADEMIC_LEVEL_CHANGE,
      (value) => {
        this.academicFieldsManager.handleAcademicLevelChange(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.FACULTY_CHANGE,
      (value) => {
        this.academicFieldsManager.handleFacultyChange(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.AUTHORIZATION_CHANGE,
      (value) => {
        this.toggleSubmitButton(value === "1");
        this._handleAuthorizationUI(value);
      }
    );

    this.eventListenerManager.registerHandler(
      EventListenerManager.HANDLER_TYPES.FORM_SUBMIT,
      (event) => {
        this.handleSubmit(event);
      }
    );
  }

  /**
   * Gestionar la interfaz de autorización de datos personales
   */
  _handleAuthorizationUI(value) {
    const errorAuthElement = this.formElement.querySelector('[data-puj-form="error_auth"]');
    if (errorAuthElement) {
      if (value === "0") {
        errorAuthElement.style.display = "block";
        this.logger.info("Showing authorization error message");
      } else {
        errorAuthElement.style.display = "none";
        this.logger.info("Hiding authorization error message");
      }
    }
  }

  /**
   * Aplicar variables CSS personalizadas al documento
   * Permite personalizar la apariencia del formulario dinámicamente
   * @param {Object} variables - Variables CSS a aplicar
   */
  applyCustomVariables(variables) {
    const root = document.documentElement;

    Object.entries(variables).forEach(([property, value]) => {
      const cssProperty = property.startsWith("--") ? property : `--${property}`;
      root.style.setProperty(cssProperty, value);
    });

    this.logger.debug("Variables CSS aplicadas:", variables);
  }

  /**
   * Configurar formulario para el ambiente actual (test/producción)
   * Establece URLs de Salesforce y campos ocultos necesarios
   */
  configureForm() {
    this.logger.info("Configurando formulario...");

    // Configurar action del formulario
    const actionUrl = this.config.debugMode
      ? this.config.salesforceUrls.test
      : this.config.salesforceUrls.prod;

    this.formElement.action = actionUrl;
    this.logger.debug("Action del formulario:", actionUrl);
    this.logger.debug("Modo debug:", this.config.debugMode);

    // Agregar campos ocultos de Salesforce
    this.addHiddenFields();

    // Configurar valores iniciales
    this.setInitialValues();
  }

  /**
   * Añadir campos ocultos requeridos para la integración con Salesforce
   */
  addHiddenFields() {
    const hiddenFields = [
      { name: "oid", value: this.config.debugMode ? this.config.oids.test : this.config.oids.prod },
      { name: "retURL", value: this.config.thankYouUrl },
      { name: "debug", value: this.config.debugMode ? "1" : "0" },
      { name: "debugEmail", value: this.config.debugMode ? this.config.debugEmail : "" },
      { name: "lead_source", value: "Landing Pages" },
      { name: "company", value: "NA" },
    ];

    hiddenFields.forEach((field) => {
      // Agregar al DOM
      this.ui.addHiddenField(this.formElement, field.name, field.value);

      // Agregar al estado del formulario
      this.formState[field.name] = field.value;
    });
  }

  /**
   * Configurar valores iniciales y parámetros del evento
   */
  setInitialValues() {
    // Configurar valores desde la configuración
    if (this.config.eventName) {
      this.ui.setHiddenFieldValue(this.formElement, "event_name", this.config.eventName);
      this.formState.event_name = this.config.eventName;
    }

    if (this.config.eventDate) {
      this.ui.setHiddenFieldValue(this.formElement, "event_date", this.config.eventDate);
      this.formState.event_date = this.config.eventDate;
    }

    if (this.config.university) {
      this.ui.setHiddenFieldValue(this.formElement, "university", this.config.university);
      this.formState.university = this.config.university;
    }

    // Configurar otros valores UTM
    if (this.config.campaign) {
      this.ui.setHiddenFieldValue(this.formElement, "campaign", this.config.campaign);
      this.formState.campaign = this.config.campaign;
    }

    if (this.config.source) {
      this.ui.setHiddenFieldValue(this.formElement, "source", this.config.source);
      this.formState.source = this.config.source;
    }

    if (this.config.medium) {
      this.ui.setHiddenFieldValue(this.formElement, "medium", this.config.medium);
      this.formState.medium = this.config.medium;
    }
  }

  /**
   * Inicializar campos del formulario
   */
  initializeFields() {
    this.logger.info("Inicializando campos del formulario...");

    // Inicializar ubicaciones
    this.ui.populateCountries(this.dataManager.getLocations());
    this.ui.populatePrefixes(this.dataManager.getPrefixes());

    // Inicializar campos de evento
    this.ui.populateSelect(this.inputSelectors.typeAttendee, this.config.typeAttendee);
    this.ui.populateSelect(this.inputSelectors.attendanceDay, this.config.attendanceDays);

    // Inicializar nivel académico si está configurado
    if (this.config.academicLevels && this.config.academicLevels.length > 0) {
      this.ui.populateSelect(
        this.inputSelectors.academicLevel,
        this.config.academicLevels,
        "code",
        "name"
      );
    }

    // Auto-seleccionar si solo hay una opción
    this.autoSelectSingleOptions();

    // Establecer valores predeterminados después de poblar los datos
    this.setDefaultValues();
  }

  /**
   * Establecer valores predeterminados
   */
  setDefaultValues() {
    this.logger.info("Estableciendo valores predeterminados...");

    // Establecer Colombia como país predeterminado
    const countryElement = this.formElement.querySelector(this.inputSelectors.country);
    if (countryElement) {
      countryElement.value = Constants.DEFAULT_VALUES.COUNTRY_CODE;
      this.formState.country = Constants.DEFAULT_VALUES.COUNTRY_CODE;
      this.logger.info("País predeterminado establecido: Colombia");

      // Ejecutar inmediatamente el manejo de cambio de país para mostrar departamentos
      this.handleCountryChange(Constants.DEFAULT_VALUES.COUNTRY_CODE);

      // Verificar si los datos de ubicaciones están disponibles
      const departments = this.dataManager.getDepartments();

      if (departments.length > 0) {
        // Establecer departamento y ciudad predeterminados inmediatamente
        this.setDefaultDepartmentAndCity();
      } else {
        setTimeout(() => {
          this.setDefaultDepartmentAndCity();
        }, 100);
      }
    }

    // Establecer +57 como prefijo predeterminado
    const phoneCodeElement = this.formElement.querySelector(this.inputSelectors.phoneCode);
    if (phoneCodeElement) {
      phoneCodeElement.value = Constants.DEFAULT_VALUES.PHONE_CODE;
      this.formState.phone_code = Constants.DEFAULT_VALUES.PHONE_CODE;
      this.logger.info("Prefijo telefónico predeterminado establecido: +57 (Colombia)");
    }
  }

  /**
   * Establecer departamento y ciudad predeterminados (Cundinamarca -> Bogotá)
   */
  setDefaultDepartmentAndCity() {
    const departmentElement = this.formElement.querySelector(this.inputSelectors.department);
    if (departmentElement) {
      const departments = this.dataManager.getDepartments();

      const bogotaDC = departments.find(
        (dep) =>
          dep.nombre &&
          (dep.nombre.toLowerCase().includes("bogota") ||
            dep.nombre.toLowerCase().includes("d.c.") ||
            dep.codigo === Constants.DEFAULT_VALUES.DEPARTMENT_BOGOTA)
      );

      if (bogotaDC) {
        departmentElement.value = bogotaDC.codigo;
        this.formState.department = bogotaDC.codigo;
        this.logger.info(`Departamento predeterminado establecido: ${bogotaDC.nombre}`);

        // Ejecutar inmediatamente el manejo de cambio de departamento para mostrar ciudades
        this.handleDepartmentChange(bogotaDC.codigo);

        // Verificar si las ciudades están disponibles
        const cities = this.dataManager.getCities(bogotaDC.codigo);

        if (cities.length > 0) {
          // Establecer Bogotá inmediatamente
          this.setDefaultCity(bogotaDC.codigo);
        } else {
          setTimeout(() => {
            this.setDefaultCity(bogotaDC.codigo);
          }, 100);
        }
      }
    }
  }

  /**
   * Establecer Bogotá como ciudad predeterminada
   */
  setDefaultCity(departmentCode) {
    const cityElement = this.formElement.querySelector(this.inputSelectors.city);
    if (cityElement) {
      const cities = this.dataManager.getCities(departmentCode);

      const bogota = cities.find(
        (city) =>
          city.nombre &&
          (city.nombre.toLowerCase().includes("bogota") ||
            city.codigo === Constants.DEFAULT_VALUES.CITY_BOGOTA)
      );

      if (bogota) {
        cityElement.value = bogota.codigo;
        this.formState.city = bogota.codigo;
        this.logger.info(`Ciudad predeterminada establecida: ${bogota.nombre}`);
      }
    }
  }

  /**
   * Auto-seleccionar y ocultar opciones únicas usando AutoSelectManager
   */
  autoSelectSingleOptions() {
    this.logger.info("🔄 Ejecutando auto-selección de campos únicos...");
    this.autoSelectManager.autoSelectAllConfiguredFields(this.config);
  }

  /**
   * Auto-seleccionar y ocultar facultades cuando hay filtro y solo una opción
   */
  autoSelectSingleFaculty(faculties) {
    if (faculties && faculties.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.faculty);
      if (element) {
        const faculty = faculties[0];
        element.value = faculty;
        this.formState.faculty = faculty;
        this.ui.hideElement(element);
        this.logger.info(`Facultad auto-seleccionada y ocultada: ${faculty}`);

        // CRUCIAL: Ejecutar la lógica de cambio inmediatamente para cargar programas
        // incluso cuando el campo está oculto
        setTimeout(() => {
          this.logger.info(`🚀 Auto-cargando programas para facultad oculta: ${faculty}`);
          this.handleFacultyChange(faculty);
        }, 100);

        return true;
      }
    }
    return false;
  }

  /**
   * Auto-seleccionar y ocultar programas cuando hay filtro y solo una opción
   */
  autoSelectSingleProgram(programs) {
    if (programs && programs.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.program);
      if (element) {
        const program = programs[0];
        const value = program.Codigo || program.codigo || program;
        element.value = value;
        this.formState.program = value;
        this.ui.hideElement(element);
        this.logger.info(
          `Programa auto-seleccionado y ocultado: ${program.Nombre || program.nombre || value}`
        );
        return true;
      }
    }
    return false;
  }

  /**
   * Configurar event listeners usando EventListenerManager
   */
  setupEventListeners() {
    this.logger.info("🎧 Configurando event listeners usando EventListenerManager...");
    this.eventListenerManager.setupAllEventListeners();
  }

  /**
   * Configurar validación
   */
  setupValidation() {
    if (!this.config.validation.realTimeValidation) return;

    const fields = this.formElement.querySelectorAll("input, select");
    fields.forEach((field) => {
      // Marcar campo como tocado cuando el usuario interactúa
      field.addEventListener("focus", () => {
        this.stateManager.markFieldAsTouched(field.id || field.name);
      });

      if (this.config.validation.showErrorsOnBlur) {
        field.addEventListener("blur", () => {
          // Solo validar si el campo ha sido tocado
          if (this.stateManager.isFieldTouched(field.id || field.name)) {
            this.validateField(field);
          }
        });
      }
    });
  }

  /**
   * Inicializar estado de errores al cargar el formulario
   */
  initializeErrorState() {
    // Usar el método del UIUtils para limpiar todos los errores
    this.ui.clearAllErrors(this.formElement);
  }

  /**
   * Validar un campo específico
   */
  validateField(field, forceShow = false) {
    const isValid = this.validator.validateField(field);
    const fieldKey = field.name || field.id;

    if (!isValid) {
      this.stateManager.setValidationError(fieldKey, this.validator.getErrorMessage(field));
      // Solo mostrar error si el campo ha sido tocado o es validación forzada (submit)
      if (forceShow || this.stateManager.isFieldTouched(fieldKey)) {
        this.ui.showFieldError(field, this.validator.getErrorMessage(field));
      }
    } else {
      this.stateManager.clearValidationError(fieldKey);
      this.ui.hideFieldError(field);
    }

    return isValid;
  }

  /**
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.stateManager.updateField("country", value);

    if (value === Constants.DEFAULT_VALUES.COUNTRY_CODE) {
      const departments = this.dataManager.getDepartments();
      // Poblar departamentos priorizando Bogotá D.C.
      this.ui.populateSelect(this.inputSelectors.department, departments, "codigo", "nombre", [
        "bogotá",
        "bogota",
      ]);
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.department));
      this.stateManager.setFieldVisibility("department", true);
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.department));
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.city));
      this.stateManager.setFieldVisibility("department", false);
      this.stateManager.setFieldVisibility("city", false);
      this.stateManager.updateField("department", "");
      this.stateManager.updateField("city", "");
    }
  }

  /**
   * Manejar cambio de departamento
   */
  handleDepartmentChange(value) {
    this.stateManager.updateField("department", value);

    if (value) {
      const cities = this.dataManager.getCities(value);
      // Poblar ciudades del departamento seleccionado
      this.ui.populateSelect(this.inputSelectors.city, cities, "codigo", "nombre");
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.city));
      this.stateManager.setFieldVisibility("city", true);
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.city));
      this.stateManager.setFieldVisibility("city", false);
      this.stateManager.updateField("city", "");
    }
  }

  /**
   * Manejar cambio de tipo de asistente
   */
  handleTypeAttendeeChange(value) {
    // Si no se pasa valor, usar el valor almacenado o el del elemento
    if (!value) {
      const element = this.formElement.querySelector(this.inputSelectors.typeAttendee);
      value = element ? element.value : this.stateManager.getField("type_attendee");
    }

    this.stateManager.updateField("type_attendee", value);
    this.logger.info(`👤 Tipo de asistente cambiado a: ${value}`);

    if (value === Constants.DEFAULT_VALUES.ATTENDEE_TYPE_APPLICANT) {
      this.logger.info("🎓 Procesando lógica de Aspirante");
      this.academicFieldsManager.showAcademicFields();

      // Procesar campos auto-seleccionados
      setTimeout(() => {
        this.academicFieldsManager.processAutoSelectedFields();
      }, 200);
    } else {
      this.logger.info("👤 No es aspirante, ocultando campos académicos");
      this.academicFieldsManager.hideAcademicFields();
    }
  }

  // Método removido - ahora delegado a AcademicFieldsManager.processAutoSelectedFields()

  // Método removido - ahora delegado a AcademicFieldsManager.showAcademicFields()

  // Método removido - ahora delegado a AcademicFieldsManager.hideAcademicFields()

  // Método removido - ahora delegado a AcademicFieldsManager.handleAcademicLevelChange()

  // Método removido - ahora delegado a AcademicFieldsManager.handleFacultyChange()

  /**
   * Procesar parámetros URL
   */
  processUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    // Obtener nombre del evento desde URL
    const eventName =
      urlParams.get("event_name") || urlParams.get("nevento") || urlParams.get("evento");
    if (eventName) {
      this.formState.event_name = eventName;
      this.ui.setHiddenFieldValue(this.formElement, "event_name", eventName);
    }
  }

  /**
   * Alternar estado del botón de envío
   */
  toggleSubmitButton(enabled) {
    const submitBtn = this.formElement.querySelector(this.inputSelectors.submitButton);
    if (submitBtn) {
      submitBtn.disabled = !enabled;
    }
  }

  /**
   * Validar todo el formulario
   */
  validateForm() {
    const fields = this.formElement.querySelectorAll("input[required], select[required]");
    let isValid = true;

    fields.forEach((field) => {
      // Forzar mostrar errores durante validación completa (submit)
      if (!this.validateField(field, true)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Manejar envío del formulario
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (this.isSubmitting) return;

    // Validar formulario
    if (!this.validateForm()) {
      this.logger.error("Formulario inválido");
      return;
    }

    this.isSubmitting = true;
    const submitBtn = this.formElement.querySelector(this.inputSelectors.submitButton);
    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      // Ejecutar callback personalizado
      if (this.config.callbacks.onFormSubmit) {
        const shouldContinue = await this.config.callbacks.onFormSubmit(this.formState, this);
        if (!shouldContinue) {
          return;
        }
      }

      // Modo desarrollo
      if (this.config.devMode) {
        this.logger.info("🔧 DEV_MODE: Datos del formulario:", this.formState);
        this.ui.showSuccessMessage("Formulario enviado correctamente (modo desarrollo)");
        return;
      }

      // Enviar formulario
      await this.apiService.submitForm(this.formElement, this.formState);
    } catch (error) {
      this.logger.error("Error al enviar formulario:", error);

      if (this.config.callbacks.onValidationError) {
        this.config.callbacks.onValidationError(error, this);
      }
    } finally {
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  }

  /**
   * Cambiar modo de depuración
   */
  setDebugMode(enabled) {
    this.config.debugMode = enabled;
    this.configureForm();
    this.logger.info(`Modo debug: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Cambiar modo de desarrollo
   */
  setDevMode(enabled) {
    this.config.devMode = enabled;
    this.logger.info(`Modo desarrollo: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Obtener configuración actual
   */
  getConfig() {
    return this.configManager.getConfig();
  }

  /**
   * Obtener datos del formulario
   */
  getFormData() {
    return this.stateManager.getFormData();
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.configManager.updateConfig(newConfig);
    this.config = this.configManager.getConfig();

    if (this.isInitialized) {
      this.configureForm();
      this.initializeFields();
    }
  }

  /**
   * Limpiar formulario
   */
  reset() {
    this.formElement.reset();

    // Resetear usando StateManager
    this.stateManager.reset();
    this.isSubmitting = false;

    // Limpiar errores visuales usando UIUtils
    this.ui.clearAllErrors(this.formElement);

    // Restablecer campos por defecto
    this.setInitialValues();
  }

  /**
   * Métodos de control de logging
   */

  /**
   * Habilitar logging
   */
  enableLogging() {
    this.logger.enable();
  }

  /**
   * Deshabilitar logging
   */
  disableLogging() {
    this.logger.disable();
  }

  /**
   * Alternar logging
   */
  toggleLogging() {
    this.logger.toggle();
  }

  /**
   * Cambiar nivel de logging
   * @param {string} level - Nivel ('error', 'warn', 'info', 'debug')
   */
  setLogLevel(level) {
    this.logger.setLevel(level);
  }

  /**
   * Obtener configuración de logging
   */
  getLoggingConfig() {
    return this.logger.getConfig();
  }

  /**
   * Obtener logs persistidos
   */
  getLogs() {
    return this.logger.getLogs();
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logger.clearLogs();
  }

  /**
   * Obtener estadísticas de logging
   */
  getLoggingStats() {
    return this.logger.getStats();
  }

  /**
   * Exportar logs
   * @param {string} format - Formato ('json', 'csv', 'txt')
   */
  exportLogs(format = "json") {
    return this.logger.exportLogs(format);
  }

  /**
   * Configurar persistencia de logs
   * @param {boolean} persist - Si persistir logs
   * @param {number} maxLogs - Máximo número de logs
   */
  setLogPersistence(persist = true, maxLogs = 1000) {
    this.logger.config.persistLogs = persist;
    this.logger.config.maxLogs = maxLogs;
    this.logger.info(
      `Persistencia de logs ${persist ? "habilitada" : "deshabilitada"} (max: ${maxLogs})`
    );
  }

  /**
   * Agregar listener para logs
   * @param {Function} callback - Función callback
   */
  addLogListener(callback) {
    this.logger.addListener(callback);
  }

  /**
   * Destruir instancia
   */
  destroy() {
    if (this.formElement) {
      // Remover todos los event listeners
      this.formElement.removeEventListener("submit", this.handleSubmit);

      // Limpiar referencias
      this.formElement = null;
      this.submitButton = null;
    }

    this.logger.info("FormManager destruido");
    this.isInitialized = false;
  }
}
