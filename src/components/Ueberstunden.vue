<template>
  <Form @submit="saveToServer">
    <div class="grid grid-cols-4 gap-6">
      <!-- Left Column: 3/4 Width -->
      <div class="col-span-3 space-y-6">
        <!-- UeIntern Section in Table Layout -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>UeIntern</CardTitle>
          </CardHeader>
          <CardContent>
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rolle</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Innere Medizin</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chirurgie</th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gynäkologie</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="roleName in roleNames" :key="roleName">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">{{ roleName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="ueIntern.Innere[roleName]" 
                      @change="updateField('Ueberstunden.UeIntern.Innere', 'Aerzte', ueIntern.Innere[roleName])"
                      min="0"
                      max="100"
                      step="1"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="ueIntern.Chir[roleName]" 
                      @change="updateField('Ueberstunden.UeIntern.Chir', 'Aerzte', ueIntern.Chir[roleName])"
                      min="0"
                      max="100"
                      step="1"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                    <Input 
                      type="number" 
                      v-model.number="ueIntern.Gyn[roleName]" 
                      @change="updateField('Ueberstunden.UeIntern.Gyn', 'Aerzte', ueIntern.Gyn[roleName])"
                      min="0"
                      max="100"
                      step="1"
                      class="w-20 mx-auto rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: 1/4 Width -->
      <div class="col-span-1 space-y-6">
        <!-- UeFunk Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>UeFunk</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-3 gap-4">
              <FormField name="UeFunk.Labor" label="Labor (%)">
                <FormItem>
                  <FormLabel>Labor (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="ueFunk.Labor" 
                      @change="updateField('Ueberstunden.UeFunk', 'Labor', ueFunk.Labor)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="UeFunk.Op" label="Op (%)">
                <FormItem>
                  <FormLabel>Op (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="ueFunk.Op" 
                      @change="updateField('Ueberstunden.UeFunk', 'Op', ueFunk.Op)" 
                      min="0"
                      max="100"
                      step="0.1"
                      class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField name="UeFunk.Sonstige" label="Sonstige (%)">
                <FormItem>
                  <FormLabel>Sonstige (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      v-model.number="ueFunk.Sonstige" 
                      @change="updateField('Ueberstunden.UeFunk', 'Sonstige', ueFunk.Sonstige)" 
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

        <!-- UeZentral Section -->
        <Card class="p-4">
          <CardHeader>
            <CardTitle>UeZentral</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField name="UeZentral.Zentral" label="Zentral (%)">
              <FormItem>
                <FormLabel>Zentral (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    v-model.number="ueZentral.Zentral" 
                    @change="updateField('Ueberstunden.UeZentral', 'Zentral', ueZentral.Zentral)" 
                    min="0"
                    max="100"
                    step="0.1"
                    class="block w-full mt-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Save Button -->
    <div class="mt-6">
      <Button @click="saveToServer" >Speichern</Button>
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

const ueIntern = computed(() => store.personalUndAbteilungen.Ueberstunden.UeIntern)
const ueFunk = computed(() => store.personalUndAbteilungen.Ueberstunden.UeFunk)
const ueZentral = computed(() => store.personalUndAbteilungen.Ueberstunden.UeZentral)

// Define roles for the table
const roleNames = ['Aerzte', 'Stationsschwestern', 'Krankenschwestern', 'Schwesternschuelerinnen']

const updateField = (sectionPath, field, value) => {
  store.setField(sectionPath, field, value)
}

const saveToServer = () => {
  gameDataStore.saveToServer()
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
