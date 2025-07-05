/**
 * Formulario de inscripción a eventos - Pontificia Universidad Javeriana
 * @version 2.0
 */

// ============================================
// CONFIGURACIÓN CENTRALIZADA
// ============================================
class FormConfig {
 static PERSONALIZATION = {
  // ============================================
  // INICIO - PERSONALIZACIÓN DEL FORMULARIO
  // ============================================

  CAMPAIGN: "MERCA_ENFER_ENFER", // Código de campaña para seguimiento

  // TIPOS DE ASISTENTE
  // Define qué opciones aparecerán en el campo "Tipo de asistente"
  // Comentar con "//" las opciones que NO quieres mostrar
  TYPE_ATTENDEE: [
   "Aspirante", // ✅ Activo - Personas interesadas en estudiar
   "Padre de familia y/o acudiente", // ✅ Activo - Familiares de aspirantes
   "Docente y/o psicoorientador", // ❌ Desactivado - Personal educativo
   //"Visitante PUJ",                  // ❌ Desactivado - Visitantes externos
   //"Administrativo PUJ",             // ❌ Desactivado - Personal administrativo
  ],

  // NIVELES ACADÉMICOS DISPONIBLES
  // Define qué niveles educativos se mostrarán en el formulario
  // Si hay solo uno activo, se auto-selecciona y oculta el campo
  LEVEL_ACADEMIC: [
   //{ code: "PREG", name: "Pregrado" }, // ✅ Programas de pregrado
   //{ code: "GRAD", name: "Posgrado" }, // ✅ Maestrías y Doctorados
   //{ code: "ECLE", name: "Eclesiástico" }, // ✅ Programas eclesiásticos
   //{ code: "ETDH", name: "Técnico" },        // ✅ Programas técnicos
  ],

  // FILTRO DE FACULTADES (OPCIONAL)
  // Si está VACÍO [], muestra todas las facultades disponibles
  // Si tiene valores, SOLO muestra las facultades listadas
  FACULTY: [
   //"Enfermería",        // Ejemplo: Solo mostrar Enfermería
   //"Educación",         // Ejemplo: Solo mostrar Educación
   //"Ciencias",          // Ejemplo: Solo mostrar Ciencias
   //"Ingeniería",        // Ejemplo: Solo mostrar Ingeniería
   //"Ciencias Sociales", // Ejemplo: Solo mostrar Ciencias Sociales
   //"Derecho"            // Ejemplo: Solo mostrar Derecho
  ],

  // FILTRO DE PROGRAMAS (OPCIONAL)
  // Si está VACÍO [], muestra todos los programas disponibles
  // Si tiene valores, SOLO muestra los programas con esos CÓDIGOS
  PROGRAMS: [
   //"DGPEX",  // Ejemplo: Código de programa específico
   //"MACOM",  // Ejemplo: Código de programa específico
   //"MPERC",  // Ejemplo: Código de programa específico
   //"ELITI",  // Ejemplo: Código de programa específico
   //"MAHIS",  // Ejemplo: Código de programa específico
   //"ELIGS",  // Ejemplo: Código de programa específico
   //"MSAME"   // Ejemplo: Código de programa específico
  ],

  // DÍAS DE ASISTENCIA AL EVENTO
  // Define qué fechas estarán disponibles para seleccionar
  // Si hay solo una fecha, se auto-selecciona y oculta el campo
  ATTENDANCE_DAYS: [
   "Martes 14 de noviembre", // ✅ Activo - Primera fecha disponible
   //"Miércoles 15 de noviembre",   // ✅ Activo - Segunda fecha disponible
   //"Jueves 16 de noviembre",      // ❌ Desactivado - Tercera fecha no disponible
  ],

  // CAMPOS A OCULTAR DEL FORMULARIO
  // Permite ocultar campos que no necesitas para tu evento específico
  // Los campos ocultos se auto-completan con valores por defecto
  REMOVE_FIELDS: [
   // CAMPOS PERSONALES
   //"nombre",           // Ocultar campo de nombre
   //"apellido",         // Ocultar campo de apellido
   //"tipo_doc",         // Ocultar tipo de documento
   //"documento",        // Ocultar número de documento
   //"email",            // Ocultar correo electrónico
   //"telefono",         // Ocultar teléfono
   //"pais",             // Ocultar país
   //"departamento",     // Ocultar departamento
   //"ciudad",           // Ocultar ciudad
   //"dia_asistencia",   // Ocultar día de asistencia al evento
   //"tipo_asistente",   // Ocultar tipo de asistente
   //"nivel_academico",  // Ocultar nivel académico de interés
   //"facultad",         // Ocultar facultad de interés
   //"programa",         // Ocultar programa de interés
   //"periodo",          // Ocultar periodo esperado de ingreso
  ],

  // CONFIGURACIONES DE DESARROLLO Y DEBUG
  DEV_MODE: false, // true = Simula envío | false = Envía realmente
  DEBUG_MODE: false, // true = Entorno de pruebas | false = Producción real
  EMAIL_DEBUG: "", // Email para recibir datos de prueba

  // CONFIGURACIÓN DE CACHÉ
  CACHE_ENABLED: true, // true = Guarda datos en navegador | false = Siempre actualiza
  CACHE_EXPIRATION_HOURS: 12, // Horas antes de actualizar datos guardados

  // ============================================
  // FIN - PERSONALIZACIÓN DEL FORMULARIO
  // ============================================
 };

 static URLS = {
  THANK_YOU: "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",
  PRIVACY_POLICY:
   "https://cloud.cx.javeriana.edu.co/tratamiento_Datos_Javeriana_Eventos.html",
  DATA_SOURCES: {
   LOCATIONS: "https://cloud.cx.javeriana.edu.co/paises.json",
   PREFIXES: "https://cloud.cx.javeriana.edu.co/codigos_pais.Json",
   PROGRAMS: "https://cloud.cx.javeriana.edu.co/Programas.json",
   PERIODS: "https://cloud.cx.javeriana.edu.co/periodos.json",
  },
 };

 static SELECTORS = {
  FORM: "form_inscription",
  SUBMIT: "submit_btn",

  FIELDS: {
   FIRST_NAME: "first_name",
   LAST_NAME: "last_name",
   TYPE_DOCUMENT: "type_doc",
   DOCUMENT: "document",
   EMAIL: "email",
   PHONE_CODE: "phone_code",
   PHONE: "phone",
   COUNTRY: "country",
   DEPARTMENT: "department",
   CITY: "city",
   TYPE_ATTENDEE: "type_attendee",
   ATTENDANCE_DAY: "attendance_day",
   ACADEMIC_LEVEL: "academic_level",
   FACULTY: "faculty",
   PROGRAM: "program",
   ADMISSION_PERIOD: "admission_period",
   DATA_AUTHORIZATION: "authorization_data",
  },

  CONTAINERS: {
   NAME: "name_container",
   DEPARTMENT: "department_container",
   CITY: "cityContainer",
   FACULTY_ROW: "faculty_row",
   PROGRAM_ROW: "program_row",
   PERIOD_ROW: "admission_period_row",
   PHONE_ERROR: "phone_combined_error",
  },
 };

 static VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_MIN_LENGTH: 8,
  PHONE_MAX_LENGTH: 15,
 };
}

// ============================================
// ESTADO DEL FORMULARIO
// ============================================
class FormState {
 constructor() {
  this.data = {
   // Datos personales
   firstName: "",
   lastName: "",
   typeDocument: "",
   document: "",
   email: "",
   phoneCode: "57",
   phone: "",
   country: "COL",
   department: "",
   city: "",

   // Datos académicos
   typeAttendee: "",
   dayAttendance: "",
   academicLevel: "",
   faculty: "",
   program: "",
   admissionPeriod: "",
   dataAuthorization: "",

   // UTM
   source: "",
   subSource: "",
   mean: "",
   campaign: FormConfig.PERSONALIZATION.CAMPAIGN,
  };

  this.validation = {
   validatedFields: {},
   errors: [],
  };

  this.loadedData = {
   locations: {},
   prefixes: [],
   programs: {},
   periods: {},
  };

  this.ui = {
   isSubmitting: false,
  };
 }

 setField(fieldName, value) {
  this.data[fieldName] = value;
 }

 setFieldValidation(fieldName, isValid) {
  this.validation.validatedFields[fieldName] = isValid;
 }

 isFieldValid(fieldName) {
  return this.validation.validatedFields[fieldName] === true;
 }

 addError(error) {
  if (!this.validation.errors.includes(error)) {
   this.validation.errors.push(error);
  }
 }

 resetErrors() {
  this.validation.errors = [];
 }
}

// ============================================
// UTILIDADES
// ============================================
class Utils {
 static getElementById(id, showWarning = true) {
  const element = document.getElementById(id);
  if (!element && showWarning) {
   console.warn(`Elemento no encontrado: ${id}`);
  }
  return element;
 }

 static debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
   const later = () => {
    clearTimeout(timeout);
    func(...args);
   };
   clearTimeout(timeout);
   timeout = setTimeout(later, wait);
  };
 }

 static cleanNumbers(text) {
  return text ? text.replace(/[^\d]/g, "") : "";
 }

 static createHiddenField(form, name, value) {
  if (!name || value === undefined) return;

  const field = document.createElement("input");
  field.type = "hidden";
  field.name = name;
  field.value = value;
  form.appendChild(field);
 }

 static generateSelectOptions(selectElement, items, options = {}) {
  if (!selectElement || !items) return;

  const config = {
   emptyOptionText: "Selecciona",
   selectedValue: null,
   ...options,
  };

  // Limpiar opciones existentes
  selectElement.innerHTML = "";

  // Opción vacía
  if (config.emptyOptionText) {
   const emptyOption = document.createElement("option");
   emptyOption.value = "";
   emptyOption.textContent = config.emptyOptionText;
   emptyOption.disabled = true;
   emptyOption.selected = !config.selectedValue;
   selectElement.appendChild(emptyOption);
  }

  // Agregar opciones
  items.forEach((item) => {
   const option = document.createElement("option");

   if (typeof item === "object") {
    option.value = item.value;
    option.textContent = item.text;

    if (item.attributes) {
     Object.entries(item.attributes).forEach(([key, value]) => {
      option.dataset[key] = value;
     });
    }
   } else {
    option.value = item;
    option.textContent = item;
   }

   if (config.selectedValue && option.value === config.selectedValue) {
    option.selected = true;
   }

   selectElement.appendChild(option);
  });
 }

 static getURLParameters() {
  const params = new URLSearchParams(window.location.search);
  return {
   source: params.get("utm_source") || "",
   subSource: params.get("utm_subsource") || "",
   mean: params.get("utm_medium") || "",
   campaign: params.get("utm_campaign") || FormConfig.PERSONALIZATION.CAMPAIGN,
  };
 }

 static createPrefixOverlay(container, code) {
  // Remover overlay existente
  const existing = container.querySelector("#custom-prefix-display");
  if (existing) existing.remove();

  // Crear nuevo overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-prefix-display";
  overlay.textContent = `+${code}`;

  container.style.position = "relative";
  container.appendChild(overlay);

  return overlay;
 }

 static removePrefixOverlay(container) {
  const overlay = container.querySelector("#custom-prefix-display");
  if (overlay) {
   overlay.remove();
  }
 }

 static resetSelectAppearance(selectElement) {
  selectElement.style.color = "";
  selectElement.style.textShadow = "";
  selectElement.style.textIndent = "";
 }
}

// ============================================
// GESTOR DE CACHE
// ============================================
class CacheManager {
 static KEYS = {
  DATA: "jv_form_data",
  TIMESTAMP: "jv_form_timestamp",
 };

 static get EXPIRATION() {
  return (
   (FormConfig.PERSONALIZATION.CACHE_EXPIRATION_HOURS || 24) * 60 * 60 * 1000
  );
 }

 static isEnabled() {
  return FormConfig.PERSONALIZATION.CACHE_ENABLED !== false;
 }

