<template>
  <div class="container mx-auto mt-20 p-4">
    <h1 class="text-2xl font-bold mb-4">Leistungsangebot</h1>

    <!-- Zwei Spalten Layout: Linke Spalte: Innere Medizin & Gynäkologie, Rechte Spalte: Chirurgie -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Linke Spalte -->
      <div class="flex flex-col gap-4">
        <!-- Innere Medizin: DRG1-DRG6 -->
        <section class="section border p-4 rounded">
          <h2 class="text-xl font-semibold mb-2">Innere Medizin</h2>
          <div v-for="i in 6" :key="'drg' + i" class="flex items-center justify-between py-2 border-b last:border-b-0">
            <label :for="'drg' + i" class="text-lg">
              {{ labelMapping['DRG' + i] }}
            </label>
            <input
              type="checkbox"
              :id="'drg' + i"
              :checked="leistung['DRG' + i] === 1"
              @change="updateDrg(i, $event.target.checked)"
              class="w-5 h-5"
            />
          </div>
        </section>

        <!-- Gynäkologie: DRG15-DRG17 -->
        <section class="section border p-4 rounded">
          <h2 class="text-xl font-semibold mb-2">Gynäkologie</h2>
          <div v-for="i in 3" :key="'drg' + (i+14)" class="flex items-center justify-between py-2 border-b last:border-b-0">
            <label :for="'drg' + (i+14)" class="text-lg">
              {{ labelMapping['DRG' + (i+14)] }}
            </label>
            <input
              type="checkbox"
              :id="'drg' + (i+14)"
              :checked="leistung['DRG' + (i+14)] === 1"
              @change="updateDrg(i+14, $event.target.checked)"
              class="w-5 h-5"
            />
          </div>
        </section>
      </div>

      <!-- Rechte Spalte -->
      <section class="section border p-4 rounded">
        <h2 class="text-xl font-semibold mb-2">Chirurgie</h2>
        <div v-for="i in 8" :key="'drg' + (i+6)" class="flex items-center justify-between py-2 border-b last:border-b-0">
          <label :for="'drg' + (i+6)" class="text-lg">
            {{ labelMapping['DRG' + (i+6)] }}
          </label>
          <input
            type="checkbox"
            :id="'drg' + (i+6)"
            :checked="leistung['DRG' + (i+6)] === 1"
            @change="updateDrg(i+6, $event.target.checked)"
            class="w-5 h-5"
          />
        </div>
      </section>
    </div>

    <Button @click="saveToServer" class="mt-4">Speichern</Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onActivated } from 'vue'
import { useLeistungsangebotStore } from '@/stores/leistungsangebot'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'

const gameDataStore = useGameDataStore()
const store = useLeistungsangebotStore()
const { leistung } = storeToRefs(store)

const labelMapping: Record<string, string> = {
  DRG1: "DRG 1 - Neubildungen",
  DRG2: "DRG 2 - Diabetes",
  DRG3: "DRG 3 - Kreislauferkrankungen bis 61",
  DRG4: "DRG 4 - Kreislauferkrankungen über 61",
  DRG5: "DRG 5 - Verdauungsorgane bis 61",
  DRG6: "DRG 6 - Verdauungsorgane über 61",
  DRG7: "DRG 7 - Kreislauferkrankungen",
  DRG8: "DRG 8 - Neubildungen",
  DRG9: "DRG 9 - Verdauungsorgane bis 61",
  DRG10: "DRG 10 - Verdauungsorgane über 61",
  DRG11: "DRG 11 - Blinddarmerkrankungen",
  DRG12: "DRG 12 - Verletzungen",
  DRG13: "DRG 13 - Krankheit oberer Luftwege",
  DRG14: "DRG 14 - Kieferchirurgische Eingriffe",
  DRG15: "DRG 15 - Entbindung ohne OP",
  DRG16: "DRG 16 - Entbindung mit OP",
  DRG17: "DRG 17 - Weibliche Geschlechtsorgane"
}

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)
onActivated(initData)

// Bei Änderung eines DRG-Feldes wird der Wert direkt aktualisiert: 1 = ausgewählt, -1 = nicht gewählt
const updateDrg = (number: number, checked: boolean) => {
  leistung.value['DRG' + number] = checked ? 1 : -1
  store.updateLeistungsangebotInput({ ...leistung.value })
}

const saveToServer = async () => {
  store.updateLeistungsangebotInput({ ...leistung.value })
  await gameDataStore.saveToServer()
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