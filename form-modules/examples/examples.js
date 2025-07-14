/**
 * Ejemplos de configuraciones para FormManager
 *
 * Estos ejemplos muestran configuraciones desde las más simples hasta las más complejas,
 * basándose en las opciones disponibles en Config.js y Constants.js
 */

import { FormManager } from "../modules/FormManager.js";

// ==================================================
// EJEMPLO 1: CONFIGURACIÓN MÍNIMA
// ==================================================
// Un formulario básico con configuración casi nula
// Ideal para eventos simples donde no se necesita personalización

export const configMini = {
  // Solo configuramos lo mínimo indispensable
  eventName: "Formulario base",
  eventDate: "2024-02-15",
  campaign: "SIMPLE_EVENT",

  // Sin configuraciones especiales - usará todos los valores por defecto
  // - Mostrará todos los tipos de asistente
  // - Mostrará todos los niveles académicos
  // - Sin filtros de facultades o programas
  // - Cache deshabilitado
  // - Modo debug deshabilitado
};

// ==================================================
// EJEMPLO 2: CONFIGURACIÓN BÁSICA CON PERSONALIZACIÓN
// ==================================================
// Formulario con algunas personalizaciones básicas
// Configuración típica para un evento de pregrado específico

export const configBase = {
  // Datos del evento
  eventName: "Open Day Pregrado",
  eventDate: "2024-03-20",
  campaign: "OPENDAY_PREG_2024",
  source: "landing_page",
  medium: "web",

  // Configuración básica de tipos de asistente (solo aspirantes y familias)
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],

  // Solo programas de pregrado
  academicLevels: [{ code: "PREG", name: "Pregrado" }],

  // Días específicos del evento
  attendanceDays: ["Sábado 20 de marzo", "Domingo 21 de marzo"],

  // Configuración básica de desarrollo
  sandboxMode: false,
  debugMode: false,

  // Habilitamos cache básico
  cache: {
    enabled: true,
    expirationHours: 24,
  },
};

// ==================================================
// EJEMPLO 3: CONFIGURACIÓN INTERMEDIA CON FILTROS
// ==================================================
// Formulario con filtros de facultades y programas específicos
// Ideal para eventos dirigidos a carreras específicas

export const configMedium = {
  // Datos del evento más detallados
  eventName: "Feria de Ingenierías",
  eventDate: "2024-04-15",
  campaign: "FERIA_ING_2024",
  article: "ingenieria_evento",
  source: "google_ads",
  subSource: "search_campaign",
  medium: "cpc",
  leadSource: "Digital Marketing",

  // Tipos de asistente específicos para ingeniería
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Docente y/o psicoorientador"],

  // Solo pregrado y posgrado
  academicLevels: [
    { code: "PREG", name: "Pregrado" },
    { code: "GRAD", name: "Posgrado" },
  ],

  // Filtro específico: Solo facultad de Ingeniería
  faculties: ["Ingeniería"],

  // Filtro de programas específicos (códigos SAE de ingenierías)
  programs: [
    "IIND", // Ingeniería Industrial
    "ISOF", // Ingeniería de Sistemas
    "ICIV", // Ingeniería Civil
    "IELE", // Ingeniería Electrónica
  ],

  // Días múltiples con horarios específicos
  attendanceDays: [
    "Lunes 15 de abril - 9:00 AM",
    "Lunes 15 de abril - 2:00 PM",
    "Martes 16 de abril - 9:00 AM",
  ],

  // Configuración de desarrollo intermedia
  sandboxMode: false,
  debugMode: true, // Habilitado para pruebas
  devMode: false,
  debugEmail: "eventos.test@javeriana.edu.co",

  // Cache optimizado
  cache: {
    enabled: true,
    expirationHours: 6, // Más frecuente para eventos específicos
  },

  // URLs específicas para datos
  urls: {
    locations: "https://cloud.cx.javeriana.edu.co/paises.json",
    prefixes: "https://cloud.cx.javeriana.edu.co/codigos_pais.json",
    programs: "https://cloud.cx.javeriana.edu.co/Programas_Ingenieria.json",
    periods: "https://cloud.cx.javeriana.edu.co/periodos.json",
  },
};

