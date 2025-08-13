/**
 * Submission Store - Estado de envío de formularios usando Zustand
 * Maneja proceso de envío, estado de loading y historial
 * @version 1.0
 */

import { createStore } from 'zustand/vanilla';

export const useSubmissionStore = createStore((set, get) => ({
  // Estado del proceso de envío
  submissionState: {
    isSubmitting: false,
    isSuccess: false,
    isError: false,
    errorMessage: null,
    successMessage: null
  },
  
  // Historial de envíos
  submissionHistory: [],
  
  // Datos preparados para envío
  preparedData: {},
  
  // Configuración de envío
  submissionConfig: {
    retryAttempts: 3,
    timeout: 30000,
    url: null
  },
  
  // Acciones del proceso de envío
  startSubmission: () => set((state) => ({
    submissionState: {
      ...state.submissionState,
      isSubmitting: true,
      isSuccess: false,
      isError: false,
      errorMessage: null,
      successMessage: null
    }
  })),
  
  completeSubmission: (successMessage = 'Formulario enviado exitosamente') => set((state) => {
    // Agregar al historial
    const historyEntry = {
      timestamp: new Date().toISOString(),
      status: 'success',
      message: successMessage,
      data: state.preparedData
    };
    
    return {
      submissionState: {
        ...state.submissionState,
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        successMessage
      },
      submissionHistory: [...state.submissionHistory, historyEntry]
    };
  }),
  
  failSubmission: (errorMessage) => set((state) => {
    // Agregar al historial
    const historyEntry = {
      timestamp: new Date().toISOString(),
      status: 'error',
      message: errorMessage,
      data: state.preparedData
    };
    
    return {
      submissionState: {
        ...state.submissionState,
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        errorMessage
      },
      submissionHistory: [...state.submissionHistory, historyEntry]
    };
  }),
  
  // Acciones de configuración
  setSubmissionConfig: (config) => set((state) => ({
    submissionConfig: { ...state.submissionConfig, ...config }
  })),
  
  setPreparedData: (data) => set({ preparedData: data }),
  
  // Acciones de historial
  clearHistory: () => set({ submissionHistory: [] }),
  
  getLastSubmission: () => {
    const history = get().submissionHistory;
    return history.length > 0 ? history[history.length - 1] : null;
  },
  
  getSubmissionCount: () => get().submissionHistory.length,
  
  getSuccessfulSubmissions: () => get().submissionHistory.filter(entry => entry.status === 'success'),
  
  getFailedSubmissions: () => get().submissionHistory.filter(entry => entry.status === 'error'),
  
  // Getters de estado
  isSubmitting: () => get().submissionState.isSubmitting,
  isSuccess: () => get().submissionState.isSuccess,
  isError: () => get().submissionState.isError,
  getErrorMessage: () => get().submissionState.errorMessage,
  getSuccessMessage: () => get().submissionState.successMessage,
  
  // Reset
  reset: () => set({
    submissionState: {
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      errorMessage: null,
      successMessage: null
    },
    preparedData: {}
  }),
  
  resetAll: () => set({
    submissionState: {
      isSubmitting: false,
      isSuccess: false,
      isError: false,
      errorMessage: null,
      successMessage: null
    },
    submissionHistory: [],
    preparedData: {},
    submissionConfig: {
      retryAttempts: 3,
      timeout: 30000,
      url: null
    }
  })
}));