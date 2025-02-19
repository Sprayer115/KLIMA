<template>
  <div class="flex justify-between items-center px-4">
    <!-- Guest Navigation -->
    <div v-if="!isAuthenticated" class="flex space-x-4">
      <Button @click="() => router.push('/login/register')">Registrieren</Button>
      <Button @click="() => router.push('/login')">Login</Button>
    </div>
    
    <!-- Authenticated Navigation -->
    <div v-else class="flex items-center gap-6">
      <div class="flex items-center gap-4">
        <!-- Anzeige der aktuellen Periode -->
        <div class="flex items-center bg-blue-100 dark:bg-blue-800 px-4 py-2 rounded-full shadow-md">
          <span class="text-blue-800 dark:text-blue-200 font-semibold mr-2">Periode:</span>
          <span class="text-blue-600 dark:text-blue-400">{{ gameDataStore.metadata.currentPeriod }}</span>
        </div>

        <!-- Button zum Voranschreiten der Periode -->
        <button
          @click="advancePeriod"
          :disabled="isAdvancing"
          class="flex items-center bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400"
          aria-label="Periode voranschreiten"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2 transform transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          <span>Voranschreiten</span>
        </button>
      </div>
      
      <!-- Modus Umschalter -->
      <ModeToggle />

      <!-- Benutzer-Dropdown-Menü -->
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="relative h-10 w-10 rounded-full">
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
import { ref, computed, onMounted } from 'vue'
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
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/data'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

const gameDataStore = useGameDataStore()
const router = useRouter()
const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth.token)

const isAdvancing = ref(false)

onMounted(() => {
  if (isAuthenticated.value) {
    gameDataStore.load()
  }
})

// Methode zum Logout
const logout = () => {
  auth.logout()
  router.push('/login')
}

// Methode zum Voranschreiten der Periode
const advancePeriod = async () => {
  if (isAdvancing.value) return
  gameDataStore.saveToServer()
  isAdvancing.value = true

  try {
    const response = await fetch('/api/periods/advance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.detail || 'Periode konnte nicht fortgeschritten werden')
    }

    const data = await response.json()

    // Aktualisiere den Game Store mit den neuen Daten
    gameDataStore.metadata = data.metadata
    gameDataStore.decisions = data.periodData.decisions
    // Falls weitere Daten aktualisiert werden müssen, hier hinzufügen

    toast({
      title: 'Erfolg',
      description: `Die Periode wurde erfolgreich auf ${data.metadata.currentPeriod} vorangeschritten.`
    })
  } catch (error) {
    toast({ 
      title: 'Fehler', 
      description: error.message, 
      variant: 'destructive' 
    })
    console.error(error)
  } finally {
    isAdvancing.value = false
  }
}
</script>

<style scoped>
/* Verbesserte Hover-Effekte für den Advance-Button */
button:hover svg {
  transform: translateX(4px);
  transition: transform 0.2s;
}

/* Optionale Fokusstile für bessere Zugänglichkeit */
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.6); /* grüne Fokusringfarbe */
}
</style>