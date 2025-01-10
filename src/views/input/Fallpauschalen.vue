<template>
  <div class="container mx-auto p-4 space-y-6">
    <h1 class="text-3xl font-bold mb-6">Fallpauschalen Eingabe</h1>

    <!-- Innere Medizin Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>Innere Medizin</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DFK</TableHead>
              <TableHead>Bezeichnung</TableHead>
              <TableHead>Bewilligt</TableHead>
              <TableHead class="text-right">Beantragt (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="dfk in innereMedizin" :key="dfk.id">
              <TableCell class="font-medium">
                {{ dfk.name }}
              </TableCell>
              <TableCell>{{ dfk.bezeichnung }}</TableCell>
              <TableCell>kein Wert</TableCell>
              <TableCell class="flex justify-end">
                <Input 
                  type="number" 
                  v-model.number="dfk.beantragt" 
                  @change="updateBeantragt(dfk.id, dfk.beantragt)" 
                  :max="15000"
                  step="0.01"
                  class="w-32"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Chirurgie Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>Chirurgie</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DFK</TableHead>
              <TableHead>Bezeichnung</TableHead>
              <TableHead>Bewilligt</TableHead>
              <TableHead class="text-right">Beantragt (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="dfk in chirurgie" :key="dfk.id">
              <TableCell class="font-medium">
                {{ dfk.name }}
              </TableCell>
              <TableCell>{{ dfk.bezeichnung }}</TableCell>
              <TableCell>kein Wert</TableCell>
              <TableCell class="flex justify-end">
                <Input 
                  type="number" 
                  v-model.number="dfk.beantragt" 
                  @change="updateBeantragt(dfk.id, dfk.beantragt)" 
                  :max="15000"
                  step="0.01"
                  class="w-32"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Gynäkologie Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>Gynäkologie</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DFK</TableHead>
              <TableHead>Bezeichnung</TableHead>
              <TableHead>Bewilligt</TableHead>
              <TableHead class="text-right">Beantragt (€)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="dfk in gynäkologie" :key="dfk.id">
              <TableCell class="font-medium">
                {{ dfk.name }}
              </TableCell>
              <TableCell>{{ dfk.bezeichnung }}</TableCell>
              <TableCell>kein Wert</TableCell>
              <TableCell class="flex justify-end">
                <Input 
                  type="number" 
                  v-model.number="dfk.beantragt" 
                  @change="updateBeantragt(dfk.id, dfk.beantragt)" 
                  :max="15000"
                  step="0.01"
                  class="w-32"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Button @click="saveToServer" :disabled="!isValid" class="mt-6">Speichern</Button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useFallpauschalenStore } from '@/stores/Fallpauschalen'
import { useGameDataStore } from '@/stores/data'
import { useToast } from '@/components/ui/toast/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'

const fallpauschalenStore = useFallpauschalenStore()
const gameDataStore = useGameDataStore()

const { toast } = useToast()

const initData = async () => {
  fallpauschalenStore.initialize()
  await gameDataStore.load()
}

onMounted(initData)

// Define medical categories
const medicalCategories = [
  "Neubildungen (innere Medizin)",       // DRG1
  "Diabetes",                            // DRG2
  "Kreislauferkrankungen bis 61",        // DRG3
  "Kreislauferkrankungen über 61",       // DRG4
  "Verdauungsorgane bis 61",             // DRG5
  "Verdauungsorgane über 61",            // DRG6
  "Kreislauferkrankungen",               // DRG7
  "Neubildungen (Chirurgie)",            // DRG8
  "Verdauungsorgane bis 61",             // DRG9
  "Verdauungsorgane über 61",            // DRG10
  "Blinddarmerkrankungen",               // DRG11
  "Verletzungen",                        // DRG12
  "Krankheit oberer Luftwege",           // DRG13
  "Kieferchirurgische Eingriffe",        // DRG14
  "Entbindung ohne OP",                  // DRG15
  "Entbindung mit OP",                   // DRG16
  "Weibliche Geschlechtsorgane"          // DRG17
]

// Prepare data groups
const innereMedizin = computed(() => {
  return [1,2,3,4,5,6].map(num => ({
    id: `DRG${num}`,
    name: `DFK ${num}`,
    bezeichnung: medicalCategories[num - 1],
    beantragt: fallpauschalenStore.fallpauschalen[`DRG${num}`]
  }))
})

const chirurgie = computed(() => {
  return [7,8,9,10,11,12,13,14].map(num => ({
    id: `DRG${num}`,
    name: `DFK ${num}`,
    bezeichnung: medicalCategories[num - 1],
    beantragt: fallpauschalenStore.fallpauschalen[`DRG${num}`]
  }))
})

const gynäkologie = computed(() => {
  return [15,16,17].map(num => ({
    id: `DRG${num}`,
    name: `DFK ${num}`,
    bezeichnung: medicalCategories[num - 1],
    beantragt: fallpauschalenStore.fallpauschalen[`DRG${num}`]
  }))
})

// Update function
const updateBeantragt = (drg, value) => {
  fallpauschalenStore.setField(drg, value)
}

// Save to server
const saveToServer = () => {
  if (fallpauschalenStore.isValid) {
    gameDataStore.saveToServer()
    toast({ 
      title: 'Erfolg', 
      description: 'Fallpauschalen wurden erfolgreich gespeichert.', 
      variant: 'success' 
    })
  } else {
    toast({ 
      title: 'Fehler', 
      description: 'Bitte überprüfen Sie die eingegebenen Werte.', 
      variant: 'destructive' 
    })
  }
}

// Validation
const isValid = computed(() => {
  return fallpauschalenStore.isValid
})
</script>

<style scoped>
/* Add any component-specific styles here */
.table th, .table td {
  padding: 8px;
  text-align: left;
}
</style>
