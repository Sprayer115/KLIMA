<template>
  <div class="flex justify-between items-center px-4">
    <!-- Guest Navigation -->
    <div v-if="!isAuthenticated" class="flex space-x-4">
      <Button @click="() => router.push('/login/register')">Registrieren</Button>
      <Button @click="() => router.push('/login')">Login</Button>
    </div>
    
    <!-- Authenticated Navigation -->
    <div v-else class="flex items-center gap-4">
      <ModeToggle />

      <!-- Aktuelle Periode Anzeige -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-black dark:text-white">Periode: {{ currentPeriod }}</span>
        <Button 
          variant="secondary" 
          size="sm" 
          @click="advancePeriod" 
          :disabled="isAdvancing"
        >
          {{ isAdvancing ? 'Fortschreiten...' : 'Fortschreiten' }}
        </Button>
      </div>
 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarFallback>{{ auth.user?.email?.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56" align="end" :alignOffset="-5" :sideOffset="5">
          <DropdownMenuLabel>{{ auth.user?.email }}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="() => router.push('/change-password')">Passwort Ändern</DropdownMenuItem>
          <DropdownMenuItem @click="logout">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</template>

<script setup>
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ModeToggle from '@/components/ModeToggle.vue'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useGameDataStore } from '@/stores/data'
import { Button } from '@/components/ui/button'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const gameDataStore = useGameDataStore()

const isAuthenticated = computed(() => !!auth.token)
const isAdmin = computed(() => auth.user?.role === 'admin')

// Definiere die Input-Routen für das Dropdown
const inputRoutes = [
  { name: 'Allgemein', path: '/general-input', nameLabel: 'Allgemeine Eingaben' },
  { name: 'Fallpauschalen', path: '/fallpauschalen', nameLabel: 'Fallpauschalen' },
  { name: 'Leistungsangebot', path: '/leistungsangebot', nameLabel: 'Leistungsangebot' },
  { name: 'Personal und Abteilungen', path: '/personal-und-abteilungen', nameLabel: 'Personal und Abteilungen' },
  { name: 'Forschung, Investition und ZGB', path: '/forschung-investition-und-zgb', nameLabel: 'Forschung, Investition und ZGB' },
  { name: 'Verweildauer und Zentralbereiche', path: '/verweildauer-und-zentralbereiche', nameLabel: 'Verweildauer und Zentralbereiche' }
]

// Navigiere zu der ausgewählten Route
const navigate = (path) => {
  router.push(path)
}

// Prüfe, ob die gegebene Route aktuell aktiv ist
const isActive = (name) => {
  return route.path === inputRoutes.find(r => r.nameLabel === name).path
}

// Zugriff auf die aktuelle Periode aus dem GameDataStore
const currentPeriod = computed(() => gameDataStore.metadata.currentPeriod)

// Zustand für das Fortschreiten der Periode
const isAdvancing = ref(false)

// Funktion zum Fortschreiten der Periode
const advancePeriod = async () => {
  isAdvancing.value = true
  try {
    await gameDataStore.advancePeriod()
    // Optional: Benutzerfeedback kann hier hinzugefügt werden
  } catch (error) {
    // Fehlerbehandlung kann hier ergänzt werden
    console.error('Fehler beim Fortschreiten der Periode:', error)
  } finally {
    isAdvancing.value = false
  }
}

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Optional: Füge hier spezifische Styles für das Dropdown hinzu */
.bg-gray-200 {
  background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
}
.dark\:bg-gray-700 {
  background-color: rgba(55, 65, 81, var(--tw-bg-opacity));
}
</style>
