<template>
  <div class="personal-pool">
    <h2 class="text-xl font-bold mb-4">Personal Pool</h2>
    <!-- Anzeige und Verwaltung des Personalpools als Tabelle -->
    <table class="min-w-full border-collapse">
      <thead>
        <tr>
          <th class="border px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            Feld
          </th>
          <th
            v-for="dept in departments"
            :key="dept"
            class="border px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {{ getDepartmentLabel(dept) }}
          </th>
          <th class="border px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(fieldName, field) in fields"
          :key="fieldName"
          class="even:bg-gray-50 dark:even:bg-gray-800"
        >
          <td class="border px-4 py-2 text-gray-800 dark:text-gray-200">
            {{ getFieldLabel(fieldName) }}
          </td>
          <td v-for="dept in departments" :key="dept" class="border px-4 py-2">
            <div class="flex flex-col items-center">
              <span class="text-gray-700 dark:text-gray-300">
                {{ localPersonalPool.PoolingVerg[dept][fieldName] }}
              </span>
              <Input
                type="number"
                v-model.number="localPersonalPool.PoolingAkt[dept][fieldName]"
                @change="validateAndUpdate(`personalPool.PoolingAkt.${dept}.${fieldName}`, localPersonalPool.PoolingAkt[dept][fieldName])"
                :min="getMin(dept, fieldName)"
                :max="getMax(dept, fieldName)"
                class="mt-1 w-24 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded"
              />
            </div>
          </td>
          <td class="border px-4 py-2 text-center text-gray-800 dark:text-gray-200">
            <p class="text-gray-700 dark:text-gray-300">
              {{ calculateTotalVerg(fieldName) }} </p>
            <span :class="{'text-red-500': calculateTotal(fieldName) !== calculateTotalVerg(fieldName)}">
                {{ calculateTotal(fieldName) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Save Buttons -->
    <div class="flex space-x-4 mt-4">
      <Button
        @click="handleSubmit"
        :disabled="!isValid"
        class="bg-blue-500 text-white dark:bg-blue-600 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Speichern
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onActivated } from 'vue'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import type { PersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'



// Initializiere Toast für Benachrichtigungen
const { toast } = useToast()

// Zugriff auf die Stores
const store = inject('personalUndAbteilungenStore')

if (!store) {
  throw new Error('Store nicht gefunden! Stelle sicher, dass der Parent-Komponent den Store bereitstellt.')
}
const gameDataStore = useGameDataStore()
const { personalPool } = storeToRefs(store)

// Lokaler Zustand, der den Store spiegelt
const localPersonalPool = ref(JSON.parse(JSON.stringify(personalPool.value)))

// Reactive Variable zur Überprüfung der Validität
const isValid = ref(true)

// Helper Arrays
const departments = ['Innere', 'Chir', 'Gyn']
const fields = ['Aerzte', 'Stationsschwestern', 'Krankenschwestern', 'Schwesternschuelerinnen']

// Helper Funktionen für Labels und Limits
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

// Berechnet die Gesamtsumme der PoolingVerg-Werte für ein Feld
const calculateTotalVerg = (fieldName: string) => {
  let total = 0
  departments.forEach(dept => {
    total += localPersonalPool.value.PoolingVerg[dept][fieldName] || 0
  })
  return total
}

// Berechnet die Gesamtsumme der PoolingAkt-Werte für ein Feld
const calculateTotal = (fieldName: string) => {
  let total = 0
  departments.forEach(dept => {
    total += localPersonalPool.value.PoolingAkt[dept][fieldName] || 0
  })
  return total
}

// Initialisiert den lokalen Zustand aus dem Store
const initData = async () => {
store.initialize()
await gameDataStore.load()
localPersonalPool.value = JSON.parse(JSON.stringify(personalPool.value))
}
// Verwenden Sie onActivated, um initData aufzurufen, wenn die Komponente aktiviert wird
onActivated(initData)

// Verarbeitet das Speichern des lokalen Zustands in den Store
const handleSubmit = () => {
  if (isValid.value) {
    toast({
      title: 'Erfolg',
      description: 'Personal Pool erfolgreich aktualisiert.',
      variant: 'success',
    })
  } else {
    toast({
      title: 'Fehler',
      description: 'Bitte beheben Sie die Fehler, bevor Sie speichern.',
      variant: 'destructive',
    })
  }
  saveToServer()
}

// Speichert die Daten auf dem Server
const saveToServer = async () => {
  if (isValid.value) {
    console.log('Saving to server...')
    await gameDataStore.saveToServer()
    toast({
      title: 'Erfolg',
      description: 'Daten erfolgreich auf dem Server gespeichert.',
      variant: 'success',
    })
  } else {
    toast({
      title: 'Fehler',
      description: 'Bitte beheben Sie die Fehler, bevor Sie speichern.',
      variant: 'destructive',
    })
  }
}

// Allgemeine Update-Funktion mit Validierung und konsistenter Gesamtsumme
const validateAndUpdate = (path: string, value: any) => {
  const keys = path.split('.')
  const poolType = keys[1] // 'PoolingAkt'
  const dept = keys[2]
  const field = keys[3]

  const min = getMin(dept, field)
  const max = getMax(dept, field)


  // Berechne die Differenz, um die Gesamtsumme konsistent zu halten
  const totalVerg = calculateTotalVerg(field)
  const totalAkt = calculateTotal(field)
  const difference = totalVerg - totalAkt

  if (difference !== 0) {
    // Verteile die Differenz auf andere Abteilungen
    const otherDepts = departments.filter(d => d !== dept)
    const numAdjust = otherDepts.length

    if (numAdjust > 0) {
      const adjustment = difference / numAdjust

      otherDepts.forEach(d => {
        let currentVal = localPersonalPool.value.PoolingAkt[d][field]
        let newVal = currentVal + adjustment

        // Stelle sicher, dass der neue Wert innerhalb der Grenzen liegt
        const fieldMin = getMin(d, field)
        const fieldMax = getMax(d, field)

        if (newVal < fieldMin) {
          newVal = fieldMin
        } else if (newVal > fieldMax) {
          newVal = fieldMax
        }

        // Runde auf die nächste Ganzzahl, falls notwendig
        localPersonalPool.value.PoolingAkt[d][field] = Math.round(newVal)
      })

      // Rekalkuliere die Gesamtsumme nach der Anpassung
      const updatedTotalAkt = calculateTotal(field)
      if (updatedTotalAkt !== totalVerg) {
        isValid.value = false
        toast({ 
          title: 'Warnung', 
          description: `Die PoolingAkt-Werte konnten nicht vollständig angepasst werden, um die Gesamtzahl von ${totalVerg} in ${getFieldLabel(field)} zu erreichen.`,
          variant: 'destructive' 
        })
      } else {
        isValid.value = true
      }
    } else {
      isValid.value = false
      toast({ 
        title: 'Warnung', 
        description: `Keine weiteren Abteilungen zum Anpassen, um die Gesamtzahl von ${totalVerg} in ${getFieldLabel(field)} zu erreichen.`,
        variant: 'destructive' 
      })
    }
  } else {
    isValid.value = true
  }
  if(isValid.value){
    updateStore()
  }
}

// Aktualisiert den Store mit dem lokalen Zustand
const updateStore = () => {
  store.updatePersonalUndAbteilungen(localPersonalPool.value )
}

// Definiert die minimalen Grenzwerte für jedes Feld
const getMin = (dept: string, field: string) => {
  const minValues: Record<string, Record<string, number>> = {
    Innere: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
    Chir: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
    Gyn: { Aerzte: 1, Stationsschwestern: 1, Krankenschwestern: 1, Schwesternschuelerinnen: 1 },
  }
  return minValues[dept]?.[field] || 0
}

// Definiert die maximalen Grenzwerte für jedes Feld
const getMax = (dept: string, field: string) => {
  const maxValues: Record<string, Record<string, number>> = {
    Innere: { Aerzte: 100, Stationsschwestern: 30, Krankenschwestern: 200, Schwesternschuelerinnen: 50 },
    Chir: { Aerzte: 100, Stationsschwestern: 30, Krankenschwestern: 200, Schwesternschuelerinnen: 50 },
    Gyn: { Aerzte: 80, Stationsschwestern: 25, Krankenschwestern: 150, Schwesternschuelerinnen: 40 },
  }
  return maxValues[dept]?.[field] || 100
}
</script>

<style scoped>
.personal-pool {
  /* Allgemeine Stile */
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
}

th {
  background-color: #edf2f7; /* Light mode header */
  color: #2d3748;
}

@media (prefers-color-scheme: dark) {
  th {
    background-color: #2d3748; /* Dark mode header */
    color: #edf2f7;
  }

  td {
    background-color: #4a5568; /* Dark mode cells */
    color: #edf2f7;
    border-color: #2d3748;
  }

  tr.even {
    background-color: #2d3748; /* Dark mode even rows */
  }
}

@media (prefers-color-scheme: light) {
  tr.even {
    background-color: #f7fafc; /* Light mode even rows */
  }

  td {
    background-color: #ffffff; /* Light mode cells */
    color: #2d3748;
    border-color: #e2e8f0;
  }
}

input[type="number"] {
  /* Gemeinsame Stile für Input-Felder */
}

button {
  /* Gemeinsame Stile für Buttons */
}
</style>