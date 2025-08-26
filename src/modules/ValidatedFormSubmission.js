/**
 * ValidatedFormSubmission - Sistema de envío de formularios con auto-validación y corrección
 * 
 * Responsabilidades principales:
 * - Crear formularios temporales con validación exhaustiva
 * - Auto-detectar y corregir campos faltantes o corruptos
 * - Logging detallado del proceso de creación y envío
 * - Garantizar integridad de datos antes del envío
 * - Manejo robusto de errores y reintentos
 * 
 * Ventajas sobre el sistema tradicional:
 * - ✅ Garantía de integridad de campos
 * - ✅ Auto-corrección de errores
 * - ✅ Logging detallado para debugging
 * - ✅ Performance tracking
 * - ✅ Compatible con dispositivos limitados
 * 
 * @version 1.0
 */

export class ValidatedFormSubmission {
  constructor({ logger = null }) {
    this.logger = logger;
    this.submissionHistory = [];
    this.performance = {
      totalSubmissions: 0,
      successfulSubmissions: 0,
      correctedSubmissions: 0,
      averageCreationTime: 0,
      averageValidationTime: 0
    };
  }

  /**
   * Método principal de envío con validación completa
   * @param {Object} preparedData - Datos preparados para envío
   * @param {string} salesforceUrl - URL de Salesforce
   * @returns {Promise} - Resultado del envío
   */
  async submitWithValidation(preparedData, salesforceUrl) {
    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = performance.now();
    
    this.logger?.info(`🚀 [${submissionId}] Iniciando envío validado a: ${salesforceUrl}`);
    this.logger?.info(`📊 [${submissionId}] Campos a enviar: ${Object.keys(preparedData).length}`);

    try {
      this.performance.totalSubmissions++;

      // 1. Crear formulario temporal
      const tempForm = this._createTempForm(salesforceUrl, submissionId);
      this.logger?.debug(`📝 [${submissionId}] Formulario temporal creado`);

      // 2. Intentar crear todos los campos con logging
      const creationStartTime = performance.now();
      const fieldCreationLog = this._addFieldsToForm(tempForm, preparedData, submissionId);
      const creationTime = performance.now() - creationStartTime;

      this.logger?.info(`⏱️ [${submissionId}] Creación de campos: ${creationTime.toFixed(2)}ms`);
      this.logger?.info(`📈 [${submissionId}] Campos creados: ${fieldCreationLog.successful}/${fieldCreationLog.attempted}`);

      // 3. ⭐ VALIDACIÓN PRINCIPAL
      const validationStartTime = performance.now();
      const validationResult = this._validateFormFields(tempForm, preparedData, submissionId);
      const validationTime = performance.now() - validationStartTime;

      this.logger?.info(`🔍 [${submissionId}] Validación completada en ${validationTime.toFixed(2)}ms`);

      // 4. ⭐ CORRECCIÓN AUTOMÁTICA si es necesaria
      let correctionApplied = false;
      if (!validationResult.isValid) {
        this.logger?.warn(`🔧 [${submissionId}] Aplicando correcciones automáticas...`);
        
        const correctionStartTime = performance.now();
        this._fixMissingFields(tempForm, validationResult.missingFields, preparedData, submissionId);
        const correctionTime = performance.now() - correctionStartTime;
        
        this.logger?.info(`🛠️ [${submissionId}] Corrección aplicada en ${correctionTime.toFixed(2)}ms`);
        correctionApplied = true;
        this.performance.correctedSubmissions++;

        // 5. ⭐ RE-VALIDACIÓN después de corrección
        const revalidationResult = this._validateFormFields(tempForm, preparedData, submissionId);
        
        if (!revalidationResult.isValid) {
          throw new Error(`❌ [${submissionId}] No se pudieron crear campos después de corrección: ${revalidationResult.missingFields.join(', ')}`);
        }

        this.logger?.info(`✅ [${submissionId}] Re-validación exitosa después de corrección`);
      }

      // 6. Enviar solo cuando esté 100% validado
      const submitResult = await this._performValidatedSubmit(tempForm, submissionId);
      const totalTime = performance.now() - startTime;

      // Actualizar estadísticas de performance
      this._updatePerformanceStats(creationTime, validationTime, totalTime);
      this.performance.successfulSubmissions++;

      // Registrar envío exitoso
      this._recordSubmission(submissionId, {
        status: 'success',
        data: preparedData,
        url: salesforceUrl,
        correctionApplied,
        timing: {
          total: totalTime,
          creation: creationTime,
          validation: validationTime,
        },
        fieldStats: fieldCreationLog,
        validationResult
      });

      this.logger?.info(`🎉 [${submissionId}] Envío completado exitosamente en ${totalTime.toFixed(2)}ms`);
      
      return {
        success: true,
        submissionId,
        correctionApplied,
        timing: { total: totalTime, creation: creationTime, validation: validationTime },
        fieldStats: fieldCreationLog
      };

    } catch (error) {
      const totalTime = performance.now() - startTime;
      
      this.logger?.error(`❌ [${submissionId}] Error en envío validado:`, error);
      
      // Registrar error
      this._recordSubmission(submissionId, {
        status: 'error',
        data: preparedData,
        url: salesforceUrl,
        error: error.message,
        timing: { total: totalTime }
      });

      throw error;
    }
  }

