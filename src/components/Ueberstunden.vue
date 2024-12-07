<template>
  <div v-if="localUeberstunden" class="flex space-x-6">
    <!-- Linke Spalte (70%) -->
    <div class="w-70 space-y-6">
      <!-- Überstunden für Internes Krankenhauspersonal in Tabelle -->
      <div class="border p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-4">Überstunden Internes Krankenhauspersonal</h3>
        <table class="min-w-full border-collapse">
          <thead>
            <tr>
              <th class="border px-4 py-2">Felder</th>
              <th v-for="deptName in getDepartmentNames()" :key="deptName" class="border px-4 py-2">
                {{ getDepartmentLabel(deptName) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in getFields()" :key="field" class="border-t">
              <td class="border px-4 py-2">{{ getFieldLabel(field) }}</td>
              <td v-for="deptName in getDepartmentNames()" :key="deptName" class="border px-4 py-2">
                <div class="flex items-center">
                  <Input
                    :id="`${deptName}-${field}`"
                    type="number"
                    v-model.number="localUeberstunden.UeIntern[deptName][field]"
                    @update:model-value="updateUeberstunden(`UeIntern.${deptName}.${field}`, $event)"
                    min="0"
                    max="100"
                    class="mt-1 w-20"
                  />
                  <span class="ml-2 text-sm text-gray-700">%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Überstunden für Funktionsbereichspersonal -->
      <div class="border p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-4">Überstunden Funktionsbereichspersonal</h3>
        <div class="flex flex-col space-y-2">
          <div
            v-for="(value, key) in localUeberstunden.UeFunk"
            :key="key"
            class="flex items-center space-x-2"
          >
            <Label :for="`ueFunk-${key}`">{{ getFieldLabel(key) }}</Label>
            <div class="flex items-center">
              <Input
                :id="`ueFunk-${key}`"
                type="number"
                :model-value="localUeberstunden.UeFunk[key]"
                @update:model-value="updateUeberstunden(`UeFunk.${key}`, $event)"
                min="0"
                max="100"
                class="mt-1 w-20"
              />
              <span class="ml-2 text-sm text-gray-700">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Überstunden für Zentralbereichspersonal -->
      <div class="border p-4 rounded-md">
        <h3 class="text-lg font-semibold mb-4">Überstunden Zentralbereichspersonal</h3>
        <div class="flex flex-col space-y-2">
          <div
            v-for="(value, key) in localUeberstunden.UeZentral"
            :key="key"
            class="flex items-center space-x-2"
          >
            <Label :for="`ueZentral-${key}`">{{ getFieldLabel(key) }}</Label>
            <div class="flex items-center">
              <Input
                :id="`ueZentral-${key}`"
                type="number"
                :model-value="localUeberstunden.UeZentral[key]"
                @update:model-value="updateUeberstunden(`UeZentral.${key}`, $event)"
                min="0"
                max="100"
                class="mt-1 w-20"
              />
              <span class="ml-2 text-sm text-gray-700">%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex space-x-4">
        <Button @click="handleSubmit">Speichern</Button>
      </div>
    </div>

    <!-- Rechte Spalte (30%) -->
    <div class="w-30 space-y-6">
      <!-- Weitere Abschnitte nach Bedarf -->
    </div>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onActivated } from 'vue'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const store = inject('personalUndAbteilungenStore')

if (!store) {
    throw new Error('Store nicht gefunden! Stelle sicher, dass der Parent-Komponent den Store bereitstellt.')
}

const gameDataStore = useGameDataStore()
const { ueberstunden } = storeToRefs(store)

const defaultUeberstunden = {
  UeIntern: {
      Innere: {
        Aerzte: 0,
        Stationsschwestern: 0,
        Krankenschwestern: 0,
        Schwesternschuelerinnen: 0
      },
      Chir: {
        Aerzte: 0,
        Stationsschwestern: 0,
        Krankenschwestern: 0,
        Schwesternschuelerinnen: 0
      },
      Gyn: {
        Aerzte: 0,
        Stationsschwestern: 0,
        Krankenschwestern: 0,
        Schwesternschuelerinnen: 0
      }
  },
  UeFunk: {
      Labor: 0,
      Op: 0,
      Sonstige: 0
  },
  UeZentral: {
      Zentral: 0
  }
}

const localUeberstunden = ref(JSON.parse(JSON.stringify(ueberstunden.value)) || defaultUeberstunden)

const getDepartmentNames = () => {
  return Object.keys(defaultUeberstunden.UeIntern)
}

const getFields = () => {
  return Object.keys(defaultUeberstunden.UeIntern[getDepartmentNames()[0]])
}

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

const initData = async () => {
    store.initialize()
    await gameDataStore.load()
    localUeberstunden.value = JSON.parse(JSON.stringify(ueberstunden.value)) || defaultUeberstunden
    console.log("Init Data:", localUeberstunden.value)
}

onActivated(initData)

const handleSubmit = () => {
  saveToServer()
}

const saveToServer = async () => {
    await gameDataStore.saveToServer()
}

const updateUeberstunden = (path: string, value: any) => {
    const keys = path.split('.')
    let obj: any = localUeberstunden.value

    for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in obj)) {
            obj[keys[i]] = {}
        }
        obj = obj[keys[i]]
    }

    const field = keys[keys.length - 1]

    if (typeof value === 'number') {
        if (value < 0) {
            toast({ 
                title: 'Ungültiger Wert', 
                description: `Wert für ${path} kann nicht negativ sein.`, 
                variant: 'destructive' 
            })
            value = 0
        } else if (value > 100) {
            toast({ 
                title: 'Ungültiger Wert', 
                description: `Wert für ${path} darf höchstens 100% sein.`, 
                variant: 'destructive' 
            })
            value = 100
        }
    }

    obj[field] = value
    store.updatePersonalUndAbteilungen(localUeberstunden.value)
}
</script>

<style scoped>
.border {
  border: 1px thin gray;
}
.w-70 {
  width: 70%;
}
.w-30 {
  width: 30%;
}
table {
  width: 100%;
  border: 1px hidden!important;
}
th, td {
  text-align: left;
}
.flex.items-center {
  display: flex;
  align-items: center;
}
</style>