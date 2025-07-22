import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    styleBgColor: '#2f3542' as string,
    sidebarOpen: false as boolean,
  }),

  actions: {
    setStyleBgColor(color: string) {
      this.styleBgColor = color
      
      // Actualizar CSS custom property para el layout
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--bg-color', color)
      }
    },

    initializeStyleBgColor() {
      // Aplicar el color persistido al layout al inicializar
      if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty('--bg-color', this.styleBgColor)
      }
    },

    setSidebarOpen(open: boolean) {
      this.sidebarOpen = open
    }
  },

  persist: {
    key: 'letters-app-store',
    paths: ['styleBgColor', 'sidebarOpen']
  }
})