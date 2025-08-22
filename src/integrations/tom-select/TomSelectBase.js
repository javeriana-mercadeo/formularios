/**
 * TomSelect - Módulo reutilizable para convertir selects a Tom Select
 * Proporciona funcionalidad consistente de búsqueda y selección para todos los módulos
 * @version 1.0
 */

export class TomSelect {
  constructor(logger = null) {
    this.logger = logger
    this.instances = new Map() // Mapa de instancias activas
    this.isLibraryLoaded = false
  }

  // ===============================
  // MÉTODOS PÚBLICOS
  // ===============================

  /**
   * Inicializar Tom Select en un elemento select
   * @param {HTMLElement} selectElement - Elemento select
   * @param {Array} options - Array de opciones {value, text}
   * @param {Object} config - Configuración opcional
   * @returns {Promise<Object>} - Instancia de Tom Select
   */
  async initialize(selectElement, options = [], config = {}) {
    try {
      if (!selectElement) {
        throw new Error('Elemento select requerido')
      }

      this.logger?.info(`🎯 Inicializando TomSelect para: ${selectElement.name || selectElement.id}`)

      // Cargar librería si no está cargada
      await this._loadTomSelectLibrary()

      // Configuración por defecto
      const defaultConfig = {
        placeholder: 'Buscar y seleccionar...',
        searchEnabled: true,
        clearable: true,
        closeAfterSelect: true,
        maxItems: 1, // Valor por defecto estándar
        required: false,
        ...config
      }

      // Poblar el select con opciones
      this._populateSelect(selectElement, options)

      // Crear configuración de Tom Select
      const tomSelectConfig = this._createTomSelectConfig(defaultConfig, selectElement)

      // Destruir instancia existente si la hay
      this._destroyExisting(selectElement)

      // Crear nueva instancia
      const instance = new window.TomSelect(selectElement, tomSelectConfig)

      // FORZAR PLACEHOLDER desde HTML original después de la inicialización
      setTimeout(() => {
        const controlInput = instance.control_input
        const placeholderText = selectElement.getAttribute('data-placeholder-text') || defaultConfig.placeholder
        if (controlInput && placeholderText) {
          controlInput.setAttribute('placeholder', placeholderText)
          this.logger?.info(`🎯 Placeholder forzado desde HTML: "${placeholderText}"`)
        }

        // Establecer valor por defecto si está configurado
        if (defaultConfig.defaultValue && !instance.getValue()) {
          instance.setValue(defaultConfig.defaultValue)
          this.logger?.info(`🎯 Valor por defecto establecido: "${defaultConfig.defaultValue}"`)
        }
      }, 50)

      // Configurar eventos
      this._setupEvents(instance, selectElement, defaultConfig)

      // Guardar instancia
      const instanceKey = selectElement.name || selectElement.id || Date.now().toString()
      this.instances.set(instanceKey, instance)

      this.logger?.info(`✅ TomSelect inicializado: ${options.length} opciones`)

      return instance
    } catch (error) {
      this.logger?.error('❌ Error inicializando TomSelect:', error)
      throw error
    }
  }

  /**
   * Actualizar opciones de una instancia existente
   * @param {string} instanceKey - Clave de la instancia
   * @param {Array} newOptions - Nuevas opciones
   */
  updateOptions(instanceKey, newOptions) {
    try {
      const instance = this.instances.get(instanceKey)
      if (!instance) {
        this.logger?.warn(`⚠️ Instancia ${instanceKey} no encontrada`)
        return
      }

      // Limpiar opciones existentes
      instance.clearOptions()

      // Agregar nuevas opciones
      newOptions.forEach(option => {
        instance.addOption(option)
      })

      this.logger?.info(`🔄 Opciones actualizadas: ${newOptions.length} elementos`)
    } catch (error) {
      this.logger?.error('❌ Error actualizando opciones:', error)
    }
  }

