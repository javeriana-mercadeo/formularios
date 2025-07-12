/**
 * APIService - Servicio de integración con APIs externas
 *
 * Responsabilidades principales:
 * - Gestionar envío de formularios a Salesforce Web-to-Lead
 * - Mapear campos del formulario a campos de Salesforce
 * - Manejar configuración de ambientes (test/producción)
 * - Implementar reintentos y manejo de errores
 * - Mantener historial de envíos para auditoría
 *
 * @version 1.0
 */

import { Logger } from "./Logger.js";
import { Constants } from "./Constants.js";
import { ConfigManager } from "./ConfigManager.js";

export class APIService {
  constructor() {
    this.isSubmitting = false;
    this.submitHistory = [];
  }

  /**
   * Obtener ID de campo de Salesforce según el ambiente actual
   * @param {string} fieldKey - Clave del campo en el mapeo
   * @returns {string} - ID de campo de Salesforce
   */
  getFieldId(fieldKey) {
    const mapping = Constants.SALESFORCE_FIELD_MAPPING[fieldKey];
    if (!mapping) {
      Logger.warn(`Campo no encontrado en mapeo: ${fieldKey}`);
      return "";
    }

    const config = ConfigManager.getConfig();
    return config.sandboxMode ? mapping.test : mapping.prod;
  }

  /**
   * Crear mapeo completo de campos del formulario a Salesforce
   * Centraliza toda la lógica de mapeo usando SALESFORCE_FIELD_MAPPING
   * @returns {Object} - Mapeo completo de campos
   */
  createFieldMapping() {
    const mapping = Constants.SALESFORCE_FIELD_MAPPING;
    const isTest = ConfigManager.getConfig().sandboxMode;

    return {
      // Campos personales
      oid: isTest ? mapping.OID.test : mapping.OID.prod,
      first_name: mapping.NAME,
      last_name: mapping.LAST_NAME,
      type_doc: isTest ? mapping.DOCUMENT_TYPE.test : mapping.DOCUMENT_TYPE.prod,
      document: isTest ? mapping.DOCUMENT_NUMBER.test : mapping.DOCUMENT_NUMBER.prod,
      email: mapping.EMAIL,
      phone_prefix: isTest ? mapping.PHONE_PREFIX.test : mapping.PHONE_PREFIX.prod,
      phone: mapping.PHONE,

      // Campos de ubicación
      country: isTest ? mapping.COUNTRY_RESIDENCE.test : mapping.COUNTRY_RESIDENCE.prod,
      department: isTest ? mapping.DEPARTMENT_RESIDENCE.test : mapping.DEPARTMENT_RESIDENCE.prod,
      city: isTest ? mapping.CITY_RESIDENCE.test : mapping.CITY_RESIDENCE.prod,

      // Campos de evento
      type_attendee: isTest ? mapping.ATTENDEE_TYPE.test : mapping.ATTENDEE_TYPE.prod,
      attendance_day: isTest ? mapping.ATTENDANCE_DAY.test : mapping.ATTENDANCE_DAY.prod,

      // Campos académicos
      academic_level: isTest ? mapping.ACADEMIC_LEVEL.test : mapping.ACADEMIC_LEVEL.prod,
      program: isTest ? mapping.SAE_CODE.test : mapping.SAE_CODE.prod,
      admission_period: isTest ? mapping.ADMISSION_PERIOD.test : mapping.ADMISSION_PERIOD.prod,

      // Autorización
      authorization_data: isTest
        ? mapping.DATA_AUTHORIZATION.test
        : mapping.DATA_AUTHORIZATION.prod,

      // Campos adicionales del evento
      event_name: isTest ? mapping.EVENT_NAME.test : mapping.EVENT_NAME.prod,
      event_date: isTest ? mapping.EVENT_DATE.test : mapping.EVENT_DATE.prod,
      university: isTest ? mapping.UNIVERSITY.test : mapping.UNIVERSITY.prod,
      article: isTest ? mapping.ARTICLE.test : mapping.ARTICLE.prod,
      source: isTest ? mapping.SOURCE.test : mapping.SOURCE.prod,
      subSource: isTest ? mapping.SUB_SOURCE.test : mapping.SUB_SOURCE.prod,
      medium: isTest ? mapping.MEDIUM.test : mapping.MEDIUM.prod,
      campaign: isTest ? mapping.CAMPAIGN.test : mapping.CAMPAIGN.prod,

      // Campos de empresa (si existen)
      empresaConvenio: isTest ? mapping.PARTNER_COMPANY?.test : mapping.PARTNER_COMPANY?.prod,
    };
  }

