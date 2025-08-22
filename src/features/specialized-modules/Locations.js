/**
 * Locations - Módulo especializado para gestión de campos de ubicación (Modernizado)
 * Maneja toda la lógica relacionada con países, departamentos y ciudades
 * @version 2.0 - Modernizado con TomSelectAdapter y Zustand
 */

import { Constants } from '../../core/Constants.js'
import { TomSelectAdapter } from '../../integrations/tom-select/TomSelectAdapter.js'
import { useFieldStore } from '../field-management/stores/field-store.js'
import { useValidationStore } from '../validation/stores/validation-store.js'

export class Locations {
  constructor(Data, Ui, logger = null, config = null) {
    this.Data = Data
    this.Ui = Ui // Mantener compatibilidad
    this.logger = logger
    this.config = config

    // Stores modernos
    this.fieldStore = useFieldStore
    this.validationStore = useValidationStore

    // Adaptador TomSelect
    this.tomSelectAdapter = new TomSelectAdapter(logger)
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Manejar cambio de país - funcionalidad modernizada
   */
  async handleCountryChange(value) {
    // Evitar procesamiento duplicado
    if (this._lastCountryValue === value) {
      this.logger?.debug(`⏭️ País ${value} ya procesado, saltando...`)
      return
    }
    this._lastCountryValue = value

    this.validationStore.getState().updateField(Constants.FIELDS.COUNTRY, value)
    this.logger?.info(`🌍 País cambiado a: ${value}`)

    // Siempre ocultar ciudad al cambiar país
    this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, false)
    this.validationStore.getState().updateField(Constants.FIELDS.CITY, '')
    this._clearCityOptions()

    if (!value) {
      // Si no hay país seleccionado, ocultar todo
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.DEPARTMENT, false)
      this.validationStore.getState().updateField(Constants.FIELDS.DEPARTMENT, '')
      this._clearDepartmentOptions()
      return
    }

    // Verificar si el país seleccionado tiene departamentos
    const hasDepartments = await this._checkCountryHasDepartments(value)

