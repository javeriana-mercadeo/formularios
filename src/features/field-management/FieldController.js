/**
 * FieldController - Controlador de gestión de campos
 * Maneja visibilidad, estado y comportamiento de campos específicos
 * @version 1.0
 */
import { useFieldStore } from './stores/field-store.js';
import { TomSelectAdapter } from '../../integrations/tom-select/TomSelectAdapter.js';
import { CleaveAdapter } from '../../integrations/cleave/CleaveAdapter.js';

export class FieldController {
  constructor(logger, formElement, dataPreloader = null) {
    this.logger = logger;
    this.formElement = formElement;
    this.dataPreloader = dataPreloader;
    this.store = useFieldStore;
    
    // Adaptadores
    this.tomSelectAdapter = new TomSelectAdapter(logger);
    this.cleaveAdapter = new CleaveAdapter(logger);
    
    // Mapa de campos y sus configuraciones
    this.fieldConfig = {
      academic_level: { type: 'select', enhancer: 'tom-select', category: 'academic' },
      country: { type: 'select', enhancer: 'tom-select', category: 'location' },
      state: { type: 'select', enhancer: 'tom-select', category: 'location' },
      city: { type: 'select', enhancer: 'tom-select', category: 'location' },
      university: { type: 'select', enhancer: 'tom-select', category: 'university' },
      school: { type: 'select', enhancer: 'tom-select', category: 'college' },
      company: { type: 'select', enhancer: 'tom-select', category: 'company' },
      document: { type: 'input', enhancer: 'cleave', category: 'document' },
      mobile: { type: 'input', enhancer: 'cleave', category: 'mobile' },
      phone: { type: 'input', enhancer: 'cleave', category: 'phone' },
      phone_code: { type: 'select', enhancer: 'tom-select', category: 'phone_prefix' },
      country: { type: 'select', enhancer: 'tom-select', category: 'country' }
    };
  }
  
  /**
   * Inicializar todos los campos del formulario
   */
  async initializeAllFields() {
    this.logger?.info('🎯 Inicializando campos del formulario...');
    
    for (const [fieldName, config] of Object.entries(this.fieldConfig)) {
      const element = this.formElement.querySelector(`[name="${fieldName}"]`);
      if (element) {
        await this.initializeField(fieldName, element, config);
      }
    }
    
    this.logger?.info('✅ Campos inicializados correctamente');
  }
  
  /**
   * Inicializar un campo específico
   */
  async initializeField(fieldName, element, config) {
    try {
      if (config.enhancer === 'tom-select' && config.type === 'select') {
        // Cargar datos apropiados según el tipo de campo
        const options = await this._getFieldOptions(fieldName, config.category);
        await this.tomSelectAdapter.initializeByType(element, options, config.category);
        this.logger?.debug(`🎯 TomSelect inicializado para: ${fieldName} con ${options.length} opciones`);
      }
      
      if (config.enhancer === 'cleave' && config.type === 'input') {
        this.cleaveAdapter.initializeByType(element, config.category);
        this.logger?.debug(`🎭 Cleave inicializado para: ${fieldName}`);
      }
      
      // Configurar eventos de campo
      this._setupFieldEvents(fieldName, element);
      
    } catch (error) {
      this.logger?.error(`Error inicializando campo ${fieldName}:`, error);
    }
  }
  
