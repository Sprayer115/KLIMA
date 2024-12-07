<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Allgemeine Entscheidungen</h2>
    <form @submit.prevent="handleSubmit">
      <section class="section mb-4 border p-4 rounded">
        <table class="w-full">
          <tr class="border-b separator">
            <td><Label for="emergencyCapacity" class="min-w-48">Notfallkapazität (%)</Label></td>
            <td>
              <Input
                type="number"
                id="emergencyCapacity"
                v-model="emergencyCapacity"
                @update:model-value="updateGeneralInput"
                step="0.1"
                min="0"
                max="100"
                class="w-16 p-1 border rounded right-aligned mb-4"
              />
            </td>
          </tr>
          <tr class="border-b separator" v-for="(decision, index) in operationalDecisions" :key="index">
            <td><Label :for="'decision-' + index" class="min-w-48">{{ decision.label }}</Label></td>
            <td>
              <input
                type="checkbox"
                :id="'decision-' + index"
                v-model="decision.checked"
                @change="updateGeneralInput"
                class="styled-checkbox"
              />
            </td>
          </tr>
          <tr class="border-b separator">
            <td><Label for="publicRelationsBudget" class="min-w-48">Budget (€)</Label></td>
            <td>
              <Input
                type="number"
                id="publicRelationsBudget"
                v-model="publicRelationsBudget"
                @update:model-value="updateGeneralInput"
                step="200"
                min="0"
                class="w-16 p-1 border rounded right-aligned"
              />
            </td>
          </tr>
        </table>
      </section>
      <section class="section mb-4 border p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">Wahlleistungen</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(item, index) in wahlleistungen" :key="index">
            <Label :for="item.id" class="min-w-48">{{ item.label }}</Label>
            <Input
              type="number"
              :id="item.id"
              v-model="item.value"
              @update:model-value="updateGeneralInput"
              :step="item.step"
              :min="item.min"
              :max="item.max"
              class="w-16 p-1 border rounded right-aligned mb-2"
            />
            <span v-if="item.label.includes('%')">%</span>
          </div>
        </div>
      </section>
      <section class="section mb-4 border p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">Veränderung der Sachmittel (Teil der Bereitschaftskosten)</h3>
        <div class="flex flex-wrap gap-4">
          <div v-for="(modification, index) in costModificationsSachmittel" :key="index" class="flex items-center gap-2">
            <Label :for="'modification-sachmittel-' + index" class="min-w-48">{{ modification.label }}</Label>
            <Input
              type="number"
              :id="'modification-sachmittel-' + index"
              v-model="modification.value"
              @update:model-value="updateGeneralInput"
              step="0.1"
              min="0"
              max="100"
              class="w-16 p-1 border rounded right-aligned"
            />
            <span>%</span>
          </div>
        </div>
      </section>
      <section class="section mb-4 border p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">Veränderung der Leistungskosten</h3>
        <div class="flex flex-wrap gap-4">
          <div v-for="(modification, index) in costModificationsLeistungskosten" :key="index" class="flex items-center gap-2">
            <Label :for="'modification-leistungskosten-' + index" class="min-w-48">{{ modification.label }}</Label>
            <Input
              type="number"
              :id="'modification-leistungskosten-' + index"
              v-model="modification.value"
              @update:model-value="updateGeneralInput"
              step="0.1"
              min="0"
              max="100"
              class="w-16 p-1 border rounded right-aligned"
            />
            <span>%</span>
          </div>
        </div>
      </section>
      <Button @click="saveToServer" class="mt-4">Speichern</Button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onActivated } from 'vue'
import { useGeneralInputStore } from '@/stores/generalInput'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const store = useGeneralInputStore()
const gameDataStore = useGameDataStore()
const { emergencyCapacity, operationalDecisions, publicRelationsBudget, surchargePercentages, materialCostMarkup, dailyFoodAllowance, costModificationsSachmittel, costModificationsLeistungskosten } = storeToRefs(store)

const wahlleistungen = ref([])

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
  operationalDecisions.value = store.operationalDecisions
  wahlleistungen.value = [
    { id: 'surchargePercentages0', label: 'Zuschlag auf Fallpauschalen (%)', value: surchargePercentages.value[0], step: 0.1, min: 0, max: 100 },
    { id: 'surchargePercentages1', label: 'Zuschlag auf Fallpauschalen (%)', value: surchargePercentages.value[1], step: 0.1, min: 0, max: 100 },
    { id: 'materialCostMarkup0', label: 'Mehraufwand Sachmittel (%)', value: materialCostMarkup.value[0], step: 0.1, min: 0, max: 100 },
    { id: 'materialCostMarkup1', label: 'Mehraufwand Sachmittel (%)', value: materialCostMarkup.value[1], step: 0.1, min: 0, max: 100 },
    { id: 'dailyFoodAllowance0', label: 'Mehraufwand Lebensmittel (€)', value: dailyFoodAllowance.value[0], step: 0.01, min: 0 },
    { id: 'dailyFoodAllowance1', label: 'Mehraufwand Lebensmittel (€)', value: dailyFoodAllowance.value[1], step: 0.01, min: 0 },
  ]
}

onMounted(initData)
onActivated(initData)

const handleSubmit = () => {
  store.updateGeneralInput({
    emergencyCapacity: emergencyCapacity.value,
    operationalDecisions: operationalDecisions.value,
    publicRelationsBudget: publicRelationsBudget.value,
    surchargePercentages: [wahlleistungen.value[0].value, wahlleistungen.value[1].value],
    materialCostMarkup: [wahlleistungen.value[2].value, wahlleistungen.value[3].value],
    dailyFoodAllowance: [wahlleistungen.value[4].value, wahlleistungen.value[5].value],
    costModificationsSachmittel: costModificationsSachmittel.value,
    costModificationsLeistungskosten: costModificationsLeistungskosten.value,
  })
}

const saveToServer = async () => {
  await gameDataStore.saveToServer()
}
const updateGeneralInput = () => {
  store.updateGeneralInput({
    emergencyCapacity: emergencyCapacity.value,
    operationalDecisions: operationalDecisions.value,
    publicRelationsBudget: publicRelationsBudget.value,
    surchargePercentages: [wahlleistungen.value[0].value, wahlleistungen.value[1].value],
    materialCostMarkup: [wahlleistungen.value[2].value, wahlleistungen.value[3].value],
    dailyFoodAllowance: [wahlleistungen.value[4].value, wahlleistungen.value[5].value],
    costModificationsSachmittel: costModificationsSachmittel.value,
    costModificationsLeistungskosten: costModificationsLeistungskosten.value,
  })
}
</script>

<style scoped>
.general-input {
  background-color: var(--bg-color);
  padding: 20px;
  border-radius: 8px;
}

.section {
  margin-bottom: 20px;
}

.right-aligned {
  text-align: right;
}

.separator {
  border-bottom-width: 1px;
  border-bottom-color: gray;
  margin-top: 8px;
  margin-bottom: 8px;
}


:root {
  --bg-color: #f0f0f0;
  --border-color: #ccc;
  --checked-bg-color: #333;
  --checked-border-color: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #333;
    --border-color: #555;
    --checked-bg-color: #fff;
    --checked-border-color: #fff;
  }
}
</style>