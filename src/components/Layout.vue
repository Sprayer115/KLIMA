<template>
  <div class="min-h-screen dark:bg-stone-950 ">
    <div class="border-b dark:border-slate-800">
      <div class="flex h-16 items-center px-4">
        <div class="text-xl font-bold dark:text-white">
          <router-link to="/" >KLIMA</router-link>
        </div>
        <nav v-if="isAuthenticated" class="mx-6 flex items-center space-x-4">
          <!-- Ziele Link -->
          <router-link 
            to="/goals" 
            class="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-gray-900 dark:text-white"
            exact
          >
            Ziele
          </router-link>

          <!-- Dateneingabe Dropdown -->
          <div class="relative group">
            <button 
              class="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none flex items-center"
              :class="{'text-gray-900 dark:text-white': isDateneingabeActive}"
              @click="toggleDropdown"
              aria-haspopup="true"
              :aria-expanded="isDropdownOpen"
            >
              Dateneingabe
              <svg class="ml-1 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div 
              v-show="isDropdownOpen" 
              class="absolute mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg transition-opacity z-10"
              @mouseleave="isDropdownOpen = false"
            >
              <router-link
                to="/general-input"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Allgemeine Eingabe
              </router-link>
              <router-link
                to="/fallpauschalen"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Fallpauschalen
              </router-link>
              <router-link
                to="/forschung-investition-und-zgb"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Forschung, Investition & ZGB
              </router-link>
              <router-link
                to="/leistungsangebot"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Leistungsangebot
              </router-link>
              <router-link
                to="/verweildauer-und-zentralbereiche"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Verweildauer & Zentralbereiche
              </router-link>
              <router-link
                to="/personal-und-abteilungen"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                active-class="bg-slate-200 dark:bg-slate-700 text-black dark:text-white"
              >
                Personal & Abteilungen
              </router-link>
            </div>
          </div>

          <!-- Ergebnisse Vergleich Link -->
          <router-link 
            to="/results" 
            class="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-gray-900 dark:text-white"
          >
            Ergebnisse Vergleich
          </router-link>
        </nav>

        <!-- Right Side (e.g., User Menu) -->
        <div class="ml-auto flex items-center space-x-4">
          <!-- Settings Link (Admin Only) -->
          <router-link 
            v-if="isAdmin" 
            to="/settings" 
            class="text-sm font-medium text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            active-class="text-gray-900 dark:text-white"
          >
            Settings
          </router-link>
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
import { ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()

const isAuthenticated = computed(() => !!auth.token)
const isAdmin = computed(() => auth.user?.role === 'admin')

// Define paths that belong to Dateneingabe
const dateneingabePaths = [
  '/general-input',
  '/fallpauschalen',
  '/forschung-investition-und-zgb',
  '/leistungsangebot',
  '/verweildauer-und-zentralbereiche',
  '/personal-und-abteilungen'
]

// Compute if Dateneingabe is active based on current route
const isDateneingabeActive = computed(() => {
  return dateneingabePaths.includes(route.path)
})

// Dropdown state
const isDropdownOpen = ref(false)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}
</script>

<style scoped>
/* Optional: Add transition effects or additional styles if needed */
</style>