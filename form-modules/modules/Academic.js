/**
 * Academic - Módulo especializado para gestión de campos académicos
 * Maneja toda la lógica relacionada con nivel académico, facultades, programas y períodos
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";

export class Academic {
  constructor(Data, Ui, stateManager, inputSelectors) {
    this.Data = Data;
    this.Ui = Ui;
    this.stateManager = stateManager;
    this.inputSelectors = inputSelectors;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar estado de campos académicos basado en tipo de asistente
   */
  initializeAcademicFields() {
    const currentTypeAttendee = this.stateManager.getField(Constants.FIELDS.TYPE_ATTENDEE);
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
    this.stateManager.updateField(Constants.FIELDS.TYPE_ATTENDEE, value);
    Logger.info(`👤 Tipo de asistente cambiado a: ${value}`);

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
    this.stateManager.updateField(Constants.FIELDS.ACADEMIC_LEVEL, levelValue);
    Logger.info(`🎓 Nivel académico cambiado a: ${levelValue}`);

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
    this.stateManager.updateField(Constants.FIELDS.FACULTY, facultyValue);
    Logger.info(`🏛️ Facultad cambiada a: ${facultyValue}`);

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
    this.stateManager.updateField(Constants.FIELDS.PROGRAM, programValue);
    Logger.info(`📚 Programa académico cambiado a: ${programValue}`);

    if (programValue) {
      const currentAcademicLevel = this.stateManager.getField(Constants.FIELDS.ACADEMIC_LEVEL);
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
      selector: this.inputSelectors.academicLevel,
      options: academicLevels.map((level) => ({
        value: level.code,
        text: level.name,
      })),
    });

    this.stateManager.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true);
  }

  /**
   * Ocultar campos académicos y limpiar errores
   * @private
   */
  _hideAcademicFields() {
    const academicFields = [
      { key: Constants.FIELDS.ACADEMIC_LEVEL, selector: this.inputSelectors.academicLevel },
      { key: Constants.FIELDS.FACULTY, selector: this.inputSelectors.faculty },
      { key: Constants.FIELDS.PROGRAM, selector: this.inputSelectors.program },
      { key: Constants.FIELDS.ADMISSION_PERIOD, selector: this.inputSelectors.admissionPeriod },
    ];

    academicFields.forEach(({ key, selector }) => {
      const element = document.querySelector(selector);
      if (element) {
        this.Ui.hideElement(element);
        this.Ui.hideFieldError(element);
      }
      this.stateManager.setFieldVisibility(key, false);
      this.stateManager.updateField(key, "");
      this.stateManager.clearValidationError(key);
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
      faculty: this.inputSelectors.faculty,
      program: this.inputSelectors.program,
      admissionPeriod: this.inputSelectors.admissionPeriod,
    };

    fieldKeys.forEach((key) => {
      const field = fieldMapping[key];
      const selector = selectorMapping[key];

      if (field && selector) {
        const element = document.querySelector(selector);
        if (element) {
          this.Ui.hideElement(element);
        }
        this.stateManager.setFieldVisibility(field, false);
        this.stateManager.updateField(field, "");
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
      selector: this.inputSelectors.faculty,
      options: faculties.map((faculty) => ({
        value: faculty,
        text: faculty,
      })),
    });

    this.stateManager.setFieldVisibility(Constants.FIELDS.FACULTY, true);
  }

  /**
   * Cargar programas para una facultad
   * @private
   */
  _loadProgramsForFaculty(facultyValue) {
    const currentAcademicLevel = this.stateManager.getField(Constants.FIELDS.ACADEMIC_LEVEL);

    if (!currentAcademicLevel) {
      Logger.warn("No se puede cargar programas sin nivel académico seleccionado");
      return;
    }

    const programs = this.Data.getPrograms(currentAcademicLevel, facultyValue);

    this.Ui.populateSelect({
      selector: this.inputSelectors.program,
      options: programs.map((program) => ({
        value: program.Codigo,
        text: program.Nombre,
      })),
    });

    this.stateManager.setFieldVisibility(Constants.FIELDS.PROGRAM, true);
  }

  /**
   * Cargar períodos de admisión para un nivel académico
   * @private
   */
  _loadPeriodsForLevel(academicLevel) {
    const periods = this.Data.getPeriods(academicLevel);

    this.Ui.populateSelect({
      selector: this.inputSelectors.admissionPeriod,
      options: periods.map((period) => ({
        value: period.codigo,
        text: period.nombre,
      })),
    });

    this.stateManager.setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, true);
  }

  // ===============================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ===============================

  /**
   * Obtener estado actual de campos académicos
   */
  getAcademicState() {
    return {
      typeAttendee: this.stateManager.getField(Constants.FIELDS.TYPE_ATTENDEE),
      academicLevel: this.stateManager.getField(Constants.FIELDS.ACADEMIC_LEVEL),
      faculty: this.stateManager.getField(Constants.FIELDS.FACULTY),
      program: this.stateManager.getField(Constants.FIELDS.PROGRAM),
      admissionPeriod: this.stateManager.getField(Constants.FIELDS.ADMISSION_PERIOD),
    };
  }

  /**
   * Validar que los campos académicos estén completos
   */
  validateAcademicFields() {
    const typeAttendee = this.stateManager.getField(Constants.FIELDS.TYPE_ATTENDEE);

    // Solo validar si es aspirante
    if (typeAttendee !== Constants.ATTENDEE_TYPES.APPLICANT) {
      return true;
    }

    const academicLevel = this.stateManager.getField(Constants.FIELDS.ACADEMIC_LEVEL);
    const faculty = this.stateManager.getField(Constants.FIELDS.FACULTY);
    const program = this.stateManager.getField(Constants.FIELDS.PROGRAM);
    const admissionPeriod = this.stateManager.getField(Constants.FIELDS.ADMISSION_PERIOD);

    const missingFields = [];
    if (!academicLevel) missingFields.push("Nivel académico");
    if (!faculty) missingFields.push("Facultad");
    if (!program) missingFields.push("Programa");
    if (!admissionPeriod) missingFields.push("Período de admisión");

    if (missingFields.length > 0) {
      Logger.warn(`Campos académicos incompletos: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  }

  /**
   * Resetear todos los campos académicos
   */
  resetAcademicFields() {
    Logger.info("🔄 Reseteando campos académicos");

    const academicFields = [
      Constants.FIELDS.ACADEMIC_LEVEL,
      Constants.FIELDS.FACULTY,
      Constants.FIELDS.PROGRAM,
      Constants.FIELDS.ADMISSION_PERIOD,
    ];

    academicFields.forEach((field) => {
      this.stateManager.updateField(field, "");
      this.stateManager.setFieldVisibility(field, false);
      this.stateManager.clearValidationError(field);
    });

    this._hideAcademicFields();
  }
}
