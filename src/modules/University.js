/**
 * University - Módulo especializado para gestión del campo universidad
 * Maneja la lógica de filtrado y población de universidades
 * @version 1.0
 */

import { Constants } from "./Constants.js";
import { TomSelect } from "./TomSelect.js";

export class University {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data;
    this.Ui = Ui;
    this.state = state;
    this.logger = logger;
    this.config = config;
    
    // Inicializar módulo TomSelect
    this.tomSelect = new TomSelect(logger);
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de universidad
   */
  async initializeUniversityField() {
    const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
    if (!universityElement) {
      this.logger.debug("Campo universidad no encontrado en el formulario");
      return;
    }

    await this._populateUniversities();
  }

  /**
   * Obtener universidades filtradas basadas en la configuración
   * @returns {Array} - Array de universidades filtradas
   */
  getFilteredUniversities() {
    const universityData = this.Data.data.university;
    if (!universityData || !universityData.cuentasInstitucionales) {
      this.logger.warn("⚠️ No se encontraron datos de universidades");
      return [];
    }

    const config = this.config?.config || this.config || {};
    const configUniversities = config.universities;

    if (configUniversities && Array.isArray(configUniversities) && configUniversities.length > 0) {
      // Filtrar universidades del JSON que coincidan with la configuración
      const filteredUniversities = [];
      
      configUniversities.forEach(configName => {
        const matchedUniversity = universityData.cuentasInstitucionales.find(university => 
          this._matchUniversityName(university.NAME, configName)
        );
        
        if (matchedUniversity) {
          filteredUniversities.push(matchedUniversity);
        } else {
          this.logger.warn(`⚠️ Universidad no encontrada en JSON: "${configName}"`);
        }
      });

      this.logger.info(`🎓 Universidades filtradas: ${filteredUniversities.length}/${configUniversities.length} encontradas`);
      return filteredUniversities;
    } else {
      // Retornar todas las universidades del JSON
      this.logger.info(`🎓 Usando todas las universidades: ${universityData.cuentasInstitucionales.length} universidades`);
      this.logger.debug('📊 Datos de universidades:', {
        total: universityData.cuentasInstitucionales.length,
        primeras5: universityData.cuentasInstitucionales.slice(0, 5).map(u => ({ name: u.NAME, id: u.PUJ_EXTERNALORGID__C }))
      });
      return universityData.cuentasInstitucionales;
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Poblar select de universidades con TomSelect
   * @private
   */
  async _populateUniversities() {
    const filteredUniversities = this.getFilteredUniversities();
    
    if (filteredUniversities.length === 0) {
      this.logger.warn("⚠️ No hay universidades disponibles");
      this.state.setFieldVisibility(Constants.FIELDS.UNIVERSITY, false);
      return;
    }

    const options = filteredUniversities.map(university => ({
      value: university.PUJ_EXTERNALORGID__C || university.ID || university.NAME,
      text: university.NAME
    }));
    
    this.logger.debug('🎯 Opciones generadas para TomSelect:', {
      total: options.length,
      primeras5: options.slice(0, 5),
      ultimas5: options.slice(-5)
    });

    // Inicializar TomSelect
    await this._setupTomSelectModular(options);

    this.state.setFieldVisibility(Constants.FIELDS.UNIVERSITY, true);
    this.logger.info(`🎓 Select de universidades poblado con ${options.length} opciones usando TomSelect`);
  }

  /**
   * Hacer matching entre nombres de universidades (configuración vs JSON)
   * @private
   * @param {string} jsonName - Nombre en el JSON
   * @param {string} configName - Nombre en la configuración
   * @returns {boolean} - Si coinciden
   */
  _matchUniversityName(jsonName, configName) {
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

    // Comparación con abreviaciones comunes
    const abbreviations = {
      'universidad': ['univ', 'u'],
      'corporacion': ['corp'],
      'fundacion': ['fund'],
      'pontificia': ['pont'],
      'tecnologica': ['tecnol', 'tecn'],
      'colombiana': ['col'],
      'de colombia': ['de col'],
      'nacional': ['nal'],
      'industrial': ['indus'],
      'autonoma': ['auton'],
      'pedagogica': ['pedag'],
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
   * Validar campo de universidad usando TomSelect
   * @returns {boolean} - True si es válido
   */
  validateField() {
    try {
      const universityElement = this.Ui.scopedQuery(Constants.SELECTORS.UNIVERSITY);
      if (!universityElement) return true;

      const instanceKey = universityElement.name || universityElement.id || 'university';
      return this.tomSelect.validateField(instanceKey);
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