import { FormManager } from "../modules/FormManager.js";

// Configuración del formulario principal
const FORM_CONFIG = {
  eventName: "Open Day Avanzado 2025",
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],
  attendanceDays: ["Día 1 - Pregrado", "Día 2 - Posgrado", "Día 3 - Educación Continua"],
  debugMode: true,
  validation: {
    strictInitialValidation: false
  }
};

// Configuración del formulario de programas
const PROGRAMS_CONFIG = {
  eventName: "Filtros de Programas",
  company: "Universidad Javeriana",
  typeAttendee: ["Aspirante"],
  attendanceDays: ["Día único"],
  faculties: ["Ingeniería"],
  programs: ["ISIST", "IINDS", "ICIVL", "IELEC", "IMECA"],
  country: "CO",
  debugMode: true,
};

// Inicialización simple
async function init() {
  // Formulario principal
  if (document.getElementById("advanced_form")) {
    const advancedForm = new FormManager("advanced_form", FORM_CONFIG);
    window.FORM_INSTANCE = advancedForm; // Para script.js
    window.advancedForm = advancedForm;
    await advancedForm.initialize();
  }

  // Formulario de programas
  /* if (document.getElementById("programs_demo_form")) {
    const programsForm = new FormManager("programs_demo_form", PROGRAMS_CONFIG);
    window.programsForm = programsForm;
    await programsForm.initialize();
  } */
}

// Auto-inicialización
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
