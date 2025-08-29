/**
 * University - Módulo especializado para gestión del campo universidad
 * Maneja la lógica de filtrado y población de universidades con múltiples criterios
 * Usa filtros avanzados para optimización de listas grandes
 * @version 2.0 - Con filtros avanzados
 */

import { Constants } from "./Constants.js";

export class University {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
    this.config = config;
    
    // Estado del filtro avanzado (como College.js)
    this.selectedUniversity = null;
    this.allUniversitiesData = [];
    this.filteredUniversities = [];
    this.selectedDepartment = '';
    this.selectedCity = '';
    this.searchTerm = '';
    
    // Configuración de visualización
    this.maxVisibleResults = 10;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de universidad
   */
  initializeUniversityField() {
    this.logger.info("🎓 🚀 Iniciando inicialización del campo universidad...");

    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (!universityElement) {
      this.logger.warn(
        `❌ Campo universidad no encontrado. Selector usado: ${Constants.SELECTORS.UNIVERSITY}`
      );
      return;
    }

    this.logger.info("✅ Campo universidad encontrado en el DOM");

    // Configurar listener para cambios en tipo de asistente
    this._setupTypeAttendeeListener();

    // Configurar listener para cambios en nivel académico
    this._setupAcademicLevelListener();

    // Verificar inicialmente si debe mostrar el campo
    this._initializeUniversityVisibility();
  }

  /**
   * Inicializar estado de campo universidad basado en tipo de asistente actual
   */
  _initializeUniversityVisibility() {
    this.logger.info("🎓 🔍 Verificando estado inicial del tipo de asistente...");

    const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
    const domValue = typeAttendeeElement?.value || "";
    const selectedValue = currentTypeAttendee || domValue;

    if (selectedValue) {
      this.logger.info(`🎓 ⚡ Tipo de asistente ya seleccionado: "${selectedValue}" - verificando visibilidad`);
      this._checkAndToggleUniversityVisibility(selectedValue);
    } else {
      this.logger.info("🎓 ➡️ No hay tipo de asistente seleccionado inicialmente - campo universidad oculto");
      this._hideUniversityField();
    }
  }

