// Import main SASS file (which imports all modules)
import "./styles/form-modules.scss";

// Import main FormManager and all modules
import { FormManager } from "./modules/FormManager.js";
import { Validation } from "./modules/Validation.js";
import { Data } from "./modules/Data.js";
import { Service } from "./modules/Service.js";
import { Ui } from "./modules/UI.js";
import { Logger } from "./modules/Logger.js";
import { Config } from "./modules/Config.js";
import { State } from "./modules/State.js";
import { Event } from "./modules/Event.js";
import { Academic } from "./modules/Academic.js";
import { Locations } from "./modules/Locations.js";
import { UtmParameters } from "./modules/UtmParameters.js";
import { Constants } from "./modules/Constants.js";
import { Cache } from "./modules/Cache.js";
import { TomSelect } from "./modules/TomSelect.js";
import { ValidatedFormSubmission } from "./modules/ValidatedFormSubmission.js";

// Export main FormManager as default
export default FormManager;

// Export all modules for individual use
export {
  FormManager,
  Validation,
  Data,
  Service,
  Ui,
  Logger,
  Config,
  State,
  Event,
  Academic,
  Locations,
  UtmParameters,
  Constants,
  Cache,
  TomSelect,
  ValidatedFormSubmission,
};
