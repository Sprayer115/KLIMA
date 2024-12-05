<template>
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useGameDataStore } from '@/stores/data'

export default {
  setup() {
    const dataStore = useGameDataStore()
    let saveInterval

    onMounted(() => {
      // Set up 60s auto-save
      saveInterval = setInterval(() => {
        if (dataStore.isDirty) {
          dataStore.saveToServer()
        }
      }, 60000)
    })

    onUnmounted(() => {
      clearInterval(saveInterval)
    })
  }
}
</script>


