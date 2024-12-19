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
          <router-link 
            to="/general-input" 
            class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Allgemeine Entscheidungen
          </router-link>
          <router-link 
            v-if="isAdmin" 
            to="/settings" 
            class="text-sm font-medium dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            Settings
          </router-link>
        </nav>
        <div class="ml-auto flex items-center space-x-4">
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
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const auth = useAuthStore()
const isAuthenticated = computed(() => !!auth.token)
const isAdmin = computed(() => auth.user?.role === 'admin')
</script>