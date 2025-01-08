<template>
  <div class="container mx-auto p-4 space-y-4">
    <h1 class="text-3xl font-bold mb-6">Allgemeine Eingaben</h1>

    <Form @submit.prevent="saveToServer">
      <!-- EntAllg Card -->
      <Card class="p-4">
        <CardHeader>
          <CardTitle>Allgemeine Informationen</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="entAllg.Notfallkap" label="Notfallkapital (%)">
              <FormItem>
                <FormLabel>Notfallkapital (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entAllg.Notfallkap" 
                    @change="updateEntAllg('Notfallkap', entAllg.Notfallkap)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie das Notfallkapital ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entAllg.WeVerlaengern" label="WE verlängern">
              <FormItem class="flex items-center space-x-2">
                <FormLabel>WE verlängern</FormLabel>
                <FormControl>
                  <input 
                    type="checkbox" 
                    v-model="entAllg.WeVerlaengern" 
                    @change="updateEntAllg('WeVerlaengern', entAllg.WeVerlaengern)" 
                    class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </FormControl>
                <FormDescription>WE verlängern aktivieren.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entAllg.WeAufnehmen" label="WE aufnehmen">
              <FormItem class="flex items-center space-x-2">
                <FormLabel>WE aufnehmen</FormLabel>
                <FormControl>
                  <input 
                    type="checkbox" 
                    v-model="entAllg.WeAufnehmen" 
                    @change="updateEntAllg('WeAufnehmen', entAllg.WeAufnehmen)" 
                    class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </FormControl>
                <FormDescription>WE aufnehmen aktivieren.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entAllg.Qualisicherung" label="Qualitätssicherung">
              <FormItem class="flex items-center space-x-2">
                <FormLabel>Qualitätssicherung</FormLabel>
                <FormControl>
                  <input 
                    type="checkbox" 
                    v-model="entAllg.Qualisicherung" 
                    @change="updateEntAllg('Qualisicherung', entAllg.Qualisicherung)" 
                    class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </FormControl>
                <FormDescription>Qualitätssicherung aktivieren.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entAllg.Oeffentlichkeitsarbeit" label="Öffentlichkeitsarbeit (€)">
              <FormItem>
                <FormLabel>Öffentlichkeitsarbeit (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entAllg.Oeffentlichkeitsarbeit" 
                    @change="updateEntAllg('Oeffentlichkeitsarbeit', entAllg.Oeffentlichkeitsarbeit)" 
                    min="0"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Öffentlichkeitsarbeit aktivieren.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entAllg.PatAnUni" label="Patienten an Universitäten">
              <FormItem class="flex items-center space-x-2">
                <FormLabel>Patienten an Universitäten</FormLabel>
                <FormControl>
                  <input 
                    type="checkbox" 
                    v-model="entAllg.PatAnUni" 
                    @change="updateEntAllg('PatAnUni', entAllg.PatAnUni)" 
                    class="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </FormControl>
                <FormDescription>Patienten an Universitäten aktivieren.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <!-- EntWahl Card -->
      <Card class="p-4">
        <CardHeader>
          <CardTitle>EntWahl</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex space-x-4">
            <!-- EntWahl1 Section -->
            <div class="w-1/2">
              <h2 class="text-xl font-semibold mb-2">EntWahl1</h2>
              <div class="grid grid-cols-1 gap-4">
                <FormField name="entWahl.EntWahl1.ZuschFallpauschale" label="Zuschuss Fallpauschale (%)">
                  <FormItem>
                    <FormLabel>Zuschuss Fallpauschale (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl1.ZuschFallpauschale" 
                        @change="updateEntWahl('EntWahl1', 'ZuschFallpauschale', entWahl.EntWahl1.ZuschFallpauschale)" 
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie den Zuschuss für Fallpauschalen ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField name="entWahl.EntWahl1.MehrSachmittel" label="Mehr Sachmittel (%)">
                  <FormItem>
                    <FormLabel>Mehr Sachmittel (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl1.MehrSachmittel" 
                        @change="updateEntWahl('EntWahl1', 'MehrSachmittel', entWahl.EntWahl1.MehrSachmittel)" 
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie die zusätzlichen Sachmittel ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField name="entWahl.EntWahl1.MehLebensmittel" label="Mehr Lebensmittel (€)">
                  <FormItem>
                    <FormLabel>Mehr Lebensmittel (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl1.MehLebensmittel" 
                        @change="updateEntWahl('EntWahl1', 'MehLebensmittel', entWahl.EntWahl1.MehLebensmittel)" 
                        min="0"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie die zusätzlichen Lebensmittel ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- EntWahl2 Section -->
            <div class="w-1/2">
              <h2 class="text-xl font-semibold mb-2">EntWahl2</h2>
              <div class="grid grid-cols-1 gap-4">
                <FormField name="entWahl.EntWahl2.ZuschFallpauschale" label="Zuschuss Fallpauschale (%)">
                  <FormItem>
                    <FormLabel>Zuschuss Fallpauschale (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl2.ZuschFallpauschale" 
                        @change="updateEntWahl('EntWahl2', 'ZuschFallpauschale', entWahl.EntWahl2.ZuschFallpauschale)" 
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie den Zuschuss für Fallpauschalen ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField name="entWahl.EntWahl2.MehrSachmittel" label="Mehr Sachmittel (%)">
                  <FormItem>
                    <FormLabel>Mehr Sachmittel (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl2.MehrSachmittel" 
                        @change="updateEntWahl('EntWahl2', 'MehrSachmittel', entWahl.EntWahl2.MehrSachmittel)" 
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie die zusätzlichen Sachmittel ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField name="entWahl.EntWahl2.MehLebensmittel" label="Mehr Lebensmittel (€)">
                  <FormItem>
                    <FormLabel>Mehr Lebensmittel (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        v-model.number="entWahl.EntWahl2.MehLebensmittel" 
                        @change="updateEntWahl('EntWahl2', 'MehLebensmittel', entWahl.EntWahl2.MehLebensmittel)" 
                        min="0"
                        step="0.1"
                      />
                    </FormControl>
                    <FormDescription>Geben Sie die zusätzlichen Lebensmittel ein.</FormDescription>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Entscheidungen für Sachmittel und Leistungskosten - VerSachmittel Card -->
      <Card class="p-4">
        <CardHeader>
          <CardTitle>Entscheidungen für Sachmittel und Leistungskosten - Veränderung Sachmittel</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 class="text-xl font-semibold mb-2">VerSachmittel</h2>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <FormField name="entSachLeistung.VerSachmittel.Innere" label="Innere (%)">
              <FormItem>
                <FormLabel>Innere (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Innere" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Innere', entSachLeistung.VerSachmittel.Innere)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Innere Leistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerSachmittel.Chir" label="Chirurgie (%)">
              <FormItem>
                <FormLabel>Chirurgie (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Chir" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Chir', entSachLeistung.VerSachmittel.Chir)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Chirurgieleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerSachmittel.Gyn" label="Gynäkologie (%)">
              <FormItem>
                <FormLabel>Gynäkologie (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Gyn" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Gyn', entSachLeistung.VerSachmittel.Gyn)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Gynäkologieleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerSachmittel.Labor" label="Labor (%)">
              <FormItem>
                <FormLabel>Labor (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Labor" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Labor', entSachLeistung.VerSachmittel.Labor)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Laborleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerSachmittel.Op" label="Operationen (%)">
              <FormItem>
                <FormLabel>Operationen (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Op" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Op', entSachLeistung.VerSachmittel.Op)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Operationenleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerSachmittel.Sonstige" label="Sonstige (%)">
              <FormItem>
                <FormLabel>Sonstige (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerSachmittel.Sonstige" 
                    @change="updateEntSachLeistung('VerSachmittel', 'Sonstige', entSachLeistung.VerSachmittel.Sonstige)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie sonstige Sachmittel ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <!-- Entscheidungen für Sachmittel und Leistungskosten - VerLeistung Card -->
      <Card class="p-4">
        <CardHeader>
          <CardTitle>Entscheidungen für Sachmittel und Leistungskosten - Veränderung Leistung</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 class="text-xl font-semibold mb-2">VerLeistung</h2>
          <div class="grid grid-cols-2 gap-4">
            <FormField name="entSachLeistung.VerLeistung.Innere" label="Innere (%)">
              <FormItem>
                <FormLabel>Innere (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerLeistung.Innere" 
                    @change="updateEntSachLeistung('VerLeistung', 'Innere', entSachLeistung.VerLeistung.Innere)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Innere Leistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerLeistung.Chir" label="Chirurgie (%)">
              <FormItem>
                <FormLabel>Chirurgie (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerLeistung.Chir" 
                    @change="updateEntSachLeistung('VerLeistung', 'Chir', entSachLeistung.VerLeistung.Chir)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Chirurgieleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField name="entSachLeistung.VerLeistung.Gyn" label="Gynäkologie (%)">
              <FormItem>
                <FormLabel>Gynäkologie (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="entSachLeistung.VerLeistung.Gyn" 
                    @change="updateEntSachLeistung('VerLeistung', 'Gyn', entSachLeistung.VerLeistung.Gyn)" 
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </FormControl>
                <FormDescription>Geben Sie die Gynäkologieleistung ein.</FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" class="mt-6">Speichern</Button>
    </Form>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useGeneralInputStore } from '@/stores/GeneralInput'
import { useGameDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'

const generalInputStore = useGeneralInputStore()
const gameDataStore = useGameDataStore()

// Verwende storeToRefs auf den gesamten Store für reaktive Referenzen
const { generalInput } = storeToRefs(generalInputStore)

// Verwende Computed Properties für die verschachtelten Eigenschaften
const entAllg = computed(() => generalInput.value.entAllg)
const entWahl = computed(() => generalInput.value.entWahl)
const entSachLeistung = computed(() => generalInput.value.entSachLeistung)

const initData = async () => {
  generalInputStore.initialize()
  await gameDataStore.load()
}

onMounted(initData)

// Update-Funktionen zum Setzen der Felder
const updateEntAllg = (field, value) => {
  generalInputStore.setField('entAllg', field, value)
}

const updateEntWahl = (section, field, value) => {
  generalInputStore.setField(`entWahl.${section}`, field, value)
}

const updateEntSachLeistung = (section, field, value) => {
  generalInputStore.setField(`entSachLeistung.${section}`, field, value)
}

const saveToServer = () => {
  gameDataStore.saveToServer()
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
