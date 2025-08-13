# 🚀 Plan de Modernización de Formularios PUJ

## 📋 Resumen Ejecutivo

**Objetivo:** Modernizar el sistema de formularios manteniendo compatibilidad total con Liferay/Salesforce, usando arquitectura Feature-First y las mejores librerías de 2024.

**Stack Tecnológico Final:**
- **Validación:** Yup (schema-based, vanilla JS compatible)
- **Selects:** Tom Select (ya parcialmente implementado, ~16kb)
- **Estado:** Zustand (~2.9kb, framework agnostic)
- **Máscaras:** Cleave.js (solo para documento/teléfono)
- **Arquitectura:** Feature-First con capas bien definidas

---

## 🎯 Decisiones Arquitectónicas

### ✅ **Mantener Sin Cambios:**
- **UI.js** → Perfecto para manipulación DOM específica de formularios
- **Logger.js** → Sistema sofisticado con stack trace y colores
- **Service.js** → Lógica específica Salesforce Web-to-Lead
- **Constants.js** → Mapeo crítico test/prod para Salesforce
- **Toda la lógica de modos** (dev/test/debug/prod) → Crítica para producción

### 🔄 **Modernizar (Híbrido):**
- **FormManager.js** → Integrar con Zustand manteniendo API
- **Validation.js** → Híbrido con Yup + lógica actual  
- **State.js** → Wrapper de Zustand con compatibilidad
- **TomSelect.js** → Estandarizar para todos los selects
- **Módulos especializados** → Actualizar para usar nuevas librerías

### 🆕 **Crear Nuevos:**
- **Stores Zustand** → Estado reactivo y predecible
- **Adaptadores** → Integración limpia con librerías externas
- **Casos de uso específicos** → Lógica de negocio organizada

---

## 🏗️ Arquitectura Feature-First

### **Estructura de Archivos Final:**

```
src/
├── features/                 # Funcionalidades principales
│   ├── form-initialization/
│   │   ├── FormInitializer.js     # Lógica de inicio
│   │   ├── ConfigLoader.js        # Config.js renombrado
│   │   └── DataPreloader.js       # Data.js renombrado
│   │
│   ├── field-management/
│   │   ├── FieldController.js     # Manejo de campos
│   │   ├── SelectEnhancer.js      # Tom Select estandarizado
│   │   ├── InputMasker.js         # Cleave.js integration
│   │   ├── ConditionalLogic.js    # Lógica condicional
│   │   └── stores/
│   │       └── field-store.js
│   │
│   ├── validation/
│   │   ├── ValidationEngine.js    # Validation.js + Yup híbrido
│   │   ├── YupSchemaBuilder.js    # Constructor de esquemas dinámicos
│   │   ├── FieldValidator.js      # Validación individual
│   │   └── stores/
│   │       └── validation-store.js
│   │
│   ├── form-submission/
│   │   ├── SubmissionController.js # Lógica de envío
│   │   ├── SalesforceMapper.js     # Service.js renombrado
│   │   ├── FormPreparer.js         # Preparación de datos
│   │   └── stores/
│   │       └── submission-store.js
│   │
│   └── specialized-modules/         # Módulos específicos del dominio
│       ├── Academic.js             # Actualizado con TomSelect
│       ├── Locations.js            # Actualizado con TomSelect
│       ├── University.js           # Actualizado con TomSelect
│       └── College.js              # Actualizado con TomSelect
│
├── core/                     # Sistema central
│   ├── FormManager.js        # Orquestador principal + Zustand
│   ├── EventBus.js          # Event.js renombrado
│   ├── Logger.js            # MANTENER sin cambios
│   ├── Constants.js         # MANTENER sin cambios
│   └── stores/
│       └── system-store.js   # Estado del sistema
│
├── ui/                      # Interfaz de usuario
│   ├── DomManager.js        # UI.js renombrado
│   ├── ErrorRenderer.js     # Renderizado de errores
│   ├── FieldRenderer.js     # Renderizado de campos
│   └── AnimationManager.js  # Animaciones
│
├── integrations/            # Integraciones externas
│   ├── tom-select/
│   │   ├── TomSelectAdapter.js    # Wrapper estandardizado
│   │   └── TomSelectConfig.js     # Configuraciones por tipo
│   ├── cleave/
│   │   └── CleaveAdapter.js       # Máscaras de input
│   ├── yup/
│   │   └── YupAdapter.js          # Validación con esquemas
│   └── salesforce/
│       ├── SalesforceClient.js    # Cliente API
│       └── FieldMapper.js         # Mapeo test/prod
│
├── utils/                   # Utilidades globales
│   ├── formatters.js
│   ├── validators.js
│   ├── dom-helpers.js
│   └── cache-manager.js     # Cache.js renombrado
│
└── index.js                 # Punto de entrada
```

