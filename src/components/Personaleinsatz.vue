<template>
  <div class="flex space-x-6">
      <!-- Linke Spalte (70%) -->
      <div class="w-70 space-y-6">
        <!-- Personalplanung für Abteilungen -->
        <div class="border p-4 rounded-md">
          <h3 class="text-lg font-semibold mb-4">Personalplanung für Abteilungen</h3>
          <div v-for="(dept, deptName) in localPersEinsatz.PersAbt" :key="deptName" class="mb-4">
            <h4 class="font-medium">{{ getDepartmentLabel(deptName) }}</h4>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div v-for="(value, key) in dept" :key="key" class="flex flex-col">
                <Label :for="`${deptName}-${key}`">{{ getFieldLabel(key) }}</Label>
                <Input
                  :id="`${deptName}-${key}`"
                  type="number"
                  :model-value="localPersEinsatz.PersAbt[deptName][key]"
                  @update:model-value="updatePersonalUndAbteilungen(`PersAbt.${deptName}.${key}`, $event)"
                  :min="getMin(deptName, key)"
                  :max="getMax(deptName, key)"
                  class="mt-1 w-24"
                />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Abteilungsplanung Section -->
        <div class="border p-4 rounded-md">
          <h3 class="text-lg font-semibold mb-4">Abteilungsplanung</h3>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="(value, key) in localPersEinsatz.Abtplanung" :key="key" class="flex flex-col">
              <Label :for="`abtplanung-${key}`">{{ getGoalLabel(key) }}</Label>
              <Select
                :model-value="value.toString()"
                @update:model-value="updatePersonalUndAbteilungen(`Abtplanung.${key}`, $event)"
                class="mt-1 w-full"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Optionen</SelectLabel>
                    <SelectItem
                      v-for="n in getMaxForSelect(key)"
                      :key="n"
                      :value="n.toString()"
                      
                    >
                      {{ n }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
  
        <!-- Personalentscheidungen -->
        <div class="border p-4 rounded-md">
          <h3 class="text-lg font-semibold mb-4">Personalentscheidungen</h3>
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              id="belegarzt"
              :checked="localPersEinsatz.PEnt.Belegarzt"
              @change="updatePersonalUndAbteilungen('PEnt.Belegarzt', $event.target.checked)"
              class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label for="belegarzt">Belegarzt</label>
  
            <input
              type="checkbox"
              id="sozialarbeiter"
              :checked="localPersEinsatz.PEnt.Sozialarbeiter"
              @change="updatePersonalUndAbteilungen('PEnt.Sozialarbeiter', $event.target.checked)"
              class="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label for="sozialarbeiter">Sozialarbeiter</label>
          </div>
        </div>
      </div>
  
      <!-- Rechte Spalte (30%) -->
      <div class="w-30 space-y-6">
        <!-- Personalveränderungen in den Zentralbereichen -->
        <div class="border p-4 rounded-md">
          <h3 class="text-lg font-semibold mb-4">Personalveränderungen in den Zentralbereichen</h3>
          <div class="flex flex-col space-y-2">
            <div v-for="(value, key) in localPersEinsatz.PVeraenZentral" :key="key" class="flex items-center space-x-2">
              <Label :for="`pvZentral-${key}`">{{ getFieldLabel(key) }}</Label>
              <div class="flex items-center">
                <Input
                  :id="`pvZentral-${key}`"
                  type="number"
                  :model-value="localPersEinsatz.PVeraenZentral[key]"
                  @update:model-value="updatePersonalUndAbteilungen(`PVeraenZentral.${key}`, $event)"
                  min="0"
                  max="100"
                  class="mt-1 w-20"
                />
                <span class="ml-2 text-sm text-gray-700">%</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Personalveränderungen in den Funktionsbereichen -->
        <div class="border p-4 rounded-md">
          <h3 class="text-lg font-semibold mb-4">Personalveränderungen in den Funktionsbereichen</h3>
          <div class="flex flex-col space-y-2">
            <div v-for="(value, key) in localPersEinsatz.PVeraenFunk" :key="key" class="flex items-center space-x-2">
              <Label :for="`pvFunk-${key}`">{{ getFieldLabel(key) }}</Label>
              <div class="flex items-center">
                <Input
                  :id="`pvFunk-${key}`"
                  type="number"
                  :model-value="localPersEinsatz.PVeraenFunk[key]"
                  @update:model-value="updatePersonalUndAbteilungen(`PVeraenFunk.${key}`, $event)"
                  min="0"
                  max="100"
                  class="mt-1 w-20"
                />
                <span class="ml-2 text-sm text-gray-700">%</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Save Buttons -->
        <div class="flex space-x-4">
          <Button @click="handleSubmit">Speichern</Button>
        </div>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
  import { ref, inject, onMounted, onActivated } from 'vue'
  import { usePersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'
  import { useGameDataStore } from '@/stores/data'
  import { storeToRefs } from 'pinia'
  import { Label } from '@/components/ui/label'
  import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { useToast } from '@/components/ui/toast/use-toast'

  const { toast } = useToast()
    // Inject the store
const store = inject('personalUndAbteilungenStore')

if (!store) {
    throw new Error('Store nicht gefunden! Stelle sicher, dass der Parent-Komponent den Store bereitstellt.')
}
const gameDataStore = useGameDataStore()
const { persEinsatz } = storeToRefs(store)

// Local state mirroring the store
const localPersEinsatz = ref(JSON.parse(JSON.stringify(persEinsatz.value)))

// Helper functions for labels and limits
const getDepartmentLabel = (deptName: string) => {
const labels: Record<string, string> = {
    Innere: 'Innere Medizin',
    Chir: 'Chirurgie',
    Gyn: 'Gynäkologie',
}
return labels[deptName] || deptName
}

const getFieldLabel = (field: string) => {
const labels: Record<string, string> = {
    Aerzte: 'Ärzte',
    Stationsschwestern: 'Stationsschwestern',
    Krankenschwestern: 'Krankenschwestern',
    Schwesternschuelerinnen: 'Schülerinnen',
}
return labels[field] || field
}

const getMin = (dept: string, field: string) => {
const minValues: Record<string, Record<string, number>> = {
    Innere: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
    Chir: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
    Gyn: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
}
return minValues[dept]?.[field] || 0
}

const getMax = (dept: string, field: string) => {
const maxValues: Record<string, Record<string, number>> = {
    Innere: { Aerzte: 100, Stationsschwestern: 30, Krankenschwestern: 200, Schwesternschuelerinnen: 50 },
    Chir: { Aerzte: 100, Stationsschwestern: 30, Krankenschwestern: 200, Schwesternschuelerinnen: 50 },
    Gyn: { Aerzte: 80, Stationsschwestern: 25, Krankenschwestern: 150, Schwesternschuelerinnen: 40 },
}
return maxValues[dept]?.[field] || 100
}

// Computed properties for Abtplanung select
const abtplanungComputed = {
Innere: ref(localPersEinsatz.value.Abtplanung.Innere.toString()),
Chir: ref(localPersEinsatz.value.Abtplanung.Chir.toString()),
Gyn: ref(localPersEinsatz.value.Abtplanung.Gyn.toString()),
}

// Initialize local state from store
const initData = async () => {
    store.initialize()
    await gameDataStore.load()
    localPersEinsatz.value = JSON.parse(JSON.stringify(persEinsatz.value))
}

// Verwenden Sie onActivated, um initData aufzurufen, wenn die Komponente aktiviert wird
onActivated(initData)

// Handle form submission
const handleSubmit = () => {
saveToServer();
}

// Save to server
const saveToServer = async () => {
    await gameDataStore.saveToServer()
}

// General update function for all fields
const updatePersonalUndAbteilungen = (path: string, value: any) => {
    const keys = path.split('.')
    let obj: any = localPersEinsatz.value

    for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) {
        obj[keys[i]] = {}
        }
        obj = obj[keys[i]]
    }

    const field = keys[keys.length - 1]
    const dept = keys[1] // Annahme: path beginnt mit 'PersAbt'

    // Bestimme min und max Werte
    const min = getMin(dept, field)
    const max = getMax(dept, field)

    // Validierung des Wertes
    if (typeof value === 'number') {
        if (value < min) {
        toast({ 
            title: 'Ungültiger Wert', 
            description: `Wert für ${path} ist zu niedrig. Minimaler Wert ist ${min}.`, 
            variant: 'destructive' 
        })
        value = min
        } else if (value > max) {
        toast({ 
            title: 'Ungültiger Wert', 
            description: `Wert für ${path} ist zu hoch. Maximaler Wert ist ${max}.`, 
            variant: 'destructive' 
        })
        value = max
        }
    }

    // Setze den validierten Wert
    obj[field] = value

    // Aktualisiere den Store
    store.updatePersonalUndAbteilungen(localPersEinsatz.value)
}

const getGoalLabel = (key: string) => {
const labels: Record<string, string> = {
    Innere: 'Innere Medizin',
    Chir: 'Chirurgie',
    Gyn: 'Gynäkologie',
    // Weitere Labels nach Bedarf hinzufügen
}
return labels[key] || key
}
const getMaxForSelect = (key: string) => {
    const labels: Record<string, number> = {
    Innere: 6,
    Chir: 7,
    Gyn: 3,
    // Weitere Labels nach Bedarf hinzufügen
    }
    return labels[key] || key
}
</script>

<style scoped>
.border {
border: 1px solid #e2e8f0;
}
.w-70 {
width: 70%;
}
.w-30 {
width: 30%;
}
</style>