  /**
   * Obtener universidades filtradas basadas en la configuración
   * @returns {Array} - Array de universidades filtradas
   */
  getFilteredUniversities() {
    this.logger.info("🎓 🔍 Iniciando getFilteredUniversities()");

    const universityRawData = this.Data.data.university;
    const universityData = universityRawData?.cuentasInstitucionales;

    if (!universityData || !Array.isArray(universityData)) {
      this.logger.warn("⚠️ No se encontraron datos de universidades");
      return [];
    }

    const config = this.config?.config || this.config || {};
    const configUniversities = config.universities;

    if (configUniversities && Array.isArray(configUniversities) && configUniversities.length > 0) {
      const filteredUniversities = [];
      
      configUniversities.forEach(configName => {
        const matchedUniversity = universityData.find(university => 
          this._matchUniversityName(university.NAME, configName)
        );
        
        if (matchedUniversity) {
          filteredUniversities.push(matchedUniversity);
        } else {
          this.logger.warn(`⚠️ Universidad no encontrada en JSON: "${configName}"`);
        }
      });

      this.logger.info(`🎓 Universidades filtradas por configuración: ${filteredUniversities.length}/${configUniversities.length}`);
      return filteredUniversities;
    } else {
      this.logger.info(`🎓 Usando todas las universidades: ${universityData.length} universidades`);
      return universityData;
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Configurar listener para cambios en tipo de asistente
   * @private
   */
  _setupTypeAttendeeListener() {
    this.logger.info("🎓 🎧 Configurando listener para tipo de asistente...");

    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
    if (!typeAttendeeElement) {
      this.logger.warn(`❌ Campo tipo de asistente no encontrado. Selector: ${Constants.SELECTORS.TYPE_ATTENDEE}`);
      return;
    }

    typeAttendeeElement.addEventListener("change", (event) => {
      this.logger.info(`🎓 🔄 Cambio detectado en tipo de asistente: "${event.target.value}"`);
      this._checkAndToggleUniversityVisibility(event.target.value);
    });
  }

  /**
   * Configurar listener para cambios en nivel académico
   * @private
   */
  _setupAcademicLevelListener() {
    this.logger.info("🎓 🎧 Configurando listener para nivel académico...");

    const academicLevelElement = this.Ui.scopedQuery(Constants.SELECTORS.ACADEMIC_LEVEL);
    if (!academicLevelElement) {
      this.logger.warn(`❌ Campo nivel académico no encontrado. Selector: ${Constants.SELECTORS.ACADEMIC_LEVEL}`);
      return;
    }

    academicLevelElement.addEventListener("change", (event) => {
      this.logger.info(`🎓 🔄 Cambio detectado en nivel académico: "${event.target.value}"`);
      
      // Reevaluar visibilidad con el tipo de asistente actual
      const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
      if (currentTypeAttendee) {
        this._checkAndToggleUniversityVisibility(currentTypeAttendee);
      }
    });
  }

  /**
   * Verificar y alternar visibilidad del campo universidad
   * @private
   */
  _checkAndToggleUniversityVisibility(selectedValue) {
    this.logger.info("🎓 Verificando visibilidad del campo universidad...");

    // Obtener el nivel académico actual
    const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL);
    this.logger.info(`🎓 Nivel académico actual: "${currentAcademicLevel}"`);

    // Lógica nueva: universidades solo aparecen si:
    // 1. Nivel académico es "Posgrado" Y
    // 2. Tipo de asistente es "Aspirante"
    const isValidTypeAttendee = selectedValue === "Aspirante";
    
    // Verificar si es un nivel de posgrado (código correcto: GRAD)
    const isValidAcademicLevel = currentAcademicLevel === "GRAD";

    const shouldShow = isValidTypeAttendee && isValidAcademicLevel;

    this.logger.info(`🎓 Validaciones:`, {
      typeAttendee: selectedValue,
      academicLevel: currentAcademicLevel,
      isValidTypeAttendee,
      isValidAcademicLevel,
      shouldShow
    });

    if (shouldShow) {
      this.logger.info("🎓 ✅ MOSTRANDO filtros de universidad (Posgrado + Aspirante)");
      this._showUniversityFilters();
    } else {
      this.logger.info("🎓 ❌ OCULTANDO campo universidad (no cumple condiciones)");
      this._hideUniversityField();
    }

    this.logger.info(
      `🎓 Campo universidad ${shouldShow ? "mostrado" : "oculto"} para tipo: "${selectedValue}" y nivel: "${currentAcademicLevel}"`
    );
  }

  /**
   * Ocultar campo de universidad
   * @private
   */
  _hideUniversityField() {
    this.state.setFieldVisibility(Constants.FIELDS.UNIVERSITY, false);
    this._hideUniversityFieldInDOM();

    // Limpiar campo
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (universityElement) {
      universityElement.value = "";
    }

    // Limpiar también del state para que no se envíe al backend
    this.state.updateField(Constants.FIELDS.UNIVERSITY, "");

    // Ocultar errores de validación al ocultar el campo
    this.hideValidationError();

    this.logger.info("🎓 Selector de universidad limpiado y ocultado");
  }

  /**
   * Ocultar campo universidad en el DOM
   * @private
   */
  _hideUniversityFieldInDOM() {
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (!universityElement) return;

    // Ocultar el contenedor de filtros
    const filtersContainer = document.querySelector('.university-filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = 'none';
    }

    // Ocultar y limpiar el select original
    universityElement.style.display = "none";
    universityElement.setAttribute("disabled", "disabled");
    universityElement.removeAttribute("required");
    universityElement.value = "";

    this.logger.info("🎓 Campo universidad ocultado en DOM");
  }

  /**
   * Mostrar campo universidad en el DOM (igual que College.js)
   * @private
   */
  _showUniversityFieldInDOM() {
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (!universityElement) return;

    // Mostrar el contenedor de filtros y ocultar el select original
    const filtersContainer = document.querySelector('.university-filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = "block";
    }

    // Mantener el select original oculto pero funcional para validación
    universityElement.style.display = "none";
    universityElement.removeAttribute("disabled");
    
    // Limpiar errores previos ANTES de poner required
    this._clearValidationErrors();
    
    // Poner required DESPUÉS de limpiar errores para evitar validación automática
    universityElement.setAttribute("required", "required");

    this.logger.info("🎓 Campo universidad mostrado en DOM (oculto pero funcional)");
  }

  /**
   * Limpiar errores de validación del campo universidad (igual que College.js)
   * @private  
   */
  _clearValidationErrors() {
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (!universityElement) return;

    // Quitar clase de error del select original
    universityElement.classList.remove('error');

    // Quitar clases de error del input de búsqueda
    const searchInput = document.getElementById('university-search-input');
    if (searchInput) {
      searchInput.classList.remove('error');
    }

    // Remover mensajes de error existentes
    const existingError = document.querySelector('.university-validation-error');
    if (existingError) {
      existingError.remove();
    }

    this.logger.debug("🎓 Errores de validación limpiados");
  }

  /**
   * Mostrar error de validación en la UI del sistema de filtros (igual que College.js)
   * @param {string} errorMessage - Mensaje de error a mostrar
   */
  showValidationError(errorMessage = "Debes seleccionar una universidad") {
    this.logger?.debug("🎓 ⚠️ Mostrando error de validación de la universidad");
    
    // Buscar o crear elemento de error específico para el sistema de filtros
    let errorElement = document.querySelector('#university-validation-error');
    
    if (!errorElement) {
      // Crear elemento de error si no existe
      errorElement = document.createElement('div');
      errorElement.id = 'university-validation-error';
      errorElement.className = 'error_text university-error';
      errorElement.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        display: block;
        opacity: 1;
        transition: opacity 0.3s ease;
      `;
      
      // Insertar después del contenedor de filtros
      const filtersContainer = document.querySelector('.university-filters-container');
      if (filtersContainer && filtersContainer.parentNode) {
        filtersContainer.parentNode.insertAdjacentElement('afterend', errorElement);
      } else {
        // Fallback: insertar después del elemento universidad
        const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
        if (universityElement && universityElement.parentNode) {
          universityElement.parentNode.insertAdjacentElement('afterend', errorElement);
        }
      }
    }
    
    // Establecer mensaje y mostrar
    errorElement.textContent = errorMessage;
    errorElement.style.display = 'block';
    errorElement.style.opacity = '1';
    
    // Agregar clase de error al campo original
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (universityElement) {
      universityElement.classList.add('error');
    }
    
    // Resaltar el input de búsqueda si existe
    const searchInput = document.getElementById('university-search-input');
    if (searchInput) {
      searchInput.classList.add('error');
      searchInput.focus();
    }
    
    this.logger?.debug(`🎓 ❌ Error de validación mostrado: "${errorMessage}"`);
  }

  /**
   * Ocultar error de validación en la UI (igual que College.js)
   */
  hideValidationError() {
    this.logger?.debug("🎓 ✅ Ocultando error de validación de la universidad");
    
    // Ocultar elemento de error específico
    const errorElement = document.querySelector('#university-validation-error');
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.style.opacity = '0';
    }
    
    // Quitar clases de error del campo original
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (universityElement) {
      universityElement.classList.remove('error');
    }
    
    // Quitar clases de error del input de búsqueda
    const searchInput = document.getElementById('university-search-input');
    if (searchInput) {
      searchInput.classList.remove('error');
    }
    
    this.logger?.debug("🎓 ✅ Error de validación ocultado");
  }

  /**
   * Mostrar filtros de universidad
   * @private
   */
  async _showUniversityFilters() {
    try {
      const filtersContainer = document.querySelector('.university-filters-container');
      if (!filtersContainer) {
        this.logger.warn("❌ Contenedor de filtros de universidad no encontrado");
        return;
      }

      // Mostrar contenedor
      filtersContainer.style.display = 'block';
      this.state.setFieldVisibility(Constants.FIELDS.UNIVERSITY, true);

      // Mostrar campo universidad en DOM (igual que College.js)
      this._showUniversityFieldInDOM();

      // Poblar filtros
      await this._populateUniversityFilters();

      // Configurar event listeners
      this._setupUniversityFilterListeners();

      this.logger.info("🎓 ✅ Filtros de universidad mostrados y configurados");

    } catch (error) {
      this.logger.error("❌ Error mostrando filtros de universidad:", error);
    }
  }

  /**
   * Poblar filtros de universidad
   * @private
   */
  async _populateUniversityFilters() {
    this.allUniversitiesData = this.getFilteredUniversities();
    
    if (this.allUniversitiesData.length === 0) {
      this.logger.warn("⚠️ No hay universidades disponibles para poblar filtros");
      return;
    }

    // Inicializar filtros
    this._initializeFilters();

    this.logger.info(`🎓 Filtros poblados con ${this.allUniversitiesData.length} universidades`);
  }

  /**
   * Inicializar filtros (igual que College.js)
   * @private
   */
  _initializeFilters() {
    this.logger.info("🎓 🔧 Inicializando opciones de filtros...");

    // Obtener departamentos únicos de universidades con nombres legibles
    const departmentData = this._getDepartmentData();

    // Poblar filtro de departamentos
    const departmentFilter = document.getElementById('university-department-filter');
    if (departmentFilter) {
      departmentFilter.innerHTML = '<option value="">Departamento</option>';
      departmentData.forEach(dept => {
        const option = document.createElement('option');
        option.value = dept.code;
        option.textContent = dept.name;
        departmentFilter.appendChild(option);
      });
    }

    // Inicializar variables de filtro
    this.selectedDepartment = '';
    this.selectedCity = '';
    this.searchTerm = '';
    this.filteredUniversities = [...this.allUniversitiesData];
    this.selectedUniversity = null;

    this.logger.info(`🎓 📊 Filtros inicializados: ${departmentData.length} departamentos disponibles`);
  }

  /**
   * Obtener datos de departamentos con códigos y nombres legibles (igual que College.js)
   * @private
   */
  _getDepartmentData() {
    // Mapa de códigos de departamento a nombres (igual que College.js pero con códigos adicionales)
    const departmentMap = {
      'AMA': 'Amazonas',
      'ANT': 'Antioquia',
      'ARA': 'Arauca', 
      'ATL': 'Atlántico',
      'BOG': 'Bogotá D.C.',
      'BOL': 'Bolívar',
      'BOY': 'Boyacá',
      'CAL': 'Caldas',
      'CAQ': 'Caquetá',
      'CAS': 'Casanare',
      'CAU': 'Cauca',
      'CES': 'Cesar',
      'CHO': 'Chocó',
      'CO': 'Córdoba',
      'COAH': 'Coahuila',
      'COR': 'Córdoba',
      'CUN': 'Cundinamarca',
      'EMEX': 'Estado de México',
      'GAI': 'Guainía',
      'GAV': 'Guaviare',
      'GTO': 'Guanajuato',
      'HUI': 'Huila',
      'JAL': 'Jalisco',
      'LAG': 'La Guajira',
      'MAG': 'Magdalena',
      'MET': 'Meta',
      'NAR': 'Nariño',
      'NSA': 'Norte de Santander',
      'OAX': 'Oaxaca',
      'PUE': 'Puebla',
      'PUT': 'Putumayo',
      'QUI': 'Quindío',
      'RIS': 'Risaralda',
      'RJ': 'Río de Janeiro',
      'RR': 'Roraima',
      'SAN': 'Santander',
      'SP': 'São Paulo',
      'STD': 'Santander',
      'SUC': 'Sucre',
      'TOL': 'Tolima',
      'VAC': 'Valle del Cauca',
      'VAL': 'Valle del Cauca',
      'VAU': 'Vaupés',
      'VIC': 'Vichada'
    };

    // Obtener códigos únicos de departamentos de las universidades
    const uniqueCodes = [...new Set(
      this.allUniversitiesData
        .map(university => university.SHIPPINGSTATE)
        .filter(state => state && state.trim() !== '')
    )];

    // Mapear códigos a nombres y ordenar
    return uniqueCodes
      .map(code => ({
        code: code,
        name: departmentMap[code] || code // Si no está en el mapa, usar el código
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Actualizar filtro de ciudades basado en departamento seleccionado (igual que College.js)
   * @private
   */
  _updateCityFilter() {
    const cityFilter = document.getElementById('university-city-filter');
    if (!cityFilter) return;

    // Limpiar opciones de ciudad
    cityFilter.innerHTML = '<option value="">Filtrar por Ciudad</option>';

    if (!this.selectedDepartment) {
      this.selectedCity = '';
      return;
    }

    // Obtener ciudades únicas del departamento seleccionado
    const cities = [...new Set(
      this.allUniversitiesData
        .filter(university => university.SHIPPINGSTATE === this.selectedDepartment)
        .map(university => university.SHIPPINGCITY)
        .filter(city => city && city.trim() !== '')
    )].sort();

    // Poblar ciudades
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });

    this.logger.debug(`🏙️ Filtro de ciudades actualizado: ${cities.length} ciudades para ${this.selectedDepartment}`);
  }


  /**
   * Configurar listeners para filtros (igual que College.js)
   * @private
   */
  _setupUniversityFilterListeners() {
    // Filtro de departamento
    const departmentFilter = document.getElementById('university-department-filter');
    departmentFilter?.addEventListener('change', (e) => {
      this.selectedDepartment = e.target.value;
      this._updateCityFilter();
      this._applyFilters();
    });

    // Filtro de ciudad
    const cityFilter = document.getElementById('university-city-filter');
    cityFilter?.addEventListener('change', (e) => {
      this.selectedCity = e.target.value;
      this._applyFilters();
    });

    // Búsqueda por texto
    const searchInput = document.getElementById('university-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this._applyFilters();
    });

    // Botón limpiar selección
    const clearButton = document.getElementById('university-clear-selection');
    clearButton?.addEventListener('click', () => {
      this._clearUniversitySelection();
    });
  }

  /**
   * Aplicar filtros (igual que College.js)
   * @private
   */
  _applyFilters() {
    let filtered = [...this.allUniversitiesData];

    // Aplicar filtro de departamento
    if (this.selectedDepartment) {
      filtered = filtered.filter(university => 
        university.SHIPPINGSTATE === this.selectedDepartment
      );
    }

    // Aplicar filtro de ciudad
    if (this.selectedCity) {
      filtered = filtered.filter(university => 
        university.SHIPPINGCITY === this.selectedCity
      );
    }

    // Aplicar filtro de búsqueda
    if (this.searchTerm && this.searchTerm.length >= 2) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(university => 
        university.NAME.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredUniversities = filtered;
    this._displayFilteredResults();
  }


  /**
   * Mostrar resultados filtrados
   * @private
   */
  _displayFilteredResults() {
    const resultsList = document.getElementById('university-results-list');
    if (!resultsList) return;

    // Limpiar lista
    resultsList.innerHTML = '';

    if (this.filteredUniversities.length === 0) {
      resultsList.innerHTML = '<li style="padding: 1rem; color: #666; font-style: italic;">No se encontraron universidades</li>';
      resultsList.classList.add('show');
      return;
    }

    // Mostrar solo los primeros resultados
    const visibleResults = this.filteredUniversities.slice(0, this.maxVisibleResults);
    
    visibleResults.forEach(university => {
      const li = document.createElement('li');
      li.className = 'university-result-item';
      li.textContent = university.NAME;
      li.dataset.universityId = university.PUJ_EXTERNALORGID__C || university.ID;
      li.dataset.universityName = university.NAME;
      
      li.addEventListener('click', () => {
        this._selectUniversity(university);
      });
      
      resultsList.appendChild(li);
    });

    // Mostrar indicador de más resultados si es necesario
    if (this.filteredUniversities.length > this.maxVisibleResults) {
      const moreResultsLi = document.createElement('li');
      moreResultsLi.className = 'university-more-results';
      moreResultsLi.innerHTML = `<span class="results-icon">📊</span> ${this.filteredUniversities.length - this.maxVisibleResults} universidades más...`;
      resultsList.appendChild(moreResultsLi);
    }

    resultsList.classList.add('show');
  }

  /**
   * Seleccionar universidad
   * @private
   */
  _selectUniversity(university) {
    this.selectedUniversity = university;

    // Actualizar campo hidden
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (universityElement) {
      const universityValue = university.PUJ_EXTERNALORGID__C || university.NAME;
      
      universityElement.value = universityValue;
      this.state.updateField(Constants.FIELDS.UNIVERSITY, universityValue);
      this.logger.info(`🎓 ✅ Campo universidad actualizado con valor: ${universityValue}`);
      
      // Limpiar errores de validación al seleccionar
      this._clearValidationErrors();
      this.hideValidationError();
    }

    // Mostrar selección
    this._showSelectedUniversity(university);

    // Ocultar lista de resultados
    const resultsList = document.getElementById('university-results-list');
    if (resultsList) {
      resultsList.classList.remove('show');
    }
  }

  /**
   * Mostrar universidad seleccionada
   * @private
   */
  _showSelectedUniversity(university) {
    const selectedDisplay = document.getElementById('university-selected-display');
    const selectedNameSpan = document.getElementById('university-selected-name');
    
    if (selectedDisplay && selectedNameSpan) {
      selectedNameSpan.textContent = university.NAME;
      selectedDisplay.classList.add('show');
    }
  }

  /**
   * Limpiar selección de universidad
   * @private
   */
  _clearUniversitySelection() {
    this.selectedUniversity = null;

    // Limpiar campo
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (universityElement) {
      universityElement.value = '';
      this.state.updateField(Constants.FIELDS.UNIVERSITY, '');
    }

    // Ocultar display de selección
    const selectedDisplay = document.getElementById('university-selected-display');
    if (selectedDisplay) {
      selectedDisplay.classList.remove('show');
    }

    // Limpiar filtros
    this.currentFilters = { department: '', city: '', search: '' };
    
    // Limpiar campos de filtro
    const departmentFilter = document.getElementById('university-department-filter');
    const cityFilter = document.getElementById('university-city-filter');
    const searchInput = document.getElementById('university-search-input');
    
    if (departmentFilter) departmentFilter.value = '';
    if (cityFilter) cityFilter.value = '';
    if (searchInput) searchInput.value = '';

    // Ocultar lista de resultados
    const resultsList = document.getElementById('university-results-list');
    if (resultsList) {
      resultsList.classList.remove('show');
    }
  }

  /**
   * Hacer matching entre nombres de universidades
   * @private
   */
  _matchUniversityName(jsonName, configName) {
    const normalize = (name) => name
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[áàäâã]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöôõ]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/[ñ]/g, 'n')
      .replace(/[^\w\s]/g, '')
      .trim();

    return normalize(jsonName) === normalize(configName) || 
           normalize(jsonName).includes(normalize(configName)) ||
           normalize(configName).includes(normalize(jsonName));
  }

  /**
   * Configurar TomSelect para universidades
   * @private
   */
  async _setupTomSelectModular(options) {
    try {
      const universitySelectElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
      
      if (!universitySelectElement) {
        throw new Error('Elemento select de universidad no encontrado');
      }

      this.logger?.info(`🎯 Configurando TomSelect para universidad con ${options.length} opciones`);

      // Configuración para universidad
      const config = {
        placeholder: 'Buscar universidad...',
        searchEnabled: true,
        clearable: true,
        closeAfterSelect: true,
        maxItems: 1,
        required: universitySelectElement.hasAttribute('required') || universitySelectElement.hasAttribute('data-validation')
      };

      // Inicializar TomSelect usando el módulo reutilizable
      const instance = await this.tomSelect.initialize(universitySelectElement, options, config);

      this.logger?.info(`✅ TomSelect configurado para universidad: ${options.length} opciones`);
      
      return instance;

    } catch (error) {
      this.logger?.error('❌ Error configurando TomSelect para universidad:', error);
      
      // Fallback a población normal si TomSelect falla
      this.logger?.warn('⚠️ Usando población normal como fallback');
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.UNIVERSITY,
        options: options,
      });
      
      throw error;
    }
  }

  /**
   * Validar campo de universidad (igual que College.js)
   * @returns {boolean} - True si es válido
   */
  validateField() {
    try {
      const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
      if (!universityElement) return true;

      // Verificar si el campo universidad debe estar disponible (cuando nivel académico es Posgrado Y tipo de asistente es Aspirante)
      const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
      const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL);
      
      const shouldShowUniversity = currentTypeAttendee === "Aspirante" && currentAcademicLevel === "GRAD";
      
      if (!shouldShowUniversity) {
        // Si no debe mostrarse la universidad para este tipo de asistente/nivel académico, es válido
        this.logger?.debug("🎓 Campo universidad no requerido para este tipo de asistente/nivel académico");
        return true;
      }

      // Si debe mostrarse, verificar que tenga valor
      const hasValue = universityElement.value && universityElement.value.trim() !== '';
      
      if (!hasValue) {
        this.logger?.warn("🎓 ❌ Campo universidad requerido pero sin valor");
        return false;
      }

      this.logger?.debug("🎓 ✅ Campo universidad válido:", universityElement.value);
      return true;
    } catch (error) {
      this.logger?.warn('⚠️ Error validando campo universidad:', error);
      return true;
    }
  }

  /**
   * Limpiar instancias de TomSelect
   */
  destroy() {
    try {
      if (this.tomSelect) {
        this.tomSelect.destroyAll();
        this.logger?.info('🗑️ Instancias de TomSelect destruidas para Universidad');
      }
    } catch (error) {
      this.logger?.warn('⚠️ Error destruyendo TomSelect para Universidad:', error);
    }
  }

  /**
   * Obtener estadísticas del módulo
   * @returns {Object} - Estadísticas del módulo
   */
  getModuleStats() {
    const filteredUniversities = this.getFilteredUniversities();
    const { config } = this.config;
    
    return {
      totalUniversities: filteredUniversities.length,
      configuredUniversities: config.universities ? config.universities.length : 0,
      hasFilter: !!(config.universities && config.universities.length > 0),
      fieldVisible: this.state.getFieldVisibility(Constants.FIELDS.UNIVERSITY),
    };
  }
}