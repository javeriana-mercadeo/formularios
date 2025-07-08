/**
 * ValidationModule - Módulo de validación para formularios
 * Contiene todas las reglas de validación y lógica de verificación
 * @version 1.0
 */

export class ValidationModule {
  constructor(config = {}) {
    this.config = {
      // Configuración de validación
      minNameLength: 2,
      minPhoneLength: 7,
      minDocumentLength: 6,
      maxDocumentLength: 12,
      
      // Patrones de validación
      patterns: {
        name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        phone: /^[\d\s\-\+\(\)]+$/,
        document: /^\d{6,12}$/
      },
      
      // Mensajes de error personalizables
      errorMessages: {
        required: 'Este campo es obligatorio',
        name: 'Mínimo 2 caracteres, solo letras',
        email: 'Ingrese un correo electrónico válido',
        phone: 'Número de teléfono válido (mínimo 7 dígitos)',
        document: 'Solo números, entre 6 y 12 dígitos',
        authorization: 'Debe autorizar el tratamiento de datos personales'
      },
      
      ...config
    };
    
    // Mapeo de tipos de campo a reglas de validación
    this.fieldValidationMap = {
      first_name: 'name',
      last_name: 'name',
      email: 'email',
      phone: 'phone',
      document: 'document',
      type_doc: 'required',
      phone_code: 'required',
      country: 'required',
      department: 'required',
      city: 'required',
      type_attendee: 'required',
      attendance_day: 'required',
      academic_level: 'required',
      faculty: 'required',
      program: 'required',
      admission_period: 'required'
    };
  }
  
  /**
   * Verificar si un valor es requerido y está presente
   */
  validateRequired(value) {
    return value && value.trim().length > 0;
  }
  
  /**
   * Validar nombre (solo letras y espacios, mínimo 2 caracteres)
   */
  validateName(value) {
    if (!value || value.trim().length < this.config.minNameLength) {
      return false;
    }
    return this.config.patterns.name.test(value.trim());
  }
  
  /**
   * Validar email
   */
  validateEmail(value) {
    if (!value) return false;
    return this.config.patterns.email.test(value.trim().toLowerCase());
  }
  
  /**
   * Validar teléfono
   */
  validatePhone(value) {
    if (!value || value.trim().length < this.config.minPhoneLength) {
      return false;
    }
    return this.config.patterns.phone.test(value.trim());
  }
  
  /**
   * Validar documento
   */
  validateDocument(value) {
    if (!value) return false;
    return this.config.patterns.document.test(value.trim());
  }
  
  /**
   * Validar un campo específico
   */
  validateField(fieldElement) {
    const fieldId = fieldElement.id;
    const value = fieldElement.value;
    
    // Obtener tipo de validación
    const validationType = this.fieldValidationMap[fieldId];
    
    if (!validationType) {
      // Si no hay mapeo específico, verificar si es requerido
      if (fieldElement.hasAttribute('required')) {
        return this.validateRequired(value);
      }
      return true;
    }
    
    // Aplicar validación según el tipo
    switch (validationType) {
      case 'name':
        return this.validateName(value);
      case 'email':
        return this.validateEmail(value);
      case 'phone':
        return this.validatePhone(value);
      case 'document':
        return this.validateDocument(value);
      case 'required':
        return this.validateRequired(value);
      default:
        return true;
    }
  }
  
  /**
   * Obtener mensaje de error para un campo
   */
  getErrorMessage(fieldElement) {
    const fieldId = fieldElement.id;
    const validationType = this.fieldValidationMap[fieldId];
    
    if (!validationType) {
      return this.config.errorMessages.required;
    }
    
    return this.config.errorMessages[validationType] || this.config.errorMessages.required;
  }
  
  /**
   * Validar múltiples campos
   */
  validateFields(fields) {
    const results = {};
    
    fields.forEach(field => {
      const fieldElement = typeof field === 'string' 
        ? document.getElementById(field) 
        : field;
      
      if (fieldElement) {
        results[fieldElement.id] = this.validateField(fieldElement);
      }
    });
    
    return results;
  }
  
  /**
   * Validar formulario completo
   */
  validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    const results = {
      isValid: true,
      errors: {},
      validFields: [],
      invalidFields: []
    };
    
    requiredFields.forEach(field => {
      const isValid = this.validateField(field);
      
      if (isValid) {
        results.validFields.push(field.id);
      } else {
        results.invalidFields.push(field.id);
        results.errors[field.id] = this.getErrorMessage(field);
        results.isValid = false;
      }
    });
    