 static get() {
  // Si el caché está deshabilitado, siempre retornar null
  if (!this.isEnabled()) {
   console.log("📦 Caché deshabilitado - omitiendo lectura");
   return null;
  }

  try {
   const dataJSON = localStorage.getItem(this.KEYS.DATA);
   if (!dataJSON) return null;

   const data = JSON.parse(dataJSON);
   const timestamp = localStorage.getItem(this.KEYS.TIMESTAMP);
   const isValid =
    timestamp && Date.now() - parseInt(timestamp) < this.EXPIRATION;

   if (isValid) {
    console.log(
     `📦 Usando datos en caché (válido por ${Math.round(
      (this.EXPIRATION - (Date.now() - parseInt(timestamp))) / (1000 * 60 * 60)
     )} horas más)`
    );
    return data;
   }

   console.log("📦 Caché expirado - limpiando");
   this.clear();
   return null;
  } catch (error) {
   console.error("Error al leer caché:", error);
   return null;
  }
 }

 static set(data) {
  // Si el caché está deshabilitado, no guardar
  if (!this.isEnabled()) {
   console.log("📦 Caché deshabilitado - omitiendo guardado");
   return;
  }

  try {
   localStorage.setItem(this.KEYS.DATA, JSON.stringify(data));
   localStorage.setItem(this.KEYS.TIMESTAMP, Date.now().toString());
   console.log(
    `📦 Datos guardados en caché por ${
     FormConfig.PERSONALIZATION.CACHE_EXPIRATION_HOURS || 24
    } horas`
   );
  } catch (error) {
   console.error("Error al guardar en caché:", error);
   this.clear();
  }
 }

 static clear() {
  try {
   localStorage.removeItem(this.KEYS.DATA);
   localStorage.removeItem(this.KEYS.TIMESTAMP);
   console.log("📦 Caché limpiado");
  } catch (error) {
   console.error("Error al limpiar caché:", error);
  }
 }
}

// ============================================
// CARGADOR DE DATOS
// ============================================
class DataLoader {
 constructor(formState) {
  this.formState = formState;
 }

 async loadAll() {
  try {
   // Intentar cargar desde cache
   const cachedData = CacheManager.get();

   if (cachedData) {
    console.log("📦 Usando datos en cache");
    this.formState.loadedData = cachedData;
    return;
   }

   console.log("🔄 Cargando datos desde endpoints...");

   // Cargar desde endpoints
   const [locations, prefixes, programs, periods] = await Promise.all([
    fetch(FormConfig.URLS.DATA_SOURCES.LOCATIONS).then((r) => r.json()),
    fetch(FormConfig.URLS.DATA_SOURCES.PREFIXES).then((r) => r.json()),
    fetch(FormConfig.URLS.DATA_SOURCES.PROGRAMS).then((r) => r.json()),
    fetch(FormConfig.URLS.DATA_SOURCES.PERIODS).then((r) => r.json()),
   ]);

   // Procesar datos
   this.formState.loadedData = {
    locations,
    prefixes: prefixes.map((country) => ({
     iso2: country.iso2,
     phoneCode: country.phoneCode,
     phoneName: country.nameES,
    })),
    programs,
    periods,
   };

   // Guardar en cache
   CacheManager.set(this.formState.loadedData);

   console.log("✅ Datos cargados correctamente");
  } catch (error) {
   console.error("❌ Error al cargar datos:", error);
   throw error;
  }
 }
}

// ============================================
// VALIDADORES
// ============================================
class Validators {
 static required(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
 }

 static email(value) {
  if (!value) return false;
  return FormConfig.VALIDATION.EMAIL_REGEX.test(value);
 }

 static phone(value) {
  if (!value) return false;
  const clean = Utils.cleanNumbers(value);
  return (
   clean.length >= FormConfig.VALIDATION.PHONE_MIN_LENGTH &&
   clean.length <= FormConfig.VALIDATION.PHONE_MAX_LENGTH
  );
 }

 static document(value, type) {
  if (!value || !value.trim()) return false;

  const docValue = value.trim();

  switch (type) {
   case "CC":
    return /^\d{6,10}$/.test(docValue);
   case "CE":
    return /^[A-Za-z0-9]{6,12}$/.test(docValue);
   case "PA":
    return /^[A-Za-z0-9]{6,15}$/.test(docValue);
   case "TI":
    return /^\d{10,11}$/.test(docValue);
   default:
    return docValue.length >= 6 && docValue.length <= 15;
  }
 }
}

// ============================================
// GESTOR DE UI
// ============================================
class UIManager {
 constructor(formState) {
  this.formState = formState;
 }

 updateFieldUI(element, errorElement, isValid, errorMessage) {
  if (!element) return;

  if (isValid) {
   element.classList.remove("jv-error");
   element.classList.add("jv-validated");
  } else {
   element.classList.add("jv-error");
   element.classList.remove("jv-validated");
  }

  if (errorElement) {
   errorElement.textContent = errorMessage;
   errorElement.style.display = isValid ? "none" : "block";
  }
 }

 showErrors(errors) {
  if (!errors?.length) return;

  const errorBtn = Utils.getElementById("error_modal_open_button");
  const errorContent = Utils.getElementById("errorModalContent");

  if (!errorBtn || !errorContent) return;

  // Actualizar contador
  const errorCount = errorBtn.querySelector(".jv-error-count");
  if (errorCount) {
   errorCount.textContent = errors.length.toString();
  }

  // Mostrar botón
  errorBtn.style.display = "flex";
  errorBtn.classList.add("jv-error-button-pulse");
  setTimeout(() => errorBtn.classList.remove("jv-error-button-pulse"), 1000);

  // Generar lista de errores
  const errorList = errors
   .map(
    (error) =>
     `<li>
            <div class="jv-error-item">
              <i class="fas fa-exclamation-circle"></i>
              <div class="jv-error-item-content">${error}</div>
            </div>
          </li>`
   )
   .join("");

  errorContent.innerHTML = `<ul class="jv-error-list">${errorList}</ul>`;
 }

 setSubmitButtonState(isSubmitting) {
  const submitBtn = Utils.getElementById(FormConfig.SELECTORS.SUBMIT);
  if (!submitBtn) return;

  if (isSubmitting) {
   submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
   submitBtn.disabled = true;
  } else {
   submitBtn.innerHTML = "Inscríbete ahora";
   submitBtn.disabled = false;
  }
 }
}

// ============================================
// GESTOR DE CAMPOS
// ============================================
class FormController {
 constructor() {
  this.formState = new FormState();
  this.dataLoader = new DataLoader(this.formState);
  this.uiManager = new UIManager(this.formState);
  this.fieldManager = new FieldManager(this.formState, this.uiManager);
  this.validationManager = new ValidationManager(
   this.formState,
   this.uiManager
  );
 }

 async init() {
  try {
   console.log("🚀 Inicializando formulario...");

   // 1. Cargar datos
   await this.dataLoader.loadAll();

   // 2. Obtener parámetros UTM
   this.loadUTMParameters();

   // 3. Configurar campos
   this.fieldManager.initializeFields();

   // 4. Configurar validación
   this.validationManager.setupValidation();

   // 5. Configurar envío
   this.setupFormSubmission();

   console.log("✅ Formulario inicializado correctamente");
  } catch (error) {
   console.error("❌ Error al inicializar:", error);
  }
 }

 loadUTMParameters() {
  const params = Utils.getURLParameters();
  Object.entries(params).forEach(([key, value]) => {
   this.formState.setField(key, value);
  });

  console.log("📌 Parámetros UTM cargados:", params);
 }

 setupFormSubmission() {
  const form = Utils.getElementById(FormConfig.SELECTORS.FORM);
  if (!form) return;

  form.addEventListener("submit", (event) => {
   event.preventDefault();

   if (this.formState.ui.isSubmitting) return;

   if (this.validationManager.validateAll()) {
    this.submitForm(form);
   } else {
    this.uiManager.showErrors(this.formState.validation.errors);
   }
  });
 }

 async submitForm(form) {
  this.formState.ui.isSubmitting = true;
  this.uiManager.setSubmitButtonState(true);

  try {
   this.prepareFormForSubmission(form);

   if (FormConfig.PERSONALIZATION.DEV_MODE) {
    this.simulateSubmission(form);
   } else {
    setTimeout(() => form.submit(), 1500);
   }
  } catch (error) {
   console.error("Error al enviar:", error);
   this.formState.ui.isSubmitting = false;
   this.uiManager.setSubmitButtonState(false);
  }
 }

 prepareFormForSubmission(form) {
  // Limpiar campos ocultos previos
  form.querySelectorAll('input[type="hidden"]').forEach((field) => {
   if (field.name !== "oid" && field.name !== "retURL") {
    field.remove();
   }
  });

  // Configuración según modo
  const config = FormConfig.PERSONALIZATION.DEBUG_MODE
   ? this.getDebugConfig()
   : this.getProdConfig();

  // Crear campos necesarios
  Utils.createHiddenField(form, "oid", config.OID);
  Utils.createHiddenField(form, "retURL", FormConfig.URLS.THANK_YOU);

  // Mapear campos
  Object.entries(this.formState.data).forEach(([fieldName, value]) => {
   const sfField = config.FIELD_MAPPING[fieldName];
   if (sfField && value) {
    Utils.createHiddenField(form, sfField, value);
   }
  });

  form.action = config.URL;
 }

 simulateSubmission(form) {
  console.log("🔍 MODO DESARROLLO - Simulando envío");
  console.table(this.formState.data);

  setTimeout(() => {
   this.formState.ui.isSubmitting = false;
   this.uiManager.setSubmitButtonState(false);
  }, 2000);
 }

 getProdConfig() {
  return {
   URL: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
   OID: "00Df4000003l8Bf",
   FIELD_MAPPING: {
    oid: "oid",
    retURL: "retURL",
    firstName: "first_name",
    lastName: "last_name",
    typeDocument: "00N5G00000WmhsT",
    document: "00N5G00000WmhsR",
    email: "email",
    phoneCode: "00NJw000002mzb7",
    phone: "mobile",
    country: "00N5G00000WmhvJ",
    department: "00N5G00000WmhvX",
    city: "00N5G00000WmhvO",
    admissionPeriod: "00N5G00000WmhvI",
    originCandidate: "lead_source",
    sourceAuthorization: "00N5G00000WmhvT",
    program: "00N5G00000WmhvV",
    typeAttendee: "00NJw000001J3g6",
    academicLevel: "nivelacademico",
    faculty: "Facultad",
    dayAttendance: "00NJw000004iuIj",
    school: "00NJw0000041omr",
    originRequest: "00NJw000001J3Hl",
    source: "00N5G00000WmhvW",
    subSource: "00N5G00000WmhvZ",
    mean: "00NJw000001J3g8",
    campaign: "00N5G00000Wmi8x",
    dataAuthorization: "00N5G00000WmhvF",
   },
  };
 }

 getDebugConfig() {
  return {
   URL: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
   OID: "00D7j0000004eQD",
   FIELD_MAPPING: {
    oid: "oid",
    retURL: "retURL",
    firstName: "first_name",
    lastName: "last_name",
    typeDocument: "00N7j000002BI3X",
    document: "00N7j000002BI3V",
    email: "email",
    phoneCode: "00NO4000002lUPh",
    phone: "mobile",
    country: "00N7j000002BY1c",
    department: "00N7j000002BY1h",
    city: "00N7j000002BY1i",
    admissionPeriod: "00N7j000002BY2L",
    originCandidate: "lead_source",
    sourceAuthorization: "00N7j000002BY26",
    program: "00N7j000002BI3p",
    typeAttendee: "00NO40000000sTR",
    academicLevel: "nivelacademico",
    faculty: "Facultad",
    dayAttendance: "00NO4000007qrPB",
    school: "00NO4000005begL",
    originRequest: "00NO40000002ZeP",
    source: "00N7j000002BKgW",
    subSource: "00N7j000002BKgb",
    mean: "00NO40000001izt",
    campaign: "00N7j000002BfkF",
    dataAuthorization: "00N7j000002BI3m",
   },
  };
 }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener("DOMContentLoaded", () => {
 const formController = new FormController();
 formController.init();
});

// ============================================
// * GESTOR DE CAMPOS DEL FORMULARIO
// ============================================

/**
 * Gestor de Campos del Formulario
 * Maneja la inicialización y comportamiento de los campos
 */

class FieldManager {
 constructor(formState, uiManager) {
  this.formState = formState;
  this.uiManager = uiManager;
 }

