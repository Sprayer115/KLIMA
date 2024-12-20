<template>
  <Tabs default-value="persEinsatz" class="w-full">
    <TabsList>
      <TabsTrigger value="persEinsatz">PersEinsatz</TabsTrigger>
      <TabsTrigger value="ueberstunden">Ueberstunden</TabsTrigger>
      <TabsTrigger value="personalPool">PersonalPool</TabsTrigger>
    </TabsList>
    <TabsContent value="persEinsatz">
      <PersEinsatz :data="personalUndAbteilungen.persEinsatz" @save="handleSave"/>
    </TabsContent>
    <TabsContent value="ueberstunden">
      <Ueberstunden :data="personalUndAbteilungen.ueberstunden" @save="handleSave"/>
    </TabsContent>
    <TabsContent value="personalPool">
      <PersonalPool :data="personalUndAbteilungen.personalPool" @save="handleSave" />
    </TabsContent>
  </Tabs>
</template>

<script setup>
import { onMounted, onActivated, watch } from 'vue'
import { usePersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PersEinsatz from '@/components/PersEinsatz.vue'
import Ueberstunden from '@/components/Ueberstunden.vue'
import PersonalPool from '@/components/PersonalPool.vue'

const store = usePersonalUndAbteilungenStore()
const gameDataStore = useGameDataStore()
const { personalUndAbteilungen } = storeToRefs(store)

const initData = async () => {
  store.initialize()
}

onMounted(initData)
onActivated(initData)

watch(personalUndAbteilungen, (newValue) => {
  console.log("Aktualisiere Modul personalUndAbteilungen", newValue)
  gameDataStore.updateModule('personalUndAbteilungen', newValue)
}, { deep: true })

function handleSave() {
  gameDataStore.saveToServer()
}
</script> 