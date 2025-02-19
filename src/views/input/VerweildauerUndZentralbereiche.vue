<template>
  <div class="container mx-auto mt-20 p-4">
    <h1 class="text-2xl font-bold mb-4">Verweildauer und Zentralbereiche</h1>
    <form @submit.prevent="handleSubmit">
      <!-- Verwaltung (Verwaltungsbereiche) -->
      <section class="section mb-4 border p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Verwaltung</h2>

        <!-- Innere Medizin -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-1">Innere Medizin</h3>
          <div class="flex items-center gap-4">
            <label for="innere-ae61">Älter als 61 (%)</label>
            <Input
              id="innere-ae61"
              type="number"
              step="0.1"
              min="0"
              max="100"
              v-model.number="verwZentral.veraenVerw.Innere.ae61"
              @update:model-value="updateVerweildauer"
              class="w-24"
            />
            <label for="innere-j61">Jünger als 61 (%)</label>
            <Input
              id="innere-j61"
              type="number"
              step="0.1"
              min="0"
              max="100"
              v-model.number="verwZentral.veraenVerw.Innere.j61"
              @update:model-value="updateVerweildauer"
              class="w-24"
            />
          </div>
        </div>

        <!-- Chirurgie -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-1">Chirurgie</h3>
          <div class="flex items-center gap-4">
            <label for="chir-ae61">Älter als 61 (%)</label>
            <Input
              id="chir-ae61"
              type="number"
              step="0.1"
              min="0"
              max="100"
              v-model.number="verwZentral.veraenVerw.Chir.ae61"
              @update:model-value="updateVerweildauer"
              class="w-24"
            />
            <label for="chir-j61">Jünger als 61 (%)</label>
            <Input
              id="chir-j61"
              type="number"
              step="0.1"
              min="0"
              max="100"
              v-model.number="verwZentral.veraenVerw.Chir.j61"
              @update:model-value="updateVerweildauer"
              class="w-24"
            />
          </div>
        </div>

        <!-- Gynäkologie (Verwaltung) -->
        <div>
          <h3 class="text-lg font-semibold mb-1">Gynäkologie</h3>
          <div class="flex items-center gap-4">
            <label for="gyn">Ohne Altersbeschränkung (%)</label>
            <Input
              id="gyn"
              type="number"
              step="0.1"
              min="0"
              max="100"
              v-model.number="verwZentral.veraenVerw.Gyn"
              @update:model-value="updateVerweildauer"
              class="w-24"
            />
          </div>
        </div>
      </section>

      <!-- Zentralbereiche -->
      <section class="section mb-4 border p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Zentralbereiche</h2>
        <div class="flex items-center gap-4">
          <label for="waesche">KG Wäsche je Patient und Tag</label>
          <Input
            id="waesche"
            type="number"
            step="0.1"
            min="0"
            max="10"
            v-model.number="verwZentral.veraenZentral.Waesche"
            @update:model-value="updateVerweildauer"
            class="w-24"
          />
          <label for="lebensmittel">Lebensmittelkosten pro Tag (Normalversorgung in €)</label>
          <Input
            id="lebensmittel"
            type="number"
            step="0.1"
            min="0"
            max="50"
            v-model.number="verwZentral.veraenZentral.Lebensmittel"
            @update:model-value="updateVerweildauer"
            class="w-24"
          />
        </div>
      </section>

      <!-- Outsourcing -->
      <section class="section mb-4 border p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Outsourcing</h2>
        <div class="flex items-center gap-4">
          <label for="waescherei">Wäscherei</label>
          <input
            id="waescherei"
            type="checkbox"
            :checked="Boolean(verwZentral.Outsourcing.Waescherei)"
            @change="updateOutsourcing('Waescherei', $event.target.checked)"
            class="w-5 h-5"
          />
          <label for="reinigungsdienst">Reinigungsdienst</label>
          <input
            id="reinigungsdienst"
            type="checkbox"
            :checked="Boolean(verwZentral.Outsourcing.Reinigungsdienst)"
            @change="updateOutsourcing('Reinigungsdienst', $event.target.checked)"
            class="w-5 h-5"
          />
        </div>
      </section>

      <Button @click="saveToServer" class="mt-4">Speichern</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
import { useGameDataStore } from '@/stores/data'
import { useVerweildauerStore } from '@/stores/verweildauer'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const gameDataStore = useGameDataStore()
const store = useVerweildauerStore()
const { verwZentral } = storeToRefs(store)

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)
onActivated(initData)

// Aktualisiert den Store mit allen aktuellen Feldern aus der Maske
const updateVerweildauer = () => {
  store.updateVerweildauerInput({ ...verwZentral.value })
}

const updateOutsourcing = (key: string, checked: boolean) => {
  verwZentral.value.Outsourcing[key] = checked ? 1 : 0
  updateVerweildauer()
}

const saveToServer = async () => {
  updateVerweildauer()
  await gameDataStore.saveToServer()
}

const handleSubmit = () => {
  updateVerweildauer()
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.section {
  margin-bottom: 20px;
}
</style>

