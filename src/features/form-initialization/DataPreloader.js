/**
 * Data - Maneja la carga y gestión de datos del formulario
 * Incluye ubicaciones, prefijos telefónicos, programas académicos y períodos
 * @version 1.0
 */

import { Cache } from "../../utils/cache-manager.js";

export class Data {
  constructor({ cache = {}, urls = {}, logger }) {
    this.cacheEnabled = cache.enabled;
    this.cacheExpirationHours = cache.expirationHours;

    this.urls = {
      ...urls,
    };

    this.logger = logger;

    // URLs de fallback en orden de prioridad
    this.fallbackUrls = {
      locations: [
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/ubicaciones.json",
        "https://cloud.cx.javeriana.edu.co/paises.json",
        "../data/ubicaciones.json",
      ],
      prefixes: [
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/codigos_pais.json",
        "https://cloud.cx.javeriana.edu.co/codigos_pais.Json",
        "../data/codigos_pais.json",
      ],
      programs: [
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/programas.json",
        "https://cloud.cx.javeriana.edu.co/Programas.json",
        "../data/programas.json",
      ],
      periods: [
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/periodos.json",
        "https://cloud.cx.javeriana.edu.co/periodos.json",
        "../data/periodos.json",
      ],
      university: [
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/universidades.json",
        "https://cloud.cx.javeriana.edu.co/universidades.json",
        "../data/universidades.json",
      ],
      college: [
        "./data/Colegios PRD.json", // Archivo local primero para desarrollo
        "../data/Colegios PRD.json",
        "https://www.javeriana.edu.co/recursosdb/1372208/10609114/Colegios+PRD.json",
        "https://cloud.cx.javeriana.edu.co/Colegios+PRD.json",
      ],
    };

    // Obtener instancia global del cache
    this.cache = Cache.getInstance();

    // Almacén de datos cargados
    this.data = {
      locations: null,
      prefixes: null,
      programs: null,
      periods: null,
    };

    // Estado de carga
    this.loadingPromises = {};
    this.isInitialized = false;
  }

  /**
   * Cargar datos desde URL con manejo de caché
   */
  async loadData(url, cacheKey = null) {
    const actualCacheKey = cacheKey || url;

    // Verificar caché si está habilitado
    if (this.cacheEnabled && cacheKey) {
      const cachedData = this.getCachedData(actualCacheKey);
      if (cachedData) {
        this.logger.loading(`Cargando datos desde caché: ${actualCacheKey}`);
        return cachedData;
      }
    }

    try {
      this.logger.loading(`Cargando datos desde: ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Guardar en caché si está habilitado
      if (this.cacheEnabled && cacheKey) {
        this.setCachedData(actualCacheKey, data);
      }

      this.logger.success(`Datos cargados correctamente: ${url}`);
      return data;
    } catch (error) {
      this.logger.error(`Error cargando datos desde ${url}:`, error);
      throw error;
    }
  }

  /**
   * Cargar datos con sistema de fallback en cascada y cache global compartido
   */
  async loadDataWithFallback(dataType) {
    const actualCacheKey = dataType;

    // Verificar si ya hay una carga en progreso (compartida entre instancias)
    const existingPromise = this.cache.getLoadingPromise(actualCacheKey);
    if (existingPromise) {
      this.logger.loading(`Esperando carga en progreso compartida: ${actualCacheKey}`);
      return await existingPromise;
    }

    // Verificar caché global si está habilitado
    if (this.cacheEnabled) {
      const cachedData = this.cache.getCachedData(actualCacheKey, this.cacheExpirationHours);
      if (cachedData) {
        this.logger.loading(`Cargando datos desde caché global: ${actualCacheKey}`);
        return cachedData;
      }
    }

    // Crear promesa de carga y registrarla globalmente
    const loadPromise = this._performDataLoad(dataType, actualCacheKey);
    this.cache.setLoadingPromise(actualCacheKey, loadPromise);

    return await loadPromise;
  }

  /**
   * Realizar la carga real de datos (método privado)
   */
  async _performDataLoad(dataType, cacheKey) {
    // Obtener URLs en orden: usuario, fallbacks
    const urls = [];

    // Primero intentar con la URL del usuario si existe
    if (this.urls[dataType]) {
      urls.push(this.urls[dataType]);
    }

    // Luego agregar las URLs de fallback
    if (this.fallbackUrls[dataType]) {
      urls.push(...this.fallbackUrls[dataType]);
    }

    // Eliminar duplicados manteniendo el orden
    const uniqueUrls = [...new Set(urls)];

    let lastError = null;

    for (const url of uniqueUrls) {
      try {
        this.logger.loading(`Intentando cargar datos desde: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Guardar en caché global si está habilitado
        if (this.cacheEnabled && cacheKey) {
          this.cache.setCachedData(cacheKey, data);
        }

        this.logger.success(`Datos cargados correctamente desde: ${url}`);
        return data;
      } catch (error) {
        this.logger.warn(`Error cargando desde ${url}: ${error.message}`);
        lastError = error;
        continue;
      }
    }

    // Si ninguna URL funcionó, lanzar el último error
    this.logger.error(
      `Error cargando datos de tipo '${dataType}' desde todas las URLs disponibles`
    );
    throw lastError || new Error(`No se pudieron cargar los datos de tipo '${dataType}'`);
  }