---

## 📦 Dependencias

### **Nuevas Dependencias:**
```bash
# Instalar versiones estables automáticamente
npm install zustand yup tom-select cleave.js
```

### **Versiones Instaladas:** ✅
```json
{
  "dependencies": {
    "zustand": "^5.0.7",
    "yup": "^1.7.0", 
    "tom-select": "^2.4.3",
    "cleave.js": "^1.6.0"
  }
}
```

### **Remover:**
```bash
# Ya tienes select2 y jquery - se pueden quitar después de migrar
# npm remove select2 jquery
```

---

## 🔄 Plan de Implementación

### **🎯 FASE 1: Setup y Estructura (1-2 días)** ✅ **COMPLETADA**

#### **1.1 Instalar dependencias**
```bash
# Instalar versiones estables automáticamente
npm install zustand yup tom-select cleave.js

# Después de la instalación, documentar las versiones instaladas en package.json
```

#### **1.2 Crear estructura de archivos**
```bash
# Crear directorios
mkdir -p src/features/form-initialization
mkdir -p src/features/field-management/stores
mkdir -p src/features/validation/stores
mkdir -p src/features/form-submission/stores
mkdir -p src/features/specialized-modules
mkdir -p src/core/stores
mkdir -p src/ui
mkdir -p src/integrations/tom-select
mkdir -p src/integrations/cleave
mkdir -p src/integrations/yup
mkdir -p src/integrations/salesforce
mkdir -p src/utils
```

#### **1.3 Crear stores básicos con Zustand**

**Crear: `src/core/stores/system-store.js`**
```javascript
import { create } from 'zustand';

export const useSystemStore = create((set, get) => ({
  // Estado del sistema
  modes: {
    development: false,
    test: false,
    debug: false
  },
  systemState: {
    isSubmitting: false,
    isInitialized: false
  },
  config: {},
  
  // Acciones
  setMode: (mode, enabled) => set((state) => ({
    modes: { ...state.modes, [mode]: enabled }
  })),
  
  setSystemState: (key, value) => set((state) => ({
    systemState: { ...state.systemState, [key]: value }
  })),
  
  setConfig: (config) => set({ config }),
  
  // Getters
  getSalesforceUrl: () => {
    const { modes } = get();
    return modes.test 
      ? "https://test.salesforce.com/servlet/servlet.WebToLead"
      : "https://webto.salesforce.com/servlet/servlet.WebToLead";
  }
}));
```

**Crear: `src/features/validation/stores/validation-store.js`**
```javascript
import { create } from 'zustand';

export const useValidationStore = create((set, get) => ({
  // Estado
  formData: {},
  validationErrors: {},
  touchedFields: new Set(),
  
  // Acciones
  updateField: (name, value) => set((state) => ({
    formData: { ...state.formData, [name]: value }
  })),
  
  setValidationError: (field, error) => set((state) => ({
    validationErrors: { ...state.validationErrors, [field]: error }
  })),
  
  clearValidationError: (field) => set((state) => {
    const { [field]: removed, ...rest } = state.validationErrors;
    return { validationErrors: rest };
  }),
  
  markFieldTouched: (field) => set((state) => ({
    touchedFields: new Set([...state.touchedFields, field])
  })),
  
  // Getters
  isValid: () => Object.keys(get().validationErrors).length === 0,
  
  hasErrors: () => Object.keys(get().validationErrors).length > 0,
  
  getFieldError: (field) => get().validationErrors[field] || null,
  
  isFieldTouched: (field) => get().touchedFields.has(field),
  
  // Reset
  reset: () => set({
    formData: {},
    validationErrors: {},
    touchedFields: new Set()
  })
}));
```

