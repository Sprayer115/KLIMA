<template>
  <div class="container max-w-[1800px] mx-auto p-6">
    <div class="grid grid-cols-2 gap-6">
      <!-- Allgemeine Entscheidungen -->
      <Card>
        <CardHeader>
          <CardTitle>Allgemeine Entscheidungen</CardTitle>
        </CardHeader>
        <CardContent class="grid gap-6">
          <!-- Notfallkapazität -->
          <div class="grid grid-cols-[300px_1fr] items-center gap-4">
            <Label for="notfallkap">Notfallkapazität</Label>
            <div class="flex items-center gap-2">
              <Input
                id="notfallkap"
                v-model="generalInput.notfallkap"
                type="number"
                class="w-32"
                step="0.1"
                min="0"
                max="100"
              />
              <span class="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          <!-- Checkboxen -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="weVerlaengern"
                v-model="generalInput.weVerlaengern"
                class="h-4 w-4"
                :true-value="1"
                :false-value="-1"
              />
              <Label for="weVerlaengern">Aufenthaltsdauer der Patienten über das Wochenende verlängern</Label>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="weAufnehmen"
                v-model="generalInput.weAufnehmen"
                class="h-4 w-4"
                :true-value="1"
                :false-value="0"
              />
              <Label for="weAufnehmen">Patienten am Wochenende aufnehmen und behandeln</Label>
            </div>

            <div class="flex items-center gap-2">
              <input
                type="checkbox"
                id="qualisicherung"
                v-model="generalInput.qualisicherung"
                class="h-4 w-4"
                :true-value="1"
                :false-value="0"
              />
              <Label for="qualisicherung">Maßnahmen zur Qualitätssicherung vornehmen?</Label>
            </div>
          </div>

          <!-- Öffentlichkeitsarbeit -->
          <div class="grid grid-cols-[300px_1fr] items-center gap-4">
            <Label for="oeffentlichkeitsarbeit">Welcher Betrag soll für Öffentlichkeitsarbeit ausgegeben werden?</Label>
            <div class="flex items-center gap-2">
              <Input
                id="oeffentlichkeitsarbeit"
                v-model="generalInput.oeffentlichkeitsarbeit"
                type="number"
                class="w-32"
                step="0.01"
                min="0"
                max="1000000"
              />
              <span class="text-sm text-muted-foreground">€</span>
            </div>
          </div>

          <!-- UNI-Klinik -->
          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="patAnUni"
              v-model="generalInput.patAnUni"
              class="h-4 w-4"
              :true-value="1"
              :false-value="0"
            />
            <Label for="patAnUni">Sollen in der nächsten Periode Patienten, die sehr hohe Kosten verursachen, zur UNI-Klinik geschickt werden?</Label>
          </div>
        </CardContent>
      </Card>

      <!-- Wahlleistungen -->
      <Card>
        <CardHeader>
          <CardTitle>Wahlleistungen</CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-2 gap-8">
            <div class="text-center font-medium">Wahlleistung 1</div>
            <div class="text-center font-medium">Wahlleistung 2</div>
          </div>

          <div class="space-y-8">
            <!-- Zuschlag auf Fallpauschalen -->
            <div class="relative">
              <Label class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Zuschlag auf Fallpauschalen
              </Label>
              <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center gap-2 justify-end">
                  <Input
                    id="zuschlag1"
                    v-model="generalInput.entWahl.entWahl1.zuschFallpauschale"
                    type="number"
                    class="w-32"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">%</span>
                </div>
                <div class="flex items-center gap-2">
                  <Input
                    id="zuschlag2"
                    v-model="generalInput.entWahl.entWahl2.zuschFallpauschale"
                    type="number"
                    class="w-32"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <!-- Mehraufwand Sachmittel -->
            <div class="relative">
              <Label class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Mehraufwand Sachmittel
              </Label>
              <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center gap-2 justify-end">
                  <Input
                    id="sachmittel1"
                    v-model="generalInput.entWahl.entWahl1.mehrSachmittel"
                    type="number"
                    class="w-32"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">%</span>
                </div>
                <div class="flex items-center gap-2">
                  <Input
                    id="sachmittel2"
                    v-model="generalInput.entWahl.entWahl2.mehrSachmittel"
                    type="number"
                    class="w-32"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <!-- Mehraufwand Lebensmittel -->
            <div class="relative">
              <Label class="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                Mehraufwand Lebensmittel je Patient und Tag
              </Label>
              <div class="grid grid-cols-2 gap-8">
                <div class="flex items-center gap-2 justify-end">
                  <Input
                    id="lebensmittel1"
                    v-model="generalInput.entWahl.entWahl1.mehLebensmittel"
                    type="number"
                    class="w-32"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">€</span>
                </div>
                <div class="flex items-center gap-2">
                  <Input
                    id="lebensmittel2"
                    v-model="generalInput.entWahl.entWahl2.mehLebensmittel"
                    type="number"
                    class="w-32"
                    step="0.01"
                    min="0"
                    max="100"
                  />
                  <span class="text-sm text-muted-foreground">€</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <!-- Veränderungsbereiche -->
      <Card>
        <CardHeader>
          <CardTitle>Veränderung der Sachmittel (Teil der Bereitschaftskosten)</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="(value, key) in generalInput.entSachLeistung.verSachmittel" :key="key" 
                class="space-y-2">
              <Label :for="'sachmittel-'+key" class="capitalize">{{ key }}</Label>
              <div class="flex items-center gap-2">
                <Input
                  :id="'sachmittel-'+key"
                  v-model="generalInput.entSachLeistung.verSachmittel[key]"
                  type="number"
                  class="w-32"
                  step="0.1"
                  min="-100"
                  max="100"
                />
                <span class="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Veränderung der Leistungskosten</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="(value, key) in generalInput.entSachLeistung.verLeistung" :key="key" 
                class="space-y-2">
              <Label :for="'leistung-'+key" class="capitalize">{{ key }}</Label>
              <div class="flex items-center gap-2">
                <Input
                  :id="'leistung-'+key"
                  v-model="generalInput.entSachLeistung.verLeistung[key]"
                  type="number"
                  class="w-32"
                  step="0.1"
                  min="-100"
                  max="100"
                />
                <span class="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
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
import { useGeneralInputStore } from '@/stores/generalInput'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const store = useGeneralInputStore()
const gameDataStore = useGameDataStore()
const { generalInput, isValid } = storeToRefs(store)

const initData = async () => {
  store.initialize()
  await gameDataStore.load()
}

onMounted(initData)
onActivated(initData)

// Überwache Änderungen an generalInput
watch(generalInput, (newValue) => {
  console.log("updating module generalInput", newValue)
  gameDataStore.updateModule('generalInput', newValue)
}, { deep: true })

const saveToServer = async () => {
  await gameDataStore.saveToServer()
}
</script>

<style lang="postcss" scoped>
input[type="checkbox"] {
  @apply rounded border-slate-300 shadow-sm focus:ring-slate-400 dark:border-slate-600;
}

input[type="checkbox"]:checked {
  @apply bg-slate-900 border-slate-900 dark:bg-slate-50 dark:border-slate-50;
}
</style> 