  /**
   * Cargar ubicaciones (países, departamentos, ciudades)
   */
  async loadLocations() {
    if (this.data.locations) {
      return this.data.locations;
    }

    // Evitar múltiples cargas simultáneas
    if (this.loadingPromises.locations) {
      return await this.loadingPromises.locations;
    }

    this.loadingPromises.locations = this.loadDataWithFallback("locations");

    try {
      this.data.locations = await this.loadingPromises.locations;
      return this.data.locations;
    } finally {
      delete this.loadingPromises.locations;
    }
  }

  /**
   * Cargar prefijos telefónicos
   */
  async loadPrefixes() {
    if (this.data.prefixes) {
      return this.data.prefixes;
    }

    if (this.loadingPromises.prefixes) {
      return await this.loadingPromises.prefixes;
    }

    this.loadingPromises.prefixes = this.loadDataWithFallback("prefixes");

    try {
      const rawData = await this.loadingPromises.prefixes;

      // Mantener los datos originales sin transformar
      this.data.prefixes = rawData;

      return this.data.prefixes;
    } finally {
      delete this.loadingPromises.prefixes;
    }
  }

  /**
   * Cargar programas académicos
   */
  async loadPrograms() {
    if (this.data.programs) {
      return this.data.programs;
    }

    if (this.loadingPromises.programs) {
      return await this.loadingPromises.programs;
    }

    this.loadingPromises.programs = this.loadDataWithFallback("programs");

    try {
      this.data.programs = await this.loadingPromises.programs;
      return this.data.programs;
    } finally {
      delete this.loadingPromises.programs;
    }
  }

  /**
   * Cargar períodos académicos
   */
  async loadPeriods() {
    if (this.data.periods) {
      return this.data.periods;
    }

    if (this.loadingPromises.periods) {
      return await this.loadingPromises.periods;
    }

    this.loadingPromises.periods = this.loadDataWithFallback("periods");

    try {
      this.data.periods = await this.loadingPromises.periods;
      return this.data.periods;
    } finally {
      delete this.loadingPromises.periods;
    }
  }

  async loadUniversity() {
    if (this.data.university) {
      return this.data.university;
    }

    if (this.loadingPromises.university) {
      return await this.loadingPromises.university;
    }

    this.loadingPromises.university = this.loadDataWithFallback("university");

    try {
      this.data.university = await this.loadingPromises.university;
      return this.data.university;
    } finally {
      delete this.loadingPromises.university;
    }
  }

