/**
 * FieldController - Controlador de gestión de campos
 * Maneja visibilidad, estado y comportamiento de campos específicos
 * @version 1.0
 */
import { useFieldStore } from './stores/field-store.js'
import { TomSelectAdapter } from '../../integrations/tom-select/TomSelectAdapter.js'
import { CleaveAdapter } from '../../integrations/cleave/CleaveAdapter.js'
import { Locations } from '../specialized-modules/Locations.js'

export class FieldController {
  constructor(logger, formElement, dataPreloader = null, config = null) {
    this.logger = logger
    this.formElement = formElement
    this.dataPreloader = dataPreloader
    this.config = config
    this.store = useFieldStore

    // Adaptadores
    this.tomSelectAdapter = new TomSelectAdapter(logger)
    this.cleaveAdapter = new CleaveAdapter(logger)

    // Módulos especializados
    this.locations = new Locations(dataPreloader, null, logger, config)

    // Mapa de campos y sus configuraciones
    this.fieldConfig = {
      // Campos académicos
      academic_level: { type: 'select', enhancer: 'tom-select', category: 'academic' },
      faculty: { type: 'select', enhancer: 'tom-select', category: 'faculty' },
      program: { type: 'select', enhancer: 'tom-select', category: 'program' },
      admission_period: { type: 'select', enhancer: 'tom-select', category: 'period' },

      // Campos de asistencia
      type_attendee: { type: 'select', enhancer: 'tom-select', category: 'attendee_type' },
      attendance_day: { type: 'select', enhancer: 'tom-select', category: 'attendance_day' },

      // Campos de documento e identificación
      type_doc: { type: 'select', enhancer: 'tom-select', category: 'document_type' },

      // Campos de ubicación
      country: { type: 'select', enhancer: 'tom-select', category: 'country' },
      state: { type: 'select', enhancer: 'tom-select', category: 'location' },
      department: { type: 'select', enhancer: 'tom-select', category: 'location' },
      city: { type: 'select', enhancer: 'tom-select', category: 'location' },

      // Campos de instituciones
      university: { type: 'select', enhancer: 'tom-select', category: 'university' },
      school: { type: 'select', enhancer: 'tom-select', category: 'college' },
      company: { type: 'select', enhancer: 'tom-select', category: 'company' },

      // Campos de contacto (inputs con máscara)
      document: { type: 'input', enhancer: 'cleave', category: 'document' },
      mobile: { type: 'input', enhancer: 'cleave', category: 'mobile' },
      phone: { type: 'input', enhancer: 'cleave', category: 'phone' },
      phone_code: { type: 'select', enhancer: 'tom-select', category: 'phone_prefix' }
    }
  }

  /**
   * Inicializar todos los campos del formulario
   */
  async initializeAllFields() {
    this.logger?.info('🎯 Inicializando campos del formulario...')

    for (const [fieldName, config] of Object.entries(this.fieldConfig)) {
      const element = this.formElement.querySelector(`[name="${fieldName}"]`)
      if (element) {
        await this.initializeField(fieldName, element, config)
      }
    }

    this.logger?.info('✅ Campos inicializados correctamente')
  }

  /**
   * Inicializar un campo específico
   */
  async initializeField(fieldName, element, config) {
    try {
      if (config.enhancer === 'tom-select' && config.type === 'select') {
        // Cargar datos apropiados según el tipo de campo
        const options = await this._getFieldOptions(fieldName, config.category)

        // Lógica especial para campos de ubicación (cascada)
        if (fieldName === 'department' || fieldName === 'city') {
          // Departamento y ciudad siempre inician ocultos
          this.hideField(fieldName)
          // Inicializar tom-select pero oculto para prepararlo
          await this.tomSelectAdapter.initializeByType(element, [], config.category)
          this.logger?.debug(`🏛️ Campo de ubicación ${fieldName} inicializado (oculto)`)
          return
        }

        // Aplicar lógica de filtrado y auto-ocultar para otros campos
        const shouldShowField = this._shouldShowField(fieldName, options)
        if (!shouldShowField.show) {
          // Ocultar campo y preseleccionar si hay exactamente 1 opción
          this.hideField(fieldName)
          if (shouldShowField.autoSelect && options.length === 1) {
            this.setFieldValue(fieldName, options[0].value)
            this.logger?.debug(`🔧 Campo ${fieldName} auto-seleccionado: ${options[0].text}`)
          }
          return // No inicializar tom-select si está oculto
        }

        await this.tomSelectAdapter.initializeByType(element, options, config.category)
        this.logger?.debug(`🎯 TomSelect inicializado para: ${fieldName} con ${options.length} opciones`)
      }

      if (config.enhancer === 'cleave' && config.type === 'input') {
        this.cleaveAdapter.initializeByType(element, config.category)
        this.logger?.debug(`🎭 Cleave inicializado para: ${fieldName}`)
      }

      // Configurar eventos de campo
      this._setupFieldEvents(fieldName, element)
    } catch (error) {
      this.logger?.error(`Error inicializando campo ${fieldName}:`, error)
    }
  }

