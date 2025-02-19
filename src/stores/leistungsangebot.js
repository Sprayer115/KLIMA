import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useLeistungsangebotStore = defineStore('leistungsangebot', {
  state: () => ({
    leistung: {
      DRG1: 1,
      DRG2: 1,
      DRG3: 1,
      DRG4: 1,
      DRG5: 1,
      DRG6: 1,
      DRG7: 1,
      DRG8: 1,
      DRG9: 1,
      DRG10: 1,
      DRG11: 1,
      DRG12: 1,
      DRG13: 1,
      DRG14: 0,
      DRG15: 1,
      DRG16: 1,
      DRG17: 1,
    }
  }),
  actions: {
    updateLeistungsangebotInput(data) {
      this.leistung = { ...data }
      useGameDataStore().updateModule('leistungsangebot', this.$state)
    },
    
    updateFromGameData(data) {
      if (data.leistungsangebot) {
        this.$state = { ...data.leistungsangebot }
      }
    },
    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      // Falls im Local Storage bereits Daten vorhanden sind, werden diese übernommen
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data
        if (data.leistungsangebot) {
          this.$state = { ...data.leistungsangebot }
        } else {
          // Synchronisiere den initialen Zustand des Stores mit gameDataStore
          gameDataStore.currentPeriodData.decisions.data.leistungsangebot = this.$state
        }
      }
    }
  }
})