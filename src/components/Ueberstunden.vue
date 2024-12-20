<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Planung von Überstunden für das eingesetzte Personal in der nächsten Periode</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-4 gap-4 items-center">
            <div></div>
            <div>Innere Medizin</div>
            <div>Chirurgie</div>
            <div>Gynäkologie</div>

            <div>Assistenzärzte / innen</div>
            <div class="flex items-center">
              <Input type="number" v-model="innereAerzte" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="chirAerzte" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="gynAerzte" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>

            <div>Stationsschwestern und Vertreterinnen</div>
            <div class="flex items-center">
              <Input type="number" v-model="innereStationsschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="chirStationsschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="gynStationsschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>

            <div>Krankenschwestern und -pfleger</div>
            <div class="flex items-center">
              <Input type="number" v-model="innereKrankenschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="chirKrankenschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="gynKrankenschwestern" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>

            <div>Schwesternschülerinnen und Pflegeschüler</div>
            <div class="flex items-center">
              <Input type="number" v-model="innereSchuelerinnen" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="chirSchuelerinnen" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
            <div class="flex items-center">
              <Input type="number" v-model="gynSchuelerinnen" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Funktionsbereichspersonal</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>Labor</Label>
              <div class="flex items-center">
                <Input type="number" v-model="labor" :min="0" :max="100" class="w-20" />
                <span>%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <Label>OP</Label>
              <div class="flex items-center">
                <Input type="number" v-model="op" :min="0" :max="100" class="w-20" />
                <span>%</span>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <Label>Sonstige Bereiche</Label>
              <div class="flex items-center">
                <Input type="number" v-model="sonstigeFunk" :min="0" :max="100" class="w-20" />
                <span>%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zentralbereichspersonal</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center justify-between">
            <Label>Zentralbereiche</Label>
            <div class="flex items-center">
              <Input type="number" v-model="zentral" :min="0" :max="100" class="w-20" />
              <span>%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
  <div class="flex justify-end mt-6">
    <Button @click="validateAndSave">Speichern</Button>
  </div>
</template>

<script setup>
import { defineProps, computed, watch, defineEmits } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      ueIntern: {
        innere: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 },
        chir: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 },
        gyn: { aerzte: 0, stationsschwestern: 0, krankenschwestern: 0, schwesternschuelerinnen: 0 }
      },
      ueFunk: { labor: 0, op: 0, sonstige: 0 },
      ueZentral: { zentral: 0 }
    })
  }
})

const innereAerzte = computed({
  get: () => props.data.ueIntern.innere.aerzte,
  set: (value) => props.data.ueIntern.innere.aerzte = value
})

const chirAerzte = computed({
  get: () => props.data.ueIntern.chir.aerzte,
  set: (value) => props.data.ueIntern.chir.aerzte = value
})

const gynAerzte = computed({
  get: () => props.data.ueIntern.gyn.aerzte,
  set: (value) => props.data.ueIntern.gyn.aerzte = value
})

const innereStationsschwestern = computed({
  get: () => props.data.ueIntern.innere.stationsschwestern,
  set: (value) => props.data.ueIntern.innere.stationsschwestern = value
})

const chirStationsschwestern = computed({
  get: () => props.data.ueIntern.chir.stationsschwestern,
  set: (value) => props.data.ueIntern.chir.stationsschwestern = value
})

const gynStationsschwestern = computed({
  get: () => props.data.ueIntern.gyn.stationsschwestern,
  set: (value) => props.data.ueIntern.gyn.stationsschwestern = value
})

const innereKrankenschwestern = computed({
  get: () => props.data.ueIntern.innere.krankenschwestern,
  set: (value) => props.data.ueIntern.innere.krankenschwestern = value
})

const chirKrankenschwestern = computed({
  get: () => props.data.ueIntern.chir.krankenschwestern,
  set: (value) => props.data.ueIntern.chir.krankenschwestern = value
})

const gynKrankenschwestern = computed({
  get: () => props.data.ueIntern.gyn.krankenschwestern,
  set: (value) => props.data.ueIntern.gyn.krankenschwestern = value
})

const innereSchuelerinnen = computed({
  get: () => props.data.ueIntern.innere.schwesternschuelerinnen,
  set: (value) => props.data.ueIntern.innere.schwesternschuelerinnen = value
})

const chirSchuelerinnen = computed({
  get: () => props.data.ueIntern.chir.schwesternschuelerinnen,
  set: (value) => props.data.ueIntern.chir.schwesternschuelerinnen = value
})

const gynSchuelerinnen = computed({
  get: () => props.data.ueIntern.gyn.schwesternschuelerinnen,
  set: (value) => props.data.ueIntern.gyn.schwesternschuelerinnen = value
})

const labor = computed({
  get: () => props.data.ueFunk.labor,
  set: (value) => props.data.ueFunk.labor = value
})

const op = computed({
  get: () => props.data.ueFunk.op,
  set: (value) => props.data.ueFunk.op = value
})

const sonstigeFunk = computed({
  get: () => props.data.ueFunk.sonstige,
  set: (value) => props.data.ueFunk.sonstige = value
})

const zentral = computed({
  get: () => props.data.ueZentral.zentral,
  set: (value) => props.data.ueZentral.zentral = value
})

const emit = defineEmits(['save'])

function validateAndSave() {
  // Füge hier die Validierungslogik hinzu, falls erforderlich
  emit('save')
}

// Überwachen und speichern
watch(() => props.data, (newValue) => {
  console.log("Aktualisiere Ueberstunden-Daten", newValue)
  // Hier die Logik zum Speichern der Daten einfügen
}, { deep: true })
</script>

<style scoped>
.inline-input {
  display: inline-flex;
  align-items: center;
}
</style> 