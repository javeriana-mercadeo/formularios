/**
 * Academic - Módulo especializado para gestión de campos académicos
 * Maneja toda la lógica relacionada con nivel académico, facultades, programas y períodos
 * @version 1.0
 */

import { Constants } from "./Constants.js";

export class Academic {
  constructor(Data, Ui, state, logger = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar estado de campos académicos basado en tipo de asistente
   */
  initializeAcademicFields() {
    const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
    if (currentTypeAttendee === Constants.ATTENDEE_TYPES.APPLICANT) {
      this._showAcademicFields();
    } else {
      this._hideAcademicFields();
    }
  }

  /**
   * Manejar cambio de tipo de asistente
   */
  handleTypeAttendeeChange(value) {
    this.state.updateField(Constants.FIELDS.TYPE_ATTENDEE, value);

    this.logger.info(`👤 Tipo de asistente cambiado a: ${value}`);

    if (value === Constants.ATTENDEE_TYPES.APPLICANT) {
      this._showAcademicFields();
    } else {
      this._hideAcademicFields();
    }
  }

  /**
   * Manejar cambio de nivel académico
   */
  handleAcademicLevelChange(levelValue) {
    this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, levelValue);
    this.logger.info(`🎓 Nivel académico cambiado a: ${levelValue}`);

    if (levelValue) {
      this._loadFacultiesForLevel(levelValue);
    } else {
      this._hideAcademicDependentFields(["faculty", "program", "admissionPeriod"]);
    }
  }

  /**
   * Manejar cambio de facultad
   */
  handleFacultyChange(facultyValue) {
    this.state.updateField(Constants.FIELDS.FACULTY, facultyValue);
    this.logger.info(`🏛️ Facultad cambiada a: ${facultyValue}`);

    if (facultyValue) {
      this._loadProgramsForFaculty(facultyValue);
    } else {
      this._hideAcademicDependentFields(["program", "admissionPeriod"]);
    }
  }

  /**
   * Manejar cambio de programa académico
   */
  handleProgramChange(programValue) {
    this.state.updateField(Constants.FIELDS.PROGRAM, programValue);
    this.logger.info(`📚 Programa académico cambiado a: ${programValue}`);

    if (programValue) {
      const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL);
      if (currentAcademicLevel) {
        this._loadPeriodsForLevel(currentAcademicLevel);
      }
    } else {
      this._hideAcademicDependentFields(["admissionPeriod"]);
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - MOSTRAR/OCULTAR
  // ===============================

  /**
   * Mostrar campos académicos
   * @private
   */
  _showAcademicFields() {
    const academicLevels = this.Data.getAcademicLevels();

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.ACADEMIC_LEVEL,
      options: academicLevels.map((level) => ({
        value: level.code,
        text: level.name,
      })),
    });

