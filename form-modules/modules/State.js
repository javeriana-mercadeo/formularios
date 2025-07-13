/**
 * State - Maneja el estado del formulario
 * Centraliza la lógica de estado y emite eventos de cambios
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";
import { Config } from "./Config.js";

export class State {
  constructor(eventManager = null) {
    this.eventManager = eventManager;
    this.state = this._getInitialState();
    this.UiState = this._getInitialUiState();
    this.validationState = this._getInitialValidationState();
    this.systemState = this._getInitialSystemState();
  }

  // ===============================
  // GESTIÓN DE ESTADO DE FORMULARIO
  // ===============================

  /**
   * Actualizar campo específico del formulario
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Nuevo valor
   * @returns {boolean} - True si se actualizó correctamente
   */
  updateField(fieldName, value) {
    if (!this.state.hasOwnProperty(fieldName)) {
      Logger.warn(`Intento de actualizar campo inexistente: ${fieldName}`);
      return false;
    }

    const previousValue = this.state[fieldName];

    // Solo actualizar si el valor realmente cambió
    if (previousValue !== value) {
      this.state[fieldName] = value;

      Logger.debug(`Campo actualizado: ${fieldName}`, {
        previousValue,
        currentValue: value,
      });

      // Emitir eventos de cambio
      this._emitFieldChangeEvents(fieldName, previousValue, value);
    }

    return true;
  }

  /**
   * Establecer múltiples campos
   * @param {Object} fields - Objeto con campos y valores
   */
  setFields(fields) {
    Object.entries(fields).forEach(([fieldName, value]) => {
      this.updateField(fieldName, value);
    });
  }

  /**
   * Obtener valor de campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {any} - Valor del campo
   */
  getField(fieldName) {
    return this.state[fieldName];
  }

  /**
   * Obtener todo el estado del formulario
   * @returns {Object} - Copia del estado completo
   */
  getFormData() {
    return { ...this.state };
  }

  /**
   * Resetear formulario al estado inicial
   */
  reset() {
    const previousState = { ...this.state };
    this.state = this._getInitialState();
    this.validationState = this._getInitialValidationState();
    this.systemState.isSubmitting = false;

    Logger.info("Estado del formulario reseteado");

    // Emitir evento de reset
    this._emitEvent("stateReset", {
      previousState,
      newState: { ...this.state },
      timestamp: new Date().toISOString(),
    });
  }

  // ===============================
  // GESTIÓN DE ESTADO DE VALIDACIÓN
  // ===============================

  /**
   * Establecer error de validación
   * @param {string} fieldName - Nombre del campo
   * @param {string} error - Mensaje de error
   */
  setValidationError(fieldName, error) {
    const hadErrors = this.hasValidationErrors();
    this.validationState.errors[fieldName] = error;
    this._updateValidationState();

    // Emitir evento si cambió el estado de validación
    if (!hadErrors && this.hasValidationErrors()) {
      this._emitEvent("validationStateChanged", {
        isValid: false,
        newError: { fieldName, error },
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Limpiar error de validación
   * @param {string} fieldName - Nombre del campo
   */
  clearValidationError(fieldName) {
    const hadErrors = this.hasValidationErrors();
    delete this.validationState.errors[fieldName];
    this._updateValidationState();

    // Emitir evento si cambió el estado de validación
    if (hadErrors && !this.hasValidationErrors()) {
      this._emitEvent("validationStateChanged", {
        isValid: true,
        clearedError: fieldName,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Limpiar todos los errores de validación
   */
  clearValidationErrors() {
    const hadErrors = this.hasValidationErrors();
    this.validationState.errors = {};
    this.validationState.touchedFields.clear();
    this._updateValidationState();

    if (hadErrors) {
      this._emitEvent("validationStateChanged", {
        isValid: true,
        allErrorsCleared: true,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Marcar campo como tocado
   * @param {string} fieldName - Nombre del campo
   */
  markFieldAsTouched(fieldName) {
    if (!this.validationState.touchedFields.has(fieldName)) {
      this.validationState.touchedFields.add(fieldName);

      this._emitEvent("fieldTouched", {
        fieldName,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Verificar si campo ha sido tocado
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean}
   */
  isFieldTouched(fieldName) {
    return this.validationState.touchedFields.has(fieldName);
  }

  /**
   * Obtener errores de validación
   * @returns {Object} - Copia de los errores
   */
  getValidationErrors() {
    return { ...this.validationState.errors };
  }

  /**
   * Verificar si hay errores de validación
   * @returns {boolean}
   */
  hasValidationErrors() {
    return Object.keys(this.validationState.errors).length > 0;
  }

  /**
   * Verificar si el formulario es válido
   * @returns {boolean}
   */
  isValid() {
    return this.validationState.isValid;
  }

  // ===============================
  // GESTIÓN DE ESTADO DE Ui
  // ===============================

  /**
   * Mostrar/ocultar campo en Ui
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} visible - Si es visible o no
   */
  setFieldVisibility(fieldName, visible) {
    if (this.UiState.fieldsVisible.hasOwnProperty(fieldName)) {
      const previousValue = this.UiState.fieldsVisible[fieldName];

      if (previousValue !== visible) {
        this.UiState.fieldsVisible[fieldName] = visible;
        Logger.debug(`Visibilidad de campo ${fieldName}: ${visible}`);

        this._emitEvent("fieldVisibilityChanged", {
          fieldName,
          visible,
          previousValue,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Habilitar/deshabilitar campo en Ui
   * @param {string} fieldName - Nombre del campo
   * @param {boolean} disabled - Si está deshabilitado
   */
  setFieldDisabled(fieldName, disabled) {
    if (this.UiState.fieldsDisabled.hasOwnProperty(fieldName)) {
      const previousValue = this.UiState.fieldsDisabled[fieldName];

      if (previousValue !== disabled) {
        this.UiState.fieldsDisabled[fieldName] = disabled;
        Logger.debug(`Campo ${fieldName} ${disabled ? "deshabilitado" : "habilitado"}`);

        this._emitEvent("fieldDisabledChanged", {
          fieldName,
          disabled,
          previousValue,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Obtener estado de Ui
   * @returns {Object} - Copia del estado de Ui
   */
  getUiState() {
    return { ...this.UiState };
  }

  // ===============================
  // GESTIÓN DE ESTADO DEL SISTEMA
  // ===============================

  /**
   * Establecer estado del sistema
   * @param {string} key - Clave del estado
   * @param {any} value - Nuevo valor
   */
  setSystemState(key, value) {
    if (this.systemState.hasOwnProperty(key)) {
      const previousValue = this.systemState[key];

      if (previousValue !== value) {
        this.systemState[key] = value;
        Logger.debug(`Estado del sistema actualizado: ${key} = ${value}`);

        this._emitEvent("systemStateChanged", {
          key,
          value,
          previousValue,
          timestamp: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Obtener estado del sistema
   * @returns {Object} - Copia del estado del sistema
   */
  getSystemState() {
    return { ...this.systemState };
  }

  // ===============================
  // GESTIÓN DE MODOS DEL SISTEMA
  // ===============================

  /**
   * Establecer modo de desarrollo
   * @param {boolean} enabled - Si está habilitado
   */
  setDevMode(enabled) {
    this.setSystemState("devMode", enabled);
    // Sincronizar con Config
    if (Config.hasGlobalInstance()) {
      Config.updateConfig({ devMode: enabled });
    }
    Logger.info(`🔧 Modo desarrollo: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Establecer modo sandbox
   * @param {boolean} enabled - Si está habilitado
   */
  setSandboxMode(enabled) {
    this.setSystemState("sandboxMode", enabled);
    // Sincronizar con Config
    if (Config.hasGlobalInstance()) {
      Config.updateConfig({ sandboxMode: enabled });
    }
    Logger.info(`🧪 Modo sandbox: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Establecer modo debug
   * @param {boolean} enabled - Si está habilitado
   */
  setDebugMode(enabled) {
    this.setSystemState("debugMode", enabled);
    // Sincronizar con Config
    if (Config.hasGlobalInstance()) {
      Config.updateConfig({ debugMode: enabled });
    }
    Logger.info(`🐛 Modo debug: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
  }

  /**
   * Verificar si está en modo desarrollo
   * @returns {boolean}
   */
  isDevMode() {
    return this.systemState.devMode;
  }

  /**
   * Verificar si está en modo sandbox
   * @returns {boolean}
   */
  isSandboxMode() {
    return this.systemState.sandboxMode;
  }

  /**
   * Verificar si está en modo debug
   * @returns {boolean}
   */
  isDebugMode() {
    return this.systemState.debugMode;
  }

  /**
   * Sincronizar modos del sistema con la configuración actual
   * Se llama cuando la configuración cambia externamente
   */
  syncModesWithConfig() {
    const config = Config.hasGlobalInstance() ? Config.getConfig() : {};

    // Sincronizar cada modo si ha cambiado
    if (config.devMode !== undefined && this.systemState.devMode !== config.devMode) {
      this.setSystemState("devMode", config.devMode);
    }

    if (config.sandboxMode !== undefined && this.systemState.sandboxMode !== config.sandboxMode) {
      this.setSystemState("sandboxMode", config.sandboxMode);
    }

    if (config.debugMode !== undefined && this.systemState.debugMode !== config.debugMode) {
      this.setSystemState("debugMode", config.debugMode);
    }
  }

  // ===============================
  // MÉTODOS DE UTILIDAD
  // ===============================

  /**
   * Verificar si el formulario está listo para enviar
   * @returns {boolean}
   */
  isReadyToSubmit() {
    const authField = Constants.FIELDS.DATA_AUTHORIZATION;

    // En modo desarrollo, los reqUisitos son más flexibles
    if (this.systemState.devMode) {
      return !this.systemState.isSubmitting;
    }

    // En modo normal, se reqUiere validación y autorización
    return (
      this.validationState.isValid &&
      !this.systemState.isSubmitting &&
      this.state[authField] === "1"
    );
  }

  /**
   * Obtener resumen completo del estado
   * @returns {Object} - Resumen del estado
   */
  getStateSummary() {
    return {
      formData: this.getFormData(),
      UiState: this.getUiState(),
      validationState: {
        isValid: this.validationState.isValid,
        errorsCount: Object.keys(this.validationState.errors).length,
        touchedFieldsCount: this.validationState.touchedFields.size,
        errors: this.getValidationErrors(),
      },
      systemState: this.getSystemState(),
      isReadyToSubmit: this.isReadyToSubmit(),
    };
  }

  // ===============================
  // GESTIÓN DE EVENTOS
  // ===============================

  /**
   * Establecer el Event
   * @param {Event} eventManager - Instancia del Event
   */
  setEventManager(eventManager) {
    this.eventManager = eventManager;
    Logger.debug("Event configurado en State");
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Obtener estado inicial del formulario
   * @private
   */
  _getInitialState() {
    const { FIELDS } = Constants;

    return {
      // Campos ocultos
      [FIELDS.OID]: "",
      [FIELDS.RET_URL]: "",
      [FIELDS.DEBUG]: "0",
      [FIELDS.DEBUG_EMAIL]: "",

      // Campos ocultos obligatorios para el flujo en Salesforce
      [FIELDS.AUTHORIZATION_SOURCE]: "Landing Eventos",
      [FIELDS.REQUEST_ORIGIN]: "Web to Lead",
      [FIELDS.LEAD_SOURCE]: "Landing Pages",
      [FIELDS.COMPANY]: "NA",

      // Campos personales
      [FIELDS.FIRST_NAME]: "",
      [FIELDS.LAST_NAME]: "",
      [FIELDS.TYPE_DOC]: "",
      [FIELDS.DOCUMENT]: "",
      [FIELDS.EMAIL]: "",
      [FIELDS.PHONE_CODE]: "57",
      [FIELDS.PHONE]: "",

      // Campos de ubicación
      [FIELDS.COUNTRY]: "COL",
      [FIELDS.DEPARTMENT]: "",
      [FIELDS.CITY]: "",

      // Campos académicos
      [FIELDS.ACADEMIC_LEVEL]: "",
      [FIELDS.FACULTY]: "",
      [FIELDS.PROGRAM]: "",
      [FIELDS.ADMISSION_PERIOD]: "",

      // Campos del evento
      [FIELDS.TYPE_ATTENDEE]: "",
      [FIELDS.ATTENDANCE_DAY]: "",
      [FIELDS.COLLEGE]: "",
      [FIELDS.UNIVERSITY]: "",
      [FIELDS.DATA_AUTHORIZATION]: "",

      // Campos parámetros URL
      [FIELDS.SOURCE]: "Javeriana",
      [FIELDS.SUB_SOURCE]: "Organico",
      [FIELDS.MEDIUM]: "Landing",
      [FIELDS.ARTICLE]: "",
      [FIELDS.EVENT_NAME]: "",
      [FIELDS.EVENT_DATE]: "",
    };
  }

  /**
   * Obtener estado inicial de Ui
   * @private
   */
  _getInitialUiState() {
    const { FIELDS } = Constants;

    return {
      fieldsVisible: {
        [FIELDS.DEPARTMENT]: false,
        [FIELDS.CITY]: false,
        [FIELDS.ACADEMIC_LEVEL]: false,
        [FIELDS.FACULTY]: false,
        [FIELDS.PROGRAM]: false,
        [FIELDS.ADMISSION_PERIOD]: false,
      },
      fieldsDisabled: {
        submit: true,
      },
    };
  }

  /**
   * Obtener estado inicial de validación
   * @private
   */
  _getInitialValidationState() {
    return {
      errors: {},
      touchedFields: new Set(),
      isValid: false,
    };
  }

  /**
   * Obtener estado inicial del sistema
   * @private
   */
  _getInitialSystemState() {
    // Obtener configuración del singleton
    const config = Config.hasGlobalInstance() ? Config.getConfig() : {};

    // Valores por defecto para los modos
    const defaultModes = {
      devMode: false,
      sandboxMode: false,
      debugMode: false,
    };

    return {
      isInitialized: false,
      isSubmitting: false,
      isLoading: false,

      // Estados de modo del sistema (con valores de configuración o por defecto)
      devMode: config.devMode ?? defaultModes.devMode,
      sandboxMode: config.sandboxMode ?? defaultModes.sandboxMode,
      debugMode: config.debugMode ?? defaultModes.debugMode,
    };
  }

  /**
   * Actualizar estado de validación general
   * @private
   */
  _updateValidationState() {
    this.validationState.isValid = !this.hasValidationErrors();
  }

  /**
   * Emitir eventos de cambio de campo
   * @private
   */
  _emitFieldChangeEvents(fieldName, previousValue, currentValue) {
    // Evento general de cambio de campo
    this._emitEvent("fieldChanged", {
      fieldName,
      previousValue,
      currentValue,
      timestamp: new Date().toISOString(),
    });

    // Evento específico del campo
    this._emitEvent(`field:${fieldName}:changed`, {
      previousValue,
      currentValue,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emitir un evento usando Event
   * @private
   */
  _emitEvent(eventName, data) {
    if (this.eventManager) {
      this.eventManager.emit(eventName, data);
    }
  }
}
