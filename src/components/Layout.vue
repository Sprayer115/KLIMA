<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
    <header class="border-b border-gray-200 dark:border-gray-700">
      <div class="flex h-16 items-center px-4">
        <div class="text-xl font-bold text-gray-800 dark:text-white">
          <router-link to="/">KLIMA</router-link>
        </div>
        <nav v-if="isAuthenticated" class="mx-6 flex items-center space-x-4">
          <router-link 
            to="/" 
            class="text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/goals" 
            class="text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Ziele
          </router-link>
          <router-link 
            to="/results" 
            class="text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Ergebnisse
          </router-link>
          <router-link 
            v-if="isAdmin" 
            to="/settings" 
            class="text-sm font-medium text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
          >
            Settings
          </router-link>
        </nav>

        <!-- Dropdown für Input-Ansichten -->
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" class="relative h-8 rounded-full flex items-center space-x-2">
              <span class="sr-only">Navigation</span>
              <svg class="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span class="text-sm text-gray-800 dark:text-white">Dateneingabe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuLabel>Dateneingabe</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              v-for="route in inputRoutes" 
              :key="route.name" 
              @click="navigate(route.path)"
              :class="{ 'bg-gray-200 dark:bg-gray-700': isActive(route.name) }"
            >
              {{ route.nameLabel }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div class="ml-auto flex items-center space-x-4">
          <NavBar />
        </div>
      </div>
    </header>
    <main class="flex-1 p-8 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth.token)
const isAdmin = computed(() => auth.user?.role === 'admin')

const router = useRouter()
const route = useRoute()

// Define the input routes for the dropdown
const inputRoutes = [
  { name: 'Allgemein', path: '/general-input', nameLabel: 'Allgemeine Eingaben' },
  { name: 'Fallpauschalen', path: '/fallpauschalen', nameLabel: 'Fallpauschalen' },
  { name: 'Leistungsangebot', path: '/leistungsangebot', nameLabel: 'Leistungsangebot' },
  { name: 'PersonalUndAbteilungen', path: '/personal-und-abteilungen', nameLabel: 'Personal und Abteilungen' },
  { name: 'ForschungInvestitionUndZGB', path: '/forschung-investition-und-zgb', nameLabel: 'Forschung, Investition und ZGB' },
  { name: 'VerweildauerUndZentralbereiche', path: '/verweildauer-und-zentralbereiche', nameLabel: 'Verweildauer und Zentralbereiche' }
]

// Navigate to the selected route
const navigate = (path) => {
  router.push(path)
}

// Check if the given route is currently active
const isActive = (name) => {
  const matchedRoute = inputRoutes.find(r => r.name === name)
  return matchedRoute ? route.path === matchedRoute.path : false
}
</script>

<style scoped>
/* Optional: Add specific styles for the DropdownMenu here */
.bg-gray-200 {
  background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
}
.dark\:bg-gray-700 {
  background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
}
.duration-300 {
  transition-duration: 300ms;
}
</style>