 initializeFields() {
  this.initializeCountries();
  this.initializePrefixes();
  this.initializeTypeAttendee();
  this.initializeAttendanceDay();
  this.initializeAcademicLevel();
  this.setupDependentFields();
 }

 // ============================================
 // INICIALIZACIÓN DE CAMPOS
 // ============================================

 initializeCountries() {
  const countrySelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.COUNTRY
  );
  if (!countrySelect || !this.formState.loadedData.locations) return;

  const countries = Object.entries(this.formState.loadedData.locations)
   .map(([code, country]) => ({
    value: code,
    text: country.nombre,
   }))
   .sort((a, b) =>
    a.value === "COL"
     ? -1
     : b.value === "COL"
     ? 1
     : a.text.localeCompare(b.text)
   );

  Utils.generateSelectOptions(countrySelect, countries, {
   selectedValue: "COL",
   emptyOptionText: "Seleccione un país",
  });

  this.formState.setField("country", "COL");
  this.formState.setFieldValidation("country", true);

  this.loadDepartments();
 }

 initializePrefixes() {
  const prefixSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PHONE_CODE
  );
  if (!prefixSelect || !this.formState.loadedData.prefixes) return;

  const prefixes = this.formState.loadedData.prefixes
   .map((country) => ({
    value: country.phoneCode,
    text: `+${country.phoneCode} - ${country.phoneName}`,
    attributes: {
     iso2: country.iso2.toUpperCase(),
     flagUrl: `https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/${country.iso2.toUpperCase()}.svg`,
    },
   }))
   .sort((a, b) =>
    a.text.includes("Colombia") ? -1 : b.text.includes("Colombia")
   );

  Utils.generateSelectOptions(prefixSelect, prefixes, {
   selectedValue: "57",
   emptyOptionText: "Código",
  });

  this.formState.setField("phoneCode", "57");
  this.formState.setFieldValidation("phoneCode", true);