  async loadCollege() {
    if (this.data.college) {
      return this.data.college;
    }

    if (this.loadingPromises.college) {
      return await this.loadingPromises.college;
    }

    this.loadingPromises.college = this.loadDataWithFallback("college");

    try {
      this.data.college = await this.loadingPromises.college;
      return this.data.college;
    } finally {
      delete this.loadingPromises.college;
    }
  }

  /**
   * Cargar todos los datos
   */
  async loadAll() {
    try {
      this.logger.loading("Cargando todos los datos...");

      await Promise.all([
        this.loadLocations(),
        this.loadPrefixes(),
        this.loadPrograms(),
        this.loadPeriods(),
        this.loadUniversity(),
        this.loadCollege(),
      ]);

      this.isInitialized = true;
      this.logger.success("Todos los datos cargados correctamente");

      if (this.data.programs) {
        this.logger.debug("Niveles académicos en programas:", Object.keys(this.data.programs));
      }
    } catch (error) {
      this.logger.error("Error cargando datos:", error);
      throw error;
    }
  }

  /**
   * Obtener ubicaciones
   */
  getLocations() {
    return this.data.locations;
  }

  /**
   * Obtener países
   */
  getCountries() {
    if (!this.data.locations) return [];

    return Object.keys(this.data.locations).map((key) => ({
      code: key,
      name: this.data.locations[key].nombre,
    }));
  }

  /**
   * Obtener departamentos de Colombia
   */
  getDepartments() {
    if (!this.data.locations || !this.data.locations.COL) return [];

    return this.data.locations.COL.departamentos || [];
  }

  /**
   * Obtener ciudades de un departamento
   */
  getCities(departmentCode) {
    if (!this.data.locations || !this.data.locations.COL) return [];

    const department = this.data.locations.COL.departamentos.find(
      (dep) => dep.codigo === departmentCode
    );

    return department ? department.ciudades : [];
  }

  /**
   * Obtener prefijos telefónicos
   */
  getPrefixes() {
    return this.data.prefixes || [];
  }

  /**
   * Obtener prefijo por código de país
   */
  getPrefixByCountryCode(countryCode) {
    if (!this.data.prefixes) return null;

    return this.data.prefixes.find((prefix) => prefix.iso2 === countryCode);
  }

  /**
   * Obtener todos los programas académicos
   */
  getAllPrograms() {
    return this.data.programs;
  }

  /**
   * Obtener niveles académicos disponibles
   */
  getAcademicLevels() {
    if (!this.data.programs) {
      this.logger.warn("No hay datos de programas cargados");
      return [];
    }

    const levelNames = {
      PREG: "Pregrado",
      GRAD: "Posgrado",
      ECLE: "Eclesiástico",
      ETDH: "Técnico",
    };

    const levels = Object.keys(this.data.programs).map((levelCode) => ({
      code: levelCode,
      name: levelNames[levelCode] || levelCode,
    }));

    this.logger.debug("Niveles académicos detectados desde programas:", levels);
    return levels;
  }

  /**
   * Obtener facultades por nivel académico
   */
  getFaculties(academicLevel) {
    if (!this.data.programs || !this.data.programs[academicLevel]) {
      this.logger.warn(`No se encontraron programas para el nivel académico: ${academicLevel}`);
      return [];
    }

    const levelPrograms = this.data.programs[academicLevel];
    this.logger.debug(`Estructura de datos para nivel ${academicLevel}:`, levelPrograms);

    // Verificar estructura de datos
    if (typeof levelPrograms === "object" && !Array.isArray(levelPrograms)) {
      // Estructura: programs.PREG.FACULTAD
      const faculties = Object.keys(levelPrograms);
      this.logger.debug(`Facultades encontradas para ${academicLevel}:`, faculties);
      return faculties;
    } else if (Array.isArray(levelPrograms)) {
      // Estructura: array de programas con propiedad facultad
      const faculties = [...new Set(levelPrograms.map((program) => program.facultad))];
      const filteredFaculties = faculties.filter((faculty) => faculty); // Filtrar valores vacíos
      this.logger.debug(`Facultades encontradas para ${academicLevel}:`, filteredFaculties);
      return filteredFaculties;
    }

    this.logger.warn(`Estructura de datos no reconocida para nivel ${academicLevel}`);
    return [];
  }

