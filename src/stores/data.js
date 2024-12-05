// stores/data.js
import { toast } from '@/components/ui/toast'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useGameDataStore = defineStore('gameData', {
  state: () => ({
    lastSaved: null,
    isDirty: false,
    timestamp: null,
    moduleHandlers: [],
    data: {
      goals: {
        
      }
    }
  }),

  actions: {
    updateModule(moduleName, data) {
      console.log("Data:", data)
      this.data = {
        ...this.data,
        [moduleName]: {...data}
      }
      this.isDirty = true
      this.timestamp = Date.now() / 1000
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      console.log('Saving to local storage')
      localStorage.setItem('gameData', JSON.stringify({
        data: this.data,
        timestamp: this.timestamp
      }))
    },

    loadFromLocalStorage() {
      console.log('Loading from local storage')
      const stored = localStorage.getItem('gameData')
      if (stored) {
        const { data, timestamp } = JSON.parse(stored)
        if (!this.timestamp || timestamp > this.timestamp) {
          this.data = data
          this.timestamp = timestamp
          this.notifyModules()
        }
      }
      console.log('Loaded data:', this.data)
    },

    async saveToServer() {
      try {
        const response = await fetch('/api/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore().token}`
          },
          body: JSON.stringify({
            data: this.data,
            timestamp: this.timestamp
          })
        })
        const result = await response.json()
        this.lastSaved = new Date()
        this.timestamp = result.timestamp
        this.isDirty = false
        this.saveToLocalStorage()
      } catch (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
        console.error('Save failed:', error)
      }
    },

    async load() {
      this.loadFromLocalStorage()
      try {
        const response = await fetch('/api/load', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore().token}`
          }
        })
        const serverData = await response.json()
        console.log('timestamp:', this.timestamp)
        if (!this.timestamp || serverData.timestamp > this.timestamp) {
          console.log('Loading from server:', serverData)
          this.data = serverData.data
          this.timestamp = serverData.timestamp
          this.notifyModules()
          this.saveToLocalStorage()
        }
      } catch (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' })
        console.error('Load failed:', error)
      }
      console.log('Loaded data:', this.data)
    
    },

    notifyModules() {
      this.moduleHandlers.forEach(handler => handler(this.data))
    },

    registerModuleHandler(handler) {
      this.moduleHandlers.push(handler)
    }
  }
})