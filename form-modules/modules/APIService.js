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

export class APIService {
  constructor(config = {}) {
    this.config = {
      // URLs de Salesforce
      salesforceUrls: {
        test: "https://test.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
        prod: "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8",
      },

      // OIDs de Salesforce
      oids: {
        test: "00D7j0000004eQD",
        prod: "00Df4000003l8Bf",
      },

      // Mapeo de campos
      fieldMapping: {
        TIPO_DOCUMENTO: {
          test: "00N7j000002BI3X",
          prod: "00N5G00000WmhsT",
        },
        NUMERO_DOCUMENTO: {
          test: "00N7j000002BI3V",
          prod: "00N5G00000WmhsR",
        },
        PREFIJO_CELULAR: {
          test: "00NO4000002IUPh",
          prod: "00NJw000002mzb7",
        },
        PAIS_RESIDENCIA: {
          test: "00N7j000002BY1c",
          prod: "00N5G00000WmhvJ",
        },
        DEPARTAMENTO_RESIDENCIA: {
          test: "00N7j000002BY1h",
          prod: "00N5G00000WmhvX",
        },
        CIUDAD_RESIDENCIA: {
          test: "00N7j000002BY1i",
          prod: "00N5G00000WmhvO",
        },
        PERIODO_INGRESO: {
          test: "00N7j000002BY2L",
          prod: "00N5G00000WmhvI",
        },
        FUENTE_AUTORIZACION: {
          test: "00N7j000002BY26",
          prod: "00N5G00000WmhvT",
        },
        CODIGO_SAE: {
          test: "00N7j000002BI3p",
          prod: "00N5G00000WmhvV",
        },
        TIPO_ASISTENTE: {
          test: "00NO40000000sTR",
          prod: "00NJw000001J3g6",
        },
        DIA_ASISTENCIA: {
          test: "00NO4000007qrPB",
          prod: "00NJw000004iulj",
        },
        ORIGEN_SOLICITUD: {
          test: "00NO40000002ZeP",
          prod: "00NJw000001J3HI",
        },
        FUENTE: {
          test: "00N7j000002BKgW",
          prod: "00N5G00000WmhvW",
        },
        SUBFUENTE: {
          test: "00N7j000002BKgb",
          prod: "00N5G00000WmhvZ",
        },
        MEDIO: {
          test: "00NO40000001izt",
          prod: "00NJw000001J3g8",
        },
        CAMPANA: {
          test: "00N7j000002BfKF",
          prod: "00N5G00000Wmi8X",
        },
        AUTORIZACION_DATOS: {
          test: "00N7j000002BI3m",
          prod: "00N5G00000WmhvF",
        },
        ARTICULO: {
          test: "00NO400000D2PVt",
          prod: "00NJw000006f1BB",
        },
        NOMBRE_EVENTO: {
          test: "00NO400000AIAxR",
          prod: "00NJw000006f1BF",
        },
        FECHA_EVENTO: {
          test: "00NO400000AIanI",
          prod: "00NJw000006f1BE",
        },
        UNIVERSIDAD: {
          test: "00NO400000B66Z3",
          prod: "00NJw000006f1BG",
        },
        EMPRESA_CONVENIO: {
          test: "00NO400000B68fh",
          prod: "00NJw000006F1BC",
        },
        NIVEL_ACADEMICO: {
          test: "nivelacademico",
          prod: "nivelacademico",
        },
      },

      // URLs de respuesta
      thankYouUrl: "https://cloud.cx.javeriana.edu.co/EVENTOS_TKY",

      // Configuración de ambiente
      debugMode: false,
      debugEmail: "",

      // Configuración de reintentos
      maxRetries: 3,
      retryDelay: 1000,

      // Timeout para requests
      timeout: 30000,

      ...config,
    };

    this.isSubmitting = false;
    this.submitHistory = [];
  }

