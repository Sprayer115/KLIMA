import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useFallpauschalenStore = defineStore('fallpauschalen', {
  state: () => ({
    fallpauschalen: [
      4800, 5950, 4725, 5380, 4200, 5600, 15000,
      6140, 5300, 6750, 4880, 4330, 3650, 4600,
      2750, 3320, 4800
    ]
  }),

  getters: {
    isValid: (state) => {
      return state.fallpauschalen.every(value => value >= 0 && value <= 15000)
    }
  },

  actions: {
    setFallpauschale(index, value) {
      this.fallpauschalen[index] = value
      console.log("updating module fallpauschalen", this.fallpauschalen)
      useGameDataStore().updateModule('fallpauschalen', this.fallpauschalen)
    },

    updateFromGameData(data) {
      if (data.fallpauschalen) {
        this.fallpauschalen = Array.isArray(data.fallpauschalen) 
          ? [...data.fallpauschalen]
          : Object.values(data.fallpauschalen)
      }
    },

    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data
        if (data.fallpauschalen && 
            (Array.isArray(data.fallpauschalen) ? 
              data.fallpauschalen.length : 
              Object.keys(data.fallpauschalen).length) > 0) {
          this.fallpauschalen = Array.isArray(data.fallpauschalen) 
            ? [...data.fallpauschalen]
            : Object.values(data.fallpauschalen)
        } else {
          console.log("Fallpauschalen initialized from standard")
          gameDataStore.currentPeriodData.decisions.data.fallpauschalen = [...this.fallpauschalen]
        }
      }
      console.log("Fallpauschalen initialized", this.fallpauschalen)
    }
  }
})