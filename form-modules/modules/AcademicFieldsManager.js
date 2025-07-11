/**
 * AcademicFieldsManager - Gestor especializado de campos académicos
 *
 * Responsabilidades:
 * - Gestionar la visibilidad de campos académicos según el tipo de asistente
 * - Coordinar la carga dinámica de niveles, facultades y programas
 * - Aplicar filtros de configuración a los datos académicos
 * - Manejar auto-selección de campos cuando hay una sola opción
 * - Validar completitud de información académica para aspirantes
 *
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class AcademicFieldsManager {
  // Constantes para tipos de campos académicos
  static FIELD_TYPES = {
    ACADEMIC_LEVEL: "academic_level",
    FACULTY: "faculty",
    PROGRAM: "program",
    ADMISSION_PERIOD: "admission_period",
  };

  // Mapeo de selectores de campos
  static FIELD_SELECTORS = {
    ACADEMIC_LEVEL: "academicLevel",
    FACULTY: "faculty",
    PROGRAM: "program",
    ADMISSION_PERIOD: "admissionPeriod",
  };

  // Mapeo de campos de estado
  static STATE_FIELDS = {
    VISIBILITY: "fieldsVisible",
    CURRENT_LEVEL: "currentLevel",
    CURRENT_FACULTY: "currentFaculty",
    IS_VISIBLE: "isVisible",
  };

  constructor(
    formElement,
    stateManager,
    dataManager,
    ui,
    autoSelectManager,
    inputSelectors,
    config,
    loggerConfig = {}
  ) {
    this.formElement = formElement;
    this.stateManager = stateManager;
    this.dataManager = dataManager;
    this.ui = ui;
    this.autoSelectManager = autoSelectManager;
    this.inputSelectors = inputSelectors;
    this.config = config;
    this.logger = new Logger("AcademicFieldsManager", loggerConfig);

    // Academic fields internal state
    this.academicFieldsState = {
      [AcademicFieldsManager.STATE_FIELDS.IS_VISIBLE]: false,
      [AcademicFieldsManager.STATE_FIELDS.CURRENT_LEVEL]: null,
      [AcademicFieldsManager.STATE_FIELDS.CURRENT_FACULTY]: null,
      availableLevels: [],
      availableFaculties: [],
      availablePrograms: [],
      availablePeriods: [],
    };
  }

  /**
   * Mostrar y configurar campos académicos para aspirantes
   * Carga los niveles académicos disponibles y configura la visibilidad
   */
  showAcademicFields() {
    this.logger.info("🎓 Mostrando campos académicos para aspirante");

    const academicLevelElement = this.formElement.querySelector(
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.ACADEMIC_LEVEL]
    );

    if (!academicLevelElement) {
      this.ui.createAcademicLevelField(this.formElement);
    }

    // Load and populate academic levels
    this._loadAndPopulateAcademicLevels();

    this.academicFieldsState[AcademicFieldsManager.STATE_FIELDS.IS_VISIBLE] = true;
  }

  /**
   * Ocultar todos los campos académicos y limpiar su estado
   * Se ejecuta cuando el tipo de asistente no es "Aspirante"
   */
  hideAcademicFields() {
    this.logger.info("👤 Ocultando campos académicos");

    const fieldSelectors = [
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.ACADEMIC_LEVEL],
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.FACULTY],
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.PROGRAM],
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.ADMISSION_PERIOD],
    ];

    fieldSelectors.forEach((selector) => {
      const element = this.formElement.querySelector(selector);
      if (element) {
        this.ui.hideElement(element);
        element.value = "";
      }
    });

    // Clear academic data from state
    this._clearAcademicState();

    this.academicFieldsState[AcademicFieldsManager.STATE_FIELDS.IS_VISIBLE] = false;
  }

  /**
   * Procesar cambio en la selección de nivel académico
   * Carga facultades y períodos correspondientes al nivel seleccionado
   * @param {string} levelValue - Código del nivel académico seleccionado
   */
  handleAcademicLevelChange(levelValue) {
    this.stateManager.updateField(AcademicFieldsManager.FIELD_TYPES.ACADEMIC_LEVEL, levelValue);
    this.academicFieldsState[AcademicFieldsManager.STATE_FIELDS.CURRENT_LEVEL] = levelValue;

    if (levelValue) {
      this._loadFacultiesForLevel(levelValue);
      this._loadPeriodsForLevel(levelValue);
    } else {
      this._hideDependentFields([
        AcademicFieldsManager.FIELD_TYPES.FACULTY,
        AcademicFieldsManager.FIELD_TYPES.PROGRAM,
        AcademicFieldsManager.FIELD_TYPES.ADMISSION_PERIOD,
      ]);
    }
  }

  /**
   * Procesar cambio en la selección de facultad
   * Carga los programas académicos disponibles para la facultad
   * @param {string} facultyValue - Código de la facultad seleccionada
   */
  handleFacultyChange(facultyValue) {
    this.stateManager.updateField(AcademicFieldsManager.FIELD_TYPES.FACULTY, facultyValue);
    this.academicFieldsState[AcademicFieldsManager.STATE_FIELDS.CURRENT_FACULTY] = facultyValue;

    if (facultyValue) {
      this._loadProgramsForFaculty(facultyValue);
    } else {
      this._hideDependentFields([AcademicFieldsManager.FIELD_TYPES.PROGRAM]);
    }
  }

  /**
   * Activar lógica para campos que fueron auto-seleccionados
   * Ejecuta las acciones necesarias cuando un campo se selecciona automáticamente
   */
  processAutoSelectedFields() {
    const currentAcademicLevel = this.stateManager.getField(
      AcademicFieldsManager.FIELD_TYPES.ACADEMIC_LEVEL
    );
    if (currentAcademicLevel) {
      this.logger.info(`🔄 Procesando nivel académico auto-seleccionado: ${currentAcademicLevel}`);
      this.handleAcademicLevelChange(currentAcademicLevel);
    }
  }

  /**
   * Cargar niveles académicos desde configuración o datos
   * Puebla el select y maneja auto-selección si solo hay una opción
   */
  _loadAndPopulateAcademicLevels() {
    const availableLevels =
      this.config.academicLevels.length > 0
        ? this.config.academicLevels
        : this.dataManager.getAcademicLevels();

    this.academicFieldsState.availableLevels = availableLevels;

    const academicLevelSelector =
      this.inputSelectors[AcademicFieldsManager.FIELD_SELECTORS.ACADEMIC_LEVEL];
    this.ui.populateSelect(academicLevelSelector, availableLevels, "code", "name");

    // Auto-select if only one level available
    const wasAutoSelected = this.autoSelectManager.autoSelectAcademicLevel(availableLevels);

    if (!wasAutoSelected) {
      const academicLevelElement = this.formElement.querySelector(academicLevelSelector);
      this.ui.showElement(academicLevelElement);
    }
  }

  /**
   * Cargar facultades filtradas para un nivel académico
   * Aplica filtros de configuración y maneja auto-selección
   * @param {string} academicLevel - Nivel académico seleccionado
   */
  _loadFacultiesForLevel(academicLevel) {
    let faculties = this.dataManager.getFaculties(academicLevel);

    // Aplicar filtro de facultades si está configurado
    if (this.config.faculties && this.config.faculties.length > 0) {
      faculties = faculties.filter((faculty) => this.config.faculties.includes(faculty));
      this.logger.info(
        `Facultades filtradas: ${faculties.length} de ${
          this.dataManager.getFaculties(academicLevel).length
        }`
      );
    }

    this.academicFieldsState.availableFaculties = faculties;

    const facultyElement = this.formElement.querySelector(this.inputSelectors.faculty);
    this.ui.populateSelect(this.inputSelectors.faculty, faculties);

    // Auto-seleccionar si solo hay una facultad
    const autoSelected = this.autoSelectManager.autoSelectFaculty(faculties);

    if (!autoSelected) {
      this.ui.showElement(facultyElement);
      this.stateManager.setFieldVisibility("faculty", true);
    }
  }

  /**
   * Cargar programas académicos para una facultad específica
   * Aplica filtros de configuración y maneja auto-selección
   * @param {string} faculty - Facultad seleccionada
   */
  _loadProgramsForFaculty(faculty) {
    const academicLevel = this.academicFieldsState.currentLevel;
    let programs = this.dataManager.getPrograms(academicLevel, faculty);

    // Aplicar filtro de programas si está configurado
    if (this.config.programs && this.config.programs.length > 0) {
      programs = programs.filter((program) => {
        const programCode = program.Codigo || program.codigo || program;
        return this.config.programs.includes(programCode);
      });
      this.logger.info(
        `Programas filtrados: ${programs.length} de ${
          this.dataManager.getPrograms(academicLevel, faculty).length
        }`
      );
    }

    this.academicFieldsState.availablePrograms = programs;
    this.logger.info(`Cargados ${programs ? programs.length : 0} programas para ${faculty}`);

    const programElement = this.formElement.querySelector(this.inputSelectors.program);
    this.ui.populateSelect(this.inputSelectors.program, programs, "Codigo", "Nombre");

    // Auto-seleccionar si solo hay un programa
    const autoSelected = this.autoSelectManager.autoSelectProgram(programs);

    if (!autoSelected) {
      this.ui.showElement(programElement);
      this.stateManager.setFieldVisibility("program", true);
    }
  }

  /**
   * Cargar períodos de admisión para el nivel académico
   * @param {string} academicLevel - Nivel académico seleccionado
   */
  _loadPeriodsForLevel(academicLevel) {
    const periods = this.dataManager.getPeriods(academicLevel);
    this.academicFieldsState.availablePeriods = periods;

    this.ui.populateSelect(this.inputSelectors.admissionPeriod, periods, "codigo", "nombre");
    this.ui.showElement(this.formElement.querySelector(this.inputSelectors.admissionPeriod));
    this.stateManager.setFieldVisibility("admission_period", true);
  }

  /**
   * Ocultar campos que dependen de otro campo
   * @param {Array} fieldTypes - Tipos de campos a ocultar
   */
  _hideDependentFields(fieldTypes) {
    fieldTypes.forEach((fieldType) => {
      const selector = this.inputSelectors[fieldType];
      if (selector) {
        const element = this.formElement.querySelector(selector);
        if (element) {
          this.ui.hideElement(element);
          this.stateManager.setFieldVisibility(fieldType, false);
        }
      }
    });
  }

  /**
   * Restablecer todos los valores y estado de campos académicos
   */
  _clearAcademicState() {
    const academicFields = ["academic_level", "faculty", "program", "admission_period"];

    academicFields.forEach((field) => {
      this.stateManager.updateField(field, "");
    });

    // Limpiar estado interno
    this.academicFieldsState = {
      ...this.academicFieldsState,
      currentLevel: null,
      currentFaculty: null,
      availableLevels: [],
      availableFaculties: [],
      availablePrograms: [],
      availablePeriods: [],
    };
  }

  /**
   * Verificar si los campos académicos están actualmente visibles
   * @returns {boolean} - True si están visibles
   */
  areFieldsVisible() {
    return this.academicFieldsState.isVisible;
  }

  /**
   * Obtener información completa del estado académico
   * @returns {Object} - Estado completo con datos del formulario
   */
  getAcademicState() {
    return {
      ...this.academicFieldsState,
      formData: {
        academic_level: this.stateManager.getField("academic_level"),
        faculty: this.stateManager.getField("faculty"),
        program: this.stateManager.getField("program"),
        admission_period: this.stateManager.getField("admission_period"),
      },
    };
  }

  /**
   * Validar completitud de campos académicos para aspirantes
   * @returns {Object} - Resultado de validación con errores si los hay
   */
  validateAcademicFields() {
    if (!this.academicFieldsState.isVisible) {
      return { isValid: true, errors: [] };
    }

    const errors = [];
    const requiredFields = ["academic_level", "faculty", "program", "admission_period"];

    requiredFields.forEach((field) => {
      const value = this.stateManager.getField(field);
      if (!value || value.trim() === "") {
        errors.push(`${field} es requerido para aspirantes`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Recargar y actualizar todos los datos académicos
   * Útil cuando se actualizan las fuentes de datos
   */
  async refreshAcademicData() {
    if (this.academicFieldsState.isVisible) {
      this.logger.info("🔄 Refrescando datos académicos");
      this._loadAndPopulateAcademicLevels();

      if (this.academicFieldsState.currentLevel) {
        this._loadFacultiesForLevel(this.academicFieldsState.currentLevel);
        this._loadPeriodsForLevel(this.academicFieldsState.currentLevel);
      }

      if (this.academicFieldsState.currentFaculty) {
        this._loadProgramsForFaculty(this.academicFieldsState.currentFaculty);
      }
    }
  }
}