// ==================================================
// EJEMPLO 4: CONFIGURACIÓN AVANZADA CON CALLBACKS
// ==================================================
// Formulario con lógica personalizada y callbacks
// Para eventos que requieren comportamientos específicos

export const configAdvance = {
  // Datos completos del evento
  eventName: "Simposio de Posgrados 2024",
  eventDate: "2024-05-10",
  campaign: "SIMP_POSG_2024",
  article: "posgrados_premium",
  source: "email_marketing",
  subSource: "alumni_database",
  medium: "email",
  leadSource: "Alumni Relations",
  originRequest: "evento_exclusivo",

  // Lista completa de ubicaciones personalizadas
  countries: ["Colombia", "Ecuador", "Perú", "México"],
  departments: [], // Se cargarán dinámicamente
  cities: [], // Se cargarán dinámicamente

  // Tipos de asistente para audiencia de posgrado
  typeAttendee: [
    "Graduado",
    "Profesional",
    "Docente y/o psicoorientador",
    "Administrativo PUJ",
    "Empresario",
  ],

  // Solo posgrados y programas eclesiásticos
  academicLevels: [
    { code: "GRAD", name: "Posgrado" },
    { code: "ECLE", name: "Eclesiástico" },
  ],

  // Facultades específicas con programas de posgrado destacados
  faculties: [
    "Ciencias Sociales",
    "Medicina",
    "Ingeniería",
    "Ciencias Económicas y Administrativas",
    "Derecho",
  ],

  // Programas premium de posgrado
  programs: [
    "MBAG", // MBA Gerencial
    "MACOM", // Maestría en Comunicación
    "DDER", // Doctorado en Derecho
    "MESP", // Maestría en Especialización Médica
    "MING", // Maestría en Ingeniería
  ],

  // Días del simposio con sesiones específicas
  attendanceDays: [
    "Viernes 10 de mayo - Sesión Mañana (9:00-12:00)",
    "Viernes 10 de mayo - Sesión Tarde (14:00-17:00)",
    "Sábado 11 de mayo - Sesión Especial (9:00-15:00)",
  ],

  // Universidades para referencia cruzada
  university: [
    "Pontificia Universidad Javeriana",
    "Universidad Nacional",
    "Universidad de los Andes",
    "Universidad del Rosario",
  ],

  // Configuración avanzada de desarrollo
  sandboxMode: false,
  debugMode: true,
  devMode: false,
  debugEmail: "posgrados.analytics@javeriana.edu.co",

  // Cache optimizado para posgrados
  cache: {
    enabled: true,
    expirationHours: 2, // Cache corto para datos dinámicos
  },

  // URLs completas de servicios
  urls: {
    locations: "https://api.javeriana.edu.co/v2/ubicaciones",
    prefixes: "https://api.javeriana.edu.co/v2/prefijos",
    programs: "https://api.javeriana.edu.co/v2/posgrados",
    periods: "https://api.javeriana.edu.co/v2/periodos",
  },

  // URL personalizada de agradecimiento
  thankYouUrl: "https://posgrados.javeriana.edu.co/simposio-2024/gracias",

  // Configuración avanzada de logging
  logging: {
    enabled: true,
    level: "debug", // Logging detallado
    showTimestamp: true,
    showLevel: true,
  },

  // Callbacks personalizados para lógica avanzada
  callbacks: {
    // Se ejecuta cuando el formulario termina de cargar
    onFormLoad: function () {
      console.log("Simposio: Formulario cargado correctamente");
      // Lógica personalizada de inicialización
    },

    // Se ejecuta antes del envío del formulario
    onFormSubmit: function (formData) {
      console.log("Simposio: Enviando datos:", formData);
      // Validaciones adicionales o tracking
      return true; // Continuar con envío
    },

    // Se ejecuta cuando cambia cualquier campo
    onFieldChange: function (fieldName, value) {
      console.log(`Campo ${fieldName} cambió a: ${value}`);
      // Lógica personalizada por campo
    },

    // Se ejecuta cuando hay errores de validación
    onValidationError: function (errors) {
      console.log("Errores de validación:", errors);
      // Manejo personalizado de errores
    },
  },
};

