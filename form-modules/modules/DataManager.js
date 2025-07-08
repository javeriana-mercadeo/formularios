/**
 * DataManager - Maneja la carga y gestión de datos del formulario
 * Incluye ubicaciones, prefijos telefónicos, programas académicos y períodos
 * @version 1.0
 */

export class DataManager {
  constructor(dataUrls = {}, cacheEnabled = false, cacheExpirationHours = 12) {
    this.dataUrls = {
      locations: '../data/ubicaciones.json',
      prefixes: '../data/codigos_pais.json',
      programs: '../data/programas.json',
      periods: '../data/periodos.json',
      ...dataUrls
    };
    
    this.cacheEnabled = cacheEnabled;
    this.cacheExpirationHours = cacheExpirationHours;
    
    // Almacén de datos cargados
    this.data = {
      locations: null,
      prefixes: null,
      programs: null,
      periods: null
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
        console.log(`📦 Datos cargados desde caché: ${actualCacheKey}`);
        return cachedData;
      }
    }
    
    try {
      console.log(`🔄 Cargando datos desde: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Guardar en caché si está habilitado
      if (this.cacheEnabled && cacheKey) {
        this.setCachedData(actualCacheKey, data);
      }
      
      console.log(`✅ Datos cargados correctamente: ${url}`);
      return data;
      
    } catch (error) {
      console.error(`❌ Error cargando datos desde ${url}:`, error);
      throw error;
    }
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
    
    this.loadingPromises.locations = this.loadData(this.dataUrls.locations, 'locations');
    
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
    
    this.loadingPromises.prefixes = this.loadData(this.dataUrls.prefixes, 'prefixes');
    
    try {
      const rawData = await this.loadingPromises.prefixes;
      
      // Transformar datos para uso más fácil
      this.data.prefixes = rawData.map(pais => ({
        iso2: pais.iso2,
        phoneCode: pais.phoneCode,
        phoneName: pais.nameES
      }));
      
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
    
    this.loadingPromises.programs = this.loadData(this.dataUrls.programs, 'programs');
    
    try {
      this.data.programs = await this.loadingPromises.programs;
      console.log('📊 Programas cargados:', this.data.programs);
      console.log('📋 Niveles disponibles:', Object.keys(this.data.programs));
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
    
    this.loadingPromises.periods = this.loadData(this.dataUrls.periods, 'periods');
    
    try {
      this.data.periods = await this.loadingPromises.periods;
      console.log('📅 Períodos cargados:', this.data.periods);
      console.log('📊 Estructura:', Array.isArray(this.data.periods) ? 'Array' : 'Object');
      
      if (!Array.isArray(this.data.periods)) {
        console.log('🎯 Niveles disponibles:', Object.keys(this.data.periods));
      }
      
      return this.data.periods;
    } finally {
      delete this.loadingPromises.periods;
    }
  }
  
  /**
   * Cargar todos los datos
   */
  async loadAll() {
    try {
      console.log('🚀 Cargando todos los datos...');
      
      await Promise.all([
        this.loadLocations(),
        this.loadPrefixes(),
        this.loadPrograms(),
        this.loadPeriods()
      ]);
      
      this.isInitialized = true;
      console.log('✅ Todos los datos cargados correctamente');
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
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
    
    return Object.keys(this.data.locations).map(key => ({
      code: key,
      name: this.data.locations[key].nombre
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
      dep => dep.codigo === departmentCode
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
    
    return this.data.prefixes.find(prefix => prefix.iso2 === countryCode);
  }
  
  /**
   * Obtener programas académicos
   */
  getPrograms() {
    return this.data.programs;
  }
  
  /**
   * Obtener niveles académicos disponibles
   */
  getAcademicLevels() {
    if (!this.data.programs) return [];
    
    const levelNames = {
      PREG: 'Pregrado',
      GRAD: 'Posgrado',
      ECLE: 'Eclesiástico',
      ETDH: 'Técnico'
    };
    
    return Object.keys(this.data.programs).map(levelCode => ({
      code: levelCode,
      name: levelNames[levelCode] || levelCode
    }));
  }
  
  /**
   * Obtener facultades por nivel académico
   */
  getFaculties(academicLevel) {
    if (!this.data.programs || !this.data.programs[academicLevel]) return [];
    
    const levelPrograms = this.data.programs[academicLevel];
    
    // Verificar estructura de datos
    if (typeof levelPrograms === 'object' && !Array.isArray(levelPrograms)) {
      // Estructura: programs.PREG.FACULTAD
      return Object.keys(levelPrograms);
    } else if (Array.isArray(levelPrograms)) {
      // Estructura: array de programas con propiedad facultad
      const faculties = [...new Set(levelPrograms.map(program => program.facultad))];
      return faculties.filter(faculty => faculty); // Filtrar valores vacíos
    }
    
    return [];
  }
  
  /**
   * Obtener programas por nivel académico y facultad
   */
  getPrograms(academicLevel, faculty) {
    if (!this.data.programs || !this.data.programs[academicLevel]) return [];
    
    const levelPrograms = this.data.programs[academicLevel];
    
    // Verificar estructura de datos
    if (levelPrograms[faculty] && levelPrograms[faculty].Programas) {
      // Estructura: programs.PREG.FACULTAD.Programas
      return levelPrograms[faculty].Programas;
    } else if (Array.isArray(levelPrograms)) {
      // Estructura: array de programas
      return levelPrograms.filter(program => program.facultad === faculty);
    }
    
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
        return this.data.periods.filter(period => 
          period.nivel_academico === academicLevel || 
          period.nivel_academico === 'TODOS'
        );
      }
      return this.data.periods;
    } else if (typeof this.data.periods === 'object') {
      // Formato actual: objeto con niveles académicos
      if (academicLevel && this.data.periods[academicLevel]) {
        const periodsForLevel = this.data.periods[academicLevel];
        return Object.entries(periodsForLevel).map(([nombre, codigo]) => ({
          codigo: codigo,
          nombre: nombre
        }));
      }
      
      // Retornar todos los períodos si no se especifica nivel
      const allPeriods = [];
      Object.keys(this.data.periods).forEach(level => {
        const periodsForLevel = this.data.periods[level];
        Object.entries(periodsForLevel).forEach(([nombre, codigo]) => {
          allPeriods.push({
            codigo: codigo,
            nombre: nombre,
            nivel_academico: level
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
      
      if (typeof levelPrograms === 'object' && !Array.isArray(levelPrograms)) {
        // Estructura: programs.PREG.FACULTAD.Programas
        for (const faculty of Object.keys(levelPrograms)) {
          const programs = levelPrograms[faculty].Programas || [];
          const program = programs.find(p => (p.Codigo || p.codigo) === programCode);
          if (program) {
            return {
              ...program,
              nivel_academico: level,
              facultad: faculty
            };
          }
        }
      } else if (Array.isArray(levelPrograms)) {
        // Estructura: array de programas
        const program = levelPrograms.find(p => (p.Codigo || p.codigo) === programCode);
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
    
    levelsToCheck.forEach(currentLevel => {
      const levelPrograms = this.data.programs[currentLevel];
      
      if (typeof levelPrograms === 'object' && !Array.isArray(levelPrograms)) {
        // Estructura: programs.PREG.FACULTAD.Programas
        const facultiesToCheck = faculty ? [faculty] : Object.keys(levelPrograms);
        
        facultiesToCheck.forEach(currentFaculty => {
          const programs = levelPrograms[currentFaculty]?.Programas || [];
          
          programs.forEach(program => {
            const programCode = program.Codigo || program.codigo;
            
            // Aplicar filtro de códigos si existe
            if (!programCodes || programCodes.includes(programCode)) {
              filteredPrograms.push({
                ...program,
                nivel_academico: currentLevel,
                facultad: currentFaculty
              });
            }
          });
        });
      } else if (Array.isArray(levelPrograms)) {
        // Estructura: array de programas
        levelPrograms.forEach(program => {
          const programCode = program.Codigo || program.codigo;
          
          // Aplicar filtros
          if ((!faculty || program.facultad === faculty) &&
              (!programCodes || programCodes.includes(programCode))) {
            filteredPrograms.push({
              ...program,
              nivel_academico: currentLevel
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
      console.error('Error al leer caché:', error);
      return null;
    }
  }
  
  setCachedData(key, data) {
    if (!this.cacheEnabled) return;
    
    try {
      const cacheItem = {
        data: data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(`formData_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error al guardar en caché:', error);
    }
  }
  
  clearCache() {
    if (!this.cacheEnabled) return;
    
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('formData_')) {
        localStorage.removeItem(key);
      }
    });
    
    console.log('🧹 Caché limpiado');
  }
  
  /**
   * Verificar si los datos están cargados
   */
  isDataLoaded() {
    return this.isInitialized && 
           this.data.locations && 
           this.data.prefixes && 
           this.data.programs && 
           this.data.periods;
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
      periods: this.getPeriods().length
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
      periods: null
    };
    
    this.isInitialized = false;
    this.clearCache();
    
    await this.loadAll();
  }
  
  /**
   * Actualizar URLs de datos
   */
  updateDataUrls(newUrls) {
    this.dataUrls = { ...this.dataUrls, ...newUrls };
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