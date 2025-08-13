/**
 * University - Módulo especializado para gestión del campo universidad (Modernizado)
 * Maneja la lógica de filtrado y población de universidades
 * @version 2.0 - Modernizado con TomSelectAdapter y Zustand
 */

import { Constants } from "../../core/Constants.js";
import { TomSelectAdapter } from "../../integrations/tom-select/TomSelectAdapter.js";
import { useFieldStore } from "../field-management/stores/field-store.js";
import { useValidationStore } from "../validation/stores/validation-store.js";

export class University {
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
   * Inicializar campo de universidad
   */
  async initializeUniversityField() {
    try {
      this.logger?.info("🎓 Inicializando campo universidad...");

      const universityElement = this._getUniversityElement();
      if (!universityElement) {
        this.logger?.warn("⚠️ Elemento universidad no encontrado");
        return;
      }

      // Configurar universidad con búsqueda habilitada
      await this.tomSelectAdapter.initializeByType(universityElement, [], 'university', {
        placeholder: 'Buscar universidad...',
        searchEnabled: true,
        create: true,
        createOnBlur: true,
        maxItems: 1
      });

      // Cargar universidades
      await this.loadUniversities();

      this.logger?.info("✅ Campo universidad inicializado");

    } catch (error) {
      this.logger?.error("❌ Error inicializando universidad:", error);
    }
  }

  /**
   * Cargar universidades filtradas por ubicación
   */
  async loadUniversities() {
    try {
      const locationConfig = this._getCurrentLocationConfig();
      let universities = [];

      if (locationConfig.isColombiaSelected && locationConfig.city) {
        // Filtrar por ciudad si es Colombia
        universities = this.Data.getUniversitiesForCity(locationConfig.city);
        this.logger?.info(`🏙️ Cargando universidades para ciudad: ${locationConfig.city}`);
      } else if (locationConfig.isColombiaSelected && locationConfig.department) {
        // Filtrar por departamento si es Colombia
        universities = this.Data.getUniversitiesForDepartment(locationConfig.department);
        this.logger?.info(`🏛️ Cargando universidades para departamento: ${locationConfig.department}`);
      } else {
        // Cargar todas las universidades
        universities = this.Data.getAllUniversities();
        this.logger?.info("🌍 Cargando todas las universidades");
      }

      await this._populateUniversitiesModern(universities);

    } catch (error) {
      this.logger?.error("❌ Error cargando universidades:", error);
    }
  }

  /**
   * Filtrar universidades por ubicación
   */
  async filterUniversitiesByLocation(country, department = null, city = null) {
    try {
      let universities = [];

      if (country === 'CO') { // Colombia
        if (city) {
          universities = this.Data.getUniversitiesForCity(city);
        } else if (department) {
          universities = this.Data.getUniversitiesForDepartment(department);
        } else {
          universities = this.Data.getUniversitiesForCountry(country);
        }
      } else {
        universities = this.Data.getUniversitiesForCountry(country);
      }

      await this._populateUniversitiesModern(universities);

      this.logger?.info(`🔍 Universidades filtradas: ${universities.length} resultados`);

    } catch (error) {
      this.logger?.error("❌ Error filtrando universidades:", error);
    }
  }

  /**
   * Manejar selección de universidad
   */
  handleUniversitySelection(value, text) {
    this.validationStore.getState().updateField(Constants.FIELDS.UNIVERSITY, value);
    this.fieldStore.getState().updateFieldValue(Constants.FIELDS.UNIVERSITY, value);
    
    this.logger?.info(`🎓 Universidad seleccionada: ${text || value}`);

    // Validar si es una universidad personalizada (creada por el usuario)
    if (this._isCustomUniversity(value)) {
      this.logger?.info(`✏️ Universidad personalizada: ${value}`);
    }
  }

