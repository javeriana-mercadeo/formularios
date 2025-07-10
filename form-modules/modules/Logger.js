/**
 * Logger Module
 * Sistema de logging configurable para el sistema de formularios
 * @version 1.0
 */

class Logger {
  constructor(eventName, config = {}) {
    this.config = {
      enabled: config.enabled !== undefined ? config.enabled : true,
      level: config.level || "info", // 'error', 'warn', 'info', 'debug'
      prefix: eventName || "FormSystem",
      showTimestamp: config.showTimestamp !== undefined ? config.showTimestamp : true,
      showLevel: config.showLevel !== undefined ? config.showLevel : true,
      colors: config.colors !== undefined ? config.colors : true,
      persistLogs: config.persistLogs !== undefined ? config.persistLogs : false,
      maxLogs: config.maxLogs || 1000,
    };

    this.levels = {
      error: { priority: 0, color: "#f5b5b0", emoji: "🔴" },
      warn: { priority: 1, color: "#ffe08a", emoji: "🟠" },
      info: { priority: 2, color: "#8dd1e1", emoji: "🔵" },
      debug: { priority: 3, color: "#cfcfcf", emoji: "🟤" },
      success: { priority: 2, color: "#a8e6a3", emoji: "🟢" },
      loading: { priority: 2, color: "#b3d9ff", emoji: "⚪" },
      data: { priority: 3, color: "#dab5e8", emoji: "⬛" },
    };

    this.logs = [];
    this.listeners = [];
  }

  /**
   * Verificar si un nivel debe ser mostrado
   * @param {string} level - Nivel del log
   * @returns {boolean}
   */
  shouldLog(level) {
    if (!this.config.enabled) return false;

    const currentLevel = this.levels[this.config.level];
    const messageLevel = this.levels[level];

    return messageLevel && currentLevel && messageLevel.priority <= currentLevel.priority;
  }

  /**
   * Formatear mensaje de log
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje
   * @param {...any} args - Argumentos adicionales
   * @returns {Object}
   */
  formatMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const levelInfo = this.levels[level] || this.levels.info;

