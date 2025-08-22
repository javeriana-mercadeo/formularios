/**
 * College - Módulo especializado para gestión del campo colegio
 * Maneja la lógica de filtrado y población de colegios con múltiples criterios
 * Usa Tom Select para optimización de listas grandes
 * @version 4.0
 */

import { Constants } from './Constants.js'
import { TomSelect } from './TomSelect.js'

export class College {
  constructor(Data, Ui, state, logger = null, config = null) {
    this.Data = Data
    this.Ui = Ui
    this.state = state
    this.logger = logger
    this.config = config
    this.tomSelectInstance = null

    // Inicializar módulo TomSelect
    this.tomSelect = new TomSelect(logger)
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar campo de colegio
   */
  initializeCollegeField() {
    this.logger.info('🏫 🚀 Iniciando inicialización del campo colegio...')

    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (!collegeElement) {
      this.logger.warn(`❌ Campo colegio no encontrado. Selector usado: ${Constants.SELECTORS.COLLEGE}`)
      return
    }

    this.logger.info('✅ Campo colegio encontrado en el DOM')

    // Configurar listener para cambios en tipo de asistente
    this._setupTypeAttendeeListener()

    // Verificar inicialmente si debe mostrar el campo
    this._checkAndToggleCollegeVisibility()
  }

  /**
   * Obtener colegios filtrados basados en la configuración
   * @returns {Array} - Array de colegios filtrados
   */
  getFilteredColleges() {
    this.logger.info('🏫 🔍 Iniciando getFilteredColleges()')

    const collegeRawData = this.Data.data.college
    this.logger.info('🏫 📊 Datos raw de colegios:', collegeRawData)

    // Los datos de colegios vienen en formato {cuentasInstitucionales: [...]}
    const collegeData = collegeRawData?.cuentasInstitucionales

    this.logger.info('🏫 📊 Estado de datos de colegios:', {
      rawExists: !!collegeRawData,
      dataExists: !!collegeData,
      isArray: Array.isArray(collegeData),
      length: collegeData ? collegeData.length : 0,
      firstItem: collegeData && collegeData[0] ? collegeData[0] : null
    })

    if (!collegeData || !Array.isArray(collegeData)) {
      this.logger.warn('⚠️ Datos de colegios no disponibles o inválidos en cuentasInstitucionales')
      return []
    }

    const config = this.config?.school || {}
    this.logger.info(`🏫 Procesando ${collegeData.length} colegios con filtros:`, config)

    // Aplicar filtros secuencialmente
    let filteredColleges = collegeData

    // 1. Filtro por nombres (si hay configuración específica de colegios)
    if (config.schools && Array.isArray(config.schools)) {
      filteredColleges = this._applyNameFilters(filteredColleges, config.schools)
    }

    // 2. Filtro por ciudad (usando citySchool para evitar conflictos)
    if (config.citySchool) {
      filteredColleges = this._applyCityFilters(filteredColleges, config.citySchool)
    }

    // 3. Filtro por calendario (usando calendarSchool)
    if (config.calendarSchool) {
      filteredColleges = this._applyCalendarFilters(filteredColleges, config.calendarSchool)
    }

    this.logger.info(`🏫 Resultado final: ${filteredColleges.length} colegios después de aplicar filtros`)
    return filteredColleges
  }

  // ===============================
  // MÉTODOS PRIVADOS - CONFIGURACIÓN
  // ===============================

  /**
   * Configurar campo de colegios con datos
   * @private
   */
  async _populateCollegeField() {
    this.logger.info('🏫 🔄 Iniciando población del campo colegio...')
    try {
      const filteredColleges = this.getFilteredColleges()
      this.logger.info(`🏫 📊 Colegios filtrados obtenidos: ${filteredColleges.length}`)

      if (filteredColleges.length === 0) {
        this.logger.warn('⚠️ No se encontraron colegios que coincidan con los filtros')
        this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false)
        return
      }

      // Transformar colegios a formato de opciones y eliminar duplicados
      const collegeOptions = filteredColleges.map(college => ({
        value: college.NAME,
        text: college.NAME,
        data: college
      }))

      // Eliminar duplicados por nombre
      const uniqueOptions = collegeOptions.filter((option, index, self) => index === self.findIndex(o => o.value === option.value))

      // Ordenar alfabéticamente
      uniqueOptions.sort((a, b) => a.text.localeCompare(b.text))

      // Guardar todas las opciones para scroll infinito
      this.allCollegeOptions = uniqueOptions
      this.logger.info(`🏫 💾 Guardadas ${uniqueOptions.length} opciones en allCollegeOptions`)
      this.logger.info(
        `🏫 📋 Muestra de colegios:`,
        uniqueOptions.slice(0, 5).map(o => o.text)
      )

      const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
      if (!collegeElement) {
        this.logger.error('❌ Elemento de colegio no encontrado')
        return
      }

      // Usar el módulo TomSelect reutilizable
      this.logger.info(`🏫 Configurando TomSelect para ${uniqueOptions.length} colegios`)
      await this._setupTomSelectModular(collegeElement, uniqueOptions)

      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, true)
      this._showCollegeFieldInDOM()
      this.logger.info(`🏫 Campo colegios configurado con TomSelect modular (${uniqueOptions.length} opciones)`)
    } catch (error) {
      this.logger.error(`❌ Error configurando campo colegios: ${error.message}`)
      this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false)
    }
  }

  /**
   * Aplicar filtros por nombre de colegio
   * @private
   */
  _applyNameFilters(colleges, configSchools) {
    if (!configSchools || !Array.isArray(configSchools) || configSchools.length === 0) {
      return colleges
    }

    const filteredColleges = []

    configSchools.forEach(configName => {
      const matchedColleges = colleges.filter(college => this._matchCollegeName(college.NAME, configName))

      if (matchedColleges.length > 0) {
        filteredColleges.push(...matchedColleges)
      } else {
        this.logger.warn(`⚠️ Colegio no encontrado en JSON: "${configName}"`)
      }
    })

    const uniqueColleges = filteredColleges.filter((college, index, self) => index === self.findIndex(c => c.ID === college.ID))

    this.logger.info(`🏫 Filtro por nombres: ${uniqueColleges.length} colegios encontrados`)
    return uniqueColleges
  }

  /**
   * Aplicar filtros por ciudad para colegios
   * @private
   */
  _applyCityFilters(colleges, configCities) {
    if (!configCities) {
      return colleges
    }

    const cities = Array.isArray(configCities) ? configCities : [configCities]

    if (cities.length === 0) {
      return colleges
    }

    const filteredColleges = colleges.filter(college => {
      const collegeCity = college.SHIPPINGCITY || ''
      return cities.some(city => this._matchCityName(collegeCity, city))
    })

    this.logger.info(`🏫 Filtro por ciudades [${cities.join(', ')}]: ${filteredColleges.length} colegios encontrados`)
    return filteredColleges
  }

  /**
   * Aplicar filtros por calendario para colegios
   * @private
   */
  _applyCalendarFilters(colleges, configCalendars) {
    if (!configCalendars) {
      return colleges
    }

    const calendars = Array.isArray(configCalendars) ? configCalendars : [configCalendars]

    if (calendars.length === 0) {
      return colleges
    }

    const filteredColleges = colleges.filter(college => {
      const collegeCalendar = college.PUJ_CALENDAR__C || ''
      return calendars.some(calendar => this._matchCalendarType(collegeCalendar, calendar))
    })

    this.logger.info(`🏫 Filtro por calendarios [${calendars.join(', ')}]: ${filteredColleges.length} colegios encontrados`)
    return filteredColleges
  }

  /**
   * Configurar Tom Select con scroll infinito
   * @private
   */
  _setupTomSelectWithInfiniteScroll(selectElement) {
    if (!selectElement) {
      this.logger.error('❌ Tom Select requiere un elemento <select>')
      return
    }

    // Limpiar el select (sin poblar opciones - se cargarán dinámicamente)
    selectElement.innerHTML = ''
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.textContent = 'Busca tu colegio...'
    selectElement.appendChild(emptyOption)

    // Cargar Tom Select dinámicamente
    this._loadTomSelect()
      .then(() => {
        this._initializeTomSelectWithInfiniteScroll(selectElement)
      })
      .catch(error => {
        this.logger.error('❌ Error cargando Tom Select:', error)
      })
  }

  /**
   * Configurar Tom Select para campo de colegio (método legacy)
   * @private
   */
  _setupTomSelectCollegeField(selectElement, options) {
    if (!selectElement) {
      this.logger.error('❌ Tom Select requiere un elemento <select>')
      return
    }

    // Limpiar el select y poblar con opciones
    this._populateSelectForTomSelect(selectElement, options)

    // Cargar Tom Select dinámicamente
    this._loadTomSelect()
      .then(() => {
        this._initializeTomSelect(selectElement, options)
      })
      .catch(error => {
        this.logger.error('❌ Error cargando Tom Select:', error)
      })
  }

  /**
   * Cargar Tom Select dinámicamente
   * @private
   */
  async _loadTomSelect() {
    this.logger.info('🔄 Iniciando carga de Tom Select...')

    // Verificar si Tom Select ya está cargado
    if (window.TomSelect) {
      this.logger.info('✅ Tom Select ya está disponible')
      return Promise.resolve()
    }

    // Cargar CSS
    this.logger.info('📄 Cargando CSS de Tom Select...')
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/css/tom-select.css'
    document.head.appendChild(cssLink)

    // Cargar JS
    this.logger.info('📜 Cargando JavaScript de Tom Select...')
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/js/tom-select.complete.min.js'
      script.onload = () => {
        this.logger.info('✅ Tom Select cargado exitosamente')
        resolve()
      }
      script.onerror = error => {
        this.logger.error('❌ Error cargando Tom Select:', error)
        reject(error)
      }
      document.head.appendChild(script)
    })
  }

  /**
   * Poblar select con opciones para Tom Select
   * @private
   */
  _populateSelectForTomSelect(selectElement, options) {
    // Limpiar opciones existentes
    selectElement.innerHTML = ''

    // Agregar opción vacía
    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    emptyOption.textContent = 'Selecciona tu colegio...'
    selectElement.appendChild(emptyOption)

    // Agregar todas las opciones
    options.forEach(option => {
      const optElement = document.createElement('option')
      optElement.value = option.value
      optElement.textContent = option.text
      selectElement.appendChild(optElement)
    })

    this.logger.info(`🏫 Select poblado con ${options.length} opciones de colegios`)
  }

  /**
   * Inicializar Tom Select
   * @private
   */
  _initializeTomSelect(selectElement, options) {
    try {
      // Destruir instancia existente si la hay
      if (this.tomSelectInstance) {
        this.tomSelectInstance.destroy()
        this.tomSelectInstance = null
      }

      // Marcar el campo como requerido para validación
      selectElement.setAttribute('required', 'required')
      selectElement.setAttribute('data-validation', 'required')

      // Configuración de Tom Select
      const config = {
        // Permitir búsqueda
        searchField: ['text'],

        // Configuración de búsqueda
        score: function (search) {
          const score = this.getScoreFunction(search)
          return function (item) {
            return score(item) * (1 + Math.min(item.text.toLowerCase().indexOf(search.toLowerCase()), 1))
          }
        },

        // Placeholder
        placeholder: 'Busca tu colegio...',

        // Permitir selección vacía
        allowEmptyOption: true,

        // Sin creación de nuevas opciones
        create: false,

        // Cargar todas las opciones
        load: null,

        // Configuración de render
        render: {
          option: function (data, escape) {
            return '<div class="college-option">' + '<span class="college-name">' + escape(data.text) + '</span>' + '</div>'
          },
          item: function (data, escape) {
            return '<div class="college-selected">' + escape(data.text) + '</div>'
          },
          no_results: function (data, escape) {
            return '<div class="no-results">No se encontraron colegios</div>'
          }
        }
      }

      // Inicializar Tom Select
      this.tomSelectInstance = new TomSelect(selectElement, config)

      // Configurar eventos
      this._setupTomSelectEvents()

      // Asegurar que el select original mantenga el valor para validación
      this._syncSelectValue()

      this.logger.info(`🏫 Tom Select inicializado con ${options.length} opciones de colegios (campo obligatorio)`)
    } catch (error) {
      this.logger.error('❌ Error inicializando Tom Select:', error)
    }
  }

  /**
   * Configurar eventos de Tom Select
   * @private
   */
  _setupTomSelectEvents() {
    if (!this.tomSelectInstance) return

    // Evento cuando se selecciona un colegio
    this.tomSelectInstance.on('change', value => {
      this.logger.info(`🏫 Colegio seleccionado: ${value}`)

      // Sincronizar valor con el select original para validación
      this._syncSelectValue()

      // Limpiar errores de validación si existe una selección
      if (value) {
        this._clearValidationErrors()
      }
    })

    // Evento cuando se limpia la selección
    this.tomSelectInstance.on('clear', () => {
      this.logger.info('🏫 Selección de colegio limpiada')
      this._syncSelectValue()
    })
  }

  /**
   * Sincronizar valor entre Tom Select y el select original
   * @private
   */
  _syncSelectValue() {
    if (!this.tomSelectInstance) return

    const selectElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (selectElement) {
      const tomSelectValue = this.tomSelectInstance.getValue()
      selectElement.value = tomSelectValue

      // Disparar evento change para que otros sistemas detecten el cambio
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  /**
   * Limpiar errores de validación del campo
   * @private
   */
  _clearValidationErrors() {
    const selectElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (selectElement) {
      // Remover clases de error
      selectElement.classList.remove('error')
      selectElement.parentElement?.classList.remove('error')

      // Remover mensajes de error
      const errorMessage = selectElement.parentElement?.querySelector('.error-message')
      if (errorMessage) {
        errorMessage.remove()
      }

      // Limpiar error de Tom Select wrapper
      const tsWrapper = selectElement.parentElement?.querySelector('.ts-wrapper')
      if (tsWrapper) {
        tsWrapper.classList.remove('error')
      }
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - MATCHING
  // ===============================

  /**
   * Hacer matching entre nombres de colegios
   * @private
   */
  _matchCollegeName(jsonName, configName) {
    if (!jsonName || !configName) return false

    const normalizeText = text => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .trim()
    }

    const jsonNormalized = normalizeText(jsonName)
    const configNormalized = normalizeText(configName)

    // Matching exacto
    if (jsonNormalized === configNormalized) {
      return true
    }

    // Matching por inclusión (útil para abreviaciones)
    if (jsonNormalized.includes(configNormalized) || configNormalized.includes(jsonNormalized)) {
      return true
    }

    // Matching por palabras clave
    const jsonWords = jsonNormalized.split(/\s+/)
    const configWords = configNormalized.split(/\s+/)

    const commonWords = jsonWords.filter(word => configWords.some(configWord => word.includes(configWord) || configWord.includes(word)))

    return commonWords.length >= Math.min(2, Math.min(jsonWords.length, configWords.length))
  }

  /**
   * Hacer matching entre nombres de ciudades
   * @private
   */
  _matchCityName(jsonCity, configCity) {
    if (!jsonCity || !configCity) return false

    const normalizeCity = city => {
      return city
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .trim()
    }

    const jsonNormalized = normalizeCity(jsonCity)
    const configNormalized = normalizeCity(configCity)

    return jsonNormalized === configNormalized || jsonNormalized.includes(configNormalized) || configNormalized.includes(jsonNormalized)
  }

  /**
   * Hacer matching entre tipos de calendario
   * @private
   */
  _matchCalendarType(jsonCalendar, configCalendar) {
    if (!jsonCalendar || !configCalendar) return false

    const normalizeCalendar = calendar => {
      return calendar
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
    }

    const jsonNormalized = normalizeCalendar(jsonCalendar)
    const configNormalized = normalizeCalendar(configCalendar)

    return jsonNormalized === configNormalized || jsonNormalized.includes(configNormalized) || configNormalized.includes(jsonNormalized)
  }

  // ===============================
  // MÉTODOS PRIVADOS - VISIBILIDAD
  // ===============================

  /**
   * Configurar listener para cambios en tipo de asistente
   * @private
   */
  _setupTypeAttendeeListener() {
    this.logger.info('🏫 🎧 Configurando listener para tipo de asistente...')

    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE)
    if (!typeAttendeeElement) {
      this.logger.warn(`❌ Campo tipo de asistente no encontrado. Selector: ${Constants.SELECTORS.TYPE_ATTENDEE}`)
      return
    }

    this.logger.info('✅ Campo tipo de asistente encontrado, agregando listener')

    typeAttendeeElement.addEventListener('change', event => {
      this.logger.info(`🏫 🔄 Cambio detectado en tipo de asistente: "${event.target.value}"`)
      this._checkAndToggleCollegeVisibility()
    })
  }

  /**
   * Verificar y alternar visibilidad del campo colegio
   * @private
   */
  _checkAndToggleCollegeVisibility() {
    this.logger.info('🏫 Verificando visibilidad del campo colegio...')

    const typeAttendeeElement = this.Ui.scopedQuery(Constants.SELECTORS.TYPE_ATTENDEE)
    if (!typeAttendeeElement) {
      this.logger.warn('⚠️ Elemento tipo de asistente no encontrado - mostrando campo colegio por defecto')
      // Si no hay campo tipo de asistente, mostrar colegios por defecto
      this._populateCollegeField().catch(error => {
        this.logger.error('❌ Error poblando colegios:', error)
      })
      return
    }

    const selectedValue = typeAttendeeElement.value
    const shouldShow = selectedValue === 'Aspirante' || selectedValue === 'Docente y/o psicoorientador'

    this.logger.info(`🏫 Tipo de asistente seleccionado: "${selectedValue}" - Mostrar colegio: ${shouldShow}`)

    if (shouldShow) {
      this.logger.info('🏫 Iniciando población del campo colegio...')
      this._populateCollegeField().catch(error => {
        this.logger.error('❌ Error poblando colegios:', error)
      })
    } else if (selectedValue === '') {
      // Si no hay valor seleccionado, mostrar colegios por defecto
      this.logger.info('🏫 No hay tipo de asistente seleccionado - mostrando colegios por defecto')
      this._populateCollegeField().catch(error => {
        this.logger.error('❌ Error poblando colegios:', error)
      })
    } else {
      this.logger.info('🏫 Ocultando campo colegio...')
      this._hideCollegeField()
    }

    this.logger.info(`🏫 Campo colegio ${shouldShow || selectedValue === '' ? 'mostrado' : 'oculto'} para tipo: "${selectedValue}"`)
  }

  /**
   * Ocultar campo de colegio y limpiar Tom Select
   * @private
   */
  _hideCollegeField() {
    this.state.setFieldVisibility(Constants.FIELDS.COLLEGE, false)
    this._hideCollegeFieldInDOM()

    // Destruir usando el módulo TomSelect
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (collegeElement) {
      const instanceKey = collegeElement.name || collegeElement.id
      this.tomSelect.destroy(instanceKey)
    }

    this.tomSelectInstance = null
    this.logger.info('🏫 TomSelect destruido')
  }

  /**
   * Validar campo de colegio usando TomSelect
   * @returns {boolean} - True si es válido
   */
  validateField() {
    try {
      const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
      if (!collegeElement) return true

      const instanceKey = collegeElement.name || collegeElement.id || 'college'
      return this.tomSelect.validateField(instanceKey)
    } catch (error) {
      this.logger?.warn('⚠️ Error validando campo colegio:', error)
      return true
    }
  }

  /**
   * Mostrar campo colegio en el DOM
   * @private
   */
  _showCollegeFieldInDOM() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (!collegeElement) return

    // Mostrar el campo y su contenedor
    const fieldContainer = collegeElement.closest('.field') || collegeElement.parentElement
    if (fieldContainer) {
      fieldContainer.style.display = ''
      fieldContainer.classList.remove('hidden')
    }

    collegeElement.style.display = ''
    collegeElement.removeAttribute('disabled')
    collegeElement.setAttribute('required', 'required')

    this.logger.info('🏫 Campo colegio mostrado en DOM')
  }

  /**
   * Ocultar campo colegio en el DOM
   * @private
   */
  _hideCollegeFieldInDOM() {
    const collegeElement = this.Ui.scopedQuery(Constants.SELECTORS.COLLEGE)
    if (!collegeElement) return

    // Ocultar el campo y su contenedor
    const fieldContainer = collegeElement.closest('.field') || collegeElement.parentElement
    if (fieldContainer) {
      fieldContainer.style.display = 'none'
      fieldContainer.classList.add('hidden')
    }

    collegeElement.style.display = 'none'
    collegeElement.setAttribute('disabled', 'disabled')
    collegeElement.removeAttribute('required')
    collegeElement.value = ''

    this.logger.info('🏫 Campo colegio ocultado en DOM')
  }

  // ===============================
  // MÉTODOS PRIVADOS - TOMSELECT MODULAR
  // ===============================

  /**
   * Configurar TomSelect usando el módulo reutilizable
   * @private
   */
  async _setupTomSelectModular(selectElement, options) {
    try {
      this.logger.info(`🎯 Configurando TomSelect modular con ${options.length} opciones`)

      // Configuración específica para colegios
      const config = {
        placeholder: 'Busca tu colegio...',
        required: true,
        searchEnabled: true,
        clearable: true,
        closeAfterSelect: true,
        maxItems: 1
      }

      // Inicializar TomSelect
      const instance = await this.tomSelect.initialize(selectElement, options, config)

      // Guardar referencia
      this.tomSelectInstance = instance

      // Configurar eventos adicionales específicos para colegios
      instance.on('change', value => {
        this.logger.info(`🏫 Colegio seleccionado: ${value}`)
        this._syncSelectValue()
        if (value) {
          this._clearValidationErrors()
        }
      })

      instance.on('clear', () => {
        this.logger.info('🏫 Selección de colegio limpiada')
        this._syncSelectValue()
      })

      this.logger.info('✅ TomSelect modular configurado correctamente')
    } catch (error) {
      this.logger.error('❌ Error configurando TomSelect modular:', error)
      throw error
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS - SCROLL INFINITO (LEGACY)
  // ===============================

  /**
   * Inicializar Tom Select con scroll infinito - VERSIÓN SIMPLE
   * @private
   */
  _initializeTomSelectWithInfiniteScroll(selectElement) {
    try {
      // Destruir instancia existente si la hay
      if (this.tomSelectInstance) {
        this.tomSelectInstance.destroy()
        this.tomSelectInstance = null
      }

      this.logger.info(`🏫 🚀 Inicializando Tom Select SIMPLE con ${this.allCollegeOptions.length} colegios`)

      // Variables de paginación
      this.currentPage = 0
      this.itemsPerPage = 50
      this.isLoading = false

      // Marcar el campo como requerido
      selectElement.setAttribute('required', 'required')
      selectElement.setAttribute('data-validation', 'required')

      // Configuración SIMPLE de Tom Select
      const config = {
        valueField: 'value',
        labelField: 'text',
        searchField: 'text',
        placeholder: 'Busca tu colegio...',

        // Función de carga - SIMPLE
        load: (query, callback) => {
          this.logger.info(`🏫 📞 load() llamado con query: "${query}"`)
          this._simpleLoad(query, callback)
        },

        render: {
          option: function (data, escape) {
            return '<div>' + escape(data.text) + '</div>'
          },
          item: function (data, escape) {
            return '<div>' + escape(data.text) + '</div>'
          },
          loading: function () {
            return '<div class="loading">Cargando...</div>'
          }
        },

        // Configuración básica
        create: false,
        maxOptions: 50 // Límite inicial
      }

      // Inicializar Tom Select
      this.tomSelectInstance = new TomSelect(selectElement, config)

      // Configurar eventos básicos
      this.tomSelectInstance.on('change', value => {
        this.logger.info(`🏫 ✅ Seleccionado: ${value}`)
        this._syncSelectValue()
        if (value) this._clearValidationErrors()
      })

      // FORZAR carga inicial
      setTimeout(() => {
        this.logger.info('🏫 🔄 FORZANDO carga inicial...')
        this.tomSelectInstance.load('')
      }, 100)

      this.logger.info('🏫 ✅ Tom Select inicializado')
    } catch (error) {
      this.logger.error('❌ Error inicializando Tom Select:', error)
    }
  }

  /**
   * Método de carga SIMPLE para Tom Select
   * @private
   */
  _simpleLoad(query, callback) {
    try {
      this.logger.info(`🏫 📥 _simpleLoad ejecutándose - query: "${query}", página: ${this.currentPage}`)

      if (this.isLoading) {
        this.logger.info('🏫 ⏳ Ya cargando, saltando...')
        return
      }

      this.isLoading = true

      // Simular un pequeño delay
      setTimeout(() => {
        let allOptions = this.allCollegeOptions || []
        this.logger.info(`🏫 📊 Total colegios disponibles: ${allOptions.length}`)

        let filteredOptions = allOptions

        // Filtrar por búsqueda si hay query
        if (query && query.trim().length > 0) {
          const queryLower = query.trim().toLowerCase()
          filteredOptions = allOptions.filter(option => option.text.toLowerCase().includes(queryLower))
          this.logger.info(`🏫 🔍 Filtrado por "${query}": ${filteredOptions.length} resultados`)

          // Reset página para nueva búsqueda
          this.currentPage = 0
        }

        // Paginación simple
        const start = this.currentPage * this.itemsPerPage
        const end = start + this.itemsPerPage
        const pageResults = filteredOptions.slice(start, end)

        this.logger.info(`🏫 📄 Página ${this.currentPage}: ${start}-${end}, devolviendo ${pageResults.length} elementos`)
        this.logger.info(
          `🏫 📋 Primeros elementos:`,
          pageResults.slice(0, 3).map(o => o.text)
        )

        this.isLoading = false

        // Devolver resultados
        callback(pageResults)
      }, 50)
    } catch (error) {
      this.logger.error('❌ Error en _simpleLoad:', error)
      this.isLoading = false
      callback([])
    }
  }

  /**
   * Cargar opciones de colegios con el patrón correcto de Tom Select
   * @private
   */
  _loadCollegeOptionsCorrect(query, callback) {
    try {
      this.logger.info(`🏫 📄 Cargando opciones para query: "${query}"`)

      // Si estamos cargando, no hacer nada
      if (this.isLoading) {
        this.logger.info('🏫 ⏳ Ya está cargando, saltando...')
        return
      }

      this.isLoading = true

      // Simular delay para mostrar loading (opcional)
      setTimeout(() => {
        let filteredOptions = this.allCollegeOptions

        // Aplicar filtro de búsqueda si hay query
        if (query && query.length > 0) {
          const queryLower = query.toLowerCase()
          filteredOptions = this.allCollegeOptions.filter(option => option.text.toLowerCase().includes(queryLower))
          this.logger.info(`🏫 🔍 Filtrados por búsqueda: ${filteredOptions.length} colegios`)

          // Resetear paginación para nueva búsqueda
          this.currentPage = 0
        }

        // Calcular paginación
        const startIndex = this.currentPage * this.itemsPerPage
        const endIndex = startIndex + this.itemsPerPage
        const pageOptions = filteredOptions.slice(startIndex, endIndex)

        this.logger.info(`🏫 📄 Cargando página ${this.currentPage}: ${startIndex}-${endIndex} (${pageOptions.length} elementos)`)

        // Actualizar estado
        this.hasMore = endIndex < filteredOptions.length
        this.isLoading = false

        // Retornar opciones vía callback
        callback(pageOptions)
      }, 100) // Pequeño delay para UX
    } catch (error) {
      this.logger.error('❌ Error cargando opciones de colegios:', error)
      this.isLoading = false
      callback([])
    }
  }

  /**
   * Cargar opciones de colegios de manera diferida (método legacy)
   * @private
   */
  _loadCollegeOptions(query, callback) {
    try {
      this.logger.info(`🏫 📄 Cargando opciones para query: "${query}" (página ${this.currentPage})`)

      let filteredOptions = this.allCollegeOptions

      // Aplicar filtro de búsqueda si hay query
      if (query && query.length > 0) {
        const queryLower = query.toLowerCase()
        filteredOptions = this.allCollegeOptions.filter(option => option.text.toLowerCase().includes(queryLower))
        this.logger.info(`🏫 🔍 Filtrados por búsqueda: ${filteredOptions.length} colegios`)
      }

      // Calcular paginación
      const startIndex = this.currentPage * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      const pageOptions = filteredOptions.slice(startIndex, endIndex)

      this.logger.info(`🏫 📄 Cargando página ${this.currentPage}: ${startIndex}-${endIndex} (${pageOptions.length} elementos)`)

      // Incrementar página para la próxima carga
      this.currentPage++

      // Retornar opciones vía callback
      callback(pageOptions)
    } catch (error) {
      this.logger.error('❌ Error cargando opciones de colegios:', error)
      callback([])
    }
  }

  /**
   * Configurar eventos de scroll infinito para Tom Select
   * @private
   */
  _setupTomSelectInfiniteScrollEvents() {
    if (!this.tomSelectInstance) return

    // Evento cuando se selecciona un colegio
    this.tomSelectInstance.on('change', value => {
      this.logger.info(`🏫 Colegio seleccionado: ${value}`)
      this._syncSelectValue()
      if (value) {
        this._clearValidationErrors()
      }
    })

    // Evento cuando se limpia la selección
    this.tomSelectInstance.on('clear', () => {
      this.logger.info('🏫 Selección de colegio limpiada')
      this._syncSelectValue()
    })

    // Evento cuando se abre el dropdown
    this.tomSelectInstance.on('dropdown_open', () => {
      this.logger.info('🏫 Dropdown abierto')
      this._setupScrollListener()
    })

    // Evento cuando se cierra el dropdown
    this.tomSelectInstance.on('dropdown_close', () => {
      this.logger.info('🏫 Dropdown cerrado')
      this._removeScrollListener()
    })

    // Evento cuando cambia la búsqueda
    this.tomSelectInstance.on('type', query => {
      // Resetear paginación cuando cambia la búsqueda
      this.currentPage = 0
      this.logger.info(`🏫 🔤 Búsqueda cambiada: "${query}" - reseteando paginación`)
    })
  }

  /**
   * Configurar scroll infinito manualmente
   * @private
   */
  _setupInfiniteScrollManual() {
    // Esperar a que Tom Select esté completamente inicializado
    setTimeout(() => {
      const dropdown = this.tomSelectInstance?.dropdown_content
      if (!dropdown) {
        this.logger.warn('⚠️ Dropdown content no encontrado para scroll infinito')
        return
      }

      this.logger.info('🏫 🎯 Configurando scroll infinito manual')

      const scrollHandler = () => {
        // Verificar si estamos cerca del final del scroll
        const { scrollTop, scrollHeight, clientHeight } = dropdown
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight

        if (scrollPercentage > 0.8 && this.hasMore && !this.isLoading) {
          this.logger.info('🏫 📜 Scroll al 80% - cargando más opciones')

          // Incrementar página
          this.currentPage++

          // Obtener query actual
          const currentQuery = this.tomSelectInstance.input.value || ''

          // Cargar más opciones
          this._loadCollegeOptionsCorrect(currentQuery, newOptions => {
            if (newOptions && newOptions.length > 0) {
              // Agregar nuevas opciones a Tom Select
              newOptions.forEach(option => {
                this.tomSelectInstance.addOption(option)
              })
              this.logger.info(`🏫 ➕ Agregadas ${newOptions.length} opciones más`)
            } else {
              this.hasMore = false
              this.logger.info('🏫 🔚 No hay más opciones para cargar')
            }
          })
        }
      }

      // Agregar listener de scroll
      dropdown.addEventListener('scroll', scrollHandler)

      // Guardar referencia para limpieza
      this.scrollHandler = scrollHandler
      this.dropdownElement = dropdown
    }, 500) // Dar tiempo para que Tom Select se inicialice completamente
  }

  /**
   * Configurar listener de scroll para carga infinita (método legacy)
   * @private
   */
  _setupScrollListener() {
    const dropdown = this.tomSelectInstance.dropdown
    if (!dropdown) return

    this.scrollListener = () => {
      const scrollTop = dropdown.scrollTop
      const scrollHeight = dropdown.scrollHeight
      const clientHeight = dropdown.clientHeight

      // Si está cerca del final (90% del scroll), cargar más opciones
      if (scrollTop + clientHeight >= scrollHeight * 0.9) {
        const currentQuery = this.tomSelectInstance.inputValue || ''
        this.logger.info('🏫 📜 Scroll cerca del final - cargando más opciones')
        this._loadCollegeOptions(currentQuery, newOptions => {
          newOptions.forEach(option => {
            if (!this.loadedItems.has(option.value)) {
              this.tomSelectInstance.addOption(option)
              this.loadedItems.add(option.value)
            }
          })
        })
      }
    }

    dropdown.addEventListener('scroll', this.scrollListener)
  }

  /**
   * Limpiar scroll infinito manual
   * @private
   */
  _cleanupInfiniteScroll() {
    if (this.dropdownElement && this.scrollHandler) {
      this.dropdownElement.removeEventListener('scroll', this.scrollHandler)
      this.scrollHandler = null
      this.dropdownElement = null
      this.logger.info('🏫 🧹 Scroll infinito limpiado')
    }
  }

  /**
   * Remover listener de scroll (método legacy)
   * @private
   */
  _removeScrollListener() {
    const dropdown = this.tomSelectInstance.dropdown
    if (dropdown && this.scrollListener) {
      dropdown.removeEventListener('scroll', this.scrollListener)
      this.scrollListener = null
    }
  }
}