  /**
   * Crear formulario temporal base
   * @private
   */
  _createTempForm(salesforceUrl, submissionId) {
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = salesforceUrl;
    tempForm.style.display = 'none';
    tempForm.setAttribute('data-form-id', submissionId);
    tempForm.setAttribute('data-created-at', new Date().toISOString());
    
    this.logger?.debug(`📝 [${submissionId}] Formulario base configurado: ${salesforceUrl}`);
    
    return tempForm;
  }

  /**
   * Agregar campos al formulario con logging detallado
   * @private
   */
  _addFieldsToForm(tempForm, preparedData, submissionId) {
    const creationLog = {
      attempted: 0,
      successful: 0,
      failed: [],
      timing: {},
      totalTime: 0
    };

    const startTime = performance.now();

    Object.entries(preparedData).forEach(([key, value]) => {
      creationLog.attempted++;
      const fieldStartTime = performance.now();
      
      try {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        input.setAttribute('data-field-key', key); // ⭐ Identificador único para validación
        input.setAttribute('data-expected-value', value); // ⭐ Para validación de integridad
        
        tempForm.appendChild(input);
        
        const fieldTime = performance.now() - fieldStartTime;
        creationLog.timing[key] = fieldTime;
        creationLog.successful++;
        
        this.logger?.debug(`✅ [${submissionId}] Campo creado: ${key} (${fieldTime.toFixed(2)}ms)`);
        
      } catch (error) {
        const fieldTime = performance.now() - fieldStartTime;
        creationLog.failed.push({ 
          key, 
          value, 
          error: error.message,
          timing: fieldTime 
        });
        
        this.logger?.error(`❌ [${submissionId}] Error creando campo ${key}:`, error);
      }
    });

    creationLog.totalTime = performance.now() - startTime;

    if (creationLog.failed.length > 0) {
      this.logger?.warn(`⚠️ [${submissionId}] ${creationLog.failed.length} campos fallaron en creación inicial`);
    }

    return creationLog;
  }

  /**
   * ⭐ VALIDACIÓN PRINCIPAL - Verificar integridad completa del formulario
   * @private
   */
  _validateFormFields(tempForm, expectedData, submissionId) {
    const validation = {
      isValid: true,
      missingFields: [],
      corruptedFields: [],
      validFields: [],
      fieldCount: {
        expected: Object.keys(expectedData).length,
        found: 0,
        valid: 0
      }
    };

    this.logger?.debug(`🔍 [${submissionId}] Iniciando validación profunda de ${validation.fieldCount.expected} campos`);

    // Verificar cada campo esperado
    Object.entries(expectedData).forEach(([expectedKey, expectedValue]) => {
      // Buscar el campo por data-attribute (más confiable que name)
      const field = tempForm.querySelector(`[data-field-key="${expectedKey}"]`);
      
      if (field) {
        validation.fieldCount.found++;
        
        // ⭐ VALIDACIÓN PROFUNDA - Verificar todas las propiedades
        const isValidName = field.name === expectedKey;
        const isValidValue = field.value === expectedValue;
        const isValidType = field.type === 'hidden';
        const isValidExpectedValue = field.getAttribute('data-expected-value') === expectedValue;
        
        if (isValidName && isValidValue && isValidType && isValidExpectedValue) {
          validation.validFields.push(expectedKey);
          validation.fieldCount.valid++;
          this.logger?.debug(`✅ [${submissionId}] Campo válido: ${expectedKey}`);
        } else {
          // Campo existe pero está corrupto
          validation.corruptedFields.push({
            key: expectedKey,
            issues: {
              name: !isValidName ? `expected: ${expectedKey}, found: ${field.name}` : null,
              value: !isValidValue ? `expected: ${expectedValue}, found: ${field.value}` : null,
              type: !isValidType ? `expected: hidden, found: ${field.type}` : null,
              expectedValue: !isValidExpectedValue ? `expected: ${expectedValue}, found: ${field.getAttribute('data-expected-value')}` : null
            }
          });
          
          this.logger?.warn(`🔧 [${submissionId}] Campo corrupto: ${expectedKey}`, {
            expectedName: expectedKey,
            actualName: field.name,
            expectedValue: expectedValue,
            actualValue: field.value,
            expectedType: 'hidden',
            actualType: field.type
          });
        }
      } else {
        validation.missingFields.push(expectedKey);
        this.logger?.warn(`❌ [${submissionId}] Campo faltante: ${expectedKey}`);
      }
    });

    // Los campos corruptos también necesitan corrección
    validation.missingFields.push(...validation.corruptedFields.map(f => f.key));
    validation.isValid = validation.missingFields.length === 0;
    
    this.logger?.info(`📊 [${submissionId}] Validación completada:`, {
      valid: validation.isValid,
      expected: validation.fieldCount.expected,
      found: validation.fieldCount.found,
      valid: validation.fieldCount.valid,
      missing: validation.missingFields.length,
      corrupted: validation.corruptedFields.length
    });
    
    return validation;
  }

