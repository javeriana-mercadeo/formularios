/**
 * Locations - Módulo especializado para gestión de campos de ubicación (Modernizado)
 * Maneja toda la lógica relacionada con países, departamentos y ciudades
 * @version 2.0 - Modernizado con TomSelectAdapter y Zustand
 */

import { Constants } from "../../core/Constants.js";
import { TomSelectAdapter } from "../../integrations/tom-select/TomSelectAdapter.js";
import { useFieldStore } from "../field-management/stores/field-store.js";
import { useValidationStore } from "../validation/stores/validation-store.js";

export class Locations {
  constructor(Data, Ui, logger = null, config = null) {
    this.Data = Data;
    this.Ui = Ui; // Mantener compatibilidad
    this.logger = logger;
    this.config = config;
    
    // Stores modernos
    this.fieldStore = useFieldStore;
    this.validationStore = useValidationStore;
    
    // Adaptador TomSelect
    this.tomSelectAdapter = new TomSelectAdapter(logger);
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.validationStore.getState().updateField(Constants.FIELDS.COUNTRY, value);
    this.logger?.info(`🌍 País cambiado a: ${value}`);

    const defaultCountry = this._getInitialCountry();
    
    if (value === defaultCountry) {
      // Colombia: mostrar departamentos y ciudades
      this._showColombianLocationFields();
      this._loadDepartments();
    } else {
      // Otro país: ocultar campos departamento/ciudad
      this._hideColombianLocationFields();
      this._clearLocationFields();
    }
  }

  /**
   * Manejar cambio de departamento
   */
  async handleDepartmentChange(value) {
    this.validationStore.getState().updateField(Constants.FIELDS.DEPARTMENT, value);
    this.logger?.info(`🏛️ Departamento cambiado a: ${value}`);

    if (value) {
      await this._loadCitiesForDepartment(value);
    } else {
      this._clearCityField();
    }
  }

  /**
   * Configurar países iniciales
   */
  async initializeCountries() {
    try {
      this.logger?.info("🌍 Inicializando países...");

      const countries = this.Data.getCountries();
      
      await this._populateSelectModern({
        fieldName: Constants.FIELDS.COUNTRY,
        selector: Constants.SELECTORS.COUNTRY,
        options: countries.map(country => ({ value: country.code, text: country.name })),
        type: 'location',
        placeholder: 'Selecciona tu país...'
      });

      // Pre-seleccionar país por defecto si existe
      const defaultCountry = this._getInitialCountry();
      if (defaultCountry) {
        this.validationStore.getState().updateField(Constants.FIELDS.COUNTRY, defaultCountry);
        this.handleCountryChange(defaultCountry);
      }

    } catch (error) {
      this.logger?.error("❌ Error inicializando países:", error);
    }
  }

  /**
   * Configurar departamentos colombianos
   */
  async configureDepartments() {
    try {
      this.logger?.info("🏛️ Configurando departamentos...");

      const departments = this.Data.getDepartments();
      
      await this._populateSelectModern({
        fieldName: Constants.FIELDS.DEPARTMENT,
        selector: Constants.SELECTORS.DEPARTMENT,
        options: departments.map(dept => ({ value: dept.code, text: dept.name })),
        type: 'location',
        placeholder: 'Selecciona tu departamento...'
      });

    } catch (error) {
      this.logger?.error("❌ Error configurando departamentos:", error);
    }
  }