### **🎯 FASE 2: Migración de Archivos Core (1 día)** ✅ **COMPLETADA**

#### **2.1 Mover archivos existentes sin modificar**
```bash
# Core - Mantener sin cambios
cp src/modules/Logger.js src/core/Logger.js
cp src/modules/Constants.js src/core/Constants.js
cp src/modules/Event.js src/core/EventBus.js

# UI - Solo renombrar
cp src/modules/UI.js src/ui/DomManager.js

# Utils
cp src/modules/Cache.js src/utils/cache-manager.js
cp src/modules/UtmParameters.js src/utils/utm-processor.js

# Specialized modules - Mantener temporalmente
cp src/modules/Academic.js src/features/specialized-modules/Academic.js
cp src/modules/Locations.js src/features/specialized-modules/Locations.js
cp src/modules/University.js src/features/specialized-modules/University.js
cp src/modules/College.js src/features/specialized-modules/College.js
```

#### **2.2 Renombrar archivos con lógica específica**
```bash
# Form initialization
cp src/modules/Config.js src/features/form-initialization/ConfigLoader.js
cp src/modules/Data.js src/features/form-initialization/DataPreloader.js

# Form submission  
cp src/modules/Service.js src/features/form-submission/SalesforceMapper.js
```

### **🎯 FASE 3: Crear Adaptadores (1-2 días)** ✅ **COMPLETADA**

#### **3.1 Crear TomSelectAdapter**

**Crear: `src/integrations/tom-select/TomSelectAdapter.js`**
```javascript
import { TomSelect } from './TomSelectBase.js';

export class TomSelectAdapter {
  constructor(logger) {
    this.logger = logger;
    this.instances = new Map();
  }
  
  // Configuraciones predefindias por tipo
  getConfigByType(type) {
    const configs = {
      academic: {
        placeholder: 'Selecciona nivel académico...',
        required: true,
        maxItems: 1
      },
      location: {
        placeholder: 'Selecciona ubicación...',
        required: true,
        maxItems: 1
      },
      university: {
        placeholder: 'Buscar universidad...',
        required: false,
        maxItems: 1,
        searchEnabled: true
      },
      college: {
        placeholder: 'Buscar colegio...',
        required: false,
        maxItems: 1,
        searchEnabled: true
      },
      company: {
        placeholder: 'Buscar empresa...',
        required: false,
        maxItems: 1,
        searchEnabled: true
      }
    };
    
    return { ...configs.default, ...configs[type] };
  }
  
  async initializeByType(selectElement, options, type = 'default') {
    const config = this.getConfigByType(type);
    const tomSelect = new TomSelect(this.logger);
    const instance = await tomSelect.initialize(selectElement, options, config);
    
    const key = selectElement.name || selectElement.id || Date.now().toString();
    this.instances.set(key, instance);
    
    return instance;
  }
  
  destroyAll() {
    this.instances.forEach((instance, key) => {
      instance.destroy();
      this.logger?.info(`🗑️ TomSelect destruido: ${key}`);
    });
    this.instances.clear();
  }
}
```

**Mover y renombrar:**
```bash
cp src/modules/TomSelect.js src/integrations/tom-select/TomSelectBase.js
```

#### **3.2 Crear YupAdapter**

