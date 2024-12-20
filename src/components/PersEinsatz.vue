<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalplanung für Abteilungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 gap-4 items-center">
            <div></div>
            <div>Innere Medizin</div>
            <div>Chirurgie</div>
            <div>Gynäkologie</div>

            <div>Assistenzärzte / innen</div>
            <Input type="number" v-model="data.persAbt.innere.aerzte" :min="1" :max="100" class="w-20" />
            <Input type="number" v-model="data.persAbt.chir.aerzte" :min="1" :max="100" class="w-20" />
            <Input type="number" v-model="data.persAbt.gyn.aerzte" :min="1" :max="80" class="w-20" />

            <div>Stationsschwestern und Vertreterinnen</div>
            <Input type="number" v-model="data.persAbt.innere.stationsschwestern" :min="1" :max="30" class="w-20" />
            <Input type="number" v-model="data.persAbt.chir.stationsschwestern" :min="1" :max="30" class="w-20" />
            <Input type="number" v-model="data.persAbt.gyn.stationsschwestern" :min="1" :max="25" class="w-20" />

            <div>Krankenschwestern und -pfleger</div>
            <Input type="number" v-model="data.persAbt.innere.krankenschwestern" :min="1" :max="200" class="w-20" />
            <Input type="number" v-model="data.persAbt.chir.krankenschwestern" :min="1" :max="200" class="w-20" />
            <Input type="number" v-model="data.persAbt.gyn.krankenschwestern" :min="1" :max="150" class="w-20" />

            <div>Schwesternschülerinnen und Pflegeschüler</div>
            <Input type="number" v-model="data.persAbt.innere.schwesternschuelerinnen" :min="1" :max="50" class="w-20" />
            <Input type="number" v-model="data.persAbt.chir.schwesternschuelerinnen" :min="1" :max="50" class="w-20" />
            <Input type="number" v-model="data.persAbt.gyn.schwesternschuelerinnen" :min="1" :max="40" class="w-20" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Abteilungsplanung</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-3 gap-4 items-center">
            <div>Innere Medizin</div>
            <div>Chirurgie</div>
            <div>Gynäkologie</div>

            <Select v-model="innereString">
              <SelectTrigger>
                <SelectValue placeholder="Wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Innere Medizin</SelectLabel>
                  <SelectItem v-for="n in 6" :key="n" :value="String(n)">{{ n }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="chirString">
              <SelectTrigger>
                <SelectValue placeholder="Wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Chirurgie</SelectLabel>
                  <SelectItem v-for="n in 7" :key="n" :value="String(n)">{{ n }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="gynString">
              <SelectTrigger>
                <SelectValue placeholder="Wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Gynäkologie</SelectLabel>
                  <SelectItem v-for="n in 3" :key="n" :value="String(n)">{{ n }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalentscheidungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="data.pEnt.belegarzt" :true-value="1" :false-value="0" />
              <Label>Belegarzt zulassen</Label>
            </div>
            <div class="flex items-center gap-2">
              <input type="checkbox" v-model="data.pEnt.sozialarbeiter" :true-value="1" :false-value="0" />
              <Label>Einsatz eines Sozialarbeiters</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="space-y-6">
      <Card class="w-72">
        <CardHeader>
          <CardTitle>Personalveränderung in den Zentralbereichen</CardTitle>
        </CardHeader>
        <CardContent>
          <table class="w-full">
            <thead>
              <tr>
                <th class="text-left">Bereich</th>
                <th class="text-left">Prozentsatz</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><Label class="mr-5">Küche</Label></td>
                <td class="inline-input">
                  <Input type="number" v-model="data.pVeraenZentral.kueche" :min="0" :max="100" class="w-20" /><span>%</span>
                </td>
              </tr>
              <tr>
                <td><Label class="mr-5">Wäscherei</Label></td>
                <td class="inline-input">
                  <Input type="number" v-model="data.pVeraenZentral.waescherei" :min="0" :max="100" class="w-20" /><span>%</span>
                </td>
              </tr>
              <tr>
                <td><Label class="mr-5">Reinigungsdienst</Label></td>
                <td class="inline-input">
                  <Input type="number" v-model="data.pVeraenZentral.reinigungsdienst" :min="0" :max="100" class="w-20" /><span>%</span>
                </td>
              </tr>
              <tr>
                <td><Label class="mr-5">Sonstige Bereiche</Label></td>
                <td class="inline-input">
                  <Input type="number" v-model="data.pVeraenZentral.sonstige" :min="0" :max="100" class="w-20" /><span>%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card class="w-72">
        <CardHeader>
          <CardTitle>Personalveränderung in den Funktionsbereichen</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label class="w-1/2">Labor</Label>
              <Input type="number" v-model="data.pVeraenFunk.labor" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center justify-between">
              <Label class="w-1/2">OP</Label>
              <Input type="number" v-model="data.pVeraenFunk.op" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center justify-between">
              <Label class="w-1/2">Sonstige Bereiche</Label>
              <Input type="number" v-model="data.pVeraenFunk.sonstige" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <div class="flex justify-end mt-6">
      <Button @click="validateAndSave">Speichern</Button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, watch, defineEmits } from 'vue'
import { usePersonalUndAbteilungenStore } from '@/stores/personalUndAbteilungen'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      persAbt: {
        innere: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 },
        chir: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 },
        gyn: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 }
      },
      pVeraenZentral: { kueche: 0, waescherei: 0, reinigungsdienst: 0, sonstige: 0 },
      pVeraenFunk: { labor: 0, op: 0, sonstige: 0 },
      abtplanung: { innere: 0, chir: 0, gyn: 0 },
      pEnt: { belegarzt: 0, sozialarbeiter: 0 }
    })
  }
})

const personalUndAbteilungenStore = usePersonalUndAbteilungenStore()

const innereString = computed({
  get: () => String(props.data.abtplanung.innere),
  set: (value) => props.data.abtplanung.innere = Number(value)
})

const chirString = computed({
  get: () => String(props.data.abtplanung.chir),
  set: (value) => props.data.abtplanung.chir = Number(value)
})

const gynString = computed({
  get: () => String(props.data.abtplanung.gyn),
  set: (value) => props.data.abtplanung.gyn = Number(value)
})

const emit = defineEmits(['save'])

function validateAndSave() {
  // Füge hier die Validierungslogik hinzu, falls erforderlich
  emit('save')
}

// Überwachen und speichern
watch(() => personalUndAbteilungenStore.personalUndAbteilungen.persEinsatz, (newValue) => {
  console.log("Aktualisiere Modul persEinsatz", newValue)
  // Hier die Logik zum Speichern der Daten einfügen
}, { deep: true })
</script>

<style scoped>
.inline-input {
  display: inline-flex;
  align-items: center;
}
</style> 