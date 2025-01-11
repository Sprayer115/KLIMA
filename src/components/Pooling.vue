<template>
  <Form @submit="saveToServer">
    <Card class="p-4 mb-4">
      <CardHeader>
        <CardTitle>PoolingAkt</CardTitle>
      </CardHeader>
      <CardContent>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rolle</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Innere</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chirurgie</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gynäkologie</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gesamt</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="role in roleNames" 
              :key="role" 
              :class="{'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-700': !isRowValid(role)}"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200">{{ role }}</td>

              <!-- Innere -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Verg</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingVergInnere[role]" 
                    disabled
                    class="w-20 mb-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                  <span class="text-xs text-gray-500 dark:text-gray-400">Akt</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingAktInnere[role]" 
                    @change="validateRow(role)"
                    min="0"
                    max="100"
                    step="1"
                    class="w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </td>

              <!-- Chirurgie -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Verg</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingVergChir[role]" 
                    disabled
                    class="w-20 mb-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                  <span class="text-xs text-gray-500 dark:text-gray-400">Akt</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingAktChir[role]" 
                    @change="validateRow(role)"
                    min="0"
                    max="100"
                    step="1"
                    class="w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </td>

              <!-- Gynäkologie -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-xs text-gray-500 dark:text-gray-400">Verg</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingVergGyn[role]" 
                    disabled
                    class="w-20 mb-1 rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  />
                  <span class="text-xs text-gray-500 dark:text-gray-400">Akt</span>
                  <Input 
                    type="number" 
                    v-model.number="poolingAktGyn[role]" 
                    @change="validateRow(role)"
                    min="0"
                    max="100"
                    step="1"
                    class="w-20 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </td>

              <!-- Gesamt -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200 text-center">
                <div class="flex flex-col items-center">
                  <span class="text-xs font-medium">Gesamt</span>
                  <span class="text-sm">{{ computeTotal(poolingVergCategory(role)) }}</span>
                  <span class="text-sm">{{ computeTotal(poolingAktCategory(role)) }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>

    <!-- Save Button -->
    <div class="mt-6">
      <Button @click="saveToServer" :disabled="!allRowsValid">Speichern</Button>
    </div>
  </Form>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { usePersonalUndAbteilungenStore } from '@/stores/PersonalUndAbteilungen'
import { useGameDataStore } from '@/stores/data'
import { useToast } from '@/components/ui/toast/use-toast'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const store = usePersonalUndAbteilungenStore()
const gameDataStore = useGameDataStore()
const { toast } = useToast()

const poolingAkt = computed(() => store.personalUndAbteilungen.Pooling.PoolingAkt)
const poolingVerg = computed(() => store.personalUndAbteilungen.Pooling.PoolingVerg)

const roleNames = ['Aerzte', 'Stationsschwestern', 'Krankenschwestern', 'Schwesternschuelerinnen']
const categories = ['Innere', 'Chir', 'Gyn']

const poolingAktInnere = computed(() => poolingAkt.value.Innere)

const poolingVergInnere = computed(() => poolingVerg.value.Innere)

const poolingAktChir = computed(() => poolingAkt.value.Chir)
const poolingVergChir = computed(() => poolingVerg.value.Chir)

const poolingAktGyn = computed(() => poolingAkt.value.Gyn)
const poolingVergGyn = computed(() => poolingVerg.value.Gyn)

const rowValidity = ref({
  Aerzte: true,
  Stationsschwestern: true,
  Krankenschwestern: true,
  Schwesternschuelerinnen: true
})

const isRowValid = (role) => {
  return rowValidity.value[role]
}

const allRowsValid = computed(() => {
  return Object.values(rowValidity.value).every(v => v)
})



const validateRow = (role) => {
  const totalVerg = computeTotal({
    Innere: poolingVerg.value.Innere[role],
    Chir: poolingVerg.value.Chir[role],
    Gyn: poolingVerg.value.Gyn[role]
  })
  const totalAkt = computeTotal({
    Innere: poolingAkt.value.Innere[role],
    Chir: poolingAkt.value.Chir[role],
    Gyn: poolingAkt.value.Gyn[role]
  })
  rowValidity.value[role] = totalVerg === totalAkt
}

const computeTotal = (data) => {
  return Object.values(data).reduce((acc, val) => acc + val, 0)
}

const poolingVergCategory = (role) => {
  return {
    Innere: poolingVerg.value.Innere[role],
    Chir: poolingVerg.value.Chir[role],
    Gyn: poolingVerg.value.Gyn[role]
  }
}

const poolingAktCategory = (role) => {
  return {
    Innere: poolingAkt.value.Innere[role],
    Chir: poolingAkt.value.Chir[role],
    Gyn: poolingAkt.value.Gyn[role]
  }
}

const saveToServer = () => {
  if (allRowsValid.value) {
    // Save data to server
    store.setObject("Pooling", "PoolingAkt", poolingAkt.value)
    console.log("")
    gameDataStore.saveToServer()
    toast({ 
        title: 'Gespeichert', 
        description: 'Daten erfolgreich gespeichert.', 
        variant: 'success' 
      })
  } else {
    toast({ 
        title: 'Fehler', 
        description: 'Bitte korrigieren Sie die markierten Zeilen vor dem Speichern.', 
        variant: 'destructive' 
      })
  }
}

// Watch for changes to validate rows in real-time
watch(poolingAkt, (newVal, oldVal) => {
  roleNames.forEach(role => {
    validateRow(role)
  })
}, { deep: true })
</script>

<style scoped>
/* Mark invalid rows with red background and adjust text color */
.bg-red-100 {
  background-color: #fee2e2;
}

.dark .bg-red-700 {
  background-color: #7f1d1d;
}

.text-red-700 td,
.text-red-700 td span
{
  color: #b91c1c !important;
}

.dark .text-red-700 {
  color: #b91c1c;
}
</style>
