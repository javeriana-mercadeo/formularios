/**
 * College - Módulo especializado para gestión del campo colegio (Modernizado)
 * Maneja la lógica de filtrado y población de colegios con múltiples criterios
 * @version 5.0 - Modernizado con TomSelectAdapter y Zustand
 */

import { Constants } from "../../core/Constants.js";
import { TomSelectAdapter } from "../../integrations/tom-select/TomSelectAdapter.js";
import { useFieldStore } from "../field-management/stores/field-store.js";
import { useValidationStore } from "../validation/stores/validation-store.js";

export class College {
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
    this.tomSelectInstance = null;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de colegio
   */
  async initializeCollegeField() {
    try {
      this.logger?.info("🏫 Inicializando campo colegio...");

      const collegeElement = this._getCollegeElement();
      if (!collegeElement) {
        this.logger?.warn("⚠️ Elemento colegio no encontrado");
        return;
      }

      // Configurar colegio con búsqueda habilitada y creación personalizada
      this.tomSelectInstance = await this.tomSelectAdapter.initializeByType(
        collegeElement, 
        [], 
        'college',
        {
          placeholder: 'Buscar colegio...',
          searchEnabled: true,
          create: true,
          createOnBlur: true,
          maxItems: 1,
          loadThrottle: 300, // Throttle para búsquedas
          createFilter: (input) => input.length >= 3 // Mínimo 3 caracteres para crear
        }
      );

      // Cargar colegios iniciales
      await this.loadColleges();

      this.logger?.info("✅ Campo colegio inicializado");

    } catch (error) {
      this.logger?.error("❌ Error inicializando colegio:", error);
    }
  }

  /**
   * Cargar colegios filtrados por ubicación
   */
  async loadColleges() {
    try {
      const locationConfig = this._getCurrentLocationConfig();
      let colleges = [];

      if (locationConfig.isColombiaSelected) {
        if (locationConfig.city) {
          // Filtrar por ciudad específica
          colleges = this.Data.getCollegesForCity(locationConfig.city);
          this.logger?.info(`🏙️ Cargando colegios para ciudad: ${locationConfig.city}`);
        } else if (locationConfig.department) {
          // Filtrar por departamento
          colleges = this.Data.getCollegesForDepartment(locationConfig.department);
          this.logger?.info(`🏛️ Cargando colegios para departamento: ${locationConfig.department}`);
        } else {
          // Todos los colegios de Colombia
          colleges = this.Data.getCollegesForCountry('CO');
          this.logger?.info("🇨🇴 Cargando colegios de Colombia");
        }
      } else {
        // Colegios internacionales
        colleges = this.Data.getCollegesForCountry(locationConfig.country);
        this.logger?.info(`🌍 Cargando colegios para país: ${locationConfig.country}`);
      }

      await this._populateCollegesModern(colleges);

    } catch (error) {
      this.logger?.error("❌ Error cargando colegios:", error);
    }
  }

  /**
   * Filtrar colegios por múltiples criterios
   */
  async filterColleges(filters = {}) {
    try {
      const {
        country = null,
        department = null,
        city = null,
        type = null,
        sector = null
      } = filters;

      let colleges = this.Data.getAllColleges();

      // Aplicar filtros progresivamente
      if (country) {
        colleges = colleges.filter(college => college.country === country);
      }

      if (department) {
        colleges = colleges.filter(college => college.department === department);
      }

      if (city) {
        colleges = colleges.filter(college => college.city === city);
      }

      if (type) {
        colleges = colleges.filter(college => college.type === type);
      }

      if (sector) {
        colleges = colleges.filter(college => college.sector === sector);
      }

      await this._populateCollegesModern(colleges);

      this.logger?.info(`🔍 Colegios filtrados: ${colleges.length} resultados`);

    } catch (error) {
      this.logger?.error("❌ Error filtrando colegios:", error);
    }
  }

