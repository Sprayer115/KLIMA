import { defineStore } from 'pinia'
import { useGameDataStore } from './data'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

/**
 * @typedef {Object} FallpauschalenState
 * @property {Object} fallpauschalen
 * @property {number} fallpauschalen.DRG1
 * @property {number} fallpauschalen.DRG2
 * @property {number} fallpauschalen.DRG3
 * @property {number} fallpauschalen.DRG4
 * @property {number} fallpauschalen.DRG5
 * @property {number} fallpauschalen.DRG6
 * @property {number} fallpauschalen.DRG7
 * @property {number} fallpauschalen.DRG8
 * @property {number} fallpauschalen.DRG9
 * @property {number} fallpauschalen.DRG10
 * @property {number} fallpauschalen.DRG11
 * @property {number} fallpauschalen.DRG12
 * @property {number} fallpauschalen.DRG13
 * @property {number} fallpauschalen.DRG14
 * @property {number} fallpauschalen.DRG15
 * @property {number} fallpauschalen.DRG16
 * @property {number} fallpauschalen.DRG17
 * @property {boolean} isDirty
 */

export const useFallpauschalenStore = defineStore('fallpauschalen', {
  state: () => ({
    fallpauschalen: {
      DRG1: 1000,
      DRG2: 1000,
      DRG3: 1000,
      DRG4: 1000,
      DRG5: 1000,
      DRG6: 1000,
      DRG7: 1000,
      DRG8: 1000,
      DRG9: 1000,
      DRG10: 1000,
      DRG11: 1000,
      DRG12: 1000,
      DRG13: 1000,
      DRG14: 1000,
      DRG15: 1000,
      DRG16: 1000,
      DRG17: 1000
    },
    isDirty: false
  }),

  getters: {
    activeFieldsCount: (state) => {
      let count = 0
      count += Object.values(state.fallpauschalen).filter(value => value > 0).length
      return count
    },

    isValid: (state) => {
      const allValues = Object.values(state.fallpauschalen)
      return allValues.every(value => typeof value === 'number' && value >= 0 && value <= 15000)
    }
  },

  actions: {
    setField(drg, value) {
      if (this.fallpauschalen.hasOwnProperty(drg)) {
        const numericValue = Number(value)
        if (isNaN(numericValue) || numericValue < 0 || numericValue > 15000) {
          toast({ 
            title: 'Invalid Input', 
            description: `Bitte geben Sie einen gültigen Wert für ${drg} ein (0 - 15000 €).`, 
            variant: 'destructive' 
          })
          return
        }
        this.fallpauschalen[drg] = numericValue
        this.isDirty = true
        useGameDataStore().updateModule('fallpauschalen', this.fallpauschalen)
      } else {
        console.log(`Field ${drg} not found in fallpauschalen`)
      }
    },

    updateFromGameData(data) {
      if (data.fallpauschalen) {
        this.fallpauschalen = { ...data.fallpauschalen }
      }
    },

    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      
      // Check local storage immediately
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data
        if (data.fallpauschalen && Object.keys(data.fallpauschalen).length > 0) {
          this.fallpauschalen = { ...data.fallpauschalen }
        } else {
          console.log("fallpauschalen initialized from standard")
          gameDataStore.currentPeriodData.decisions.data.fallpauschalen = { ...this.fallpauschalen }
          gameDataStore.saveToLocalStorage()
        }
      } else {
        console.log("No stored data found. Initializing fallpauschalen with default values.")
        gameDataStore.currentPeriodData.decisions.data.fallpauschalen = { ...this.fallpauschalen }
        gameDataStore.saveToLocalStorage()
      }
      console.log("fallpauschalen initialized", this.fallpauschalen)
    },

  }
})
