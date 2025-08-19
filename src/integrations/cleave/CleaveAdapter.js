/**
 * CleaveAdapter - Adaptador para máscaras de input con Cleave.js
 * Proporciona máscaras predefinidas para documentos, teléfonos, etc.
 * @version 1.0
 */

import Cleave from 'cleave.js';

export class CleaveAdapter {
  constructor(logger) {
    this.logger = logger;
    this.instances = new Map();
  }
  
  /**
   * Obtener configuración de máscara por tipo
   * @param {string} type - Tipo de máscara
   * @returns {Object} - Configuración de Cleave
   */
  getMaskConfig(type) {
    const configs = {
      // Documento de identidad genérico (por defecto)
      document: {
        numericOnly: true,
        blocks: [10],
        stripLeadingZeroes: false,
        delimiter: ''
      },
      
      // Cédula de Ciudadanía - CC
      document_CC: {
        numericOnly: true,
        blocks: [3, 3, 3, 1],
        delimiters: ['.', '.', '.'],
        stripLeadingZeroes: false
      },
      
      // Cédula de Extranjería - CE
      document_CE: {
        numericOnly: true,
        blocks: [10],
        stripLeadingZeroes: false,
        delimiter: ''
      },
      
      // Tarjeta de Identidad - TI
      document_TI: {
        numericOnly: true,
        blocks: [11],
        stripLeadingZeroes: false,
        delimiter: ''
      },
      
      // Pasaporte - PA
      document_PA: {
        numericOnly: false,
        blocks: [9],
        uppercase: true,
        stripLeadingZeroes: false,
        delimiter: ''
      },
      
      // Teléfono móvil (sin prefijo, se maneja por separado)
      mobile: {
        numericOnly: true,
        blocks: [3, 3, 4],
        delimiters: [' ', ' '],
        stripLeadingZeroes: false
      },
      
      // Teléfono fijo genérico
      phone: {
        numericOnly: true,
        blocks: [3, 3, 4],
        delimiters: [' ', ' '],
        stripLeadingZeroes: false
      },
      
      // Número de identificación tributaria (NIT)
      nit: {
        numericOnly: true,
        blocks: [3, 3, 3, 1],
        delimiters: ['.', '.', '-'],
        stripLeadingZeroes: false
      },
      
      // Código postal
      postal: {
        numericOnly: true,
        blocks: [6],
        stripLeadingZeroes: false
      },
      
      // Número de tarjeta de crédito
      creditcard: {
        creditCard: true,
        delimiter: ' '
      },
      
      // Fecha (DD/MM/YYYY)
      date: {
        date: true,
        datePattern: ['d', 'm', 'Y'],
        delimiter: '/'
      },
      
      // Hora (HH:MM)
      time: {
        time: true,
        timePattern: ['h', 'm'],
        delimiter: ':'
      }
    };
    
    return configs[type] || {};
  }
  
  /**
   * Inicializar máscara por tipo
   * @param {HTMLElement} inputElement - Elemento input
   * @param {string} type - Tipo de máscara
   * @param {Object} customConfig - Configuración personalizada (opcional)
   * @returns {Object|null} - Instancia de Cleave
   */
  initializeByType(inputElement, type, customConfig = {}) {
    try {
      if (!inputElement) {
        this.logger?.warn(`❌ Elemento no encontrado para máscara ${type}`);
        return null;
      }
      
      if (inputElement.tagName !== 'INPUT') {
        this.logger?.warn(`❌ Elemento debe ser INPUT para máscara ${type}`);
        return null;
      }
      
      this.logger?.info(`🎭 Aplicando máscara "${type}" a ${inputElement.name || inputElement.id}`);
      
      // Obtener configuración base y mezclar con personalizada
      const baseConfig = this.getMaskConfig(type);
      const finalConfig = { ...baseConfig, ...customConfig };
      
      // Destruir instancia existente si la hay
      this._destroyExisting(inputElement);
      
      // Crear nueva instancia
      const instance = new Cleave(inputElement, finalConfig);
      
      // Guardar instancia
      const key = inputElement.name || inputElement.id || Date.now().toString();
      this.instances.set(key, {
        instance,
        element: inputElement,
        type,
        config: finalConfig
      });
      
      // Configurar eventos adicionales
      this._setupEvents(inputElement, instance, type);
      
      this.logger?.info(`✅ Máscara "${type}" aplicada exitosamente a ${key}`);
      
      return instance;
    } catch (error) {
      this.logger?.error(`❌ Error aplicando máscara ${type}:`, error);
      return null;
    }
  }
  