  /**
   * Buscar colegios por texto
   */
  async searchColleges(searchTerm) {
    try {
      if (!searchTerm || searchTerm.length < 2) {
        await this.loadColleges();
        return;
      }

      const allColleges = this.Data.getAllColleges();
      const searchResults = allColleges.filter(college => 
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      await this._populateCollegesModern(searchResults);

      this.logger?.info(`🔎 Búsqueda "${searchTerm}": ${searchResults.length} resultados`);

    } catch (error) {
      this.logger?.error("❌ Error en búsqueda de colegios:", error);
    }
  }

  /**
   * Manejar selección de colegio
   */
  handleCollegeSelection(value, text) {
    this.validationStore.getState().updateField(Constants.FIELDS.SCHOOL, value);
    this.fieldStore.getState().updateFieldValue(Constants.FIELDS.SCHOOL, value);
    
    this.logger?.info(`🏫 Colegio seleccionado: ${text || value}`);

    // Validar si es un colegio personalizado (creado por el usuario)
    if (this._isCustomCollege(value)) {
      this.logger?.info(`✏️ Colegio personalizado: ${value}`);
      this._handleCustomCollege(value);
    }
  }

  /**
   * Obtener estadísticas de colegios
   */
  getCollegeStats() {
    const locationConfig = this._getCurrentLocationConfig();
    let totalColleges = 0;
    let filteredColleges = 0;

    totalColleges = this.Data.getAllColleges().length;

    if (locationConfig.isColombiaSelected) {
      if (locationConfig.city) {
        filteredColleges = this.Data.getCollegesForCity(locationConfig.city).length;
      } else if (locationConfig.department) {
        filteredColleges = this.Data.getCollegesForDepartment(locationConfig.department).length;
      } else {
        filteredColleges = this.Data.getCollegesForCountry('CO').length;
      }
    } else {
      filteredColleges = this.Data.getCollegesForCountry(locationConfig.country).length;
    }

    return {
      total: totalColleges,
      filtered: filteredColleges,
      country: locationConfig.country,
      department: locationConfig.department,
      city: locationConfig.city
    };
  }

  /**
   * Limpiar campo colegio
   */
  clearCollegeField() {
    const collegeElement = this._getCollegeElement();
    if (collegeElement && collegeElement.tomselect) {
      collegeElement.tomselect.clear();
    }

    this.validationStore.getState().updateField(Constants.FIELDS.SCHOOL, '');
    this.fieldStore.getState().clearFieldValue(Constants.FIELDS.SCHOOL);

    this.logger?.debug("🧹 Campo colegio limpiado");
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Poblar colegios usando TomSelectAdapter modernizado
   */
  async _populateCollegesModern(colleges) {
    try {
      const collegeElement = this._getCollegeElement();
      if (!collegeElement) {
        this.logger?.warn("⚠️ Elemento colegio no encontrado");
        return;
      }

      // Limpiar opciones existentes
      collegeElement.innerHTML = '<option value="">Buscar colegio...</option>';
      
      // Agregar opciones de colegios con información adicional
      const options = colleges.map(college => ({
        value: college.code || college.name,
        text: this._formatCollegeDisplayName(college),
        college: college // Mantener referencia completa
      }));

      // Agregar opciones al DOM
      options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        optionElement.dataset.city = option.college.city || '';
        optionElement.dataset.sector = option.college.sector || '';
        collegeElement.appendChild(optionElement);
      });

      // Actualizar store con opciones
      this.fieldStore.getState().setFieldOptions(Constants.FIELDS.SCHOOL, options);

      // Actualizar instancia de TomSelect si existe
      if (collegeElement.tomselect) {
        collegeElement.tomselect.clearOptions();
        collegeElement.tomselect.addOptions(options);
        collegeElement.tomselect.refreshOptions();
      }

      this.logger?.debug(`✅ ${colleges.length} colegios cargados`);

    } catch (error) {
      this.logger?.error("❌ Error poblando colegios:", error);
      
      // Fallback: usar método legacy
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.SCHOOL,
        options: colleges.map(college => ({ 
          value: college.code || college.name, 
          text: college.name 
        }))
      });
    }
  }

  /**
   * Formatear nombre de display del colegio
   */
  _formatCollegeDisplayName(college) {
    let displayName = college.name;
    
    if (college.city && college.city !== 'Unknown') {
      displayName += ` - ${college.city}`;
    }
    
    if (college.sector) {
      displayName += ` (${college.sector})`;
    }

    return displayName;
  }

  /**
   * Obtener elemento colegio del DOM
   */
  _getCollegeElement() {
    return document.querySelector(Constants.SELECTORS.SCHOOL);
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
   * Verificar si es un colegio personalizado (creado por usuario)
   */
  _isCustomCollege(value) {
    const allColleges = this.Data.getAllColleges();
    return !allColleges.some(college => 
      college.code === value || college.name === value
    );
  }

  /**
   * Manejar colegio personalizado
   */
  _handleCustomCollege(value) {
    // Lógica para manejar colegios personalizados
    // Por ejemplo, validar formato, guardar en localStorage, etc.
    
    if (value.length < 5) {
      this.logger?.warn("⚠️ Nombre de colegio personalizado muy corto");
    }

    // Guardar en caché local para futuras sesiones
    this._saveCustomCollegeToCache(value);
  }

  /**
   * Guardar colegio personalizado en caché
   */
  _saveCustomCollegeToCache(collegeName) {
    try {
      const customColleges = JSON.parse(localStorage.getItem('customColleges') || '[]');
      
      if (!customColleges.includes(collegeName)) {
        customColleges.push(collegeName);
        localStorage.setItem('customColleges', JSON.stringify(customColleges));
        this.logger?.debug(`💾 Colegio personalizado guardado: ${collegeName}`);
      }
    } catch (error) {
      this.logger?.warn("⚠️ Error guardando colegio personalizado:", error);
    }
  }

  /**
   * Cargar colegios personalizados desde caché
   */
  _loadCustomCollegesFromCache() {
    try {
      const customColleges = JSON.parse(localStorage.getItem('customColleges') || '[]');
      return customColleges.map(name => ({
        code: name,
        name: name,
        city: 'Personalizado',
        sector: 'Personalizado',
        isCustom: true
      }));
    } catch (error) {
      this.logger?.warn("⚠️ Error cargando colegios personalizados:", error);
      return [];
    }
  }

  /**
   * Validar selección de colegio
   */
  validateCollegeSelection() {
    const selectedCollege = this.validationStore.getState().getFieldValue(Constants.FIELDS.SCHOOL);
    
    if (!selectedCollege) {
      return { valid: false, error: 'Colegio es requerido' };
    }

    if (this._isCustomCollege(selectedCollege)) {
      // Validar colegios personalizados
      if (selectedCollege.length < 5) {
        return { valid: false, error: 'Nombre de colegio debe tener al menos 5 caracteres' };
      }
      
      if (!/^[a-zA-ZÀ-ÿ\s\-\.]+$/.test(selectedCollege)) {
        return { valid: false, error: 'Nombre de colegio contiene caracteres no válidos' };
      }
    }

    return { valid: true };
  }

  /**
   * Configurar eventos del campo colegio
   */
  _setupCollegeEvents() {
    const collegeElement = this._getCollegeElement();
    if (!collegeElement) return;

    // Evento de cambio
    collegeElement.addEventListener('change', (e) => {
      this.handleCollegeSelection(e.target.value, e.target.selectedOptions[0]?.text);
    });

    // Eventos específicos de TomSelect
    if (collegeElement.tomselect) {
      // Evento de búsqueda dinámica
      collegeElement.tomselect.on('type', (searchTerm) => {
        if (searchTerm.length >= 2) {
          this.searchColleges(searchTerm);
        }
      });

      // Evento de creación de nuevo item
      collegeElement.tomselect.on('item_add', (value, item) => {
        if (this._isCustomCollege(value)) {
          this._handleCustomCollege(value);
        }
      });
    }
  }

  /**
   * Destruir instancias de TomSelect
   */
  destroy() {
    if (this.tomSelectInstance) {
      this.tomSelectInstance.destroy();
    }
    this.tomSelectAdapter.destroyAll();
    this.logger?.info("🗑️ College module destruido");
  }
}