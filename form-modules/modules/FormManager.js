/**
 * FormManager - Clase principal para gestionar formularios de eventos
 * Permite crear múltiples instancias de formularios con configuraciones específicas
 * @version 1.0
 */

import { ValidationModule } from './ValidationModule.js';
import { DataManager } from './DataManager.js';
import { APIService } from './APIService.js';
import { UIUtils } from './UIUtils.js';
import { StyleLoader } from './StyleLoader.js';
import { Logger } from './Logger.js';

export class FormManager {
  constructor(config = {}) {
    // Configuración por defecto
    this.config = {
      // Información del evento
      eventName: '',
      eventDate: '',
      university: '',
      company: '',
      
      // Tipos de asistente disponibles
      typeAttendee: ['Aspirante', 'Padre de familia y/o acudiente'],
      
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
      debugEmail: '',
      
      // Configuración de caché
      cacheEnabled: false,
      cacheExpirationHours: 12,
      
      // UTM tracking
      campaign: '',
      article: '',
      source: '',
      subSource: '',
      medium: '',
      
      // URLs de datos
      dataUrls: {
        locations: '../data/ubicaciones.json',
        prefixes: '../data/codigos_pais.json',
        programs: '../data/programas.json',
        periods: '../data/periodos.json'
      },
      
      // Mapeo de campos para diferentes ambientes
      fieldMapping: {
        // Estos valores se pueden personalizar para cada instancia
        TIPO_DOCUMENTO: { test: '00N7j000002BI3X', prod: '00N5G00000WmhsT' },
        NUMERO_DOCUMENTO: { test: '00N7j000002BI3V', prod: '00N5G00000WmhsR' },
        // ... más campos
      },
      
      // URLs de Salesforce
      salesforceUrls: {
        test: 'https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8',
        prod: 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'
      },
      
      // OIDs
      oids: {
        test: '00D7j0000004eQD',
        prod: '00Df4000003l8Bf'
      },
      
      // URLs de respuesta
      thankYouUrl: 'https://cloud.cx.javeriana.edu.co/EVENTOS_TKY',
      privacyPolicyUrl: 'https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html',
      
      // Selector del formulario
      formSelector: '#form_inscription',
      
      // Configuración de validación
      validation: {
        realTimeValidation: true,
        showErrorsOnBlur: true
      },
      
      // Configuración de estilos
      styles: {
        enabled: true,
        basePath: '../',
        autoLoad: true,
        includeTheme: false,
        themePath: 'styles/themes/custom-theme.css',
        customVariables: {}
      },
      
      // Configuración de logging
      logging: {
        enabled: true,
        level: 'info',
        prefix: 'FormManager',
        showTimestamp: true,
        showLevel: true,
        colors: true,
        persistLogs: false,
        maxLogs: 1000
      },
      
      // Callbacks personalizados
      callbacks: {
        onFormLoad: null,
        onFormSubmit: null,
        onFieldChange: null,
        onValidationError: null
      },
      
      ...config
    };
    
    // Instanciar módulos
    this.logger = new Logger(this.config.logging);
    this.validator = new ValidationModule();
    this.dataManager = new DataManager(this.config.dataUrls, this.config.cacheEnabled);
    this.apiService = new APIService(this.config);
    this.ui = new UIUtils();
    this.styleLoader = new StyleLoader();
    
    // Estado del formulario
    this.formData = {};
    this.errors = {};
    this.isInitialized = false;
    this.isSubmitting = false;
    
    // Referencias DOM
    this.formElement = null;
    this.submitButton = null;
  }
  
  /**
   * Inicializar el formulario
   * @param {string} formSelector - Selector del formulario (opcional)
   */
  async init(formSelector = null) {
    try {
      this.logger.loading('Inicializando FormManager...');
      
      // Cargar estilos si está habilitado
      if (this.config.styles.enabled && this.config.styles.autoLoad) {
        await this.loadStyles();
      }
      
      // Buscar el formulario
      this.formElement = document.querySelector(formSelector || this.config.formSelector);
      if (!this.formElement) {
        const error = `Formulario no encontrado: ${formSelector || this.config.formSelector}`;
        this.logger.error(error);
        throw new Error(error);
      }
      
      this.logger.info('Formulario encontrado:', this.formElement);
      
      // Cargar datos
      await this.loadFormData();
      
      // Configurar formulario
      this.configureForm();
      
      // Inicializar campos
      this.initializeFields();
      
      // Configurar event listeners
      this.setupEventListeners();
      
      // Configurar validación
      this.setupValidation();
      
      // Procesar parámetros URL
      this.processUrlParameters();
      
      // Ejecutar callback personalizado
      if (this.config.callbacks.onFormLoad) {
        this.config.callbacks.onFormLoad(this);
      }
      
      this.isInitialized = true;
      this.logger.success('FormManager inicializado correctamente');
      
    } catch (error) {
      this.logger.error('Error al inicializar FormManager:', error);
      throw error;
    }
  }
  
