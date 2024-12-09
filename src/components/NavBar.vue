<template>
  <div class="flex justify-between items-center px-4">
    <!-- Guest Navigation -->
    <div v-if="!isAuthenticated" class="flex space-x-4">
      <Button @click="() => router.push('/login/register')">Registrieren</Button>
      <Button @click="() => router.push('/login')">Login</Button>
    </div>
    
    <!-- Authenticated Navigation -->
    <div v-else class="flex items-center gap-4">
      <span style="color:red"> Periode: {{ gameDataStore.metadata.currentPeriod }}</span>
      <ModeToggle />
 
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" class="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarFallback>{{ auth.user?.email?.charAt(0) }}</AvatarFallback>
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
    import { computed } from 'vue'
    import { useAuthStore } from '@/stores/auth'
    import { Button } from '@/components/ui/button'
    import { useRouter } from 'vue-router'
    import { useGameDataStore } from '@/stores/data';

    const gameDataStore = useGameDataStore()
    const router = useRouter()
    const auth = useAuthStore()
    const isAuthenticated = computed(() => !!auth.token)
    
    const logout = () => {
      auth.logout()
      router.push('/login')
    }
  </script>