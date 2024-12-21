<template>
  <div class="container max-w-[1800px] mx-auto p-6">
    <div class="grid grid-cols-3 gap-6">
      <!-- Innere Medizin -->
      <Card>
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
                <TableHead>Beantragt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(category, index) in medicalCategories.slice(0, 6)" :key="index">
                <TableCell>DFK {{ index + 1 }}</TableCell>
                <TableCell>{{ category }}</TableCell>
                <TableCell class="text-gray-500">kein Wert</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Input
                      :id="'innere-' + index"
                      v-model="fallpauschalen[index]"
                      type="number"
                      class="w-32"
                      step="1"
                      min="0"
                      max="15000"
                    />
                    <span class="text-sm text-muted-foreground">€</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Chirurgie -->
      <Card>
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
                <TableHead>Beantragt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(category, index) in medicalCategories.slice(6, 13)" :key="index">
                <TableCell>DFK {{ index + 7 }}</TableCell>
                <TableCell>{{ category }}</TableCell>
                <TableCell class="text-gray-500">kein Wert</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Input
                      :id="'chirurgie-' + index"
                      v-model="fallpauschalen[index + 6]"
                      type="number"
                      class="w-32"
                      step="1"
                      min="0"
                      max="15000"
                    />
                    <span class="text-sm text-muted-foreground">€</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <!-- Gynäkologie -->
      <Card>
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
                <TableHead>Beantragt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(category, index) in medicalCategories.slice(13, 17)" :key="index">
                <TableCell>DFK {{ index + 14 }}</TableCell>
                <TableCell>{{ category }}</TableCell>
                <TableCell class="text-gray-500">kein Wert</TableCell>
                <TableCell>
                  <div class="flex items-center gap-2">
                    <Input
                      :id="'gynaekologie-' + index"
                      v-model="fallpauschalen[index + 13]"
                      type="number"
                      class="w-32"
                      step="1"
                      min="0"
                      max="15000"
                    />
                    <span class="text-sm text-muted-foreground">€</span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>

    <div class="flex justify-end mt-6">
      <Button @click="saveToServer" :disabled="!isValid">Speichern</Button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onActivated, watch } from 'vue'
import { useFallpauschalenStore } from '@/stores/fallpauschalen'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const store = useFallpauschalenStore()
const gameDataStore = useGameDataStore()
const { fallpauschalen, isValid } = storeToRefs(store)

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

const saveToServer = async () => {
  await gameDataStore.saveToServer()
}

onMounted(() => {
  store.initialize()
})

onActivated(() => {
  store.initialize()
})

// Überwache Änderungen an fallpauschalen
watch(fallpauschalen, (newValue) => {
  newValue.forEach((value, index) => {
    if (value < 0) {
      fallpauschalen.value[index] = 0
    } else if (value > 15000) {
      fallpauschalen.value[index] = 15000
    }
  })

  if (isValid.value) {
    console.log("updating module fallpauschalen", newValue)
    gameDataStore.updateModule('fallpauschalen', newValue)
  } else {
    console.error("Invalid values detected")
  }
}, { deep: true })
</script>

<style lang="postcss" scoped>
input[type="number"] {
  @apply rounded border-slate-300 shadow-sm focus:ring-slate-400 dark:border-slate-600;
}
</style>