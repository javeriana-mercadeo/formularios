/**
 * Cache - Sistema de cache global compartido
 * Maneja el cache de datos del formulario de manera centralizada
 * @version 1.0
 */

export class Cache {
  constructor() {
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.cacheTimestamps = new Map();
  }

  static getInstance() {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  isCacheValid(key, expirationHours) {
    const timestamp = this.cacheTimestamps.get(key);
    if (!timestamp) return false;

    const now = Date.now();
    const expirationTime = timestamp + expirationHours * 60 * 60 * 1000;
    return now < expirationTime;
  }

  getCachedData(key, expirationHours) {
    if (!this.isCacheValid(key, expirationHours)) {
      this.cache.delete(key);
      this.cacheTimestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  setCachedData(key, data) {
    this.cache.set(key, data);
    this.cacheTimestamps.set(key, Date.now());
  }

  getLoadingPromise(key) {
    return this.loadingPromises.get(key);
  }

  setLoadingPromise(key, promise) {
    this.loadingPromises.set(key, promise);

    // Limpiar la promesa cuando se complete
    promise.finally(() => {
      this.loadingPromises.delete(key);
    });
  }

  clearCache() {
    this.cache.clear();
    this.cacheTimestamps.clear();
    this.loadingPromises.clear();
  }
}
