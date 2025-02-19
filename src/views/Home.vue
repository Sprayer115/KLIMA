<template>
    <div class="container mx-auto mt-20">
      <h1>Klima</h1>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { initializeAllStores } from '../initStores'

  onMounted(async () => {
    await initializeAllStores()
  })

  </script>