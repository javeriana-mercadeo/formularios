// Import main SASS file (which imports all modules)
import "./styles/form-modules.scss";

// =========================================
// MODERN EXPORTS - Feature-First Architecture
// =========================================

// Main FormManager (modernized)
import { FormManager } from "./core/FormManager.js";

// Zustand Stores
import { useSystemStore } from "./core/stores/system-store.js";
import { useValidationStore } from "./features/validation/stores/validation-store.js";
import { useFieldStore } from "./features/field-management/stores/field-store.js";
import { useSubmissionStore } from "./features/form-submission/stores/submission-store.js";

// Modern Engines & Controllers
import { ValidationEngine } from "./features/validation/ValidationEngine.js";
import { FieldController } from "./features/field-management/FieldController.js";

// Modern Adapters
import { TomSelectAdapter } from "./integrations/tom-select/TomSelectAdapter.js";
import { YupAdapter } from "./integrations/yup/YupAdapter.js";
import { CleaveAdapter } from "./integrations/cleave/CleaveAdapter.js";
import { SalesforceClient } from "./integrations/salesforce/SalesforceClient.js";
import { FieldMapper } from "./integrations/salesforce/FieldMapper.js";

// Modernized Specialized Modules
import { Academic } from "./features/specialized-modules/Academic.js";
import { Locations } from "./features/specialized-modules/Locations.js";
import { University } from "./features/specialized-modules/University.js";
import { College } from "./features/specialized-modules/College.js";

// =========================================
// LEGACY COMPATIBILITY EXPORTS
// =========================================

// Core modules (renamed but compatible)
import { Ui as DomManager } from "./ui/DomManager.js";
import { Logger } from "./core/Logger.js";
import { Config as ConfigLoader } from "./features/form-initialization/ConfigLoader.js";
import { Data as DataPreloader } from "./features/form-initialization/DataPreloader.js";
import { Event as EventBus } from "./core/EventBus.js";
import { Service as SalesforceMapper } from "./features/form-submission/SalesforceMapper.js";
import { Validation as ValidationLegacy } from "./features/validation/ValidationLegacy.js";
import { State as StateLegacy } from "./features/validation/StateLegacy.js";

// Constants and utilities
import { Constants } from "./core/Constants.js";
import { TomSelect as TomSelectBase } from "./integrations/tom-select/TomSelectBase.js";

// Utils
import { Cache } from "./utils/cache-manager.js";
import { UtmParameters } from "./utils/utm-processor.js";

// =========================================
// MAIN EXPORTS
// =========================================

// Export main FormManager as default (backward compatible)
export default FormManager;

// =========================================
// MODERN API EXPORTS
// =========================================
export {
  // Main FormManager
  FormManager,
  
  // Zustand Stores
  useSystemStore,
  useValidationStore,
  useFieldStore,
  useSubmissionStore,
  
  // Modern Engines & Controllers
  ValidationEngine,
  FieldController,
  
  // Modern Adapters
  TomSelectAdapter,
  YupAdapter,
  CleaveAdapter,
  SalesforceClient,
  FieldMapper,
  
  // Modernized Modules
  Academic,
  Locations,
  University,
  College,
};

// =========================================
// LEGACY COMPATIBILITY EXPORTS
// =========================================
export {
  // Legacy names for backward compatibility
  DomManager as Ui,
  Logger,
  ConfigLoader as Config,
  DataPreloader as Data,
  EventBus as Event,
  SalesforceMapper as Service,
  ValidationLegacy as Validation,
  StateLegacy as State,
  
  // Constants and base modules
  Constants,
  TomSelectBase as TomSelect,
  
  // Utils
  Cache,
  UtmParameters,
};

// =========================================
// HELPFUL ALIASES
// =========================================
export {
  // Modern aliases
  DomManager,
  ConfigLoader,
  DataPreloader,
  EventBus,
  SalesforceMapper,
  ValidationLegacy,
  StateLegacy,
  TomSelectBase,
};

// =========================================
// USAGE INFORMATION
// =========================================
/**
 * USAGE EXAMPLES:
 * 
 * // Modern usage:
 * import FormManager, { useValidationStore, TomSelectAdapter } from './form-modules';
 * 
 * // Legacy usage (still works):
 * import FormManager, { Validation, Ui, Config } from './form-modules';
 * 
 * // Individual modern components:
 * import { ValidationEngine, FieldController } from './form-modules';
 * 
 * // Zustand stores:
 * import { useSystemStore, useFieldStore } from './form-modules';
 */