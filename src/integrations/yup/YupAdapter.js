/**
 * YupAdapter - Adaptador para validación con esquemas Yup
 * Integra validación moderna con el sistema de stores
 * @version 1.0
 */

import * as yup from 'yup';
import { useValidationStore } from '../../features/validation/stores/validation-store.js';

export class YupAdapter {
  constructor(logger) {
    this.logger = logger;
    this.store = useValidationStore;
    this.schema = null;
  }
  
  /**
   * Crear esquema dinámico basado en datos del formulario
   * @param {Object} formData - Datos actuales del formulario
   * @returns {yup.ObjectSchema} - Esquema de validación
   */
  createDynamicSchema(formData = {}) {
    const baseSchema = {
      // Campos básicos
      first_name: yup.string()
        .trim()
        .required('Nombre es obligatorio')
        .min(2, 'Nombre debe tener al menos 2 caracteres')
        .max(50, 'Nombre no puede exceder 50 caracteres'),
        
      last_name: yup.string()
        .trim()
        .required('Apellidos son obligatorios')
        .min(2, 'Apellidos deben tener al menos 2 caracteres')
        .max(50, 'Apellidos no pueden exceder 50 caracteres'),
        
      email: yup.string()
        .email('Email inválido')
        .required('Email es obligatorio')
        .max(100, 'Email no puede exceder 100 caracteres'),
        
      // Documento
      type_doc: yup.string()
        .required('Tipo de documento es obligatorio'),
        
      document: yup.string()
        .required('Número de documento es obligatorio')
        .min(6, 'Documento debe tener al menos 6 caracteres')
        .max(15, 'Documento no puede exceder 15 caracteres'),
        
      // Teléfono
      mobile: yup.string()
        .required('Teléfono móvil es obligatorio')
        .min(10, 'Teléfono debe tener al menos 10 dígitos'),
        
      // Ubicación
      country: yup.string()
        .required('País es obligatorio'),
        
      // Evento
      type_attendee: yup.string()
        .required('Tipo de asistente es obligatorio'),
        
      attendance_day: yup.string()
        .required('Día de asistencia es obligatorio'),
        
      // Autorización
      authorization_data: yup.string()
        .oneOf(['1'], 'Debe autorizar el tratamiento de datos personales')
        .required('Autorización es obligatoria')
    };
    
    // Validaciones condicionales para ubicación Colombia
    if (formData.country === 'Colombia') {
      baseSchema.department = yup.string()
        .required('Departamento es obligatorio para Colombia');
        
      baseSchema.city = yup.string()
        .required('Ciudad es obligatoria para Colombia');
    }
    
    // Validaciones condicionales para aspirantes
    if (formData.type_attendee === 'aspirante') {
      baseSchema.academic_level = yup.string()
        .required('Nivel académico es obligatorio para aspirantes');
        
      baseSchema.faculty = yup.string()
        .required('Facultad es obligatoria para aspirantes');
        
      baseSchema.program = yup.string()
        .required('Programa es obligatorio para aspirantes');
        
      baseSchema.admission_period = yup.string()
        .required('Periodo de ingreso es obligatorio para aspirantes');
    }
    
    // Campos opcionales que pueden estar presentes
    const optionalFields = {
      phone_code: yup.string().optional(),
      university: yup.string().optional(),
      school: yup.string().optional(),
      company: yup.string().optional()
    };
    
    // Combinar esquemas
    const finalSchema = { ...baseSchema, ...optionalFields };
    
    this.schema = yup.object(finalSchema);
    this.logger?.info(`📋 Esquema Yup creado con ${Object.keys(finalSchema).length} campos`);
    
    return this.schema;
  }
  
  /**
   * Validar un campo específico
   * @param {string} fieldName - Nombre del campo
   * @param {any} value - Valor del campo
   * @param {Object} formData - Datos completos del formulario
   * @returns {Promise<Object>} - Resultado de validación
   */
  async validateField(fieldName, value, formData = {}) {
    try {
      // Crear esquema dinámico si no existe o si cambió el contexto
      if (!this.schema || this._shouldRecreateSchema(formData)) {
        this.createDynamicSchema(formData);
      }
      
      // Validar el campo específico
      await this.schema.validateAt(fieldName, { [fieldName]: value, ...formData });
      
      // Limpiar error si la validación pasa
      this.store.getState().clearValidationError(fieldName);
      
      this.logger?.debug(`✅ Validación Yup exitosa para: ${fieldName}`);
      
      return { isValid: true, error: null };
    } catch (error) {
      // Establecer error en el store
      this.store.getState().setValidationError(fieldName, error.message);
      
      this.logger?.debug(`❌ Validación Yup fallida para ${fieldName}: ${error.message}`);
      
      return { isValid: false, error: error.message };
    }
  }
  
