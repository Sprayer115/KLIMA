<template>
  <div class="container p-4">
    <h2 class="text-2xl font-bold mb-4">Forschung, Investition und ZGB</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Forschung in Grid -->
      <section class="section mb-4 border p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">Forschung (€)</h3>
        <div class="grid grid-cols-4 gap-4 text-center">
          <div></div>
          <div class="font-semibold">Innere Medizin</div>
          <div class="font-semibold">Chirurgie</div>
          <div class="font-semibold">Gynäkologie</div>
        </div>
        <div class="grid grid-cols-4 gap-4 mt-2 text-center">
          Sondermittel für Forschung:
          <Input
            id="forschung-innere"
            type="number"
            v-model.number="forschung.Innere"
            @update:model-value="updateForschung"
            class="p-1 border rounded"
          />
          <Input
            id="forschung-chir"
            type="number"
            v-model.number="forschung.Chir"
            @update:model-value="updateForschung"
            class="p-1 border rounded"
          />
          <Input
            id="forschung-gyn"
            type="number"
            v-model.number="forschung.Gyn"
            @update:model-value="updateForschung"
            class="p-1 border rounded"
          />
        </div>
      </section>

      <!-- Investition -->
      <section class="section mb-4 p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">Investition</h3>
        <table class="w-full">
          <tr>
            <td class="p-2">Diagnosegerät</td>
            <td class="p-2">Preis:</td>
            <td class="p-2">1500000€</td>
            <td class="p-2">
              <Select v-model="investition.Diagnose" @update:model-value="updateForschung">
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="btBeschaffen">Kaufen</SelectItem>
                    <SelectItem value="btNichtGeplant">Nicht Kaufen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </td>
          </tr>
          <tr>
            <td class="p-2">Operationsausrüstung</td>
            <td class="p-2">Preis:</td>
            <td class="p-2">330000€</td>
            <td class="p-2">
              <Select v-model="investition.Operationsbesteck" @update:model-value="updateForschung">
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="btBeschaffen">Kaufen</SelectItem>
                    <SelectItem value="btNichtGeplant">Nicht Kaufen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </td>
          </tr>
          <tr>
            <td class="p-2">Tablettsystem</td>
            <td class="p-2">Preis:</td>
            <td class="p-2">400000€</td>
            <td class="p-2">
              <Select v-model="investition.Tablettsystem" @update:model-value="updateForschung">
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="btBeschaffen">Kaufen</SelectItem>
                    <SelectItem value="btNichtGeplant">Nicht Kaufen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </td>
          </tr>
          <tr>
            <td class="p-2">Kieferchir. Ausrüstung</td>
            <td class="p-2">Preis:</td>
            <td class="p-2">700000€</td>
            <td class="p-2">
              <Select v-model="investition.Kieferchirurgie" @update:model-value="updateForschung">
                <SelectTrigger>
                  <SelectValue placeholder="Auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="btBeschaffen">Kaufen</SelectItem>
                    <SelectItem value="btNichtGeplant">Nicht Kaufen</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </td>
          </tr>
        </table>
      </section>

      <!-- ZGB -->
      <section class="section mb-4 border p-4 rounded">
        <h3 class="text-xl font-semibold mb-2">ZGB – Krankenhäuser</h3>
        <table class="table-auto mx-auto">
          <thead>
            <tr>
              <th class="p-4"></th>
              <th v-for="i in 10" :key="'header-' + i" class="p-4 text-center">G{{ i }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="p-4 font-semibold">Bisher</td>
              <td v-for="i in 10" :key="'bisher-'+ i" class="p-4 text-center">
                <input type="checkbox" :checked="zbg.bisher['G' + i] !== 0" disabled />
              </td>
            </tr>
            <tr>
              <td class="p-4 font-semibold">Jetzt</td>
              <td v-for="i in 10" :key="'jetzt-'+ i" class="p-4 text-center">
                <input
                  type="checkbox"
                  :id="'zgb-jetzt-' + i"
                  :checked="zbg.jetzt['G' + i] !== 0"
                  @change="(e) => { updateZgb(i, e.target.checked); updateForschung() }"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Statt submit wird saveToServer wie in GeneralInput.vue aufgerufen -->
      <Button @click="saveToServer" class="mt-4">Speichern</Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useForschungStore } from '@/stores/forschung'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const gameDataStore = useGameDataStore()
const store = useForschungStore()
const { forschung, investition, zbg } = storeToRefs(store)

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)
onActivated(initData)

const updateForschung = () => {
  store.updateForschungInput({
    forschung: { ...forschung.value },
    investition: investition.value,
    zbg: zbg.value,
  })
}

const handleSubmit = () => {
  updateForschung()
}

const updateZgb = (i: number, checked: boolean) => {
  zbg.value.jetzt['G' + i] = checked ? 1 : 0
}


const saveToServer = async () => {
  // Stell sicher, dass alle Änderungen in den Cache geschrieben wurden
  updateForschung()
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

