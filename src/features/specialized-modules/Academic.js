/**
 * Academic - Módulo especializado para gestión de campos académicos (Modernizado)
 * Maneja toda la lógica relacionada con nivel académico, facultades, programas y períodos
 * @version 2.0 - Modernizado con TomSelectAdapter y Zustand
 */

import { Constants } from "../../core/Constants.js";
import { TomSelectAdapter } from "../../integrations/tom-select/TomSelectAdapter.js";
import { useFieldStore } from "../field-management/stores/field-store.js";
import { useValidationStore } from "../validation/stores/validation-store.js";

export class Academic {
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
   * Inicializar estado de campos académicos basado en tipo de asistente
   */
  initializeAcademicFields() {
    const currentTypeAttendee = this.validationStore.getState().getFieldValue(Constants.FIELDS.TYPE_ATTENDEE);
    if (currentTypeAttendee === Constants.ATTENDEE_TYPES.APPLICANT) {
      this._showAcademicFields();
    } else {
      this._hideAcademicFields();
    }
  }

  /**
   * Configurar niveles académicos basados en programas disponibles
   */
  async configureAcademicLevels(programsData) {
    try {
      this.logger?.info("🎯 Configurando niveles académicos...");

      // Analizar programas disponibles
      const programsAnalysis = this._analyzeAvailablePrograms(programsData);
      
      // Filtrar niveles relevantes
      const allLevels = this.Data.getAcademicLevels();
      const filteredLevels = allLevels.filter(level => 
        programsAnalysis.levels.includes(level.code)
      );

      this.logger?.info(`📊 Niveles disponibles: ${filteredLevels.length}`);

      if (programsAnalysis.levels.length === 1) {
        // Solo un nivel: ocultar campo y preseleccionar
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.ACADEMIC_LEVEL,
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: filteredLevels.map(level => ({ value: level.code, text: level.name })),
          type: 'academic'
        });

        this.validationStore.getState().updateField(Constants.FIELDS.ACADEMIC_LEVEL, filteredLevels[0].code);
        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, false);

        this.logger?.info(
          `🔧 Nivel académico preseleccionado automáticamente: ${filteredLevels[0].name}`
        );