  // Ocultar error de teléfono inicialmente
  const errorElement = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PHONE_ERROR,
   false
  );
  if (errorElement) errorElement.style.display = "none";

  // Inicializar displays
  setTimeout(() => {
   this.updateCountryFlag();
   this.updatePrefixDisplay();
  }, 50);
 }

 initializeTypeAttendee() {
  const typeSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.TYPE_ATTENDEE
  );
  if (!typeSelect) return;

  const types = FormConfig.PERSONALIZATION.TYPE_ATTENDEE;

  if (types.length === 1) {
   // Auto-seleccionar si solo hay una opción
   this.hideAndSelectSingle(typeSelect, types[0], "TYPE_ATTENDEE");
   this.handleAcademicFieldsVisibility(types[0]);
  } else {
   const typeOptions = types.map((type) => ({ value: type, text: type }));
   Utils.generateSelectOptions(typeSelect, typeOptions, {
    emptyOptionText: "Seleccione tipo de asistente",
   });
   this.handleAcademicFieldsVisibility("");
  }
 }

 initializeAttendanceDay() {
  const daySelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ATTENDANCE_DAY
  );
  if (!daySelect) return;

  const attendanceDays = FormConfig.PERSONALIZATION.ATTENDANCE_DAYS || [];

  if (attendanceDays.length === 0) {
   // Sin días configurados: ocultar campo
   const dayRow =
    daySelect.closest(".jv-form-row") || daySelect.closest(".jv-form-group");
   if (dayRow) {
    dayRow.style.display = "none";
   }
   console.log("📅 No hay días de asistencia configurados - campo oculto");
   return;
  }

  if (attendanceDays.length === 1) {
   // Solo un día: ocultar campo y preseleccionar
   const dayRow =
    daySelect.closest(".jv-form-row") || daySelect.closest(".jv-form-group");
   if (dayRow) {
    dayRow.style.display = "none";
    console.log(
     "📅 Un solo día de asistencia - campo oculto y preseleccionado"
    );
   }

   // Limpiar y establecer la única opción
   daySelect.innerHTML = "";
   const option = document.createElement("option");
   option.value = attendanceDays[0];
   option.textContent = attendanceDays[0];
   option.selected = true;
   daySelect.appendChild(option);

   // Mantener habilitado para envío pero oculto en UI
   daySelect.disabled = false;
   daySelect.required = false; // No required porque está oculto

   // Actualizar estado inmediatamente
   this.formState.setField("dayAttendance", attendanceDays[0]);
   this.formState.setFieldValidation("dayAttendance", true);

   console.log(
    `📅 Día de asistencia configurado automáticamente: ${attendanceDays[0]}`
   );
  } else {
   // Múltiples días: mostrar select normalmente
   const dayRow =
    daySelect.closest(".jv-form-row") || daySelect.closest(".jv-form-group");
   if (dayRow) {
    dayRow.style.display = "block";
   }

   const dayOptions = attendanceDays.map((day) => ({
    value: day,
    text: day,
   }));

   Utils.generateSelectOptions(daySelect, dayOptions, {
    emptyOptionText: "Seleccione día de asistencia",
   });

   daySelect.disabled = false;
   daySelect.required = true;

   console.log(
    `📅 Select de día de asistencia inicializado con ${attendanceDays.length} opciones`
   );
  }
 }

 initializeAcademicLevel() {
  const levelSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL
  );
  if (!levelSelect) return;

  let filteredLevels = this.filterAcademicLevels();

  if (filteredLevels.length === 1) {
   // Solo una opción: ocultar el campo y preseleccionar
   const academicLevelRow = Utils.getElementById("academic_level_row", false);
   if (academicLevelRow) {
    academicLevelRow.style.display = "none";
    console.log("✅ Fila de nivel académico ocultada - valor único");
   }

   // Limpiar y establecer la única opción
   levelSelect.innerHTML = "";
   const option = document.createElement("option");
   option.value = filteredLevels[0].code;
   option.textContent = filteredLevels[0].name;
   option.selected = true;
   levelSelect.appendChild(option);

   // CORRECCIÓN: Mantener habilitado y required para validación
   levelSelect.disabled = false;
   levelSelect.required = true; // IMPORTANTE: Mantener required aunque esté oculto

   // Actualizar estado inmediatamente
   this.formState.setField("academicLevel", filteredLevels[0].code);
   this.formState.setFieldValidation("academicLevel", true);

   console.log(
    `🔧 Campo nivel académico configurado automáticamente: ${filteredLevels[0].name}`
   );

   // Si el tipo ya es aspirante, cargar facultades
   if (this.formState.data.typeAttendee === "Aspirante") {
    setTimeout(() => this.loadFaculties(), 100);
   }
  } else if (filteredLevels.length === 0) {
   // Sin opciones: mostrar mensaje y deshabilitar
   const academicLevelRow = Utils.getElementById("academic_level_row", false);
   if (academicLevelRow) {
    academicLevelRow.style.display = "block";
   }

   this.showNoOptionsMessage(levelSelect, "No hay niveles disponibles");
   levelSelect.disabled = true;
   levelSelect.required = false;
  } else {
   // Múltiples opciones: mostrar el select normalmente
   const academicLevelRow = Utils.getElementById("academic_level_row", false);
   if (academicLevelRow) {
    academicLevelRow.style.display = "block";
   }

   const levelOptions = filteredLevels.map((level) => ({
    value: level.code,
    text: level.name,
   }));

   Utils.generateSelectOptions(levelSelect, levelOptions, {
    emptyOptionText: "Seleccione nivel académico",
   });

   levelSelect.disabled = false;
   levelSelect.required = true;

   console.log(
    `📋 Select de nivel académico inicializado con ${filteredLevels.length} opciones`
   );
  }
 }

 // ============================================
 // CARGA DE DATOS DEPENDIENTES
 // ============================================

 loadDepartments() {
  const deptContainer = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.DEPARTMENT
  );
  const deptSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.DEPARTMENT
  );

  if (!deptContainer || !deptSelect) return;

  const isColombia = this.formState.data.country === "COL";

  deptContainer.style.display = isColombia ? "block" : "none";
  deptSelect.required = isColombia;

  if (isColombia) {
   const departments =
    this.formState.loadedData.locations.COL?.departamentos || [];
   const deptOptions = departments
    .map((dept) => ({ value: dept.codigo, text: dept.nombre }))
    .sort((a, b) => a.text.localeCompare(b.text));

   Utils.generateSelectOptions(deptSelect, deptOptions, {
    emptyOptionText: "Seleccione un departamento",
   });
  } else {
   this.resetField("department");
   this.resetField("city");
  }
 }

 loadCities() {
  const cityContainer = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.CITY
  );
  const citySelect = Utils.getElementById(FormConfig.SELECTORS.FIELDS.CITY);

  if (!cityContainer || !citySelect) return;

  const selectedDept = this.formState.data.department;

  if (selectedDept) {
   cityContainer.style.display = "block";
   citySelect.required = true;

   const department =
    this.formState.loadedData.locations.COL?.departamentos.find(
     (d) => d.codigo === selectedDept
    );

   if (department?.ciudades) {
    const cityOptions = department.ciudades
     .map((city) => ({ value: city.codigo, text: city.nombre }))
     .sort((a, b) => a.text.localeCompare(b.text));

    Utils.generateSelectOptions(citySelect, cityOptions, {
     emptyOptionText: "Seleccione una ciudad",
    });
   }
  } else {
   cityContainer.style.display = "none";
   citySelect.required = false;
   this.resetField("city");
  }
 }

 loadFaculties() {
  const facultyRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.FACULTY_ROW
  );
  const facultySelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.FACULTY
  );

  if (!facultyRow || !facultySelect) return;

  const academicLevel = this.formState.data.academicLevel;

  if (!academicLevel) {
   this.hideElement(facultyRow);
   return;
  }

  const filteredFaculties = this.getFilteredFaculties(academicLevel);

  if (filteredFaculties.length === 1) {
   this.hideAndSelectSingle(
    facultySelect,
    filteredFaculties[0].value,
    "FACULTY",
    facultyRow
   );
   setTimeout(() => this.loadPrograms(), 100);
  } else if (filteredFaculties.length === 0) {
   this.showNoOptionsMessage(
    facultySelect,
    "No hay facultades disponibles",
    facultyRow
   );
  } else {
   this.showElement(facultyRow);
   this.enableField(facultySelect);
   Utils.generateSelectOptions(facultySelect, filteredFaculties, {
    emptyOptionText: "Seleccione una facultad",
   });
  }
 }

 loadPrograms() {
  const programRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PROGRAM_ROW
  );
  const programSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PROGRAM
  );

  if (!programRow || !programSelect) return;

  const { academicLevel, faculty } = this.formState.data;

  if (!faculty) {
   this.hideElement(programRow);
   return;
  }

  const programs = this.getFilteredPrograms(academicLevel, faculty);

  if (programs.length === 1) {
   this.hideAndSelectSingle(
    programSelect,
    programs[0].value,
    "PROGRAM",
    programRow
   );
   setTimeout(() => this.loadPeriods(), 100);
  } else if (programs.length === 0) {
   this.showNoOptionsMessage(
    programSelect,
    "No hay programas disponibles",
    programRow
   );
  } else {
   this.showElement(programRow);
   this.enableField(programSelect);
   Utils.generateSelectOptions(programSelect, programs, {
    emptyOptionText: "Seleccione un programa",
   });
  }
 }

 loadPeriods() {
  const periodRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PERIOD_ROW
  );
  const periodSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD
  );

  if (!periodRow || !periodSelect) return;

  const academicLevel = this.formState.data.academicLevel;

  if (!academicLevel || !this.formState.loadedData.periods[academicLevel]) {
   this.hideElement(periodRow);
   return;
  }

  const periods = Object.entries(
   this.formState.loadedData.periods[academicLevel]
  )
   .map(([code, name]) => ({ value: name, text: code }))
   .sort((a, b) => a.text.localeCompare(b.text));

  this.showElement(periodRow);
  this.enableField(periodSelect);
  Utils.generateSelectOptions(periodSelect, periods, {
   emptyOptionText: "Seleccione un periodo",
  });
 }

 // ============================================
 // CONFIGURACIÓN DE EVENTOS
 // ============================================

 setupDependentFields() {
  this.setupFieldEvent("TYPE_ATTENDEE", (value) => {
   this.formState.setField("typeAttendee", value);
   this.handleAcademicFieldsVisibility(value);

   if (value === "Aspirante") {
    setTimeout(() => {
     this.ensureAcademicFieldsEnabled();
    }, 100);
   }
  });

  this.setupFieldEvent("ATTENDANCE_DAY", (value) => {
   this.formState.setField("dayAttendance", value);
   console.log(`📅 Día de asistencia seleccionado: ${value}`);
  });

  this.setupFieldEvent("COUNTRY", (value) => {
   this.formState.setField("country", value);
   this.loadDepartments();
  });

  this.setupFieldEvent("DEPARTMENT", (value) => {
   this.formState.setField("department", value);
   this.loadCities();
  });

  this.setupFieldEvent("CITY", (value) => {
   this.formState.setField("city", value);
  });

  this.setupFieldEvent("ACADEMIC_LEVEL", (value) => {
   this.formState.setField("academicLevel", value);
   this.loadFaculties();
  });

  this.setupFieldEvent("FACULTY", (value) => {
   this.formState.setField("faculty", value);
   this.loadPrograms();
  });

  this.setupFieldEvent("PROGRAM", (value) => {
   this.formState.setField("program", value);
   this.loadPeriods();
  });

  this.setupFieldEvent("ADMISSION_PERIOD", (value) => {
   this.formState.setField("admissionPeriod", value);
  });

  // Configurar teléfono con formateo
  this.setupPhoneField();
 }

 // Asegurar que los campos académicos estén habilitados
 ensureAcademicFieldsEnabled() {
  console.log("🔧 Verificando estado de campos académicos...");

  const academicLevelSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
   false
  );
  const academicLevelRow = Utils.getElementById("academic_level_row", false);

  if (!academicLevelSelect) {
   console.warn("⚠️ Campo de nivel académico no encontrado");
   return;
  }

  // Verificar si el campo está oculto pero debería estar visible
  const filteredLevels = this.filterAcademicLevels();
  const shouldBeVisible = filteredLevels.length > 1;

  if (shouldBeVisible) {
   // Mostrar el campo si debería estar visible
   if (academicLevelRow && academicLevelRow.style.display === "none") {
    console.log("🔧 Mostrando campo de nivel académico para aspirante");
    academicLevelRow.style.display = "block";
   }

   // Habilitar el campo
   if (academicLevelSelect.disabled) {
    console.log("🔧 Habilitando campo de nivel académico");
    academicLevelSelect.disabled = false;
    academicLevelSelect.required = true;
    academicLevelSelect.classList.remove("jv-error");
   }
  }

  // Debug del estado actual
  this.debugAcademicFieldState();
 }

 setupFieldEvent(fieldKey, callback) {
  const fieldId = FormConfig.SELECTORS.FIELDS[fieldKey];
  const element = Utils.getElementById(fieldId, false);

  if (element) {
   element.addEventListener("change", (e) => {
    callback(e.target.value);
   });
  }
 }

 setupPhoneField() {
  const phoneInput = Utils.getElementById(FormConfig.SELECTORS.FIELDS.PHONE);
  const prefixSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PHONE_CODE
  );

  if (phoneInput) {
   phoneInput.addEventListener("input", (e) => {
    const cleaned = Utils.cleanNumbers(e.target.value);

    this.formState.setField("phone", cleaned);
   });
  }

  if (prefixSelect) {
   prefixSelect.addEventListener("change", (e) => {
    this.formState.setField("phoneCode", e.target.value);
    this.updateCountryFlag(); // Esto ahora también actualiza el display
   });

   // Actualizar display inicial
   setTimeout(() => {
    this.updatePrefixDisplay();
   }, 100);
  }
 }

 getStateFieldName(key) {
  const mapping = {
   typeattendee: "typeAttendee",
   academiclevel: "academicLevel",
   admissionperiod: "admissionPeriod",
  };
  return mapping[key] || key;
 }

 // ============================================
 // MÉTODOS DE FILTRADO
 // ============================================

 filterAcademicLevels() {
  const { FACULTY, PROGRAMS } = FormConfig.PERSONALIZATION;
  let filtered = [...FormConfig.PERSONALIZATION.LEVEL_ACADEMIC];

  // Si hay configuraciones específicas, filtrar
  if (FACULTY?.length > 0 || PROGRAMS?.length > 0) {
   filtered = filtered.filter((level) => {
    return this.levelHasValidContent(level.code, FACULTY, PROGRAMS);
   });
  }

  return filtered;
 }

 levelHasValidContent(levelCode, faculties, programs) {
  const levelData = this.formState.loadedData.programs[levelCode];
  if (!levelData) return false;

  // Verificar si hay facultades válidas
  if (faculties?.length > 0) {
   for (const facultyCode in levelData) {
    if (
     faculties.includes(facultyCode) ||
     faculties.includes(levelData[facultyCode].FacultadCodigo)
    ) {
     if (levelData[facultyCode].Programas?.length > 0) {
      return true;
     }
    }
   }
  }

  // Verificar si hay programas válidos
  if (programs?.length > 0) {
   for (const facultyCode in levelData) {
    const facultyPrograms = levelData[facultyCode].Programas || [];
    if (facultyPrograms.some((program) => programs.includes(program.Codigo))) {
     return true;
    }
   }
  }

  return faculties?.length === 0 && programs?.length === 0;
 }

 getFilteredFaculties(academicLevel) {
  const levelData = this.formState.loadedData.programs[academicLevel];
  if (!levelData) return [];

  const { FACULTY, PROGRAMS } = FormConfig.PERSONALIZATION;
  let faculties = [];

  if (PROGRAMS?.length > 0) {
   // Filtrar por programas específicos
   const validFaculties = new Set();
   for (const [facultyCode, facultyData] of Object.entries(levelData)) {
    const matchingPrograms =
     facultyData.Programas?.filter((program) =>
      PROGRAMS.includes(program.Codigo)
     ) || [];
    if (matchingPrograms.length > 0) {
     validFaculties.add(facultyCode);
    }
   }
   faculties = Array.from(validFaculties).map((code) => ({
    value: code,
    text: levelData[code].FacultadCodigo,
   }));
  } else if (FACULTY?.length > 0) {
   // Filtrar por facultades específicas
   faculties = FACULTY.map((facultyName) => {
    // Buscar por código o nombre
    const found = Object.entries(levelData).find(
     ([code, data]) =>
      code === facultyName || data.FacultadCodigo === facultyName
    );

    if (found && found[1].Programas?.length > 0) {
     return { value: found[0], text: found[1].FacultadCodigo };
    }
    return null;
   }).filter(Boolean);
  } else {
   // Mostrar todas las facultades
   faculties = Object.entries(levelData)
    .filter(([code, data]) => data.Programas?.length > 0)
    .map(([code, data]) => ({ value: code, text: data.FacultadCodigo }))
    .sort((a, b) => a.text.localeCompare(b.text));
  }

  return faculties;
 }

 getFilteredPrograms(academicLevel, faculty) {
  const facultyData =
   this.formState.loadedData.programs[academicLevel]?.[faculty];
  if (!facultyData?.Programas) return [];

  let programs = facultyData.Programas.map((program) => ({
   value: program.Codigo,
   text: program.Nombre,
  }));

  // Filtrar por programas específicos si están configurados
  const { PROGRAMS } = FormConfig.PERSONALIZATION;
  if (PROGRAMS?.length > 0) {
   programs = programs.filter((program) => PROGRAMS.includes(program.value));
  }

  return programs.sort((a, b) => a.text.localeCompare(b.text));
 }

 // ============================================
 // MANEJO DE VISIBILIDAD ACADÉMICA
 // ============================================

 handleAcademicFieldsVisibility(typeAttendee) {
  const isAspirant = typeAttendee === "Aspirante";
  console.log(
   `🎓 Tipo de asistente: "${typeAttendee}" - Es aspirante: ${isAspirant}`
  );

  // Obtener elementos académicos
  const academicLevelRow = Utils.getElementById("academic_level_row", false);
  const facultyRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.FACULTY_ROW,
   false
  );
  const programRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PROGRAM_ROW,
   false
  );
  const periodRow = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PERIOD_ROW,
   false
  );

  const academicLevelSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
   false
  );
  const facultySelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.FACULTY,
   false
  );
  const programSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PROGRAM,
   false
  );
  const periodSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
   false
  );

  if (isAspirant) {
   console.log("✅ Configurando campos académicos para aspirante");

   // Verificar configuración de niveles académicos
   const filteredLevels = this.filterAcademicLevels();

   if (filteredLevels.length === 1) {
    // Un solo nivel: mantener oculto pero funcional
    if (academicLevelRow) {
     academicLevelRow.style.display = "none";
    }

    if (academicLevelSelect) {
     // Asegurar que el valor esté configurado correctamente
     if (!academicLevelSelect.value || academicLevelSelect.value === "") {
      academicLevelSelect.innerHTML = "";
      const option = document.createElement("option");
      option.value = filteredLevels[0].code;
      option.textContent = filteredLevels[0].name;
      option.selected = true;
      academicLevelSelect.appendChild(option);
     }

     // CORRECCIÓN IMPORTANTE: Mantener required para validación
     academicLevelSelect.disabled = false;
     academicLevelSelect.required = true;

     this.formState.setField("academicLevel", filteredLevels[0].code);
     this.formState.setFieldValidation("academicLevel", true);

     console.log("🔧 Nivel académico único configurado correctamente");
    }
   } else if (filteredLevels.length > 1) {
    // Múltiples niveles: mostrar select
    if (academicLevelRow) {
     academicLevelRow.style.display = "block";
    }
    if (academicLevelSelect) {
     academicLevelSelect.disabled = false;
     academicLevelSelect.required = true;
     academicLevelSelect.classList.remove("jv-error");
    }
   }

   // Mostrar otros campos académicos según corresponda
   this.showAcademicFieldsIfNeeded();

   // Reset valores de campos dependientes
   this.resetDependentAcademicFields();

   // Si ya hay un nivel académico configurado, cargar facultades
   const currentLevel =
    this.formState.data.academicLevel ||
    (academicLevelSelect && academicLevelSelect.value);
   if (currentLevel && currentLevel !== "") {
    console.log(`🔄 Cargando facultades para nivel: ${currentLevel}`);
    setTimeout(() => this.loadFaculties(), 100);
   }
  } else {
   console.log("❌ Ocultando campos académicos para no-aspirante");

   // Ocultar todos los contenedores
   [academicLevelRow, facultyRow, programRow, periodRow].forEach((row) => {
    if (row) row.style.display = "none";
   });

   // Deshabilitar todos los selects académicos
   [academicLevelSelect, facultySelect, programSelect, periodSelect].forEach(
    (select) => {
     if (select) {
      select.disabled = true;
      select.required = false;
     }
    }
   );

   // Establecer valores por defecto para no-aspirantes
   this.setNonAspirantDefaults();
  }
 }

 // Mostrar campos académicos según sea necesario
 showAcademicFieldsIfNeeded() {
  const academicLevel = this.formState.data.academicLevel;
  const faculty = this.formState.data.faculty;
  const program = this.formState.data.program;

  // Mostrar facultad si hay nivel académico
  if (academicLevel) {
   const facultyRow = Utils.getElementById(
    FormConfig.SELECTORS.CONTAINERS.FACULTY_ROW,
    false
   );
   const facultySelect = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.FACULTY,
    false
   );

   if (facultyRow && facultySelect) {
    facultyRow.style.display = "block";
    facultySelect.disabled = false;
    facultySelect.required = true;
   }
  }

  // Mostrar programa si hay facultad
  if (faculty) {
   const programRow = Utils.getElementById(
    FormConfig.SELECTORS.CONTAINERS.PROGRAM_ROW,
    false
   );
   const programSelect = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.PROGRAM,
    false
   );

   if (programRow && programSelect) {
    programRow.style.display = "block";
    programSelect.disabled = false;
    programSelect.required = true;
   }
  }

  // Mostrar período si hay programa
  if (program) {
   const periodRow = Utils.getElementById(
    FormConfig.SELECTORS.CONTAINERS.PERIOD_ROW,
    false
   );
   const periodSelect = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
    false
   );

   if (periodRow && periodSelect) {
    periodRow.style.display = "block";
    periodSelect.disabled = false;
    periodSelect.required = true;
   }
  }
 }

 // Reset solo campos dependientes
 resetDependentAcademicFields() {
  // Solo resetear campos dependientes, no el nivel académico
  const dependentFields = ["faculty", "program", "admissionPeriod"];

  dependentFields.forEach((field) => {
   this.formState.setField(field, "");
   this.formState.setFieldValidation(field, false);
  });

  console.log("🔄 Campos académicos dependientes reseteados");
 }

 debugAcademicFieldState() {
  const academicLevelRow = Utils.getElementById("academic_level_row", false);
  const academicLevelSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
   false
  );

  console.log("🔍 Estado del campo académico:", {
   rowExists: !!academicLevelRow,
   rowVisible: academicLevelRow
    ? academicLevelRow.style.display !== "none"
    : false,
   selectExists: !!academicLevelSelect,
   selectDisabled: academicLevelSelect ? academicLevelSelect.disabled : null,
   selectRequired: academicLevelSelect ? academicLevelSelect.required : null,
   selectValue: academicLevelSelect ? academicLevelSelect.value : null,
   selectOptionsCount: academicLevelSelect
    ? academicLevelSelect.options.length
    : 0,
   stateValue: this.formState.data.academicLevel,
   stateValid: this.formState.isFieldValid("academicLevel"),
   filteredLevelsCount: this.filterAcademicLevels().length,
  });
 }

 setNonAspirantDefaults() {
  const defaults = {
   academicLevel: "PREG",
   faculty: "NOAP",
   program: "NOAP",
   admissionPeriod: "2025-1",
  };

  Object.entries(defaults).forEach(([field, value]) => {
   this.formState.setField(field, value);
   this.formState.setFieldValidation(field, true);
  });
 }

 // ============================================
 // MÉTODOS AUXILIARES
 // ============================================

 hideAndSelectSingle(selectElement, value, fieldKey, container = null) {
  // Ocultar contenedor si se proporciona
  if (container) {
   container.style.display = "none";
  } else {
   const row = selectElement.closest(".jv-form-row");
   if (row) row.style.display = "none";
  }

  // Limpiar y establecer opción única
  selectElement.innerHTML = "";
  const option = document.createElement("option");
  option.value = value;
  option.textContent = value;
  option.selected = true;
  selectElement.appendChild(option);

  // Habilitar para que funcione aunque esté oculto
  selectElement.disabled = false;
  selectElement.required = true;

  // Actualizar estado
  const stateKey = fieldKey.toLowerCase().replace("_", "");
  const stateField = this.getStateFieldName(stateKey);
  this.formState.setField(stateField, value);
  this.formState.setFieldValidation(stateField, true);
 }

 showNoOptionsMessage(selectElement, message, container = null) {
  if (container) {
   container.style.display = "block";
  }

  selectElement.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = message;
  option.disabled = true;
  option.selected = true;
  selectElement.appendChild(option);
  selectElement.disabled = true;
 }

 showElement(element) {
  if (element) element.style.display = "block";
 }

 hideElement(element) {
  if (element) element.style.display = "none";
 }

 enableField(field) {
  if (field) {
   field.disabled = false;
   field.required = true;
   field.classList.remove("jv-error");
  }
 }

 resetField(fieldName) {
  this.formState.setField(fieldName, "");
  this.formState.setFieldValidation(fieldName, false);
 }

 updateCountryFlag() {
  const prefixSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PHONE_CODE
  );
  const flagImg = Utils.getElementById("flagImage", false);

  if (!prefixSelect || !flagImg) return;

  const selectedOption = prefixSelect.options[prefixSelect.selectedIndex];
  if (selectedOption?.dataset.flagUrl) {
   flagImg.src = selectedOption.dataset.flagUrl;
   flagImg.alt = selectedOption.textContent || "Bandera";
  }

  // También actualizar el display del prefijo
  this.updatePrefixDisplay();
 }

 updatePrefixDisplay() {
  const prefixSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PHONE_CODE
  );
  if (!prefixSelect) return;

  const selectedOption = prefixSelect.options[prefixSelect.selectedIndex];
  const container =
   prefixSelect.closest(".jv-phone-code-container") ||
   prefixSelect.closest(".phone-code-wrapper") ||
   prefixSelect.parentElement;

  if (!container) return;

  // Si no hay selección válida, mostrar el select normalmente
  if (!selectedOption || !selectedOption.value || selectedOption.value === "") {
   Utils.resetSelectAppearance(prefixSelect);
   Utils.removePrefixOverlay(container);
   return;
  }

  // Si hay selección válida, crear overlay y ocultar texto del select
  Utils.createPrefixOverlay(container, selectedOption.value);
 }
}

