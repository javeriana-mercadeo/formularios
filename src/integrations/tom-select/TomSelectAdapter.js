/**
 * TomSelectAdapter - Adaptador estandarizado para Tom Select
 * Proporciona configuraciones predefinidas por tipo de campo
 * @version 1.0
 */

import { TomSelect } from './TomSelectBase.js';

export class TomSelectAdapter {
  constructor(logger) {
    this.logger = logger;
    this.instances = new Map();
  }
  
  // Configuraciones predefinidas por tipo
  getConfigByType(type) {
    const configs = {
      academic: {
        placeholder: 'Selecciona nivel académico...',
        required: true,
        maxItems: 1,
        searchEnabled: false,
        clearable: false
      },
      location: {
        placeholder: 'Selecciona ubicación...',
        required: true,
        maxItems: 1,
        searchEnabled: true,
        clearable: false
      },
      university: {
        placeholder: 'Buscar universidad...',
        required: false,
        maxItems: 1,
        searchEnabled: true,
        clearable: true
      },
      college: {
        placeholder: 'Buscar colegio...',
        required: false,
        maxItems: 1,
        searchEnabled: true,
        clearable: true
      },
      company: {
        placeholder: 'Buscar empresa...',
        required: false,
        maxItems: 1,
        searchEnabled: true,
        clearable: true
      },
      default: {
        placeholder: 'Seleccionar opción...',
        required: false,
        maxItems: 1,
        searchEnabled: false,
        clearable: true
      }
    };
    
    return { ...configs.default, ...configs[type] };
  }
  
  /**
   * Inicializar Tom Select con configuración por tipo
   * @param {HTMLElement} selectElement - Elemento select
   * @param {Array} options - Opciones para el select
   * @param {string} type - Tipo de configuración a usar
   * @returns {Promise<Object>} Instancia de Tom Select
   */
  async initializeByType(selectElement, options = [], type = 'default') {
    try {
      if (!selectElement) {
        throw new Error('Elemento select requerido');
      }

      this.logger?.info(`🎯 Inicializando TomSelect tipo "${type}" para: ${selectElement.name || selectElement.id}`);

      const config = this.getConfigByType(type);
      const tomSelect = new TomSelect(this.logger);
      
      // Destruir instancia existente si la hay
      this._destroyExisting(selectElement);
      
      const instance = await tomSelect.initialize(selectElement, options, config);
      
      const key = selectElement.name || selectElement.id || Date.now().toString();
      this.instances.set(key, {
        instance,
        element: selectElement,
        type
      });
      
      this.logger?.info(`✅ TomSelect tipo "${type}" inicializado: ${options.length} opciones`);
      
      return instance;
    } catch (error) {
      this.logger?.error(`❌ Error inicializando TomSelect tipo "${type}":`, error);
      throw error;
    }
  }
  
  /**
   * Actualizar opciones de una instancia existente
   * @param {string} instanceKey - Clave de la instancia
   * @param {Array} newOptions - Nuevas opciones
   */
  updateOptions(instanceKey, newOptions) {
    try {
      const instanceData = this.instances.get(instanceKey);
      if (!instanceData) {
        this.logger?.warn(`⚠️ Instancia ${instanceKey} no encontrada`);
        return;
      }

      const { instance } = instanceData;
      
      // Limpiar opciones existentes (mantener placeholder)
      instance.clearOptions();

      // Agregar nuevas opciones
      newOptions.forEach((option) => {
        instance.addOption(option);
      });

      this.logger?.info(`🔄 Opciones actualizadas en ${instanceKey}: ${newOptions.length} elementos`);
    } catch (error) {
      this.logger?.error("❌ Error actualizando opciones:", error);
    }
  }
  
  /**
   * Obtener valor seleccionado
   * @param {string} instanceKey - Clave de la instancia
   * @returns {string|null} - Valor seleccionado
   */
  getValue(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    return instanceData ? instanceData.instance.getValue() : null;
  }
  
  /**
   * Establecer valor
   * @param {string} instanceKey - Clave de la instancia
   * @param {string} value - Valor a establecer
   */
  setValue(instanceKey, value) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.instance.setValue(value);
      this.logger?.info(`🔧 Valor establecido en ${instanceKey}: "${value}"`);
    }
  }
  
  /**
   * Limpiar selección
   * @param {string} instanceKey - Clave de la instancia
   */
  clear(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.instance.clear();
      this.logger?.info(`🧹 Selección limpiada en: ${instanceKey}`);
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
      if (enabled) {
        instanceData.instance.enable();
      } else {
        instanceData.instance.disable();
      }
      this.logger?.info(`🔧 Instancia ${instanceKey} ${enabled ? 'habilitada' : 'deshabilitada'}`);
    }
  }
  
  /**
   * Obtener instancia por clave
   * @param {string} instanceKey - Clave de la instancia
   * @returns {Object|null} - Datos de la instancia
   */
  getInstance(instanceKey) {
    return this.instances.get(instanceKey) || null;
  }
  
  /**
   * Obtener todas las instancias
   * @returns {Map} - Mapa de instancias
   */
  getAllInstances() {
    return this.instances;
  }
  
  /**
   * Destruir instancia específica
   * @param {string} instanceKey - Clave de la instancia
   */
  destroy(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (instanceData) {
      instanceData.instance.destroy();
      this.instances.delete(instanceKey);
      this.logger?.info(`🗑️ TomSelect destruido: ${instanceKey}`);
    }
  }
  
  /**
   * Destruir todas las instancias
   */
  destroyAll() {
    this.instances.forEach((instanceData, key) => {
      instanceData.instance.destroy();
      this.logger?.info(`🗑️ TomSelect destruido: ${key}`);
    });
    this.instances.clear();
    this.logger?.info('🧹 Todas las instancias TomSelect destruidas');
  }
  
  /**
   * Validar instancia específica
   * @param {string} instanceKey - Clave de la instancia
   * @returns {boolean} - True si es válida
   */
  validateInstance(instanceKey) {
    const instanceData = this.instances.get(instanceKey);
    if (!instanceData) return true;
    
    const { instance, element } = instanceData;
    const isRequired = element.hasAttribute('required') || element.hasAttribute('data-validation');
    const value = instance.getValue();
    
    // Verificar que no sea valor placeholder
    const placeholderValue = element.getAttribute('data-placeholder-value') || '';
    const isValidValue = value && value !== '' && value !== placeholderValue;
    
    if (isRequired && !isValidValue) {
      this.logger?.warn(`⚠️ Validación fallida en ${instanceKey}: campo requerido vacío`);
      return false;
    }
    
    return true;
  }
  
  /**
   * Validar todas las instancias
   * @returns {Object} - Resultado de validación
   */
  validateAll() {
    const results = {
      isValid: true,
      invalidInstances: []
    };
    
    this.instances.forEach((instanceData, key) => {
      if (!this.validateInstance(key)) {
        results.isValid = false;
        results.invalidInstances.push(key);
      }
    });
    
    return results;
  }
  
  /**
   * Destruir instancia existente en el elemento (método privado)
   * @private
   */
  _destroyExisting(selectElement) {
    const instanceKey = selectElement.name || selectElement.id;
    if (instanceKey && this.instances.has(instanceKey)) {
      this.instances.get(instanceKey).instance.destroy();
      this.instances.delete(instanceKey);
      this.logger?.info(`🔄 Instancia existente destruida: ${instanceKey}`);
    }
  }
}