  /**
   * Actualizar máscara de documento según el tipo seleccionado
   * @param {HTMLElement} documentField - Campo de número de documento
   * @param {string} documentType - Tipo de documento (CC, CE, TI, PA)
   */
  updateDocumentMask(documentField, documentType) {
    if (!documentField || !documentType) return;
    
    const fieldKey = documentField.name || documentField.id;
    const existingInstance = this.instances.get(fieldKey);
    
    if (existingInstance) {
      // Destruir instancia anterior
      existingInstance.instance.destroy();
      this.instances.delete(fieldKey);
    }
    
    // Aplicar nueva máscara según el tipo
    const maskType = `document_${documentType}`;
    const currentValue = documentField.value;
    
    this.logger?.info(`🔄 Cambiando máscara de documento a: ${maskType}`);
    
    // Aplicar nueva máscara
    const newInstance = this.applyMask(documentField, maskType);
    
    // Preservar valor si existe
    if (currentValue && newInstance) {
      documentField.value = currentValue;
      newInstance.setRawValue(currentValue);
    }
    
    return newInstance;
  }
  
  /**
   * Obtener valor sin formato de una instancia
   * @param {string} instanceKey - Clave de la instancia
   * @returns {string} - Valor sin formato
   */
  getRawValue(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (!instanceData) return '';
    
    return instanceData.instance.getRawValue();
  }
  
  /**
   * Obtener valor formateado de una instancia
   * @param {string} instanceKey - Clave de la instancia
   * @returns {string} - Valor formateado
   */
  getFormattedValue(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (!instanceData) return '';
    
    return instanceData.element.value;
  }
  