/**
 * Gestor de Validación del Formulario
 * Maneja toda la lógica de validación en tiempo real y envío
 */

class ValidationManager {
 constructor(formState, uiManager) {
  this.formState = formState;
  this.uiManager = uiManager;
  this.validationRules = this.createValidationRules();
 }

 // ============================================
 // CONFIGURACIÓN DE VALIDACIÓN
 // ============================================

 setupValidation() {
  this.setupRealtimeValidation();
  this.setupAuthorizationValidation();
  this.setupPhoneValidation();
 }

 createValidationRules() {
  return [
   {
    field: "firstName",
    selector: FormConfig.SELECTORS.FIELDS.FIRST_NAME,
    validator: Validators.required,
    message: "Ingresa un nombre",
    removable: "nombre",
   },
   {
    field: "lastName",
    selector: FormConfig.SELECTORS.FIELDS.LAST_NAME,
    validator: Validators.required,
    message: "Ingresa un apellido",
    removable: "apellido",
   },
   {
    field: "typeDocument",
    selector: FormConfig.SELECTORS.FIELDS.TYPE_DOCUMENT,
    validator: Validators.required,
    message: "Selecciona un tipo de documento",
    removable: "tipo_doc",
   },
   {
    field: "document",
    selector: FormConfig.SELECTORS.FIELDS.DOCUMENT,
    validator: (value) =>
     Validators.document(value, this.formState.data.typeDocument),
    message: "Ingresa un número de documento válido",
    removable: "documento",
   },
   {
    field: "email",
    selector: FormConfig.SELECTORS.FIELDS.EMAIL,
    validator: Validators.email,
    message: "Ingresa un correo electrónico válido",
    removable: "email",
   },
   {
    field: "phoneCode",
    selector: FormConfig.SELECTORS.FIELDS.PHONE_CODE,
    validator: Validators.required,
    message: "Selecciona un prefijo de país",
    removable: "telefono",
    errorSelector: FormConfig.SELECTORS.CONTAINERS.PHONE_ERROR,
   },
   {
    field: "phone",
    selector: FormConfig.SELECTORS.FIELDS.PHONE,
    validator: Validators.phone,
    message: "Ingresa un número de teléfono válido",
    removable: "telefono",
    errorSelector: FormConfig.SELECTORS.CONTAINERS.PHONE_ERROR,
   },
   {
    field: "country",
    selector: FormConfig.SELECTORS.FIELDS.COUNTRY,
    validator: Validators.required,
    message: "Selecciona un país",
    removable: "pais",
   },
   {
    field: "department",
    selector: FormConfig.SELECTORS.FIELDS.DEPARTMENT,
    validator: Validators.required,
    message: "Selecciona un departamento",
    removable: "departamento",
    conditional: () => this.formState.data.country === "COL",
   },
   {
    field: "city",
    selector: FormConfig.SELECTORS.FIELDS.CITY,
    validator: Validators.required,
    message: "Selecciona una ciudad",
    removable: "ciudad",
    conditional: () => this.formState.data.country === "COL",
   },
   {
    field: "typeAttendee",
    selector: FormConfig.SELECTORS.FIELDS.TYPE_ATTENDEE,
    validator: Validators.required,
    message: "Selecciona un tipo de asistente",
    removable: "tipo_asistente",
   },
   {
    field: "dayAttendance",
    selector: FormConfig.SELECTORS.FIELDS.ATTENDANCE_DAY,
    validator: Validators.required,
    message: "Selecciona un día de asistencia",
    removable: "dia_asistencia",
    conditional: () => {
     // Solo validar si hay días configurados y más de uno visible
     const attendanceDays = FormConfig.PERSONALIZATION.ATTENDANCE_DAYS || [];
     return attendanceDays.length > 1;
    },
   },
   {
    field: "academicLevel",
    selector: FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
    validator: Validators.required,
    message: "Debes seleccionar un nivel académico",
    removable: "nivel_academico",
    conditional: () => {
     const isAspirant = this.formState.data.typeAttendee === "Aspirante";
     // CORRECCIÓN: Un campo oculto pero required sigue siendo válido
     const hasValue =
      this.formState.data.academicLevel &&
      this.formState.data.academicLevel !== "";

     console.log("🔍 Validación nivel académico:", {
      isAspirant,
      hasValue,
      fieldValue: this.formState.data.academicLevel,
     });

     // Si es aspirante, debe validarse (incluso si está oculto)
     return isAspirant;
    },
   },
   {
    field: "faculty",
    selector: FormConfig.SELECTORS.FIELDS.FACULTY,
    validator: Validators.required,
    message: "Debes seleccionar una facultad",
    removable: "facultad",
    conditional: () => {
     const isAspirant = this.formState.data.typeAttendee === "Aspirante";
     const hasAcademicLevel = this.formState.data.academicLevel !== "";
     const isVisible = this.isFieldVisibleOrRequired(
      FormConfig.SELECTORS.FIELDS.FACULTY
     );

     console.log("🔍 Validación facultad:", {
      isAspirant,
      hasAcademicLevel,
      isVisible,
      fieldValue: this.formState.data.faculty,
     });

     return isAspirant && hasAcademicLevel && isVisible;
    },
   },
   {
    field: "program",
    selector: FormConfig.SELECTORS.FIELDS.PROGRAM,
    validator: Validators.required,
    message: "Debes seleccionar un programa",
    removable: "programa",
    conditional: () => {
     const isAspirant = this.formState.data.typeAttendee === "Aspirante";
     const hasFaculty = this.formState.data.faculty !== "";
     const isVisible = this.isFieldVisibleOrRequired(
      FormConfig.SELECTORS.FIELDS.PROGRAM
     );

     console.log("🔍 Validación programa:", {
      isAspirant,
      hasFaculty,
      isVisible,
      fieldValue: this.formState.data.program,
     });

     return isAspirant && hasFaculty && isVisible;
    },
   },
   {
    field: "admissionPeriod",
    selector: FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
    validator: Validators.required,
    message: "Debes seleccionar un periodo de interés",
    removable: "periodo",
    conditional: () => {
     const isAspirant = this.formState.data.typeAttendee === "Aspirante";
     const hasProgram = this.formState.data.program !== "";
     const isVisible = this.isFieldVisibleOrRequired(
      FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD
     );

     console.log("🔍 Validación período:", {
      isAspirant,
      hasProgram,
      isVisible,
      fieldValue: this.formState.data.admissionPeriod,
     });

     return isAspirant && hasProgram && isVisible;
    },
   },
  ];
 }

 isFieldVisibleOrRequired(fieldSelector, containerSelector = null) {
  const field = Utils.getElementById(fieldSelector, false);
  if (!field) return false;

  // Si el campo es required, debe validarse aunque esté oculto
  if (field.required) return true;

  // Verificar visibilidad visual
  return this.isFieldVisible(fieldSelector, containerSelector);
 }

 setupRealtimeValidation() {
  this.validationRules.forEach((rule) => {
   this.setupFieldValidation(rule);
  });
 }

 setupFieldValidation(rule) {
  const element = Utils.getElementById(rule.selector, false);
  if (!element) return;

  const validateField = Utils.debounce(() => {
   this.validateSingleField(rule);
  }, 300);

  // Configurar eventos según el tipo de elemento
  switch (element.type) {
   case "text":
   case "email":
   case "tel":
   case "number":
    element.addEventListener("input", (e) => {
     this.formState.setField(rule.field, e.target.value);
    });
    element.addEventListener("input", validateField);
    element.addEventListener("blur", () => this.validateSingleField(rule));
    break;

   case "select-one":
    element.addEventListener("change", (e) => {
     this.formState.setField(rule.field, e.target.value);
     this.validateSingleField(rule);
    });
    break;

   default:
    element.addEventListener("change", (e) => {
     this.formState.setField(rule.field, e.target.value);
     this.validateSingleField(rule);
    });
    break;
  }
 }