        // Cargar facultades automáticamente para detectar casos 1-1-1
        setTimeout(() => this._loadFacultiesForLevel(filteredLevels[0].code), 100);
      } else {
        // Múltiples niveles: mostrar select normalmente
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.ACADEMIC_LEVEL,
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: filteredLevels.map(level => ({ value: level.code, text: level.name })),
          type: 'academic',
          placeholder: 'Selecciona tu nivel académico...'
        });

        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true);
      }

    } catch (error) {
      this.logger?.error("❌ Error configurando niveles académicos:", error);
    }
  }

  /**
   * Configurar facultades para un nivel académico específico
   */
  async configureFaculties(levelCode) {
    try {
      this.logger?.info(`🏛️ Configurando facultades para nivel: ${levelCode}`);

      const faculties = this.Data.getFacultiesForLevel(levelCode);
      
      if (faculties.length === 1) {
        // Solo una facultad: preseleccionar y ocultar
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.FACULTY,
          selector: Constants.SELECTORS.FACULTY,
          options: faculties.map(faculty => ({ value: faculty.code, text: faculty.name })),
          type: 'academic'
        });

        this.validationStore.getState().updateField(Constants.FIELDS.FACULTY, faculties[0].code);
        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.FACULTY, false);

        this.logger?.info(`🔧 Facultad preseleccionada: ${faculties[0].name}`);
        
        // Cargar programas automáticamente
        setTimeout(() => this._loadProgramsForFaculty(faculties[0].code), 100);
      } else {
        // Múltiples facultades
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.FACULTY,
          selector: Constants.SELECTORS.FACULTY,
          options: faculties.map(faculty => ({ value: faculty.code, text: faculty.name })),
          type: 'academic',
          placeholder: 'Selecciona tu facultad...'
        });

        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.FACULTY, true);
      }

    } catch (error) {
      this.logger?.error("❌ Error configurando facultades:", error);
    }
  }

  /**
   * Configurar programas para una facultad específica
   */
  async configurePrograms(facultyCode) {
    try {
      this.logger?.info(`🎓 Configurando programas para facultad: ${facultyCode}`);

      const currentLevel = this.validationStore.getState().getFieldValue(Constants.FIELDS.ACADEMIC_LEVEL);
      const programs = this.Data.getProgramsForFaculty(facultyCode, currentLevel);
      
      if (programs.length === 1) {
        // Solo un programa: preseleccionar y ocultar
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.PROGRAM,
          selector: Constants.SELECTORS.PROGRAM,
          options: programs.map(program => ({ value: program.code, text: program.name })),
          type: 'academic'
        });

        this.validationStore.getState().updateField(Constants.FIELDS.PROGRAM, programs[0].code);
        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.PROGRAM, false);

        this.logger?.info(`🔧 Programa preseleccionado: ${programs[0].name}`);
        
        // Cargar períodos automáticamente
        setTimeout(() => this._loadAdmissionPeriods(programs[0].code), 100);
      } else {
        // Múltiples programas
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.PROGRAM,
          selector: Constants.SELECTORS.PROGRAM,
          options: programs.map(program => ({ value: program.code, text: program.name })),
          type: 'academic',
          placeholder: 'Selecciona tu programa...'
        });

        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.PROGRAM, true);
      }

    } catch (error) {
      this.logger?.error("❌ Error configurando programas:", error);
    }
  }

  /**
   * Configurar períodos de admisión
   */
  async configureAdmissionPeriods(programCode) {
    try {
      this.logger?.info(`📅 Configurando períodos de admisión para: ${programCode}`);

      const periods = this.Data.getAdmissionPeriodsForProgram(programCode);
      
      if (periods.length === 1) {
        // Solo un período: preseleccionar y ocultar
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.ADMISSION_PERIOD,
          selector: Constants.SELECTORS.ADMISSION_PERIOD,
          options: periods.map(period => ({ value: period.code, text: period.name })),
          type: 'academic'
        });

        this.validationStore.getState().updateField(Constants.FIELDS.ADMISSION_PERIOD, periods[0].code);
        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, false);

        this.logger?.info(`🔧 Período preseleccionado: ${periods[0].name}`);
      } else {
        // Múltiples períodos
        await this._populateSelectModern({
          fieldName: Constants.FIELDS.ADMISSION_PERIOD,
          selector: Constants.SELECTORS.ADMISSION_PERIOD,
          options: periods.map(period => ({ value: period.code, text: period.name })),
          type: 'academic',
          placeholder: 'Selecciona período de admisión...'
        });

        this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, true);
      }

    } catch (error) {
      this.logger?.error("❌ Error configurando períodos de admisión:", error);
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Método modernizado para popular selects usando TomSelectAdapter
   */
  async _populateSelectModern({ fieldName, selector, options, type = 'academic', placeholder = null }) {
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

      this.logger?.debug(`✅ Select modernizado actualizado: ${fieldName}`);

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
   * Mostrar campos académicos usando stores
   */
  _showAcademicFields() {
    this.fieldStore.getState().showAcademicFields();
    this.logger?.debug("👁️ Campos académicos mostrados");
  }

  /**
   * Ocultar campos académicos usando stores
   */
  _hideAcademicFields() {
    this.fieldStore.getState().hideAcademicFields();
    this.logger?.debug("🙈 Campos académicos ocultados");
  }

  /**
   * Análisis de programas disponibles (mantener lógica original)
   */
  _analyzeAvailablePrograms(programsData) {
    // Lógica original mantenida...
    const levels = new Set();
    
    Object.values(programsData).forEach(program => {
      if (program.academic_level) {
        levels.add(program.academic_level);
      }
    });

    return {
      levels: Array.from(levels),
      totalPrograms: Object.keys(programsData).length
    };
  }

  /**
   * Cargar facultades para un nivel (mantener lógica original con adaptador)
   */
  async _loadFacultiesForLevel(levelCode) {
    await this.configureFaculties(levelCode);
  }

  /**
   * Cargar programas para una facultad (mantener lógica original con adaptador)
   */
  async _loadProgramsForFaculty(facultyCode) {
    await this.configurePrograms(facultyCode);
  }

  /**
   * Cargar períodos de admisión (mantener lógica original con adaptador)
   */
  async _loadAdmissionPeriods(programCode) {
    await this.configureAdmissionPeriods(programCode);
  }

  /**
   * Limpiar campos académicos
   */
  clearAcademicFields() {
    const fields = [
      Constants.FIELDS.ACADEMIC_LEVEL,
      Constants.FIELDS.FACULTY, 
      Constants.FIELDS.PROGRAM,
      Constants.FIELDS.ADMISSION_PERIOD
    ];

    fields.forEach(field => {
      this.validationStore.getState().updateField(field, '');
      this.fieldStore.getState().clearFieldValue(field);
    });

    this.logger?.debug("🧹 Campos académicos limpiados");
  }

  /**
   * Destruir instancias de TomSelect
   */
  destroy() {
    this.tomSelectAdapter.destroyAll();
    this.logger?.info("🗑️ Academic module destruido");
  }
}