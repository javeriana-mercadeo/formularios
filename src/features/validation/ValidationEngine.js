/**
 * ValidationEngine - Motor híbrido de validación usando Yup + Legacy
 * Combina validación moderna con esquemas y compatibilidad legacy
 * @version 1.0
 */
import { YupAdapter } from '../../integrations/yup/YupAdapter.js';
import { Validation } from './ValidationLegacy.js';
import { useValidationStore } from './stores/validation-store.js';

export class ValidationEngine {
  constructor(logger) {
    this.logger = logger;
    this.store = useValidationStore;
    
    // Adaptadores
    this.yupAdapter = new YupAdapter(logger);
    this.legacyValidator = new Validation({ logger }); // Backward compatibility
  }
  
  async validateField(fieldName, value, formData) {
    // 1. Marcar campo como touched
    this.store.getState().markFieldTouched(fieldName);
    
    // 2. Actualizar valor en store
    this.store.getState().updateField(fieldName, value);
    
    // 3. Validar con Yup (moderno)
    const yupResult = await this.yupAdapter.validateField(fieldName, value, formData);
    
    // 4. Si Yup pasa, validar reglas legacy específicas
    if (yupResult.isValid) {
      const legacyResult = this.legacyValidator.validateSpecificField(fieldName, value, formData);
      if (!legacyResult.isValid) {
        this.store.getState().setValidationError(fieldName, legacyResult.error);
        return legacyResult;
      }
    }
    
    return yupResult;
  }
  
  async validateForm(formData) {
    // Validación completa con ambos sistemas
    const yupResult = await this.yupAdapter.validateForm(formData);
    
    if (yupResult.isValid) {
      // Validaciones legacy adicionales
      const legacyResult = this.legacyValidator.validateFormComplete(null, formData);
      if (!legacyResult.isValid) {
        return legacyResult;
      }
    }
    
    return yupResult;
  }
  
  // Mantener compatibilidad con API existente
  validateFormComplete(formElement, formData) {
    return this.legacyValidator.validateFormComplete(formElement, formData);
  }
  
  // Getters para compatibilidad
  get isFormValid() {
    return this.store.getState().isValid();
  }
  
  get formErrors() {
    return this.store.getState().validationErrors;
  }
  
  clearFieldError(fieldName) {
    this.store.getState().clearValidationError(fieldName);
    this.logger?.debug(`🧹 Error limpiado para campo: ${fieldName}`);
  }
  
  clearAllErrors() {
    this.store.getState().reset();
    this.logger?.debug(`🧹 Todos los errores de validación limpiados`);
  }
}