    if (hasDepartments) {
      this.logger?.info(`🏛️ Cargando departamentos para ${value}`)
      await this._loadDepartmentsForCountry(value)
      // Mostrar departamento después de cargar las opciones
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.DEPARTMENT, true)
    } else {
      this.logger?.info(`🙈 País ${value} no tiene departamentos - ocultando campos`)
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.DEPARTMENT, false)
      this.validationStore.getState().updateField(Constants.FIELDS.DEPARTMENT, '')
      // Limpiar las opciones del tom-select de departamento
      this._clearDepartmentOptions()
    }
  }

  /**
   * Manejar cambio de departamento - funcionalidad modernizada
   */
  async handleDepartmentChange(value) {
    this.validationStore.getState().updateField(Constants.FIELDS.DEPARTMENT, value)
    this.logger?.info(`🏛️ Departamento cambiado a: ${value}`)

    if (value) {
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, true)
      await this._loadCitiesForDepartment(value)
    } else {
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, false)
      this.validationStore.getState().updateField(Constants.FIELDS.CITY, '')
      this._clearCityOptions()
    }
  }

  /**
   * Configurar países iniciales
   */
  async initializeCountries() {
    try {
      this.logger?.info('🌍 Inicializando países...')

      const countries = this.Data.getCountries()

      await this._populateSelectModern({
        fieldName: Constants.FIELDS.COUNTRY,
        selector: Constants.SELECTORS.COUNTRY,
        options: countries.map(country => ({ value: country.code, text: country.name })),
        type: 'location',
        placeholder: 'Selecciona tu país...'
      })

      // Pre-seleccionar país por defecto si existe
      const defaultCountry = this._getInitialCountry()
      if (defaultCountry) {
        this.validationStore.getState().updateField(Constants.FIELDS.COUNTRY, defaultCountry)
        this.handleCountryChange(defaultCountry)
      }
    } catch (error) {
      this.logger?.error('❌ Error inicializando países:', error)
    }
  }

  /**
   * Configurar departamentos colombianos
   */
  async configureDepartments() {
    try {
      this.logger?.info('🏛️ Configurando departamentos...')

      const departments = this.Data.getDepartments()

      await this._populateSelectModern({
        fieldName: Constants.FIELDS.DEPARTMENT,
        selector: Constants.SELECTORS.DEPARTMENT,
        options: departments.map(dept => ({ value: dept.code, text: dept.name })),
        type: 'location',
        placeholder: 'Selecciona tu departamento...'
      })
    } catch (error) {
      this.logger?.error('❌ Error configurando departamentos:', error)
    }
  }

  /**
   * Configurar ciudades para un departamento
   */
  async configureCities(departmentCode) {
    try {
      this.logger?.info(`🏙️ Configurando ciudades para: ${departmentCode}`)

      const cities = this.Data.getCitiesForDepartment(departmentCode)

      if (cities.length === 0) {
        this.logger?.warn(`⚠️ No se encontraron ciudades para: ${departmentCode}`)
        return
      }

      await this._populateSelectModern({
        fieldName: Constants.FIELDS.CITY,
        selector: Constants.SELECTORS.CITY,
        options: cities.map(city => ({ value: city.code, text: city.name })),
        type: 'location',
        placeholder: 'Selecciona tu ciudad...'
      })

      // Mostrar campo ciudad
      this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, true)
    } catch (error) {
      this.logger?.error('❌ Error configurando ciudades:', error)
    }
  }

  /**
   * Obtener configuración de ubicación actual
   */
  getCurrentLocationConfig() {
    return {
      country: this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY),
      department: this.validationStore.getState().getFieldValue(Constants.FIELDS.DEPARTMENT),
      city: this.validationStore.getState().getFieldValue(Constants.FIELDS.CITY),
      isColombiaSelected: this._isColombiaSelected()
    }
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Método modernizado para popular selects usando TomSelectAdapter
   */
  async _populateSelectModern({ fieldName, selector, options, type = 'location', placeholder = null }) {
    try {
      // Obtener elemento del DOM
      const selectElement = document.querySelector(selector)
      if (!selectElement) {
        this.logger?.warn(`⚠️ Elemento no encontrado: ${selector}`)
        return
      }

      // Limpiar opciones existentes
      selectElement.innerHTML = '<option value="">Selecciona...</option>'

      // Agregar nuevas opciones
      options.forEach(option => {
        const optionElement = document.createElement('option')
        optionElement.value = option.value
        optionElement.textContent = option.text
        selectElement.appendChild(optionElement)
      })

      // Actualizar store con opciones
      this.fieldStore.getState().setFieldOptions(fieldName, options)

      // Inicializar con TomSelect si no existe ya
      if (!selectElement.tomselect) {
        const config = placeholder ? { placeholder } : {}
        await this.tomSelectAdapter.initializeByType(selectElement, [], type, config)
      } else {
        // Actualizar instancia existente
        selectElement.tomselect.clearOptions()
        selectElement.tomselect.addOptions(options)
        selectElement.tomselect.refreshOptions()
      }

      this.logger?.debug(`✅ Select de ubicación actualizado: ${fieldName}`)
    } catch (error) {
      this.logger?.error(`❌ Error populando select ${fieldName}:`, error)

      // Fallback: usar método legacy
      this.Ui.populateSelect({
        selector,
        options: options.map(opt => ({ value: opt.value, text: opt.text }))
      })
    }
  }

  /**
   * Mostrar campos específicos de Colombia
   */
  _showColombianLocationFields() {
    this.fieldStore.getState().showLocationFields('Colombia')
    this.logger?.debug('👁️ Campos colombianos mostrados')
  }

  /**
   * Ocultar campos específicos de Colombia
   */
  _hideColombianLocationFields() {
    this.fieldStore.getState().showLocationFields('Other')
    this.logger?.debug('🙈 Campos colombianos ocultados')
  }

  /**
   * Cargar departamentos
   */
  async _loadDepartments() {
    await this.configureDepartments()
  }

  /**
   * Cargar ciudades para un departamento específico
   */
  async _loadCitiesForDepartment(departmentValue) {
    try {
      this.logger?.info(`🏙️ Cargando ciudades para departamento: ${departmentValue}`)

      const cityField = document.querySelector(Constants.SELECTORS.CITY)
      if (!cityField || !this.Data) {
        this.logger?.warn('Campo ciudad o Data no disponible')
        return
      }

      // Obtener el país actualmente seleccionado
      const countryField = document.querySelector(Constants.SELECTORS.COUNTRY)
      if (!countryField) {
        this.logger?.warn('Campo país no encontrado')
        return
      }

      const selectedCountry = countryField.value
      if (!selectedCountry) {
        this.logger?.warn('No hay país seleccionado')
        return
      }

      this.logger?.debug(`🔍 País seleccionado: ${selectedCountry}`)

      const locations = this.Data.getLocations()

      // Buscar el país por diferentes criterios
      let countryData = null

      // Primero mapear ISO2 a clave correcta
      const mappedKey = this._mapCountryCodeToLocationKey(selectedCountry)

      if (locations[mappedKey]) {
        countryData = locations[mappedKey]
      } else {
        const countryKey = Object.keys(locations).find(key => {
          const country = locations[key]
          return country.nombre === selectedCountry
        })

        if (countryKey) {
          countryData = locations[countryKey]
        }
      }

      if (!countryData || !countryData.departamentos) {
        this.logger?.warn(`No se encontró información del país para cargar ciudades`)
        return
      }

      // Buscar el departamento específico
      this.logger?.debug(`🔍 Buscando departamento con código: ${departmentValue}`)
      const department = countryData.departamentos.find(dept => dept.codigo === departmentValue)

      if (!department) {
        this.logger?.warn(`No se encontró departamento con código: ${departmentValue}`)
        this.logger?.debug(
          `Departamentos disponibles:`,
          countryData.departamentos.map(d => d.codigo)
        )
        return
      }

      if (!department.ciudades) {
        this.logger?.warn(`Departamento ${departmentValue} no tiene ciudades`)
        return
      }

      const cityOptions = department.ciudades.map(ciudad => ({
        value: ciudad.codigo,
        text: ciudad.nombre
      }))

      this.logger?.info(`🏙️ Encontradas ${cityOptions.length} ciudades para departamento "${department.nombre}"`)

      // Mostrar las primeras 3 ciudades como ejemplo
      if (cityOptions.length > 0) {
        const firstCities = cityOptions
          .slice(0, 3)
          .map(c => c.text)
          .join(', ')
        const moreText = cityOptions.length > 3 ? ` y ${cityOptions.length - 3} más` : ''
        this.logger?.info(`🏘️ Ciudades: ${firstCities}${moreText}`)
      }

      // Reinicializar tom-select con nuevas opciones
      const tomSelectInstance = cityField.tomselect
      if (tomSelectInstance) {
        tomSelectInstance.clearOptions()
        tomSelectInstance.addOptions(cityOptions)
        tomSelectInstance.refreshOptions()
        this.logger?.info(`✅ ${cityOptions.length} ciudades cargadas en tom-select para "${department.nombre}"`)
      } else {
        this.logger?.error(`❌ Tom-select no encontrado para campo ciudad`)
      }
    } catch (error) {
      this.logger?.error('Error cargando ciudades:', error)
    }
  }

  /**
   * Limpiar campos de ubicación específicos
   */
  _clearLocationFields() {
    const fields = [Constants.FIELDS.DEPARTMENT, Constants.FIELDS.CITY]

    fields.forEach(field => {
      this.validationStore.getState().updateField(field, '')
      this.fieldStore.getState().clearFieldValue(field)
    })

    this.logger?.debug('🧹 Campos de ubicación limpiados')
  }

  /**
   * Limpiar opciones del selector de departamentos
   */
  _clearDepartmentOptions() {
    try {
      const departmentField = document.querySelector(Constants.SELECTORS.DEPARTMENT)
      if (departmentField && departmentField.tomselect) {
        departmentField.tomselect.clearOptions()
        departmentField.tomselect.clear()
        this.logger?.debug(`🧹 Opciones de departamento limpiadas`)
      }
    } catch (error) {
      this.logger?.error('Error limpiando opciones de departamento:', error)
    }
  }

  /**
   * Limpiar opciones del selector de ciudades
   */
  _clearCityOptions() {
    try {
      const cityField = document.querySelector(Constants.SELECTORS.CITY)
      if (cityField && cityField.tomselect) {
        cityField.tomselect.clearOptions()
        cityField.tomselect.clear()
        this.logger?.debug(`🧹 Opciones de ciudad limpiadas`)
      }
    } catch (error) {
      this.logger?.error('Error limpiando opciones de ciudad:', error)
    }
  }

  /**
   * Mapear código ISO2 a clave de ubicaciones
   */
  _mapCountryCodeToLocationKey(iso2Code) {
    // Mapeado específico para países con diferencias entre ISO2 y claves del JSON
    const mapping = {
      CO: 'COL' // Colombia: ISO2="CO", ubicaciones.json="COL"
      // Agregar otros mapeos si es necesario
    }

    return mapping[iso2Code] || iso2Code
  }

  /**
   * Verificar si un país tiene departamentos
   */
  async _checkCountryHasDepartments(countryValue) {
    try {
      if (!this.Data) return false

      const locations = this.Data.getLocations()

      // Buscar el país por diferentes criterios (ISO2, nombre)
      let countryData = null

      // Primero mapear ISO2 a clave correcta
      const mappedKey = this._mapCountryCodeToLocationKey(countryValue)

      // Buscar por clave mapeada
      if (locations[mappedKey]) {
        countryData = locations[mappedKey]
      } else {
        // Buscar por nombre del país
        const countryKey = Object.keys(locations).find(key => {
          const country = locations[key]
          return country.nombre === countryValue
        })

        if (countryKey) {
          countryData = locations[countryKey]
        }
      }

      // Verificar si tiene departamentos
      this.logger?.debug(`🔍 Debug - countryData:`, countryData)
      this.logger?.debug(`🔍 Debug - countryData.departamentos:`, countryData?.departamentos)

      const hasDepartments = !!(
        countryData &&
        countryData.departamentos &&
        Array.isArray(countryData.departamentos) &&
        countryData.departamentos.length > 0
      )

      this.logger?.debug(`🔍 País ${countryValue} tiene departamentos: ${hasDepartments}`)
      return hasDepartments
    } catch (error) {
      this.logger?.error('Error verificando departamentos del país:', error)
      return false
    }
  }

  /**
   * Cargar departamentos para un país específico
   */
  async _loadDepartmentsForCountry(countryValue) {
    try {
      const departmentField = document.querySelector(Constants.SELECTORS.DEPARTMENT)
      if (!departmentField || !this.Data) return

      const locations = this.Data.getLocations()

      // Buscar el país por diferentes criterios (ISO2, nombre)
      let countryData = null
      let countryKey = null

      // Primero mapear ISO2 a clave correcta
      const mappedKey = this._mapCountryCodeToLocationKey(countryValue)

      // Buscar por clave mapeada
      if (locations[mappedKey]) {
        countryData = locations[mappedKey]
        countryKey = mappedKey
      } else {
        // Buscar por nombre del país
        countryKey = Object.keys(locations).find(key => {
          const country = locations[key]
          return country.nombre === countryValue
        })

        if (countryKey) {
          countryData = locations[countryKey]
        }
      }

      if (!countryData || !countryData.departamentos) {
        this.logger?.warn(`No se encontraron departamentos para ${countryValue}`)
        return
      }

      const departmentOptions = countryData.departamentos.map(dept => ({
        value: dept.codigo,
        text: dept.nombre,
        ciudades: dept.ciudades,
        countryKey: countryKey
      }))

      // Reinicializar tom-select con las opciones de departamento
      const tomSelectInstance = departmentField.tomselect
      if (tomSelectInstance) {
        tomSelectInstance.clearOptions()
        tomSelectInstance.addOptions(departmentOptions)
        tomSelectInstance.refreshOptions()
      }

      this.logger?.debug(`🏛️ ${departmentOptions.length} departamentos cargados para ${countryValue}`)
    } catch (error) {
      this.logger?.error('Error cargando departamentos:', error)
    }
  }

  /**
   * Limpiar solo campo ciudad
   */
  _clearCityField() {
    this.validationStore.getState().updateField(Constants.FIELDS.CITY, '')
    this.fieldStore.getState().clearFieldValue(Constants.FIELDS.CITY)
    this.fieldStore.getState().setFieldVisibility(Constants.FIELDS.CITY, false)

    this.logger?.debug('🧹 Campo ciudad limpiado')
  }

  /**
   * Verificar si Colombia está seleccionada
   */
  _isColombiaSelected() {
    const selectedCountry = this.validationStore.getState().getFieldValue(Constants.FIELDS.COUNTRY)
    return selectedCountry === this._getInitialCountry()
  }

  /**
   * Obtener país inicial por defecto
   */
  _getInitialCountry() {
    // Obtener desde configuración o usar Colombia como defecto
    return this.config?.defaultCountry || 'CO' // Colombia
  }

  /**
   * Validar configuración de ubicación
   */
  isLocationConfigurationValid() {
    const config = this.getCurrentLocationConfig()

    if (!config.country) {
      return { valid: false, error: 'País requerido' }
    }

    if (config.isColombiaSelected) {
      if (!config.department) {
        return { valid: false, error: 'Departamento requerido para Colombia' }
      }
      if (!config.city) {
        return { valid: false, error: 'Ciudad requerida para Colombia' }
      }
    }

    return { valid: true }
  }

  /**
   * Limpiar todos los campos de ubicación
   */
  clearAllLocationFields() {
    const fields = [Constants.FIELDS.COUNTRY, Constants.FIELDS.DEPARTMENT, Constants.FIELDS.CITY]

    fields.forEach(field => {
      this.validationStore.getState().updateField(field, '')
      this.fieldStore.getState().clearFieldValue(field)
    })

    this.logger?.debug('🧹 Todos los campos de ubicación limpiados')
  }

  /**
   * Destruir instancias de TomSelect
   */
  destroy() {
    this.tomSelectAdapter.destroyAll()
    this.logger?.info('🗑️ Locations module destruido')
  }
}
