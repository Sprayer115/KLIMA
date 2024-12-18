<template>
  <AutoSave />
  <Toaster/>
  <div :class="{ 'dark': mode === 'dark' }">
    <router-view />
  </div>
 </template>
 
 <script setup>
 import NavBar from '@/components/NavBar.vue'
 import MainLayout from '@/components/Layout.vue'
 import Toaster from '@/components/ui/toast/Toaster.vue'
 import { useColorMode } from '@vueuse/core'
 import AutoSave from '@/components/AutoSave.vue'
 import { useGameDataStore } from '@/stores/data'
 import { onMounted } from 'vue'
 
 const mode = useColorMode()
 const gameDataStore = useGameDataStore()
 
 onMounted(async () => {
  await gameDataStore.load()
 })
 </script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
