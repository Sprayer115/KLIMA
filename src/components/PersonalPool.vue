<template>
  <Table v-if="data?.poolingAkt && data?.poolingVerg">
    <TableHeader>
      <TableRow>
        <TableHead></TableHead>
        <TableHead>Innere Medizin</TableHead>
        <TableHead>Chirurgie</TableHead>
        <TableHead>Gynäkologie</TableHead>
        <TableHead>Gesamt</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="(category, key) in categories" :key="key">
        <TableCell>{{ category.label }}</TableCell>
        <TableCell>
          <div class="flex items-center">
            <span class="mr-2 text-blue-500">{{ data.poolingVerg.innere[category.key] || 0 }}</span>
            <Input type="number" v-model="data.poolingAkt.innere[category.key]" :min="0" :max="100" class="w-20" />
          </div>
        </TableCell>
        <TableCell>
          <div class="flex items-center">
            <span class="mr-2 text-blue-500">{{ data.poolingVerg.chir[category.key] || 0 }}</span>
            <Input type="number" v-model="data.poolingAkt.chir[category.key]" :min="0" :max="100" class="w-20" />
          </div>
        </TableCell>
        <TableCell>
          <div class="flex items-center">
            <span class="mr-2 text-blue-500">{{ data.poolingVerg.gyn[category.key] || 0 }}</span>
            <Input type="number" v-model="data.poolingAkt.gyn[category.key]" :min="0" :max="100" class="w-20" />
          </div>
        </TableCell>
        <TableCell>
          <span class="text-green-500">{{ totalVerg[category.key] }}</span> / 
          <span class="text-red-500">{{ totalAkt[category.key] }}</span>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div class="flex justify-end mt-6">
    <Button @click="validateAndSave">Speichern</Button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const categories = [
  { label: 'Assistenzärzte / innen', key: 'aerzte' },
  { label: 'Stationsschwestern', key: 'stationsschwestern' },
  { label: 'Krankenschwestern', key: 'krankenschwestern' },
  { label: 'Schwesternschülerinnen', key: 'schwesternschuelerinnen' }
]

const departments = ['innere', 'chir', 'gyn']

const totalVerg = computed(() => {
  const totals = {}
  categories.forEach(category => {
    totals[category.key] = departments.reduce((sum, dept) => sum + (props.data.poolingVerg[dept][category.key] || 0), 0)
  })
  return totals
})

const totalAkt = computed(() => {
  const totals = {}
  categories.forEach(category => {
    totals[category.key] = departments.reduce((sum, dept) => sum + (props.data.poolingAkt[dept][category.key] || 0), 0)
  })
  return totals
})

const emit = defineEmits(['save'])

function validateAndSave() {
  const isValid = Object.keys(totalAkt.value).every(key => totalAkt.value[key] === totalVerg.value[key])
  if (!isValid) {
    alert('Die Gesamtanzahl muss gleich bleiben!')
  } else {
    emit('save')
  }
}
</script>