  /**
   * Obtener valor seleccionado
   * @param {string} instanceKey - Clave de la instancia
   * @returns {string|null} - Valor seleccionado
   */
  getValue(instanceKey) {
    const instance = this.instances.get(instanceKey)
    return instance ? instance.getValue() : null
  }

  /**
   * Establecer valor
   * @param {string} instanceKey - Clave de la instancia
   * @param {string} value - Valor a establecer
   */
  setValue(instanceKey, value) {
    const instance = this.instances.get(instanceKey)
    if (instance) {
      instance.setValue(value)
    }
  }

  /**
   * Limpiar selección
   * @param {string} instanceKey - Clave de la instancia
   */
  clear(instanceKey) {
    const instance = this.instances.get(instanceKey)
    if (instance) {
      instance.clear()
    }
  }

  /**
   * Destruir instancia específica
   * @param {string} instanceKey - Clave de la instancia
   */
  destroy(instanceKey) {
    const instance = this.instances.get(instanceKey)
    if (instance) {
      instance.destroy()
      this.instances.delete(instanceKey)
      this.logger?.info(`🗑️ TomSelect destruido: ${instanceKey}`)
    }
  }

  /**
   * Destruir todas las instancias
   */
  destroyAll() {
    this.instances.forEach((instance, key) => {
      instance.destroy()
      this.logger?.info(`🗑️ TomSelect destruido: ${key}`)
    })
    this.instances.clear()
  }

  // ===============================
  // MÉTODOS PRIVADOS
  // ===============================

  /**
   * Cargar librería Tom Select dinámicamente
   * @private
   */
  async _loadTomSelectLibrary() {
    if (this.isLibraryLoaded || window.TomSelect) {
      return Promise.resolve()
    }

    this.logger?.info('📦 Cargando librería Tom Select...')

    try {
      // Cargar CSS
      const cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = 'https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/css/tom-select.css'
      document.head.appendChild(cssLink)

      // Cargar JS
      await new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/js/tom-select.complete.min.js'
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })

