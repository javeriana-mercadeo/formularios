/**
 * Academic - Módulo especializado para gestión de campos académicos
 * Maneja toda la lógica relacionada con nivel académico, facultades, programas y períodos
 * @version 1.0
 */

import { Constants } from './Constants.js'

export class Academic {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data
    this.Ui = Ui
    this.state = state
    this.logger = logger
    this.config = config
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar estado de campos académicos basado en tipo de asistente
   */
  initializeAcademicFields() {
    const currentTypeAttendee = this.state.getField(Constants.FIELDS.TYPE_ATTENDEE)
    if (currentTypeAttendee === Constants.ATTENDEE_TYPES.APPLICANT) {
      this._showAcademicFields()
    } else {
      this._hideAcademicFields()
    }
  }

  /**
   * Manejar cambio de tipo de asistente
   */
  handleTypeAttendeeChange(value) {
    this.state.updateField(Constants.FIELDS.TYPE_ATTENDEE, value)

    this.logger.info(`👤 Tipo de asistente cambiado a: ${value}`)

    if (value === Constants.ATTENDEE_TYPES.APPLICANT) {
      this._showAcademicFields()
    } else {
      this._hideAcademicFields()
      // Para asistentes que no son aspirantes, establecer código NOAP
      this._setNonAspirantDefaults()
    }
  }

  /**
   * Manejar cambio de nivel académico
   */
  handleAcademicLevelChange(levelValue) {
    this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, levelValue)
    this.logger.info(`🎓 Nivel académico cambiado a: ${levelValue}`)

    // Limpiar mensaje informativo al cambiar nivel académico
    this._hideAcademicInfoText()

    // IMPORTANTE: Restaurar elementos a su estado normal
    this._restoreAcademicElementsState()

