// stores/personalUndAbteilungen.js
import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const usePersonalUndAbteilungenStore = defineStore('personalUndAbteilungen', {
  state: () => ({
    // Initial state based on XML structure
    persEinsatz: {
      PersAbt: {
        Innere: {
          Aerzte: 18,
          Stationsschwestern: 12,
          Krankenschwestern: 56,
          Schwesternschuelerinnen: 24
        },
        Chir: {
          Aerzte: 22,
          Stationsschwestern: 14,
          Krankenschwestern: 66,
          Schwesternschuelerinnen: 29
        },
        Gyn: {
          Aerzte: 7,
          Stationsschwestern: 6,
          Krankenschwestern: 28,
          Schwesternschuelerinnen: 12
        }
      },
      PVeraenZentral: {
        Kueche: 0,
        Waescherei: 0,
        Reinigungsdienst: 0,
        Sonstige: 0
      },
      PVeraenFunk: {
        Labor: 0,
        Op: 0,
        Sonstige: 0
      },
      Abtplanung: {
        Innere: 6,
        Chir: 7,
        Gyn: 3
      },
      PEnt: {
        Belegarzt: false,
        Sozialarbeiter: false
      }
    },
    ueberstunden: {
      UeIntern: {
        Innere: {
          Aerzte: 0.0,
          Stationsschwestern: 0.0,
          Krankenschwestern: 0.0,
          Schwesternschuelerinnen: 0.0
        },
        Chir: {
          Aerzte: 0.0,
          Stationsschwestern: 0.0,
          Krankenschwestern: 0.0,
          Schwesternschuelerinnen: 0.0
        },
        Gyn: {
          Aerzte: 0.0,
          Stationsschwestern: 0.0,
          Krankenschwestern: 0.0,
          Schwesternschuelerinnen: 0.0
        }
      },
      UeFunk: {
        Labor: 0.0,
        Op: 0.0,
        Sonstige: 0.0
      },
      UeZentral: {
        Zentral: 0.0
      }
    },
    personalPool: {
      PoolingAkt: {
        Innere: {
          Aerzte: 18,
          Stationsschwestern: 12,
          Krankenschwestern: 56,
          Schwesternschuelerinnen: 24
        },
        Chir: {
          Aerzte: 22,
          Stationsschwestern: 14,
          Krankenschwestern: 66,
          Schwesternschuelerinnen: 29
        },
        Gyn: {
          Aerzte: 7,
          Stationsschwestern: 6,
          Krankenschwestern: 28,
          Schwesternschuelerinnen: 12
        }
      },
      PoolingVerg: {
        Innere: {
          Aerzte: 18,
          Stationsschwestern: 12,
          Krankenschwestern: 56,
          Schwesternschuelerinnen: 24
        },
        Chir: {
          Aerzte: 22,
          Stationsschwestern: 14,
          Krankenschwestern: 66,
          Schwesternschuelerinnen: 29
        },
        Gyn: {
          Aerzte: 7,
          Stationsschwestern: 6,
          Krankenschwestern: 28,
          Schwesternschuelerinnen: 12
        }
      }
    }
  }),
  
  getters: {
    // Add computed properties if needed
  },

  actions: {
    /**
     * Update all fields of personalUndAbteilungen store.
     * @param {Object} data - The new data to update the store with.
     */
    updatePersonalUndAbteilungen(data) {
        console.log("Updating personalUndAbteilungen store with:", data)
      // Update each section within persEinsatz
      if (data.PersAbt) {
        this.persEinsatz = { ...data }
      }
      if (data.PoolingAkt) {
        this.personalPool = { ...data}
      }
      if (data.UeIntern) {
        this.ueberstunden = { ...data}
      }
      if(data.persEinsatz && data.personalPool && data.ueberstunden) {
        this.$state = { ...data }
      }
      
      console.log("Updated personalUndAbteilungen store:", this.$state) 
      // Persist the updated state to the gameDataStore
      useGameDataStore().updateModule('personalUndAbteilungen', this.$state)
    },

    /**
     * Update store from game data.
     * @param {Object} data - The game data containing personalUndAbteilungen.
     */
    updateFromGameData(data) {
      if (data.personalUndAbteilungen) {
        this.updatePersonalUndAbteilungen(data.personalUndAbteilungen)
      }
    },

    /**
     * Initialize the store by loading data from gameDataStore and localStorage.
     */
    initialize() {
      const gameDataStore = useGameDataStore()
      gameDataStore.registerModuleHandler(this.updateFromGameData.bind(this))

      // Check local storage immediately
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const parsed= JSON.parse(stored)
        const data = parsed.currentPeriodData.decisions.data

        if (data.personalUndAbteilungen) {
          this.updatePersonalUndAbteilungen(data.personalUndAbteilungen)
        } else {
          // Sync initial state with gameDataStore if no data in localStorage
          gameDataStore.currentPeriodData.decisions.data.personalUndAbteilungen = this.$state
        }
      }
    }
  }
})