  /**
   * Obtener programas por nivel académico y facultad
   */
  getPrograms(academicLevel, faculty) {
    // Si no se proporcionan parámetros, retornar todos los programas
    if (!academicLevel && !faculty) {
      return this.getAllPrograms();
    }

    if (!this.data.programs) {
      this.logger.warn(`No hay datos de programas cargados`);
      return [];
    }

    if (!this.data.programs[academicLevel]) {
      this.logger.warn(`No hay programas para el nivel académico: ${academicLevel}`);
      return [];
    }

    const levelPrograms = this.data.programs[academicLevel];

    // Si no se especifica facultad, retornar todos los programas del nivel
    if (!faculty) {
      if (Array.isArray(levelPrograms)) {
        return levelPrograms;
      } else {
        // Si es un objeto con facultades, retornar todos los programas
        const allPrograms = [];
        Object.values(levelPrograms).forEach((facultyData) => {
          if (facultyData.Programas && Array.isArray(facultyData.Programas)) {
            allPrograms.push(...facultyData.Programas);
          }
        });
        return allPrograms;
      }
    }

    // Verificar estructura de datos
    if (levelPrograms[faculty] && levelPrograms[faculty].Programas) {
      // Estructura: programs.PREG.FACULTAD.Programas
      return levelPrograms[faculty].Programas;
    } else if (Array.isArray(levelPrograms)) {
      // Estructura: array de programas
      return levelPrograms.filter((program) => program.facultad === faculty);
    }

    this.logger.warn(`No se encontraron programas para facultad ${faculty}`);
    return [];
  }

  /**
   * Obtener períodos académicos
   */
  getPeriods(academicLevel = null) {
    if (!this.data.periods) return [];

    if (Array.isArray(this.data.periods)) {
      // Formato legacy: array de períodos
      if (academicLevel) {
        return this.data.periods.filter(
          (period) => period.nivel_academico === academicLevel || period.nivel_academico === "TODOS"
        );
      }
      return this.data.periods;
    } else if (typeof this.data.periods === "object") {
      // Formato actual: objeto con niveles académicos
      if (academicLevel && this.data.periods[academicLevel]) {
        const periodsForLevel = this.data.periods[academicLevel];
        return Object.entries(periodsForLevel).map(([nombre, codigo]) => ({
          codigo: codigo,
          nombre: nombre,
        }));
      }

      // Retornar todos los períodos si no se especifica nivel
      const allPeriods = [];
      Object.keys(this.data.periods).forEach((level) => {
        const periodsForLevel = this.data.periods[level];
        Object.entries(periodsForLevel).forEach(([nombre, codigo]) => {
          allPeriods.push({
            codigo: codigo,
            nombre: nombre,
            nivel_academico: level,
          });
        });
      });

      return allPeriods;
    }

    return [];
  }

  /**
   * Buscar programa por código
   */
  findProgramByCode(programCode) {
    if (!this.data.programs) return null;

    for (const level of Object.keys(this.data.programs)) {
      const levelPrograms = this.data.programs[level];

      if (typeof levelPrograms === "object" && !Array.isArray(levelPrograms)) {
        // Estructura: programs.PREG.FACULTAD.Programas
        for (const faculty of Object.keys(levelPrograms)) {
          const programs = levelPrograms[faculty].Programas || [];
          const program = programs.find((p) => (p.Codigo || p.codigo) === programCode);
          if (program) {
            return {
              ...program,
              nivel_academico: level,
              facultad: faculty,
            };
          }
        }
      } else if (Array.isArray(levelPrograms)) {
        // Estructura: array de programas
        const program = levelPrograms.find((p) => (p.Codigo || p.codigo) === programCode);
        if (program) {
          return program;
        }
      }
    }

    return null;
  }

