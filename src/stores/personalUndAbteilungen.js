import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const usePersonalUndAbteilungenStore = defineStore('personalUndAbteilungen', {
  state: () => ({
    personalUndAbteilungen: {
      persEinsatz: {
        persAbt: {
          innere: { aerzte: 18, stationsschwestern: 12, krankenschwestern: 56, schwesternschuelerinnen: 24 },
          chir: { aerzte: 22, stationsschwestern: 14, krankenschwestern: 66, schwesternschuelerinnen: 29 },
          gyn: { aerzte: 7, stationsschwestern: 6, krankenschwestern: 28, schwesternschuelerinnen: 12 }
        },
        pVeraenZentral: { kueche: 0.0, waescherei: 0.0, reinigungsdienst: 0.0, sonstige: 0.0 },
        pVeraenFunk: { labor: 0.0, op: 0.0, sonstige: 0.0 },
        abtplanung: { innere: 5, chir: 7, gyn: 3 },
        pEnt: { belegarzt: 0, sozialarbeiter: 0 }
      },
      ueberstunden: {
        ueIntern: {
          innere: { aerzte: 0.0, stationsschwestern: 0.0, krankenschwestern: 0.0, schwesternschuelerinnen: 0.0 },
          chir: { aerzte: 0.0, stationsschwestern: 0.0, krankenschwestern: 0.0, schwesternschuelerinnen: 0.0 },
          gyn: { aerzte: 0.0, stationsschwestern: 0.0, krankenschwestern: 0.0, schwesternschuelerinnen: 0.0 }
        },
        ueFunk: { labor: 0.0, op: 0.0, sonstige: 0.0 },
        ueZentral: { zentral: 0.0 }
      },
      personalPool: {
        poolingAkt: {
          innere: { aerzte: 18, stationsschwestern: 12, krankenschwestern: 56, schwesternschuelerinnen: 24 },
          chir: { aerzte: 22, stationsschwestern: 14, krankenschwestern: 66, schwesternschuelerinnen: 29 },
          gyn: { aerzte: 7, stationsschwestern: 6, krankenschwestern: 28, schwesternschuelerinnen: 12 }
        },
        poolingVerg: {
          innere: { aerzte: 18, stationsschwestern: 12, krankenschwestern: 56, schwesternschuelerinnen: 24 },
          chir: { aerzte: 22, stationsschwestern: 14, krankenschwestern: 66, schwesternschuelerinnen: 29 },
          gyn: { aerzte: 7, stationsschwestern: 6, krankenschwestern: 28, schwesternschuelerinnen: 12 }
        }
      }
    }
  }),

  getters: {
    isValid: (state) => {
      const validateValues = (obj) => {
        return Object.values(obj).every(value => {
          if (typeof value === 'object') {
            return validateValues(value)
          }
          return value >= 0
        })
      }

      return validateValues(state.personalUndAbteilungen.persEinsatz) &&
             validateValues(state.personalUndAbteilungen.ueberstunden) &&
             validateValues(state.personalUndAbteilungen.personalPool)
    }
  },

  actions: {
    updateFromGameData(data) {
      if (data.personalUndAbteilungen) {
        this.$patch(data.personalUndAbteilungen)
      }
    },

    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))
      
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed = JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data
        if (data.personalUndAbteilungen && Object.keys(data.personalUndAbteilungen).length > 0) {
            this.personalUndAbteilungen = JSON.parse(JSON.stringify(data.personalUndAbteilungen))
        } else {
          console.log("PersonalUndAbteilungen initialized from standard")
          gameDataStore.currentPeriodData.decisions.data = this.$state
        }
      }
      console.log("PersonalUndAbteilungen initialized", this.$state)
      console.log("gameDataStore.currentPeriodData.decisions.data", gameDataStore.currentPeriodData.decisions.data)
    },

    updateData(section, key, value) {
      if (this.$state.personalUndAbteilungen[section] && this.$state.personalUndAbteilungen[section][key] !== undefined) {
        this.$state.personalUndAbteilungen[section][key] = value
      }
    }
  }
}) 