  /**
   * Obtener ID de campo de Salesforce según el ambiente actual
   * @param {string} fieldKey - Clave del campo en el mapeo
   * @returns {string} - ID de campo de Salesforce
   */
  getFieldId(fieldKey) {
    const mapping = this.config.fieldMapping[fieldKey];
    if (!mapping) {
      console.warn(`Campo no encontrado en mapeo: ${fieldKey}`);
      return "";
    }

    return this.config.debugMode ? mapping.test : mapping.prod;
  }

  /**
   * Obtener URL de endpoint de Salesforce para el ambiente
   * @returns {string} - URL de Salesforce Web-to-Lead
   */
  getSalesforceUrl() {
    return this.config.debugMode
      ? this.config.salesforceUrls.test
      : this.config.salesforceUrls.prod;
  }

  /**
   * Obtener Organization ID de Salesforce para el ambiente
   * @returns {string} - OID de Salesforce
   */
  getOID() {
    return this.config.debugMode ? this.config.oids.test : this.config.oids.prod;
  }

  /**
   * Transformar datos del formulario al formato requerido por Salesforce
   * Mapea campos locales a IDs de Salesforce y agrega metadatos
   * @param {Object} formData - Datos del formulario
   * @returns {FormData} - Datos preparados para envío
   */
  prepareFormData(formData) {
    const preparedData = new FormData();

    // Campos básicos de Salesforce
    preparedData.append("oid", this.getOID());
    preparedData.append("retURL", this.config.thankYouUrl);
    preparedData.append("debug", this.config.debugMode ? "1" : "0");

    if (this.config.debugMode && this.config.debugEmail) {
      preparedData.append("debugEmail", this.config.debugEmail);
    }

    preparedData.append("lead_source", "Landing Pages");
    preparedData.append("company", "NA");

    // Mapear campos del formulario
    const fieldMapping = {
      first_name: "first_name",
      last_name: "last_name",
      email: "email",
      phone: "mobile",
      type_doc: this.getFieldId("TIPO_DOCUMENTO"),
      document: this.getFieldId("NUMERO_DOCUMENTO"),
      phone_code: this.getFieldId("PREFIJO_CELULAR"),
      country: this.getFieldId("PAIS_RESIDENCIA"),
      department: this.getFieldId("DEPARTAMENTO_RESIDENCIA"),
      city: this.getFieldId("CIUDAD_RESIDENCIA"),
      type_attendee: this.getFieldId("TIPO_ASISTENTE"),
      attendance_day: this.getFieldId("DIA_ASISTENCIA"),
      academic_level: this.getFieldId("NIVEL_ACADEMICO"),
      program: this.getFieldId("CODIGO_SAE"),
      admission_period: this.getFieldId("PERIODO_INGRESO"),
      authorization_data: this.getFieldId("AUTORIZACION_DATOS"),
    };

    // Agregar campos mapeados
    Object.entries(fieldMapping).forEach(([formField, salesforceField]) => {
      if (formData[formField] && salesforceField) {
        preparedData.append(salesforceField, formData[formField]);
      }
    });

    // Campos adicionales del evento
    if (formData.event_name) {
      preparedData.append(this.getFieldId("NOMBRE_EVENTO"), formData.event_name);
    }

    if (formData.event_date) {
      preparedData.append(this.getFieldId("FECHA_EVENTO"), formData.event_date);
    }

    if (formData.university) {
      preparedData.append(this.getFieldId("UNIVERSIDAD"), formData.university);
    }

    if (formData.articulo) {
      preparedData.append(this.getFieldId("ARTICULO"), formData.articulo);
    }

    if (formData.empresaConvenio) {
      preparedData.append(this.getFieldId("EMPRESA_CONVENIO"), formData.empresaConvenio);
    }

    if (formData.source) {
      preparedData.append(this.getFieldId("FUENTE"), formData.source);
    }

    if (formData.subfuente) {
      preparedData.append(this.getFieldId("SUBFUENTE"), formData.subfuente);
    }

    if (formData.medium) {
      preparedData.append(this.getFieldId("MEDIO"), formData.medium);
    }

    if (formData.campaign) {
      preparedData.append(this.getFieldId("CAMPANA"), formData.campaign);
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
      console.warn("⚠️ Formulario ya está siendo enviado");
      return;
    }

    this.isSubmitting = true;

    try {
      console.log("🚀 Enviando formulario...");

      // Preparar datos
      const preparedData = this.prepareFormData(formData);

      // Log de datos en modo debug
      if (this.config.debugMode) {
        console.log("🔍 Datos preparados para envío:");
        for (let [key, value] of preparedData.entries()) {
          console.log(`  ${key}: ${value}`);
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

      console.log("✅ Formulario enviado exitosamente");
      return result;
    } catch (error) {
      // Registrar error
      this.submitHistory.push({
        timestamp: new Date().toISOString(),
        status: "error",
        data: formData,
        error: error.message,
      });

      console.error("❌ Error al enviar formulario:", error);
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
      if (attempt >= this.config.maxRetries) {
        throw error;
      }

      console.log(`⚠️ Intento ${attempt} falló, reintentando en ${this.config.retryDelay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, this.config.retryDelay));

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
      xhr.timeout = this.config.timeout;

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

    if (!this.config.salesforceUrls.test || !this.config.salesforceUrls.prod) {
      errors.push("URLs de Salesforce no configuradas correctamente");
    }

    if (!this.config.oids.test || !this.config.oids.prod) {
      errors.push("OIDs de Salesforce no configurados correctamente");
    }

    if (!this.config.thankYouUrl) {
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
      testData.append("debugEmail", this.config.debugEmail || "test@example.com");

      const response = await this.performSubmit(testData);

      console.log("✅ Conexión con Salesforce exitosa");
      return response;
    } catch (error) {
      console.error("❌ Error de conexión con Salesforce:", error);
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
  setDebugMode(enabled, debugEmail = "") {
    this.config.debugMode = enabled;
    this.config.debugEmail = debugEmail;

    console.log(`🔧 Modo debug API: ${enabled ? "ACTIVADO" : "DESACTIVADO"}`);
    if (enabled && debugEmail) {
      console.log(`📧 Email debug: ${debugEmail}`);
    }
  }

  /**
   * Actualizar configuración del servicio API
   * @param {Object} newConfig - Nueva configuración a aplicar
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Recuperar copia de la configuración actual
   * @returns {Object} - Configuración completa del servicio
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Añadir nuevo mapeo de campo para Salesforce
   * @param {string} fieldKey - Clave del campo local
   * @param {string} testId - ID de Salesforce para ambiente de prueba
   * @param {string} prodId - ID de Salesforce para ambiente de producción
   */
  addFieldMapping(fieldKey, testId, prodId) {
    this.config.fieldMapping[fieldKey] = {
      test: testId,
      prod: prodId,
    };
  }

  /**
   * Eliminar mapeo de campo existente
   * @param {string} fieldKey - Clave del campo a remover
   */
  removeFieldMapping(fieldKey) {
    delete this.config.fieldMapping[fieldKey];
  }

  /**
   * Recuperar información detallada del ambiente de ejecución
   * @returns {Object} - Información del ambiente (URLs, OIDs, etc.)
   */
  getEnvironmentInfo() {
    return {
      mode: this.config.debugMode ? "TEST" : "PRODUCTION",
      salesforceUrl: this.getSalesforceUrl(),
      oid: this.getOID(),
      thankYouUrl: this.config.thankYouUrl,
      debugEmail: this.config.debugEmail,
    };
  }

  /**
   * Exportar configuración actual a formato JSON
   * @returns {string} - Configuración en formato JSON
   */
  exportConfig() {
    return JSON.stringify(this.config, null, 2);
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
      console.log("✅ Configuración importada exitosamente");
    } catch (error) {
      console.error("❌ Error al importar configuración:", error);
      throw error;
    }
  }
}