  /**
   * Mostrar campo
   */
  showField(fieldName) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      const container = field.closest('.field-container') || field.closest('.form-group')
      if (container) {
        container.style.display = ''
        container.classList.remove('hidden')
        this.store.getState().setFieldVisibility(fieldName, true)
        this.logger?.debug(`👁️ Campo mostrado: ${fieldName}`)
      }
    }
  }

  /**
   * Ocultar campo
   */
  hideField(fieldName) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      const container = field.closest('.field-container') || field.closest('.form-group')
      if (container) {
        container.style.display = 'none'
        container.classList.add('hidden')
        this.store.getState().setFieldVisibility(fieldName, false)
        this.logger?.debug(`🙈 Campo ocultado: ${fieldName}`)
      }
    }
  }

  /**
   * Habilitar campo
   */
  enableField(fieldName) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      field.disabled = false
      field.classList.remove('disabled')
      this.store.getState().setFieldEnabled(fieldName, true)
      this.logger?.debug(`✅ Campo habilitado: ${fieldName}`)
    }
  }

  /**
   * Deshabilitar campo
   */
  disableField(fieldName) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      field.disabled = true
      field.classList.add('disabled')
      this.store.getState().setFieldEnabled(fieldName, false)
      this.logger?.debug(`❌ Campo deshabilitado: ${fieldName}`)
    }
  }

  /**
   * Limpiar campo
   */
  clearField(fieldName) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      if (field.tagName === 'SELECT') {
        field.selectedIndex = 0
        // Si tiene TomSelect, actualizar
        const tomSelectInstance = field.tomselect
        if (tomSelectInstance) {
          tomSelectInstance.clear()
        }
      } else {
        field.value = ''
      }

      this.store.getState().updateFieldValue(fieldName, '')
      this.logger?.debug(`🧹 Campo limpiado: ${fieldName}`)
    }
  }

  /**
   * Establecer valor de campo
   */
  setFieldValue(fieldName, value) {
    const field = this._getFieldElement(fieldName)
    if (field) {
      if (field.tagName === 'SELECT') {
        field.value = value
        // Si tiene TomSelect, actualizar
        const tomSelectInstance = field.tomselect
        if (tomSelectInstance) {
          tomSelectInstance.setValue(value)
        }
      } else {
        field.value = value
      }

      this.store.getState().updateFieldValue(fieldName, value)
      this.logger?.debug(`📝 Valor establecido para ${fieldName}: ${value}`)
    }
  }

  /**
   * Obtener valor de campo
   */
  getFieldValue(fieldName) {
    const field = this._getFieldElement(fieldName)
    return field ? field.value : null
  }

  /**
   * Configurar eventos de campo
   */
  _setupFieldEvents(fieldName, element) {
    // Usar eventos DOM estándar que funcionan tanto para elementos nativos como TomSelect
    element.addEventListener('change', e => {
      const value = e.target.value
      this.store.getState().updateFieldValue(fieldName, value)
      this.logger?.debug(`🔄 Valor cambiado ${fieldName}: ${value}`)

      // Delegar lógica específica de ubicación al módulo Locations
      if (fieldName === 'country') {
        this.locations.handleCountryChange(value)
      }
      if (fieldName === 'state' || fieldName === 'department') {
        this.locations.handleDepartmentChange(value)
      }
    })

    this.logger?.debug(`🎯 Eventos DOM configurados para campo: ${fieldName}`)

    // Evento blur para validación
    element.addEventListener('blur', e => {
      const value = e.target.value
      this.store.getState().markFieldTouched(fieldName)
      this.logger?.debug(`👆 Campo tocado: ${fieldName}`)
    })
  }

  /**
   * Obtener elemento del campo
   */
  _getFieldElement(fieldName) {
    return this.formElement.querySelector(`[name="${fieldName}"]`)
  }

  /**
   * Obtener opciones para un campo específico desde DataPreloader
   */
  async _getFieldOptions(fieldName, category) {
    if (!this.dataPreloader) {
      this.logger?.warn(`DataPreloader no disponible para cargar opciones de ${fieldName}`)
      return []
    }

    try {
      switch (category) {
        case 'phone_prefix':
          const prefixes = await this.dataPreloader.loadPrefixes()
          // Filtrar solo países válidos con datos completos
          return prefixes
            .filter(country => country.nameES && country.phoneCode && country.iso2)
            .map(country => ({
              value: country.iso2,
              text: `${country.nameES} (+${country.phoneCode})`,
              iso2: country.iso2,
              nameES: country.nameES,
              phoneCode: country.phoneCode
            }))

        case 'country':
          const countries = await this.dataPreloader.loadPrefixes() // Usar prefixes que contiene países
          let filteredCountries = countries
            .filter(country => country.nameES && country.iso2)
            .map(country => ({
              value: country.iso2,
              text: country.nameES,
              iso2: country.iso2,
              nameES: country.nameES,
              phoneCode: country.phoneCode
            }))

          // Aplicar filtrado desde configuración
          if (this.config) {
            const configCountries = this.config.get?.('countries') || []
            if (configCountries.length > 0) {
              filteredCountries = filteredCountries.filter(country => configCountries.includes(country.text))
            }
          }

          return filteredCountries

        case 'location':
          if (fieldName === 'state' || fieldName === 'department') {
            const locations = await this.dataPreloader.loadLocations()
            return Object.keys(locations).map(key => ({
              value: key,
              text: locations[key].nombre,
              data: locations[key]
            }))
          }
          if (fieldName === 'city') {
            // Las ciudades se cargan dinámicamente según el estado seleccionado
            return []
          }
          return []

        case 'document_type':
          return [
            { value: 'CC', text: 'Cédula de Ciudadanía' },
            { value: 'CE', text: 'Cédula de Extranjería' },
            { value: 'PA', text: 'Pasaporte' },
            { value: 'TI', text: 'Tarjeta de Identidad' }
          ]

        case 'attendee_type':
          let attendeeOptions = [
            { value: 'aspirante', text: 'Aspirante' },
            { value: 'padre', text: 'Padre de familia' },
            { value: 'docente', text: 'Docente' },
            { value: 'empresa', text: 'Empresa' },
            { value: 'otro', text: 'Otro' }
          ]

          // Aplicar filtrado desde configuración
          if (this.config) {
            const configAttendees = this.config.get?.('typeAttendee') || []
            if (configAttendees.length > 0) {
              attendeeOptions = attendeeOptions.filter(option => configAttendees.includes(option.text))
            }
          }

          return attendeeOptions

        case 'attendance_day':
          let dayOptions = [
            { value: 'viernes', text: 'Viernes' },
            { value: 'sabado', text: 'Sábado' },
            { value: 'ambos', text: 'Ambos días' }
          ]

          // Aplicar filtrado desde configuración
          if (this.config) {
            const configDays = this.config.get?.('attendanceDays') || []
            if (configDays.length > 0) {
              dayOptions = dayOptions.filter(option => configDays.includes(option.text))
            }
          }

          return dayOptions

        case 'academic':
          let academicOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configAcademic = this.config.get?.('academicLevels') || []
            academicOptions = configAcademic.map(level => ({
              value: level.toLowerCase().replace(/\s+/g, '_'),
              text: level
            }))
          }
          return academicOptions

        case 'faculty':
          let facultyOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configFaculties = this.config.get?.('faculties') || []
            facultyOptions = configFaculties.map(faculty => ({
              value: faculty.toLowerCase().replace(/\s+/g, '_'),
              text: faculty
            }))
          }
          return facultyOptions

        case 'program':
          let programOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configPrograms = this.config.get?.('programs') || []
            programOptions = configPrograms.map(program => ({
              value: program.toLowerCase().replace(/\s+/g, '_'),
              text: program
            }))
          }
          return programOptions

        case 'period':
          let periodOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configPeriods = this.config.get?.('periods') || []
            periodOptions = configPeriods.map(period => ({
              value: period.toLowerCase().replace(/\s+/g, '_'),
              text: period
            }))
          }
          return periodOptions

        case 'university':
          let universityOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configUniversities = this.config.get?.('universities') || []
            universityOptions = configUniversities.map(university => ({
              value: university.toLowerCase().replace(/\s+/g, '_'),
              text: university
            }))
          }
          return universityOptions

        case 'college':
          let collegeOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configColleges = this.config.get?.('colleges') || []
            collegeOptions = configColleges.map(college => ({
              value: college.toLowerCase().replace(/\s+/g, '_'),
              text: college
            }))
          }
          return collegeOptions

        case 'company':
          let companyOptions = []
          // Aplicar filtrado desde configuración
          if (this.config) {
            const configCompanies = this.config.get?.('companies') || []
            companyOptions = configCompanies.map(company => ({
              value: company.toLowerCase().replace(/\s+/g, '_'),
              text: company
            }))
          }
          return companyOptions

        default:
          this.logger?.warn(`Categoría desconocida: ${category} para campo ${fieldName}`)
          return []
      }
    } catch (error) {
      this.logger?.error(`Error cargando opciones para ${fieldName}:`, error)
      return []
    }
  }

  /**
   * Determinar si un campo debe mostrarse basado en la configuración
   * Lógica: Si hay 1 elemento se oculta, si hay 2 o más se muestra
   */
  _shouldShowField(fieldName, options) {
    if (!options || options.length === 0) {
      return { show: false, autoSelect: false }
    }

    if (options.length === 1) {
      // Un solo elemento: ocultar campo y auto-seleccionar
      return { show: false, autoSelect: true }
    }

    // Dos o más elementos: mostrar campo
    return { show: true, autoSelect: false }
  }

  /**
   * Destruir todas las instancias
   */
  destroy() {
    this.tomSelectAdapter.destroyAll()
    this.cleaveAdapter.destroyAll()
    this.logger?.info('🗑️ FieldController destruido')
  }
}