  /**
   * Obtener universidades sugeridas basadas en texto de búsqueda
   */
  getUniversitySuggestions(searchTerm) {
    try {
      if (!searchTerm || searchTerm.length < 2) {
        return [];
      }

      const allUniversities = this.Data.getAllUniversities();
      const suggestions = allUniversities.filter(university => 
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.code.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return suggestions.slice(0, 10); // Limitar a 10 sugerencias

    } catch (error) {
      this.logger?.error("❌ Error obteniendo sugerencias:", error);
      return [];
    }
  }

  /**
   * Limpiar campo universidad
   */
  clearUniversityField() {
    const universityElement = this._getUniversityElement();
    if (universityElement && universityElement.tomselect) {
      universityElement.tomselect.clear();
    }

    this.validationStore.getState().updateField(Constants.FIELDS.UNIVERSITY, '');
    this.fieldStore.getState().clearFieldValue(Constants.FIELDS.UNIVERSITY);

    this.logger?.debug("🧹 Campo universidad limpiado");
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Poblar universidades usando TomSelectAdapter modernizado
   */
  async _populateUniversitiesModern(universities) {
    try {
      const universityElement = this._getUniversityElement();
      if (!universityElement) {
        this.logger?.warn("⚠️ Elemento universidad no encontrado");
        return;
      }

      // Limpiar opciones existentes
      universityElement.innerHTML = '<option value="">Buscar universidad...</option>';
      
      // Agregar opciones de universidades
      const options = universities.map(university => ({
        value: university.code || university.name,
        text: university.name
      }));

      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        universityElement.appendChild(optionElement);
      });

      // Actualizar store con opciones
      this.fieldStore.getState().setFieldOptions(Constants.FIELDS.UNIVERSITY, options);

      // Actualizar instancia de TomSelect si existe
      if (universityElement.tomselect) {
        universityElement.tomselect.clearOptions();
        universityElement.tomselect.addOptions(options);
        universityElement.tomselect.refreshOptions();
      }

      this.logger?.debug(`✅ ${universities.length} universidades cargadas`);

    } catch (error) {
      this.logger?.error("❌ Error poblando universidades:", error);
      
      // Fallback: usar método legacy
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.UNIVERSITY,
        options: universities.map(uni => ({ 
          value: uni.code || uni.name, 
          text: uni.name 
        }))
      });
    }
  }

  /**
   * Obtener elemento universidad del DOM
   */
  _getUniversityElement() {
    return document.querySelector(Constants.SELECTORS.UNIVERSITY);
  }

  /**
   * Obtener configuración de ubicación actual
   */
  _getCurrentLocationConfig() {
    return {
      country: this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY),
      department: this.validationStore.getState().getFieldValue(Constants.FIELDS.DEPARTMENT),
      city: this.validationStore.getState().getFieldValue(Constants.FIELDS.CITY),
      isColombiaSelected: this._isColombiaSelected()
    };
  }

  /**
   * Verificar si Colombia está seleccionada
   */
  _isColombiaSelected() {
    const selectedCountry = this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY);
    return selectedCountry === 'CO'; // Colombia
  }

  /**
   * Verificar si es una universidad personalizada (creada por usuario)
   */
  _isCustomUniversity(value) {
    const allUniversities = this.Data.getAllUniversities();
    return !allUniversities.some(uni => 
      uni.code === value || uni.name === value
    );
  }

  /**
   * Configurar eventos del campo universidad
   */
  _setupUniversityEvents() {
    const universityElement = this._getUniversityElement();
    if (!universityElement) return;

    // Evento de cambio
    universityElement.addEventListener('change', (e) => {
      this.handleUniversitySelection(e.target.value, e.target.selectedOptions[0]?.text);
    });

    // Evento de búsqueda personalizada (si TomSelect lo soporta)
    if (universityElement.tomselect) {
      universityElement.tomselect.on('type', (searchTerm) => {
        const suggestions = this.getUniversitySuggestions(searchTerm);
        // Aquí se podrían agregar dinámicamente las sugerencias
      });
    }
  }

  /**
   * Validar selección de universidad
   */
  validateUniversitySelection() {
    const selectedUniversity = this.validationStore.getState().getFieldValue(Constants.FIELDS.UNIVERSITY);
    
    if (!selectedUniversity) {
      return { valid: false, error: 'Universidad es requerida' };
    }

    if (this._isCustomUniversity(selectedUniversity)) {
      // Validar longitud mínima para universidades personalizadas
      if (selectedUniversity.length < 5) {
        return { valid: false, error: 'Nombre de universidad debe tener al menos 5 caracteres' };
      }
    }

    return { valid: true };
  }

  /**
   * Obtener estadísticas de universidades
   */
  getUniversityStats() {
    const locationConfig = this._getCurrentLocationConfig();
    let totalUniversities = 0;
    let filteredUniversities = 0;

    totalUniversities = this.Data.getAllUniversities().length;

    if (locationConfig.isColombiaSelected && locationConfig.city) {
      filteredUniversities = this.Data.getUniversitiesForCity(locationConfig.city).length;
    } else if (locationConfig.isColombiaSelected && locationConfig.department) {
      filteredUniversities = this.Data.getUniversitiesForDepartment(locationConfig.department).length;
    } else {
      filteredUniversities = totalUniversities;
    }

    return {
      total: totalUniversities,
      filtered: filteredUniversities,
      country: locationConfig.country,
      department: locationConfig.department,
      city: locationConfig.city
    };
  }

  /**
   * Destruir instancias de TomSelect
   */
  destroy() {
    this.tomSelectAdapter.destroyAll();
    this.logger?.info("🗑️ University module destruido");
  }
}