
import { defineStore } from 'pinia'
import { useGameDataStore } from './data'

/**
 * @typedef {Object} GoalsState
 * @property {Object} goals
 * @property {number} goals.highSurplus
 * @property {number} goals.lowCosts
 * @property {number} goals.exactCostCoverage
 * @property {number} goals.highOccupancyRate
 * @property {number} goals.lowLengthOfStay
 * @property {number} goals.lowDeviationRate
 * @property {number} goals.lowBedMisuse
 * @property {number} goals.adequateEmergencyCapacity
 * @property {number} goals.highSpecializationDegree
 * @property {number} goals.highOverallQuality
 */

export const useGoalsStore = defineStore('goals', {
  state: () => ({
    goals: {
      highSurplus: 0,
      lowCosts: 0,
      exactCostCoverage: 0,
      highOccupancyRate: 0,
      lowLengthOfStay: 0,
      lowDeviationRate: 0,
      lowBedMisuse: 0,
      adequateEmergencyCapacity: 0,
      highSpecializationDegree: 0,
      highOverallQuality: 0
    }
  }),

  getters: {
    activeGoalsCount: (state) => 
      Object.values(state.goals).filter(value => value > 0).length,

    isValid: (state) => {
      const activeCount = Object.values(state.goals).filter(value => value > 0).length
      const validValues = Object.values(state.goals).every(value => value >= 0 && value <= 5)
      return activeCount <= 3 && validValues
    }
  },

  actions: {
    setGoal(name, value) {
      if (value >= 0 && value <= 5) {
        this.goals[name] = value
        console.log("updating module goals", this.goals)
        useGameDataStore().updateModule('goals', this.goals)
      }
    },

    updateFromGameData(data) {
      if (data.goals) {
        this.goals = {...data.goals}
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
        if (data.goals) {
          this.goals = {...data.goals}
        }
      }
      console.log("Goals initialized", this.goals)
    }
  }
})