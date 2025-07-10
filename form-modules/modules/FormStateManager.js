/**
 * FormStateManager - Maneja el estado del formulario
 * Centraliza la lógica de estado y validación
 * @version 1.0
 */

import { Logger } from "./Logger.js";

export class FormStateManager {
  // Constants for field states and validation
  static FORM_FIELDS = {
    PERSONAL: {
      FIRST_NAME: "first_name",
      LAST_NAME: "last_name",
      DOCUMENT_TYPE: "type_doc",
      DOCUMENT_NUMBER: "document",
      EMAIL: "email",
      PHONE_CODE: "phone_code",
      PHONE: "phone",
      COUNTRY: "country",
      DEPARTMENT: "department",
      CITY: "city"
    },
    EVENT: {
      ATTENDANCE_DAY: "attendance_day",
      ATTENDEE_TYPE: "type_attendee"
    },
    ACADEMIC: {
      ACADEMIC_LEVEL: "academic_level",
      FACULTY: "faculty",
      PROGRAM: "program",
      ADMISSION_PERIOD: "admission_period"
    },
    AUTHORIZATION: {
      DATA_AUTHORIZATION: "authorization_data"
    },
    SALESFORCE_HIDDEN: {
      ORGANIZATION_ID: "oid",
      RETURN_URL: "retURL",
      DEBUG: "debug",
      DEBUG_EMAIL: "debugEmail",
      LEAD_SOURCE: "lead_source",
      COMPANY: "company"
    },
    EVENT_HIDDEN: {
      EVENT_NAME: "event_name",
      EVENT_DATE: "event_date",
      UNIVERSITY: "university",
      CAMPAIGN: "campaign",
      SOURCE: "source",
      MEDIUM: "medium"
    }
  };

  // UI field visibility constants
  static UI_FIELDS = {
    VISIBILITY: {
      DEPARTMENT: "department",
      CITY: "city",
      ACADEMIC_LEVEL: "academic_level", 
      FACULTY: "faculty",
      PROGRAM: "program",
      ADMISSION_PERIOD: "admission_period"
    },
    DISABLED: {
      SUBMIT: "submit"
    }
  };

  // Default values for form fields
  static DEFAULT_VALUES = {
    PHONE_CODE: "57", // Colombia by default
    COUNTRY: "COL", // Colombia by default
    LEAD_SOURCE: "Landing Pages",
    COMPANY: "NA"
  };

  constructor(loggerConfig = {}) {
    this.logger = new Logger("FormStateManager", loggerConfig);
    
    // Initial form state
    this.state = this.getInitialState();
    
    // UI state
    this.uiState = {
      fieldsVisible: {
        [FormStateManager.UI_FIELDS.VISIBILITY.DEPARTMENT]: false,
        [FormStateManager.UI_FIELDS.VISIBILITY.CITY]: false,
        [FormStateManager.UI_FIELDS.VISIBILITY.ACADEMIC_LEVEL]: false,
        [FormStateManager.UI_FIELDS.VISIBILITY.FACULTY]: false,
        [FormStateManager.UI_FIELDS.VISIBILITY.PROGRAM]: false,
        [FormStateManager.UI_FIELDS.VISIBILITY.ADMISSION_PERIOD]: false,
      },
      fieldsDisabled: {
        [FormStateManager.UI_FIELDS.DISABLED.SUBMIT]: true,
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
    const F = FormStateManager.FORM_FIELDS;
    const D = FormStateManager.DEFAULT_VALUES;
    
    return {
      // Personal data
      [F.PERSONAL.FIRST_NAME]: "",
      [F.PERSONAL.LAST_NAME]: "",
      [F.PERSONAL.DOCUMENT_TYPE]: "",
      [F.PERSONAL.DOCUMENT_NUMBER]: "",
      [F.PERSONAL.EMAIL]: "",
      [F.PERSONAL.PHONE_CODE]: D.PHONE_CODE,
      [F.PERSONAL.PHONE]: "",
      [F.PERSONAL.COUNTRY]: D.COUNTRY,
      [F.PERSONAL.DEPARTMENT]: "",
      [F.PERSONAL.CITY]: "",
      
      // Event data
      [F.EVENT.ATTENDANCE_DAY]: "",
      [F.EVENT.ATTENDEE_TYPE]: "",
      
      // Academic data
      [F.ACADEMIC.ACADEMIC_LEVEL]: "",
      [F.ACADEMIC.FACULTY]: "",
      [F.ACADEMIC.PROGRAM]: "",
      [F.ACADEMIC.ADMISSION_PERIOD]: "",
      [F.AUTHORIZATION.DATA_AUTHORIZATION]: "",
      
      // Hidden Salesforce fields
      [F.SALESFORCE_HIDDEN.ORGANIZATION_ID]: "",
      [F.SALESFORCE_HIDDEN.RETURN_URL]: "",
      [F.SALESFORCE_HIDDEN.DEBUG]: "",
      [F.SALESFORCE_HIDDEN.DEBUG_EMAIL]: "",
      [F.SALESFORCE_HIDDEN.LEAD_SOURCE]: D.LEAD_SOURCE,
      [F.SALESFORCE_HIDDEN.COMPANY]: D.COMPANY,
      
      // Hidden event fields
      [F.EVENT_HIDDEN.EVENT_NAME]: "",
      [F.EVENT_HIDDEN.EVENT_DATE]: "",
      [F.EVENT_HIDDEN.UNIVERSITY]: "",
      [F.EVENT_HIDDEN.CAMPAIGN]: "",
      [F.EVENT_HIDDEN.SOURCE]: "",
      [F.EVENT_HIDDEN.MEDIUM]: "",
    };
  }

  /**
   * Actualizar campo específico del formulario
   */
  updateField(fieldName, value) {
    if (this.state.hasOwnProperty(fieldName)) {
      const previousValue = this.state[fieldName];
      this.state[fieldName] = value;
      
      this.logger.debug(`Campo actualizado: ${fieldName}`, { 
        previousValue, 
        currentValue: value 
      });
      
      return true;
    }
    
    this.logger.warn(`Intento de actualizar campo inexistente: ${fieldName}`);
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
    
    this.logger.info("Estado del formulario reseteado");
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
      this.logger.debug(`Visibilidad de campo ${fieldName}: ${visible}`);
    }
  }

  /**
   * Habilitar/deshabilitar campo en UI
   */
  setFieldDisabled(fieldName, disabled) {
    if (this.uiState.fieldsDisabled.hasOwnProperty(fieldName)) {
      this.uiState.fieldsDisabled[fieldName] = disabled;
      this.logger.debug(`Campo ${fieldName} ${disabled ? 'deshabilitado' : 'habilitado'}`);
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
      this.logger.debug(`Estado del sistema actualizado: ${key} = ${value}`);
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
    const authField = FormStateManager.FORM_FIELDS.AUTHORIZATION.DATA_AUTHORIZATION;
    return this.validationState.isValid && 
           !this.systemState.isSubmitting && 
           this.state[authField] === "1";
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
    const F = FormStateManager.FORM_FIELDS;
    const requiredFields = [
      F.PERSONAL.FIRST_NAME, 
      F.PERSONAL.LAST_NAME, 
      F.PERSONAL.EMAIL, 
      F.PERSONAL.PHONE
    ];
    const missingFields = requiredFields.filter(field => !this.state[field]);
    
    if (missingFields.length > 0) {
      this.logger.warn(`Campos requeridos faltantes: ${missingFields.join(', ')}`);
      return false;
    }
    
    return true;
  }
}