    this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true);
  }

  /**
   * Ocultar campos académicos y limpiar errores
   * @private
   */
  _hideAcademicFields() {
    this.logger.info("🧹 [ACADEMIC] Ocultando y limpiando campos académicos");

    const academicFields = [
      { key: Constants.FIELDS.ACADEMIC_LEVEL, selector: Constants.SELECTORS.ACADEMIC_LEVEL },
      { key: Constants.FIELDS.FACULTY, selector: Constants.SELECTORS.FACULTY },
      { key: Constants.FIELDS.PROGRAM, selector: Constants.SELECTORS.PROGRAM },
      { key: Constants.FIELDS.ADMISSION_PERIOD, selector: Constants.SELECTORS.ADMISSION_PERIOD },
    ];

    academicFields.forEach(({ key, selector }) => {
      this.logger.info(`🧹 [ACADEMIC] Limpiando campo: ${key}`);

      const element = this.Ui.scopedQuery(selector);
      if (element) {
        // IMPORTANTE: Limpiar error ANTES de ocultar para evitar elementos DOM huérfanos
        this.Ui.hideFieldError(element);
        this.Ui.hideElement(element);

        this.logger.info(`👁️ [ACADEMIC] Elemento ${key} ocultado y error limpiado de UI`);
      }

      this.state.setFieldVisibility(key, false);
      this.state.updateField(key, "");
      this.state.clearValidationError(key);

      // Forzar limpieza adicional de cualquier elemento de error residual
      this._forceCleanFieldError(key);

      this.logger.info(`✅ [ACADEMIC] Estado limpiado para ${key}`);
    });

    this.logger.info("🧹 [ACADEMIC] Limpieza de campos académicos completada");
  }

  /**
   * Forzar limpieza de errores visuales de un campo específico
   * @private
   */
  _forceCleanFieldError(fieldKey) {
    // Buscar y limpiar TODOS los posibles elementos de error para este campo
    const possibleErrorSelectors = [
      `#error_${fieldKey}`,
      `[data-error-for="${fieldKey}"]`,
      `.error_text[data-error-for="${fieldKey}"]`,
    ];

    possibleErrorSelectors.forEach((selector) => {
      const errorElement = this.Ui.scopedQuery(selector);
      if (errorElement) {
        errorElement.style.display = "none";
        errorElement.textContent = "";

        this.logger.info(`🧹 [ACADEMIC] Error residual limpiado: ${selector}`);
      }
    });
  }

  /**
   * Ocultar campos dependientes académicos
   * @private
   */
  _hideAcademicDependentFields(fieldKeys) {
    const fieldMapping = {
      faculty: Constants.FIELDS.FACULTY,
      program: Constants.FIELDS.PROGRAM,
      admissionPeriod: Constants.FIELDS.ADMISSION_PERIOD,
    };

    const selectorMapping = {
      faculty: Constants.SELECTORS.FACULTY,
      program: Constants.SELECTORS.PROGRAM,
      admissionPeriod: Constants.SELECTORS.ADMISSION_PERIOD,
    };

    fieldKeys.forEach((key) => {
      const field = fieldMapping[key];
      const selector = selectorMapping[key];

      if (field && selector) {
        const element = this.Ui.scopedQuery(selector);
        if (element) {
          this.Ui.hideElement(element);
        }
        this.state.setFieldVisibility(field, false);
        this.state.updateField(field, "");
      }
    });
  }

  // ===============================
  // MÉTODOS PRIVADOS - CARGA DE DATOS
  // ===============================

  /**
   * Cargar facultades para un nivel académico
   * @private
   */
  _loadFacultiesForLevel(academicLevel) {
    const faculties = this.Data.getFaculties(academicLevel);

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.FACULTY,
      options: faculties.map((faculty) => ({
        value: faculty,
        text: faculty,
      })),
    });

    this.state.setFieldVisibility(Constants.FIELDS.FACULTY, true);
  }

  /**
   * Cargar programas para una facultad
   * @private
   */
  _loadProgramsForFaculty(facultyValue) {
    const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL);

    if (!currentAcademicLevel) {
      this.logger.warn("No se puede cargar programas sin nivel académico seleccionado");

      return;
    }

    const programs = this.Data.getPrograms(currentAcademicLevel, facultyValue);

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.PROGRAM,
      options: programs.map((program) => ({
        value: program.Codigo,
        text: program.Nombre,
      })),
    });

    this.state.setFieldVisibility(Constants.FIELDS.PROGRAM, true);
  }

  /**
   * Cargar períodos de admisión para un nivel académico
   * @private
   */
  _loadPeriodsForLevel(academicLevel) {
    const periods = this.Data.getPeriods(academicLevel);

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.ADMISSION_PERIOD,
      options: periods.map((period) => ({
        value: period.codigo,
        text: period.nombre,
      })),
    });

    this.state.setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, true);
  }

  // ===============================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ===============================

  /**
   * Obtener estado actual de campos académicos
   */
  getAcademicState() {
    return {
      typeAttendee: this.state.getField(Constants.FIELDS.TYPE_ATTENDEE),
      academicLevel: this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL),
      faculty: this.state.getField(Constants.FIELDS.FACULTY),
      program: this.state.getField(Constants.FIELDS.PROGRAM),
      admissionPeriod: this.state.getField(Constants.FIELDS.ADMISSION_PERIOD),
    };
  }

  /**
   * Resetear todos los campos académicos
   */
  resetAcademicFields() {
    this.logger.info("🔄 Reseteando campos académicos");

    const academicFields = [
      Constants.FIELDS.ACADEMIC_LEVEL,
      Constants.FIELDS.FACULTY,
      Constants.FIELDS.PROGRAM,
      Constants.FIELDS.ADMISSION_PERIOD,
    ];

    academicFields.forEach((field) => {
      this.state.updateField(field, "");
      this.state.setFieldVisibility(field, false);
      this.state.clearValidationError(field);
    });

    this._hideAcademicFields();
  }
}
