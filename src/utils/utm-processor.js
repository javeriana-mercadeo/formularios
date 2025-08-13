/**
 * UtmParameters - Módulo para gestión de parámetros UTM desde URL
 *
 * Responsabilidades:
 * - Detectar y extraer parámetros UTM estándar de la URL
 * - Actualizar formulario HTML con valores UTM
 * - Sincronizar parámetros con el estado del formulario
 * - Usar mapeo definido en Constants.js para consistencia
 *
 * Parámetros soportados (según Constants.FIELDS):
 * - utm_source, utm_subsource, utm_medium, utm_campaign
 * - utm_article, utm_eventname, utm_eventdate
 *
 * @version 1.0
 */

import { Constants } from "../core/Constants.js";

export class UtmParameters {
  constructor(formElement, stateManager, uiManager, Logger) {
    this.formElement = formElement;
    this.state = stateManager;
    this.ui = uiManager;
    this.logger = Logger;

    // Mapeo de parámetros UTM a campos del formulario
    this.utmMapping = this._buildUtmMapping();
  }

  /**
   * Procesar todos los parámetros UTM de la URL actual
   * @returns {Object} - Resumen de parámetros procesados
   */
  processUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const processedParams = {};
    const summary = {
      found: 0,
      updated: 0,
      errors: 0,
      parameters: {},
    };

    this.logger.info("🔗 Iniciando procesamiento de parámetros UTM");

    // Procesar parámetros UTM
    Object.entries(this.utmMapping).forEach(([urlParam, fieldInfo]) => {
      const value = urlParams.get(urlParam);

      if (value) {
        summary.found++;
        summary.parameters[urlParam] = value;

        const success = this._updateParameter(fieldInfo, value, urlParam);
        if (success) {
          summary.updated++;
          processedParams[fieldInfo.field] = value;
        } else {
          summary.errors++;
        }
      }
    });

    // Log del resumen
    this._logProcessingSummary(summary);