  /**
   * Validar formulario completo
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} - Resultado de validación completa
   */
  async validateForm(formData) {
    try {
      // Crear esquema dinámico
      this.createDynamicSchema(formData);
      
      // Validar todo el formulario
      await this.schema.validate(formData, { abortEarly: false });
      
      // Limpiar todos los errores si la validación pasa
      this.store.getState().clearAllValidationErrors();
      
      this.logger?.info(`✅ Validación Yup completa exitosa`);
      
      return { isValid: true, errors: {} };
    } catch (error) {
      const errors = {};
      
      // Procesar todos los errores
      if (error.inner && Array.isArray(error.inner)) {
        error.inner.forEach(err => {
          if (err.path) {
            errors[err.path] = err.message;
            this.store.getState().setValidationError(err.path, err.message);
          }
        });
      } else if (error.path) {
        // Error único
        errors[error.path] = error.message;
        this.store.getState().setValidationError(error.path, error.message);
      }
      
      this.logger?.warn(`❌ Validación Yup completa fallida: ${Object.keys(errors).length} errores`);
      
      return { isValid: false, errors };
    }
  }
  
  /**
   * Validar múltiples campos específicos
   * @param {Array<string>} fieldNames - Nombres de campos a validar
   * @param {Object} formData - Datos del formulario
   * @returns {Promise<Object>} - Resultado de validación múltiple
   */
  async validateFields(fieldNames, formData) {
    const results = {
      isValid: true,
      errors: {}
    };
    
    for (const fieldName of fieldNames) {
      const fieldResult = await this.validateField(fieldName, formData[fieldName], formData);
      if (!fieldResult.isValid) {
        results.isValid = false;
        results.errors[fieldName] = fieldResult.error;
      }
    }
    
    return results;
  }
  
  /**
   * Obtener esquema de validación actual
   * @returns {yup.ObjectSchema|null} - Esquema actual
   */
  getSchema() {
    return this.schema;
  }
  
  /**
   * Obtener reglas de un campo específico
   * @param {string} fieldName - Nombre del campo
   * @returns {Object} - Información de las reglas del campo
   */
  getFieldRules(fieldName) {
    if (!this.schema) return null;
    
    try {
      const fieldSchema = this.schema.fields[fieldName];
      if (!fieldSchema) return null;
      
      return {
        required: fieldSchema._exclusive.required || false,
        type: fieldSchema.type,
        tests: fieldSchema.tests.map(test => ({
          name: test.OPTIONS.name,
          message: test.OPTIONS.message
        }))
      };
    } catch (error) {
      this.logger?.warn(`⚠️ Error obteniendo reglas para ${fieldName}:`, error);
      return null;
    }
  }
  
  /**
   * Determinar si el esquema debe recrearse
   * @param {Object} formData - Datos actuales del formulario
   * @returns {boolean} - True si debe recrearse
   * @private
   */
  _shouldRecreateSchema(formData) {
    // Recrear si cambia el tipo de asistente o el país (afectan las validaciones condicionales)
    if (!this._lastFormContext) {
      this._lastFormContext = {};
    }
    
    const currentContext = {
      type_attendee: formData.type_attendee,
      country: formData.country
    };
    
    const shouldRecreate = 
      this._lastFormContext.type_attendee !== currentContext.type_attendee ||
      this._lastFormContext.country !== currentContext.country;
    
    if (shouldRecreate) {
      this._lastFormContext = currentContext;
      this.logger?.debug('🔄 Recreando esquema Yup por cambio de contexto');
    }
    
    return shouldRecreate;
  }
  
  /**
   * Reset del adaptador
   */
  reset() {
    this.schema = null;
    this._lastFormContext = {};
    this.logger?.info('🔄 YupAdapter reseteado');
  }
}