  /**
   * Configurar ciudades para un departamento
   */
  async configureCities(departmentCode) {
    try {
      this.logger?.info(`🏙️ Configurando ciudades para: ${departmentCode}`);

      const cities = this.Data.getCitiesForDepartment(departmentCode);
      
      if (cities.length === 0) {
        this.logger?.warn(`⚠️ No se encontraron ciudades para: ${departmentCode}`);
        return;
      }

      await this._populateSelectModern({
        fieldName: Constants.FIELDS.CITY,
        selector: Constants.SELECTORS.CITY,
        options: cities.map(city => ({ value: city.code, text: city.name })),
        type: 'location',
        placeholder: 'Selecciona tu ciudad...'
      });

      // Mostrar campo ciudad
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, true);

    } catch (error) {
      this.logger?.error("❌ Error configurando ciudades:", error);
    }
  }

  /**
   * Obtener configuración de ubicación actual
   */
  getCurrentLocationConfig() {
    return {
      country: this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY),
      department: this.validationStore.getState().getFieldValue(Constants.FIELDS.DEPARTMENT),
      city: this.validationStore.getState().getFieldValue(Constants.FIELDS.CITY),
      isColombiaSelected: this._isColombiaSelected()
    };
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Método modernizado para popular selects usando TomSelectAdapter
   */
  async _populateSelectModern({ fieldName, selector, options, type = 'location', placeholder = null }) {
    try {
      // Obtener elemento del DOM
      const selectElement = document.querySelector(selector);
      if (!selectElement) {
        this.logger?.warn(`⚠️ Elemento no encontrado: ${selector}`);
        return;
      }

      // Limpiar opciones existentes
      selectElement.innerHTML = '<option value="">Selecciona...</option>';
      
      // Agregar nuevas opciones
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        selectElement.appendChild(optionElement);
      });

      // Actualizar store con opciones
      this.fieldStore.getState().setFieldOptions(fieldName, options);

      // Inicializar con TomSelect si no existe ya
      if (!selectElement.tomselect) {
        const config = placeholder ? { placeholder } : {};
        await this.tomSelectAdapter.initializeByType(selectElement, [], type, config);
      } else {
        // Actualizar instancia existente
        selectElement.tomselect.clearOptions();
        selectElement.tomselect.addOptions(options);
        selectElement.tomselect.refreshOptions();
      }

      this.logger?.debug(`✅ Select de ubicación actualizado: ${fieldName}`);

    } catch (error) {
      this.logger?.error(`❌ Error populando select ${fieldName}:`, error);
      
      // Fallback: usar método legacy
      this.Ui.populateSelect({
        selector,
        options: options.map(opt => ({ value: opt.value, text: opt.text }))
      });
    }
  }

  /**
   * Mostrar campos específicos de Colombia
   */
  _showColombianLocationFields() {
    this.fieldStore.getState().showLocationFields('Colombia');
    this.logger?.debug("👁️ Campos colombianos mostrados");
  }

  /**
   * Ocultar campos específicos de Colombia
   */
  _hideColombianLocationFields() {
    this.fieldStore.getState().showLocationFields('Other');
    this.logger?.debug("🙈 Campos colombianos ocultados");
  }

  /**
   * Cargar departamentos
   */
  async _loadDepartments() {
    await this.configureDepartments();
  }

  /**
   * Cargar ciudades para un departamento
   */
  async _loadCitiesForDepartment(departmentCode) {
    await this.configureCities(departmentCode);
  }

  /**
   * Limpiar campos de ubicación específicos
   */
  _clearLocationFields() {
    const fields = [Constants.FIELDS.DEPARTMENT, Constants.FIELDS.CITY];
    
    fields.forEach(field => {
      this.validationStore.getState().updateField(field, '');
      this.fieldStore.getState().clearFieldValue(field);
    });

    this.logger?.debug("🧹 Campos de ubicación limpiados");
  }

  /**
   * Limpiar solo campo ciudad
   */
  _clearCityField() {
    this.validationStore.getState().updateField(Constants.FIELDS.CITY, '');
    this.fieldStore.getState().clearFieldValue(Constants.FIELDS.CITY);
    this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, false);
    
    this.logger?.debug("🧹 Campo ciudad limpiado");
  }

  /**
   * Verificar si Colombia está seleccionada
   */
  _isColombiaSelected() {
    const selectedCountry = this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY);
    return selectedCountry === this._getInitialCountry();
  }

  /**
   * Obtener país inicial por defecto
   */
  _getInitialCountry() {
    // Obtener desde configuración o usar Colombia como defecto
    return this.config?.defaultCountry || 'CO'; // Colombia
  }

  /**
   * Validar configuración de ubicación
   */
  isLocationConfigurationValid() {
    const config = this.getCurrentLocationConfig();
    
    if (!config.country) {
      return { valid: false, error: 'País requerido' };
    }

    if (config.isColombiaSelected) {
      if (!config.department) {
        return { valid: false, error: 'Departamento requerido para Colombia' };
      }
      if (!config.city) {
        return { valid: false, error: 'Ciudad requerida para Colombia' };
      }
    }

    return { valid: true };
  }

  /**
   * Limpiar todos los campos de ubicación
   */
  clearAllLocationFields() {
    const fields = [
      Constants.FIELDS.COUNTRY,
      Constants.FIELDS.DEPARTMENT, 
      Constants.FIELDS.CITY
    ];

    fields.forEach(field => {
      this.validationStore.getState().updateField(field, '');
      this.fieldStore.getState().clearFieldValue(field);
    });

    this.logger?.debug("🧹 Todos los campos de ubicación limpiados");
  }

  /**
   * Destruir instancias de TomSelect
   */
  destroy() {
    this.tomSelectAdapter.destroyAll();
    this.logger?.info("🗑️ Locations module destruido");
  }
}