  /**
   * Mostrar campo
   */
  showField(fieldName) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      const container = field.closest('.field-container') || field.closest('.form-group');
      if (container) {
        container.style.display = '';
        container.classList.remove('hidden');
        this.store.getState().setFieldVisibility(fieldName, true);
        this.logger?.debug(`👁️ Campo mostrado: ${fieldName}`);
      }
    }
  }
  
  /**
   * Ocultar campo
   */
  hideField(fieldName) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      const container = field.closest('.field-container') || field.closest('.form-group');
      if (container) {
        container.style.display = 'none';
        container.classList.add('hidden');
        this.store.getState().setFieldVisibility(fieldName, false);
        this.logger?.debug(`🙈 Campo ocultado: ${fieldName}`);
      }
    }
  }
  
  /**
   * Habilitar campo
   */
  enableField(fieldName) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      field.disabled = false;
      field.classList.remove('disabled');
      this.store.getState().setFieldEnabled(fieldName, true);
      this.logger?.debug(`✅ Campo habilitado: ${fieldName}`);
    }
  }
  
  /**
   * Deshabilitar campo
   */
  disableField(fieldName) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      field.disabled = true;
      field.classList.add('disabled');
      this.store.getState().setFieldEnabled(fieldName, false);
      this.logger?.debug(`❌ Campo deshabilitado: ${fieldName}`);
    }
  }
  
  /**
   * Limpiar campo
   */
  clearField(fieldName) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      if (field.tagName === 'SELECT') {
        field.selectedIndex = 0;
        // Si tiene TomSelect, actualizar
        const tomSelectInstance = field.tomselect;
        if (tomSelectInstance) {
          tomSelectInstance.clear();
        }
      } else {
        field.value = '';
      }
      
      this.store.getState().updateFieldValue(fieldName, '');
      this.logger?.debug(`🧹 Campo limpiado: ${fieldName}`);
    }
  }
  
  /**
   * Establecer valor de campo
   */
  setFieldValue(fieldName, value) {
    const field = this._getFieldElement(fieldName);
    if (field) {
      if (field.tagName === 'SELECT') {
        field.value = value;
        // Si tiene TomSelect, actualizar
        const tomSelectInstance = field.tomselect;
        if (tomSelectInstance) {
          tomSelectInstance.setValue(value);
        }
      } else {
        field.value = value;
      }
      
      this.store.getState().updateFieldValue(fieldName, value);
      this.logger?.debug(`📝 Valor establecido para ${fieldName}: ${value}`);
    }
  }
  
  /**
   * Obtener valor de campo
   */
  getFieldValue(fieldName) {
    const field = this._getFieldElement(fieldName);
    return field ? field.value : null;
  }
  
  /**
   * Configurar eventos de campo
   */
  _setupFieldEvents(fieldName, element) {
    // Evento change
    element.addEventListener('change', (e) => {
      const value = e.target.value;
      this.store.getState().updateFieldValue(fieldName, value);
      this.logger?.debug(`🔄 Valor cambiado ${fieldName}: ${value}`);
    });
    
    // Evento blur para validación
    element.addEventListener('blur', (e) => {
      const value = e.target.value;
      this.store.getState().markFieldTouched(fieldName);
      this.logger?.debug(`👆 Campo tocado: ${fieldName}`);
    });
  }
  
  /**
   * Obtener elemento del campo
   */
  _getFieldElement(fieldName) {
    return this.formElement.querySelector(`[name="${fieldName}"]`);
  }
  
  /**
   * Obtener opciones para un campo específico desde DataPreloader
   */
  async _getFieldOptions(fieldName, category) {
    if (!this.dataPreloader) {
      this.logger?.warn(`DataPreloader no disponible para cargar opciones de ${fieldName}`);
      return [];
    }
    
    try {
      switch (category) {
        case 'phone_prefix':
          const prefixes = await this.dataPreloader.loadPrefixes();
          // Filtrar solo países válidos con datos completos
          return prefixes
            .filter(country => country.nameES && country.phoneCode && country.iso2)
            .map(country => ({
              value: country.iso2,
              text: `${country.nameES} (+${country.phoneCode})`,
              iso2: country.iso2,
              nameES: country.nameES,
              phoneCode: country.phoneCode
            }));
          
        case 'country':
          const countries = await this.dataPreloader.loadPrefixes(); // Usar prefixes que contiene países
          return countries
            .filter(country => country.nameES && country.iso2)
            .map(country => ({
              value: country.iso2,
              text: country.nameES,
              iso2: country.iso2,
              nameES: country.nameES,
              phoneCode: country.phoneCode
            }));
          
        case 'location':
          if (fieldName === 'country') {
            const locations = await this.dataPreloader.loadLocations();
            return Object.keys(locations).map(key => ({
              value: key,
              text: locations[key].nombre,
              data: locations[key]
            }));
          }
          return [];
          
        case 'academic':
        case 'university':
        case 'college':
        case 'company':
          // Para ahora retornar array vacío, se puede implementar después
          return [];
          
        default:
          this.logger?.warn(`Categoría desconocida: ${category} para campo ${fieldName}`);
          return [];
      }
    } catch (error) {
      this.logger?.error(`Error cargando opciones para ${fieldName}:`, error);
      return [];
    }
  }
  
  /**
   * Destruir todas las instancias
   */
  destroy() {
    this.tomSelectAdapter.destroyAll();
    this.cleaveAdapter.destroyAll();
    this.logger?.info('🗑️ FieldController destruido');
  }
}