      this.isLibraryLoaded = true
      this.logger?.info('✅ Tom Select library cargada')
    } catch (error) {
      this.logger?.error('❌ Error cargando Tom Select:', error)
      throw error
    }
  }

  /**
   * Poblar select con opciones capturando placeholder desde HTML original
   * @private
   */
  _populateSelect(selectElement, options) {
    // CAPTURAR PLACEHOLDER desde la primera opción del HTML original
    let placeholderText = 'Buscar y seleccionar...'
    let placeholderValue = ''

    // Buscar la primera opción que tenga valor vacío o sea placeholder
    const existingOptions = selectElement.querySelectorAll('option')
    if (existingOptions.length > 0) {
      const firstOption = existingOptions[0]
      // Si la primera opción tiene valor vacío o texto tipo placeholder
      if (
        !firstOption.value ||
        firstOption.value === '' ||
        firstOption.textContent.toLowerCase().includes('seleccion') ||
        firstOption.textContent.toLowerCase().includes('busca') ||
        firstOption.textContent.toLowerCase().includes('elige')
      ) {
        placeholderText = firstOption.textContent.trim()
        placeholderValue = firstOption.value || ''
        this.logger?.info(`🎯 Placeholder capturado del HTML: "${placeholderText}"`)
      }
    }

    // Limpiar opciones existentes
    selectElement.innerHTML = ''

    // Agregar opción placeholder (SIEMPRE como primera opción)
    const placeholderOption = document.createElement('option')
    placeholderOption.value = placeholderValue // Valor vacío o valor placeholder original
    placeholderOption.textContent = placeholderText
    placeholderOption.setAttribute('data-placeholder', 'true')
    placeholderOption.setAttribute('data-invalid-value', 'true') // Marcar como valor inválido para validación
    selectElement.appendChild(placeholderOption)

    // Agregar todas las opciones reales (sin la placeholder)
    options.forEach(option => {
      const optElement = document.createElement('option')
      optElement.value = option.value
      optElement.textContent = option.text

      // Agregar data attributes si existen
      if (option.data) {
        Object.keys(option.data).forEach(key => {
          optElement.setAttribute(`data-${key}`, option.data[key])
        })
      }

      selectElement.appendChild(optElement)
    })

    // Preseleccionar la opción placeholder (valor por defecto)
    selectElement.value = placeholderValue

    // Guardar datos de placeholder para usar en TomSelect
    selectElement.setAttribute('data-placeholder-text', placeholderText)
    selectElement.setAttribute('data-placeholder-value', placeholderValue)

    this.logger?.info(`📝 Select poblado con ${options.length} opciones + placeholder: "${placeholderText}" (valor: "${placeholderValue}")`)
  }

  /**
   * Crear configuración de Tom Select
   * @private
   */
  _createTomSelectConfig(config, selectElement) {
    // Obtener placeholder desde el HTML original
    const placeholderText = selectElement.getAttribute('data-placeholder-text') || config.placeholder || 'Buscar y seleccionar...'

    return {
      // Configuración básica
      valueField: 'value',
      labelField: 'text',
      searchField: ['text'],

      // Configuración de UI - PLACEHOLDER desde HTML original
      placeholder: placeholderText,
      searchPlaceholder: config.searchPlaceholder || 'Buscar...',
      maxItems: config.maxItems,
      closeAfterSelect: config.closeAfterSelect,
      allowEmptyOption: true,
      create: false,

      // Configuraciones adicionales para preservar placeholder
      hideSelected: false,
      selectOnTab: true,
      preload: false, // No precargar para mantener placeholder visible

      // Configuración para mostrar todas las opciones
      maxOptions: null, // Sin límite en las opciones mostradas

      // Configuración de búsqueda
      score: function (search) {
        const score = this.getScoreFunction(search)
        return function (item) {
          // Priorizar coincidencias al inicio del texto
          const lowerText = item.text.toLowerCase()
          const lowerSearch = search.toLowerCase()
          const startsWithBonus = lowerText.startsWith(lowerSearch) ? 2 : 1
          return score(item) * startsWithBonus
        }
      },

      // Configuración de render - Usar configuración personalizada si existe, sino usar default
      render: config.render || {
        option: function (data, escape) {
          return `<div class="tom-select-option">
                    <span class="option-text">${escape(data.text)}</span>
                  </div>`
        },
        item: function (data, escape) {
          return `<div class="tom-select-item">${escape(data.text)}</div>`
        },
        no_results: function (data, escape) {
          return '<div class="no-results">No se encontraron resultados</div>'
        },
        // Render personalizado para placeholder
        option_create: function (data, escape) {
          return '<div class="create">Agregar <strong>' + escape(data.input) + '</strong>&hellip;</div>'
        },
        // Control del placeholder en el input
        control_input: function () {
          return `<input type="text" autocomplete="off" size="1" placeholder="${this.settings.placeholder || 'Buscar y seleccionar...'}">`
        }
      }
    }
  }

  /**
   * Configurar eventos de la instancia
   * @private
   */
  _setupEvents(instance, selectElement, config) {
    // Evento de cambio
    instance.on('change', value => {
      this.logger?.info(`🔄 Selección cambiada: ${value}`)

      // Sincronizar con el select original
      selectElement.value = value
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))

      // Validación en tiempo real al cambiar - verificar que no sea valor placeholder
      if (config.required) {
        const placeholderValue = selectElement.getAttribute('data-placeholder-value') || ''
        const isValidValue = value && value !== '' && value !== placeholderValue

        if (isValidValue) {
          this.clearValidationErrors(selectElement)
        } else {
          this.showValidationError(selectElement, 'Este campo es obligatorio')
        }
      }
    })

    // Evento de limpieza
    instance.on('clear', () => {
      this.logger?.info('🧹 Selección limpiada')
      selectElement.value = ''
      selectElement.dispatchEvent(new Event('change', { bubbles: true }))

      // Restaurar placeholder desde HTML original después de limpiar
      setTimeout(() => {
        const controlInput = instance.control_input
        const placeholderText = selectElement.getAttribute('data-placeholder-text') || config.placeholder
        const placeholderValue = selectElement.getAttribute('data-placeholder-value') || ''

        if (controlInput && placeholderText) {
          controlInput.setAttribute('placeholder', placeholderText)
          // Restaurar valor placeholder en el select original
          selectElement.value = placeholderValue
          this.logger?.info(`🎯 Placeholder restaurado después de limpiar: "${placeholderText}"`)
        }
      }, 10)

      // Mostrar error al limpiar si es required
      if (config.required) {
        this.showValidationError(selectElement, 'Este campo es obligatorio')
      }
    })

    // Evento de focus - limpiar errores al hacer focus
    instance.on('focus', () => {
      this.logger?.info('👁️ TomSelect enfocado')
      // Solo limpiar si ya tiene valor válido (no placeholder)
      const currentValue = instance.getValue()
      const placeholderValue = selectElement.getAttribute('data-placeholder-value') || ''
      const isValidValue = currentValue && currentValue !== '' && currentValue !== placeholderValue

      if (isValidValue && config.required) {
        this.clearValidationErrors(selectElement)
      }

      // Marcar que el usuario ya interactuó
      selectElement.setAttribute('data-user-interacted', 'true')
    })

    // Evento de blur - validar al perder el focus
    instance.on('blur', () => {
      this.logger?.info('👁️‍🗨️ TomSelect desenfocanado')
      if (config.required) {
        const currentValue = instance.getValue()
        const hasInteracted = selectElement.getAttribute('data-user-interacted')

        // Solo mostrar error si el usuario ya interactuó y no hay valor válido
        const placeholderValue = selectElement.getAttribute('data-placeholder-value') || ''
        const isValidValue = currentValue && currentValue !== '' && currentValue !== placeholderValue

        if (hasInteracted && !isValidValue) {
          this.showValidationError(selectElement, 'Este campo es obligatorio')
        }
      }
    })

    // Evento de dropdown abrir - limpiar errores si hay valor y marcar interacción
    instance.on('dropdown_open', () => {
      const currentValue = instance.getValue()
      if (currentValue && currentValue !== '' && config.required) {
        this.clearValidationErrors(selectElement)
      }

      // Marcar que el usuario abrió el dropdown (interacción)
      selectElement.setAttribute('data-user-interacted', 'true')
    })

    // Evento de dropdown cerrar - restaurar placeholder si está vacío
    instance.on('dropdown_close', () => {
      const currentValue = instance.getValue()
      if (!currentValue || currentValue === '') {
        setTimeout(() => {
          const controlInput = instance.control_input
          if (controlInput && config.placeholder) {
            controlInput.setAttribute('placeholder', config.placeholder)
            this.logger?.info(`🎯 Placeholder restaurado al cerrar dropdown: "${config.placeholder}"`)
          }
        }, 10)
      }
    })

    // Configurar como required si es necesario
    if (config.required) {
      selectElement.setAttribute('required', 'required')
      selectElement.setAttribute('data-validation', 'required')

      // Validación inicial diferida para no interferir con placeholder
      const initialValue = selectElement.value
      if (!initialValue || initialValue === '') {
        // NO mostrar error inmediatamente para preservar placeholder
        // Solo mostrar error después de interacción del usuario
        this.logger?.info('🎯 Campo requerido inicializado vacío - esperando interacción')
      }
    }
  }

  /**
   * Destruir instancia existente en el elemento
   * @private
   */
  _destroyExisting(selectElement) {
    const instanceKey = selectElement.name || selectElement.id
    if (instanceKey && this.instances.has(instanceKey)) {
      this.instances.get(instanceKey).destroy()
      this.instances.delete(instanceKey)
    }
  }

  /**
   * Mostrar error de validación para TomSelect
   * @param {HTMLElement} selectElement - Elemento select
   * @param {string} message - Mensaje de error
   */
  showValidationError(selectElement, message) {
    try {
      const fieldId = selectElement.id || selectElement.name
      this.logger?.info(`🔴 Mostrando error TomSelect para ${fieldId}: "${message}"`)

      // Agregar clases de error al select original
      selectElement.classList.add('error')
      selectElement.parentElement?.classList.add('error')

      // Agregar clase de error al wrapper de Tom Select
      const tsWrapper = selectElement.parentElement?.querySelector('.ts-wrapper')
      if (tsWrapper) {
        tsWrapper.classList.add('error')
      }

      // Buscar elemento de error existente con el formato correcto
      let errorElement =
        selectElement.parentElement?.querySelector(`#error_${fieldId}`) ||
        selectElement.parentElement?.querySelector(`[data-error-for="${fieldId}"]`) ||
        selectElement.parentElement?.querySelector('.error-message')

      if (!errorElement) {
        // Crear elemento de error con el formato estándar del sistema
        errorElement = document.createElement('div')
        errorElement.id = `error_${fieldId}`
        errorElement.className = 'error_text'
        errorElement.setAttribute('data-error-for', fieldId)
        errorElement.style.cssText = 'display: block; opacity: 1; transition: opacity 300ms;'

        // Insertar después del wrapper de Tom Select o del select original
        const insertAfter = tsWrapper || selectElement
        insertAfter.parentElement?.insertBefore(errorElement, insertAfter.nextSibling)
      }

      errorElement.textContent = message
      errorElement.style.display = 'block'
      errorElement.style.opacity = '1'

      this.logger?.info(`✅ Error mostrado con formato estándar: #error_${fieldId}`)
    } catch (error) {
      this.logger?.error('❌ Error mostrando validación TomSelect:', error)
    }
  }

  /**
   * Limpiar errores de validación
   * @param {HTMLElement} selectElement - Elemento select
   */
  clearValidationErrors(selectElement) {
    try {
      const fieldId = selectElement.id || selectElement.name

      // Remover clases de error
      selectElement.classList.remove('error')
      selectElement.parentElement?.classList.remove('error')

      // Buscar y remover mensajes de error con el formato estándar
      const errorElement =
        selectElement.parentElement?.querySelector(`#error_${fieldId}`) ||
        selectElement.parentElement?.querySelector(`[data-error-for="${fieldId}"]`) ||
        selectElement.parentElement?.querySelector('.error-message') ||
        selectElement.parentElement?.querySelector('.error_text')

      if (errorElement) {
        errorElement.remove()
        this.logger?.info(`🧹 Error removido: #error_${fieldId}`)
      }

      // Limpiar error de Tom Select wrapper
      const tsWrapper = selectElement.parentElement?.querySelector('.ts-wrapper')
      if (tsWrapper) {
        tsWrapper.classList.remove('error')
      }
    } catch (error) {
      this.logger?.warn('⚠️ Error limpiando validación:', error)
    }
  }

  /**
   * Validar campo TomSelect
   * @param {string} instanceKey - Clave de la instancia
   * @returns {boolean} - True si es válido
   */
  validateField(instanceKey) {
    const instance = this.instances.get(instanceKey)
    if (!instance) return true

    const selectElement = instance.input
    const isRequired = selectElement.hasAttribute('required') || selectElement.hasAttribute('data-validation')
    const value = instance.getValue()

    // Verificar que no sea valor placeholder
    const placeholderValue = selectElement.getAttribute('data-placeholder-value') || ''
    const isValidValue = value && value !== '' && value !== placeholderValue

    if (isRequired && !isValidValue) {
      this.showValidationError(selectElement, 'Este campo es obligatorio')
      return false
    }

    this.clearValidationErrors(selectElement)
    return true
  }

  /**
   * Limpiar errores de validación (método privado)
   * @private
   */
  _clearValidationErrors(selectElement) {
    this.clearValidationErrors(selectElement)
  }
}
