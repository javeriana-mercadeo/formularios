/**
 * FormStateManager - Maneja el estado del formulario
 * Centraliza la lógica de estado y validación
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";

export class FormStateManager {
  constructor() {
    // Initial form state
    this.state = this.getInitialState();

    const F = Constants.FIELD_NAMES;

    // UI state
    this.uiState = {
      fieldsVisible: {
        [F.LOCATION.DEPARTMENT]: false,
        [F.LOCATION.CITY]: false,
        [F.ACADEMIC.ACADEMIC_LEVEL]: false,
        [F.ACADEMIC.FACULTY]: false,
        [F.ACADEMIC.PROGRAM]: false,
        [F.ACADEMIC.ADMISSION_PERIOD]: false,
      },
      fieldsDisabled: {
        submit: true,
      },
    };

    // Validation state
    this.validationState = {
      errors: {},
      touchedFields: new Set(),
      isValid: false,
    };

    // System state
    this.systemState = {
      isInitialized: false,
      isSubmitting: false,
      isLoading: false,
    };
  }

  /**
   * Obtener estado inicial del formulario
   */
  getInitialState() {
    const F = Constants.FIELD_NAMES;

    return {
      // Personal data
      [F.PERSONAL.FIRST_NAME]: "",
      [F.PERSONAL.LAST_NAME]: "",
      [F.PERSONAL.TYPE_DOC]: "",
      [F.PERSONAL.DOCUMENT]: "",
      [F.PERSONAL.EMAIL]: "",
      [F.PERSONAL.PHONE_CODE]: "57",
      [F.PERSONAL.PHONE]: "",

      // Location data
      [F.LOCATION.COUNTRY]: "COL",
      [F.LOCATION.DEPARTMENT]: "",
      [F.LOCATION.CITY]: "",

      // Event data
      [F.EVENT.ATTENDANCE_DAY]: "",
      [F.EVENT.TYPE_ATTENDEE]: "",

      // Academic data
      [F.ACADEMIC.ACADEMIC_LEVEL]: "",
      [F.ACADEMIC.FACULTY]: "",
      [F.ACADEMIC.PROGRAM]: "",
      [F.ACADEMIC.ADMISSION_PERIOD]: "",
      [F.AUTHORIZATION.DATA_AUTHORIZATION]: "",

      // Hidden Salesforce fields (dinámicos)
      oid: "",
      retURL: "",
      debug: "",
      debugEmail: "",
      lead_source: "",

      // Hidden event fields (dinámicos)
      event_name: "",
      event_date: "",
      university: "",
      campaign: "",
      source: "",
      medium: "",
    };
  }

  /**
   * Actualizar campo específico del formulario
   */
  updateField(fieldName, value) {
    if (this.state.hasOwnProperty(fieldName)) {
      const previousValue = this.state[fieldName];
      this.state[fieldName] = value;

      Logger.debug(`Campo actualizado: ${fieldName}`, {
        previousValue,
        currentValue: value,
      });

      return true;
    }

    Logger.warn(`Intento de actualizar campo inexistente: ${fieldName}`);
    return false;
  }

  /**
   * Obtener valor de campo específico
   */
  getField(fieldName) {
    return this.state[fieldName];
  }

  /**
   * Obtener todo el estado del formulario
   */
  getFormData() {
    return { ...this.state };
  }

  /**
   * Establecer múltiples campos
   */
  setFields(fields) {
    Object.entries(fields).forEach(([fieldName, value]) => {
      this.updateField(fieldName, value);
    });
  }

  /**
   * Resetear formulario al estado inicial
   */
  reset() {
    this.state = this.getInitialState();
    this.clearValidationErrors();
    this.systemState.isSubmitting = false;

    Logger.info("Estado del formulario reseteado");
  }

  /**
   * Marcar campo como tocado
   */
  markFieldAsTouched(fieldName) {
    this.validationState.touchedFields.add(fieldName);
  }

  /**
   * Verificar si campo ha sido tocado
   */
  isFieldTouched(fieldName) {
    return this.validationState.touchedFields.has(fieldName);
  }

  /**
   * Establecer error de validación
   */
  setValidationError(fieldName, error) {
    this.validationState.errors[fieldName] = error;
    this.updateValidationState();
  }

  /**
   * Limpiar error de validación
   */
  clearValidationError(fieldName) {
    delete this.validationState.errors[fieldName];
    this.updateValidationState();
  }

  /**
   * Limpiar todos los errores de validación
   */
  clearValidationErrors() {
    this.validationState.errors = {};
    this.validationState.touchedFields.clear();
    this.updateValidationState();
  }

  /**
   * Obtener errores de validación
   */
  getValidationErrors() {
    return { ...this.validationState.errors };
  }

  /**
   * Verificar si hay errores de validación
   */
  hasValidationErrors() {
    return Object.keys(this.validationState.errors).length > 0;
  }

  /**
   * Actualizar estado de validación general
   */
  updateValidationState() {
    this.validationState.isValid = !this.hasValidationErrors();
  }

  /**
   * Mostrar/ocultar campo en UI
   */
  setFieldVisibility(fieldName, visible) {
    if (this.uiState.fieldsVisible.hasOwnProperty(fieldName)) {
      this.uiState.fieldsVisible[fieldName] = visible;
      Logger.debug(`Visibilidad de campo ${fieldName}: ${visible}`);
    }
  }

  /**
   * Habilitar/deshabilitar campo en UI
   */
  setFieldDisabled(fieldName, disabled) {
    if (this.uiState.fieldsDisabled.hasOwnProperty(fieldName)) {
      this.uiState.fieldsDisabled[fieldName] = disabled;
      Logger.debug(`Campo ${fieldName} ${disabled ? "deshabilitado" : "habilitado"}`);
    }
  }

  /**
   * Obtener estado de UI
   */
  getUIState() {
    return { ...this.uiState };
  }

  /**
   * Establecer estado del sistema
   */
  setSystemState(key, value) {
    if (this.systemState.hasOwnProperty(key)) {
      this.systemState[key] = value;
      Logger.debug(`Estado del sistema actualizado: ${key} = ${value}`);
    }
  }

  /**
   * Obtener estado del sistema
   */
  getSystemState() {
    return { ...this.systemState };
  }

  /**
   * Verificar si el formulario está listo para enviar
   */
  isReadyToSubmit() {
    const authField = Constants.FIELD_NAMES.AUTHORIZATION.DATA_AUTHORIZATION;
    return (
      this.validationState.isValid &&
      !this.systemState.isSubmitting &&
      this.state[authField] === "1"
    );
  }

  /**
   * Obtener resumen del estado
   */
  getStateSummary() {
    return {
      formData: this.getFormData(),
      uiState: this.getUIState(),
      validationState: {
        isValid: this.validationState.isValid,
        errorsCount: Object.keys(this.validationState.errors).length,
        touchedFieldsCount: this.validationState.touchedFields.size,
      },
      systemState: this.getSystemState(),
      isReadyToSubmit: this.isReadyToSubmit(),
    };
  }


  /**
   * Validar integridad del estado
   */
  validateState() {
    const F = Constants.FIELD_NAMES;
    const requiredFields = [
      F.PERSONAL.FIRST_NAME,
      F.PERSONAL.LAST_NAME,
      F.PERSONAL.EMAIL,
      F.PERSONAL.PHONE,
    ];
    const missingFields = requiredFields.filter((field) => !this.state[field]);

    if (missingFields.length > 0) {
      Logger.warn(`Campos requeridos faltantes: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  }
}