    if (levelValue) {
      this._loadFacultiesForLevel(levelValue)
    } else {
      this._hideAcademicDependentFields(['faculty', 'program', 'admissionPeriod'])
    }
  }

  /**
   * Manejar cambio de facultad
   */
  handleFacultyChange(facultyValue) {
    this.state.updateField(Constants.FIELDS.FACULTY, facultyValue)
    this.logger.info(`🏛️ Facultad cambiada a: ${facultyValue}`)

    if (facultyValue) {
      this._loadProgramsForFaculty(facultyValue)
    } else {
      this._hideAcademicDependentFields(['program', 'admissionPeriod'])
    }
  }

  /**
   * Manejar cambio de programa académico
   */
  handleProgramChange(programValue) {
    this.state.updateField(Constants.FIELDS.PROGRAM, programValue)
    this.logger.info(`📚 Programa académico cambiado a: ${programValue}`)

    if (programValue) {
      const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL)
      if (currentAcademicLevel) {
        this._loadPeriodsForLevel(currentAcademicLevel)
      }
    } else {
      this._hideAcademicDependentFields(['admissionPeriod'])
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - MOSTRAR/OCULTAR
  // ===============================

  /**
   * Mostrar campos académicos
   * @private
   */
  _showAcademicFields() {
    const filteredLevels = this.getFilteredAcademicLevels()

    // Verificar si tenemos configuración de programas específicos
    const configPrograms = this.config ? this.config.get('programs') : null
    const shouldApplyProgramLogic = configPrograms && configPrograms.length > 0

    if (shouldApplyProgramLogic) {
      this.logger.info(`🎯 Aplicando lógica especial para niveles académicos con programas configurados`)

      // Analizar los programas para determinar el comportamiento de niveles
      const programsAnalysis = this.analyzeProgramsConfiguration(configPrograms)

      if (programsAnalysis.levels.length === 1) {
        // Solo un nivel: ocultar campo y preseleccionar
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: [{ value: filteredLevels[0].code, text: filteredLevels[0].name }]
        })

        this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, filteredLevels[0].code)
        this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, false)

        this.logger.info(`🔧 Nivel académico preseleccionado automáticamente (programas configurados): ${filteredLevels[0].name}`)

        // Cargar facultades automáticamente para detectar casos 1-1-1
        setTimeout(() => this._loadFacultiesForLevel(filteredLevels[0].code), 100)
      } else {
        // Múltiples niveles: mostrar select normalmente
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: filteredLevels.map(level => ({
            value: level.code,
            text: level.name
          }))
        })

        this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true)
        this.logger.info(`📋 Select de nivel académico con ${filteredLevels.length} opciones (múltiples niveles en programas configurados)`)
      }
    } else {
      // Lógica estándar sin configuración de programas específicos
      if (filteredLevels.length === 1) {
        // CASO ESPECIAL: Solo un nivel - podriaí ser caso 1-1-1
        const level = filteredLevels[0]

        // Pre-analizar si es caso 1-1-1 para decidir si mostrar el nivel
        const faculties = this.getFilteredFaculties(level.code)
        const isSingleFaculty = faculties.length === 1

        if (isSingleFaculty) {
          const programs = this.getFilteredPrograms(level.code, faculties[0].value)
          const isSingleProgram = programs.length === 1

          if (isSingleProgram) {
            // CASO 1-1-1: Mostrar solo el nivel académico como select funcional
            this.logger.info(`🎯 CASO 1-1-1 PRE-DETECTADO: Mostrando solo nivel académico: ${level.name}`)

            this.Ui.populateSelect({
              selector: Constants.SELECTORS.ACADEMIC_LEVEL,
              options: [{ value: level.code, text: level.name }]
            })

            // NO preseleccionar automáticamente - que el usuario lo vea y seleccione
            this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true)

            this.logger.info(`📋 Nivel académico mostrado para caso 1-1-1: ${level.name}`)

            // Cargar facultades cuando el usuario seleccione
            setTimeout(() => this._loadFacultiesForLevel(level.code), 100)
            return
          }
        }

        // Caso normal: solo un nivel pero con múltiples facultades/programas
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: [{ value: level.code, text: level.name }]
        })

        this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, level.code)
        this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, false)

        this.logger.info(`🔧 Nivel académico preseleccionado automáticamente: ${level.name}`)

        // Cargar facultades automáticamente para detectar casos 1-1-1
        setTimeout(() => this._loadFacultiesForLevel(level.code), 100)
      } else if (filteredLevels.length === 0) {
        // Sin opciones disponibles
        this.logger.warn('⚠️ No hay niveles académicos disponibles con la configuración actual')
        this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, false)
      } else {
        // Múltiples opciones: mostrar select normalmente
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.ACADEMIC_LEVEL,
          options: filteredLevels.map(level => ({
            value: level.code,
            text: level.name
          }))
        })

        this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true)
        this.logger.info(`📋 Select de nivel académico con ${filteredLevels.length} opciones`)
      }
    }
  }

  /**
   * Ocultar campos académicos y limpiar errores
   * @private
   */
  _hideAcademicFields() {
    this.logger.info('🧹 [ACADEMIC] Ocultando y limpiando campos académicos')

    const academicFields = [
      { key: Constants.FIELDS.ACADEMIC_LEVEL, selector: Constants.SELECTORS.ACADEMIC_LEVEL },
      { key: Constants.FIELDS.FACULTY, selector: Constants.SELECTORS.FACULTY },
      { key: Constants.FIELDS.PROGRAM, selector: Constants.SELECTORS.PROGRAM },
      { key: Constants.FIELDS.ADMISSION_PERIOD, selector: Constants.SELECTORS.ADMISSION_PERIOD }
    ]

    academicFields.forEach(({ key, selector }) => {
      this.logger.info(`🧹 [ACADEMIC] Limpiando campo: ${key}`)

      const element = this.Ui.scopedQuery(selector)
      if (element) {
        // IMPORTANTE: Limpiar error ANTES de ocultar para evitar elementos DOM huérfanos
        this.Ui.hideFieldError(element)
        this.Ui.hideElement(element)

        this.logger.info(`👁️ [ACADEMIC] Elemento ${key} ocultado y error limpiado de UI`)
      }

      this.state.setFieldVisibility(key, false)
      this.state.updateField(key, '')
      this.state.clearValidationError(key)

      // Forzar limpieza adicional de cualquier elemento de error residual
      this._forceCleanFieldError(key)

      this.logger.info(`✅ [ACADEMIC] Estado limpiado para ${key}`)
    })

    // Ocultar texto informativo también
    this._hideAcademicInfoText()

    this.logger.info('🧹 [ACADEMIC] Limpieza de campos académicos completada')
  }

  /**
   * Forzar limpieza de errores visuales de un campo específico
   * @private
   */
  _forceCleanFieldError(fieldKey) {
    // Buscar y limpiar TODOS los posibles elementos de error para este campo
    const possibleErrorSelectors = [`#error_${fieldKey}`, `[data-error-for="${fieldKey}"]`, `.error_text[data-error-for="${fieldKey}"]`]

    possibleErrorSelectors.forEach(selector => {
      const errorElement = this.Ui.scopedQuery(selector)
      if (errorElement) {
        errorElement.style.display = 'none'
        errorElement.textContent = ''

        this.logger.info(`🧹 [ACADEMIC] Error residual limpiado: ${selector}`)
      }
    })
  }

  /**
   * Ocultar campos dependientes académicos
   * @private
   */
  _hideAcademicDependentFields(fieldKeys) {
    const fieldMapping = {
      faculty: Constants.FIELDS.FACULTY,
      program: Constants.FIELDS.PROGRAM,
      admissionPeriod: Constants.FIELDS.ADMISSION_PERIOD
    }

    const selectorMapping = {
      faculty: Constants.SELECTORS.FACULTY,
      program: Constants.SELECTORS.PROGRAM,
      admissionPeriod: Constants.SELECTORS.ADMISSION_PERIOD
    }

    fieldKeys.forEach(key => {
      const field = fieldMapping[key]
      const selector = selectorMapping[key]

      if (field && selector) {
        const element = this.Ui.scopedQuery(selector)
        if (element) {
          this.Ui.hideElement(element)
        }
        this.state.setFieldVisibility(field, false)
        this.state.updateField(field, '')
      }
    })

    // Limpiar mensaje informativo cuando se oculten campos dependientes
    this._hideAcademicInfoText()
  }

  // ===============================
  // MÉTODOS PRIVADOS - CARGA DE DATOS
  // ===============================

  /**
   * Cargar facultades para un nivel académico
   * @private
   */
  _loadFacultiesForLevel(academicLevel) {
    const filteredFaculties = this.getFilteredFaculties(academicLevel)

    // DETECTAR CASO 1-1-1: Un nivel -> Una facultad -> Un programa
    const isSingleFaculty = filteredFaculties.length === 1
    if (isSingleFaculty) {
      const faculty = filteredFaculties[0]
      const programsForFaculty = this.getFilteredPrograms(academicLevel, faculty.value)
      const isSingleProgram = programsForFaculty.length === 1

      if (isSingleProgram) {
        this.logger.info(`🎯 CASO 1-1-1 DETECTADO: ${academicLevel} -> ${faculty.text} -> ${programsForFaculty[0].text}`)

        // AUTO-POBLAR todos los campos pero OCULTAR facultad y programa
        this._handleSinglePathAcademic(academicLevel, faculty, programsForFaculty[0])
        return
      }
    }

    // Verificar si tenemos configuración de programas específicos
    const configPrograms = this.config ? this.config.get('programs') : null
    const shouldApplyProgramLogic = configPrograms && configPrograms.length > 0

    if (shouldApplyProgramLogic) {
      this.logger.info(`🎯 Aplicando lógica especial para programas configurados`)

      // Analizar los programas para determinar el comportamiento de facultades
      const programsAnalysis = this.analyzeProgramsConfiguration(configPrograms)

      if (programsAnalysis.faculties.length === 1) {
        // Solo una facultad: ocultar campo y preseleccionar
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.FACULTY,
          options: [{ value: filteredFaculties[0].value, text: filteredFaculties[0].text }]
        })

        this.state.updateField(Constants.FIELDS.FACULTY, filteredFaculties[0].value)
        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, false)

        this.logger.info(`🔧 Facultad preseleccionada automáticamente (programas configurados): ${filteredFaculties[0].text}`)

        // Cargar programas automáticamente
        setTimeout(() => this._loadProgramsForFaculty(filteredFaculties[0].value), 100)
      } else {
        // Múltiples facultades: mostrar select normalmente
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.FACULTY,
          options: filteredFaculties
        })

        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, true)
        this.logger.info(`📋 Select de facultades con ${filteredFaculties.length} opciones (programas de múltiples facultades)`)
      }
    } else {
      // Lógica estándar sin configuración de programas específicos
      if (filteredFaculties.length === 1) {
        // Solo una facultad: ocultar campo y preseleccionar
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.FACULTY,
          options: [{ value: filteredFaculties[0].value, text: filteredFaculties[0].text }]
        })

        this.state.updateField(Constants.FIELDS.FACULTY, filteredFaculties[0].value)
        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, false)

        this.logger.info(`🔧 Facultad preseleccionada automáticamente: ${filteredFaculties[0].text}`)

        // Cargar programas automáticamente
        setTimeout(() => this._loadProgramsForFaculty(filteredFaculties[0].value), 100)
      } else if (filteredFaculties.length === 0) {
        // Sin facultades disponibles
        this.logger.warn('⚠️ No hay facultades disponibles para este nivel académico')
        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, false)
      } else {
        // Múltiples facultades: mostrar select normalmente
        this.Ui.populateSelect({
          selector: Constants.SELECTORS.FACULTY,
          options: filteredFaculties
        })

        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, true)
        this.logger.info(`📋 Select de facultades con ${filteredFaculties.length} opciones`)
      }
    }
  }

  /**
   * Manejar caso especial 1-1-1: Un solo camino académico completo
   * @private
   */
  _handleSinglePathAcademic(academicLevel, faculty, program) {
    this.logger.info(`🚀 Configurando ruta académica única: ${academicLevel} -> ${faculty.text} -> ${program.text}`)

    // 1. POBLAR Y OCULTAR FACULTAD
    this.Ui.populateSelect({
      selector: Constants.SELECTORS.FACULTY,
      options: [{ value: faculty.value, text: faculty.text }]
    })
    this.state.updateField(Constants.FIELDS.FACULTY, faculty.value)
    this.state.setFieldVisibility(Constants.FIELDS.FACULTY, false)

    // 2. POBLAR Y OCULTAR PROGRAMA
    this.Ui.populateSelect({
      selector: Constants.SELECTORS.PROGRAM,
      options: [{ value: program.value, text: program.text }]
    })
    this.state.updateField(Constants.FIELDS.PROGRAM, program.value)
    this.state.setFieldVisibility(Constants.FIELDS.PROGRAM, false)

    // 3. MOSTRAR TEXTO INFORMATIVO
    this._showAcademicInfoText(faculty.text, program.text)

    // 4. CARGAR PERÍODOS AUTOMÁTICAMENTE
    setTimeout(() => this._loadPeriodsForLevel(academicLevel), 100)

    this.logger.info(`✅ Ruta académica única configurada:
      📘 Nivel: ${academicLevel} (VISIBLE - Usuario selecciona)
      🏛️ Facultad: ${faculty.text} (OCULTO - Auto-poblado)
      📚 Programa: ${program.text} (OCULTO - Auto-poblado)
      💬 Texto informativo: Mostrado
      ⏰ Período: Se carga automáticamente`)
  }

  /**
   * Mostrar texto informativo para casos 1-1-1
   * @private
   */
  _showAcademicInfoText(facultyText, programText) {
    try {
      // Buscar el contenedor del nivel académico
      const academicLevelElement = this.Ui.scopedQuery(Constants.SELECTORS.ACADEMIC_LEVEL)
      if (!academicLevelElement) {
        this.logger.warn('⚠️ No se encontró elemento de nivel académico para mostrar texto informativo')
        return
      }

      // Buscar contenedor padre (generalmente un div que envuelve el select)
      const parentContainer =
        academicLevelElement.closest('.form-group') ||
        academicLevelElement.closest('.field-container') ||
        academicLevelElement.parentElement

      if (!parentContainer) {
        this.logger.warn('⚠️ No se encontró contenedor padre para el texto informativo')
        return
      }

      // Remover texto informativo existente si lo hay
      this._hideAcademicInfoText()

      // Crear elemento de texto informativo
      const infoElement = document.createElement('div')
      infoElement.id = 'academic-info-text'
      infoElement.className = 'academic-info-text authorization-section'
      infoElement.innerHTML = `
        <p>
          <strong>📚 Información académica:</strong><br>
          Para este nivel académico existe únicamente la facultad de <strong>${facultyText}</strong> 
          con el programa <strong>${programText}</strong>.
        </p>
      `

      // Insertar después del select de nivel académico
      parentContainer.appendChild(infoElement)

      this.logger.info(`💬 Texto informativo mostrado: ${facultyText} -> ${programText}`)
    } catch (error) {
      this.logger.error('❌ Error mostrando texto informativo:', error)
    }
  }

  /**
   * Ocultar texto informativo
   * @private
   */
  _hideAcademicInfoText() {
    try {
      const existingInfo = this.Ui.scopedQuery('#academic-info-text')
      if (existingInfo) {
        existingInfo.remove()
        this.logger.info('🧹 Texto informativo removido')
      }
    } catch (error) {
      this.logger.warn('⚠️ Error removiendo texto informativo:', error)
    }
  }

  /**
   * Establecer valores por defecto para asistentes que no son aspirantes
   * @private
   */
  _setNonAspirantDefaults() {
    this.logger.info('🔧 Estableciendo valores por defecto para asistente no aspirante')

    // Para asistentes que NO son aspirantes, solo enviar el código SAE (programa) con NOAP
    // NO enviar nivel académico ni facultad
    this.state.updateField(Constants.FIELDS.PROGRAM, 'NOAP')

    // Limpiar los otros campos académicos para que NO se envíen
    this.state.updateField(Constants.FIELDS.FACULTY, '')
    this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, '')
    this.state.updateField(Constants.FIELDS.ADMISSION_PERIOD, '')

    this.logger.info('✅ Solo código SAE (programa) establecido con NOAP para asistente no aspirante')
  }

  /**
   * Restaurar elementos académicos a su estado normal
   * @private
   */
  _restoreAcademicElementsState() {
    try {
      // Restaurar todos los elementos académicos a estado habilitado
      const academicElements = [
        { selector: Constants.SELECTORS.FACULTY, name: 'facultad' },
        { selector: Constants.SELECTORS.PROGRAM, name: 'programa' },
        { selector: Constants.SELECTORS.ADMISSION_PERIOD, name: 'período de admisión' }
      ]

      academicElements.forEach(({ selector, name }) => {
        const element = this.Ui.scopedQuery(selector)
        if (element) {
          // Habilitar el elemento
          this.Ui.enableElement(element)
          this.logger.info(`🔧 Elemento ${name} restaurado a estado normal`)
        }
      })

      this.logger.info('✅ Estados de elementos académicos restaurados completamente')
    } catch (error) {
      this.logger.error('❌ Error restaurando estados de elementos académicos:', error)
    }
  }

  /**
   * Cargar programas para una facultad
   * @private
   */
  _loadProgramsForFaculty(facultyValue) {
    const currentAcademicLevel = this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL)

    if (!currentAcademicLevel) {
      this.logger.warn('No se puede cargar programas sin nivel académico seleccionado')
      return
    }

    const filteredPrograms = this.getFilteredPrograms(currentAcademicLevel, facultyValue)

    if (filteredPrograms.length === 1) {
      // Solo un programa: ocultar campo y preseleccionar (CONSISTENTE con otros campos)
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.PROGRAM,
        options: [{ value: filteredPrograms[0].value, text: filteredPrograms[0].text }]
      })

      // Preseleccionar automáticamente
      this.state.updateField(Constants.FIELDS.PROGRAM, filteredPrograms[0].value)
      // OCULTAR el campo (consistente con facultades y niveles académicos)
      this.state.setFieldVisibility(Constants.FIELDS.PROGRAM, false)

      this.logger.info(`🔧 Programa preseleccionado automáticamente y oculto: ${filteredPrograms[0].text}`)

      // Cargar períodos automáticamente
      setTimeout(() => {
        this.logger.info(`📅 Iniciando carga de períodos para programa único: ${filteredPrograms[0].text}`)
        this._loadPeriodsForLevel(currentAcademicLevel)
      }, 200)
    } else if (filteredPrograms.length === 0) {
      // Sin programas disponibles
      this.logger.warn('⚠️ No hay programas disponibles para esta facultad')
      this.state.setFieldVisibility(Constants.FIELDS.PROGRAM, false)
    } else {
      // Múltiples programas: mostrar select normalmente
      this.Ui.populateSelect({
        selector: Constants.SELECTORS.PROGRAM,
        options: filteredPrograms
      })

      this.state.setFieldVisibility(Constants.FIELDS.PROGRAM, true)
      this.logger.info(`📋 Select de programas con ${filteredPrograms.length} opciones`)
    }
  }

  /**
   * Cargar períodos de admisión para un nivel académico
   * @private
   * @param {string} academicLevel - Código del nivel académico
   * @param {boolean} forceShow - Forzar mostrar el campo (para programa único)
   */
  _loadPeriodsForLevel(academicLevel, forceShow = false) {
    const periods = this.Data.getPeriods(academicLevel)

    if (!periods || periods.length === 0) {
      this.logger.warn('⚠️ No hay períodos de admisión disponibles para este nivel académico')
      this.state.setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, false)
      return
    }

    this.logger.info(`📅 Cargando ${periods.length} períodos de admisión${forceShow ? ' (forzado por programa único)' : ''}`)

    this.Ui.populateSelect({
      selector: Constants.SELECTORS.ADMISSION_PERIOD,
      options: periods.map(period => ({
        value: period.codigo,
        text: period.nombre
      }))
    })

    // Asegurar que el campo sea visible en el estado
    this.state.setFieldVisibility(Constants.FIELDS.ADMISSION_PERIOD, true)

    // Asegurar que el elemento sea visible en la UI
    const periodElement = this.Ui.scopedQuery(Constants.SELECTORS.ADMISSION_PERIOD)
    if (periodElement) {
      // Forzar visibilidad si viene de programa único
      if (forceShow) {
        periodElement.style.display = 'block'
        periodElement.classList.remove('hidden')
      }
      this.Ui.showElement(periodElement)
      this.logger.info(`👁️ Campo período de admisión mostrado con ${periods.length} opciones`)
    } else {
      this.logger.warn('⚠️ No se encontró el elemento período de admisión en el DOM')
    }
  }

  // ===============================
  // MÉTODOS PÚBLICOS - UTILIDADES
  // ===============================

  /**
   * Obtener estado actual de campos académicos
   */
  getAcademicState() {
    return {
      typeAttendee: this.state.getField(Constants.FIELDS.TYPE_ATTENDEE),
      academicLevel: this.state.getField(Constants.FIELDS.ACADEMIC_LEVEL),
      faculty: this.state.getField(Constants.FIELDS.FACULTY),
      program: this.state.getField(Constants.FIELDS.PROGRAM),
      admissionPeriod: this.state.getField(Constants.FIELDS.ADMISSION_PERIOD)
    }
  }

  /**
   * Resetear todos los campos académicos
   */
  resetAcademicFields() {
    this.logger.info('🔄 Reseteando campos académicos')

    const academicFields = [
      Constants.FIELDS.ACADEMIC_LEVEL,
      Constants.FIELDS.FACULTY,
      Constants.FIELDS.PROGRAM,
      Constants.FIELDS.ADMISSION_PERIOD
    ]

    academicFields.forEach(field => {
      this.state.updateField(field, '')
      this.state.setFieldVisibility(field, false)
      this.state.clearValidationError(field)
    })

    // Ocultar texto informativo
    this._hideAcademicInfoText()

    this._hideAcademicFields()
  }

  // ===============================
  // MÉTODOS DE FILTRADO POR CONFIGURACIÓN
  // ===============================

  /**
   * Obtener niveles académicos filtrados por configuración
   */
  getFilteredAcademicLevels() {
    const allLevels = this.Data.getAcademicLevels()

    if (!this.config) {
      return allLevels
    }

    const configLevels = this.config.get('academicLevels')
    const configFaculties = this.config.get('faculties')
    const configPrograms = this.config.get('programs')

    // Si hay niveles específicos en configuración, filtrar por esos
    if (configLevels && configLevels.length > 0) {
      const filteredByConfig = allLevels.filter(level => configLevels.some(configLevel => configLevel.code === level.code))
      this.logger.info(`🎓 Niveles filtrados por configuración: ${filteredByConfig.map(l => l.name).join(', ')}`)
      return filteredByConfig
    }

    // Si hay facultades o programas específicos, filtrar niveles que tengan contenido válido
    if ((configFaculties && configFaculties.length > 0) || (configPrograms && configPrograms.length > 0)) {
      const filteredLevels = allLevels.filter(level => this.levelHasValidContent(level.code, configFaculties, configPrograms))
      this.logger.info(`🎓 Niveles filtrados por contenido: ${filteredLevels.map(l => l.name).join(', ')}`)
      return filteredLevels
    }

    this.logger.info(`🎓 Mostrando todos los niveles académicos disponibles`)
    return allLevels
  }

  /**
   * Obtener facultades filtradas por configuración
   */
  getFilteredFaculties(academicLevel) {
    const allFaculties = this.Data.getFaculties(academicLevel)

    if (!this.config) {
      return allFaculties.map(faculty => ({ value: faculty, text: faculty }))
    }

    const configFaculties = this.config.get('faculties')
    const configPrograms = this.config.get('programs')

    // Si hay programas específicos, obtener facultades de esos programas
    if (configPrograms && configPrograms.length > 0) {
      const facultiesFromPrograms = this.getFacultiesFromPrograms(academicLevel, configPrograms)

      // Enriquecer el texto de las facultades que tienen un solo programa
      const enrichedFaculties = facultiesFromPrograms.map(faculty => {
        const facultyPrograms = this.getFilteredPrograms(academicLevel, faculty.value)

        if (facultyPrograms.length === 1) {
          // Una sola programa: mostrar "Facultad - Programa" en el texto
          return {
            value: faculty.value, // IMPORTANTE: mantener solo el valor de la facultad
            text: `${faculty.text} - ${facultyPrograms[0].text}`, // UI enriquecida
            singleProgram: facultyPrograms[0] // Metadata para auto-selección
          }
        } else {
          // Múltiples programas: mantener texto original
          return faculty
        }
      })

      this.logger.info(`🏛️ Facultades desde programas configurados (enriquecidas): ${enrichedFaculties.map(f => f.text).join(', ')}`)
      return enrichedFaculties
    }

    // Si hay facultades específicas en configuración, filtrar por esas
    if (configFaculties && configFaculties.length > 0) {
      const filteredFaculties = allFaculties
        .filter(faculty => configFaculties.includes(faculty))
        .map(faculty => ({ value: faculty, text: faculty }))
      this.logger.info(`🏛️ Facultades filtradas por configuración: ${filteredFaculties.map(f => f.text).join(', ')}`)
      return filteredFaculties
    }

    this.logger.info(`🏛️ Mostrando todas las facultades para nivel ${academicLevel}`)
    return allFaculties.map(faculty => ({ value: faculty, text: faculty }))
  }

  /**
   * Obtener programas filtrados por configuración
   */
  getFilteredPrograms(academicLevel, faculty) {
    const allPrograms = this.Data.getPrograms(academicLevel, faculty)

    if (!this.config) {
      return allPrograms.map(program => ({
        value: program.Codigo || program.codigo,
        text: program.Nombre || program.nombre
      }))
    }

    const configPrograms = this.config.get('programs')

    // Si hay programas específicos en configuración, filtrar por esos
    if (configPrograms && configPrograms.length > 0) {
      const filteredPrograms = allPrograms
        .filter(program => {
          const programCode = program.Codigo || program.codigo
          return configPrograms.includes(programCode)
        })
        .map(program => ({
          value: program.Codigo || program.codigo,
          text: program.Nombre || program.nombre
        }))

      this.logger.info(`📚 Programas filtrados por configuración: ${filteredPrograms.map(p => p.text).join(', ')}`)
      return filteredPrograms
    }

    this.logger.info(`📚 Mostrando todos los programas para ${faculty} en ${academicLevel}`)
    return allPrograms.map(program => ({
      value: program.Codigo || program.codigo,
      text: program.Nombre || program.nombre
    }))
  }

  /**
   * Verificar si un nivel académico tiene contenido válido según la configuración
   */
  levelHasValidContent(levelCode, configFaculties, configPrograms) {
    const allPrograms = this.Data.getAllPrograms()

    if (!allPrograms || !allPrograms[levelCode]) {
      return false
    }

    const levelData = allPrograms[levelCode]

    // Si hay programas específicos configurados, verificar si existen en este nivel
    if (configPrograms && configPrograms.length > 0) {
      return this.levelHasConfiguredPrograms(levelData, configPrograms)
    }

    // Si hay facultades específicas configuradas, verificar si existen en este nivel
    if (configFaculties && configFaculties.length > 0) {
      return this.levelHasConfiguredFaculties(levelData, configFaculties)
    }

    return true
  }

  /**
   * Verificar si un nivel tiene programas configurados
   */
  levelHasConfiguredPrograms(levelData, configPrograms) {
    if (typeof levelData === 'object' && !Array.isArray(levelData)) {
      // Estructura: programs.PREG.FACULTAD.Programas
      for (const facultyCode in levelData) {
        const facultyPrograms = levelData[facultyCode].Programas || []
        if (facultyPrograms.some(program => configPrograms.includes(program.Codigo))) {
          return true
        }
      }
    } else if (Array.isArray(levelData)) {
      // Estructura: array de programas
      return levelData.some(program => configPrograms.includes(program.Codigo || program.codigo))
    }

    return false
  }

  /**
   * Verificar si un nivel tiene facultades configuradas
   */
  levelHasConfiguredFaculties(levelData, configFaculties) {
    if (typeof levelData === 'object' && !Array.isArray(levelData)) {
      // Estructura: programs.PREG.FACULTAD
      return Object.keys(levelData).some(
        facultyCode => configFaculties.includes(facultyCode) || configFaculties.includes(levelData[facultyCode].FacultadCodigo)
      )
    } else if (Array.isArray(levelData)) {
      // Estructura: array de programas con propiedad facultad
      return levelData.some(program => configFaculties.includes(program.facultad))
    }

    return false
  }

  /**
   * Obtener facultades desde programas configurados
   */
  getFacultiesFromPrograms(academicLevel, configPrograms) {
    const allPrograms = this.Data.getAllPrograms()

    if (!allPrograms || !allPrograms[academicLevel]) {
      return []
    }

    const levelData = allPrograms[academicLevel]
    const facultiesSet = new Set()

    if (typeof levelData === 'object' && !Array.isArray(levelData)) {
      // Estructura: programs.PREG.FACULTAD.Programas
      for (const facultyCode in levelData) {
        const facultyPrograms = levelData[facultyCode].Programas || []
        if (facultyPrograms.some(program => configPrograms.includes(program.Codigo))) {
          facultiesSet.add(facultyCode)
        }
      }
    } else if (Array.isArray(levelData)) {
      // Estructura: array de programas con propiedad facultad
      levelData.forEach(program => {
        const programCode = program.Codigo || program.codigo
        if (configPrograms.includes(programCode) && program.facultad) {
          facultiesSet.add(program.facultad)
        }
      })
    }

    return Array.from(facultiesSet).map(faculty => ({ value: faculty, text: faculty }))
  }

  /**
   * Método público para inicializar filtros basados en configuración de programas
   * Esta es la funcionalidad especial solicitada
   */
  initializeFromProgramsConfiguration() {
    if (!this.config) {
      this.logger.warn('No hay configuración disponible para inicializar desde programas')
      return
    }

    const configPrograms = this.config.get('programs')

    if (!configPrograms || configPrograms.length === 0) {
      this.logger.info('No hay programas específicos configurados, usando lógica estándar')
      return
    }

    this.logger.info(`🔧 Inicializando desde programas configurados: ${configPrograms.join(', ')}`)

    // Analizar los programas configurados para determinar niveles y facultades
    const programsAnalysis = this.analyzeProgramsConfiguration(configPrograms)

    this.logger.info(`📊 Análisis de programas:`, programsAnalysis)

    // Aplicar lógica según el análisis
    if (programsAnalysis.levels.length === 1) {
      // Un solo nivel académico
      this.state.updateField(Constants.FIELDS.ACADEMIC_LEVEL, programsAnalysis.levels[0])
      this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, false)
      this.logger.info(`🔧 Nivel académico oculto y preseleccionado: ${programsAnalysis.levels[0]}`)

      if (programsAnalysis.faculties.length === 1) {
        // Una sola facultad
        this.state.updateField(Constants.FIELDS.FACULTY, programsAnalysis.faculties[0])
        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, false)
        this.logger.info(`🔧 Facultad oculta y preseleccionada: ${programsAnalysis.faculties[0]}`)
      } else {
        // Múltiples facultades
        this.state.setFieldVisibility(Constants.FIELDS.FACULTY, true)
        this.logger.info(`📋 Facultades visibles para selección múltiple`)
      }
    } else {
      // Múltiples niveles académicos
      this.state.setFieldVisibility(Constants.FIELDS.ACADEMIC_LEVEL, true)
      this.logger.info(`📋 Niveles académicos visibles para selección múltiple`)
    }
  }

  /**
   * Analizar configuración de programas para determinar niveles y facultades
   */
  analyzeProgramsConfiguration(configPrograms) {
    const allPrograms = this.Data.getAllPrograms()
    const levels = new Set()
    const faculties = new Set()
    const programDetails = []

    configPrograms.forEach(programCode => {
      const programDetail = this.Data.findProgramByCode(programCode)
      if (programDetail) {
        levels.add(programDetail.nivel_academico)
        faculties.add(programDetail.facultad)
        programDetails.push(programDetail)
      }
    })

    return {
      levels: Array.from(levels),
      faculties: Array.from(faculties),
      programs: programDetails
    }
  }
}
