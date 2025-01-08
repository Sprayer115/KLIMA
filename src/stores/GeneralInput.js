import { defineStore } from 'pinia'
import { useGameDataStore } from './data'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

/**
 * @typedef {Object} GeneralInputState
 * @property {Object} generalInput
 * @property {Object} generalInput.entAllg
 * @property {number} generalInput.entAllg.Notfallkap
 * @property {number} generalInput.entAllg.WeVerlaengern
 * @property {number} generalInput.entAllg.WeAufnehmen
 * @property {number} generalInput.entAllg.Qualisicherung
 * @property {number} generalInput.entAllg.Oeffentlichkeitsarbeit
 * @property {number} generalInput.entAllg.PatAnUni
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
        WeVerlaengern: -1,
        WeAufnehmen: 0,
        Qualisicherung: 0,
        Oeffentlichkeitsarbeit: 0.00,
        PatAnUni: 0
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
      // Count non-zero fields in entAllg
      count += Object.values(state.generalInput.entAllg).filter(value => value > 0).length
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
      return allValues.every(value => typeof value === 'number' && !isNaN(value))
    }
  },

  actions: {
    setField(section, field, value) {
      if (this.generalInput[section] && this.generalInput[section][field] !== undefined) {
        this.generalInput[section][field] = value
        this.isDirty = true
        this.saveToLocalStorage()
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

      // Load from local storage
      this.loadFromLocalStorage()
      
      // Load from server
      this.loadFromServer()
    }   
  }
})
