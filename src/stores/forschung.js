import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useForschungStore = defineStore('forschung', {
  state: () => ({
    forschung: {
      Innere: 0,
      Chir: 0,
      Gyn: 0,
    },
    investition: {
      Diagnose: 'btNichtGeplant',
      Operationsbesteck: 'btNichtGeplant',
      Tablettsystem: 'btNichtGeplant',
      Kieferchirurgie: 'btNichtGeplant',
    },
    zbg: {
      bisher: {
        G1: 1, G2: 0, G3: 0, G4: 0, G5: 0,
        G6: 0, G7: 0, G8: 0, G9: 0, G10: 0,
      },
      jetzt: {
        G1: 1, G2: 0, G3: 0, G4: 0, G5: 0,
        G6: 0, G7: 0, G8: 0, G9: 0, G10: 0,
      }
    }
  }),
  actions: {
    updateForschungInput(data) {
      this.forschung = data.forschung
      this.investition = data.investition
      this.zbg = data.zbg
      useGameDataStore().updateModule('forschung', this.$state)
    },
    updateFromGameData(data) {
      if (data.forschung) {
        this.$state = { ...data.forschung }
      }
    },
    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      // Check local storage immediately
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed= JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data

        if (data.forschung) {
          this.$state = { ...data.forschung }
        } else {
          // Sync initial state with gameDataStore if no data in localStorage
          gameDataStore.currentPeriodData.decisions.data.forschung = this.$state
        }
      }
    }
  }
})