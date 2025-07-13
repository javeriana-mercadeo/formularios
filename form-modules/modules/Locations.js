/**
 * Locations - Módulo especializado para gestión de campos de ubicación
 * Maneja toda la lógica relacionada con países, departamentos y ciudades
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";

export class Locations {
  constructor(Data, Ui, stateManager, inputSelectors) {
    this.Data = Data;
    this.Ui = Ui;
    this.stateManager = stateManager;
    this.inputSelectors = inputSelectors;
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Manejar cambio de país
   */
  handleCountryChange(value) {
    this.stateManager.updateField(Constants.FIELDS.COUNTRY, value);
    Logger.info(`🌍 País cambiado a: ${value}`);

    const defaultCountry = this.stateManager._getInitialState()[Constants.FIELDS.COUNTRY];

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
    this.stateManager.updateField(Constants.FIELDS.DEPARTMENT, value);
    Logger.info(`🏛️ Departamento cambiado a: ${value}`);

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
    Logger.info("🌍 Mostrando campos de ubicación");

    const departments = this.Data.getDepartments();

    this.Ui.populateSelect({
      selector: this.inputSelectors.department,
      options: departments.map((dept) => ({
        value: dept.codigo,
        text: dept.nombre,
      })),
      priorityItems: ["bogotá", "bogota"],
    });

    this.Ui.showElement(document.querySelector(this.inputSelectors.department));
    this.stateManager.setFieldVisibility(Constants.FIELDS.DEPARTMENT, true);
  }

  /**
   * Ocultar campos de ubicación
   * @private
   */
  _hideLocationFields() {
    Logger.info("🌍 Ocultando campos de ubicación");

    const locationFields = [
      { key: Constants.FIELDS.DEPARTMENT, selector: this.inputSelectors.department },
      { key: Constants.FIELDS.CITY, selector: this.inputSelectors.city },
    ];

    locationFields.forEach(({ key, selector }) => {
      const element = document.querySelector(selector);
      if (element) {
        this.Ui.hideElement(element);
        this.Ui.hideFieldError(element);
      }
      this.stateManager.setFieldVisibility(key, false);
      this.stateManager.updateField(key, "");
      this.stateManager.clearValidationError(key);
    });
  }

  /**
   * Poblar ciudades basado en departamento
   * @private
   */
  _populateCities(departmentCode) {
    Logger.info(`🏙️ Cargando ciudades para departamento: ${departmentCode}`);

    const cities = this.Data.getCities(departmentCode);

    this.Ui.populateSelect({
      selector: this.inputSelectors.city,
      options: cities.map((city) => ({
        value: city.codigo,
        text: city.nombre,
      })),
    });

    this.Ui.showElement(document.querySelector(this.inputSelectors.city));
    this.stateManager.setFieldVisibility(Constants.FIELDS.CITY, true);
  }

  /**
   * Ocultar campo de ciudad
   * @private
   */
  _hideCityField() {
    Logger.info("🏙️ Ocultando campo de ciudad");

    const cityElement = document.querySelector(this.inputSelectors.city);
    if (cityElement) {
      this.Ui.hideElement(cityElement);
      this.Ui.hideFieldError(cityElement);
    }

    this.stateManager.setFieldVisibility(Constants.FIELDS.CITY, false);
    this.stateManager.updateField(Constants.FIELDS.CITY, "");
    this.stateManager.clearValidationError(Constants.FIELDS.CITY);
  }

  // ===============================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ===============================

  /**
   * Obtener estado actual de campos de ubicación
   */
  getLocationState() {
    return {
      country: this.stateManager.getField(Constants.FIELDS.COUNTRY),
      department: this.stateManager.getField(Constants.FIELDS.DEPARTMENT),
      city: this.stateManager.getField(Constants.FIELDS.CITY),
    };
  }

  /**
   * Validar que los campos de ubicación estén completos
   */
  validateLocationFields() {
    const country = this.stateManager.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.stateManager._getInitialState()[Constants.FIELDS.COUNTRY];

    // Si no es el país por defecto, no necesita departamento/ciudad
    if (country !== defaultCountry) {
      return true;
    }

    const department = this.stateManager.getField(Constants.FIELDS.DEPARTMENT);
    const city = this.stateManager.getField(Constants.FIELDS.CITY);

    const missingFields = [];
    if (!country) missingFields.push("País");
    if (!department) missingFields.push("Departamento");
    if (!city) missingFields.push("Ciudad");

    if (missingFields.length > 0) {
      Logger.warn(`Campos de ubicación incompletos: ${missingFields.join(", ")}`);
      return false;
    }

    return true;
  }

  /**
   * Resetear todos los campos de ubicación
   */
  resetLocationFields() {
    Logger.info("🔄 Reseteando campos de ubicación");

    const locationFields = [
      Constants.FIELDS.COUNTRY,
      Constants.FIELDS.DEPARTMENT,
      Constants.FIELDS.CITY,
    ];

    locationFields.forEach((field) => {
      this.stateManager.updateField(field, "");
      this.stateManager.setFieldVisibility(field, false);
      this.stateManager.clearValidationError(field);
    });

    this._hideLocationFields();
  }

  /**
   * Inicializar campos de ubicación con valores por defecto
   */
  initializeLocationFields() {
    const currentCountry = this.stateManager.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.stateManager._getInitialState()[Constants.FIELDS.COUNTRY];

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
    const country = this.stateManager.getField(Constants.FIELDS.COUNTRY);
    const defaultCountry = this.stateManager._getInitialState()[Constants.FIELDS.COUNTRY];

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