    return summary;
  }

  /**
   * Actualizar un parámetro específico en formulario y estado
   * @param {Object} fieldInfo - Información del campo
   * @param {string} value - Valor a establecer
   * @param {string} urlParam - Parámetro original de URL
   * @returns {boolean} - True si se actualizó correctamente
   * @private
   */
  _updateParameter(fieldInfo, value, urlParam) {
    try {
      const cleanValue = this._cleanParameterValue(value);

      // 1. Actualizar estado
      const stateUpdated = this.state.updateField(fieldInfo.field, cleanValue);

      // 2. Actualizar campo oculto en HTML
      const htmlUpdated = this._updateHtmlField(fieldInfo, cleanValue);

      if (stateUpdated && htmlUpdated) {
        this.logger.debug(
          `✅ Parámetro actualizado: ${urlParam} = "${cleanValue}" → ${fieldInfo.field}`
        );
        return true;
      } else {
        this.logger.warn(
          `⚠️ Actualización parcial: ${urlParam} - Estado: ${stateUpdated}, HTML: ${htmlUpdated}`
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`❌ Error actualizando parámetro ${urlParam}:`, error);
      return false;
    }
  }

  /**
   * Actualizar campo oculto en el formulario HTML
   * @param {Object} fieldInfo - Información del campo
   * @param {string} value - Valor a establecer
   * @returns {boolean} - True si se actualizó correctamente
   * @private
   */
  _updateHtmlField(fieldInfo, value) {
    // Intentar actualizar campo existente
    const existingField = this.ui.scopedQuery(`[name="${fieldInfo.field}"]`);

    if (existingField) {
      this.ui.setFieldValue(existingField, value);
      return true;
    }

    // Crear campo oculto si no existe
    const hiddenField = this.ui.addHiddenField(
      this.formElement,
      fieldInfo.field,
      value,
      fieldInfo.description
    );

    return hiddenField !== null;
  }

  /**
   * Limpiar valor de parámetro UTM
   * @param {string} value - Valor a limpiar
   * @returns {string} - Valor limpio
   * @private
   */
  _cleanParameterValue(value) {
    if (!value) return "";

    return value
      .trim()
      .replace(/[<>'"]/g, "") // Remover caracteres potencialmente peligrosos
      .substring(0, 255); // Limitar longitud
  }

  /**
   * Construir mapeo de parámetros UTM principales usando Constants.FIELD_MAPPING
   * @returns {Object} - Mapeo de parámetros
   * @private
   */
  _buildUtmMapping() {
    const { FIELDS, FIELD_MAPPING } = Constants;

    return {
      // Parámetros UTM estándar - usando nombres correctos de URL
      [`utm_${FIELDS.SOURCE}`]: {
        field: FIELDS.SOURCE,
        description: FIELD_MAPPING.SOURCE.name,
        salesforceIds: FIELD_MAPPING.SOURCE.id,
      },
      [`utm_${FIELDS.SUB_SOURCE}`]: {
        field: FIELDS.SUB_SOURCE,
        description: FIELD_MAPPING.SUB_SOURCE.name,
        salesforceIds: FIELD_MAPPING.SUB_SOURCE.id,
      },
      [`utm_${FIELDS.MEDIUM}`]: {
        field: FIELDS.MEDIUM,
        description: FIELD_MAPPING.MEDIUM.name,
        salesforceIds: FIELD_MAPPING.MEDIUM.id,
      },
      [`utm_${FIELDS.CAMPAIGN}`]: {
        field: FIELDS.CAMPAIGN,
        description: FIELD_MAPPING.CAMPAIGN.name,
        salesforceIds: FIELD_MAPPING.CAMPAIGN.id,
      },
      [`utm_${FIELDS.ARTICLE}`]: {
        field: FIELDS.ARTICLE,
        description: FIELD_MAPPING.ARTICLE.name,
        salesforceIds: FIELD_MAPPING.ARTICLE.id,
      },
      [`utm_${FIELDS.EVENT_NAME}`]: {
        field: FIELDS.EVENT_NAME,
        description: FIELD_MAPPING.EVENT_NAME.name,
        salesforceIds: FIELD_MAPPING.EVENT_NAME.id,
      },
      [`utm_${FIELDS.EVENT_DATE}`]: {
        field: FIELDS.EVENT_DATE,
        description: FIELD_MAPPING.EVENT_DATE.name,
        salesforceIds: FIELD_MAPPING.EVENT_DATE.id,
      },
    };
  }

  /**
   * Obtener valor de parámetro UTM específico
   * @param {string} paramName - Nombre del parámetro UTM
   * @returns {string|null} - Valor del parámetro o null
   */
  getUtmParameter(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  /**
   * Obtener todos los parámetros UTM disponibles
   * @returns {Object} - Objeto con todos los parámetros UTM
   */
  getAllUtmParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};

    // Recopilar parámetros UTM
    Object.keys(this.utmMapping).forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });

    return utmParams;
  }

  /**
   * Verificar si la URL contiene parámetros UTM
   * @returns {boolean} - True si hay parámetros UTM
   */
  hasUtmParameters() {
    const allParams = this.getAllUtmParameters();
    return Object.keys(allParams).length > 0;
  }

  /**
   * Generar URL con parámetros UTM actuales
   * @param {string} baseUrl - URL base (opcional, usa la actual)
   * @returns {string} - URL completa con parámetros UTM
   */
  generateUtmUrl(baseUrl = null) {
    const url = baseUrl || window.location.origin + window.location.pathname;
    const utmParams = this.getAllUtmParameters();

    if (Object.keys(utmParams).length === 0) {
      return url;
    }

    const urlObj = new URL(url);
    Object.entries(utmParams).forEach(([param, value]) => {
      urlObj.searchParams.set(param, value);
    });

    return urlObj.toString();
  }

  /**
   * Sincronizar parámetros UTM del estado con la URL
   * @returns {Object} - Resumen de sincronización
   */
  syncStateWithUrl() {
    const summary = { synced: 0, errors: 0, updated: {} };

    Object.entries(this.utmMapping).forEach(([urlParam, fieldInfo]) => {
      try {
        const stateValue = this.state.getField(fieldInfo.field);
        const urlValue = this.getUtmParameter(urlParam);

        if (stateValue && stateValue !== urlValue) {
          // Actualizar URL con valor del estado
          const url = new URL(window.location.href);
          url.searchParams.set(urlParam, stateValue);

          // No cambiar la URL real, solo registrar la diferencia
          summary.updated[urlParam] = {
            state: stateValue,
            url: urlValue,
          };
          summary.synced++;
        }
      } catch (error) {
        this.logger.error(`Error sincronizando ${urlParam}:`, error);
        summary.errors++;
      }
    });

    if (summary.synced > 0) {
      this.logger.info(`🔄 Detectadas ${summary.synced} diferencias entre estado y URL`);
    }

    return summary;
  }

  /**
   * Log del resumen de procesamiento
   * @param {Object} summary - Resumen del procesamiento
   * @private
   */
  _logProcessingSummary(summary) {
    if (summary.found === 0) {
      this.logger.info("🔗 No se encontraron parámetros UTM en la URL");
      return;
    }

    this.logger.info(`🔗 Parámetros UTM procesados: ${summary.updated}/${summary.found} exitosos`);

    if (summary.errors > 0) {
      this.logger.warn(`⚠️ ${summary.errors} errores durante el procesamiento UTM`);
    }

    // Log detallado de parámetros encontrados
    Object.entries(summary.parameters).forEach(([param, value]) => {
      this.logger.debug(`  📎 ${param}: "${value}"`);
    });
  }

  /**
   * Obtener configuración del módulo
   * @returns {Object} - Configuración actual
   */
  getModuleInfo() {
    return {
      utmMappingCount: Object.keys(this.utmMapping).length,
      supportedParameters: Object.keys(this.utmMapping),
      hasParameters: this.hasUtmParameters(),
      currentParameters: this.getAllUtmParameters(),
    };
  }
}
