/**
 * Locations - Módulo especializado para gestión de campos de ubicación
 * Maneja toda la lógica relacionada con países, departamentos y ciudades
 * @version 1.0
 */

import { Constants } from "./Constants.js";

export class Locations {
  constructor(Data, Ui, state, logger = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
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

    const departments = this.Data.getDepartments();

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.DEPARTMENT,
      options: departments.map((dept) => ({
        value: dept.codigo,
        text: dept.nombre,
      })),
      priorityItems: ["bogotá", "bogota"],
    });

    this.Ui.showElement(this.Ui.scopedQuery(Constants.SELECTORS.DEPARTMENT));
    this.state.setFieldVisibility(Constants.FIELDS.DEPARTMENT, true);
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

    const cities = this.Data.getCities(departmentCode);

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.CITY,
      options: cities.map((city) => ({
        value: city.codigo,
        text: city.nombre,
      })),
    });

    this.Ui.showElement(this.Ui.scopedQuery(Constants.SELECTORS.CITY));
    this.state.setFieldVisibility(Constants.FIELDS.CITY, true);
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
}
