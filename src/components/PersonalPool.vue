<template>
  <div class="personal-pool">
    <h2 class="text-xl font-bold mb-4">Personal Pool</h2>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feld</TableHead>
          <TableHead v-for="dept in departments" :key="dept">
            {{ getDepartmentLabel(dept) }}
          </TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow
          v-for="(fieldName, field) in fields"
          :key="fieldName"
          class="even:bg-gray-50 dark:even:bg-stone-800"
        >
          <TableCell>{{ getFieldLabel(fieldName) }}</TableCell>
          <TableCell v-for="dept in departments" :key="dept">
            <div class="flex flex-col items-center">
              <span class="text-gray-700 dark:text-stone-300">
                {{ localPersonalPool.PoolingVerg[dept][fieldName] }}
              </span>
              <Input
                type="number"
                v-model.number="localPersonalPool.PoolingAkt[dept][fieldName]"
                @change="validateAndUpdate(`personalPool.PoolingAkt.${dept}.${fieldName}`, localPersonalPool.PoolingAkt[dept][fieldName])"
                :min="getMin(dept, fieldName)"
                :max="getMax(dept, fieldName)"
                class="mt-1 w-24 bg-white dark:bg-stone-950 text-gray-800 dark:text-stone-200 border-gray-300 dark:border-stone-600 rounded"
              />
            </div>
          </TableCell>
          <TableCell>
            <p class="text-gray-700 dark:text-stone-300">
              {{ calculateTotalVerg(fieldName) }}
            </p>
            <span :class="{'text-red-500': calculateTotal(fieldName) !== calculateTotalVerg(fieldName)}">
              {{ calculateTotal(fieldName) }}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    
    <div class="flex space-x-4 mt-4">
      <Button
        @click="handleSubmit"
        :disabled="!isValid"
        class="bg-blue-500 text-white dark:bg-blue-600 dark:text-stone-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Rest of the script remains exactly the same as your original code
const { toast } = useToast()

const store = inject('personalUndAbteilungenStore')

if (!store) {
  throw new Error('Store nicht gefunden! Stelle sicher, dass der Parent-Komponent den Store bereitstellt.')
}
const gameDataStore = useGameDataStore()
const { personalPool } = storeToRefs(store)

const localPersonalPool = ref(JSON.parse(JSON.stringify(personalPool.value)))
const isValid = ref(true)
const departments = ['Innere', 'Chir', 'Gyn']
const fields = ['Aerzte', 'Stationsschwestern', 'Krankenschwestern', 'Schwesternschuelerinnen']

// All your existing functions remain the same
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

const calculateTotalVerg = (fieldName: string) => {
  let total = 0
  departments.forEach(dept => {
    total += localPersonalPool.value.PoolingVerg[dept][fieldName] || 0
  })
  return total
}

const calculateTotal = (fieldName: string) => {
  let total = 0
  departments.forEach(dept => {
    total += localPersonalPool.value.PoolingAkt[dept][fieldName] || 0
  })
  return total
}

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
  localPersonalPool.value = JSON.parse(JSON.stringify(personalPool.value))
}

onActivated(initData)

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

const validateAndUpdate = (path: string, value: any) => {
  const keys = path.split('.')
  const poolType = keys[1]
  const dept = keys[2]
  const field = keys[3]

  const min = getMin(dept, field)
  const max = getMax(dept, field)

  const totalVerg = calculateTotalVerg(field)
  const totalAkt = calculateTotal(field)
  const difference = totalVerg - totalAkt

  if (difference !== 0) {
    const otherDepts = departments.filter(d => d !== dept)
    const numAdjust = otherDepts.length

    if (numAdjust > 0) {
      const adjustment = difference / numAdjust

      otherDepts.forEach(d => {
        let currentVal = localPersonalPool.value.PoolingAkt[d][field]
        let newVal = currentVal + adjustment

        const fieldMin = getMin(d, field)
        const fieldMax = getMax(d, field)

        if (newVal < fieldMin) {
          newVal = fieldMin
        } else if (newVal > fieldMax) {
          newVal = fieldMax
        }

        localPersonalPool.value.PoolingAkt[d][field] = Math.round(newVal)
      })

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

const updateStore = () => {
  store.updatePersonalUndAbteilungen(localPersonalPool.value)
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
</script>