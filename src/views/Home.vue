<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Unternehmensziele</h2>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(value, key) in goals" :key="key" class="flex items-center gap-2">
        <Label :for="key" class="min-w-48">{{ getGoalLabel(key) }}</Label>
        <Input
          type="number"
          :id="key"
          :model-value="goals[key]"
          @update:model-value="updateGoal(key, $event)"
          min="0"
          max="5"
          class="w-16 p-1 border rounded"
          :class="{ 'border-red-500': !isValid }"
        />
      </div>
    </div>
    <Button @click="saveToServer" class="mt-4">Speichern</Button>

  </div>
</template>

<script setup>
import { onMounted,onActivated } from 'vue'
import { useGoalsStore } from '@/stores/goals'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const store = useGoalsStore()
const gameDataStore = useGameDataStore()
const { goals, isValid } = storeToRefs(store)

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)
onActivated(initData)

const updateGoal = (key, value) => {
  store.setGoal(key, Number(value))
}

const getGoalLabel = (key) => {
  const labels = {
    highSurplus: 'Hoher Überschuss',
    lowCosts: 'Niedrige Fallkosten',
    exactCostCoverage: 'Genaue Kostendeckung',
    highOccupancyRate: 'Hoher Belegungsgrad',
    lowLengthOfStay: 'Niedrige Verweildauer',
    lowDeviationRate: 'Niedrige Abweisungsrate',
    lowBedMisuse: 'Geringe Bettenverschwendung',
    adequateEmergencyCapacity: 'Angemessene Notfallkapazität',
    highSpecializationDegree: 'Hoher Spezialisierungsgrad',
    highOverallQuality: 'Hohe Gesamtqualität'
  }
  return labels[key]
}

const saveToServer = async () => {
  await gameDataStore.saveToServer()
}
</script>