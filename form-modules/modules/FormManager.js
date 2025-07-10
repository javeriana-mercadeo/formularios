/**
 * FormManager - Clase principal para gestionar formularios de eventos
 * Permite crear múltiples instancias de formularios con configuraciones específicas
 * @version 1.0
 */

import { ValidationModule } from "./ValidationModule.js";
import { DataManager } from "./DataManager.js";
import { APIService } from "./APIService.js";
import { UIUtils } from "./UIUtils.js";
import { Logger } from "./Logger.js";

export class FormManager {
  constructor(selector, config = {}) {
    this.selector = selector;

    // Configuración por defecto
    this.config = {
      // Información del evento
      eventName: "",
      eventDate: "",
      university: "",
      company: "",

      // Tipos de asistente disponibles
      typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],

      // Días de asistencia
      attendanceDays: [],

      // Niveles académicos (si está vacío, se auto-detectan)
      academicLevels: [],

      // Filtros
      faculties: [],
      programs: [],

      // Campos a ocultar
      hiddenFields: [],

      // Configuración de ambiente
      debugMode: false,
      devMode: false,
      debugEmail: "",

      // Configuración de caché
      cacheEnabled: false,
      cacheExpirationHours: 12,

      // UTM tracking
      campaign: "",
      article: "",
      source: "",
      subSource: "",
      medium: "",

      // URLs de datos
      dataUrls: {
        locations: "",
        prefixes: "",
        programs: "",
        periods: "",
      },

      // Mapeo de campos para diferentes ambientes
      fieldMapping: {
        // Estos valores se pueden personalizar para cada instancia
        TIPO_DOCUMENTO: { test: "00N7j000002BI3X", prod: "00N5G00000WmhsT" },
        NUMERO_DOCUMENTO: { test: "00N7j000002BI3V", prod: "00N5G00000WmhsR" },
        // ... más campos
      },

      // URLs de Salesforce
      salesforceUrls: {
        test: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
        prod: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
      },

      // OIDs
      oids: {
        test: "00D7j0000004eQD",
        prod: "00Df4000003l8Bf",
      },

      // URLs de respuesta
      thankYouUrl: "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",
      privacyPolicyUrl:
        "https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html",

      // Selector del formulario
      formSelector: '[data-puj-form="main-form"]',

      // Configuración de validación
      validation: {
        realTimeValidation: true,
        showErrorsOnBlur: true,
      },

      // Configuración de estilos
      styles: {
        enabled: true,
        basePath: "../",
        autoLoad: true,
        includeTheme: false,
        themePath: "styles/themes/custom-theme.css",
        customVariables: {},
        useCombined: false,
        customFile: null,
      },

      // Configuración de logging
      logging: {
        enabled: true,
        level: "info",
        showTimestamp: true,
        showLevel: true,
        colors: true,
        persistLogs: false,
        maxLogs: 1000,
      },

      // Callbacks personalizados
      callbacks: {
        onFormLoad: null,
        onFormSubmit: null,
        onFieldChange: null,
        onValidationError: null,
      },

      ...config,
    };

    // Selectores de inputs
    this.inputSelectors = {
      firstName: '[name="first_name"]',
      lastName: '[name="last_name"]',
      typeDoc: '[name="type_doc"]',
      document: '[name="document"]',
      email: '[name="email"]',
      phoneCode: '[name="phone_code"]',
      phone: '[name="phone"]',
      country: '[name="country"]',
      department: '[name="department"]',
      city: '[name="city"]',
      attendanceDay: '[name="attendance_day"]',
      typeAttendee: '[name="type_attendee"]',
      academicLevel: '[name="academic_level"]',
      faculty: '[name="Facultad"]',
      program: '[name="program"]',
      admissionPeriod: '[name="admission_period"]',
      submitButton: '[type="submit"]',
      authorizationData: "authorization_data",
    };

