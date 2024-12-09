// stores/data.js
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { toast } from '@/components/ui/toast'

export const useGameDataStore = defineStore('game', {
  state: () => ({
    metadata: {
      currentPeriod: 1,
      lastModified: null
    },
    currentPeriodData: {
      decisions: {
        data: {
          goals: {},
          generalInput: {},
          personalUndAbteilungen: {}
        },
        timestamp: null
      }
    },
    isDirty: false,
    moduleHandlers: []
  }),

  actions: {
    updateModule(moduleName, data) {
      this.currentPeriodData.decisions.data = {
        ...this.currentPeriodData.decisions.data,
        [moduleName]: {...data}
      }
      console.log("updating module", moduleName, this.currentPeriodData.decisions.data)
      this.isDirty = true
      this.currentPeriodData.decisions.timestamp = Date.now() / 1000
      this.saveToLocalStorage()
    },

    // Basis-Speicher-Operationen
    saveToLocalStorage() {
      localStorage.setItem('gameCurrentPeriod', JSON.stringify({
        metadata: this.metadata,
        currentPeriodData: this.currentPeriodData
      }))
    },

    loadFromLocalStorage() {
      const stored = localStorage.getItem('gameCurrentPeriod')
      if (stored) {
        const { metadata, currentPeriodData } = JSON.parse(stored)
        if (!this.currentPeriodData.decisions.timestamp || 
            currentPeriodData.decisions.timestamp > this.currentPeriodData.decisions.timestamp) {
          this.metadata = metadata
          this.currentPeriodData = currentPeriodData
          this.notifyModules()
        }
      }
    },

    // Server-Kommunikation
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
    },

    async load() {
      this.loadFromLocalStorage()
      try {
        const response = await fetch('/api/periods/current', {
          headers: {
            'Authorization': `Bearer ${useAuthStore().token}`
          }
        })
        const serverData = await response.json()
        console.log('Server data:', serverData)
        console.log('Current period data:', this.currentPeriodData)
        // Überprüfe, ob die Serverdaten neuer sind als die lokal gespeicherten
        if (!this.currentPeriodData.decisions.timestamp || 
            serverData.periodData.decisions.timestamp > this.currentPeriodData.decisions.timestamp) {
          this.metadata = serverData.metadata
          this.currentPeriodData = serverData.periodData
          this.notifyModules()
          this.saveToLocalStorage()
        }
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: error.message, 
          variant: 'destructive' 
        })
      }
    },

    // Zusätzliche Methoden für Periodenzugriff
    async loadPeriodData(periodNumber) {
      try {
        const response = await fetch(`/api/periods/${periodNumber}`, {
          headers: {
            'Authorization': `Bearer ${useAuthStore().token}`
          }
        })
        return await response.json()
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: error.message, 
          variant: 'destructive' 
        })
        return null
      }
    },

    async advancePeriod() {
      try {
        // Speichere aktuelle Periode
        await this.saveToServer()
        
        // Hole neue Periodennummer und kopierte Daten vom Server
        const response = await fetch('/api/periods/advance', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${useAuthStore().token}`
          }
        })
        const newPeriodData = await response.json()
        
        // Update lokalen State
        this.metadata = newPeriodData.metadata
        this.currentPeriodData = newPeriodData.periodData
        this.saveToLocalStorage()
        this.notifyModules()
      } catch (error) {
        toast({ 
          title: 'Error', 
          description: error.message, 
          variant: 'destructive' 
        })
      }
    },

    // Module Handler Methoden
    notifyModules() {
      this.moduleHandlers.forEach(handler => 
        handler(this.currentPeriodData.decisions.data)
      )
    },

    registerModuleHandler(handler) {
      this.moduleHandlers.push(handler)
    }
  }
})