**Crear: `src/integrations/yup/YupAdapter.js`**
```javascript
import * as yup from 'yup';
import { useValidationStore } from '../../features/validation/stores/validation-store.js';

export class YupAdapter {
  constructor(logger) {
    this.logger = logger;
    this.store = useValidationStore;
    this.schema = null;
  }
  
  createDynamicSchema(formData) {
    const baseSchema = {
      first_name: yup.string()
        .trim()
        .required('Nombre es obligatorio')
        .min(2, 'Nombre debe tener al menos 2 caracteres'),
        
      last_name: yup.string()
        .trim()
        .required('Apellidos son obligatorios')
        .min(2, 'Apellidos deben tener al menos 2 caracteres'),
        
      email: yup.string()
        .email('Email inválido')
        .required('Email es obligatorio'),
        
      type_attendee: yup.string()
        .required('Tipo de asistente es obligatorio'),
        
      authorization_data: yup.string()
        .oneOf(['1'], 'Debe autorizar el tratamiento de datos')
        .required('Autorización es obligatoria')
    };
    
    // Validaciones condicionales
    if (formData.type_attendee === 'aspirante') {
      baseSchema.academic_level = yup.string()
        .required('Nivel académico es obligatorio');
        
      baseSchema.program = yup.string()
        .required('Programa es obligatorio');
    }
    
    this.schema = yup.object(baseSchema);
    return this.schema;
  }
  
  async validateField(fieldName, value, formData = {}) {
    try {
      if (!this.schema) {
        this.createDynamicSchema(formData);
      }
      
      await this.schema.validateAt(fieldName, { [fieldName]: value, ...formData });
      this.store.getState().clearValidationError(fieldName);
      return { isValid: true };
    } catch (error) {
      this.store.getState().setValidationError(fieldName, error.message);
      return { isValid: false, error: error.message };
    }
  }
  
  async validateForm(formData) {
    try {
      this.createDynamicSchema(formData);
      await this.schema.validate(formData, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
        this.store.getState().setValidationError(err.path, err.message);
      });
      return { isValid: false, errors };
    }
  }
}
```

#### **3.3 Crear CleaveAdapter**

**Crear: `src/integrations/cleave/CleaveAdapter.js`**
```javascript
import Cleave from 'cleave.js';

export class CleaveAdapter {
  constructor(logger) {
    this.logger = logger;
    this.instances = new Map();
  }
  
  getMaskConfig(type) {
    const configs = {
      document: {
        numericOnly: true,
        blocks: [10], // CC colombiana
        stripLeadingZeroes: false
      },
      mobile: {
        phone: true,
        phoneRegionCode: 'CO',
        delimiter: ' '
      },
      phone: {
        numericOnly: true,
        blocks: [3, 3, 4],
        delimiters: [' ', ' ']
      }
    };
    
    return configs[type] || {};
  }
  
  initializeByType(inputElement, type) {
    if (!inputElement) {
      this.logger?.warn(`Elemento no encontrado para máscara ${type}`);
      return null;
    }
    
    const config = this.getMaskConfig(type);
    const instance = new Cleave(inputElement, config);
    
    const key = inputElement.name || inputElement.id || Date.now().toString();
    this.instances.set(key, instance);
    
    this.logger?.info(`🎭 Máscara ${type} aplicada a ${inputElement.name || inputElement.id}`);
    
    return instance;
  }
  
  destroyAll() {
    this.instances.forEach((instance, key) => {
      if (instance && typeof instance.destroy === 'function') {
        instance.destroy();
        this.logger?.info(`🗑️ Máscara destruida: ${key}`);
      }
    });
    this.instances.clear();
  }
}
```

### **🎯 FASE 4: Crear Engines y Controllers (2 días)** ✅ **COMPLETADA**

#### **4.1 Crear ValidationEngine híbrido**

**Crear: `src/features/validation/ValidationEngine.js`**
```javascript
import { YupAdapter } from '../../integrations/yup/YupAdapter.js';
import { Validation } from './ValidationLegacy.js'; // Validation.js renombrado
import { useValidationStore } from './stores/validation-store.js';

export class ValidationEngine {
  constructor(logger) {
    this.logger = logger;
    this.store = useValidationStore;
    
    // Adaptadores
    this.yupAdapter = new YupAdapter(logger);
    this.legacyValidator = new Validation({ logger }); // Backward compatibility
  }
  
  async validateField(fieldName, value, formData) {
    // 1. Marcar campo como touched
    this.store.getState().markFieldTouched(fieldName);
    
    // 2. Actualizar valor en store
    this.store.getState().updateField(fieldName, value);
    
    // 3. Validar con Yup (moderno)
    const yupResult = await this.yupAdapter.validateField(fieldName, value, formData);
    
    // 4. Si Yup pasa, validar reglas legacy específicas
    if (yupResult.isValid) {
      const legacyResult = this.legacyValidator.validateSpecificField(fieldName, value, formData);
      if (!legacyResult.isValid) {
        this.store.getState().setValidationError(fieldName, legacyResult.error);
        return legacyResult;
      }
    }
    
    return yupResult;
  }
  
  async validateForm(formData) {
    // Validación completa con ambos sistemas
    const yupResult = await this.yupAdapter.validateForm(formData);
    
    if (yupResult.isValid) {
      // Validaciones legacy adicionales
      const legacyResult = this.legacyValidator.validateFormComplete(null, formData);
      if (!legacyResult.isValid) {
        return legacyResult;
      }
    }
    
    return yupResult;
  }
  
  // Mantener compatibilidad con API existente
  validateFormComplete(formElement, formData) {
    return this.legacyValidator.validateFormComplete(formElement, formData);
  }
}
```

