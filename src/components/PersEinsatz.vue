<template>
  <Form @submit ="saveToServer">
    <div class="grid grid-cols-4 gap-6">
      <!-- Left Column: 3/4 Width -->
      <div class="col-span-3 space-y-6">
        <!-- PersAbt Section in Table Layout -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>PersAbt</CardTitle>
          </CardHeader>
          <CardContent>
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rolle</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Innere</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chir</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gyn</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="roleName in roleNames" :key="roleName">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{{ roleName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PersAbt.Innere[roleName]" 
                      @change="updateField(`PersEinsatz.PersAbt.Innere`, 'Aerzte', persEinsatz.PersAbt.Innere[roleName])" 
                      :min="1"
                      :max="getMax('Aerzte', roleName)"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PersAbt.Chir[roleName]" 
                      @change="updateField(`PersEinsatz.PersAbt.Chir`, 'Aerzte', persEinsatz.PersAbt.Chir[roleName])" 
                      :min="1"
                      :max="getMax('Aerzte', roleName)"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PersAbt.Gyn[roleName]" 
                      @change="updateField(`PersEinsatz.PersAbt.Gyn`, 'Aerzte', persEinsatz.PersAbt.Gyn[roleName])" 
                      :min="1"
                      :max="getMax('Aerzte', roleName)"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <!-- Abtplanung Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>Abtplanung</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-4">
              <FormField name="Abtplanung.Innere" label="Innere Planung">
                <FormItem>
                  <FormLabel>Innere Planung</FormLabel>
                  <FormControl>
                    <select 
                      v-model.number="persEinsatz.Abtplanung.Innere" 
                      @change="updateField('PersEinsatz.Abtplanung', 'Innere', persEinsatz.Abtplanung.Innere)"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="Abtplanung.Chir" label="Chir Planung">
                <FormItem>
                  <FormLabel>Chir Planung</FormLabel>
                  <FormControl>
                    <select 
                      v-model.number="persEinsatz.Abtplanung.Chir" 
                      @change="updateField('PersEinsatz.Abtplanung', 'Chir', persEinsatz.Abtplanung.Chir)"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option v-for="n in 7" :key="n" :value="n">{{ n }}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="Abtplanung.Gyn" label="Gyn Planung">
                <FormItem>
                  <FormLabel>Gyn Planung</FormLabel>
                  <FormControl>
                    <select 
                      v-model.number="persEinsatz.Abtplanung.Gyn" 
                      @change="updateField('PersEinsatz.Abtplanung', 'Gyn', persEinsatz.Abtplanung.Gyn)"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option v-for="n in 3" :key="n" :value="n">{{ n }}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <!-- PEnt Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>Personal Entscheidungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <FormField name="PEnt.Belegarzt" label="Belegarzt">
                <FormItem class="flex items-center space-x-2">
                  <FormLabel>Belegarzt</FormLabel>
                  <FormControl>
                    <input 
                      type="checkbox" 
                      v-model="persEinsatz.PEnt.Belegarzt" 
                      @change="updateField('PersEinsatz.PEnt', 'Belegarzt', persEinsatz.PEnt.Belegarzt)" 
                      class="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 transition duration-150 ease-in-out"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PEnt.Sozialarbeiter" label="Sozialarbeiter">
                <FormItem class="flex items-center space-x-2">
                  <FormLabel>Sozialarbeiter</FormLabel>
                  <FormControl>
                    <input 
                      type="checkbox" 
                      v-model="persEinsatz.PEnt.Sozialarbeiter" 
                      @change="updateField('PersEinsatz.PEnt', 'Sozialarbeiter', persEinsatz.PEnt.Sozialarbeiter)" 
                      class="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400 transition duration-150 ease-in-out"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: 1/4 Width -->
      <div class="col-span-1 space-y-6">
        <!-- PVeraenZentral Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>PVeraenZentral</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-2 gap-4">
              <FormField name="PVeraenZentral.Kueche" label="Küche (%)">
                <FormItem>
                  <FormLabel>Küche (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenZentral.Kueche" 
                      @change="updateField('PersEinsatz.PVeraenZentral', 'Kueche', persEinsatz.PVeraenZentral.Kueche)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PVeraenZentral.Waescherei" label="Wäscherei (%)">
                <FormItem>
                  <FormLabel>Wäscherei (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenZentral.Waescherei" 
                      @change="updateField('PersEinsatz.PVeraenZentral', 'Waescherei', persEinsatz.PVeraenZentral.Waescherei)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PVeraenZentral.Reinigungsdienst" label="Reinigungsdienst (%)">
                <FormItem>
                  <FormLabel>Reinigungsdienst (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenZentral.Reinigungsdienst" 
                      @change="updateField('PersEinsatz.PVeraenZentral', 'Reinigungsdienst', persEinsatz.PVeraenZentral.Reinigungsdienst)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PVeraenZentral.Sonstige" label="Sonstige (%)">
                <FormItem>
                  <FormLabel>Sonstige (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenZentral.Sonstige" 
                      @change="updateField('PersEinsatz.PVeraenZentral', 'Sonstige', persEinsatz.PVeraenZentral.Sonstige)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>

        <!-- PVeraenFunk Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>PVeraenFunk</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-4">
              <FormField name="PVeraenFunk.Labor" label="Labor (%)">
                <FormItem>
                  <FormLabel>Labor (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenFunk.Labor" 
                      @change="updateField('PersEinsatz.PVeraenFunk', 'Labor', persEinsatz.PVeraenFunk.Labor)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PVeraenFunk.Op" label="Op (%)">
                <FormItem>
                  <FormLabel>Op (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenFunk.Op" 
                      @change="updateField('PersEinsatz.PVeraenFunk', 'Op', persEinsatz.PVeraenFunk.Op)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="PVeraenFunk.Sonstige" label="Sonstige (%)">
                <FormItem>
                  <FormLabel>Sonstige (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="persEinsatz.PVeraenFunk.Sonstige" 
                      @change="updateField('PersEinsatz.PVeraenFunk', 'Sonstige', persEinsatz.PVeraenFunk.Sonstige)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-6">
      <Button @click="saveToServer">Speichern</Button>
    </div>
  </Form>
</template>

<script setup>
import { computed } from 'vue'
import { usePersonalUndAbteilungenStore } from '@/stores/PersonalUndAbteilungen'
import { useGameDataStore } from '@/stores/data'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const store = usePersonalUndAbteilungenStore()
const gameDataStore = useGameDataStore()

const persEinsatz = computed(() => store.personalUndAbteilungen.PersEinsatz)

const updateField = (sectionPath, field, value) => {
  store.setField(sectionPath, field, value)
}
const roleNames = ['Aerzte', 'Stationsschwestern', 'Krankenschwestern', 'Schwesternschuelerinnen']

const getMax = (field, abtName) => {
  const maxValues = {
    Aerzte: { Innere: 100, Chir: 100, Gyn: 80 },
    Stationsschwestern: { Innere: 30, Chir: 30, Gyn: 25 },
    Krankenschwestern: { Innere: 200, Chir: 200, Gyn: 150 },
    Schwesternschuelerinnen: { Innere: 50, Chir: 50, Gyn: 40 }
  }
  return maxValues[field][abtName] || 100
}

const saveToServer = () => {
  gameDataStore.saveToServer()
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