  /**
   * Cargar estilos del formulario
   */
  async loadStyles() {
    try {
      this.logger.loading('Cargando estilos del formulario...');
      
      // Configurar ruta base
      this.styleLoader.setBasePath(this.config.styles.basePath);
      this.logger.debug('Ruta base de estilos:', this.config.styles.basePath);
      
      // Cargar estilos principales
      await this.styleLoader.loadFormStyles({
        includeTheme: this.config.styles.includeTheme,
        themePath: this.config.styles.themePath
      });
      
      // Aplicar variables CSS personalizadas
      if (this.config.styles.customVariables && Object.keys(this.config.styles.customVariables).length > 0) {
        this.styleLoader.applyCustomVariables(this.config.styles.customVariables);
        this.logger.debug('Variables CSS aplicadas:', this.config.styles.customVariables);
      }
      
      this.logger.success('Estilos cargados correctamente');
    } catch (error) {
      this.logger.warn('Error cargando estilos:', error);
      // No bloquear la inicialización si los estilos fallan
    }
  }
  
  /**
   * Cargar datos necesarios para el formulario
   */
  async loadFormData() {
    this.logger.loading('Cargando datos del formulario...');
    
    const promises = [
      this.dataManager.loadLocations(),
      this.dataManager.loadPrefixes(),
      this.dataManager.loadPrograms(),
      this.dataManager.loadPeriods()
    ];
    
    await Promise.all(promises);
    this.logger.success('Datos cargados correctamente');
    this.logger.data('Estadísticas de datos:', this.dataManager.getDataStats());
  }
  
  /**
   * Configurar el formulario según el ambiente
   */
  configureForm() {
    this.logger.info('Configurando formulario...');
    
    // Configurar action del formulario
    const actionUrl = this.config.debugMode 
      ? this.config.salesforceUrls.test 
      : this.config.salesforceUrls.prod;
    
    this.formElement.action = actionUrl;
    this.logger.debug('Action del formulario:', actionUrl);
    this.logger.debug('Modo debug:', this.config.debugMode);
    
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
      { name: 'oid', value: this.config.debugMode ? this.config.oids.test : this.config.oids.prod },
      { name: 'retURL', value: this.config.thankYouUrl },
      { name: 'debug', value: this.config.debugMode ? '1' : '0' },
      { name: 'debugEmail', value: this.config.debugMode ? this.config.debugEmail : '' },
      { name: 'lead_source', value: 'Landing Pages' },
      { name: 'company', value: 'NA' }
    ];
    