#### **4.2 Actualizar FormManager principal**

**Crear: `src/core/FormManager.js`**
```javascript
import { ValidationEngine } from '../features/validation/ValidationEngine.js';
import { TomSelectAdapter } from '../integrations/tom-select/TomSelectAdapter.js';
import { CleaveAdapter } from '../integrations/cleave/CleaveAdapter.js';
import { useSystemStore } from './stores/system-store.js';
import { useValidationStore } from '../features/validation/stores/validation-store.js';

// Importar módulos existentes renombrados
import { DomManager } from '../ui/DomManager.js';
import { Logger } from './Logger.js';
import { ConfigLoader } from '../features/form-initialization/ConfigLoader.js';
import { EventBus } from './EventBus.js';

export class FormManager {
  constructor(selector, config = {}) {
    this.selector = selector;
    this.isInitialized = false;
    
    // Stores Zustand
    this.systemStore = useSystemStore;
    this.validationStore = useValidationStore;
    
    // Módulos core (mantener lógica actual)
    this.config = new ConfigLoader({ config, selector });
    this.logger = new Logger({ config: this.config.getLoggingConfig() });
    this.domManager = new DomManager({ 
      config: this.config.getUiConfig(), 
      logger: this.logger 
    });
    
    // Nuevos adaptadores
    this.validationEngine = new ValidationEngine(this.logger);
    this.tomSelectAdapter = new TomSelectAdapter(this.logger);
    this.cleaveAdapter = new CleaveAdapter(this.logger);
    
    // Event system
    this.eventBus = new EventBus({
      formElement: this.domManager.getFormContext(),
      systemStore: this.systemStore,
      validationStore: this.validationStore,
      ui: this.domManager,
      logger: this.logger,
    });
    
    this.formElement = this.domManager.getFormContext();
  }
  
  async initialize() {
    try {
      this.logger.info(
        `Inicializando FormManager para: ${this.selector} (${this.config.getConfig().eventName})`
      );

      // Configurar modos en store
      this._initializeModes();
      
      // Cargar datos
      await this._loadData();
      
      // Configurar formulario
      await this._configureForm();
      
      // Setup eventos
      this._setupEvents();
      
      // Marcar como inicializado
      this.systemStore.getState().setSystemState('isInitialized', true);
      this.isInitialized = true;
      
      this.logger.info("FormManager inicializado correctamente");
      
      // Callback personalizado
      if (this.config.callbacks?.onFormLoad) {
        this.config.callbacks.onFormLoad(this);
      }
    } catch (error) {
      this.logger.error("Error al inicializar FormManager:", error);
      throw error;
    }
  }
  
  _initializeModes() {
    const config = this.config.getConfig();
    
    if (config.development) {
      this.systemStore.getState().setMode('development', config.development);
      this.logger.info(`Development mode: ${config.development}`);
    }
    
    if (config.debug) {
      this.systemStore.getState().setMode('debug', config.debug);
      this.logger.info(`Debug mode: ${config.debug}`);
    }
    
    if (config.test !== undefined) {
      this.systemStore.getState().setMode('test', config.test);
      this.logger.info(`Test mode: ${config.test}`);
    }
  }
  
  async _configureForm() {
    // 1. Configurar máscaras de input
    this._setupInputMasks();
    
    // 2. Configurar selects con Tom Select
    await this._setupEnhancedSelects();
    
    // 3. Configurar validaciones
    this._setupValidations();
    
    // 4. Configurar lógica condicional
    this._setupConditionalLogic();
  }
  
  _setupInputMasks() {
    // Documento
    const documentInput = this.formElement.querySelector('[name="document"]');
    if (documentInput) {
      this.cleaveAdapter.initializeByType(documentInput, 'document');
    }
    
    // Teléfono móvil
    const mobileInput = this.formElement.querySelector('[name="mobile"]');
    if (mobileInput) {
      this.cleaveAdapter.initializeByType(mobileInput, 'mobile');
    }
  }
  
  async _setupEnhancedSelects() {
    // País
    const countrySelect = this.formElement.querySelector('[name="country"]');
    if (countrySelect) {
      await this.tomSelectAdapter.initializeByType(countrySelect, [], 'location');
    }
    
    // Nivel académico
    const academicSelect = this.formElement.querySelector('[name="academic_level"]');
    if (academicSelect) {
      await this.tomSelectAdapter.initializeByType(academicSelect, [], 'academic');
    }
    
    // Universidad
    const universitySelect = this.formElement.querySelector('[name="university"]');
    if (universitySelect) {
      await this.tomSelectAdapter.initializeByType(universitySelect, [], 'university');
    }
    
    // Colegio
    const collegeSelect = this.formElement.querySelector('[name="school"]');
    if (collegeSelect) {
      await this.tomSelectAdapter.initializeByType(collegeSelect, [], 'college');
    }
  }
  
  // Mantener resto de métodos de la implementación actual...
  // (handleSubmit, _processFormSubmission, etc.)
  
  destroy() {
    // Limpiar adaptadores
    this.tomSelectAdapter.destroyAll();
    this.cleaveAdapter.destroyAll();
    
    // Limpiar stores
    this.validationStore.getState().reset();
    this.systemStore.getState().setSystemState('isInitialized', false);
    
    // Limpiar event bus
    if (this.eventBus) {
      this.eventBus.destroy();
    }
    
    this.formElement = null;
    this.isInitialized = false;
    
    this.logger.info("FormManager destruido");
  }
}
```

