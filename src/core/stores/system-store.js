/**
 * System Store - Estado global del sistema usando Zustand
 * Maneja modos de operación, configuración y estado del sistema
 * @version 1.0
 */

import { createStore } from 'zustand/vanilla'

export const useSystemStore = createStore((set, get) => ({
  // Estado del sistema
  modes: {
    development: false,
    test: false,
    debug: false
  },
  systemState: {
    isSubmitting: false,
    isInitialized: false
  },
  config: {},

  // Acciones
  setMode: (mode, enabled) =>
    set(state => ({
      modes: { ...state.modes, [mode]: enabled }
    })),

  setSystemState: (key, value) =>
    set(state => ({
      systemState: { ...state.systemState, [key]: value }
    })),

  setConfig: config => set({ config }),

  // Getters computados
  getSalesforceUrl: () => {
    const { modes } = get()
    return modes.test ? 'https://test.salesforce.com/servlet/servlet.WebToLead' : 'https://webto.salesforce.com/servlet/servlet.WebToLead'
  },

  isDevelopmentMode: () => get().modes.development,
  isTestMode: () => get().modes.test,
  isDebugMode: () => get().modes.debug,
  isSubmitting: () => get().systemState.isSubmitting,
  isInitialized: () => get().systemState.isInitialized,

  // Reset
  reset: () =>
    set({
      modes: {
        development: false,
        test: false,
        debug: false
      },
      systemState: {
        isSubmitting: false,
        isInitialized: false
      }
    })
}))