    // Instanciar módulos
    this.logger = new Logger(this.config.eventName, this.config.logging);
    this.validator = new ValidationModule();
    this.dataManager = new DataManager(
      this.config.logging,
      this.config.dataUrls,
      this.config.cacheEnabled
    );
    this.apiService = new APIService(this.config);
    this.ui = new UIUtils(this.config.logging);

    // Estado del formulario
    this.formState = {
      // Datos del formulario con valores por defecto
      first_name: "",
      last_name: "",
      type_doc: "",
      document: "",
      email: "",
      phone_code: "57", // Colombia por defecto
      phone: "",
      country: "COL", // Colombia por defecto
      department: "",
      city: "",
      attendance_day: "",
      type_attendee: "",
      academic_level: "",
      faculty: "",
      program: "",
      admission_period: "",
      authorization_data: "",
      
      // Campos ocultos para Salesforce
      oid: "",
      retURL: "",
      debug: "",
      debugEmail: "",
      lead_source: "Landing Pages",
      company: "NA",
      
      // Campos ocultos de configuración del evento
      nevento: "",
      fevento: "",
      universidad: "",
      campana: "",
      fuente: "",
      medio: "",
    };

    // Estado de la UI
    this.uiState = {
      fieldsVisible: {
        department: false,
        city: false,
        academic_level: false,
        faculty: false,
        program: false,
        admission_period: false,
      },
      fieldsDisabled: {
        submit: true, // Botón deshabilitado por defecto
      },
    };

    // Estado de validación y sistema
    this.errors = {};
    this.touchedFields = new Set();
    this.isInitialized = false;
    this.isSubmitting = false;