### **🎯 FASE 5: Actualizar Módulos Especializados (1-2 días)** ✅ **COMPLETADA**

#### **5.1 Actualizar Academic.js**
```bash
# Mover archivo actual
cp src/modules/Academic.js src/features/specialized-modules/Academic.js
```

**Modificar para usar TomSelectAdapter:**
```javascript
// En Academic.js - Cambiar las inicializaciones de select
// ANTES:
// this.ui.populateSelect({...});

// DESPUÉS:  
// await this.tomSelectAdapter.initializeByType(element, options, 'academic');
```

#### **5.2 Similar para Locations.js, University.js, College.js**

### **🎯 FASE 6: Actualizar Webpack y Build (0.5 días)**

#### **6.1 Actualizar webpack.config.js**
```javascript
// Añadir entry point actualizado
entry: {
  "form-modules": "./src/index.js",
},

// Añadir externals si usas CDN para algunas librerías
externals: {
  // Si prefieres cargar desde CDN
  // 'tom-select': 'TomSelect'
},
```

#### **6.2 Actualizar src/index.js**
```javascript
// Actualizar exports principales
export { FormManager } from './core/FormManager.js';
export { useSystemStore } from './core/stores/system-store.js';
export { useValidationStore } from './features/validation/stores/validation-store.js';

// Mantener backward compatibility
export { FormManager as default } from './core/FormManager.js';
```

### **🎯 FASE 7: Testing y Validación (1 día)**

#### **7.1 Probar con examples/test.html**
```bash
npm run build
# Abrir examples/test.html y probar cada caso de uso
```

#### **7.2 Validar funcionalidades críticas**
- [ ] Modos dev/test/debug funcionan
- [ ] Envío a Salesforce correcto
- [ ] Tom Select en todos los selects
- [ ] Máscaras en documento/teléfono
- [ ] Validación Yup + legacy
- [ ] Lógica condicional
- [ ] Estados reactivos