  /**
   * ⭐ CORRECCIÓN AUTOMÁTICA - Recrear campos faltantes/corruptos
   * @private
   */
  _fixMissingFields(tempForm, fieldsToFix, originalData, submissionId) {
    this.logger?.warn(`🔧 [${submissionId}] Iniciando corrección de ${fieldsToFix.length} campos:`, fieldsToFix);
    
    let fixedCount = 0;
    let failedFixes = [];

    fieldsToFix.forEach(fieldKey => {
      try {
        // 1. Remover campo corrupto/duplicado si existe
        const existingFields = tempForm.querySelectorAll(`[data-field-key="${fieldKey}"]`);
        existingFields.forEach(field => {
          field.remove();
          this.logger?.debug(`🗑️ [${submissionId}] Removido campo corrupto: ${fieldKey}`);
        });
        
        // 2. Crear campo limpio con validación inmediata
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = fieldKey;
        input.value = originalData[fieldKey];
        input.setAttribute('data-field-key', fieldKey);
        input.setAttribute('data-expected-value', originalData[fieldKey]);
        input.setAttribute('data-recreated', 'true'); // Marcar como recreado
        
        // 3. ⭐ VERIFICACIÓN INMEDIATA después de appendChild
        tempForm.appendChild(input);
        
        // 4. Confirmar que se agregó correctamente con validación completa
        const verifyField = tempForm.querySelector(`[data-field-key="${fieldKey}"]`);
        if (verifyField && 
            verifyField.name === fieldKey && 
            verifyField.value === originalData[fieldKey] &&
            verifyField.type === 'hidden') {
          
          fixedCount++;
          this.logger?.debug(`✅ [${submissionId}] Campo ${fieldKey} recreado y verificado exitosamente`);
        } else {
          throw new Error(`Falló verificación inmediata del campo recreado: ${fieldKey}`);
        }
        
      } catch (error) {
        failedFixes.push({ fieldKey, error: error.message });
        this.logger?.error(`❌ [${submissionId}] No se pudo recrear campo ${fieldKey}:`, error);
      }
    });

    this.logger?.info(`🛠️ [${submissionId}] Corrección completada: ${fixedCount}/${fieldsToFix.length} campos corregidos`);

    if (failedFixes.length > 0) {
      throw new Error(`No se pudieron corregir ${failedFixes.length} campos: ${failedFixes.map(f => f.fieldKey).join(', ')}`);
    }
  }

  /**
   * Envío validado con timing seguro y verificaciones adicionales
   * @private
   */
  _performValidatedSubmit(tempForm, submissionId) {
    return new Promise((resolve, reject) => {
      try {
        this.logger?.info(`📤 [${submissionId}] Iniciando envío validado...`);
        
        // 1. Agregar al DOM con verificación
        document.body.appendChild(tempForm);
        
        // 2. ⭐ VERIFICACIÓN FINAL antes del submit
        if (!document.body.contains(tempForm)) {
          throw new Error('Formulario no se agregó correctamente al DOM');
        }

        // 3. Verificar que el formulario tiene los atributos esperados
        const formId = tempForm.getAttribute('data-form-id');
        if (formId !== submissionId) {
          throw new Error(`ID de formulario no coincide: esperado ${submissionId}, encontrado ${formId}`);
        }

        this.logger?.debug(`✅ [${submissionId}] Formulario agregado al DOM y verificado`);
        
        // 4. Delay para garantizar renderizado en dispositivos lentos
        setTimeout(() => {
          try {
            this.logger?.info(`🚀 [${submissionId}] Ejecutando submit...`);
            tempForm.submit();
            this.logger?.info(`✅ [${submissionId}] Submit ejecutado exitosamente`);
            
            // 5. Cleanup con timing más conservador
            setTimeout(() => {
              if (tempForm.parentNode) {
                tempForm.remove();
                this.logger?.debug(`🧹 [${submissionId}] Formulario temporal removido del DOM`);
              }
            }, 2000); // ⭐ Más tiempo para asegurar que el submit se procese
            
            resolve({ 
              status: 'validated_submit_success',
              submissionId,
              timestamp: new Date().toISOString()
            });
            
          } catch (submitError) {
            this.logger?.error(`❌ [${submissionId}] Error en submit:`, submitError);
            reject(new Error(`Error en submit: ${submitError.message}`));
          }
        }, 250); // ⭐ Timing más conservador para dispositivos lentos
        
      } catch (error) {
        this.logger?.error(`❌ [${submissionId}] Error en configuración de envío:`, error);
        reject(error);
      }
    });
  }

