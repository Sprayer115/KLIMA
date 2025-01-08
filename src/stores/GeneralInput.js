import { defineStore } from 'pinia'
import { useGameDataStore } from './data'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

/**
 * @typedef {Object} GeneralInputState
 * @property {Object} generalInput
 * @property {Object} generalInput.entAllg
 * @property {number} generalInput.entAllg.Notfallkap
 * @property {boolean} generalInput.entAllg.WeVerlaengern
 * @property {boolean} generalInput.entAllg.WeAufnehmen
 * @property {boolean} generalInput.entAllg.Qualisicherung
 * @property {boolean} generalInput.entAllg.Oeffentlichkeitsarbeit
 * @property {boolean} generalInput.entAllg.PatAnUni
 * @property {Object} generalInput.entWahl
 * @property {Object} generalInput.entWahl.EntWahl1
 * @property {number} generalInput.entWahl.EntWahl1.ZuschFallpauschale
 * @property {number} generalInput.entWahl.EntWahl1.MehrSachmittel
 * @property {number} generalInput.entWahl.EntWahl1.MehLebensmittel
 * @property {Object} generalInput.entWahl.EntWahl2
 * @property {number} generalInput.entWahl.EntWahl2.ZuschFallpauschale
 * @property {number} generalInput.entWahl.EntWahl2.MehrSachmittel
 * @property {number} generalInput.entWahl.EntWahl2.MehLebensmittel
 * @property {Object} generalInput.entSachLeistung
 * @property {Object} generalInput.entSachLeistung.VerSachmittel
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Innere
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Chir
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Gyn
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Labor
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Op
 * @property {number} generalInput.entSachLeistung.VerSachmittel.Sonstige
 * @property {Object} generalInput.entSachLeistung.VerLeistung
 * @property {number} generalInput.entSachLeistung.VerLeistung.Innere
 * @property {number} generalInput.entSachLeistung.VerLeistung.Chir
 * @property {number} generalInput.entSachLeistung.VerLeistung.Gyn
 * @property {boolean} isDirty
 */

export const useGeneralInputStore = defineStore('generalInput', {
  state: () => ({
    generalInput: {
      entAllg: {
        Notfallkap: 15.1,
        WeVerlaengern: false,
        WeAufnehmen: false,
        Qualisicherung: false,
        Oeffentlichkeitsarbeit: 0.0,
        PatAnUni: false
      },
      entWahl: {
        EntWahl1: {
          ZuschFallpauschale: 35.8,
          MehrSachmittel: 30.0,
          MehLebensmittel: 2.55
        },
        EntWahl2: {
          ZuschFallpauschale: 21.5,
          MehrSachmittel: 20.0,
          MehLebensmittel: 1.70
        }
      },
      entSachLeistung: {
        VerSachmittel: {
          Innere: 0.0,
          Chir: 0.0,
          Gyn: 0.0,
          Labor: 0.0,
          Op: 0.0,
          Sonstige: 0.0
        },
        VerLeistung: {
          Innere: 0.0,
          Chir: 0.0,
          Gyn: 0.0
        }
      }
    },
    isDirty: false
  }),

  getters: {
    activeFieldsCount: (state) => {
      let count = 0
      // Count non-zero and true fields in entAllg
      count += Object.values(state.generalInput.entAllg).filter(value => value > 0 || value === true).length
      // Count non-zero fields in entWahl
      for (const key in state.generalInput.entWahl) {
        count += Object.values(state.generalInput.entWahl[key]).filter(value => value > 0).length
      }
      // Count non-zero fields in entSachLeistung
      for (const section in state.generalInput.entSachLeistung) {
        count += Object.values(state.generalInput.entSachLeistung[section]).filter(value => value > 0).length
      }
      return count
    },

    isValid: (state) => {
      // Implement validation logic as needed
      // Example: check if fields are within expected ranges
      const allValues = [
        ...Object.values(state.generalInput.entAllg),
        ...Object.values(state.generalInput.entWahl.EntWahl1),
        ...Object.values(state.generalInput.entWahl.EntWahl2),
        ...Object.values(state.generalInput.entSachLeistung.VerSachmittel),
        ...Object.values(state.generalInput.entSachLeistung.VerLeistung)
      ]
      return allValues.every(value => (typeof value === 'number' && !isNaN(value)) || typeof value === 'boolean')
    }
  },

  actions: {
    setField(sectionPath, field, value) {
      const sections = sectionPath.split('.')
      let target = this.generalInput

      for (const section of sections) {
        if (target[section] === undefined) {
          console.log(`Section ${section} not found in path ${sectionPath}`)
          return
        }
        target = target[section]
      }

      if (target[field] !== undefined) {
        const currentType = typeof target[field]
        target[field] = currentType === 'boolean' ? Boolean(value) : Number(value)
        this.isDirty = true
        console.log("updating module generalInput", this.generalInput)
        useGameDataStore().updateModule('generalInput', this.generalInput)
      } else {
        console.log(`Field ${field} in section ${sectionPath} not found`)
      }
    },

    updateFromGameData(data) {
      if (data.generalInput) {
        this.generalInput = { ...data.generalInput }
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
        if (data.generalInput && Object.keys(data.generalInput).length > 0) {
          this.generalInput = { ...data.generalInput }
        } else {
          console.log("generalInput initialized from standard")
          gameDataStore.currentPeriodData.decisions.data.generalInput = this.generalInput
        }
      }
      console.log("generalInput initialized", this.generalInput)
    },

    saveToLocalStorage() {
      localStorage.setItem('gameCurrentPeriod', JSON.stringify({
        metadata: this.metadata,
        currentPeriodData: this.currentPeriodData
      }))
    },

    async saveToServer() {
      try {
        const response = await fetch('/api/periods/current', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore().token}`
          },
          body: JSON.stringify({
            metadata: this.metadata,
            periodData: this.currentPeriodData
          })
        })
        const result = await response.json()
        this.metadata.lastModified = new Date().toISOString()
        this.currentPeriodData.decisions.timestamp = result.timestamp
        this.isDirty = false
        this.saveToLocalStorage()
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: error.message, 
          variant: 'destructive' 
        })
      }
    }
  }
})