  /**
   * Establecer valor en una instancia
   * @param {string} instanceKey - Clave de la instancia
   * @param {string} value - Valor a establecer
   */
  setValue(instanceKey, value) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.element.value = value;
      // Disparar evento para que Cleave procese el valor
      instanceData.element.dispatchEvent(new Event('input', { bubbles: true }));
      this.logger?.debug(`🔧 Valor establecido en ${instanceKey}: "${value}"`);
    }
  }
  
  /**
   * Limpiar valor de una instancia
   * @param {string} instanceKey - Clave de la instancia
   */
  clear(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.element.value = '';
      instanceData.element.dispatchEvent(new Event('input', { bubbles: true }));
      this.logger?.debug(`🧹 Valor limpiado en: ${instanceKey}`);
    }
  }
  
  /**
   * Habilitar/deshabilitar instancia
   * @param {string} instanceKey - Clave de la instancia
   * @param {boolean} enabled - Si debe estar habilitada
   */
  setEnabled(instanceKey, enabled) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.element.disabled = !enabled;
      this.logger?.debug(`🔧 Instancia ${instanceKey} ${enabled ? 'habilitada' : 'deshabilitada'}`);
    }
  }
  
  /**
   * Obtener información de una instancia
   * @param {string} instanceKey - Clave de la instancia
   * @returns {Object|null} - Datos de la instancia
   */
  getInstance(instanceKey) {
    return this.instances.get(instanceKey) || null;
  }
  
  /**
   * Validar formato de una instancia específica
   * @param {string} instanceKey - Clave de la instancia
   * @returns {Object} - Resultado de validación
   */
  validateFormat(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (!instanceData) {
      return { isValid: false, error: 'Instancia no encontrada' };
    }
    
    const { type, element } = instanceData;
    const rawValue = this.getRawValue(instanceKey);
    const formattedValue = this.getFormattedValue(instanceKey);
    
    // Validaciones específicas por tipo
    switch (type) {
      case 'document':
        return this._validateDocument(rawValue);
      case 'mobile':
        return this._validateMobile(rawValue);
      case 'phone':
        return this._validatePhone(rawValue);
      case 'nit':
        return this._validateNit(rawValue);
      case 'postal':
        return this._validatePostal(rawValue);
      default:
        return { isValid: true, error: null };
    }
  }
  
  /**
   * Destruir instancia específica
   * @param {string} instanceKey - Clave de la instancia
   */
  destroy(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      if (instanceData.instance && typeof instanceData.instance.destroy === 'function') {
        instanceData.instance.destroy();
      }
      this.instances.delete(instanceKey);
      this.logger?.info(`🗑️ Máscara destruida: ${instanceKey}`);
    }
  }
  
  /**
   * Destruir todas las instancias
   */
  destroyAll() {
    this.instances.forEach((instanceData, key) => {
      if (instanceData.instance && typeof instanceData.instance.destroy === 'function') {
        instanceData.instance.destroy();
      }
      this.logger?.info(`🗑️ Máscara destruida: ${key}`);
    });
    this.instances.clear();
    this.logger?.info('🧹 Todas las máscaras destruidas');
  }
  
  // Métodos privados
  
  /**
   * Destruir instancia existente en el elemento
   * @private
   */
  _destroyExisting(inputElement) {
    const instanceKey = inputElement.name || inputElement.id;
    if (instanceKey && this.instances.has(instanceKey)) {
      this.destroy(instanceKey);
    }
  }
  
  /**
   * Configurar eventos adicionales
   * @private
   */
  _setupEvents(element, instance, type) {
    // Evento para logging de cambios
    element.addEventListener('input', (e) => {
      this.logger?.debug(`📝 Valor cambiado en ${type}: "${e.target.value}"`);
    });
    
    // Validación en tiempo real para ciertos tipos
    if (['document', 'mobile', 'nit'].includes(type)) {
      element.addEventListener('blur', () => {
        const key = element.name || element.id;
        if (key) {
          const validation = this.validateFormat(key);
          if (!validation.isValid) {
            this.logger?.warn(`⚠️ Formato inválido en ${key}: ${validation.error}`);
          }
        }
      });
    }
  }
  
  /**
   * Validar documento colombiano
   * @private
   */
  _validateDocument(value) {
    if (!value || value.length < 6) {
      return { isValid: false, error: 'Documento debe tener al menos 6 dígitos' };
    }
    if (value.length > 10) {
      return { isValid: false, error: 'Documento no puede tener más de 10 dígitos' };
    }
    return { isValid: true, error: null };
  }
  
  /**
   * Validar teléfono móvil
   * @private
   */
  _validateMobile(value) {
    if (!value || value.length < 10) {
      return { isValid: false, error: 'Teléfono móvil debe tener 10 dígitos' };
    }
    return { isValid: true, error: null };
  }
  
  /**
   * Validar teléfono fijo
   * @private
   */
  _validatePhone(value) {
    if (!value || value.length < 7) {
      return { isValid: false, error: 'Teléfono debe tener al menos 7 dígitos' };
    }
    return { isValid: true, error: null };
  }
  
  /**
   * Validar NIT
   * @private
   */
  _validateNit(value) {
    if (!value || value.length < 8) {
      return { isValid: false, error: 'NIT debe tener al menos 8 dígitos' };
    }
    return { isValid: true, error: null };
  }
  
  /**
   * Validar código postal
   * @private
   */
  _validatePostal(value) {
    if (!value || value.length !== 6) {
      return { isValid: false, error: 'Código postal debe tener 6 dígitos' };
    }
    return { isValid: true, error: null };
  }
}