    // Referencias DOM
    this.formElement = null;
    this.submitButton = null;
  }

  /**
   * Inicializar el formulario
   * @param {string} selector - Selector del formulario (opcional)
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
   * Aplicar variables CSS personalizadas
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
   * Configurar el formulario según el ambiente
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
   * Agregar campos ocultos necesarios para Salesforce
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
   * Establecer valores iniciales del formulario
   */
  setInitialValues() {
    // Configurar valores desde la configuración
    if (this.config.eventName) {
      this.ui.setHiddenFieldValue(this.formElement, "nevento", this.config.eventName);
      this.formState.nevento = this.config.eventName;
    }

    if (this.config.eventDate) {
      this.ui.setHiddenFieldValue(this.formElement, "fevento", this.config.eventDate);
      this.formState.fevento = this.config.eventDate;
    }

    if (this.config.university) {
      this.ui.setHiddenFieldValue(this.formElement, "universidad", this.config.university);
      this.formState.universidad = this.config.university;
    }

    // Configurar otros valores UTM
    if (this.config.campaign) {
      this.ui.setHiddenFieldValue(this.formElement, "campana", this.config.campaign);
      this.formState.campana = this.config.campaign;
    }

    if (this.config.source) {
      this.ui.setHiddenFieldValue(this.formElement, "fuente", this.config.source);
      this.formState.fuente = this.config.source;
    }

    if (this.config.medium) {
      this.ui.setHiddenFieldValue(this.formElement, "medio", this.config.medium);
      this.formState.medio = this.config.medium;
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
      countryElement.value = "COL";
      this.formState.country = "COL";
      this.logger.info("País predeterminado establecido: Colombia");

      // Ejecutar inmediatamente el manejo de cambio de país para mostrar departamentos
      this.handleCountryChange("COL");

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
      phoneCodeElement.value = "57";
      this.formState.phone_code = "57";
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
            dep.codigo === "11")
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
          city.nombre && (city.nombre.toLowerCase().includes("bogota") || city.codigo === "11001")
      );

      if (bogota) {
        cityElement.value = bogota.codigo;
        this.formState.city = bogota.codigo;
        this.logger.info(`Ciudad predeterminada establecida: ${bogota.nombre}`);
      }
    }
  }

  /**
   * Auto-seleccionar opciones únicas
   */
  autoSelectSingleOptions() {
    // Auto-seleccionar tipo de asistente si solo hay uno
    if (this.config.typeAttendee.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.typeAttendee);
      if (element) {
        element.value = this.config.typeAttendee[0];
        this.formState.type_attendee = this.config.typeAttendee[0];
        this.ui.hideElement(element);
        this.handleTypeAttendeeChange();
      }
    }

    // Auto-seleccionar día de asistencia si solo hay uno
    if (this.config.attendanceDays.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.attendanceDay);
      if (element) {
        element.value = this.config.attendanceDays[0];
        this.formState.attendance_day = this.config.attendanceDays[0];
        this.ui.hideElement(element);
      }
    }
  }

  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    this.logger.info("Configurando event listeners...");

    // Campos de texto
    this.ui.addInputListener(this.formElement, this.inputSelectors.firstName, (value) => {
      this.formState.first_name = this.ui.cleanText(value);
      return this.formState.first_name;
    });

    this.ui.addInputListener(this.formElement, this.inputSelectors.lastName, (value) => {
      this.formState.last_name = this.ui.cleanText(value);
      return this.formState.last_name;
    });

    this.ui.addInputListener(this.formElement, this.inputSelectors.document, (value) => {
      this.formState.document = this.ui.cleanNumbers(value);
      return this.formState.document;
    });

    this.ui.addInputListener(this.formElement, this.inputSelectors.phone, (value) => {
      this.formState.phone = this.ui.cleanNumbers(value);
      return this.formState.phone;
    });

    // Campos de selección
    this.ui.addChangeListener(this.formElement, this.inputSelectors.typeDoc, (value) => {
      this.formState.type_doc = value;
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.email, (value) => {
      this.formState.email = value;
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.phoneCode, (value) => {
      this.formState.phone_code = value;
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.country, (value) => {
      this.handleCountryChange(value);
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.department, (value) => {
      this.handleDepartmentChange(value);
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.city, (value) => {
      this.formState.city = value;
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.typeAttendee, (value) => {
      this.handleTypeAttendeeChange(value);
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.attendanceDay, (value) => {
      this.formState.attendance_day = value;
    });

    // Campos académicos
    this.ui.addChangeListener(this.formElement, this.inputSelectors.academicLevel, (value) => {
      this.handleAcademicLevelChange(value);
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.faculty, (value) => {
      this.handleFacultyChange(value);
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.program, (value) => {
      this.formState.program = value;
    });

    this.ui.addChangeListener(this.formElement, this.inputSelectors.admissionPeriod, (value) => {
      this.formState.admission_period = value;
    });

    // Autorización
    this.ui.addRadioListener(this.formElement, this.inputSelectors.authorizationData, (value) => {
      this.formState.authorization_data = value;
      this.toggleSubmitButton(value === "1");
    });

    // Envío del formulario
    this.formElement.addEventListener("submit", (e) => {
      this.handleSubmit(e);
    });
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
        this.touchedFields.add(field.id || field.name);
      });

      if (this.config.validation.showErrorsOnBlur) {
        field.addEventListener("blur", () => {
          // Solo validar si el campo ha sido tocado
          if (this.touchedFields.has(field.id || field.name)) {
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
      this.errors[fieldKey] = true;
      // Solo mostrar error si el campo ha sido tocado o es validación forzada (submit)
      if (forceShow || this.touchedFields.has(fieldKey)) {
        this.ui.showFieldError(field, this.validator.getErrorMessage(field));
      }
    } else {
      this.errors[fieldKey] = false;
      this.ui.hideFieldError(field);
    }

    return isValid;
  }

  /**
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.formState.country = value;

    if (value === "COL") {
      const departments = this.dataManager.getDepartments();
      // Poblar departamentos priorizando Bogotá D.C.
      this.ui.populateSelect(this.inputSelectors.department, departments, "codigo", "nombre", [
        "bogotá",
        "bogota",
      ]);
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.department));
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.department));
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.city));
      this.formState.department = "";
      this.formState.city = "";
    }
  }

  /**
   * Manejar cambio de departamento
   */
  handleDepartmentChange(value) {
    this.formState.department = value;

    if (value) {
      const cities = this.dataManager.getCities(value);
      // Poblar ciudades del departamento seleccionado
      this.ui.populateSelect(this.inputSelectors.city, cities, "codigo", "nombre");
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.city));
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.city));
      this.formState.city = "";
    }
  }

  /**
   * Manejar cambio de tipo de asistente
   */
  handleTypeAttendeeChange(value) {
    this.formState.type_attendee = value;

    if (value === "Aspirante") {
      this.showAcademicFields();
    } else {
      this.hideAcademicFields();
    }
  }

  /**
   * Mostrar campos académicos
   */
  showAcademicFields() {
    const academicLevelElement = this.formElement.querySelector(this.inputSelectors.academicLevel);

    if (!academicLevelElement) {
      this.ui.createAcademicLevelField(this.formElement);
    }

    // Cargar niveles académicos
    const levels =
      this.config.academicLevels.length > 0
        ? this.config.academicLevels
        : this.dataManager.getAcademicLevels();

    this.ui.populateSelect(this.inputSelectors.academicLevel, levels, "code", "name");
    this.ui.showElement(this.formElement.querySelector(this.inputSelectors.academicLevel));
  }

  /**
   * Ocultar campos académicos
   */
  hideAcademicFields() {
    const fields = [
      this.inputSelectors.academicLevel,
      this.inputSelectors.faculty,
      this.inputSelectors.program,
      this.inputSelectors.admissionPeriod,
    ];
    fields.forEach((selector) => {
      const element = this.formElement.querySelector(selector);
      if (element) {
        this.ui.hideElement(element);
        element.value = "";
      }
    });

    // Limpiar datos
    this.formState.academic_level = "";
    this.formState.faculty = "";
    this.formState.program = "";
    this.formState.admission_period = "";
  }

  /**
   * Manejar cambio de nivel académico
   */
  handleAcademicLevelChange(value) {
    this.formState.academic_level = value;

    if (value) {
      const faculties = this.dataManager.getFaculties(value);

      this.ui.populateSelect(this.inputSelectors.faculty, faculties);
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.faculty));

      const periods = this.dataManager.getPeriods(value);

      this.ui.populateSelect(this.inputSelectors.admissionPeriod, periods, "codigo", "nombre");
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.admissionPeriod));
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.faculty));
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.program));
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.admissionPeriod));
    }
  }

  /**
   * Manejar cambio de facultad
   */
  handleFacultyChange(value) {
    this.formState.faculty = value;

    if (value) {
      const programs = this.dataManager.getPrograms(this.formState.academic_level, value);
      this.logger.info(`Cargados ${programs ? programs.length : 0} programas para ${value}`);
      
      this.ui.populateSelect(this.inputSelectors.program, programs, "Codigo", "Nombre");
      this.ui.showElement(this.formElement.querySelector(this.inputSelectors.program));
    } else {
      this.ui.hideElement(this.formElement.querySelector(this.inputSelectors.program));
      this.formState.program = "";
    }
  }

  /**
   * Procesar parámetros URL
   */
  processUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    // Obtener nombre del evento desde URL
    const eventName = urlParams.get("nevento") || urlParams.get("evento");
    if (eventName) {
      this.formState.nevento = eventName;
      this.ui.setHiddenFieldValue(this.formElement, "nevento", eventName);
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
    return { ...this.config };
  }

  /**
   * Obtener datos del formulario
   */
  getFormData() {
    return { ...this.formState };
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

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
    
    // Resetear al estado inicial
    Object.keys(this.formState).forEach(key => {
      if (key === "phone_code") {
        this.formState[key] = "57";
      } else if (key === "country") {
        this.formState[key] = "COL";
      } else if (key === "lead_source") {
        this.formState[key] = "Landing Pages";
      } else if (key === "company") {
        this.formState[key] = "NA";
      } else {
        this.formState[key] = "";
      }
    });
    
    this.errors = {};
    this.touchedFields.clear();
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
