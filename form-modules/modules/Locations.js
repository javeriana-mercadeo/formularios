/**
 * Locations - Módulo especializado para gestión de campos de ubicación
 * Maneja toda la lógica relacionada con países, departamentos y ciudades
 * @version 1.0
 */

import { Constants } from "./Constants.js";

export class Locations {
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
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.state.updateField(Constants.FIELDS.COUNTRY, value);

    this.logger.info(`🌍 País cambiado a: ${value}`);

    const defaultCountry = this.state._getInitialState()[Constants.FIELDS.COUNTRY];

    if (value === defaultCountry) {
      this._showLocationFields();
    } else {
      this._hideLocationFields();
    }
  }

  /**
   * Manejar cambio de departamento
   */
  handleDepartmentChange(value) {
    this.state.updateField(Constants.FIELDS.DEPARTMENT, value);

    this.logger.info(`🏛️ Departamento cambiado a: ${value}`);

    if (value) {
      this._populateCities(value);
    } else {
      this._hideCityField();
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - MOSTRAR/OCULTAR
  // ===============================

  /**
   * Mostrar campos de ubicación (departamento)
   * @private
   */
  _showLocationFields() {
    this.logger.info("🌍 Mostrando campos de ubicación");

    const filteredDepartments = this.getFilteredDepartments();

    if (filteredDepartments.length === 1) {
      // Solo un departamento: ocultar campo y preseleccionar
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.DEPARTMENT,
        options: [{ value: filteredDepartments[0].value, text: filteredDepartments[0].text }],
      });
      
      // Preseleccionar automáticamente
      this.state.updateField(Constants.FIELDS.DEPARTMENT, filteredDepartments[0].value);
      this.state.setFieldVisibility(Constants.FIELDS.DEPARTMENT, false);
      
      this.logger.info(`🔧 Departamento preseleccionado automáticamente: ${filteredDepartments[0].text}`);
      
      // Cargar ciudades automáticamente
      setTimeout(() => this._populateCities(filteredDepartments[0].value), 100);
      
    } else if (filteredDepartments.length === 0) {
      // Sin departamentos disponibles
      this.logger.warn("⚠️ No hay departamentos disponibles con la configuración actual");
      this.state.setFieldVisibility(Constants.FIELDS.DEPARTMENT, false);
      
    } else {
      // Múltiples departamentos: mostrar select normalmente
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.DEPARTMENT,
        options: filteredDepartments,
        priorityItems: ["bogotá", "bogota"],
      });

      this.Ui.showElement(this.Ui.scopedQuery(Constants.SELECTORS.DEPARTMENT));
      this.state.setFieldVisibility(Constants.FIELDS.DEPARTMENT, true);
      this.logger.info(`📋 Select de departamentos con ${filteredDepartments.length} opciones`);
    }
  }

  /**
   * Ocultar campos de ubicación
   * @private
   */
  _hideLocationFields() {
    this.logger.info("🧹 [LOCATIONS] Ocultando y limpiando campos de ubicación");

    const locationFields = [
      { key: Constants.FIELDS.DEPARTMENT, selector: Constants.SELECTORS.DEPARTMENT },
      { key: Constants.FIELDS.CITY, selector: Constants.SELECTORS.CITY },
    ];

    locationFields.forEach(({ key, selector }) => {
      this.logger.info(`🧹 [LOCATIONS] Limpiando campo: ${key}`);

      const element = this.Ui.scopedQuery(selector);
      if (element) {
        // IMPORTANTE: Limpiar error ANTES de ocultar para evitar elementos DOM huérfanos
        this.Ui.hideFieldError(element);
        this.Ui.hideElement(element);

        this.logger.info(`👁️ [LOCATIONS] Elemento ${key} ocultado y error limpiado de UI`);
      }

      this.state.setFieldVisibility(key, false);
      this.state.updateField(key, "");
      this.state.clearValidationError(key);

      // Forzar limpieza adicional de cualquier elemento de error residual
      this._forceCleanFieldError(key);

      this.logger.info(`✅ [LOCATIONS] Estado limpiado para ${key}`);
    });

    this.logger.info("🧹 [LOCATIONS] Limpieza de campos de ubicación completada");
  }

  /**
   * Forzar limpieza de errores visuales de un campo específico
   * @private
   */
  _forceCleanFieldError(fieldKey) {
    // Buscar y limpiar TODOS los posibles elementos de error para este campo
    const possibleErrorSelectors = [
      `#error_${fieldKey}`,
      `[data-error-for="${fieldKey}"]`,
      `.error_text[data-error-for="${fieldKey}"]`,
    ];

    possibleErrorSelectors.forEach((selector) => {
      const errorElement = this.Ui.scopedQuery(selector);
      if (errorElement) {
        errorElement.style.display = "none";
        errorElement.textContent = "";

        this.logger.info(`🧹 [LOCATIONS] Error residual limpiado: ${selector}`);
      }
    });
  }

  /**
   * Poblar ciudades basado en departamento
   * @private
   */
  _populateCities(departmentCode) {
    this.logger.info(`🏙️ Cargando ciudades para departamento: ${departmentCode}`);

    const filteredCities = this.getFilteredCities(departmentCode);

    if (filteredCities.length === 1) {
      // Solo una ciudad: ocultar campo y preseleccionar
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.CITY,
        options: [{ value: filteredCities[0].value, text: filteredCities[0].text }],
      });
      
      // Preseleccionar automáticamente
      this.state.updateField(Constants.FIELDS.CITY, filteredCities[0].value);
      this.state.setFieldVisibility(Constants.FIELDS.CITY, false);
      
      this.logger.info(`🔧 Ciudad preseleccionada automáticamente: ${filteredCities[0].text}`);
      
    } else if (filteredCities.length === 0) {
      // Sin ciudades disponibles
      this.logger.warn("⚠️ No hay ciudades disponibles para este departamento");
      this.state.setFieldVisibility(Constants.FIELDS.CITY, false);
      
    } else {
      // Múltiples ciudades: mostrar select normalmente
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.CITY,
        options: filteredCities,
      });

      this.Ui.showElement(this.Ui.scopedQuery(Constants.SELECTORS.CITY));
      this.state.setFieldVisibility(Constants.FIELDS.CITY, true);
      this.logger.info(`📋 Select de ciudades con ${filteredCities.length} opciones`);
    }
  }

  /**
   * Ocultar campo de ciudad
   * @private
   */
  _hideCityField() {
    this.logger.info("🧹 [LOCATIONS] Ocultando y limpiando campo de ciudad");

    const cityElement = this.Ui.scopedQuery(Constants.SELECTORS.CITY);
    if (cityElement) {
      // IMPORTANTE: Limpiar error ANTES de ocultar para evitar elementos DOM huérfanos
      this.Ui.hideFieldError(cityElement);
      this.Ui.hideElement(cityElement);

      this.logger.info("👁️ [LOCATIONS] Campo ciudad ocultado y error limpiado de UI");
    }

    this.state.setFieldVisibility(Constants.FIELDS.CITY, false);
    this.state.updateField(Constants.FIELDS.CITY, "");
    this.state.clearValidationError(Constants.FIELDS.CITY);

    // Forzar limpieza adicional de cualquier elemento de error residual
    this._forceCleanFieldError(Constants.FIELDS.CITY);

    this.logger.info("✅ [LOCATIONS] Estado de ciudad limpiado completamente");
  }

  // ===============================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ===============================

  /**
   * Obtener estado actual de campos de ubicación
   */
  getLocationState() {
    return {
      country: this.state.getField(Constants.FIELDS.COUNTRY),
      department: this.state.getField(Constants.FIELDS.DEPARTMENT),
      city: this.state.getField(Constants.FIELDS.CITY),
    };
  }

  /**
   * Validar que los campos de ubicación estén completos
   */
  validateLocationFields() {
    const country = this.state.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.state._getInitialState()[Constants.FIELDS.COUNTRY];

    // Si no es el país por defecto, no necesita departamento/ciudad
    if (country !== defaultCountry) {
      return true;
    }

    const department = this.state.getField(Constants.FIELDS.DEPARTMENT);
    const city = this.state.getField(Constants.FIELDS.CITY);

    const missingFields = [];
    if (!country) missingFields.push("País");
    if (!department) missingFields.push("Departamento");
    if (!city) missingFields.push("Ciudad");

    if (missingFields.length > 0) {
      this.logger.warn(`Campos de ubicación incompletos: ${missingFields.join(", ")}`);

      return false;
    }

    return true;
  }

  /**
   * Resetear todos los campos de ubicación
   */
  resetLocationFields() {
    this.logger.info("🔄 Reseteando campos de ubicación");

    const locationFields = [
      Constants.FIELDS.COUNTRY,
      Constants.FIELDS.DEPARTMENT,
      Constants.FIELDS.CITY,
    ];

    locationFields.forEach((field) => {
      this.state.updateField(field, "");
      this.state.setFieldVisibility(field, false);
      this.state.clearValidationError(field);
    });

    this._hideLocationFields();
  }

  /**
   * Inicializar campos de ubicación con valores por defecto
   */
  initializeLocationFields() {
    // Si hay configuración específica de país, aplicarla
    this.initializeFromCountryConfiguration();
    
    const currentCountry = this.state.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.state._getInitialState()[Constants.FIELDS.COUNTRY];

    if (currentCountry === defaultCountry) {
      this._showLocationFields();
    } else {
      this._hideLocationFields();
    }
  }

  /**
   * Verificar si el país actual reqUiere campos adicionales
   */
  reqUiresAdditionalFields() {
    const country = this.state.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.state._getInitialState()[Constants.FIELDS.COUNTRY];

    return country === defaultCountry;
  }

  /**
   * Obtener lista de países disponibles
   */
  getAvailableCountries() {
    return this.Data.getCountries();
  }

  /**
   * Obtener departamentos disponibles
   */
  getAvailableDepartments() {
    return this.Data.getDepartments();
  }

  /**
   * Obtener ciudades para un departamento específico
   */
  getAvailableCities(departmentCode) {
    return this.Data.getCities(departmentCode);
  }

  /**
   * Buscar ciudad por código
   */
  findCityByCode(cityCode) {
    const departments = this.Data.getDepartments();

    for (const department of departments) {
      const cities = this.Data.getCities(department.codigo);
      const city = cities.find((city) => city.codigo === cityCode);
      if (city) {
        return {
          city,
          department: department.codigo,
        };
      }
    }

    return null;
  }

  /**
   * Validar combinación departamento-ciudad
   */
  validateLocationCombination(departmentCode, cityCode) {
    if (!departmentCode || !cityCode) {
      return false;
    }

    const cities = this.Data.getCities(departmentCode);
    return cities.some((city) => city.codigo === cityCode);
  }

  // ===============================
  // MÉTODOS DE FILTRADO POR CONFIGURACIÓN
  // ===============================

  /**
   * Obtener países filtrados por configuración
   */
  getFilteredCountries() {
    const allCountries = this.Data.getCountries();
    
    if (!this.config) {
      return allCountries.map(country => ({ value: country.code, text: country.name }));
    }

    const configCountries = this.config.get('countries');

    // Si hay países específicos en configuración, filtrar por esos
    if (configCountries && configCountries.length > 0) {
      const filteredCountries = allCountries
        .filter(country => configCountries.includes(country.name) || configCountries.includes(country.code))
        .map(country => ({ value: country.code, text: country.name }));
      
      this.logger.info(`🌍 Países filtrados por configuración: ${filteredCountries.map(c => c.text).join(', ')}`);
      return filteredCountries;
    }

    this.logger.info(`🌍 Mostrando todos los países disponibles`);
    return allCountries.map(country => ({ value: country.code, text: country.name }));
  }

  /**
   * Obtener departamentos filtrados por configuración
   */
  getFilteredDepartments() {
    const allDepartments = this.Data.getDepartments();
    
    if (!this.config) {
      return allDepartments.map(dept => ({ value: dept.codigo, text: dept.nombre }));
    }

    const configDepartments = this.config.get('departments');
    const configCities = this.config.get('cities');

    // Si hay ciudades específicas, obtener departamentos de esas ciudades
    if (configCities && configCities.length > 0) {
      const departmentsFromCities = this.getDepartmentsFromCities(configCities);
      this.logger.info(`🏛️ Departamentos desde ciudades configuradas: ${departmentsFromCities.map(d => d.text).join(', ')}`);
      return departmentsFromCities;
    }

    // Si hay departamentos específicos en configuración, filtrar por esos
    if (configDepartments && configDepartments.length > 0) {
      const filteredDepartments = allDepartments
        .filter(dept => 
          configDepartments.includes(dept.nombre) || 
          configDepartments.includes(dept.codigo)
        )
        .map(dept => ({ value: dept.codigo, text: dept.nombre }));
      
      this.logger.info(`🏛️ Departamentos filtrados por configuración: ${filteredDepartments.map(d => d.text).join(', ')}`);
      return filteredDepartments;
    }

    this.logger.info(`🏛️ Mostrando todos los departamentos disponibles`);
    return allDepartments.map(dept => ({ value: dept.codigo, text: dept.nombre }));
  }

  /**
   * Obtener ciudades filtradas por configuración
   */
  getFilteredCities(departmentCode) {
    const allCities = this.Data.getCities(departmentCode);
    
    if (!this.config) {
      return allCities.map(city => ({ value: city.codigo, text: city.nombre }));
    }

    const configCities = this.config.get('cities');

    // Si hay ciudades específicas en configuración, filtrar por esas
    if (configCities && configCities.length > 0) {
      const filteredCities = allCities
        .filter(city => 
          configCities.includes(city.nombre) || 
          configCities.includes(city.codigo)
        )
        .map(city => ({ value: city.codigo, text: city.nombre }));
      
      this.logger.info(`🏙️ Ciudades filtradas por configuración: ${filteredCities.map(c => c.text).join(', ')}`);
      return filteredCities;
    }

    this.logger.info(`🏙️ Mostrando todas las ciudades para departamento ${departmentCode}`);
    return allCities.map(city => ({ value: city.codigo, text: city.nombre }));
  }

  /**
   * Obtener departamentos desde ciudades configuradas
   */
  getDepartmentsFromCities(configCities) {
    const allDepartments = this.Data.getDepartments();
    const departmentsSet = new Set();

    allDepartments.forEach(department => {
      const cities = this.Data.getCities(department.codigo);
      const hasConfiguredCity = cities.some(city => 
        configCities.includes(city.nombre) || configCities.includes(city.codigo)
      );
      
      if (hasConfiguredCity) {
        departmentsSet.add(department.codigo);
      }
    });

    return Array.from(departmentsSet)
      .map(deptCode => {
        const dept = allDepartments.find(d => d.codigo === deptCode);
        return { value: dept.codigo, text: dept.nombre };
      });
  }

  /**
   * Método público para inicializar filtros basados en configuración de países
   */
  initializeFromCountryConfiguration() {
    if (!this.config) {
      this.logger.warn("No hay configuración disponible para inicializar desde países");
      return;
    }

    const configCountries = this.config.get('countries');
    
    if (!configCountries || configCountries.length === 0) {
      this.logger.info("No hay países específicos configurados, usando lógica estándar");
      return;
    }

    this.logger.info(`🔧 Inicializando desde países configurados: ${configCountries.join(', ')}`);

    // Analizar los países configurados para determinar comportamiento
    const countriesAnalysis = this.analyzeCountriesConfiguration(configCountries);
    
    this.logger.info(`📊 Análisis de países:`, countriesAnalysis);

    // Aplicar lógica según el análisis
    if (countriesAnalysis.countries.length === 1) {
      // Un solo país
      this.state.updateField(Constants.FIELDS.COUNTRY, countriesAnalysis.countries[0]);
      this.state.setFieldVisibility(Constants.FIELDS.COUNTRY, false);
      this.logger.info(`🔧 País oculto y preseleccionado: ${countriesAnalysis.countries[0]}`);
    } else {
      // Múltiples países
      this.state.setFieldVisibility(Constants.FIELDS.COUNTRY, true);
      this.logger.info(`📋 Países visibles para selección múltiple`);
    }
  }

  /**
   * Analizar configuración de países para determinar comportamiento
   */
  analyzeCountriesConfiguration(configCountries) {
    const allCountries = this.Data.getCountries();
    const matchedCountries = [];

    configCountries.forEach(configCountry => {
      const country = allCountries.find(c => 
        c.name === configCountry || c.code === configCountry
      );
      if (country) {
        matchedCountries.push(country.code);
      }
    });

    return {
      countries: matchedCountries
    };
  }

  /**
   * Método público para inicializar filtros basados en configuración de ubicación específica
   */
  initializeFromLocationConfiguration() {
    if (!this.config) {
      this.logger.warn("No hay configuración disponible para inicializar ubicaciones");
      return;
    }

    const configDepartments = this.config.get('departments');
    const configCities = this.config.get('cities');
    
    this.logger.info(`🔧 Inicializando filtros de ubicación`, {
      departments: configDepartments?.length || 0,
      cities: configCities?.length || 0
    });

    // Si hay configuración específica de departamentos y ciudades
    if (configDepartments && configDepartments.length === 1 && 
        configCities && configCities.length === 1) {
      
      // Preseleccionar Colombia si solo hay configuración de departamentos/ciudades
      this.state.updateField(Constants.FIELDS.COUNTRY, 'COL');
      this.state.setFieldVisibility(Constants.FIELDS.COUNTRY, false);
      
      this.state.updateField(Constants.FIELDS.DEPARTMENT, configDepartments[0]);
      this.state.setFieldVisibility(Constants.FIELDS.DEPARTMENT, false);
      
      this.state.updateField(Constants.FIELDS.CITY, configCities[0]);
      this.state.setFieldVisibility(Constants.FIELDS.CITY, false);
      
      this.logger.info(`🔧 Ubicación completamente preseleccionada y oculta`);
    }
  }
}