    hiddenFields.forEach(field => {
      this.ui.addHiddenField(this.formElement, field.name, field.value);
    });
  }
  
  /**
   * Establecer valores iniciales del formulario
   */
  setInitialValues() {
    // Configurar valores desde la configuración
    if (this.config.eventName) {
      this.ui.setHiddenFieldValue(this.formElement, 'nevento', this.config.eventName);
    }
    
    if (this.config.eventDate) {
      this.ui.setHiddenFieldValue(this.formElement, 'fevento', this.config.eventDate);
    }
    
    if (this.config.university) {
      this.ui.setHiddenFieldValue(this.formElement, 'universidad', this.config.university);
    }
    
    // Configurar otros valores UTM
    if (this.config.campaign) {
      this.ui.setHiddenFieldValue(this.formElement, 'campana', this.config.campaign);
    }
    
    if (this.config.source) {
      this.ui.setHiddenFieldValue(this.formElement, 'fuente', this.config.source);
    }
    
    if (this.config.medium) {
      this.ui.setHiddenFieldValue(this.formElement, 'medio', this.config.medium);
    }
  }
  
  /**
   * Inicializar campos del formulario
   */
  initializeFields() {
    console.log('🔧 Inicializando campos...');
    
    // Inicializar ubicaciones
    this.ui.populateCountries(this.dataManager.getLocations());
    this.ui.populatePrefixes(this.dataManager.getPrefixes());
    
    // Inicializar campos de evento
    this.ui.populateSelect('[name="type_attendee"]', this.config.typeAttendee);
    this.ui.populateSelect('[name="attendance_day"]', this.config.attendanceDays);
    
    // Inicializar nivel académico si está configurado
    if (this.config.academicLevels && this.config.academicLevels.length > 0) {
      this.ui.populateSelect('[name="academic_level"]', this.config.academicLevels, 'code', 'name');
    }
    
    // Auto-seleccionar si solo hay una opción
    this.autoSelectSingleOptions();
  }
  
  /**
   * Auto-seleccionar opciones únicas
   */
  autoSelectSingleOptions() {
    // Auto-seleccionar tipo de asistente si solo hay uno
    if (this.config.typeAttendee.length === 1) {
      const element = this.formElement.querySelector('[name="type_attendee"]');
      if (element) {
        element.value = this.config.typeAttendee[0];
        this.formData.type_attendee = this.config.typeAttendee[0];
        this.ui.hideElement(element);
        this.handleTypeAttendeeChange();
      }
    }
    
    // Auto-seleccionar día de asistencia si solo hay uno
    if (this.config.attendanceDays.length === 1) {
      const element = this.formElement.querySelector('[name="attendance_day"]');
      if (element) {
        element.value = this.config.attendanceDays[0];
        this.formData.attendance_day = this.config.attendanceDays[0];
        this.ui.hideElement(element);
      }
    }
  }
  
  /**
   * Configurar event listeners
   */
  setupEventListeners() {
    console.log('🎯 Configurando event listeners...');
    
    // Campos de texto
    this.ui.addInputListener(this.formElement, '[name="first_name"]', (value) => {
      this.formData.first_name = this.ui.cleanText(value);
      return this.formData.first_name;
    });
    
    this.ui.addInputListener(this.formElement, '[name="last_name"]', (value) => {
      this.formData.last_name = this.ui.cleanText(value);
      return this.formData.last_name;
    });
    
    this.ui.addInputListener(this.formElement, '[name="document"]', (value) => {
      this.formData.document = this.ui.cleanNumbers(value);
      return this.formData.document;
    });
    
    this.ui.addInputListener(this.formElement, '[name="phone"]', (value) => {
      this.formData.phone = this.ui.cleanNumbers(value);
      return this.formData.phone;
    });
    
    // Campos de selección
    this.ui.addChangeListener(this.formElement, '[name="type_doc"]', (value) => {
      this.formData.type_doc = value;
    });
    
    this.ui.addChangeListener(this.formElement, '[name="email"]', (value) => {
      this.formData.email = value;
    });
    
    this.ui.addChangeListener(this.formElement, '[name="phone_code"]', (value) => {
      this.formData.phone_code = value;
    });
    
    this.ui.addChangeListener(this.formElement, '[name="country"]', (value) => {
      this.handleCountryChange(value);
    });
    
    this.ui.addChangeListener(this.formElement, '[name="department"]', (value) => {
      this.handleDepartmentChange(value);
    });
    
    this.ui.addChangeListener(this.formElement, '[name="city"]', (value) => {
      this.formData.city = value;
    });
    
    this.ui.addChangeListener(this.formElement, '[name="type_attendee"]', (value) => {
      this.handleTypeAttendeeChange(value);
    });
    
    this.ui.addChangeListener(this.formElement, '[name="attendance_day"]', (value) => {
      this.formData.attendance_day = value;
    });
    
    // Campos académicos
    this.ui.addChangeListener(this.formElement, '[name="academic_level"]', (value) => {
      this.handleAcademicLevelChange(value);
    });
    
    this.ui.addChangeListener(this.formElement, '[name="faculty"]', (value) => {
      this.handleFacultyChange(value);
    });
    
    this.ui.addChangeListener(this.formElement, '[name="program"]', (value) => {
      this.formData.program = value;
    });
    
    this.ui.addChangeListener(this.formElement, '[name="admission_period"]', (value) => {
      this.formData.admission_period = value;
    });
    
    // Autorización
    this.ui.addRadioListener(this.formElement, 'authorization_data', (value) => {
      this.formData.authorization_data = value;
      this.toggleSubmitButton(value === '1');
    });
    
    // Envío del formulario
    this.formElement.addEventListener('submit', (e) => {
      this.handleSubmit(e);
    });
  }
  
  /**
   * Configurar validación
   */
  setupValidation() {
    if (!this.config.validation.realTimeValidation) return;
    
    const fields = this.formElement.querySelectorAll('input, select');
    fields.forEach(field => {
      if (this.config.validation.showErrorsOnBlur) {
        field.addEventListener('blur', () => {
          this.validateField(field);
        });
      }
    });
  }
  
  /**
   * Validar un campo específico
   */
  validateField(field) {
    const isValid = this.validator.validateField(field);
    
    if (!isValid) {
      this.errors[field.name || field.id] = true;
      this.ui.showFieldError(field, this.validator.getErrorMessage(field));
    } else {
      this.errors[field.name || field.id] = false;
      this.ui.hideFieldError(field);
    }
    
    return isValid;
  }
  
  /**
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.formData.country = value;
    
    if (value === 'COL') {
      const departments = this.dataManager.getDepartments();
      this.ui.populateSelect('[name="department"]', departments, 'codigo', 'nombre');
      this.ui.showElement(this.formElement.querySelector('[name="department"]'));
    } else {
      this.ui.hideElement(this.formElement.querySelector('[name="department"]'));
      this.ui.hideElement(this.formElement.querySelector('[name="city"]'));
      this.formData.department = '';
      this.formData.city = '';
    }
  }
  
  /**
   * Manejar cambio de departamento
   */
  handleDepartmentChange(value) {
    this.formData.department = value;
    
    if (value) {
      const cities = this.dataManager.getCities(value);
      this.ui.populateSelect('[name="city"]', cities, 'codigo', 'nombre');
      this.ui.showElement(this.formElement.querySelector('[name="city"]'));
    } else {
      this.ui.hideElement(this.formElement.querySelector('[name="city"]'));
      this.formData.city = '';
    }
  }
  
  /**
   * Manejar cambio de tipo de asistente
   */
  handleTypeAttendeeChange(value) {
    this.formData.type_attendee = value;
    
    if (value === 'Aspirante') {
      this.showAcademicFields();
    } else {
      this.hideAcademicFields();
    }
  }
  
  /**
   * Mostrar campos académicos
   */
  showAcademicFields() {
    const academicLevelElement = this.formElement.querySelector('[name="academic_level"]');
    
    if (!academicLevelElement) {
      this.ui.createAcademicLevelField(this.formElement);
    }
    
    // Cargar niveles académicos
    const levels = this.config.academicLevels.length > 0 
      ? this.config.academicLevels 
      : this.dataManager.getAcademicLevels();
    
    this.ui.populateSelect('[name="academic_level"]', levels, 'code', 'name');
    this.ui.showElement(this.formElement.querySelector('[name="academic_level"]'));
  }
  
  /**
   * Ocultar campos académicos
   */
  hideAcademicFields() {
    const fields = ['[name="academic_level"]', '[name="faculty"]', '[name="program"]', '[name="admission_period"]'];
    fields.forEach(selector => {
      const element = this.formElement.querySelector(selector);
      if (element) {
        this.ui.hideElement(element);
        element.value = '';
      }
    });
    
    // Limpiar datos
    this.formData.academic_level = '';
    this.formData.faculty = '';
    this.formData.program = '';
    this.formData.admission_period = '';
  }
  
  /**
   * Manejar cambio de nivel académico
   */
  handleAcademicLevelChange(value) {
    this.formData.academic_level = value;
    
    if (value) {
      const faculties = this.dataManager.getFaculties(value);
      this.ui.populateSelect('[name="faculty"]', faculties);
      this.ui.showElement(this.formElement.querySelector('[name="faculty"]'));
      
      const periods = this.dataManager.getPeriods(value);
      this.ui.populateSelect('[name="admission_period"]', periods, 'codigo', 'nombre');
      this.ui.showElement(this.formElement.querySelector('[name="admission_period"]'));
    } else {
      this.ui.hideElement(this.formElement.querySelector('[name="faculty"]'));
      this.ui.hideElement(this.formElement.querySelector('[name="program"]'));
      this.ui.hideElement(this.formElement.querySelector('[name="admission_period"]'));
    }
  }
  
  /**
   * Manejar cambio de facultad
   */
  handleFacultyChange(value) {
    this.formData.faculty = value;
    
    if (value) {
      const programs = this.dataManager.getPrograms(this.formData.academic_level, value);
      this.ui.populateSelect('[name="program"]', programs, 'codigo', 'nombre');
      this.ui.showElement(this.formElement.querySelector('[name="program"]'));
    } else {
      this.ui.hideElement(this.formElement.querySelector('[name="program"]'));
      this.formData.program = '';
    }
  }
  
  /**
   * Procesar parámetros URL
   */
  processUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Obtener nombre del evento desde URL
    const eventName = urlParams.get('nevento') || urlParams.get('evento');
    if (eventName) {
      this.formData.nevento = eventName;
      this.ui.setHiddenFieldValue(this.formElement, 'nevento', eventName);
    }
  }
  
  /**
   * Alternar estado del botón de envío
   */
  toggleSubmitButton(enabled) {
    const submitBtn = this.formElement.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = !enabled;
    }
  }
  
  /**
   * Validar todo el formulario
   */
  validateForm() {
    const fields = this.formElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
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
      console.log('❌ Formulario inválido');
      return;
    }
    
    this.isSubmitting = true;
    const submitBtn = this.formElement.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
    }
    
    try {
      // Ejecutar callback personalizado
      if (this.config.callbacks.onFormSubmit) {
        const shouldContinue = await this.config.callbacks.onFormSubmit(this.formData, this);
        if (!shouldContinue) {
          return;
        }
      }
      
      // Modo desarrollo
      if (this.config.devMode) {
        console.log('🔧 DEV_MODE: Datos del formulario:', this.formData);
        this.ui.showSuccessMessage('Formulario enviado correctamente (modo desarrollo)');
        return;
      }
      
      // Enviar formulario
      await this.apiService.submitForm(this.formElement, this.formData);
      
    } catch (error) {
      console.error('❌ Error al enviar formulario:', error);
      
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
    console.log(`🔧 Modo debug: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }
  
  /**
   * Cambiar modo de desarrollo
   */
  setDevMode(enabled) {
    this.config.devMode = enabled;
    console.log(`🔧 Modo desarrollo: ${enabled ? 'ACTIVADO' : 'DESACTIVADO'}`);
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
    return { ...this.formData };
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
    this.formData = {};
    this.errors = {};
    this.isSubmitting = false;
    
    // Limpiar errores visuales
    const errorElements = this.formElement.querySelectorAll('.error_text');
    errorElements.forEach(el => el.style.display = 'none');
    
    // Restablecer campos por defecto
    this.setInitialValues();
  }
  
  /**
   * Cargar estilos manualmente
   * @param {Object} options - Opciones para cargar estilos
   */
  async loadStylesManually(options = {}) {
    const styleOptions = { ...this.config.styles, ...options };
    
    try {
      await this.styleLoader.loadFormStyles({
        includeTheme: styleOptions.includeTheme,
        themePath: styleOptions.themePath
      });
      
      if (styleOptions.customVariables && Object.keys(styleOptions.customVariables).length > 0) {
        this.styleLoader.applyCustomVariables(styleOptions.customVariables);
      }
      
      console.log('✅ Estilos cargados manualmente');
      return true;
    } catch (error) {
      console.error('❌ Error cargando estilos manualmente:', error);
      return false;
    }
  }
  
  /**
   * Aplicar variables CSS personalizadas
   * @param {Object} variables - Variables CSS a aplicar
   */
  applyCustomStyles(variables) {
    this.styleLoader.applyCustomVariables(variables);
  }
  
  /**
   * Cargar módulos CSS específicos
   * @param {Array<string>} modules - Nombres de módulos a cargar
   */
  async loadStyleModules(modules) {
    try {
      await this.styleLoader.loadModules(modules);
      console.log('✅ Módulos de estilos cargados:', modules);
      return true;
    } catch (error) {
      console.error('❌ Error cargando módulos de estilos:', error);
      return false;
    }
  }
  
  /**
   * Verificar si los estilos están cargados
   */
  areStylesLoaded() {
    return this.styleLoader.isLoaded('styles/form-styles.css');
  }
  
  /**
   * Obtener información de estilos cargados
   */
  getLoadedStyles() {
    return this.styleLoader.getLoadedStyles();
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
  exportLogs(format = 'json') {
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
    this.logger.info(`Persistencia de logs ${persist ? 'habilitada' : 'deshabilitada'} (max: ${maxLogs})`);
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
      this.formElement.removeEventListener('submit', this.handleSubmit);
      
      // Limpiar referencias
      this.formElement = null;
      this.submitButton = null;
    }
    
    this.logger.info('FormManager destruido');
    this.isInitialized = false;
  }
}