// ==================================================
// EJEMPLO 5: CONFIGURACIÓN COMPLEJA CON MÚLTIPLES ESCENARIOS
// ==================================================
// La configuración más completa posible
// Para eventos grandes con múltiples audiencias y requisitos complejos

export const configComplete = {
  // Datos completos del evento con tracking avanzado
  eventName: "Javeriana Expo 2024 - Encuentro Universitario",
  eventDate: "2024-06-15",
  campaign: "JAVE_EXPO_2024_MASTER",
  article: "expo_universitaria_completa",
  source: "omnicanal",
  subSource: "integracion_completa",
  medium: "mixto",
  leadSource: "Marketing 360",
  originRequest: "evento_institucional_mayor",

  // Configuración completa de ubicaciones
  countries: [
    "Colombia",
    "Venezuela",
    "Ecuador",
    "Perú",
    "Brasil",
    "México",
    "Estados Unidos",
    "España",
    "Francia",
  ],
  departments: [], // Carga dinámica desde API
  cities: [], // Carga dinámica desde API

  // Todos los tipos de asistente disponibles
  typeAttendee: [
    "Aspirante",
    "Padre de familia y/o acudiente",
    "Estudiante actual",
    "Graduado",
    "Docente y/o psicoorientador",
    "Visitante PUJ",
    "Administrativo PUJ",
    "Empresario",
  ],

  // Todos los niveles académicos
  academicLevels: [
    { code: "PREG", name: "Pregrado" },
    { code: "GRAD", name: "Posgrado" },
    { code: "ECLE", name: "Eclesiástico" },
    { code: "ETDH", name: "Técnico" },
    { code: "CONT", name: "Educación Continua" },
  ],

  // Todas las facultades (sin filtro - mostrar todas)
  faculties: [],

  // Programas destacados de todas las áreas
  programs: [
    // Pregrados destacados
    "MEDI",
    "DERE",
    "IIND",
    "ISOF",
    "PSIC",
    "COMU",
    // Posgrados premium
    "MBAG",
    "MACOM",
    "DDER",
    "MESP",
    "MING",
    // Programas eclesiásticos
    "TEOF",
    "FILO",
    "HIST",
  ],

  // Agenda completa del evento (múltiples días y sesiones)
  attendanceDays: [
    "Jueves 13 de junio - Pre-evento Alumni (18:00-20:00)",
    "Viernes 14 de junio - Jornada Académica (8:00-17:00)",
    "Sábado 15 de junio - Expo Principal (9:00-18:00)",
    "Domingo 16 de junio - Actividades Familiares (10:00-16:00)",
    "Lunes 17 de junio - Sesiones Empresariales (9:00-15:00)",
  ],

  // Lista completa de universidades para benchmarking
  university: [
    "Pontificia Universidad Javeriana",
    "Universidad Nacional de Colombia",
    "Universidad de los Andes",
    "Universidad del Rosario",
    "Universidad Externado",
    "Universidad Católica",
    "EAFIT",
    "Universidad del Norte",
  ],

  // Lista de colegios para tracking de origen
  company: [
    "Colegio San Patricio",
    "Gimnasio Moderno",
    "Colegio Anglo Colombiano",
    "Liceo Francés",
    "Colegio Rochester",
  ],

  // Configuración de desarrollo para producción
  sandboxMode: false, // Producción real
  debugMode: false, // Sin debug en producción
  devMode: false, // Modo producción
  debugEmail: "", // Sin email debug en producción

  // Cache optimizado para alto tráfico
  cache: {
    enabled: true,
    expirationHours: 1, // Cache muy corto para datos en tiempo real
  },

  // URLs de servicios de producción con alta disponibilidad
  urls: {
    locations: "https://api-prod.javeriana.edu.co/v3/ubicaciones",
    prefixes: "https://api-prod.javeriana.edu.co/v3/prefijos-telefono",
    programs: "https://api-prod.javeriana.edu.co/v3/programas-academicos",
    periods: "https://api-prod.javeriana.edu.co/v3/periodos-admision",
  },

  // Configuración de logging para análisis avanzado
  logging: {
    enabled: true,
    level: "info", // Nivel informativo para producción
    showTimestamp: true,
    showLevel: true,
  },

  // Callbacks avanzados con lógica de negocio compleja
  callbacks: {
    // Inicialización compleja del formulario
    onFormLoad: function () {
      console.log("EXPO 2024: Inicializando formulario avanzado");

      // Configurar tracking de analytics
      if (typeof gtag !== "undefined") {
        gtag("event", "form_load", {
          event_category: "expo2024",
          event_label: "formulario_cargado",
        });
      }

      // Personalizar interfaz según hora del día
      const hora = new Date().getHours();
      const saludoEl = document.querySelector(".saludo");
      if (saludoEl) {
        if (hora < 12) {
          saludoEl.textContent = "¡Buenos días! Regístrate para Javeriana Expo 2024";
        } else if (hora < 18) {
          saludoEl.textContent = "¡Buenas tardes! Regístrate para Javeriana Expo 2024";
        } else {
          saludoEl.textContent = "¡Buenas noches! Regístrate para Javeriana Expo 2024";
        }
      }
    },

    // Lógica pre-envío con validaciones de negocio
    onFormSubmit: function (formData) {
      console.log("EXPO 2024: Procesando envío con datos:", formData);

      // Validación de reglas de negocio específicas
      if (formData.type_attendee === "Empresario" && !formData.company) {
        alert("Los empresarios deben especificar su empresa");
        return false;
      }

      // Tracking de conversión
      if (typeof gtag !== "undefined") {
        gtag("event", "form_submit", {
          event_category: "expo2024",
          event_label: "formulario_enviado",
          value: 1,
        });
      }

      // Guardado local para recuperación en caso de error
      localStorage.setItem("expo2024_backup", JSON.stringify(formData));

      return true;
    },

    // Tracking detallado de interacciones
    onFieldChange: function (fieldName, value) {
      console.log(`EXPO 2024: Campo ${fieldName} = ${value}`);

      // Lógica específica por campo
      switch (fieldName) {
        case "type_attendee":
          // Mostrar/ocultar campos según tipo de asistente
          if (this.toggleFieldsBasedOnAttendeeType) {
            this.toggleFieldsBasedOnAttendeeType(value);
          }
          break;

        case "academic_level":
          // Filtrar programas según nivel académico
          if (this.filterProgramsByLevel) {
            this.filterProgramsByLevel(value);
          }
          break;

        case "country":
          // Tracking de distribución geográfica
          if (typeof gtag !== "undefined") {
            gtag("event", "country_selection", {
              event_category: "expo2024",
              event_label: value,
            });
          }
          break;
      }
    },

    // Manejo avanzado de errores
    onValidationError: function (errors) {
      console.log("EXPO 2024: Errores detectados:", errors);

      // Tracking de errores para optimización
      if (typeof gtag !== "undefined") {
        gtag("event", "form_error", {
          event_category: "expo2024",
          event_label: "errores_validacion",
          value: errors.length,
        });
      }

      // Análisis de patrones de error
      const errorTypes = errors.map((e) => e.type);
      localStorage.setItem(
        "expo2024_errors",
        JSON.stringify({
          timestamp: new Date().toISOString(),
          errors: errorTypes,
        })
      );

      // Sugerencias contextuales
      if (this.showContextualHelp) {
        this.showContextualHelp(errors);
      }
    },
  },
};

// ==================================================
// USAR LOS EJEMPLOS
// ==================================================

// Auto-inicialización de ejemplos si están presentes en el DOM
document.addEventListener("DOMContentLoaded", function () {
  // Ejemplo 1: Configuración mínima
  const formMini = new FormManager("formMini", configMini);
  formMini.initialize();

  // Ejemplo 2: Configuración básica
  const formBase = new FormManager("formBase", configBase);
  formBase.initialize();

  // Ejemplo 3: Configuración intermedia
  const formMedium = new FormManager("formMedium", configMedium);
  formMedium.initialize();

  // Ejemplo 4: Configuración avanzada
  const formAdvance = new FormManager("formAdvance", configAdvance);
  formAdvance.initialize();

  // Ejemplo 5: Configuración compleja
  const formComplete = new FormManager("formComplete", configComplete);
  formComplete.initialize();
});