 setupPhoneValidation() {
  const phoneInput = Utils.getElementById(FormConfig.SELECTORS.FIELDS.PHONE);
  const prefixSelect = Utils.getElementById(
   FormConfig.SELECTORS.FIELDS.PHONE_CODE
  );
  const phoneWrapper = Utils.getElementById("phone_code_wrapper", false);
  const errorElement = Utils.getElementById(
   FormConfig.SELECTORS.CONTAINERS.PHONE_ERROR
  );

  if (!phoneInput || !prefixSelect || !errorElement) return;

  const validatePhoneBlock = () => {
   const prefixValid = Validators.required(this.formState.data.phoneCode);
   const phoneValid = Validators.phone(this.formState.data.phone);
   const isValid = prefixValid && phoneValid;

   if (phoneWrapper) {
    phoneWrapper.classList.toggle("jv-error", !isValid);
    phoneWrapper.classList.toggle("jv-validated", isValid);
   }

   errorElement.style.display = isValid ? "none" : "block";

   if (!isValid) {
    let message = "";
    if (!prefixValid && !phoneValid) {
     message = "Selecciona un prefijo e ingresa un número de teléfono válido";
    } else if (!prefixValid) {
     message = "Selecciona un prefijo de país";
    } else {
     message = `Ingresa un número válido (${FormConfig.VALIDATION.PHONE_MIN_LENGTH}-${FormConfig.VALIDATION.PHONE_MAX_LENGTH} dígitos)`;
    }
    errorElement.textContent = message;
   }

   this.formState.setFieldValidation("phoneCode", prefixValid);
   this.formState.setFieldValidation("phone", phoneValid);

   return isValid;
  };

  // Eventos
  prefixSelect.addEventListener("change", validatePhoneBlock);
  phoneInput.addEventListener("input", Utils.debounce(validatePhoneBlock, 500));
  phoneInput.addEventListener("blur", validatePhoneBlock);
 }

 setupAuthorizationValidation() {
  const authRadios = document.querySelectorAll(
   `input[name="${FormConfig.SELECTORS.FIELDS.DATA_AUTHORIZATION}"]`
  );

  authRadios.forEach((radio) => {
   radio.addEventListener("change", (e) => {
    this.formState.setField("dataAuthorization", e.target.value);
    this.validateAuthorization();
   });
  });
 }

 // ============================================
 // VALIDACIÓN INDIVIDUAL
 // ============================================

 validateSingleField(rule) {
  // Verificar si el campo debe ser removido
  if (this.shouldSkipField(rule)) {
   return true;
  }

  // Verificar condiciones
  if (rule.conditional && !rule.conditional()) {
   return true;
  }

  const element = Utils.getElementById(rule.selector, false);
  const errorElement = Utils.getElementById(
   rule.errorSelector || `${rule.selector}_error`,
   false
  );

  if (!element) return false;

  const value = this.formState.data[rule.field];
  const isValid = rule.validator(value);

  // Actualizar UI
  this.uiManager.updateFieldUI(element, errorElement, isValid, rule.message);

  // Actualizar estado
  this.formState.setFieldValidation(rule.field, isValid);

  return isValid;
 }

 validateAuthorization() {
  const errorElement = Utils.getElementById("autorizacionErrorMessage", false);
  const value = this.formState.data.dataAuthorization;
  const isValid = value === "1";

  if (errorElement) {
   errorElement.style.display = isValid ? "none" : "block";
  }

  this.formState.setFieldValidation("dataAuthorization", isValid);
  return isValid;
 }

 // ============================================
 // VALIDACIÓN COMPLETA
 // ============================================

 validateAll() {
  this.formState.resetErrors();
  console.log("🔍 Iniciando validación completa...");

  const personalValid = this.validatePersonalData();
  const academicValid = this.validateAcademicData();

  console.log("📊 Resultado validación:", {
   personalValid,
   academicValid,
   overallValid: personalValid && academicValid,
   errors: this.formState.validation.errors,
  });

  return personalValid && academicValid;
 }

 validatePersonalData() {
  let isValid = true;

  // Validar campos personales
  const personalRules = this.validationRules.filter(
   (rule) => !this.shouldSkipField(rule)
  );

  personalRules.forEach((rule) => {
   if (rule.conditional && !rule.conditional()) {
    return; // Saltar campos condicionales no aplicables
   }

   const fieldValid = this.validateSingleField(rule);
   if (!fieldValid) {
    isValid = false;
    this.formState.addError(rule.message);
   }
  });

  return isValid;
 }

 validateAcademicData() {
  let isValid = true;
  console.log("🎓 Validando datos académicos...");

  const typeAttendee = this.formState.data.typeAttendee;
  const isAspirant = typeAttendee === "Aspirante";

  // Validar tipo de asistente
  if (this.isFieldVisible(FormConfig.SELECTORS.FIELDS.TYPE_ATTENDEE)) {
   const typeValid = Validators.required(typeAttendee);
   if (!typeValid) {
    isValid = false;
    this.formState.addError("Debes seleccionar un tipo de asistente");
   }
  }

  // Validar día de asistencia
  const attendanceDays = FormConfig.PERSONALIZATION.ATTENDANCE_DAYS || [];
  if (
   attendanceDays.length > 1 &&
   this.isFieldVisible(FormConfig.SELECTORS.FIELDS.ATTENDANCE_DAY)
  ) {
   const dayValid = Validators.required(this.formState.data.dayAttendance);
   if (!dayValid) {
    isValid = false;
    this.formState.addError("Debes seleccionar un día de asistencia");
   }
  }

  // Solo validar campos académicos para aspirantes
  if (isAspirant) {
   console.log("📋 Validando campos académicos para aspirante...");

   // Validar nivel académico
   const academicLevelField = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
    false
   );
   if (academicLevelField && academicLevelField.required) {
    const levelValid = Validators.required(this.formState.data.academicLevel);
    console.log(
     "🔍 Nivel académico válido:",
     levelValid,
     "Valor:",
     this.formState.data.academicLevel
    );

    if (!levelValid) {
     isValid = false;
     this.formState.addError("Debes seleccionar un nivel académico");
     // Agregar clase de error visual
     if (academicLevelField) {
      academicLevelField.classList.add("jv-error");
     }
    }
   }

   // Validar facultad (solo si es visible y required)
   const facultyField = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.FACULTY,
    false
   );
   if (
    facultyField &&
    facultyField.required &&
    this.isFieldVisible(FormConfig.SELECTORS.FIELDS.FACULTY)
   ) {
    const facultyValid = Validators.required(this.formState.data.faculty);
    console.log(
     "🔍 Facultad válida:",
     facultyValid,
     "Valor:",
     this.formState.data.faculty
    );

    if (!facultyValid) {
     isValid = false;
     this.formState.addError("Debes seleccionar una facultad");
     facultyField.classList.add("jv-error");
    }
   }

   // Validar programa (solo si es visible y required)
   const programField = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.PROGRAM,
    false
   );
   if (
    programField &&
    programField.required &&
    this.isFieldVisible(FormConfig.SELECTORS.FIELDS.PROGRAM)
   ) {
    const programValid = Validators.required(this.formState.data.program);
    console.log(
     "🔍 Programa válido:",
     programValid,
     "Valor:",
     this.formState.data.program
    );

    if (!programValid) {
     isValid = false;
     this.formState.addError("Debes seleccionar un programa");
     programField.classList.add("jv-error");
    }
   }

   // Validar período (solo si es visible y required)
   const periodField = Utils.getElementById(
    FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
    false
   );
   if (
    periodField &&
    periodField.required &&
    this.isFieldVisible(FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD)
   ) {
    const periodValid = Validators.required(
     this.formState.data.admissionPeriod
    );
    console.log(
     "🔍 Período válido:",
     periodValid,
     "Valor:",
     this.formState.data.admissionPeriod
    );

    if (!periodValid) {
     isValid = false;
     this.formState.addError("Debes seleccionar un periodo");
     periodField.classList.add("jv-error");
    }
   }
  }

  // Validar autorización (siempre requerida)
  const authValid = this.validateAuthorization();
  if (!authValid) {
   isValid = false;
   this.formState.addError(
    "Debes autorizar el tratamiento de datos personales"
   );
  }

  console.log("📊 Validación académica completada:", {
   isValid,
   errorsCount: this.formState.validation.errors.length,
  });
  return isValid;
 }

 // ============================================
 // MÉTODOS AUXILIARES
 // ============================================

 shouldSkipField(rule) {
  if (!rule.removable) return false;

  const removedFields = FormConfig.PERSONALIZATION.REMOVE_FIELDS || [];
  return removedFields.includes(rule.removable);
 }

 isFieldVisible(fieldSelector, containerSelector = null) {
  // Verificar si el contenedor está visible
  if (containerSelector) {
   const container = Utils.getElementById(containerSelector, false);
   if (container && container.style.display === "none") {
    return false;
   }
  }

  // Verificar si el campo mismo está visible
  const field = Utils.getElementById(fieldSelector, false);
  if (!field) return false;

  // Verificar si está en un contenedor oculto
  const fieldRow =
   field.closest(".jv-form-row") || field.closest(".jv-form-group");
  if (fieldRow && fieldRow.style.display === "none") {
   return false;
  }

  return true;
 }

 // ============================================
 // MÉTODOS PÚBLICOS PARA EL CONTROLADOR
 // ============================================

 validateFieldByName(fieldName) {
  const rule = this.validationRules.find((r) => r.field === fieldName);
  if (!rule) return false;

  return this.validateSingleField(rule);
 }
}

/**
 * Integración con Salesforce y Configuraciones Adicionales
 * Maneja el envío de datos y configuraciones específicas
 */

// ============================================
// CONFIGURACIÓN DE SALESFORCE
// ============================================
class SalesforceConfig {
 static PRODUCTION = {
  URL: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
  OID: "00Df4000003l8Bf",
  FIELD_MAPPING: {
   oid: "oid",
   retURL: "retURL",
   firstName: "first_name",
   lastName: "last_name",
   typeDocument: "00N5G00000WmhsT",
   document: "00N5G00000WmhsR",
   email: "email",
   phoneCode: "00NJw000002mzb7",
   phone: "mobile",
   country: "00N5G00000WmhvJ",
   department: "00N5G00000WmhvX",
   city: "00N5G00000WmhvO",
   admissionPeriod: "00N5G00000WmhvI",
   originCandidate: "lead_source",
   sourceAuthorization: "00N5G00000WmhvT",
   program: "00N5G00000WmhvV",
   typeAttendee: "00NJw000001J3g6",
   academicLevel: "nivelacademico",
   faculty: "Facultad",
   dayAttendance: "00NJw000004iuIj",
   school: "00NJw0000041omr",
   originRequest: "00NJw000001J3Hl",
   source: "00N5G00000WmhvW",
   subSource: "00N5G00000WmhvZ",
   mean: "00NJw000001J3g8",
   campaign: "00N5G00000Wmi8x",
   dataAuthorization: "00N5G00000WmhvF",
  },
 };

 static DEBUG = {
  URL: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
  OID: "00D7j0000004eQD",
  FIELD_MAPPING: {
   oid: "oid",
   retURL: "retURL",
   firstName: "first_name",
   lastName: "last_name",
   typeDocument: "00N7j000002BI3X",
   document: "00N7j000002BI3V",
   email: "email",
   phoneCode: "00NO4000002lUPh",
   phone: "mobile",
   country: "00N7j000002BY1c",
   department: "00N7j000002BY1h",
   city: "00N7j000002BY1i",
   admissionPeriod: "00N7j000002BY2L",
   originCandidate: "lead_source",
   sourceAuthorization: "00N7j000002BY26",
   program: "00N7j000002BI3p",
   typeAttendee: "00NO40000000sTR",
   academicLevel: "nivelacademico",
   faculty: "Facultad",
   dayAttendance: "00NO4000007qrPB",
   school: "00NO4000005begL",
   originRequest: "00NO40000002ZeP",
   source: "00N7j000002BKgW",
   subSource: "00N7j000002BKgb",
   mean: "00NO40000001izt",
   campaign: "00N7j000002BfkF",
   dataAuthorization: "00N7j000002BI3m",
  },
 };

