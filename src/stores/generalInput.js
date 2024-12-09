import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

export const useGeneralInputStore = defineStore('generalInput', {
  state: () => ({
    emergencyCapacity: 15.0,
    operationalDecisions: [
      { label: 'Verlängerung der Aufenthaltsdauer am Wochenende', checked: true },
      { label: 'Patientenaufnahme am Wochenende', checked: false },
      { label: 'Qualitätssicherung', checked: false },
      { label: 'UNI-Klinik-Überweisungen', checked: false },
    ],
    publicRelationsBudget: 0,
    surchargePercentages: [35.8, 21.5],
    materialCostMarkup: [30.0, 20.0],
    dailyFoodAllowance: [2.55, 1.70],
    costModificationsSachmittel: [
      { label: 'Innere Medizin (Sachmittel)', value: 0.0 },
      { label: 'Chirurgie (Sachmittel)', value: 100.0 },
      { label: 'Gynäkologie (Sachmittel)', value: 0.0 },
      { label: 'Labor (Sachmittel)', value: 0.0 },
      { label: 'OP (Sachmittel)', value: 0.0 },
      { label: 'Sonstige (Sachmittel)', value: 0.0 },
    ],
    costModificationsLeistungskosten: [
      { label: 'Innere Medizin (Leistungskosten)', value: 100.0 },
      { label: 'Chirurgie (Leistungskosten)', value: 0.0 },
      { label: 'Gynäkologie (Leistungskosten)', value: 0.0 },
    ],
  }),

  actions: {
    updateGeneralInput(data) {
      this.emergencyCapacity = data.emergencyCapacity
      this.operationalDecisions = data.operationalDecisions
      this.publicRelationsBudget = data.publicRelationsBudget
      this.surchargePercentages = data.surchargePercentages
      this.materialCostMarkup = data.materialCostMarkup
      this.dailyFoodAllowance = data.dailyFoodAllowance
      this.costModificationsSachmittel = data.costModificationsSachmittel
      this.costModificationsLeistungskosten = data.costModificationsLeistungskosten
      useGameDataStore().updateModule('generalInput', this.$state)
    },

    updateFromGameData(data) {
      if (data.generalInput) {
        this.$state = { ...data.generalInput }
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
        if (data.generalInput) {
          this.$state = { ...data.generalInput }
        } else {gameDataStore.currentPeriodData.decisions.data.personalUndAbteilungen = this.$state}
      }
    }
  }
})