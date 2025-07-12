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
import { Constants } from "./Constants.js";

export class AutoSelectManager {
  // Mapeo de claves de estado para campos del formulario
  static STATE_KEYS = {
    TYPE_ATTENDEE: "type_attendee",
    ATTENDANCE_DAY: "attendance_day",
    ACADEMIC_LEVEL: "academic_level",
    FACULTY: "faculty",
    PROGRAM: "program",
  };

  constructor(formElement, stateManager, ui, inputSelectors) {
    this.formElement = formElement;
    this.stateManager = stateManager;
    this.ui = ui;
    this.inputSelectors = inputSelectors;

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
   * Método genérico para auto-seleccionar cualquier campo con una sola opción
   * @param {Array} options - Opciones disponibles
   * @param {string} fieldType - Tipo de campo (de FIELD_TYPES)
   * @param {Function} valueExtractor - Función para extraer valor (opcional)
   * @returns {boolean} - True si se auto-seleccionó
   */
  autoSelectGeneric(options, fieldType, valueExtractor = (option) => option) {
    // Validar que hay exactamente una opción
    if (!this.shouldAutoSelect(options)) {
      return false;
    }

    // Mapeo de configuración por tipo de campo
    const fieldConfig = {
      [Constants.AUTO_SELECT_TYPES.ATTENDEE_TYPE]: {
        selector: this.inputSelectors.typeAttendee,
        stateKey: AutoSelectManager.STATE_KEYS.TYPE_ATTENDEE,
        delay: Constants.AUTO_SELECT_DELAYS.TYPE_ATTENDEE,
        logPrefix: "Tipo de asistente",
      },
      [Constants.AUTO_SELECT_TYPES.ATTENDANCE_DAY]: {
        selector: this.inputSelectors.attendanceDay,
        stateKey: AutoSelectManager.STATE_KEYS.ATTENDANCE_DAY,
        delay: Constants.AUTO_SELECT_DELAYS.ATTENDANCE_DAY,
        logPrefix: "Día de asistencia",
      },
      [Constants.AUTO_SELECT_TYPES.ACADEMIC_LEVEL]: {
        selector: this.inputSelectors.academicLevel,
        stateKey: AutoSelectManager.STATE_KEYS.ACADEMIC_LEVEL,
        delay: Constants.AUTO_SELECT_DELAYS.ACADEMIC_LEVEL,
        logPrefix: "Nivel académico",
      },
      [Constants.AUTO_SELECT_TYPES.FACULTY]: {
        selector: this.inputSelectors.faculty,
        stateKey: AutoSelectManager.STATE_KEYS.FACULTY,
        delay: Constants.AUTO_SELECT_DELAYS.FACULTY,
        logPrefix: "Facultad",
      },
      [Constants.AUTO_SELECT_TYPES.PROGRAM]: {
        selector: this.inputSelectors.program,
        stateKey: AutoSelectManager.STATE_KEYS.PROGRAM,
        delay: Constants.AUTO_SELECT_DELAYS.PROGRAM,
        logPrefix: "Programa",
      },
    };

    const config = fieldConfig[fieldType];
    if (!config) {
      Logger.warn(`Tipo de campo no reconocido: ${fieldType}`);
      return false;
    }

    const element = this.formElement.querySelector(config.selector);
    if (!element) {
      Logger.warn(`Elemento no encontrado para ${config.logPrefix}`);
      return false;
    }

    const singleOption = options[0];
    const value = valueExtractor(singleOption);
    const displayName = singleOption.name || singleOption.Nombre || value;

    return this._autoSelectField({
      element,
      value,
      stateKey: config.stateKey,
      logMessage: `${config.logPrefix} auto-seleccionado y ocultado: ${displayName}`,
      callbackType: fieldType,
      callbackValue: value,
      delay: config.delay,
    });
  }

  /**
   * Auto-seleccionar tipo de asistente (método de conveniencia)
   */
  autoSelectTypeAttendee(attendeeTypeOptions) {
    return this.autoSelectGeneric(attendeeTypeOptions, Constants.AUTO_SELECT_TYPES.ATTENDEE_TYPE);
  }

  /**
   * Auto-seleccionar día de asistencia (método de conveniencia)
   */
  autoSelectAttendanceDay(attendanceDays) {
    return this.autoSelectGeneric(attendanceDays, Constants.AUTO_SELECT_TYPES.ATTENDANCE_DAY);
  }

  /**
   * Auto-seleccionar nivel académico (método de conveniencia)
   */
  autoSelectAcademicLevel(academicLevels) {
    return this.autoSelectGeneric(
      academicLevels,
      Constants.AUTO_SELECT_TYPES.ACADEMIC_LEVEL,
      (level) => level.code || level // Extractor para obtener el código
    );
  }

  /**
   * Auto-seleccionar facultad (método de conveniencia)
   */
  autoSelectFaculty(faculties) {
    return this.autoSelectGeneric(faculties, Constants.AUTO_SELECT_TYPES.FACULTY);
  }

  /**
   * Auto-seleccionar programa académico (método de conveniencia)
   */
  autoSelectProgram(programs) {
    return this.autoSelectGeneric(
      programs,
      Constants.AUTO_SELECT_TYPES.PROGRAM,
      (program) => program.Codigo || program.codigo || program // Extractor para códigos
    );
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
    delay = 0,
  }) {
    if (!element || !value) return false;

    // Establecer valor en el elemento DOM
    element.value = value;

    // Actualizar estado
    this.stateManager.updateField(stateKey, value);

    // Ocultar elemento
    this.ui.hideElement(element);

    // Log de la operación
    Logger.info(logMessage);

    // Ejecutar callback si existe
    const callback = this.callbacks.get(callbackType);
    if (callback) {
      if (delay > 0) {
        setTimeout(() => {
          Logger.info(`🚀 Ejecutando lógica para campo auto-seleccionado: ${callbackValue}`);
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
      [Constants.AUTO_SELECT_TYPES.ATTENDEE_TYPE]: false,
      [Constants.AUTO_SELECT_TYPES.ATTENDANCE_DAY]: false,
      [Constants.AUTO_SELECT_TYPES.ACADEMIC_LEVEL]: false,
    };

    // Auto-select attendee type
    autoSelectionResults[Constants.AUTO_SELECT_TYPES.ATTENDEE_TYPE] = this.autoSelectTypeAttendee(
      config.typeAttendee || []
    );

    // Auto-select attendance day
    autoSelectionResults[Constants.AUTO_SELECT_TYPES.ATTENDANCE_DAY] = this.autoSelectAttendanceDay(
      config.attendanceDays || []
    );

    // Auto-select academic level
    autoSelectionResults[Constants.AUTO_SELECT_TYPES.ACADEMIC_LEVEL] = this.autoSelectAcademicLevel(
      config.academicLevels || []
    );

    Logger.info("Proceso de auto-selección completado:", autoSelectionResults);
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
