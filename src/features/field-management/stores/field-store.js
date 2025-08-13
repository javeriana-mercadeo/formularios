/**
 * Field Store - Estado de gestión de campos usando Zustand  
 * Maneja visibilidad, opciones y estado de campos específicos
 * @version 1.0
 */

import { createStore } from 'zustand/vanilla';

export const useFieldStore = createStore((set, get) => ({
  // Estado de visibilidad de campos
  fieldVisibility: {
    academic_level: false,
    faculty: false,
    program: false,
    admission_period: false,
    department: false,
    city: false,
    university: false,
    school: false,
    company: false
  },
  
  // Opciones dinámicas para selects
  fieldOptions: {
    countries: [],
    departments: [],
    cities: [],
    academic_levels: [],
    faculties: [],
    programs: [],
    universities: [],
    colleges: [],
    companies: [],
    attendance_days: [],
    type_attendees: [],
    admission_periods: []
  },
  
  // Estado de carga de campos
  fieldLoadingState: {},
  
  // Campos deshabilitados
  disabledFields: new Set(),
  
  // Valores de campos
  fieldValues: {},
  
  // Campos tocados
  touchedFields: new Set(),
  
  // Acciones de visibilidad
  setFieldVisibility: (fieldName, visible) => set((state) => ({
    fieldVisibility: { ...state.fieldVisibility, [fieldName]: visible }
  })),
  
  setMultipleFieldsVisibility: (visibilityObject) => set((state) => ({
    fieldVisibility: { ...state.fieldVisibility, ...visibilityObject }
  })),
  
  showField: (fieldName) => set((state) => ({
    fieldVisibility: { ...state.fieldVisibility, [fieldName]: true }
  })),
  
  hideField: (fieldName) => set((state) => ({
    fieldVisibility: { ...state.fieldVisibility, [fieldName]: false }
  })),
  
  // Acciones de opciones
  setFieldOptions: (fieldName, options) => set((state) => ({
    fieldOptions: { ...state.fieldOptions, [fieldName]: options }
  })),
  
  updateFieldOptions: (optionsObject) => set((state) => ({
    fieldOptions: { ...state.fieldOptions, ...optionsObject }
  })),
  
  clearFieldOptions: (fieldName) => set((state) => ({
    fieldOptions: { ...state.fieldOptions, [fieldName]: [] }
  })),
  
  // Acciones de estado de carga
  setFieldLoading: (fieldName, loading) => set((state) => ({
    fieldLoadingState: { ...state.fieldLoadingState, [fieldName]: loading }
  })),
  
  // Acciones de campos deshabilitados
  setFieldDisabled: (fieldName, disabled) => set((state) => {
    const newDisabledFields = new Set(state.disabledFields);
    if (disabled) {
      newDisabledFields.add(fieldName);
    } else {
      newDisabledFields.delete(fieldName);
    }
    return { disabledFields: newDisabledFields };
  }),
  
  setFieldEnabled: (fieldName, enabled) => set((state) => {
    const newDisabledFields = new Set(state.disabledFields);
    if (enabled) {
      newDisabledFields.delete(fieldName);
    } else {
      newDisabledFields.add(fieldName);
    }
    return { disabledFields: newDisabledFields };
  }),
  
  // Acciones de valores de campos
  updateFieldValue: (fieldName, value) => set((state) => ({
    fieldValues: { ...state.fieldValues, [fieldName]: value }
  })),
  
  clearFieldValue: (fieldName) => set((state) => {
    const { [fieldName]: removed, ...rest } = state.fieldValues;
    return { fieldValues: rest };
  }),
  
  // Acciones de campos tocados
  markFieldTouched: (fieldName) => set((state) => ({
    touchedFields: new Set([...state.touchedFields, fieldName])
  })),
  
  clearFieldTouched: (fieldName) => set((state) => {
    const newTouchedFields = new Set(state.touchedFields);
    newTouchedFields.delete(fieldName);
    return { touchedFields: newTouchedFields };
  }),
  
  // Getters
  isFieldVisible: (fieldName) => get().fieldVisibility[fieldName] || false,
  
  getFieldOptions: (fieldName) => get().fieldOptions[fieldName] || [],
  
  isFieldLoading: (fieldName) => get().fieldLoadingState[fieldName] || false,
  
  isFieldDisabled: (fieldName) => get().disabledFields.has(fieldName),
  
  getFieldValue: (fieldName) => get().fieldValues[fieldName] || '',
  
  isFieldTouched: (fieldName) => get().touchedFields.has(fieldName),
  
  // Lógica específica para campos académicos
  showAcademicFields: () => set((state) => ({
    fieldVisibility: {
      ...state.fieldVisibility,
      academic_level: true,
      faculty: true,
      program: true,
      admission_period: true
    }
  })),
  
  hideAcademicFields: () => set((state) => ({
    fieldVisibility: {
      ...state.fieldVisibility,
      academic_level: false,
      faculty: false,
      program: false,
      admission_period: false
    }
  })),
  
  // Lógica específica para ubicación
  showLocationFields: (country) => {
    if (country === 'Colombia') {
      set((state) => ({
        fieldVisibility: {
          ...state.fieldVisibility,
          department: true,
          city: true
        }
      }));
    } else {
      set((state) => ({
        fieldVisibility: {
          ...state.fieldVisibility,
          department: false,
          city: false
        }
      }));
    }
  },
  
  // Reset
  reset: () => set({
    fieldVisibility: {
      academic_level: false,
      faculty: false,
      program: false,
      admission_period: false,
      department: false,
      city: false,
      university: false,
      school: false,
      company: false
    },
    fieldLoadingState: {},
    disabledFields: new Set(),
    fieldValues: {},
    touchedFields: new Set()
  })
}));