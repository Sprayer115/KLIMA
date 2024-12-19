import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useGeneralInputStore = defineStore('generalInput', {
  state: () => ({
    generalInput: {
      notfallkap: 15.1,
      weVerlaengern: -1,
      weAufnehmen: 0,
      qualisicherung: 0,
      oeffentlichkeitsarbeit: 0.00,
      patAnUni: 0,
      entWahl: {
        entWahl1: {
          zuschFallpauschale: 35.8,
          mehrSachmittel: 30.0,
          mehLebensmittel: 2.55
        },
        entWahl2: {
          zuschFallpauschale: 21.5,
          mehrSachmittel: 20.0,
          mehLebensmittel: 1.70
        }
      },
      entSachLeistung: {
        verSachmittel: {
          innere: 0.0,
          chir: 0.0,
          gyn: 0.0,
          labor: 0.0,
          op: 0.0,
          sonstige: 0.0
        },
        verLeistung: {
          innere: 0.0,
          chir: 0.0,
          gyn: 0.0
        }
      }
    }
  }),

  getters: {
    isValid: (state) => {
      // Validierung für Notfallkapazität
      if (state.generalInput.notfallkap < 0 || state.generalInput.notfallkap > 100) return false

      // Validierung für Wahlleistungen
      const validateWahlleistung = (wahl) => {
        return wahl.zuschFallpauschale >= 0 && wahl.zuschFallpauschale <= 100 &&
               wahl.mehrSachmittel >= 0 && wahl.mehrSachmittel <= 100 &&
               wahl.mehLebensmittel >= 0
      }
      
      if (!validateWahlleistung(state.generalInput.entWahl.entWahl1) ||
          !validateWahlleistung(state.generalInput.entWahl.entWahl2)) {
        return false
      }

      // Validierung für Sachmittel und Leistungen
      const validatePercentages = (obj) => {
        return Object.values(obj).every(value => value >= -100 && value <= 100)
      }

      if (!validatePercentages(state.generalInput.entSachLeistung.verSachmittel) ||
          !validatePercentages(state.generalInput.entSachLeistung.verLeistung)) {
        return false
      }

      return true
    }
  },

  actions: {
    updateFromGameData(data) {
      if (data.generalInput) {
        this.generalInput = JSON.parse(JSON.stringify(data.generalInput))
      }
    },

    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      
      // Überprüfe den Local Storage
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data
        if (data.generalInput && Object.keys(data.generalInput).length > 0) {
          this.generalInput = JSON.parse(JSON.stringify(data.generalInput))
        } else {
          console.log("GeneralInput initialized from standard")
          gameDataStore.currentPeriodData.decisions.data.generalInput = this.generalInput
        }
      }
      console.log("GeneralInput initialized", this.generalInput)
    }
  }
}) 