 static DEFAULTS = {
  ORIGIN_REQUEST: "web_to_lead_eventos",
  AUTHORIZATION_SOURCE: "Landing Eventos",
  LEAD_SOURCE: "Landing Pages",
  COMPANY: "NA",
  SCHOOL: "NA",
 };

 static getConfig(isDebug = false) {
  return isDebug ? this.DEBUG : this.PRODUCTION;
 }
}

// ============================================
// GESTOR DE CAMPOS REMOVIBLES
// ============================================
class FieldRemovalManager {
 constructor(formState) {
  this.formState = formState;
  this.fieldMapping = {
   nombre: FormConfig.SELECTORS.FIELDS.FIRST_NAME,
   apellido: FormConfig.SELECTORS.FIELDS.LAST_NAME,
   tipo_doc: FormConfig.SELECTORS.FIELDS.TYPE_DOCUMENT,
   documento: FormConfig.SELECTORS.FIELDS.DOCUMENT,
   email: FormConfig.SELECTORS.FIELDS.EMAIL,
   telefono: FormConfig.SELECTORS.FIELDS.PHONE,
   pais: FormConfig.SELECTORS.FIELDS.COUNTRY,
   departamento: FormConfig.SELECTORS.FIELDS.DEPARTMENT,
   ciudad: FormConfig.SELECTORS.FIELDS.CITY,
   tipo_asistente: FormConfig.SELECTORS.FIELDS.TYPE_ATTENDEE,
   dia_asistencia: FormConfig.SELECTORS.FIELDS.ATTENDANCE_DAY,
   nivel_academico: FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
   facultad: FormConfig.SELECTORS.FIELDS.FACULTY,
   programa: FormConfig.SELECTORS.FIELDS.PROGRAM,
   periodo: FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
   tipo_asistente: FormConfig.SELECTORS.FIELDS.TYPE_ATTENDEE,
   dia_asistencia: FormConfig.SELECTORS.FIELDS.ATTENDANCE_DAY,
   nivel_academico: FormConfig.SELECTORS.FIELDS.ACADEMIC_LEVEL,
   facultad: FormConfig.SELECTORS.FIELDS.FACULTY,
   programa: FormConfig.SELECTORS.FIELDS.PROGRAM,
   periodo: FormConfig.SELECTORS.FIELDS.ADMISSION_PERIOD,
  };
 }

 removeConfiguredFields() {
  const fieldsToRemove = FormConfig.PERSONALIZATION.REMOVE_FIELDS || [];

  if (fieldsToRemove.length === 0) return;

  console.log("🔧 Removiendo campos configurados:", fieldsToRemove);

  fieldsToRemove.forEach((fieldName) => {
   this.removeField(fieldName);
  });

  // Casos especiales
  this.handleSpecialCases(fieldsToRemove);
 }

 removeField(fieldName) {
  const fieldId = this.fieldMapping[fieldName];

  if (!fieldId) {
   console.warn(`⚠️ Campo "${fieldName}" no encontrado en el mapeo`);
   return;
  }

  const element = Utils.getElementById(fieldId, false);
  if (!element) {
   console.warn(`⚠️ Elemento "${fieldId}" no encontrado en el DOM`);
   return;
  }

  // Encontrar el contenedor del campo
  const container = this.findFieldContainer(element);

  if (container) {
   container.style.display = "none";
   console.log(`✅ Campo "${fieldName}" ocultado correctamente`);

   // Configurar valor por defecto
   this.setFieldDefault(element, fieldName);

   // Actualizar estado del formulario
   this.updateFormState(fieldName, element.value);
  } else {
   console.warn(`⚠️ No se encontró contenedor para "${fieldName}"`);
  }
 }

 findFieldContainer(element) {
  // Buscar el contenedor más apropiado
  return (
   element.closest(".jv-form-group") ||
   element.closest(".jv-form-row") ||
   element.closest(".form-group") ||
   element.parentElement
  );
 }

 setFieldDefault(element, fieldName) {
  // Remover atributo required
  if (element.hasAttribute("required")) {
   element.removeAttribute("required");
  }

  // Establecer valor por defecto según el tipo de campo
  if (element.tagName === "SELECT") {
   this.setSelectDefault(element, fieldName);
  } else {
   this.setInputDefault(element, fieldName);
  }
 }

 setSelectDefault(element, fieldName) {
  // Agregar opción por defecto si no existe
  if (element.options.length === 0 || element.options[0].value !== "") {
   const defaultOption = document.createElement("option");
   defaultOption.value = this.getDefaultValue(fieldName);
   defaultOption.text = `${fieldName} (Auto)`;
   defaultOption.selected = true;
   element.prepend(defaultOption);
  }

  element.selectedIndex = 0;
 }

 setInputDefault(element, fieldName) {
  if (!element.value) {
   element.value = this.getDefaultValue(fieldName);
  }
 }

 getDefaultValue(fieldName) {
  const defaults = {
   nombre: "Nombre",
   apellido: "Apellido",
   tipo_doc: "CC",
   documento: "1234567890",
   email: "usuario@ejemplo.com",
   telefono: "3000000000",
   pais: "COL",
   departamento: "11",
   ciudad: "11001",
   tipo_asistente: "Aspirante",
   dia_asistencia:
    FormConfig.PERSONALIZATION.ATTENDANCE_DAYS?.[0] || "Día no configurado",
   nivel_academico: "PREG",
   facultad: "NOAP",
   programa: "NOAP",
   periodo: "2025-1",
  };

  return defaults[fieldName] || "AUTOCOMPLETADO";
 }

 updateFormState(fieldName, value) {
  const stateKey = this.getStateKey(fieldName);
  if (stateKey) {
   this.formState.setField(stateKey, value);
   this.formState.setFieldValidation(stateKey, true);
   console.log(`   Campo ${fieldName} marcado como válido en el estado`);
  }
 }

 getStateKey(fieldName) {
  const mapping = {
   nombre: "firstName",
   apellido: "lastName",
   tipo_doc: "typeDocument",
   documento: "document",
   email: "email",
   telefono: "phone",
   pais: "country",
   departamento: "department",
   ciudad: "city",
   tipo_asistente: "typeAttendee",
   dia_asistencia: "dayAttendance",
   nivel_academico: "academicLevel",
   facultad: "faculty",
   programa: "program",
   periodo: "admissionPeriod",
  };

  return mapping[fieldName];
 }

 handleSpecialCases(fieldsToRemove) {
  // Caso: Si se remueven nombre y apellido, ocultar contenedor completo
  if (
   fieldsToRemove.includes("nombre") &&
   fieldsToRemove.includes("apellido")
  ) {
   const nameContainer = Utils.getElementById(
    FormConfig.SELECTORS.CONTAINERS.NAME,
    false
   );
   if (nameContainer) {
    nameContainer.style.display = "none";
    console.log("✅ Contenedor de nombre completo ocultado");
   }
  }

  // Caso: Si se remueve teléfono, configurar valores por defecto para ambos campos
  if (fieldsToRemove.includes("telefono")) {
   this.formState.setField("phoneCode", "57");
   this.formState.setField("phone", "3000000000");
   this.formState.setFieldValidation("phoneCode", true);
   this.formState.setFieldValidation("phone", true);

   const phoneContainer = document.querySelector(".jv-phone-container");
   if (phoneContainer) {
    phoneContainer.style.display = "none";
    console.log("✅ Contenedor completo de teléfono ocultado");
   }
  }
 }
}

// ============================================
// GESTOR DE MODALES Y UI ADICIONAL
// ============================================
class ModalManager {
 constructor() {
  this.activeModals = new Set();
 }

 initErrorModal() {
  const modal = Utils.getElementById("error_modal", false);
  const openBtn = Utils.getElementById("error_modal_open_button", false);
  const closeBtn = Utils.getElementById("error_modal_close_button", false);

  if (!modal || !openBtn || !closeBtn) return;

  // Eventos de apertura y cierre
  openBtn.addEventListener("click", () => this.openModal(modal));
  closeBtn.addEventListener("click", () => this.closeModal(modal));

  // Cerrar con clic fuera del modal
  window.addEventListener("click", (e) => {
   if (e.target === modal) {
    this.closeModal(modal);
   }
  });

  // Cerrar con tecla Escape
  document.addEventListener("keydown", (e) => {
   if (e.key === "Escape" && this.activeModals.has(modal)) {
    this.closeModal(modal);
   }
  });
 }

 openModal(modal) {
  modal.style.display = "block";
  document.body.style.overflow = "hidden";
  this.activeModals.add(modal);
 }

 closeModal(modal) {
  modal.style.display = "none";
  document.body.style.overflow = "";
  this.activeModals.delete(modal);
 }

 showDevModeDialog(formData, actionUrl) {
  const modal = this.createDevModal(formData, actionUrl);
  document.body.appendChild(modal);
  this.openModal(modal);

  // Auto-remover después de cerrar
  const closeBtn = modal.querySelector("#dev-mode-close");
  const continueBtn = modal.querySelector("#dev-mode-continue");

  const cleanup = () => {
   this.closeModal(modal);
   setTimeout(() => {
    if (document.body.contains(modal)) {
     document.body.removeChild(modal);
    }
   }, 300);
  };

  closeBtn.addEventListener("click", cleanup);
  if (continueBtn) {
   continueBtn.addEventListener("click", cleanup);
  }

  // Cerrar con Escape
  const handleEscape = (e) => {
   if (e.key === "Escape") {
    cleanup();
    document.removeEventListener("keydown", handleEscape);
   }
  };
  document.addEventListener("keydown", handleEscape);
 }