  /**
   * Obtener URL de endpoint de Salesforce para el ambiente
   * @returns {string} - URL de Salesforce Web-to-Lead
   */
  getSalesforceUrl() {
    return ConfigManager.sandboxMode
      ? Constants.SALESFORCE_SUBMIT_URLS.test
      : Constants.SALESFORCE_SUBMIT_URLS.prod;
  }

  /**
   * Obtener Organization ID de Salesforce para el ambiente
   * @returns {string} - OID de Salesforce
   */
  getOID() {
    return ConfigManager.sandboxMode ? ConfigManager.oids.test : ConfigManager.oids.prod;
  }

  /**
   * Transformar datos del formulario al formato requerido por Salesforce
   * Mapea campos locales a IDs de Salesforce basándose en lo que existe en el DOM
   * @param {HTMLFormElement} formElement - Elemento del formulario del DOM
   * @returns {FormData} - Datos preparados para envío
   */
  prepareFormData(formElement) {
    // Obtener todos los datos del formulario del DOM
    const originalFormData = new FormData(formElement);
    const preparedData = new FormData();

    console.log("@@@@@@@@@@@@@", originalFormData);

    // Crear mapeo inverso: nombre del campo → nombre Salesforce
    const fieldMapping = this.createFieldMapping();

    // Procesar cada campo que existe en el DOM para ser mapeado si se necesita
    for (let [fieldName, value] of originalFormData.entries()) {
      const salesForceField = fieldMapping[fieldName];
      if (salesForceField) {
        preparedData.append(salesForceField, value);
      } else {
        preparedData.append(fieldName, value);
      }
    }

    return preparedData;
  }

