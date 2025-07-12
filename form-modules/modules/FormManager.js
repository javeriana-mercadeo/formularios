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
    this.configManager = new ConfigManager(config, this.selector);
    this.stateManager = new FormStateManager();
    this.config = ConfigManager.getConfig();
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
    // Logger automáticamente usa configuración de ConfigManager
    this.logger = new Logger();
    this.validator = new ValidationModule({}, this.selector);
    this.dataManager = new DataManager(this.config.dataUrls, this.config.cacheEnabled);
    this.apiService = new APIService();
    this.ui = new UIUtils();

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
      Logger.info(`Inicializando FormManager para: ${this.selector} (${this.config.eventName})`);

      // Buscar el formulario
      this.formElement = document.getElementById(this.selector);
      if (!this.formElement) {
        const error = `Formulario no encontrado: ${this.selector}`;
        Logger.error(error);
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
      Logger.info("FormManager inicializado correctamente");
    } catch (error) {
      Logger.error("Error al inicializar FormManager:", error);
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
      this.inputSelectors
    );

    // Academic fields manager
    this.academicFieldsManager = new AcademicFieldsManager(
      this.formElement,
      this.stateManager,
      this.dataManager,
      this.ui,
      this.autoSelectManager,
      this.inputSelectors,
      this.config
    );

    // Event listener manager
    this.eventListenerManager = new EventListenerManager(
      this.formElement,
      this.stateManager,
      this.ui,
      this.inputSelectors
    );

    // Registrar callbacks y handlers
    this._registerAutoSelectCallbacks();
    this._registerEventHandlers();
  }

  /**
   * Configurar callbacks para la lógica de auto-selección de campos
   */
  _registerAutoSelectCallbacks() {
    this.autoSelectManager.onAutoSelect(Constants.AUTO_SELECT_TYPES.ATTENDEE_TYPE, (value) => {
      this.handleTypeAttendeeChange(value);
    });

    this.autoSelectManager.onAutoSelect(Constants.AUTO_SELECT_TYPES.ACADEMIC_LEVEL, (value) => {
      this.academicFieldsManager.handleAcademicLevelChange(value);
    });

    this.autoSelectManager.onAutoSelect(Constants.AUTO_SELECT_TYPES.FACULTY, (value) => {
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
        Logger.info("Showing authorization error message");
      } else {
        errorAuthElement.style.display = "none";
        Logger.info("Hiding authorization error message");
      }
    }
  }

  /**
   * Configurar formulario para el ambiente actual (test/producción)
   * Establece URLs de Salesforce y campos ocultos necesarios
   */
  configureForm() {
    Logger.info("Configurando formulario...");

    // Agregar campos ocultos de Salesforce
    this.addHiddenFields();

    // Configurar valores iniciales
    this.setInitialValues();
  }

  /**
   * Añadir campos ocultos requeridos para la integración con Salesforce
   */
  addHiddenFields() {
    const { sandboxMode, debugMode, debugEmail } = this.config;
    const sf = Constants.SALESFORCE_FIELD_MAPPING;
    const env = sandboxMode ? "test" : "prod";

    const fields = [
      // Campos básicos
      { name: "oid", value: sf.OID[env] },
      { name: sf.RET_URL, value: this.config.thankYouUrl },
      { name: sf.DEBUG, value: debugMode ? "1" : "0" },
      { name: sf.DEBUG_EMAIL, value: debugMode ? debugEmail : "" },
      { name: sf.LEAD_SOURCE, value: this.config.leadSource },

      // Campos dinámicos
      { name: sf.REQUEST_ORIGIN[env], value: this.config.originRequest },
      { name: sf.EVENT_NAME[env], value: this.config.eventName },
      { name: sf.EVENT_DATE[env], value: this.config.eventDate },
      { name: sf.CAMPAIGN[env], value: this.config.campaign },
      { name: sf.ARTICLE[env], value: this.config.article },
      { name: sf.SOURCE[env], value: this.config.source },
      { name: sf.SUB_SOURCE[env], value: this.config.subSource },
      { name: sf.MEDIUM[env], value: this.config.medium },
    ];

    // Agregar campos válidos
    fields
      .filter((field) => field.value)
      .forEach((field) => {
        this.ui.addHiddenField(this.formElement, field.name, field.value);
        this.formState[field.name] = field.value;
      });
  }

  /**
   * Configurar valores iniciales y parámetros del evento
   */
  setInitialValues() {
    Logger.info("🔄 Detectando campos en DOM y aplicando valores iniciales del FormStateManager");

    // Obtener estado inicial del FormStateManager
    const initialState = this.stateManager.getInitialState();
    let appliedCount = 0;

    // Buscar todos los inputs en el formulario
    const allInputs = this.formElement.querySelectorAll("input, select, textarea");

    allInputs.forEach((element) => {
      const elementName = element.name || element.id;
      if (!elementName) return;

      // Verificar si este campo existe en el estado inicial
      if (initialState.hasOwnProperty(elementName)) {
        const defaultValue = initialState[elementName];

        // Solo aplicar si hay un valor por defecto
        if (defaultValue || defaultValue === 0) {
          element.value = defaultValue;
          appliedCount++;
        }
      }
    });

    Logger.info(
      `✅ Valores iniciales aplicados automáticamente: ${appliedCount} campos detectados en DOM`
    );
  }

  /**
   * Inicializar campos del formulario
   */
  initializeFields() {
    Logger.info("Inicializando campos del formulario...");

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
    Logger.info("Estableciendo valores predeterminados...");

    // Establecer país desde el estado del formulario
    const countryElement = this.formElement.querySelector(this.inputSelectors.country);
    if (countryElement) {
      const countryValue = this.formState.country;
      countryElement.value = countryValue;
      Logger.info(`País predeterminado establecido: ${countryValue}`);

      // Ejecutar inmediatamente el manejo de cambio de país para mostrar departamentos
      this.handleCountryChange(countryValue);

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

    // Establecer prefijo telefónico desde el estado del formulario
    const phoneCodeElement = this.formElement.querySelector(this.inputSelectors.phoneCode);
    if (phoneCodeElement) {
      const phoneCodeValue = this.formState.phone_code;
      phoneCodeElement.value = phoneCodeValue;
      Logger.info(`Prefijo telefónico predeterminado establecido: +${phoneCodeValue}`);
    }
  }

  /**
   * Establecer departamento y ciudad predeterminados (Cundinamarca -> Bogotá)
   */
  setDefaultDepartmentAndCity() {
    const departmentElement = this.formElement.querySelector(this.inputSelectors.department);
    if (departmentElement) {
      const departments = this.dataManager.getDepartments();
      const defaultDepartmentCode = this.formState.department;

      // Buscar el departamento por el código del estado, o por nombre como fallback
      const targetDepartment = departments.find(
        (dep) =>
          dep.codigo === defaultDepartmentCode ||
          (dep.nombre &&
            (dep.nombre.toLowerCase().includes("bogota") ||
              dep.nombre.toLowerCase().includes("d.c.")))
      );

      if (targetDepartment) {
        departmentElement.value = targetDepartment.codigo;
        this.formState.department = targetDepartment.codigo;
        Logger.info(`Departamento predeterminado establecido: ${targetDepartment.nombre}`);

        // Ejecutar inmediatamente el manejo de cambio de departamento para mostrar ciudades
        this.handleDepartmentChange(targetDepartment.codigo);

        // Verificar si las ciudades están disponibles
        const cities = this.dataManager.getCities(targetDepartment.codigo);

        if (cities.length > 0) {
          // Establecer ciudad predeterminada inmediatamente
          this.setDefaultCity(targetDepartment.codigo);
        } else {
          setTimeout(() => {
            this.setDefaultCity(targetDepartment.codigo);
          }, 100);
        }
      }
    }
  }

  /**
   * Establecer ciudad predeterminada
   */
  setDefaultCity(departmentCode) {
    const cityElement = this.formElement.querySelector(this.inputSelectors.city);
    if (cityElement) {
      const cities = this.dataManager.getCities(departmentCode);
      const defaultCityCode = this.formState.city;

      // Buscar la ciudad por el código del estado, o por nombre como fallback
      const targetCity = cities.find(
        (city) =>
          city.codigo === defaultCityCode ||
          (city.nombre && city.nombre.toLowerCase().includes("bogota"))
      );

      if (targetCity) {
        cityElement.value = targetCity.codigo;
        this.formState.city = targetCity.codigo;
        Logger.info(`Ciudad predeterminada establecida: ${targetCity.nombre}`);
      }
    }
  }

  /**
   * Auto-seleccionar y ocultar opciones únicas usando AutoSelectManager
   */
  autoSelectSingleOptions() {
    Logger.info("🔄 Ejecutando auto-selección de campos únicos...");
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
        Logger.info(`Facultad auto-seleccionada y ocultada: ${faculty}`);

        // CRUCIAL: Ejecutar la lógica de cambio inmediatamente para cargar programas
        // incluso cuando el campo está oculto
        setTimeout(() => {
          Logger.info(`🚀 Auto-cargando programas para facultad oculta: ${faculty}`);
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
        Logger.info(
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
    Logger.info("🎧 Configurando event listeners usando EventListenerManager...");
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
          const fieldName = field.id || field.name;
          if (this.stateManager.isFieldTouched(fieldName)) {
            // Usar ValidationModule directamente
            const validationResult = this.validator.validateFieldWithRules(fieldName, field.value);

            if (!validationResult.isValid) {
              // Guardar error en estado y mostrar en UI
              this.stateManager.setValidationError(fieldName, validationResult.error);
              this.ui.showFieldError(field, validationResult.error);
            } else {
              // Limpiar errores
              this.stateManager.clearValidationError(fieldName);
              this.ui.hideFieldError(field);
            }
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
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.stateManager.updateField("country", value);

    // Obtener el país por defecto del estado inicial para la comparación
    const initialState = this.stateManager.getInitialState();
    const defaultCountry = initialState[Constants.FIELD_NAMES.LOCATION.COUNTRY];

    if (value === defaultCountry) {
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
    Logger.info(`👤 Tipo de asistente cambiado a: ${value}`);

    // Usar la constante semántica para comparar
    if (value === Constants.ATTENDEE_TYPES.APPLICANT) {
      Logger.info("🎓 Procesando lógica de Aspirante");
      this.academicFieldsManager.showAcademicFields();

      // Procesar campos auto-seleccionados
      setTimeout(() => {
        this.academicFieldsManager.processAutoSelectedFields();
      }, 200);
    } else {
      Logger.info("👤 No es aspirante, ocultando campos académicos");
      this.academicFieldsManager.hideAcademicFields();
    }
  }

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
   * Único manejador de envío del formulario
   * No envía datos hasta que todo el formulario esté válido
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Prevenir múltiples envíos
    if (this.isSubmitting) {
      Logger.warn("⚠️ Envío ya en progreso, ignorando intento adicional");
      return;
    }

    Logger.info("🚀 Iniciando proceso de envío del formulario");

    // PASO 1: Validación completa obligatoria
    const formData = this.stateManager.getFormData();
    const validationResult = this.validator.validateFullForm(this.formElement, formData);

    if (!validationResult.isValid) {
      Logger.error(
        `❌ Formulario inválido. Errores: ${Object.keys(validationResult.errors).length}`
      );

      // Mostrar todos los errores en UI
      Object.entries(validationResult.errors).forEach(([fieldName, errorMessage]) => {
        const field =
          this.formElement.querySelector(`[name="${fieldName}"]`) ||
          this.formElement.querySelector(`[id="${fieldName}"]`);

        if (field) {
          this.stateManager.markFieldAsTouched(fieldName);
          this.stateManager.setValidationError(fieldName, errorMessage);
          this.ui.showFieldError(field, errorMessage);
        } else {
          Logger.warn(`Campo con error no encontrado en DOM: ${fieldName}`);
        }
      });

      // NO CONTINUAR - formulario inválido
      return;
    }

    Logger.info("✅ Formulario válido - procediendo con envío");

    // PASO 2: Bloquear UI durante envío
    this.isSubmitting = true;
    const submitBtn = this.formElement.querySelector(this.inputSelectors.submitButton);
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = submitBtn.dataset.loadingText || "Enviando...";
    }

    try {
      // PASO 3: Callback pre-envío (opcional)
      if (this.config.callbacks.onFormSubmit) {
        const shouldContinue = await this.config.callbacks.onFormSubmit(formData, this);
        if (!shouldContinue) {
          Logger.info("📋 Envío cancelado por callback personalizado");
          return;
        }
      }

      // PASO 4: Modo desarrollo (simulación)
      if (this.config.devMode) {
        Logger.info("🔧 DEV_MODE: Simulando envío exitoso");
        Logger.debug("Datos que se enviarían:", formData);
        this.ui.showSuccessMessage("Formulario enviado correctamente (modo desarrollo)");
        return;
      }

      // PASO 5: Envío real a Salesforce
      Logger.info("📡 Enviando datos a Salesforce...");
      const result = await this.apiService.submitForm(this.formElement);

      Logger.info("✅ Formulario enviado exitosamente");
      if (this.config.callbacks.onFormSuccess) {
        this.config.callbacks.onFormSuccess(result, this);
      }
    } catch (error) {
      Logger.error("❌ Error durante el envío:", error);

      // Callback de error
      if (this.config.callbacks.onValidationError) {
        this.config.callbacks.onValidationError(error, this);
      }

      // Mostrar error en UI
      this.ui.showErrorMessage("Error al enviar el formulario. Por favor, intente nuevamente.");
    } finally {
      // PASO 6: Restaurar UI
      this.isSubmitting = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || "Enviar";
      }
    }
  }

  /**
   * Cambiar modo de depuración
   */
  setDebugMode(enabled) {
    this.config.debugMode = enabled;
    this.configureForm();
    Logger.info(`Modo debug: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Cambiar modo de desarrollo
   */
  setDevMode(enabled) {
    this.config.devMode = enabled;
    Logger.info(`Modo desarrollo: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
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
    Logger.enable();
  }

  /**
   * Deshabilitar logging
   */
  disableLogging() {
    Logger.disable();
  }

  /**
   * Alternar logging
   */
  toggleLogging() {
    Logger.toggle();
  }

  /**
   * Cambiar nivel de logging
   * @param {string} level - Nivel ('error', 'warn', 'info', 'debug')
   */
  setLogLevel(level) {
    Logger.setLevel(level);
  }

  /**
   * Obtener configuración de logging
   */
  getLoggingConfig() {
    return Logger.getLoggingConfig();
  }

  /**
   * Obtener logs persistidos
   */
  getLogs() {
    return Logger.getLogs();
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    Logger.clearLogs();
  }

  /**
   * Obtener estadísticas de logging
   */
  getLoggingStats() {
    return Logger.getStats();
  }

  /**
   * Exportar logs
   * @param {string} format - Formato ('json', 'csv', 'txt')
   */
  exportLogs(format = "json") {
    return Logger.exportLogs(format);
  }

  /**
   * Configurar persistencia de logs
   * @param {boolean} persist - Si persistir logs
   * @param {number} maxLogs - Máximo número de logs
   */
  setLogPersistence(persist = true, maxLogs = 1000) {
    // Actualizar configuración via ConfigManager para que se propague a Logger
    ConfigManager.updateConfig({
      logging: {
        persistLogs: persist,
        maxLogs: maxLogs,
      },
    });
    Logger.info(
      `Persistencia de logs ${persist ? "habilitada" : "deshabilitada"} (max: ${maxLogs})`
    );
  }

  /**
   * Agregar listener para logs
   * @param {Function} callback - Función callback
   */
  addLogListener(callback) {
    Logger.addListener(callback);
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

    Logger.info("FormManager destruido");
    this.isInitialized = false;
  }
}
