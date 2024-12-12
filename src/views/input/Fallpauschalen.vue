<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold mb-6 dark:text-white">Fallpauschalen</h1>
    <Table class="w-full mt-4">
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px] dark:text-slate-300">DFK</TableHead>
          <TableHead class="dark:text-slate-300">Bezeichnung</TableHead>
          <TableHead class="dark:text-slate-300 text-right">Beantrag (€)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-for="(group, groupIndex) in groupedCategories" :key="groupIndex">
          <TableRow class="bg-gray-100 dark:bg-slate-700">
            <TableCell colspan="3" class="font-semibold dark:text-white">{{ group.name }}</TableCell>
          </TableRow>
          <TableRow v-for="(category, index) in group.categories" :key="category.id" class="border-t dark:border-slate-700">
            <TableCell class="dark:text-slate-300">DFK {{ category.id }}</TableCell>
            <TableCell class="dark:text-slate-300">{{ category.label }}</TableCell>
            <TableCell class="text-right dark:text-slate-300">
              <div class="flex items-center justify-end">
                <input
                  type="number"
                  v-model.number="fallpauschalen.fallpauschalen[category.id - 1]"
                  @change="handleChange(category.id - 1, $event.target.value)"
                  min="0"
                  max="15000"
                  class="w-24 p-1 border rounded dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="ml-2">€</span>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    <div class="mt-6 flex justify-end">
      <Button @click="saveToServer">
        Speichern
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button' // Importiere die Button-Komponente von Shadcn
import { useFallpauschalenStore } from '@/stores/fallpauschalen'
import { useGameDataStore } from '@/stores/data'
import { onMounted, ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()  
const gameDataStore = useGameDataStore()

const fallpauschalen = useFallpauschalenStore()

const medicalCategories = [
  "Neubildungen (innere Medizin)",
  "Diabetes",
  "Kreislauferkrankungen bis 61",
  "Kreislauferkrankungen über 61",
  "Verdauungsorgane bis 61",
  "Verdauungsorgane über 61",
  "Kreislauferkrankungen",
  "Neubildungen (Chirurgie)",
  "Verdauungsorgane bis 61",
  "Verdauungsorgane über 61",
  "Blinddarmerkrankungen",
  "Verletzungen",
  "Krankheit oberer Luftwege",
  "Kieferchirurgische Eingriffe",
  "Entbindung ohne OP",
  "Entbindung mit OP",
  "Weibliche Geschlechtsorgane"
]

const groupedCategories = [
  {
    name: "Innere Medizin",
    categories: medicalCategories.slice(0, 6).map((label, index) => ({
      id: index + 1,
      label
    }))
  },
  {
    name: "Chirurgie",
    categories: medicalCategories.slice(6, 14).map((label, index) => ({
      id: index + 7,
      label
    }))
  },
  {
    name: "Gynäkologie",
    categories: medicalCategories.slice(14).map((label, index) => ({
      id: index + 15,
      label
    }))
  }
]

const initData = async () => {
  fallpauschalen.initialize()
  await gameDataStore.load()
}

const saveToServer = async () => {
  await gameDataStore.saveToServer()
}

const handleChange = (index: number, value: string) => {
  let numValue = Number(value)
  
  if (numValue < 0) {
    numValue = 0
    toast({
      title: 'Fehler',
      description: 'Der Wert war zu niedrig und wurde auf 0 gesetzt.',
      variant: 'destructive'
    })
  } else if (numValue > 15000) {
    numValue = 15000
    toast({
      title: 'Fehler',
      description: 'Der Wert war zu hoch und wurde auf 15000 gesetzt.',
      variant: 'destructive'
    })
  }
  fallpauschalen.fallpauschalen[index] = numValue

  fallpauschalen.setFallpauschale(index, numValue)
}
onMounted(initData)
</script>

<style scoped>
/* Zusätzliche Anpassungen falls erforderlich */
table {
  border-collapse: collapse;
}
th, td {
  text-align: left;
}
</style>