/**
 * College - Módulo especializado para gestión del campo colegio
 * Maneja la lógica de filtrado y población de colegios con múltiples criterios
 * Usa Tom Select para optimización de listas grandes
 * @version 4.0
 */

import { Constants } from "./Constants.js";
import { TomSelect } from "./TomSelect.js";

export class College {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
    this.config = config;
    this.tomSelectInstance = null;

    // Inicializar módulo TomSelect
    this.tomSelect = new TomSelect(logger);
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de colegio
   */
  initializeCollegeField() {
    this.logger.info("🏫 🚀 Iniciando inicialización del campo colegio...");

    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) {
      this.logger.warn(
        `❌ Campo colegio no encontrado. Selector usado: ${Constants.SELECTORS.COLLEGE}`
      );
      return;
    }

    this.logger.info("✅ Campo colegio encontrado en el DOM");

    // Configurar listener para cambios en tipo de asistente
    this._setupTypeAttendeeListener();

    // Verificar inicialmente si debe mostrar el campo (incluye casos de preselección)
    this._initializeCollegeVisibility();
  }

  /**
   * Inicializar estado de campo colegio basado en tipo de asistente actual
   * Similar a Academic.initializeAcademicFields()
   */
  _initializeCollegeVisibility() {
    this.logger.info("🏫 🔍 Verificando estado inicial del tipo de asistente...");

    // Verificar si hay un tipo de asistente ya seleccionado en el state
    const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
    this.logger.info(`🏫 📋 Tipo de asistente en state: "${currentTypeAttendee}"`);

    // También verificar el valor del DOM por si acaso
    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
    const domValue = typeAttendeeElement?.value || "";
    this.logger.info(`🏫 📋 Tipo de asistente en DOM: "${domValue}"`);

    // Usar el valor que esté disponible
    const selectedValue = currentTypeAttendee || domValue;

    if (selectedValue) {
      this.logger.info(
        `🏫 ⚡ Tipo de asistente ya seleccionado: "${selectedValue}" - verificando visibilidad`
      );
      this._checkAndToggleCollegeVisibility();
    } else {
      this.logger.info(
        "🏫 ➡️ No hay tipo de asistente seleccionado inicialmente - campo colegio oculto"
      );
      this._hideCollegeField();
    }
  }

  /**
   * Obtener colegios filtrados basados en la configuración
   * @returns {Array} - Array de colegios filtrados
   */
  getFilteredColleges() {
    this.logger.info("🏫 🔍 Iniciando getFilteredColleges()");

    const collegeRawData = this.Data.data.college;
    this.logger.info("🏫 📊 Datos raw de colegios:", collegeRawData);

    // Los datos de colegios vienen en formato {cuentasInstitucionales: [...]}
    const collegeData = collegeRawData?.cuentasInstitucionales;

    this.logger.info("🏫 📊 Estado de datos de colegios:", {
      rawExists: !!collegeRawData,
      dataExists: !!collegeData,
      isArray: Array.isArray(collegeData),
      length: collegeData ? collegeData.length : 0,
      firstItem: collegeData && collegeData[0] ? collegeData[0] : null,
    });

    if (!collegeData || !Array.isArray(collegeData)) {
      this.logger.warn("⚠️ Datos de colegios no disponibles o inválidos en cuentasInstitucionales");
      return [];
    }

    const config = this.config?.school || {};
    this.logger.info(`🏫 Procesando ${collegeData.length} colegios con filtros:`, config);

    // Aplicar filtros secuencialmente
    let filteredColleges = collegeData;

    // 1. Filtro por nombres (si hay configuración específica de colegios)
    if (config.schools && Array.isArray(config.schools)) {
      filteredColleges = this._applyNameFilters(filteredColleges, config.schools);
    }

    // 2. Filtro por ciudad (usando citySchool para evitar conflictos)
    if (config.citySchool) {
      filteredColleges = this._applyCityFilters(filteredColleges, config.citySchool);
    }

    // 3. Filtro por calendario (usando calendarSchool)
    if (config.calendarSchool) {
      filteredColleges = this._applyCalendarFilters(filteredColleges, config.calendarSchool);
    }

    this.logger.info(
      `🏫 Resultado final: ${filteredColleges.length} colegios después de aplicar filtros`
    );
    return filteredColleges;
  }

  // ===============================
  // MÉTODOS PRIVADOS - CONFIGURACIÓN
  // ===============================

  /**
   * Configurar campo de colegios con datos
   * @private
   */
  async _populateCollegeField() {
    this.logger.info("🏫 🔄 Iniciando población del campo colegio...");
    try {
      const filteredColleges = this.getFilteredColleges();
      this.logger.info(`🏫 📊 Colegios filtrados obtenidos: ${filteredColleges.length}`);

      if (filteredColleges.length === 0) {
        this.logger.warn("⚠️ No se encontraron colegios que coincidan con los filtros");
        this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false);
        return;
      }

      // Transformar colegios a formato de opciones y eliminar duplicados
      const collegeOptions = filteredColleges.map((college) => ({
        value: college.PUJ_EXTERNALORGID__C || college.NAME, // Usar ID externo como valor
        text: college.NAME,
        data: college,
      }));

      // Eliminar duplicados por nombre
      const uniqueOptions = collegeOptions.filter(
        (option, index, self) => index === self.findIndex((o) => o.value === option.value)
      );

      // Ordenar alfabéticamente
      uniqueOptions.sort((a, b) => a.text.localeCompare(b.text));

      // Guardar todas las opciones para los filtros avanzados
      this.allCollegeOptions = uniqueOptions;
      this.allCollegesData = filteredColleges; // Guardar datos completos para filtros
      this.logger.info(`🏫 💾 Guardadas ${uniqueOptions.length} opciones en allCollegeOptions`);
      this.logger.info(
        `🏫 📋 Muestra de colegios:`,
        uniqueOptions.slice(0, 5).map((o) => o.text)
      );

      const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
      if (!collegeElement) {
        this.logger.error("❌ Elemento de colegio no encontrado");
        return;
      }

      // Configurar filtros avanzados estilo formulario viejo
      this._setupAdvancedCollegeFilters();

      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, true);
      this._showCollegeFieldInDOM();
      this.logger.info(
        `🏫 Campo colegios configurado con filtros avanzados (${uniqueOptions.length} opciones)`
      );
    } catch (error) {
      this.logger.error(`❌ Error configurando campo colegios: ${error.message}`);
      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false);
    }
  }

  /**
   * Aplicar filtros por nombre de colegio
   * @private
   */
  _applyNameFilters(colleges, configSchools) {
    if (!configSchools || !Array.isArray(configSchools) || configSchools.length === 0) {
      return colleges;
    }

    const filteredColleges = [];

    configSchools.forEach((configName) => {
      const matchedColleges = colleges.filter((college) =>
        this._matchCollegeName(college.NAME, configName)
      );

      if (matchedColleges.length > 0) {
        filteredColleges.push(...matchedColleges);
      } else {
        this.logger.warn(`⚠️ Colegio no encontrado en JSON: "${configName}"`);
      }
    });

    const uniqueColleges = filteredColleges.filter(
      (college, index, self) => index === self.findIndex((c) => c.ID === college.ID)
    );

    this.logger.info(`🏫 Filtro por nombres: ${uniqueColleges.length} colegios encontrados`);
    return uniqueColleges;
  }

  /**
   * Aplicar filtros por ciudad para colegios
   * @private
   */
  _applyCityFilters(colleges, configCities) {
    if (!configCities) {
      return colleges;
    }

    const cities = Array.isArray(configCities) ? configCities : [configCities];

    if (cities.length === 0) {
      return colleges;
    }

    const filteredColleges = colleges.filter((college) => {
      const collegeCity = college.SHIPPINGCITY || "";
      return cities.some((city) => this._matchCityName(collegeCity, city));
    });

    this.logger.info(
      `🏫 Filtro por ciudades [${cities.join(", ")}]: ${filteredColleges.length} colegios encontrados`
    );
    return filteredColleges;
  }

  /**
   * Aplicar filtros por calendario para colegios
   * @private
   */
  _applyCalendarFilters(colleges, configCalendars) {
    if (!configCalendars) {
      return colleges;
    }

    const calendars = Array.isArray(configCalendars) ? configCalendars : [configCalendars];

    if (calendars.length === 0) {
      return colleges;
    }

    const filteredColleges = colleges.filter((college) => {
      const collegeCalendar = college.PUJ_CALENDAR__C || "";
      return calendars.some((calendar) => this._matchCalendarType(collegeCalendar, calendar));
    });

    this.logger.info(
      `🏫 Filtro por calendarios [${calendars.join(", ")}]: ${filteredColleges.length} colegios encontrados`
    );
    return filteredColleges;
  }

  // ===============================
  // MÉTODOS PRIVADOS - MATCHING
  // ===============================

  /**
   * Hacer matching entre nombres de colegios
   * @private
   */
  _matchCollegeName(jsonName, configName) {
    if (!jsonName || !configName) return false;

    const normalizeText = (text) => {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim();
    };

    const jsonNormalized = normalizeText(jsonName);
    const configNormalized = normalizeText(configName);

    // Matching exacto
    if (jsonNormalized === configNormalized) {
      return true;
    }

    // Matching por inclusión (útil para abreviaciones)
    if (jsonNormalized.includes(configNormalized) || configNormalized.includes(jsonNormalized)) {
      return true;
    }

    // Matching por palabras clave
    const jsonWords = jsonNormalized.split(/\s+/);
    const configWords = configNormalized.split(/\s+/);

    const commonWords = jsonWords.filter((word) =>
      configWords.some((configWord) => word.includes(configWord) || configWord.includes(word))
    );

    return commonWords.length >= Math.min(2, Math.min(jsonWords.length, configWords.length));
  }

  /**
   * Hacer matching entre nombres de ciudades
   * @private
   */
  _matchCityName(jsonCity, configCity) {
    if (!jsonCity || !configCity) return false;

    const normalizeCity = (city) => {
      return city
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim();
    };

    const jsonNormalized = normalizeCity(jsonCity);
    const configNormalized = normalizeCity(configCity);

    return (
      jsonNormalized === configNormalized ||
      jsonNormalized.includes(configNormalized) ||
      configNormalized.includes(jsonNormalized)
    );
  }

  /**
   * Hacer matching entre tipos de calendario
   * @private
   */
  _matchCalendarType(jsonCalendar, configCalendar) {
    if (!jsonCalendar || !configCalendar) return false;

    const normalizeCalendar = (calendar) => {
      return calendar
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
    };

    const jsonNormalized = normalizeCalendar(jsonCalendar);
    const configNormalized = normalizeCalendar(configCalendar);

    return (
      jsonNormalized === configNormalized ||
      jsonNormalized.includes(configNormalized) ||
      configNormalized.includes(jsonNormalized)
    );
  }

  // ===============================
  // MÉTODOS PRIVADOS - VISIBILIDAD
  // ===============================

  /**
   * Configurar listener para cambios en tipo de asistente
   * @private
   */
  _setupTypeAttendeeListener() {
    this.logger.info("🏫 🎧 Configurando listener para tipo de asistente...");

    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
    if (!typeAttendeeElement) {
      this.logger.warn(
        `❌ Campo tipo de asistente no encontrado. Selector: ${Constants.SELECTORS.TYPE_ATTENDEE}`
      );
      return;
    }

    this.logger.info("✅ Campo tipo de asistente encontrado, agregando listener");

    typeAttendeeElement.addEventListener("change", (event) => {
      this.logger.info(`🏫 🔄 Cambio detectado en tipo de asistente: "${event.target.value}"`);
      this._checkAndToggleCollegeVisibility(event.target.value);
    });
  }

  /**
   * Verificar y alternar visibilidad del campo colegio
   * @private
   */
  _checkAndToggleCollegeVisibility(selectedValue) {
    this.logger.info("🏫 Verificando visibilidad del campo colegio...");

    // Lógica simple: solo los casos donde SÍ debe aparecer
    const shouldShow =
      selectedValue === "Aspirante" || selectedValue === "Docente y/o psicoorientador";

    this.logger.info(
      `🏫 Tipo de asistente detectado: "${selectedValue}" - Mostrar colegio: ${shouldShow}`
    );

    this.logger.info(`🏫 🔧 DECISIÓN: shouldShow=${shouldShow} para "${selectedValue}"`);

    if (shouldShow) {
      this.logger.info("🏫 ✅ MOSTRANDO campo colegio (Aspirante o Docente)");
      this._populateCollegeField().catch((error) => {
        this.logger.error("❌ Error poblando colegios:", error);
      });
    } else {
      this.logger.info("🏫 ❌ OCULTANDO campo colegio (Padre, Visitante u otro)");
      this._hideCollegeField();
    }

    this.logger.info(
      `🏫 Campo colegio ${shouldShow ? "mostrado" : "oculto"} para tipo: "${selectedValue}"`
    );
  }

  /**
   * Ocultar campo de colegio y limpiar Tom Select
   * @private
   */
  _hideCollegeField() {
    this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false);
    this._hideCollegeFieldInDOM();

    // Limpiar el selector normal
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (collegeElement) {
      collegeElement.innerHTML = "";
      collegeElement.value = "";
    }

    // Limpiar también del state para que no se envíe al backend
    this.state.updateField(Constants.FIELDS.COLLEGE, "");

    this.logger.info("🏫 Selector de colegio limpiado y ocultado");
  }

  /**
   * Validar campo de colegio (selector normal)
   * @returns {boolean} - True si es válido
   */
  validateField() {
    try {
      const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
      if (!collegeElement) return true;

      // Como no es requerido, siempre es válido
      return true;
    } catch (error) {
      this.logger?.warn("⚠️ Error validando campo colegio:", error);
      return true;
    }
  }

  /**
   * Mostrar campo colegio en el DOM
   * @private
   */
  _showCollegeFieldInDOM() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) return;

    // Mostrar el contenedor de filtros y ocultar el select original
    const filtersContainer = document.querySelector('.college-filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = "block";
    }

    // Mantener el select original oculto pero funcional para validación
    collegeElement.style.display = "none";
    collegeElement.removeAttribute("disabled");
    collegeElement.setAttribute("required", "required");

    // Limpiar errores previos
    this._clearValidationErrors();

    this.logger.info("🏫 Campo colegio mostrado en DOM");
  }

  /**
   * Ocultar campo colegio en el DOM
   * @private
   */
  _hideCollegeFieldInDOM() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) return;

    // Ocultar el contenedor de filtros
    const filtersContainer = document.querySelector('.college-filters-container');
    if (filtersContainer) {
      filtersContainer.style.display = "none";
    }

    // Ocultar y limpiar el select original
    collegeElement.style.display = "none";
    collegeElement.setAttribute("disabled", "disabled");
    collegeElement.removeAttribute("required");
    collegeElement.value = "";

    // Limpiar errores de validación
    this._clearValidationErrors();

    this.logger.info("🏫 Campo colegio ocultado en DOM");
  }

  /**
   * Limpiar errores de validación del campo colegio
   * @private
   */
  _clearValidationErrors() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) return;

    // Quitar clase de error del select original
    collegeElement.classList.remove('error');

    // Ocultar mensaje de error del select original
    const errorElement = document.querySelector('#error_school, [data-error-for="school"]');
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.style.opacity = '0';
    }

    // Limpiar errores del input de búsqueda
    this._forceCleanSearchInput();
  }

  /**
   * Forzar limpieza del input de búsqueda
   * @private
   */
  _forceCleanSearchInput() {
    const searchInput = document.getElementById('college-search-input');
    if (!searchInput) return;

    // Quitar todas las clases de error posibles
    searchInput.classList.remove('error', 'invalid', 'required');
    
    // Buscar y ocultar todos los posibles mensajes de error
    const possibleSelectors = [
      '[data-error-for="college-search-input"]',
      '#error_college-search-input',
      '.error_text'
    ];
    
    possibleSelectors.forEach(selector => {
      const errorElements = document.querySelectorAll(selector);
      errorElements.forEach(element => {
        // Solo ocultar si está cerca del input de búsqueda
        const searchContainer = searchInput.closest('.college-filters-container');
        if (searchContainer && searchContainer.contains(element)) {
          element.style.display = 'none';
          element.style.opacity = '0';
        }
      });
    });
    
    // Forzar que no sea validado
    searchInput.removeAttribute('required');
    searchInput.removeAttribute('data-validate');
    searchInput.setAttribute('data-no-validate', 'true');
  }

  // ===============================
  // MÉTODOS PRIVADOS - SELECTOR NORMAL
  // ===============================

  /**
   * Configurar selector normal (sin TomSelect)
   * @private
   */
  _setupNormalSelect(selectElement, options) {
    try {
      this.logger.info(`🏫 📋 Configurando selector normal con ${options.length} opciones`);

      // Limpiar opciones existentes
      selectElement.innerHTML = "";

      // Agregar opción vacía
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "Colegio de origen";
      selectElement.appendChild(emptyOption);

      // Agregar todas las opciones
      options.forEach((option) => {
        const optElement = document.createElement("option");
        optElement.value = option.value;
        optElement.textContent = option.text;
        selectElement.appendChild(optElement);
      });

      // No marcar como requerido por ahora
      selectElement.removeAttribute("required");

      this.logger.info(`🏫 ✅ Selector normal configurado con ${options.length} colegios`);
    } catch (error) {
      this.logger.error("❌ Error configurando selector normal:", error);
      throw error;
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - FILTROS AVANZADOS
  // ===============================

  /**
   * Configurar filtros avanzados usando HTML existente
   * @private
   */
  _setupAdvancedCollegeFilters() {
    this.logger.info("🏫 🎛️ Configurando filtros avanzados de colegios...");
    
    // El HTML ya está en test.html, solo necesitamos inicializar la lógica
    const filtersContainer = document.querySelector('.college-filters-container');
    if (!filtersContainer) {
      this.logger.warn("❌ Contenedor de filtros no encontrado en el HTML");
      return;
    }

    // Inicializar filtros
    this._initializeFilters();
    this._bindFilterEvents();
    
    // Forzar limpieza del input de búsqueda desde el inicio
    this._forceCleanSearchInput();
    
    this.logger.info("🏫 ✅ Filtros avanzados configurados correctamente");
  }

  /**
   * Inicializar opciones de filtros
   * @private
   */
  _initializeFilters() {
    this.logger.info("🏫 🔧 Inicializando opciones de filtros...");

    // Obtener departamentos únicos de los colegios con nombres legibles
    const departmentData = this._getDepartmentData();

    // Poblar filtro de departamentos
    const departmentFilter = document.getElementById('college-department-filter');
    if (departmentFilter) {
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
    this.filteredColleges = [...this.allCollegesData];
    this.selectedCollege = null;

    this.logger.info(`🏫 📊 Filtros inicializados: ${departmentData.length} departamentos disponibles`);
  }

  /**
   * Obtener datos de departamentos con códigos y nombres legibles
   * @private
   */
  _getDepartmentData() {
    // Mapa de códigos de departamento a nombres
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
      'COR': 'Córdoba',
      'CUN': 'Cundinamarca',
      'GAI': 'Guainía',
      'GAV': 'Guaviare',
      'HUI': 'Huila',
      'LAG': 'La Guajira',
      'MAG': 'Magdalena',
      'MET': 'Meta',
      'NAR': 'Nariño',
      'NSA': 'Norte de Santander',
      'PUT': 'Putumayo',
      'QUI': 'Quindío',
      'RIS': 'Risaralda',
      'SAN': 'Santander',
      'SUC': 'Sucre',
      'TOL': 'Tolima',
      'VAC': 'Valle del Cauca',
      'VAU': 'Vaupés',
      'VIC': 'Vichada'
    };

    // Obtener códigos únicos de departamentos de los colegios
    const uniqueCodes = [...new Set(
      this.allCollegesData
        .map(college => college.SHIPPINGSTATE)
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
   * Configurar eventos de filtros
   * @private
   */
  _bindFilterEvents() {
    this.logger.info("🏫 🎧 Configurando eventos de filtros...");

    // Filtro por departamento
    const departmentFilter = document.getElementById('college-department-filter');
    departmentFilter?.addEventListener('change', (e) => {
      this.selectedDepartment = e.target.value;
      this._updateCityFilter();
      this._applyFilters();
    });

    // Filtro por ciudad
    const cityFilter = document.getElementById('college-city-filter');
    cityFilter?.addEventListener('change', (e) => {
      this.selectedCity = e.target.value;
      this._applyFilters();
    });

    // Búsqueda por texto
    const searchInput = document.getElementById('college-search-input');
    searchInput?.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this._applyFilters();
      
      // Forzar limpieza de errores del input de búsqueda
      this._forceCleanSearchInput();
    });

    // Botón para limpiar selección
    const clearButton = document.getElementById('college-clear-selection');
    clearButton?.addEventListener('click', () => {
      this._clearSelection();
    });

    this.logger.info("🏫 ✅ Eventos de filtros configurados");
  }

  /**
   * Actualizar filtro de ciudades según departamento seleccionado
   * @private
   */
  _updateCityFilter() {
    const cityFilter = document.getElementById('college-city-filter');
    if (!cityFilter) return;

    // Limpiar opciones de ciudad
    cityFilter.innerHTML = '<option value="">Filtrar por Ciudad</option>';

    if (!this.selectedDepartment) {
      this.selectedCity = '';
      return;
    }

    // Obtener ciudades del departamento seleccionado
    const cities = [...new Set(
      this.allCollegesData
        .filter(college => college.SHIPPINGSTATE === this.selectedDepartment)
        .map(college => college.SHIPPINGCITY)
        .filter(city => city && city.trim() !== '')
    )].sort();

    // Poblar filtro de ciudades
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      cityFilter.appendChild(option);
    });

    // Auto-seleccionar primera ciudad si solo hay una
    if (cities.length === 1) {
      this.selectedCity = cities[0];
      cityFilter.value = cities[0];
    } else {
      this.selectedCity = '';
    }

    this.logger.info(`🏫 🏙️ ${cities.length} ciudades actualizadas para ${this.selectedDepartment}`);
  }

  /**
   * Aplicar filtros y mostrar resultados
   * @private
   */
  _applyFilters() {
    this.logger.info("🏫 🔍 Aplicando filtros...");

    // Filtrar colegios
    this.filteredColleges = this.allCollegesData.filter(college => {
      // Filtro por departamento
      if (this.selectedDepartment && college.SHIPPINGSTATE !== this.selectedDepartment) {
        return false;
      }

      // Filtro por ciudad
      if (this.selectedCity && college.SHIPPINGCITY !== this.selectedCity) {
        return false;
      }

      // Filtro por texto
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const collegeName = college.NAME.toLowerCase();
        if (!collegeName.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });

    this._updateResultsList();
    this.logger.info(`🏫 📊 ${this.filteredColleges.length} colegios filtrados`);
  }

  /**
   * Actualizar lista de resultados
   * @private
   */
  _updateResultsList() {
    const resultsList = document.getElementById('college-results-list');
    if (!resultsList) return;

    // Limpiar lista
    resultsList.innerHTML = '';

    // Mostrar/ocultar lista según filtros aplicados
    const showList = (this.selectedDepartment || this.selectedCity || this.searchTerm) && 
                     this.filteredColleges.length > 0 && 
                     !this.selectedCollege;

    // Agregar/quitar clase show en lugar de estilo inline
    if (showList) {
      resultsList.classList.add('show');
    } else {
      resultsList.classList.remove('show');
      return;
    }

    // Limitar resultados para performance (máximo 100)
    const limitedResults = this.filteredColleges.slice(0, 100);

    limitedResults.forEach(college => {
      const li = document.createElement('li');
      li.className = 'college-result-item';
      
      // Contenido simple - solo el nombre del colegio
      li.textContent = college.NAME;

      // Evento click
      li.addEventListener('click', () => {
        this._selectCollege(college);
      });

      resultsList.appendChild(li);
    });

    if (this.filteredColleges.length > 100) {
      const moreItem = document.createElement('li');
      moreItem.className = 'college-more-results';
      moreItem.innerHTML = `
        <span class="results-icon">📊</span> 
        Mostrando 100 de ${this.filteredColleges.length} colegios. Refina tu búsqueda para ver menos resultados.
      `;
      resultsList.appendChild(moreItem);
    }
  }

  /**
   * Obtener nombre legible del departamento por código
   * @private
   */
  _getDepartmentName(code) {
    const departmentData = this._getDepartmentData();
    const dept = departmentData.find(d => d.code === code);
    return dept ? dept.name : code;
  }

  /**
   * Seleccionar un colegio
   * @private
   */
  _selectCollege(college) {
    this.selectedCollege = college;
    
    // Actualizar campo hidden
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (collegeElement) {
      const collegeValue = college.PUJ_EXTERNALORGID__C || college.NAME;
      
      collegeElement.value = collegeValue;
      this.state.updateField(Constants.FIELDS.COLLEGE, collegeValue);
      this.logger.info(`🏫 ✅ Campo colegio actualizado con valor: ${collegeValue}`);
      
      // Limpiar errores de validación al seleccionar
      this._clearValidationErrors();
    }

    // Mostrar selección usando clases CSS
    const selectedDisplay = document.getElementById('college-selected-display');
    const selectedName = document.getElementById('college-selected-name');
    if (selectedDisplay && selectedName) {
      selectedName.textContent = college.NAME;
      selectedDisplay.classList.add('show');
    }

    // Ocultar lista de resultados usando clases CSS
    const resultsList = document.getElementById('college-results-list');
    if (resultsList) {
      resultsList.classList.remove('show');
    }

    this.logger.info(`🏫 ✅ Colegio seleccionado: ${college.NAME}`);
  }

  /**
   * Limpiar selección actual
   * @private
   */
  _clearSelection() {
    this.selectedCollege = null;

    // Limpiar campo
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (collegeElement) {
      collegeElement.value = '';
      this.state.updateField(Constants.FIELDS.COLLEGE, '');
    }

    // Ocultar display de selección usando clases CSS
    const selectedDisplay = document.getElementById('college-selected-display');
    if (selectedDisplay) {
      selectedDisplay.classList.remove('show');
    }

    // Limpiar filtros
    this.selectedDepartment = '';
    this.selectedCity = '';
    this.searchTerm = '';

    const departmentFilter = document.getElementById('college-department-filter');
    const cityFilter = document.getElementById('college-city-filter');
    const searchInput = document.getElementById('college-search-input');

    if (departmentFilter) departmentFilter.value = '';
    if (cityFilter) cityFilter.value = '';
    if (searchInput) searchInput.value = '';

    this._updateCityFilter();
    this._applyFilters();

    this.logger.info("🏫 🧹 Selección y filtros limpiados");
  }
}
