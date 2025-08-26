/**
 * 🧪 ARCHIVO DE CONFIGURACIONES PARA PRUEBAS - FormManager
 *
 * Este archivo contiene las configuraciones utilizadas en test.html
 * Cada configuración demuestra diferentes tipos de filtros y configuraciones
 *
 * ESTRUCTURA PROGRESIVA DE FILTROS:
 * 1. Configuración base (Eventos y Open Day)
 * 2. Filtro por Nivel académico
 * 3. Filtro por Facultad(es)
 * 4. Filtro por Programa(s)
 * 5. Filtro por Países
 * 6. Filtro por Departamentos
 * 7. Filtro por Ciudades
 * 8. Configuraciones adicionales (días múltiples, universidades, empresas, colegios)
 */

// ============================================================================
// 📝 PRUEBA 1: CONFIGURACIÓN BASE (EVENTOS Y OPEN DAY)
// ============================================================================
// Configuración mínima para demostrar comportamiento estándar sin filtros
// ✅ Usado en: formMini (test.html)

export const configMiniOld = {
  // DATOS DEL EVENTO
  campaign: "Mercadeo",
  eventName: "Open Day Técnico 2024",
  eventDate: "23/01/2025 12:00 PM", // Formato: DD/MM/YYYY HH:mm AM/PM

  // CONFIGURACIÓN BÁSICA DE EVENTO
  typeAttendee: ["Aspirante"], // ⭐ AUTO-SELECCIÓN: Solo "Aspirante" → se oculta el campo y aparecen automáticamente los campos académicos

  // 🎯 FILTRO PARA PROBAR CASO 1-1-1: Solo nivel ETDH (Técnico)
  /* academicLevels: [{ code: "ETDH", name: "Técnico" }], */

  attendanceDays: ["Jueves 15 de febrero de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // Logging detallado
  logging: {
    enabled: true,
  },

  // 💡 COMPORTAMIENTO ESPERADO:
  // ⭐ AUTO-SELECCIÓN ASPIRANTE: Como solo hay "Aspirante", se auto-selecciona y aparecen los campos académicos automáticamente
  // ✅ Campo "tipo de asistente" se oculta (ya preseleccionado)
  // ✅ Campos académicos aparecen inmediatamente sin necesidad de selección manual
  // ✅ Comportamiento optimizado para formularios dirigidos específicamente a aspirantes
  // ✅ Sin restricciones geográficas (países/departamentos/ciudades)
  // ✅ Formulario completo con todas las opciones académicas disponibles
};

const configMini = {
  campaign: "MERCA_JaverianaAlCaribe",
  eventName: "Javeriana al Caribe",
  eventDate: "02/09/2025 12:00 PM",
  retUrl: "https://www.javeriana.edu.co/info-prg/typ-javeriana-caribe",
  requestOrigin: "Web to Lead",
  source: "Digital",

  // 🎯 FILTRO PRINCIPAL: Solo ciudades específicas
  countries: ["Colombia"],
  departments: ["Atlántico", "Bolívar", "Magdalena"],
  cities: ["Barranquilla", "Cartagena", "Santa Marta"],

  // CONFIGURACIÓN DEL EVENTO
  attendanceDays: [
    "Martes 2 de septiembre - Cartagena",
    "Miércoles 3 de septiembre - Barranquilla",
  ],

  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Docente y/o psicoorientador"],

  // CONFIGURACIONES TÉCNICAS
  test: false,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // Logging detallado
  logging: {
    enabled: true,
  },
};

// ============================================================================
// 🎓 PRUEBA 2: FILTRO POR NIVEL ACADÉMICO
// ============================================================================
// Demuestra filtros por nivel académico específico (solo Pregrado)
// ✅ Usado en: formAcademicLevel (test.html)

export const configAcademicLevel = {
  // DATOS DEL EVENTO
  eventName: "Open Day Pregrado 2024",
  eventDate: "2024-03-20",
  campaign: "PREGRADO_ONLY_2024",
  article: "evento_pregrado",
  source: "landing_pregrado",
  medium: "web",

  // 🎯 FILTRO PRINCIPAL: Solo nivel de Pregrado
  academicLevels: [{ code: "PREG", name: "Pregrado" }],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],
  attendanceDays: ["Miércoles 20 de marzo de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Nivel académico: Oculto y preseleccionado automáticamente (Pregrado)
  // ✅ Facultades: Solo las que tienen programas de pregrado
  // ✅ Programas: Solo programas de pregrado disponibles
  // ✅ Al seleccionar "Aspirante" → Aparecen campos académicos filtrados
  // ✅ Optimizado para aspirantes a programas de pregrado
};

// ============================================================================
// 🏛️ PRUEBA 3: FILTRO POR FACULTAD(ES)
// ============================================================================
// Demuestra filtros por facultades específicas (Ingeniería)
// ✅ Usado en: formFaculty (test.html)

export const configFaculty = {
  // DATOS DEL EVENTO
  eventName: "Feria de Ingenierías 2024",
  eventDate: "2024-04-10",
  campaign: "INGENIERIA_2024",
  article: "evento_ingenieria",
  source: "email_especializado",
  medium: "email",

  // 🎯 FILTRO PRINCIPAL: Solo Facultad de Ingeniería
  faculties: ["Ingeniería"],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Graduado"],
  attendanceDays: ["Miércoles 10 de abril de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Nivel académico: Oculto y preseleccionado (Pregrado)
  // ✅ Facultad: Oculta y preseleccionada (Ingeniería)
  // ✅ Programas: Solo programas de Ingeniería disponibles
  // ✅ Al seleccionar "Aspirante" → Solo aparece selector de programas de ingeniería
  // ✅ Enfoque específico en programas de la Facultad de Ingeniería
};

// ============================================================================
// 📚 PRUEBA 4: FILTRO POR PROGRAMA(S)
// ============================================================================
// Demuestra filtros por programas específicos de múltiples facultades
// ✅ Usado en: formPrograms (test.html)

export const configPrograms = {
  // DATOS DEL EVENTO
  eventName: "Feria Interdisciplinaria 2024",
  eventDate: "2024-05-15",
  campaign: "INTERDISCIPLINARIA_2024",
  article: "evento_multifacultad",
  source: "redes_sociales",
  medium: "social",

  // 🎯 FILTRO PRINCIPAL: Programas específicos de diferentes facultades
  programs: [
    "MEDIC", // Medicina
    "DRCHO", // Derecho
    "PSICO", // Psicología
    "IINDS", // Ingeniería Industrial
    //"COMSC", // Comunicación Social
  ],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: [
    "Aspirante",
    //"Padre de familia y/o acudiente",
    //"Graduado",
    //"Docente y/o psicoorientador",
  ],
  attendanceDays: [
    "Miércoles 15 de mayo - Sesión Mañana (9:00-12:00)",
    "Miércoles 15 de mayo - Sesión Tarde (14:00-17:00)",
  ],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: true,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Nivel académico: Oculto y preseleccionado (Pregrado)
  // ✅ Facultad: Visible con opciones múltiples (Medicina, Derecho, Ciencias Sociales, Ingeniería, Comunicación)
  // ✅ Programas: Solo los 5 programas configurados
  // ✅ Al cambiar facultad → Solo aparecen programas de esa facultad
  // ✅ Demuestra selección inteligente entre múltiples facultades
};

// ============================================================================
// 🌍 PRUEBA 5: FILTRO POR PAÍSES
// ============================================================================
// Demuestra filtros por países específicos (internacionales)
// ✅ Usado en: formCountries (test.html)

export const configCountries = {
  // DATOS DEL EVENTO
  eventName: "Feria Internacional Javeriana 2024",
  eventDate: "2024-06-20",
  campaign: "INTERNACIONAL_2024",
  article: "evento_internacional",
  source: "internacional",
  medium: "digital",

  // 🎯 FILTRO PRINCIPAL: Solo países específicos
  countries: ["Colombia", "México", "Ecuador", "Perú", "Estados Unidos"],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Graduado", "Estudiante actual"],
  attendanceDays: ["Jueves 20 de junio de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Países: Solo los 5 países configurados disponibles
  // ✅ Al seleccionar "Colombia" → Funcionamiento normal con departamentos/ciudades
  // ✅ Al seleccionar otros países → Sin campos adicionales de ubicación
  // ✅ Enfoque en audiencia internacional específica
  // ✅ Optimizado para estudiantes internacionales
};

// ============================================================================
// 🏛️ PRUEBA 6: FILTRO POR DEPARTAMENTOS
// ============================================================================
// Demuestra filtros por departamentos específicos de Colombia
// ✅ Usado en: formDepartments (test.html)

export const configDepartments = {
  // DATOS DEL EVENTO
  eventName: "Encuentro Regional Colombia 2024",
  eventDate: "2024-07-25",
  campaign: "REGIONAL_COLOMBIA_2024",
  article: "evento_regional",
  source: "campaña_regional",
  medium: "mixto",

  // 🎯 FILTRO PRINCIPAL: Solo departamentos específicos
  departments: ["Cundinamarca", "Antioquia", "Valle del Cauca", "Atlántico", "Santander"],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente", "Graduado"],
  attendanceDays: ["Jueves 25 de julio de 2024", "Viernes 26 de julio de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Países: Solo Colombia disponible (implícito)
  // ✅ Departamentos: Solo los 5 departamentos configurados
  // ✅ Ciudades: Solo ciudades de los departamentos configurados
  // ✅ Enfoque en regiones específicas de Colombia
  // ✅ Optimizado para audiencia regional colombiana
};

// ============================================================================
// 🏙️ PRUEBA 7: FILTRO POR CIUDADES
// ============================================================================
// Demuestra filtros por ciudades específicas con filtrado automático de departamentos
// ✅ Usado en: formCities (test.html)

export const configCities = {
  // DATOS DEL EVENTO
  eventName: "Open Day Filtrado Jerárquico 2024",
  eventDate: "2024-08-30",
  campaign: "JERARQUICO_TEST_2024",
  article: "evento_jerarquico",
  source: "enfoque_jerarquico",
  medium: "digital",

  // 🎯 FILTRO JERÁRQUICO DE PRUEBA - Caso del usuario
  countries: ["Colombia"],
  departments: ["Atlántico", "Bolívar", "Magdalena"],
  cities: ["Barranquilla", "Cartagena", "Santa Marta"],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: ["Aspirante", "Padre de familia y/o acudiente"],
  attendanceDays: ["Viernes 30 de agosto de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: true,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO JERÁRQUICO:
  // 🔥 FILTRADO EN CASCADA: País -> Departamento -> Ciudad
  //
  // ✅ Países: Solo "Colombia" (preseleccionado por configuración)
  // ✅ Departamentos: Solo "Atlántico", "Bolívar", "Magdalena" (configurados)
  // ✅ Ciudades: Solo las que pertenecen a los departamentos configurados:
  //     • Atlántico → Barranquilla ✅
  //     • Bolívar → Cartagena ✅
  //     • Magdalena → Santa Marta ✅
  //
  // 🚀 LÓGICA JERÁRQUICA:
  // - Si ciudad no pertenece al departamento configurado → NO se muestra
  // - Solo se muestran ciudades que están en departamentos válidos
  // - Prioridad: departamentos configurados filtran las ciudades configuradas
};

// ============================================================================
// 🎯 PRUEBA 8: CONFIGURACIÓN ADICIONAL - DÍAS MÚLTIPLES
// ============================================================================
// Demuestra configuración con múltiples días y sesiones específicas
// ✅ Usado en: formMultipleDays (test.html)

export const configMultipleDays = {
  // DATOS DEL EVENTO
  eventName: "Semana Universitaria Javeriana 2024",
  eventDate: "2024-09-02",
  campaign: "SEMANA_UNIVERSITARIA_2024",
  article: "evento_multiple_dias",
  source: "institucional",
  medium: "omnicanal",

  // CONFIGURACIÓN DE DÍAS MÚLTIPLES
  attendanceDays: [
    "Lunes 2 de septiembre - Inauguración (18:00-20:00)",
    "Martes 3 de septiembre - Jornada Académica (8:00-17:00)",
    "Miércoles 4 de septiembre - Feria de Programas (9:00-18:00)",
    "Jueves 5 de septiembre - Encuentro Alumni (19:00-22:00)",
    "Viernes 6 de septiembre - Clausura y Networking (16:00-20:00)",
  ],

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: [
    "Aspirante",
    "Padre de familia y/o acudiente",
    "Graduado",
    "Estudiante actual",
    "Docente y/o psicoorientador",
    "Administrativo PUJ",
  ],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Días de asistencia: 5 opciones con horarios específicos
  // ✅ Tipos de asistente: Amplia variedad para diferentes audiencias
  // ✅ Sin filtros académicos o geográficos - evento general
  // ✅ Configuración completa para evento institucional grande
};

// ============================================================================
// 🎓 PRUEBA 9: CONFIGURACIÓN ADICIONAL - UNIVERSIDADES Y FILTROS
// ============================================================================
// Demuestra configuración con lista de universidades y filtros de referencia
// ✅ Usado en: formUniversities (test.html)

export const configUniversities = {
  // DATOS DEL EVENTO
  eventName: "Encuentro Interuniversitario 2024",
  eventDate: "2024-10-15",
  campaign: "INTERUNIVERSITARIO_2024",
  article: "evento_universidades",
  source: "alianzas_academicas",
  medium: "referido",

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: [
    "Graduado",
    "Estudiante actual",
    "Docente y/o psicoorientador",
    "Administrativo PUJ",
  ],
  attendanceDays: ["Martes 15 de octubre de 2024"],

  universities: [
    "Universidad Prueba",
    "Univ. Nacional de Colombia",
    "Universidad de los Andes",
    "Universidad del Rosario",
    "Universidad Externado de Colombia",
    "Universidad de la Sabana",
    "Universidad Santo Tomas",
    "Univ. Católica de Colombia",
  ],

  // CONFIGURACIONES TÉCNICAS
  test: true,
  debug: true,
  development: false,
  debugEmail: "gavilanm-j@javeriana.edu.co",

  // 💡 COMPORTAMIENTO ESPERADO:
  // ✅ Campo Universidad: Visible con lista completa de universidades del JSON
  // ✅ Enfoque en red de universidades aliadas
  // ✅ Tipos de asistente: Orientado a comunidad académica
  // ✅ Para eventos de intercambio académico y colaboración
};

// ============================================================================
// 🏢 PRUEBA 10: CONFIGURACIÓN ADICIONAL - EMPRESAS Y COLEGIOS
// ============================================================================
// Demuestra configuración con empresas de convenio y colegios aliados
// ✅ Usado en: formCompaniesSchools (test.html)

export const configCompaniesSchools = {
  // DATOS DEL EVENTO
  eventName: "Encuentro Empresarial y Colegios 2024",
  eventDate: "2024-11-20",
  campaign: "EMPRESARIAL_COLEGIOS_2024",
  article: "evento_convenios",
  source: "convenios_institucionales",
  medium: "invitacion",

  // ✅ CASO 1: CONFIGURACIÓN CON COLEGIOS ESPECÍFICOS (COMENTADO)
  /* school: [
     "Colegio San Patricio",
     "Gimnasio Moderno",
     "Colegio Anglo Colombiano", 
     "Liceo Francés Louis Pasteur",
     "Colegio Rochester",
     "Colegio San Carlos",
     "Gimnasio Los Caobos",
     "Colegio Nueva Granada",
   ], */

  // ✅ CASO 2: SIN CONFIGURACIÓN - TODOS LOS COLEGIOS DEL JSON (ACTIVO)
  // school: [], // Array vacío o comentado = muestra todos los colegios

  // ✅ CASO 3: FILTRO POR CIUDAD - SOLO COLEGIOS DE BOGOTÁ
  // citySchool: "Bogotá D.C.",
  // citySchool: ["Bogotá D.C.", "Medellín"], // Múltiples ciudades

  // ✅ CASO 4: FILTRO POR CALENDARIO - SOLO CALENDARIO A
  // calendarSchool: "Calendario A",
  // calendarSchool: ["Calendario A", "Calendario B"], // Múltiples calendarios

  // ✅ CASO 5: COMBINACIÓN DE FILTROS
  // school: ["Gimnasio Moderno"], // Filtro por nombre
  // citySchool: "Bogotá D.C.",    // Y filtro por ciudad de colegios
  // calendarSchool: "Calendario A", // Y filtro por calendario de colegios

  // CONFIGURACIÓN DEL EVENTO
  typeAttendee: [
    "Aspirante",
    "Padre de familia y/o acudiente",
    "Docente y/o psicoorientador",
    "Visitante PUJ",
  ],
  attendanceDays: ["Miércoles 20 de noviembre de 2024"],

  // CONFIGURACIONES TÉCNICAS
  test: true, //Sandbox
  debug: true, // Envio de emails de prueba
  development: true, // No se envia a ningún endpoint
  debugEmail: "gavilanm-j@javeriana.edu.co",

  logging: {
    enabled: false,
  },

  // 💡 COMPORTAMIENTO ESPERADO (CASO ACTUAL - SIN FILTROS DE COLEGIOS):
  // ✅ Campo Empresa: Visible con 8 empresas de convenio específicas
  // ✅ Campo Colegio: Solo visible para "Aspirante" y "Docente y/o psicoorientador"
  //     → POWERED BY SELECT2: Búsqueda profesional y optimizada
  //     → 🔍 Búsqueda en tiempo real con highlighting
  //     → ⚡ Virtualización automática para +1000 colegios
  //     → 🎨 UI/UX profesional con estilos personalizados
  //     → 📱 Responsive y accesible
  //     → 🧹 Auto-limpieza al cambiar tipo de asistente
  // ✅ Tipos de asistente: Incluye empresarios y comunidad educativa
  // ✅ Para eventos de networking empresarial y alianzas educativas
  //
  // 🔧 CASOS DE USO DISPONIBLES PARA COLEGIOS:
  // - CASO 1: Filtro por nombres específicos (comentado arriba)
  // - CASO 2: Sin filtros - todos los colegios (ACTUAL)
  // - CASO 3: Filtro por ciudad - ej: citySchool: "Bogotá D.C."
  // - CASO 4: Filtro por calendario - ej: calendarSchool: "Calendario A"
  // - CASO 5: Combinación múltiple de filtros
};

// ============================================================================
// 🚀 AUTO-INICIALIZACIÓN DE FORMULARIOS DE PRUEBA
// ============================================================================
// Inicializa automáticamente todos los formularios cuando se carga la página

document.addEventListener("DOMContentLoaded", function () {
  // 📝 Prueba 1: Configuración Base
  if (document.getElementById("formMini")) {
    const formMini = new FormModules("formMini", configMini);
    formMini.initialize();
  }

  // 🎓 Prueba 2: Filtro por Nivel Académico
  if (document.getElementById("formAcademicLevel")) {
    const formAcademicLevel = new FormModules("formAcademicLevel", configAcademicLevel);
    formAcademicLevel.initialize();
  }

  // 🏛️ Prueba 3: Filtro por Facultad
  if (document.getElementById("formFaculty")) {
    const formFaculty = new FormModules("formFaculty", configFaculty);
    formFaculty.initialize();
  }

  // 📚 Prueba 4: Filtro por Programas
  if (document.getElementById("formPrograms")) {
    const formPrograms = new FormModules("formPrograms", configPrograms);
    formPrograms.initialize();
  }

  // 🌍 Prueba 5: Filtro por Países
  if (document.getElementById("formCountries")) {
    const formCountries = new FormModules("formCountries", configCountries);
    formCountries.initialize();
  }

  // 🏛️ Prueba 6: Filtro por Departamentos
  if (document.getElementById("formDepartments")) {
    const formDepartments = new FormModules("formDepartments", configDepartments);
    formDepartments.initialize();
  }

  // 🏙️ Prueba 7: Filtro por Ciudades
  if (document.getElementById("formCities")) {
    const formCities = new FormModules("formCities", configCities);
    formCities.initialize();
  }

  // 🎯 Prueba 8: Días Múltiples
  if (document.getElementById("formMultipleDays")) {
    const formMultipleDays = new FormModules("formMultipleDays", configMultipleDays);
    formMultipleDays.initialize();
  }

  // 🎓 Prueba 9: Universidades
  if (document.getElementById("formUniversities")) {
    const formUniversities = new FormModules("formUniversities", configUniversities);
    formUniversities.initialize();
  }

  // 🏢 Prueba 10: Empresas y Colegios
  if (document.getElementById("formCompaniesSchools")) {
    const formCompaniesSchools = new FormModules("formCompaniesSchools", configCompaniesSchools);
    formCompaniesSchools.initialize();
  }
});
