import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useVerweildauerStore = defineStore('verweildauer', {
  state: () => ({
    verwZentral: {
      veraenVerw: {
        Innere: {
          ae61: 0.0,
          j61: 0.0,
        },
        Chir: {
          ae61: 0.0,
          j61: 0.0,
        },
        Gyn: 0.0,
      },
      veraenZentral: {
        Waesche: 2.60,
        Lebensmittel: 8.50,
      },
      Outsourcing: {
        Waescherei: 0,
        Reinigungsdienst: 0,
      }
    }
  }),
  actions: {
    updateVerweildauerInput(data) {
      this.verwZentral = { ...data }
      useGameDataStore().updateModule('verweildauer', this.$state)
    },
    updateFromGameData(data) {
      if (data.verweildauer) {
        this.$state = { ...data.verweildauer }
      }
    },
    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const storeData = parsed.currentPeriodData.decisions.data
        if (storeData.verweildauer) {
          this.$state = { ...storeData.verweildauer }
        } else {
          gameDataStore.currentPeriodData.decisions.data.verweildauer = this.$state
        }
      }
    }
  }
})