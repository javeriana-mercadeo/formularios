/**
 * AutoSelectManager - Gestor de auto-selección de campos únicos
 * 
 * Responsabilidades:
 * - Auto-seleccionar campos cuando solo hay una opción disponible
 * - Ocultar campos auto-seleccionados para simplificar la interfaz
 * - Ejecutar callbacks para activar lógica dependiente
 * - Gestionar delays apropiados para cada tipo de campo
 * - Centralizar toda la lógica de auto-selección en un solo lugar
 * 
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class AutoSelectManager {
  // Constantes para tipos de campos con auto-selección
  static FIELD_TYPES = {
    ATTENDEE_TYPE: "typeAttendee",
    ATTENDANCE_DAY: "attendanceDay", 
    ACADEMIC_LEVEL: "academicLevel",
    FACULTY: "faculty",
    PROGRAM: "program"
  };

  // Delays por defecto para diferentes tipos de campo (en milisegundos)
  static DEFAULT_DELAYS = {
    TYPE_ATTENDEE: 50,
    ACADEMIC_LEVEL: 100,
    FACULTY: 100,
    PROGRAM: 0,
    ATTENDANCE_DAY: 0
  };

  // Mapeo de claves de estado para campos del formulario
  static STATE_KEYS = {
    TYPE_ATTENDEE: 'type_attendee',
    ATTENDANCE_DAY: 'attendance_day',
    ACADEMIC_LEVEL: 'academic_level',
    FACULTY: 'faculty',
    PROGRAM: 'program'
  };

  constructor(formElement, stateManager, ui, inputSelectors, loggerConfig = {}) {
    this.formElement = formElement;
    this.stateManager = stateManager;
    this.ui = ui;
    this.inputSelectors = inputSelectors;
    this.logger = new Logger("AutoSelectManager", loggerConfig);
    
    // Callbacks to execute when a field is auto-selected
    this.callbacks = new Map();
  }

  /**
   * Registrar función callback para ejecutar tras auto-selección
   * @param {string} fieldType - Tipo de campo
   * @param {Function} callback - Función a ejecutar
   */
  onAutoSelect(fieldType, callback) {
    this.callbacks.set(fieldType, callback);
  }

  /**
   * Auto-seleccionar tipo de asistente cuando hay una sola opción
   * @param {Array} attendeeTypeOptions - Opciones de tipo de asistente
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectTypeAttendee(attendeeTypeOptions) {
    if (attendeeTypeOptions.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.typeAttendee);
      if (element) {
        const singleType = attendeeTypeOptions[0];
        return this._autoSelectField({
          element,
          value: singleType,
          stateKey: AutoSelectManager.STATE_KEYS.TYPE_ATTENDEE,
          logMessage: `Tipo de asistente auto-seleccionado y ocultado: ${singleType}`,
          callbackType: AutoSelectManager.FIELD_TYPES.ATTENDEE_TYPE,
          callbackValue: singleType,
          delay: AutoSelectManager.DEFAULT_DELAYS.TYPE_ATTENDEE
        });
      }
    }
    return false;
  }

  /**
   * Auto-seleccionar día de asistencia cuando hay una sola opción
   * @param {Array} attendanceDays - Opciones de días de asistencia
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectAttendanceDay(attendanceDays) {
    if (attendanceDays.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.attendanceDay);
      if (element) {
        const singleDay = attendanceDays[0];
        return this._autoSelectField({
          element,
          value: singleDay,
          stateKey: AutoSelectManager.STATE_KEYS.ATTENDANCE_DAY,
          logMessage: `Día de asistencia auto-seleccionado y ocultado: ${singleDay}`,
          callbackType: AutoSelectManager.FIELD_TYPES.ATTENDANCE_DAY,
          callbackValue: singleDay,
          delay: AutoSelectManager.DEFAULT_DELAYS.ATTENDANCE_DAY
        });
      }
    }
    return false;
  }

  /**
   * Auto-seleccionar nivel académico cuando hay una sola opción
   * @param {Array} academicLevels - Opciones de niveles académicos
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectAcademicLevel(academicLevels) {
    if (academicLevels && academicLevels.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.academicLevel);
      if (element) {
        const academicLevel = academicLevels[0];
        const fieldValue = academicLevel.code || academicLevel;
        const displayName = academicLevel.name || fieldValue;
        
        return this._autoSelectField({
          element,
          value: fieldValue,
          stateKey: AutoSelectManager.STATE_KEYS.ACADEMIC_LEVEL,
          logMessage: `Nivel académico auto-seleccionado y ocultado: ${displayName}`,
          callbackType: AutoSelectManager.FIELD_TYPES.ACADEMIC_LEVEL,
          callbackValue: fieldValue,
          delay: AutoSelectManager.DEFAULT_DELAYS.ACADEMIC_LEVEL
        });
      }
    }
    return false;
  }

  /**
   * Auto-seleccionar facultad cuando hay una sola opción
   * @param {Array} faculties - Opciones de facultades
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectFaculty(faculties) {
    if (faculties && faculties.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.faculty);
      if (element) {
        const facultyValue = faculties[0];
        return this._autoSelectField({
          element,
          value: facultyValue,
          stateKey: AutoSelectManager.STATE_KEYS.FACULTY,
          logMessage: `Facultad auto-seleccionada y ocultada: ${facultyValue}`,
          callbackType: AutoSelectManager.FIELD_TYPES.FACULTY,
          callbackValue: facultyValue,
          delay: AutoSelectManager.DEFAULT_DELAYS.FACULTY
        });
      }
    }
    return false;
  }

  /**
   * Auto-seleccionar programa académico cuando hay una sola opción
   * @param {Array} programs - Opciones de programas
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectProgram(programs) {
    if (programs && programs.length === 1) {
      const element = this.formElement.querySelector(this.inputSelectors.program);
      if (element) {
        const program = programs[0];
        const programValue = program.Codigo || program.codigo || program;
        const programName = program.Nombre || program.nombre || programValue;
        
        return this._autoSelectField({
          element,
          value: programValue,
          stateKey: AutoSelectManager.STATE_KEYS.PROGRAM,
          logMessage: `Programa auto-seleccionado y ocultado: ${programName}`,
          callbackType: AutoSelectManager.FIELD_TYPES.PROGRAM,
          callbackValue: programValue,
          delay: AutoSelectManager.DEFAULT_DELAYS.PROGRAM
        });
      }
    }
    return false;
  }

  /**
   * Método interno para ejecutar auto-selección de cualquier campo
   * Unifica la lógica común de auto-selección, ocultado y callbacks
   * @param {Object} options - Opciones de configuración
   * @returns {boolean} - True si se ejecutó correctamente
   */
  _autoSelectField({
    element,
    value,
    stateKey,
    logMessage,
    callbackType,
    callbackValue,
    delay = 0
  }) {
    if (!element || !value) return false;

    // Establecer valor en el elemento DOM
    element.value = value;
    
    // Actualizar estado
    this.stateManager.updateField(stateKey, value);
    
    // Ocultar elemento
    this.ui.hideElement(element);
    
    // Log de la operación
    this.logger.info(logMessage);

    // Ejecutar callback si existe
    const callback = this.callbacks.get(callbackType);
    if (callback) {
      if (delay > 0) {
        setTimeout(() => {
          this.logger.info(`🚀 Ejecutando lógica para campo auto-seleccionado: ${callbackValue}`);
          callback(callbackValue);
        }, delay);
      } else {
        callback(callbackValue);
      }
    }

    return true;
  }

  /**
   * Ejecutar auto-selección para todos los campos configurados
   * @param {Object} config - Configuración del formulario
   * @returns {Object} - Resultados de auto-selección por campo
   */
  autoSelectAllConfiguredFields(config) {
    const autoSelectionResults = {
      [AutoSelectManager.FIELD_TYPES.ATTENDEE_TYPE]: false,
      [AutoSelectManager.FIELD_TYPES.ATTENDANCE_DAY]: false,
      [AutoSelectManager.FIELD_TYPES.ACADEMIC_LEVEL]: false
    };

    // Auto-select attendee type
    autoSelectionResults[AutoSelectManager.FIELD_TYPES.ATTENDEE_TYPE] = 
      this.autoSelectTypeAttendee(config.typeAttendee || []);

    // Auto-select attendance day
    autoSelectionResults[AutoSelectManager.FIELD_TYPES.ATTENDANCE_DAY] = 
      this.autoSelectAttendanceDay(config.attendanceDays || []);

    // Auto-select academic level
    autoSelectionResults[AutoSelectManager.FIELD_TYPES.ACADEMIC_LEVEL] = 
      this.autoSelectAcademicLevel(config.academicLevels || []);

    this.logger.info("Proceso de auto-selección completado:", autoSelectionResults);
    return autoSelectionResults;
  }

  /**
   * Buscar elemento en el formulario usando selector
   * @param {string} selector - Selector CSS del elemento
   * @returns {HTMLElement|null} - Elemento encontrado
   */
  _getElement(selector) {
    return this.formElement.querySelector(selector);
  }

  /**
   * Verificar si las opciones califican para auto-selección
   * @param {Array} options - Opciones a evaluar
   * @returns {boolean} - True si debe auto-seleccionarse
   */
  shouldAutoSelect(options) {
    return Array.isArray(options) && options.length === 1;
  }

  /**
   * Remover todos los callbacks registrados
   */
  clearCallbacks() {
    this.callbacks.clear();
  }

  /**
   * Obtener lista de tipos de campo con callbacks registrados
   * @returns {Array} - Lista de tipos de campo
   */
  getRegisteredCallbacks() {
    return Array.from(this.callbacks.keys());
  }
}