  /**
   * Filtrar programas por criterios
   */
  filterPrograms(criteria = {}) {
    if (!this.data.programs) return [];

    const { level, faculty, programCodes } = criteria;
    let filteredPrograms = [];

    // Iterar por niveles
    const levelsToCheck = level ? [level] : Object.keys(this.data.programs);

    levelsToCheck.forEach((currentLevel) => {
      const levelPrograms = this.data.programs[currentLevel];

      if (typeof levelPrograms === "object" && !Array.isArray(levelPrograms)) {
        // Estructura: programs.PREG.FACULTAD.Programas
        const facultiesToCheck = faculty ? [faculty] : Object.keys(levelPrograms);

        facultiesToCheck.forEach((currentFaculty) => {
          const programs = levelPrograms[currentFaculty]?.Programas || [];

          programs.forEach((program) => {
            const programCode = program.Codigo || program.codigo;

            // Aplicar filtro de códigos si existe
            if (!programCodes || programCodes.includes(programCode)) {
              filteredPrograms.push({
                ...program,
                nivel_academico: currentLevel,
                facultad: currentFaculty,
              });
            }
          });
        });
      } else if (Array.isArray(levelPrograms)) {
        // Estructura: array de programas
        levelPrograms.forEach((program) => {
          const programCode = program.Codigo || program.codigo;

          // Aplicar filtros
          if (
            (!faculty || program.facultad === faculty) &&
            (!programCodes || programCodes.includes(programCode))
          ) {
            filteredPrograms.push({
              ...program,
              nivel_academico: currentLevel,
            });
          }
        });
      }
    });

    return filteredPrograms;
  }

  /**
   * Métodos de caché
   */
  getCachedData(key) {
    if (!this.cacheEnabled) return null;

    try {
      const cachedItem = localStorage.getItem(`formData_${key}`);
      if (!cachedItem) return null;

      const { data, timestamp } = JSON.parse(cachedItem);
      const now = Date.now();
      const expirationTime = this.cacheExpirationHours * 60 * 60 * 1000; // Convertir a milisegundos

      if (now - timestamp > expirationTime) {
        localStorage.removeItem(`formData_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      this.logger.error("Error al leer caché:", error);
      return null;
    }
  }

  setCachedData(key, data) {
    if (!this.cacheEnabled) return;

    try {
      const cacheItem = {
        data: data,
        timestamp: Date.now(),
      };

      localStorage.setItem(`formData_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      this.logger.error("Error al guardar en caché:", error);
    }
  }

  clearCache() {
    if (!this.cacheEnabled) return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("formData_")) {
        localStorage.removeItem(key);
      }
    });

    this.logger.info("🧹 Caché limpiado");
  }

  /**
   * Verificar si los datos están cargados
   */
  isDataLoaded() {
    return (
      this.isInitialized &&
      this.data.locations &&
      this.data.prefixes &&
      this.data.programs &&
      this.data.periods
    );
  }

  /**
   * Obtener estadísticas de datos
   */
  getDataStats() {
    if (!this.isDataLoaded()) return null;

    return {
      countries: Object.keys(this.data.locations).length,
      departments: this.data.locations.COL ? this.data.locations.COL.departamentos.length : 0,
      prefixes: this.data.prefixes.length,
      academicLevels: Object.keys(this.data.programs).length,
      programs: this.filterPrograms().length,
      periods: this.getPeriods().length,
    };
  }

  /**
   * Recargar datos
   */
  async reload() {
    this.data = {
      locations: null,
      prefixes: null,
      programs: null,
      periods: null,
    };

    this.isInitialized = false;
    this.clearCache();

    await this.loadAll();
  }

  /**
   * Actualizar URLs de datos
   */
  updateurls(newUrls) {
    this.urls = { ...this.urls, ...newUrls };
  }

  /**
   * Configurar caché
   */
  configureCaching(enabled, expirationHours = 12) {
    this.cacheEnabled = enabled;
    this.cacheExpirationHours = expirationHours;

    if (!enabled) {
      this.clearCache();
    }
  }
}