    return {
      timestamp: timestamp.split("T")[1].split(".")[0],
      level: level.toUpperCase(),
      origin: this.config.prefix,
      message: message,
      args,
      color: levelInfo.color,
      emoji: levelInfo.emoji,
    };
  }

  /**
   * Log genérico
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje
   * @param {...any} args - Argumentos adicionales
   */
  log(level, message, ...args) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, ...args);
    const callerInfo = this.getCallerInfo();
    const logOrigin = callerInfo ? `(${callerInfo})` : "";

    const { timestamp, level: levelStr, origin, color, emoji } = logEntry;

    const prefix = this.config.showTimestamp ? `[${timestamp}]` : "";

    const levelTag = this.config.showLevel ? `${emoji} ${levelStr}` : "";

    const originTag = origin ? `[${origin}]` : "";

    const fullHeader = `${prefix} ${levelTag} ${originTag} ${logOrigin}`.trim();

    if (this.config.colors && typeof window !== "undefined") {
      // Errores y advertencias: todo el texto en color
      if (level === "error" || level === "warn") {
        console.log(
          `%c${fullHeader} ${logEntry.message}`,
          `color: ${color}; font-weight: bold;`,
          ...args
        );
      } else {
        // Solo header con color, mensaje en blanco
        console.log(
          `%c${fullHeader} %c${logEntry.message}`,
          `color: ${color}; font-weight: bold;`,
          `color: white; font-weight: normal;`,
          ...args
        );
      }
    } else {
      // Sin colores
      console.log(`${fullHeader} ${logEntry.message}`, ...args);
    }

    // Persistencia
    if (this.config.persistLogs) {
      this.logs.push({ ...logEntry, origin: callerInfo });

      if (this.logs.length > this.config.maxLogs) {
        this.logs.shift();
      }
    }

    // Notificar listeners
    this.listeners.forEach((listener) => {
      try {
        listener({ ...logEntry, origin: callerInfo });
      } catch (error) {
        console.error("Error in log listener:", error);
      }
    });
  }

  getCallerInfo() {
    try {
      const error = new Error();
      const stack = error.stack.split("\n");

      // Buscar la primera línea FUERA del logger
      for (let i = 2; i < stack.length; i++) {
        const line = stack[i];
        if (!line.includes("Logger.js")) {
          const match = line.match(/(?:at\s+)?(.*):(\d+):(\d+)/);
          if (match) {
            const [, file, lineNum, colNum] = match;
            const fileName = file.split("/").pop();
            return `${fileName}:${lineNum}:${colNum}`;
          }
        }
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Métodos de logging por nivel
   */
  error(message, ...args) {
    this.log("error", message, ...args);
  }

  warn(message, ...args) {
    this.log("warn", message, ...args);
  }

  info(message, ...args) {
    this.log("info", message, ...args);
  }

  debug(message, ...args) {
    this.log("debug", message, ...args);
  }

  success(message, ...args) {
    this.log("success", message, ...args);
  }

  loading(message, ...args) {
    this.log("loading", message, ...args);
  }

  data(message, ...args) {
    this.log("data", message, ...args);
  }

  /**
   * Métodos de control
   */
  enable() {
    this.config.enabled = true;
    this.info("Logging habilitado");
  }

  disable() {
    this.info("Logging deshabilitado");
    this.config.enabled = false;
  }

  toggle() {
    if (this.config.enabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Configurar nivel de logging
   * @param {string} level - Nuevo nivel
   */
  setLevel(level) {
    if (this.levels[level]) {
      this.config.level = level;
      this.info(`Nivel de logging cambiado a: ${level}`);
    } else {
      this.warn(`Nivel de logging inválido: ${level}`);
    }
  }

  /**
   * Configurar prefijo
   * @param {string} prefix - Nuevo prefijo
   */
  setPrefix(prefix) {
    this.config.prefix = prefix;
    this.info(`Prefijo cambiado a: ${prefix}`);
  }

  /**
   * Obtener configuración actual
   * @returns {Object}
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Obtener logs persistidos
   * @returns {Array}
   */
  getLogs() {
    return [...this.logs];
  }

  /**
   * Limpiar logs
   */
  clearLogs() {
    this.logs = [];
    this.info("Logs limpiados");
  }

  /**
   * Agregar listener para logs
   * @param {Function} listener - Función callback
   */
  addListener(listener) {
    this.listeners.push(listener);
  }

  /**
   * Remover listener
   * @param {Function} listener - Función callback
   */
  removeListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Obtener estadísticas de logging
   * @returns {Object}
   */
  getStats() {
    const stats = {
      totalLogs: this.logs.length,
      byLevel: {},
      enabled: this.config.enabled,
      level: this.config.level,
    };

    this.logs.forEach((log) => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
    });

    return stats;
  }

  /**
   * Exportar logs
   * @param {string} format - Formato de exportación ('json', 'csv', 'txt')
   * @returns {string}
   */
  exportLogs(format = "json") {
    switch (format) {
      case "json":
        return JSON.stringify(this.logs, null, 2);

      case "csv":
        const headers = "timestamp,level,message,args\n";
        const rows = this.logs
          .map(
            (log) =>
              `${log.timestamp},${log.level},"${log.originalMessage}","${JSON.stringify(log.args)}"`
          )
          .join("\n");
        return headers + rows;

      case "txt":
        return this.logs.map((log) => log.message).join("\n");

      default:
        return JSON.stringify(this.logs, null, 2);
    }
  }

  /**
   * Crear grupo de logs
   * @param {string} groupName - Nombre del grupo
   * @param {Function} callback - Función que ejecuta los logs del grupo
   */
  group(groupName, callback) {
    if (!this.config.enabled) {
      callback();
      return;
    }

    console.group(`${this.levels.info.emoji} ${groupName}`);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Crear tabla de datos
   * @param {string} title - Título de la tabla
   * @param {Array|Object} data - Datos a mostrar
   */
  table(title, data) {
    if (!this.config.enabled) return;

    this.info(title);
    console.table(data);
  }
}

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = Logger;
}

// Global availability
window.Logger = Logger;

export { Logger };