  /**
   * Actualizar estadísticas de performance
   * @private
   */
  _updatePerformanceStats(creationTime, validationTime, totalTime) {
    // Calcular promedio móvil simple
    const currentAvgCreation = this.performance.averageCreationTime;
    const currentAvgValidation = this.performance.averageValidationTime;
    const total = this.performance.totalSubmissions;
    
    this.performance.averageCreationTime = ((currentAvgCreation * (total - 1)) + creationTime) / total;
    this.performance.averageValidationTime = ((currentAvgValidation * (total - 1)) + validationTime) / total;
  }

  /**
   * Registrar envío en historial
   * @private
   */
  _recordSubmission(submissionId, submissionData) {
    this.submissionHistory.push({
      submissionId,
      timestamp: new Date().toISOString(),
      ...submissionData
    });

    // Mantener solo los últimos 100 envíos para evitar uso excesivo de memoria
    if (this.submissionHistory.length > 100) {
      this.submissionHistory = this.submissionHistory.slice(-100);
    }
  }

  /**
   * Obtener estadísticas completas del sistema
   */
  getPerformanceStats() {
    const successRate = this.performance.totalSubmissions > 0 
      ? (this.performance.successfulSubmissions / this.performance.totalSubmissions) * 100 
      : 0;
    
    const correctionRate = this.performance.totalSubmissions > 0 
      ? (this.performance.correctedSubmissions / this.performance.totalSubmissions) * 100 
      : 0;

    return {
      ...this.performance,
      successRate: parseFloat(successRate.toFixed(2)),
      correctionRate: parseFloat(correctionRate.toFixed(2)),
      historySize: this.submissionHistory.length
    };
  }

  /**
   * Obtener historial de envíos
   */
  getSubmissionHistory(limit = 10) {
    return this.submissionHistory.slice(-limit).reverse();
  }

  /**
   * Limpiar historial y estadísticas
   */
  clearHistory() {
    this.submissionHistory = [];
    this.performance = {
      totalSubmissions: 0,
      successfulSubmissions: 0,
      correctedSubmissions: 0,
      averageCreationTime: 0,
      averageValidationTime: 0
    };
    
    this.logger?.info('🧹 Historial y estadísticas limpiadas');
  }

  /**
   * Diagnóstico del sistema - útil para debugging
   */
  async runDiagnostic() {
    this.logger?.info('🔍 Ejecutando diagnóstico del sistema...');
    
    const diagnostic = {
      timestamp: new Date().toISOString(),
      browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      },
      performance: this.getPerformanceStats(),
      domSupport: {
        createElement: typeof document.createElement === 'function',
        appendChild: typeof Element.prototype.appendChild === 'function',
        querySelector: typeof Element.prototype.querySelector === 'function',
        setAttribute: typeof Element.prototype.setAttribute === 'function'
      },
      testResults: {}
    };

    // Test básico de creación de elementos
    try {
      const testForm = document.createElement('form');
      const testInput = document.createElement('input');
      testInput.type = 'hidden';
      testInput.name = 'test';
      testInput.value = 'diagnostic';
      testForm.appendChild(testInput);
      
      diagnostic.testResults.basicCreation = true;
      diagnostic.testResults.elementCount = testForm.children.length;
      diagnostic.testResults.canQuerySelector = !!testForm.querySelector('[name="test"]');
    } catch (error) {
      diagnostic.testResults.basicCreation = false;
      diagnostic.testResults.error = error.message;
    }

    this.logger?.info('📋 Diagnóstico completado:', diagnostic);
    return diagnostic;
  }
}