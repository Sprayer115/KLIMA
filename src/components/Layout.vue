<template>
  <div class="min-h-screen dark:bg-slate-950">
    <div class="border-b dark:border-slate-800">
      <div class="flex h-16 items-center px-4">
        <div class="text-xl font-bold dark:text-white">
          <router-link to="/">KLIMA</router-link>
        </div>
        <nav v-if="isAuthenticated" class="mx-6 flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/goals" 
            class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Unternehmensziele
          </router-link>
          <div class="relative group">
            <button 
              class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Eingaben
            </button>
            <div class="absolute mt-2 w-48 bg-white dark:bg-slate-800 rounded shadow-lg opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <router-link 
                to="/general-input" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'generalInput' }"
              >
                Allgemeine Entscheidungen
              </router-link>
              <router-link 
                to="/personal-und-abteilungen" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'PersonalUndAbteilungen' }"
              >
                Personal & Abteilungen
              </router-link>
              <router-link 
                to="/fallpauschalen" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'Fallpauschalen' }"
              >
                Fallpauschalen
              </router-link>
              <router-link 
                to="/verweildauer-und-zentralbereiche" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'VerweildauerUndZentralbereiche' }"
              >
                Verweildauer & Zentralbereiche
              </router-link>
              <router-link 
                to="/forschung-und-investition" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'ForschungUndInvestition' }"
              >
                Forschung & Investition
              </router-link>
              <router-link 
                to="/leistungsangebot" 
                class="block px-4 py-2 text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
                :class="{ 'bg-blue-500 text-white': $route.name === 'Leistungsangebot' }"
              >
                Leistungsangebot
              </router-link>
            </div>
          </div>
          <router-link 
            v-if="isAdmin" 
            to="/settings" 
            class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Settings
          </router-link>
        </nav>
        <div class="ml-auto flex items-center space-x-4">
          <div class="text-sm font-medium dark:text-slate-300">
            Aktuelle Periode: {{ currentPeriod }}
          </div>
          <button 
            @click="advancePeriod" 
            class="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Voranschreiten
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <NavBar />
        </div>
      </div>
    </div>
    <div class="flex-1 p-8 dark:text-slate-200">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useGameDataStore } from '@/stores/data'

const auth = useAuthStore()
const gameDataStore = useGameDataStore()
const isAuthenticated = computed(() => !!auth.token)
const isAdmin = computed(() => auth.user?.role === 'admin')
const currentPeriod = computed(() => gameDataStore.metadata.currentPeriod)

const advancePeriod = async () => {
  try {
    await gameDataStore.advancePeriod()
  } catch (error) {
    console.error("Fehler beim Voranschreiten der Periode:", error)
  }
}
</script>

<style scoped>
.relative:hover .absolute {
  display: block;
}
</style>