<template>
  <div class="container mx-auto p-4 space-y-4">
    <h1 class="text-3xl font-bold mb-6">Personal und Abteilungen</h1>

    <Tabs default-value="persEinsatz">
      <TabsList>
        <TabsTrigger value="persEinsatz">PersEinsatz</TabsTrigger>
        <TabsTrigger value="ueberstunden">Ueberstunden</TabsTrigger>
        <TabsTrigger value="pooling">Pooling</TabsTrigger>
      </TabsList>

      <TabsContent value="persEinsatz">
        <PersEinsatz />
      </TabsContent>
      <TabsContent value="ueberstunden">
        <Ueberstunden />
      </TabsContent>
      <TabsContent value="pooling">
        <Pooling />
      </TabsContent>
    </Tabs>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePersonalUndAbteilungenStore } from '@/stores/PersonalUndAbteilungen'
import { useGameDataStore } from '@/stores/data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PersEinsatz from '@/components/PersEinsatz.vue'
import Ueberstunden from '@/components/Ueberstunden.vue'
import Pooling from '@/components/Pooling.vue'

const store = usePersonalUndAbteilungenStore()
const gameDataStore = useGameDataStore()

const { isDirty } = store

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)

const saveToServer = () => {
  store.saveToServer()
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