 createDevModal(formData, actionUrl) {
  const modal = document.createElement("div");
  modal.className = "dev-modal";
  modal.style.cssText = `
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7); z-index: 10000;
      display: flex; justify-content: center; align-items: center;
      padding: 20px;
    `;

  const panel = document.createElement("div");
  panel.style.cssText = `
      background: white; border-radius: 8px; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      padding: 20px; width: 90%; max-width: 800px;
      max-height: 80vh; overflow: auto; margin: auto;
    `;

  const fieldCount = Object.keys(formData).length;
  const isClean = fieldCount < 20; // Verificar si la limpieza funcionó

  panel.innerHTML = `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
        <h2 style="margin: 0 0 10px 0; color: #333;">
          🔍 Modo Desarrollo - Datos del Formulario
          ${isClean ? "✅" : "⚠️"}
        </h2>
        <p style="margin: 0; color: #666;">
          El formulario NO ha sido enviado. Estos son los datos que se enviarían.
        </p>
        <p style="margin: 5px 0; font-weight: bold;">
          URL: <span style="font-weight: normal; font-size: 0.9em;">${actionUrl}</span>
        </p>
        ${
         FormConfig.PERSONALIZATION.DEBUG_MODE
          ? `<p style="margin: 5px 0; font-weight: bold;">
                CORREO DE DEBUG: <span style="font-weight: normal; font-size: 0.9em;">${FormConfig.PERSONALIZATION.EMAIL_DEBUG}</span>
              </p>`
          : ""
        }
        <p style="margin: 5px 0; color: ${isClean ? "green" : "orange"};">
          ${
           isClean
            ? `✅ Formulario limpio: ${fieldCount} campos`
            : `⚠️ Posibles duplicados: ${fieldCount} campos`
          }
        </p>
      </div>
      <div>
        <h3 style="margin: 10px 0; color: #333;">Campos a enviar:</h3>
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #eee; border-radius: 4px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead style="position: sticky; top: 0; background: #f8f9fa;">
              <tr>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Campo</th>
                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Valor</th>
              </tr>
            </thead>
            
              ${Object.entries(formData)
               .map(
                ([name, value]) => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 0.9em;">${name}</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee; font-size: 0.9em;">${value}</td>
                </tr>
              `
               )
               .join("")}
            
          </table>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
          <button id="dev-mode-close" style="padding: 8px 16px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Cerrar
          </button>
          <button id="dev-mode-continue" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Continuar
          </button>
        </div>
      </div>
    `;

  modal.appendChild(panel);
  return modal;
 }
}

// ============================================
// GESTOR DE ENVÍO DE FORMULARIO
// ============================================
class FormSubmissionManager {
 constructor(formState, uiManager) {
  this.formState = formState;
  this.uiManager = uiManager;
  this.modalManager = new ModalManager();
  this.originalFormState = null;
 }

 async submitForm(form) {
  try {
   this.formState.ui.isSubmitting = true;
   this.uiManager.setSubmitButtonState(true);

   // IMPORTANTE: Guardar estado original antes de modificar
   this.saveOriginalFormState(form);

   // Preparar formulario para envío
   this.prepareFormForSubmission(form);

   // Decidir si simular o enviar realmente
   if (FormConfig.PERSONALIZATION.DEV_MODE) {
    this.simulateSubmission(form);
   } else {
    await this.performRealSubmission(form);
   }
  } catch (error) {
   console.error("Error durante el envío:", error);
   this.handleSubmissionError(form);
  }
 }

 saveOriginalFormState(form) {
  console.log("💾 Guardando estado original del formulario...");

  // Guardar referencia a todos los campos originales
  this.originalFormState = {
   fields: Array.from(form.querySelectorAll("input, select, textarea")).map(
    (field) => ({
     element: field,
     name: field.name,
     value: field.value,
     type: field.type,
     required: field.required,
     disabled: field.disabled,
     parentElement: field.parentElement,
    })
   ),
   action: form.action,
   method: form.method,
  };
 }

 prepareFormForSubmission(form) {
  console.log("🔄 Preparando formulario para envío (sin eliminar campos)...");

  // PASO 1: Deshabilitar campos originales (no eliminarlos)
  this.disableOriginalFields(form);

  // PASO 2: Obtener configuración según el modo
  const config = SalesforceConfig.getConfig(
   FormConfig.PERSONALIZATION.DEBUG_MODE
  );

  // PASO 3: Crear campos ocultos para envío
  this.createSubmissionFields(form, config);

  // PASO 4: Establecer URL de acción
  form.action = config.URL;

  console.log("📤 Formulario preparado para envío a:", config.URL);
 }

 disableOriginalFields(form) {
  console.log("🔒 Deshabilitando campos originales temporalmente...");

  const originalFields = form.querySelectorAll(
   'input:not([type="hidden"]), select, textarea'
  );

  originalFields.forEach((field) => {
   // Marcar como deshabilitado para envío (sin cambiar la apariencia)
   field.setAttribute("data-original-name", field.name);
   field.name = ""; // Vaciar el name para que no se envíe
   field.classList.add("jv-temp-disabled");
  });

  console.log(
   `🔒 ${originalFields.length} campos originales deshabilitados temporalmente`
  );
 }

 createSubmissionFields(form, config) {
  console.log("🔧 Creando campos para envío...");

  // Crear contenedor para campos de envío
  const submissionContainer = document.createElement("div");
  submissionContainer.id = "jv-submission-fields";
  submissionContainer.style.display = "none";
  form.appendChild(submissionContainer);

  // Campos básicos de Salesforce
  this.createSubmissionField(submissionContainer, "oid", config.OID);
  this.createSubmissionField(
   submissionContainer,
   "retURL",
   FormConfig.URLS.THANK_YOU
  );

  let fieldsCreated = 2;

  // Campos específicos de debug si está en modo debug
  if (FormConfig.PERSONALIZATION.DEBUG_MODE) {
   this.createSubmissionField(submissionContainer, "debug", "1");
   this.createSubmissionField(
    submissionContainer,
    "debugEmail",
    FormConfig.PERSONALIZATION.EMAIL_DEBUG
   );
   fieldsCreated += 2;
   console.log(
    `   🐛 Campos de debug agregados: debug=1, debugEmail=${FormConfig.PERSONALIZATION.EMAIL_DEBUG}`
   );
  }

  // Mapear datos del estado a campos de Salesforce
  Object.entries(config.FIELD_MAPPING).forEach(
   ([stateKey, salesforceField]) => {
    // Saltar campos básicos ya creados
    if (["oid", "retURL"].includes(stateKey)) {
     return;
    }

    const value = this.getFieldValue(stateKey);

    if (this.shouldIncludeField(stateKey, value)) {
     this.createSubmissionField(submissionContainer, salesforceField, value);
     fieldsCreated++;
     console.log(`   ✅ ${stateKey} -> ${salesforceField}: "${value}"`);
    }
   }
  );

  console.log(`📊 Total de campos de envío creados: ${fieldsCreated}`);
 }

 createSubmissionField(container, name, value) {
  const field = document.createElement("input");
  field.type = "hidden";
  field.name = name;
  field.value = String(value || "");
  field.classList.add("jv-submission-field");
  container.appendChild(field);
  return field;
 }

 getFieldValue(stateKey) {
  // Obtener del estado del formulario
  if (this.formState.data.hasOwnProperty(stateKey)) {
   return this.formState.data[stateKey];
  }

  // Valores por defecto
  const defaults = {
   originCandidate: SalesforceConfig.DEFAULTS.LEAD_SOURCE,
   sourceAuthorization: SalesforceConfig.DEFAULTS.AUTHORIZATION_SOURCE,
   school: SalesforceConfig.DEFAULTS.SCHOOL,
   originRequest: SalesforceConfig.DEFAULTS.ORIGIN_REQUEST,
   program: "",
   dayAttendance: "",
  };

  return defaults[stateKey] || "";
 }

 shouldIncludeField(stateKey, value) {
  const alwaysInclude = [
   "originCandidate",
   "sourceAuthorization",
   "school",
   "originRequest",
  ];

  return (
   alwaysInclude.includes(stateKey) ||
   (value !== null && value !== undefined && value !== "")
  );
 }

 async performRealSubmission(form) {
  console.log("🚀 Enviando formulario a Salesforce...");

  // Delay para mostrar indicadores visuales
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Enviar formulario
  form.submit();
 }

 simulateSubmission(form) {
  console.log("🔍 MODO DESARROLLO - Simulando envío");

  // Capturar datos de los campos de envío
  const submissionData = this.captureSubmissionData(form);

  // Mostrar información
  console.log("📋 Datos del estado interno:", this.formState.data);
  console.log("📤 Campos que se enviarían a Salesforce:");
  console.table(submissionData);

  // Mostrar modal de desarrollo
  this.modalManager.showDevModeDialog(submissionData, form.action);

  // Restaurar formulario después de la simulación
  setTimeout(() => {
   this.restoreOriginalForm(form);
   this.resetSubmissionState();
  }, 2000);
 }

 restoreOriginalForm(form) {
  console.log("🔄 Restaurando estado original del formulario...");

  // Remover campos de envío
  const submissionContainer = form.querySelector("#jv-submission-fields");
  if (submissionContainer) {
   submissionContainer.remove();
  }

  // Restaurar campos originales
  const disabledFields = form.querySelectorAll(".jv-temp-disabled");
  disabledFields.forEach((field) => {
   // Restaurar el name original
   const originalName = field.getAttribute("data-original-name");
   if (originalName) {
    field.name = originalName;
    field.removeAttribute("data-original-name");
   }
   field.classList.remove("jv-temp-disabled");
  });

  // Restaurar action original si es necesario
  if (this.originalFormState && this.originalFormState.action) {
   form.action = this.originalFormState.action;
  }

  console.log("✅ Formulario restaurado a su estado original");
 }

 captureSubmissionData(form) {
  const submissionData = {};
  const submissionFields = form.querySelectorAll(".jv-submission-field");

  submissionFields.forEach((field) => {
   if (field.name && field.name !== "") {
    submissionData[field.name] = field.value;
   }
  });

  return submissionData;
 }

 handleSubmissionError(form) {
  console.error("❌ Error durante el envío del formulario");

  // Restaurar formulario en caso de error
  this.restoreOriginalForm(form);
  this.resetSubmissionState();

  // Mostrar mensaje de error
  this.uiManager.showErrors([
   "Ocurrió un error al enviar el formulario. Por favor, inténtalo de nuevo.",
  ]);
 }

 resetSubmissionState() {
  this.formState.ui.isSubmitting = false;
  this.uiManager.setSubmitButtonState(false);
 }
}

// ============================================
// EXTENSIÓN DEL CONTROLADOR PRINCIPAL
// ============================================

// Extender FormController con nuevas funcionalidades
if (typeof FormController !== "undefined") {
 // Agregar métodos adicionales al controlador principal
 FormController.prototype.initModalManager = function () {
  this.modalManager = new ModalManager();
  this.modalManager.initErrorModal();
 };

 FormController.prototype.initFieldRemoval = function () {
  this.fieldRemovalManager = new FieldRemovalManager(this.formState);
  this.fieldRemovalManager.removeConfiguredFields();
 };

 FormController.prototype.initSubmissionManager = function () {
  this.submissionManager = new FormSubmissionManager(
   this.formState,
   this.uiManager
  );
 };

 // Sobrescribir método de envío para usar el nuevo gestor
 FormController.prototype.submitForm = function (form) {
  if (this.submissionManager) {
   this.submissionManager.submitForm(form);
  } else {
   console.error("❌ SubmissionManager no inicializado");
  }
 };

 // Actualizar método de inicialización
 FormController.prototype.init = async function () {
  try {
   console.log("🚀 Inicializando formulario...");

   // Inicialización original
   await this.dataLoader.loadAll();
   this.loadUTMParameters();

   // Nuevas inicializaciones
   this.initModalManager();
   this.initSubmissionManager();

   // Configurar campos y validación
   this.fieldManager.initializeFields();
   this.validationManager.setupValidation();
   this.setupFormSubmission();

   // Remover campos configurados al final
   this.initFieldRemoval();

   console.log("✅ Formulario inicializado correctamente");
  } catch (error) {
   console.error("❌ Error al inicializar:", error);
  }
 };

 // CORRECCIÓN: Setup de eventos de campos dependientes mejorado
 FormController.prototype.setupDependentFields = function () {
  this.setupFieldEvent("TYPE_ATTENDEE", (value) => {
   console.log(`👤 Tipo de asistente cambiado a: ${value}`);

   this.formState.setField("typeAttendee", value);
   this.fieldManager.handleAcademicFieldsVisibility(value);

   if (value === "Aspirante") {
    // Delay para asegurar que la UI se actualice correctamente
    setTimeout(() => {
     this.fieldManager.ensureAcademicFieldsEnabled();

     // Trigger validación de campos académicos
     if (this.validationManager.validateFieldByName) {
      this.validationManager.validateFieldByName("academicLevel");
     }
    }, 200);
   }
  });

  this.setupFieldEvent("ATTENDANCE_DAY", (value) => {
   this.formState.setField("dayAttendance", value);
   console.log(`📅 Día de asistencia seleccionado: ${value}`);
  });

  this.setupFieldEvent("COUNTRY", (value) => {
   this.formState.setField("country", value);
   this.fieldManager.loadDepartments();
  });

  this.setupFieldEvent("DEPARTMENT", (value) => {
   this.formState.setField("department", value);
   this.fieldManager.loadCities();
  });

  this.setupFieldEvent("CITY", (value) => {
   this.formState.setField("city", value);
  });

  this.setupFieldEvent("ACADEMIC_LEVEL", (value) => {
   this.formState.setField("academicLevel", value);
   this.fieldManager.loadFaculties();
  });

  this.setupFieldEvent("FACULTY", (value) => {
   this.formState.setField("faculty", value);
   this.fieldManager.loadPrograms();
  });

  this.setupFieldEvent("PROGRAM", (value) => {
   this.formState.setField("program", value);
   this.fieldManager.loadPeriods();
  });

  this.setupFieldEvent("ADMISSION_PERIOD", (value) => {
   this.formState.setField("admissionPeriod", value);
  });

  // Configurar teléfono con formateo
  this.fieldManager.setupPhoneField();
 };

 // Helper method para configurar eventos de campos
 FormController.prototype.setupFieldEvent = function (fieldKey, callback) {
  const fieldId = FormConfig.SELECTORS.FIELDS[fieldKey];
  const element = Utils.getElementById(fieldId, false);

  if (element) {
   element.addEventListener("change", (e) => {
    callback(e.target.value);
   });
  }
 };
}