  /**
   * Enviar formulario completo a Salesforce con manejo de errores
   * @param {HTMLElement} formElement - Elemento del formulario
   * @param {Object} formData - Datos a enviar
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitForm(formElement, formData) {
    if (this.isSubmitting) {
      Logger.warn("⚠️ Formulario ya está siendo enviado");
      return;
    }

    this.isSubmitting = true;

    try {
      Logger.log("🚀 Enviando formulario...");

      // Preparar datos del DOM
      const preparedData = this.prepareFormData(formElement);

      // Log de datos en modo debug
      if (ConfigManager.sandboxMode) {
        Logger.log("🔍 Datos preparados para envío:");
        for (let [key, value] of preparedData.entries()) {
          Logger.log(`  ${key}: ${value}`);
        }
      }

      // Enviar con reintentos
      const result = await this.submitWithRetry(preparedData);

      // Registrar envío exitoso
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: "success",
        data: formData,
        response: result,
      });

      Logger.log("✅ Formulario enviado exitosamente");
      return result;
    } catch (error) {
      // Registrar error
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: "error",
        data: formData,
        error: error.message,
      });

      Logger.error("❌ Error al enviar formulario:", error);
      throw error;
    } finally {
      this.isSubmitting = false;
    }
  }

  /**
   * Ejecutar envío con lógica de reintentos automáticos
   * @param {FormData} formData - Datos a enviar
   * @param {number} attempt - Número de intento actual
   * @returns {Promise} - Promesa con resultado del envío
   */
  async submitWithRetry(formData, attempt = 1) {
    try {
      return await this.performSubmit(formData);
    } catch (error) {
      if (attempt >= ConfigManager.maxRetries) {
        throw error;
      }

      Logger.log(`⚠️ Intento ${attempt} falló, reintentando en ${ConfigManager.retryDelay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, ConfigManager.retryDelay));

      return this.submitWithRetry(formData, attempt + 1);
    }
  }

  /**
   * Ejecutar una sola petición HTTP a Salesforce
   * @param {FormData} formData - Datos a enviar
   * @returns {Promise} - Promesa con respuesta HTTP
   */
  async performSubmit(formData) {
    const url = this.getSalesforceUrl();

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Configurar timeout
      xhr.timeout = ConfigManager.timeout;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
          });
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Error de red al enviar formulario"));
      };

      xhr.ontimeout = () => {
        reject(new Error("Timeout al enviar formulario"));
      };

      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  /**
   * Método de respaldo: envío tradicional con submit del formulario
   * @param {HTMLElement} formElement - Formulario a enviar
   */
  submitFormNative(formElement) {
    if (!formElement) {
      throw new Error("Elemento de formulario no encontrado");
    }

    // Configurar acción del formulario
    formElement.action = this.getSalesforceUrl();
    formElement.method = "POST";
    formElement.enctype = "multipart/form-data";

    // Enviar formulario
    formElement.submit();
  }

  /**
   * Verificar que la configuración de API esté completa
   * @returns {boolean} - True si la configuración es válida
   * @throws {Error} - Si hay errores de configuración
   */
  validateConfig() {
    const errors = [];

    if (!Constants.SALESFORCE_SUBMIT_URLS.test || !Constants.SALESFORCE_SUBMIT_URLS.prod) {
      errors.push("URLs de Salesforce no configuradas correctamente");
    }

    if (!ConfigManager.oids.test || !ConfigManager.oids.prod) {
      errors.push("OIDs de Salesforce no configurados correctamente");
    }

    if (!ConfigManager.thankYouUrl) {
      errors.push("URL de agradecimiento no configurada");
    }

    if (errors.length > 0) {
      throw new Error("Configuración inválida: " + errors.join(", "));
    }

    return true;
  }

  /**
   * Ejecutar prueba de conectividad con Salesforce
   * @returns {Promise} - Promesa con resultado de la prueba
   */
  async testConnection() {
    try {
      const testData = new FormData();
      testData.append("oid", this.getOID());
      testData.append("debug", "1");
      testData.append("debugEmail", ConfigManager.debugEmail || "test@example.com");

      const response = await this.performSubmit(testData);

      Logger.log("✅ Conexión con Salesforce exitosa");
      return response;
    } catch (error) {
      Logger.error("❌ Error de conexión con Salesforce:", error);
      throw error;
    }
  }

  /**
   * Recuperar historial completo de envíos realizados
   * @returns {Array} - Lista de envíos con timestamps y resultados
   */
  getSubmitHistory() {
    return [...this.submitHistory];
  }

  /**
   * Borrar todo el historial de envíos almacenado
   */
  clearSubmitHistory() {
    this.submitHistory = [];
  }

  /**
   * Calcular estadísticas de éxito/fallo de envíos
   * @returns {Object} - Estadísticas con totales y tasas de éxito
   */
  getSubmitStats() {
    const total = this.submitHistory.length;
    const successful = this.submitHistory.filter((entry) => entry.status === "success").length;
    const failed = this.submitHistory.filter((entry) => entry.status === "error").length;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
    };
  }

  /**
   * Activar/desactivar modo de depuración
   * @param {boolean} enabled - Si activar el modo debug
   * @param {string} debugEmail - Email para recibir copias de debug
   */
  setsandboxMode(enabled, debugEmail = "") {
    ConfigManager.sandboxMode = enabled;
    ConfigManager.debugEmail = debugEmail;

    Logger.log(`🔧 Modo debug API: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
    if (enabled && debugEmail) {
      Logger.log(`📧 Email debug: ${debugEmail}`);
    }
  }

  /**
   * Actualizar configuración del servicio API
   * @param {Object} newConfig - Nueva configuración a aplicar
   */
  updateConfig(newConfig) {
    ConfigManager = { ...ConfigManager, ...newConfig };
  }

  /**
   * Recuperar copia de la configuración actual
   * @returns {Object} - Configuración completa del servicio
   */
  getConfig() {
    return { ...ConfigManager };
  }

  /**
   * Añadir nuevo mapeo de campo para Salesforce
   * @param {string} fieldKey - Clave del campo local
   * @param {string} testId - ID de Salesforce para ambiente de prueba
   * @param {string} prodId - ID de Salesforce para ambiente de producción
   */
  addFieldMapping(fieldKey, testId, prodId) {
    Constants.SALESFORCE_FIELD_MAPPING[fieldKey] = {
      test: testId,
      prod: prodId,
    };
  }

  /**
   * Eliminar mapeo de campo existente
   * @param {string} fieldKey - Clave del campo a remover
   */
  removeFieldMapping(fieldKey) {
    delete Constants.SALESFORCE_FIELD_MAPPING[fieldKey];
  }

  /**
   * Recuperar información detallada del ambiente de ejecución
   * @returns {Object} - Información del ambiente (URLs, OIDs, etc.)
   */
  getEnvironmentInfo() {
    return {
      mode: ConfigManager.sandboxMode ? "TEST" : "PRODUCTION",
      salesforceUrl: this.getSalesforceUrl(),
      oid: this.getOID(),
      thankYouUrl: ConfigManager.thankYouUrl,
      debugEmail: ConfigManager.debugEmail,
    };
  }

  /**
   * Exportar configuración actual a formato JSON
   * @returns {string} - Configuración en formato JSON
   */
  exportConfig() {
    return JSON.stringify(ConfigManager, null, 2);
  }

  /**
   * Importar configuración desde JSON
   * @param {string} configJson - Configuración en formato JSON
   * @throws {Error} - Si el JSON es inválido
   */
  importConfig(configJson) {
    try {
      const newConfig = JSON.parse(configJson);
      this.updateConfig(newConfig);
      Logger.log("✅ Configuración importada exitosamente");
    } catch (error) {
      Logger.error("❌ Error al importar configuración:", error);
      throw error;
    }
  }
}
