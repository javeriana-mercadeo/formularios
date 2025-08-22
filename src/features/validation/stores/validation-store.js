/**
 * Validation Store - Estado de validación de formularios usando Zustand
 * Maneja datos del formulario, errores de validación y campos tocados
 * @version 1.0
 */

import { createStore } from 'zustand/vanilla'

export const useValidationStore = createStore((set, get) => ({
  // Estado
  formData: {},
  validationErrors: {},
  touchedFields: new Set(),

  // Acciones
  updateField: (name, value) =>
    set(state => ({
      formData: { ...state.formData, [name]: value }
    })),

  updateMultipleFields: fieldsObject =>
    set(state => ({
      formData: { ...state.formData, ...fieldsObject }
    })),

  setValidationError: (field, error) =>
    set(state => ({
      validationErrors: { ...state.validationErrors, [field]: error }
    })),

  clearValidationError: field =>
    set(state => {
      const { [field]: removed, ...rest } = state.validationErrors
      return { validationErrors: rest }
    }),

  clearAllValidationErrors: () => set({ validationErrors: {} }),

  markFieldTouched: field =>
    set(state => ({
      touchedFields: new Set([...state.touchedFields, field])
    })),

  markMultipleFieldsTouched: fields =>
    set(state => ({
      touchedFields: new Set([...state.touchedFields, ...fields])
    })),

  // Getters computados
  isValid: () => Object.keys(get().validationErrors).length === 0,

  hasErrors: () => Object.keys(get().validationErrors).length > 0,

  getFieldError: field => get().validationErrors[field] || null,

  isFieldTouched: field => get().touchedFields.has(field),

  getFormData: () => get().formData,

  getFieldValue: field => get().formData[field] || '',

  getAllErrors: () => get().validationErrors,

  getErrorCount: () => Object.keys(get().validationErrors).length,

  // Validaciones específicas
  isAspirant: () => get().formData.type_attendee === 'aspirante',

  shouldShowAcademicFields: () => {
    const data = get().formData
    return data.type_attendee === 'aspirante'
  },

  // Reset
  reset: () =>
    set({
      formData: {},
      validationErrors: {},
      touchedFields: new Set()
    }),

  resetValidationOnly: () =>
    set({
      validationErrors: {},
      touchedFields: new Set()
    })
}))
