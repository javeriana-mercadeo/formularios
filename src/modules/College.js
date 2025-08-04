/**
 * College - Módulo especializado para gestión del campo colegio
 * Maneja la lógica de filtrado y población de colegios con múltiples criterios
 * @version 2.0
 */

import { Constants } from "./Constants.js";

export class College {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
    this.config = config;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de colegio
   */
  initializeCollegeField() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) {
      this.logger.debug("Campo colegio no encontrado en el formulario");
      return;
    }

    // Configurar listener para cambios en tipo de asistente
    this._setupTypeAttendeeListener();
    
    // Verificar inicialmente si debe mostrar el campo
    this._checkAndToggleCollegeVisibility();
  }

  /**
   * Obtener colegios filtrados basados en la configuración
   * @returns {Array} - Array de colegios filtrados
   */
  getFilteredColleges() {
    const collegeData = this.Data.data.college;
    if (!collegeData || !collegeData.cuentasInstitucionales) {
      this.logger.warn("⚠️ No se encontraron datos de colegios");
      return [];
    }

    const { config } = this.config;
    let allColleges = collegeData.cuentasInstitucionales;

    // Aplicar filtros en secuencia
    let filteredColleges = this._applyNameFilters(allColleges, config.school);
    filteredColleges = this._applyCityFilters(filteredColleges, config.citySchool);
    filteredColleges = this._applyCalendarFilters(filteredColleges, config.calendarSchool);

    // Si no hay ningún filtro configurado, usar todos los colegios
    const hasFilters = (config.school && config.school.length > 0) ||
                      (config.citySchool && config.citySchool.length > 0) ||
                      (config.calendarSchool && config.calendarSchool.length > 0);

    if (!hasFilters) {
      this.logger.info(`🏫 Sin filtros configurados: usando todos los colegios (${allColleges.length} colegios)`);
      return allColleges;
    }

    // Deduplicación final para evitar duplicados tras aplicar múltiples filtros
    const uniqueFilteredColleges = filteredColleges.filter((college, index, self) =>
      index === self.findIndex(c => c.ID === college.ID)
    );

    this.logger.info(`🏫 Colegios filtrados: ${uniqueFilteredColleges.length} encontrados (${filteredColleges.length - uniqueFilteredColleges.length} duplicados eliminados)`);
    return uniqueFilteredColleges;
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Poblar select de colegios con optimización para grandes listas
   * @private
   */
  _populateColleges() {
    const filteredColleges = this.getFilteredColleges();
    
    if (filteredColleges.length === 0) {
      this.logger.warn("⚠️ No hay colegios disponibles");
      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false);
      return;
    }

    // Preparar datos únicos para búsqueda
    const options = filteredColleges.map(college => ({
      value: college.PUJ_EXTERNALORGID__C,
      text: college.NAME
    }));

    const uniqueOptions = options.filter((option, index, self) =>
      index === self.findIndex(o => o.text === option.text)
    );

    // Si hay muchos colegios (>50), usar búsqueda optimizada
    if (uniqueOptions.length > 50) {
      this._setupSearchableCollegeField(uniqueOptions);
    } else {
      // Para listas pequeñas, usar select tradicional
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.COLLEGE,
        options: uniqueOptions,
      });
    }

    this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, true);
    this.logger.info(`🏫 Campo colegios configurado con ${uniqueOptions.length} opciones (${uniqueOptions.length > 50 ? 'modo búsqueda' : 'select tradicional'})`);
  }

  /**
   * Aplicar filtros por nombre de colegio
   * @private
   * @param {Array} colleges - Lista de todos los colegios
   * @param {Array} configSchools - Lista de nombres de colegios en la configuración
   * @returns {Array} - Colegios filtrados por nombre
   */
  _applyNameFilters(colleges, configSchools) {
    if (!configSchools || !Array.isArray(configSchools) || configSchools.length === 0) {
      return colleges; // Sin filtro de nombres, retornar todos
    }

    const filteredColleges = [];
    
    configSchools.forEach(configName => {
      const matchedColleges = colleges.filter(college => 
        this._matchCollegeName(college.NAME, configName)
      );
      
      if (matchedColleges.length > 0) {
        filteredColleges.push(...matchedColleges);
      } else {
        this.logger.warn(`⚠️ Colegio no encontrado en JSON: "${configName}"`);
      }
    });

    // Eliminar duplicados por ID
    const uniqueColleges = filteredColleges.filter((college, index, self) =>
      index === self.findIndex(c => c.ID === college.ID)
    );

    this.logger.info(`🏫 Filtro por nombres: ${uniqueColleges.length} colegios encontrados`);
    return uniqueColleges;
  }

  /**
   * Aplicar filtros por ciudad para colegios (config.citySchool)
   * @private
   * @param {Array} colleges - Lista de colegios
   * @param {Array|string} configCities - Ciudad(es) para filtrar colegios (citySchool)
   * @returns {Array} - Colegios filtrados por ciudad
   */
  _applyCityFilters(colleges, configCities) {
    if (!configCities) {
      return colleges; // Sin filtro de ciudad, retornar todos
    }

    // Normalizar a array
    const cities = Array.isArray(configCities) ? configCities : [configCities];
    
    if (cities.length === 0) {
      return colleges;
    }

    const filteredColleges = colleges.filter(college => {
      const collegeCity = college.SHIPPINGCITY || "";
      return cities.some(city => this._matchCityName(collegeCity, city));
    });

    this.logger.info(`🏫 Filtro por ciudades [${cities.join(', ')}]: ${filteredColleges.length} colegios encontrados`);
    return filteredColleges;
  }

  /**
   * Aplicar filtros por calendario para colegios (config.calendarSchool)
   * @private
   * @param {Array} colleges - Lista de colegios
   * @param {Array|string} configCalendars - Calendario(s) para filtrar colegios (calendarSchool)
   * @returns {Array} - Colegios filtrados por calendario
   */
  _applyCalendarFilters(colleges, configCalendars) {
    if (!configCalendars) {
      return colleges; // Sin filtro de calendario, retornar todos
    }

    // Normalizar a array
    const calendars = Array.isArray(configCalendars) ? configCalendars : [configCalendars];
    
    if (calendars.length === 0) {
      return colleges;
    }

    const filteredColleges = colleges.filter(college => {
      const collegeCalendar = college.PUJ_CALENDAR__C || "";
      return calendars.some(calendar => this._matchCalendarType(collegeCalendar, calendar));
    });

    this.logger.info(`🏫 Filtro por calendarios [${calendars.join(', ')}]: ${filteredColleges.length} colegios encontrados`);
    return filteredColleges;
  }

  /**
   * Hacer matching entre nombres de colegios (configuración vs JSON)
   * @private
   * @param {string} jsonName - Nombre en el JSON
   * @param {string} configName - Nombre en la configuración
   * @returns {boolean} - Si coinciden
   */
  _matchCollegeName(jsonName, configName) {
    // Normalizar nombres para comparación
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

    const normalizedJson = normalize(jsonName);
    const normalizedConfig = normalize(configName);

    // Comparación exacta
    if (normalizedJson === normalizedConfig) return true;

    // Comparación con abreviaciones comunes para colegios
    const abbreviations = {
      'colegio': ['col', 'c'],
      'instituto': ['inst', 'i'],
      'liceo': ['lic'],
      'gimnasio': ['gim'],
      'academia': ['acad'],
      'escuela': ['esc'],
      'pedagogico': ['pedag'],
      'tecnico': ['tecn'],
      'nacional': ['nal'],
      'departamental': ['depto', 'dpto'],
      'municipal': ['mpal'],
      'femenino': ['fem'],
      'masculino': ['masc'],
      'san': ['s'],
      'santa': ['sta'],
      'santo': ['sto'],
      'mayor': ['may'],
      'nuestra': ['ntra', 'n'],
      'señora': ['sra', 'sñra'],
      'del': ['de el'],
      'de la': ['del'],
    };

    // Aplicar abreviaciones al nombre del JSON
    let abbreviatedJson = normalizedJson;
    Object.entries(abbreviations).forEach(([full, abbrevs]) => {
      abbrevs.forEach(abbrev => {
        const regex = new RegExp(`\\b${abbrev}\\b`, 'g');
        abbreviatedJson = abbreviatedJson.replace(regex, full);
      });
    });

    // Aplicar abreviaciones al nombre de configuración  
    let abbreviatedConfig = normalizedConfig;
    Object.entries(abbreviations).forEach(([full, abbrevs]) => {
      const regex = new RegExp(`\\b${full}\\b`, 'g');
      abbrevs.forEach(abbrev => {
        abbreviatedConfig = abbreviatedConfig.replace(regex, abbrev);
      });
    });

    return abbreviatedJson === normalizedConfig || 
           normalizedJson === abbreviatedConfig ||
           abbreviatedJson === abbreviatedConfig;
  }

  /**
   * Hacer matching entre nombres de ciudades
   * @private
   * @param {string} jsonCity - Ciudad en el JSON
   * @param {string} configCity - Ciudad en la configuración
   * @returns {boolean} - Si coinciden
   */
  _matchCityName(jsonCity, configCity) {
    // Normalizar ciudades para comparación
    const normalize = (city) => city
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

    const normalizedJson = normalize(jsonCity);
    const normalizedConfig = normalize(configCity);

    // Comparación exacta
    if (normalizedJson === normalizedConfig) return true;

    // Comparaciones especiales para ciudades colombianas
    const cityAliases = {
      'bogota': ['bogota dc', 'bogota d.c.', 'santa fe de bogota'],
      'bogota dc': ['bogota', 'bogota d.c.', 'santa fe de bogota'],
      'medellin': ['ciudad de medellin'],
      'cali': ['santiago de cali'],
      'barranquilla': ['ciudad de barranquilla'],
      'cartagena': ['cartagena de indias'],
    };

    // Verificar aliases
    for (const [canonical, aliases] of Object.entries(cityAliases)) {
      if ((normalizedJson === canonical && aliases.includes(normalizedConfig)) ||
          (normalizedConfig === canonical && aliases.includes(normalizedJson))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Hacer matching entre tipos de calendario
   * @private
   * @param {string} jsonCalendar - Calendario en el JSON
   * @param {string} configCalendar - Calendario en la configuración
   * @returns {boolean} - Si coinciden
   */
  _matchCalendarType(jsonCalendar, configCalendar) {
    // Normalizar calendarios para comparación
    const normalize = (calendar) => calendar
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const normalizedJson = normalize(jsonCalendar);
    const normalizedConfig = normalize(configCalendar);

    // Comparación exacta
    if (normalizedJson === normalizedConfig) return true;

    // Mapeo de variaciones de calendario
    const calendarMappings = {
      'a': ['calendario a', 'cal a', 'academico'],
      'b': ['calendario b', 'cal b', 'academico b'],
      'flexible': ['flex', 'mixto', 'personalizado'],
      'calendario a': ['a', 'cal a', 'academico'],
      'calendario b': ['b', 'cal b', 'academico b'],
    };

    // Verificar mappings
    for (const [canonical, variations] of Object.entries(calendarMappings)) {
      if ((normalizedJson === canonical && variations.includes(normalizedConfig)) ||
          (normalizedConfig === canonical && variations.includes(normalizedJson))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Configurar campo de colegio con búsqueda optimizada para listas grandes
   * @private
   * @param {Array} options - Lista completa de opciones de colegios
   */
  _setupSearchableCollegeField(options) {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE);
    if (!collegeElement) return;

    // Almacenar opciones para búsqueda
    this.collegeOptions = options;
    this.filteredCollegeOptions = options.slice(0, 20); // Mostrar solo primeros 20 inicialmente
    
    // Convertir select a input si es necesario
    if (collegeElement.tagName === 'SELECT') {
      this._convertSelectToSearchInput(collegeElement);
    }

    // Configurar búsqueda con debounce
    this._setupCollegeSearch();
    
    // Poblar opciones iniciales limitadas
    this._renderCollegeOptions(this.filteredCollegeOptions);
    
    this.logger.info(`🏫 Campo colegio configurado con búsqueda (${options.length} opciones disponibles, mostrando ${this.filteredCollegeOptions.length} iniciales)`);
  }

  /**
   * Convertir select a input con datalist para búsqueda optimizada
   * @private
   * @param {HTMLElement} selectElement - Elemento select original
   */
  _convertSelectToSearchInput(selectElement) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = selectElement.name;
    input.placeholder = 'Escribe para buscar tu colegio...';
    input.setAttribute('list', 'college-datalist');
    input.setAttribute('autocomplete', 'off');
    
    // Crear datalist para opciones
    const datalist = document.createElement('datalist');
    datalist.id = 'college-datalist';
    
    // Reemplazar select con input + datalist
    selectElement.parentNode.insertBefore(input, selectElement);
    selectElement.parentNode.insertBefore(datalist, selectElement);
    selectElement.parentNode.removeChild(selectElement);
    
    // Actualizar referencia
    this.collegeInputElement = input;
    this.collegeDatalistElement = datalist;
  }

  /**
   * Configurar búsqueda de colegios con debounce
   * @private
   */
  _setupCollegeSearch() {
    if (!this.collegeInputElement) return;

    let searchTimeout;
    
    this.collegeInputElement.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      // Debounce de 300ms para evitar búsquedas excesivas
      searchTimeout = setTimeout(() => {
        this._performCollegeSearch(e.target.value);
      }, 300);
    });

    // Manejar selección
    this.collegeInputElement.addEventListener('change', (e) => {
      this._handleCollegeSelection(e.target.value);
    });
  }

  /**
   * Realizar búsqueda de colegios
   * @private
   * @param {string} searchTerm - Término de búsqueda
   */
  _performCollegeSearch(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
      // Mostrar primeros 20 si no hay búsqueda
      this.filteredCollegeOptions = this.collegeOptions.slice(0, 20);
    } else {
      // Búsqueda case-insensitive
      const normalizedSearch = searchTerm.toLowerCase().trim();
      this.filteredCollegeOptions = this.collegeOptions
        .filter(option => 
          option.text.toLowerCase().includes(normalizedSearch)
        )
        .slice(0, 50); // Limitar a 50 resultados máximo
    }
    
    this._renderCollegeOptions(this.filteredCollegeOptions);
    
    this.logger.debug(`🔍 Búsqueda colegios: "${searchTerm}" → ${this.filteredCollegeOptions.length} resultados`);
  }

  /**
   * Renderizar opciones de colegios en el datalist
   * @private
   * @param {Array} options - Opciones filtradas a mostrar
   */
  _renderCollegeOptions(options) {
    if (!this.collegeDatalistElement) return;

    // Limpiar opciones existentes
    this.collegeDatalistElement.innerHTML = '';
    
    // Agregar nuevas opciones
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.text;
      optionElement.setAttribute('data-value', option.value);
      this.collegeDatalistElement.appendChild(optionElement);
    });
  }

  /**
   * Manejar selección de colegio
   * @private
   * @param {string} selectedText - Texto del colegio seleccionado
   */
  _handleCollegeSelection(selectedText) {
    const selectedOption = this.collegeOptions.find(option => option.text === selectedText);
    
    if (selectedOption) {
      // Actualizar estado con el valor correcto (ID del colegio)
      this.state.setField(Constants.FIELDS.COLLEGE, selectedOption.value);
      this.logger.info(`🏫 Colegio seleccionado: "${selectedText}" (ID: ${selectedOption.value})`);
    } else if (selectedText) {
      // Si escribió algo que no coincide exactamente, limpiar
      this.collegeInputElement.value = '';
      this.state.setField(Constants.FIELDS.COLLEGE, '');
      this.logger.warn(`⚠️ Colegio no válido: "${selectedText}"`);
    }
  }

  /**
   * Configurar listener para cambios en tipo de asistente
   * @private
   */
  _setupTypeAttendeeListener() {
    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE);
    if (!typeAttendeeElement) {
      this.logger.debug("Campo tipo de asistente no encontrado");
      return;
    }

    typeAttendeeElement.addEventListener('change', () => {
      this._checkAndToggleCollegeVisibility();
    });
  }

  /**
   * Verificar tipo de asistente y mostrar/ocultar campo de colegio
   * @private
   */
  _checkAndToggleCollegeVisibility() {
    const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE);
    const shouldShowCollege = this._shouldShowCollegeField(currentTypeAttendee);

    if (shouldShowCollege) {
      this._populateColleges();
    } else {
      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false);
      this.logger.debug(`🏫 Campo colegio oculto para tipo de asistente: "${currentTypeAttendee}"`);
    }
  }

  /**
   * Determinar si debe mostrar el campo de colegio según el tipo de asistente
   * @private
   * @param {string} typeAttendee - Tipo de asistente seleccionado
   * @returns {boolean} - Si debe mostrar el campo de colegio
   */
  _shouldShowCollegeField(typeAttendee) {
    const allowedTypes = ["Aspirante", "Docente y/o psicoorientador"];
    const shouldShow = allowedTypes.includes(typeAttendee);
    
    this.logger.debug(`🏫 Verificando visibilidad colegio: "${typeAttendee}" → ${shouldShow ? 'Mostrar' : 'Ocultar'}`);
    return shouldShow;
  }

  /**
   * Obtener estadísticas del módulo
   * @returns {Object} - Estadísticas del módulo
   */
  getModuleStats() {
    const filteredColleges = this.getFilteredColleges();
    const { config } = this.config;
    
    return {
      totalColleges: filteredColleges.length,
      configuredColleges: config.school ? config.school.length : 0,
      hasFilter: !!(config.school && config.school.length > 0),
      fieldVisible: this.state.getFieldVisibility(Constants.FIELDS.COLLEGE),
    };
  }
}