    return results;
  }
  
  /**
   * Validar autorización de datos
   */
  validateAuthorization(formElement) {
    const authRadios = formElement.querySelectorAll('input[type="radio"][name*="authorization"]');
    
    for (let radio of authRadios) {
      if (radio.checked && radio.value === '1') {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Validar campos condicionales (departamento y ciudad para Colombia)
   */
  validateConditionalFields(formElement, formData) {
    const results = {
      isValid: true,
      errors: {}
    };
    
    // Validar departamento y ciudad si el país es Colombia
    if (formData.country === 'COL') {
      const departmentElement = formElement.querySelector('#department');
      const cityElement = formElement.querySelector('#city');
      
      if (departmentElement && departmentElement.style.display !== 'none') {
        if (!this.validateRequired(departmentElement.value)) {
          results.isValid = false;
          results.errors.department = this.config.errorMessages.required;
        }
      }
      
      if (cityElement && cityElement.style.display !== 'none') {
        if (!this.validateRequired(cityElement.value)) {
          results.isValid = false;
          results.errors.city = this.config.errorMessages.required;
        }
      }
    }
    
    // Validar campos académicos si el tipo de asistente es "Aspirante"
    if (formData.type_attendee === 'Aspirante') {
      const academicFields = ['academic_level', 'faculty', 'program', 'admission_period'];
      
      academicFields.forEach(fieldId => {
        const element = formElement.querySelector(`#${fieldId}`);
        
        if (element && element.style.display !== 'none') {
          if (!this.validateRequired(element.value)) {
            results.isValid = false;
            results.errors[fieldId] = this.config.errorMessages.required;
          }
        }
      });
    }
    
    return results;
  }
  
  /**
   * Validación completa del formulario incluyendo campos condicionales
   */
  validateFullForm(formElement, formData) {
    // Validar campos básicos
    const basicValidation = this.validateForm(formElement);
    
    // Validar autorización
    const authorizationValid = this.validateAuthorization(formElement);
    
    // Validar campos condicionales
    const conditionalValidation = this.validateConditionalFields(formElement, formData);
    
    // Combinar resultados
    const results = {
      isValid: basicValidation.isValid && authorizationValid && conditionalValidation.isValid,
      errors: {
        ...basicValidation.errors,
        ...conditionalValidation.errors
      },
      validFields: basicValidation.validFields,
      invalidFields: basicValidation.invalidFields
    };
    
    // Agregar error de autorización si es necesario
    if (!authorizationValid) {
      results.errors.authorization_data = this.config.errorMessages.authorization;
      results.invalidFields.push('authorization_data');
    }
    
    return results;
  }
  
  /**
   * Limpiar errores de un campo
   */
  clearFieldError(fieldId) {
    // Este método será usado por el UI para limpiar errores visuales
    // La implementación específica dependerá del sistema de UI
    console.log(`Limpiando error para campo: ${fieldId}`);
  }
  
  /**
   * Mostrar error de un campo
   */
  showFieldError(fieldId, message) {
    // Este método será usado por el UI para mostrar errores visuales
    // La implementación específica dependerá del sistema de UI
    console.log(`Mostrando error para campo ${fieldId}: ${message}`);
  }
  
  /**
   * Actualizar configuración de validación
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  /**
   * Agregar regla de validación personalizada
   */
  addValidationRule(fieldId, validationType, customValidator = null) {
    this.fieldValidationMap[fieldId] = validationType;
    
    if (customValidator && typeof customValidator === 'function') {
      // Agregar validador personalizado
      this[`validate${validationType.charAt(0).toUpperCase() + validationType.slice(1)}`] = customValidator;
    }
  }
  
  /**
   * Agregar mensaje de error personalizado
   */
  addErrorMessage(type, message) {
    this.config.errorMessages[type] = message;
  }
  
  /**
   * Validar valor individual sin elemento DOM
   */
  validateValue(value, type) {
    switch (type) {
      case 'name':
        return this.validateName(value);
      case 'email':
        return this.validateEmail(value);
      case 'phone':
        return this.validatePhone(value);
      case 'document':
        return this.validateDocument(value);
      case 'required':
        return this.validateRequired(value);
      default:
        return true;
    }
  }
  
  /**
   * Obtener todas las reglas de validación
   */
  getValidationRules() {
    return { ...this.fieldValidationMap };
  }
  
  /**
   * Obtener todos los mensajes de error
   */
  getErrorMessages() {
    return { ...this.config.errorMessages };
  }
  
  /**
   * Validar datos del formulario como objeto
   */
  validateFormData(formData) {
    const results = {
      isValid: true,
      errors: {}
    };
    
    // Validar campos requeridos básicos
    const requiredFields = [
      'first_name', 'last_name', 'type_doc', 'document', 
      'email', 'phone_code', 'phone', 'country'
    ];
    
    requiredFields.forEach(fieldId => {
      const value = formData[fieldId];
      const validationType = this.fieldValidationMap[fieldId];
      
      if (!this.validateValue(value, validationType)) {
        results.isValid = false;
        results.errors[fieldId] = this.config.errorMessages[validationType] || this.config.errorMessages.required;
      }
    });
    
    // Validar campos condicionales
    if (formData.country === 'COL') {
      if (!this.validateRequired(formData.department)) {
        results.isValid = false;
        results.errors.department = this.config.errorMessages.required;
      }
      
      if (!this.validateRequired(formData.city)) {
        results.isValid = false;
        results.errors.city = this.config.errorMessages.required;
      }
    }
    
    // Validar campos académicos si es aspirante
    if (formData.type_attendee === 'Aspirante') {
      const academicFields = ['academic_level', 'faculty', 'program', 'admission_period'];
      
      academicFields.forEach(fieldId => {
        if (!this.validateRequired(formData[fieldId])) {
          results.isValid = false;
          results.errors[fieldId] = this.config.errorMessages.required;
        }
      });
    }
    
    // Validar autorización
    if (!formData.authorization_data || formData.authorization_data !== '1') {
      results.isValid = false;
      results.errors.authorization_data = this.config.errorMessages.authorization;
    }
    
    return results;
  }
}