---

## ✅ Checklist de Implementación

### **Setup Inicial** ✅ **COMPLETADO**
- [x] Instalar dependencias: `npm install zustand yup tom-select cleave.js`
- [x] Documentar versiones instaladas en el plan
- [x] Crear estructura de directorios
- [x] Crear stores básicos de Zustand
- [x] **COMPLETADO EXTRA:** submission-store.js creado

### **Migración Core** ✅ **COMPLETADO**
- [x] Mover Logger.js, Constants.js sin cambios
- [x] Renombrar UI.js → DomManager.js
- [x] Renombrar Event.js → EventBus.js
- [x] Mover Config.js → ConfigLoader.js
- [x] Mover Data.js → DataPreloader.js
- [x] Mover Service.js → SalesforceMapper.js
- [x] **COMPLETADO EXTRA:** Validation.js → ValidationLegacy.js
- [x] **COMPLETADO EXTRA:** State.js → StateLegacy.js

### **Crear Adaptadores** ✅ **COMPLETADO**
- [x] TomSelectAdapter.js con configuraciones por tipo
- [x] YupAdapter.js con esquemas dinámicos
- [x] CleaveAdapter.js para máscaras
- [x] **COMPLETADO EXTRA:** SalesforceClient.js para integraciones
- [x] **COMPLETADO EXTRA:** FieldMapper.js para mapeo avanzado

### **Engines y Controllers** ✅ **COMPLETADO**
- [x] ValidationEngine híbrido (Yup + legacy)
- [x] FormManager actualizado con stores
- [x] FieldController para manejo de campos

### **Módulos Especializados** ✅ **COMPLETADO**
- [x] Actualizar Academic.js con TomSelectAdapter
- [x] Actualizar Locations.js con TomSelectAdapter  
- [x] Actualizar University.js con TomSelectAdapter
- [x] Actualizar College.js con TomSelectAdapter

### **Build y Testing**
- [ ] Actualizar webpack.config.js
- [ ] Actualizar src/index.js exports
- [ ] Probar build: `npm run build`
- [ ] Validar examples/test.html
- [ ] Testing en modo dev/test/debug
- [ ] Validar envío a Salesforce

### **Documentación**
- [ ] Actualizar README.md con nueva arquitectura
- [ ] Documentar APIs de stores
- [ ] Guía de migración para desarrolladores

---

## 🚨 Consideraciones Importantes

### **Backward Compatibility**
- **FormManager API** debe mantenerse igual externamente
- **Validation.js legacy** debe seguir funcionando
- **Constants.js y mapeos** Salesforce son críticos
- **Modos dev/test/debug** no pueden cambiar

### **Performance**
- **Bundle size objetivo:** < 150kb (actualmente ~200kb con jQuery + Select2)
- **Tree shaking:** Asegurar que webpack elimine código no usado
- **Lazy loading:** Considerar para módulos no críticos

### **Testing**  
- **Probar con datos reales** en examples/test.html
- **Validar envío a Salesforce** en modo test
- **Verificar compatibilidad** con Liferay
- **Cross-browser testing** (Chrome, Firefox, Safari, Edge)

---

## 📋 Notas de Implementación

### **Orden de Prioridad:**
1. **Stores y estructura** - Base reactiva
2. **Adaptadores** - Integración con librerías
3. **FormManager híbrido** - Mantener compatibilidad
4. **Módulos especializados** - Usar nuevos adaptadores
5. **Testing completo** - Validar funcionalidad

### **Rollback Plan:**
- **Mantener archivos originales** hasta validar completamente
- **Branch específico** para desarrollo de esta migración
- **Testing exhaustivo** antes de mergear a main

### **Post-Implementation:**
- **Monitorear performance** en producción
- **Documentar lecciones aprendidas**
- **Identificar optimizaciones** adicionales
- **Plan de eliminación** de código legacy cuando sea apropiado

---

**Tiempo estimado total: 7-10 días**
**Riesgo: Medio** (migración gradual mantiene compatibilidad)
**Impacto: Alto** (mejor mantenibilidad, performance, y developer experience)