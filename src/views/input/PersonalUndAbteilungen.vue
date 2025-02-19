<!-- PersonalUndAbteilungen.vue -->
<script setup lang="ts">
import { ref, provide } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PersonalPool from '@/components/PersonalPool.vue'
import Ueberstunden from '@/components/Ueberstunden.vue'
import Personaleinsatz from '@/components/Personaleinsatz.vue'
import { usePersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'

// Erstellen Sie eine einzige Instanz des Stores
const store = usePersonalUndAbteilungenStore()

// Stellen Sie den Store den Child-Komponenten zur Verfügung
provide('personalUndAbteilungenStore', store)

// Aktiver Tab-Wert als reaktives Ref
const activeTab = ref('personaleinsatz')
</script>

<template>
  <Tabs v-model:active-value="activeTab" default-value="personaleinsatz">
    <TabsList class="inline-flex space-x-2 !justify-start">
      <TabsTrigger value="personaleinsatz">Personaleinsatz</TabsTrigger>
      <TabsTrigger value="ueberstunden">Überstunden</TabsTrigger>
      <TabsTrigger value="personalpool">Personal Pool</TabsTrigger>
    </TabsList>
    <TabsContent value="personaleinsatz">
      <keep-alive>
        <Personaleinsatz />
      </keep-alive>
    </TabsContent>
    <TabsContent value="ueberstunden">
      <keep-alive>
        <Ueberstunden />
      </keep-alive>
    </TabsContent>
    <TabsContent value="personalpool">
      <keep-alive>
        <PersonalPool />
      </keep-alive>
    </TabsContent>
  </Tabs>
</template>

