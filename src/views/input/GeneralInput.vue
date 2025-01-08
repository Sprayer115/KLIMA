<template>
  <div class="container mx-auto p-4 space-y-4">
    <h1 class="text-3xl font-bold mb-6">Allgemeine Eingaben</h1>
    
    <!-- EntAllg Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>Allgemeine Informationen</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Notfallkapital">
            <Input 
              type="number" 
              v-model.number="entAllg.Notfallkap" 
              @change="updateEntAllg('Notfallkap', entAllg.Notfallkap)" 
            />
          </FormField>
          <FormField label="We Verlangen">
            <Input 
              type="number" 
              v-model.number="entAllg.WeVerlaengern" 
              @change="updateEntAllg('WeVerlaengern', entAllg.WeVerlaengern)" 
            />
          </FormField>
          <FormField label="We Aufnehmen">
            <Input 
              type="number" 
              v-model.number="entAllg.WeAufnehmen" 
              @change="updateEntAllg('WeAufnehmen', entAllg.WeAufnehmen)" 
            />
          </FormField>
          <FormField label="Qualitätssicherung">
            <Input 
              type="number" 
              v-model.number="entAllg.Qualisicherung" 
              @change="updateEntAllg('Qualisicherung', entAllg.Qualisicherung)" 
            />
          </FormField>
          <FormField label="Öffentlichkeitsarbeit">
            <Input 
              type="number" 
              v-model.number="entAllg.Oeffentlichkeitsarbeit" 
              @change="updateEntAllg('Oeffentlichkeitsarbeit', entAllg.Oeffentlichkeitsarbeit)" 
            />
          </FormField>
          <FormField label="Patienten an Universitäten">
            <Input 
              type="number" 
              v-model.number="entAllg.PatAnUni" 
              @change="updateEntAllg('PatAnUni', entAllg.PatAnUni)" 
            />
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- EntWahl1 Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>EntWahl1</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Zuschuss Fallpauschale">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl1.ZuschFallpauschale" 
              @change="updateEntWahl('EntWahl1', 'ZuschFallpauschale', entWahl.EntWahl1.ZuschFallpauschale)" 
            />
          </FormField>
          <FormField label="Mehr Sachmittel">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl1.MehrSachmittel" 
              @change="updateEntWahl('EntWahl1', 'MehrSachmittel', entWahl.EntWahl1.MehrSachmittel)" 
            />
          </FormField>
          <FormField label="Mehr Lebensmittel">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl1.MehLebensmittel" 
              @change="updateEntWahl('EntWahl1', 'MehLebensmittel', entWahl.EntWahl1.MehLebensmittel)" 
            />
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- EntWahl2 Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>EntWahl2</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Zuschuss Fallpauschale">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl2.ZuschFallpauschale" 
              @change="updateEntWahl('EntWahl2', 'ZuschFallpauschale', entWahl.EntWahl2.ZuschFallpauschale)" 
            />
          </FormField>
          <FormField label="Mehr Sachmittel">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl2.MehrSachmittel" 
              @change="updateEntWahl('EntWahl2', 'MehrSachmittel', entWahl.EntWahl2.MehrSachmittel)" 
            />
          </FormField>
          <FormField label="Mehr Lebensmittel">
            <Input 
              type="number" 
              v-model.number="entWahl.EntWahl2.MehLebensmittel" 
              @change="updateEntWahl('EntWahl2', 'MehLebensmittel', entWahl.EntWahl2.MehLebensmittel)" 
            />
          </FormField>
        </div>
      </CardContent>
    </Card>

    <!-- EntSachLeistung Card -->
    <Card class="p-4">
      <CardHeader>
        <CardTitle>EntSachLeistung</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 class="text-xl font-semibold mb-2">VerSachmittel</h2>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <FormField label="Innere">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Innere" 
              @change="updateEntSachLeistung('VerSachmittel', 'Innere', entSachLeistung.VerSachmittel.Innere)" 
            />
          </FormField>
          <FormField label="Chirurgie">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Chir" 
              @change="updateEntSachLeistung('VerSachmittel', 'Chir', entSachLeistung.VerSachmittel.Chir)" 
            />
          </FormField>
          <FormField label="Gynäkologie">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Gyn" 
              @change="updateEntSachLeistung('VerSachmittel', 'Gyn', entSachLeistung.VerSachmittel.Gyn)" 
            />
          </FormField>
          <FormField label="Labor">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Labor" 
              @change="updateEntSachLeistung('VerSachmittel', 'Labor', entSachLeistung.VerSachmittel.Labor)" 
            />
          </FormField>
          <FormField label="Operationen">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Op" 
              @change="updateEntSachLeistung('VerSachmittel', 'Op', entSachLeistung.VerSachmittel.Op)" 
            />
          </FormField>
          <FormField label="Sonstige">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerSachmittel.Sonstige" 
              @change="updateEntSachLeistung('VerSachmittel', 'Sonstige', entSachLeistung.VerSachmittel.Sonstige)" 
            />
          </FormField>
        </div>

        <h2 class="text-xl font-semibold mb-2">VerLeistung</h2>
        <div class="grid grid-cols-2 gap-4">
          <FormField label="Innere">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerLeistung.Innere" 
              @change="updateEntSachLeistung('VerLeistung', 'Innere', entSachLeistung.VerLeistung.Innere)" 
            />
          </FormField>
          <FormField label="Chirurgie">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerLeistung.Chir" 
              @change="updateEntSachLeistung('VerLeistung', 'Chir', entSachLeistung.VerLeistung.Chir)" 
            />
          </FormField>
          <FormField label="Gynäkologie">
            <Input 
              type="number" 
              v-model.number="entSachLeistung.VerLeistung.Gyn" 
              @change="updateEntSachLeistung('VerLeistung', 'Gyn', entSachLeistung.VerLeistung.Gyn)" 
            />
          </FormField>
        </div>
      </CardContent>
    </Card>

    <Button @click="saveToServer" class="mt-6">Speichern</Button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGeneralInputStore } from '@/stores/GeneralInput'
import { storeToRefs } from 'pinia'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { FormField } from '@/components/ui/formField'

const generalInputStore = useGeneralInputStore()
const { entAllg, entWahl, entSachLeistung } = storeToRefs(generalInputStore)

onMounted(() => {
  generalInputStore.loadFromLocalStorage()
  generalInputStore.loadFromServer()
})

const updateEntAllg = (field, value) => {
  generalInputStore.updateEntAllg(field, parseFloat(value))
}

const updateEntWahl = (section, field, value) => {
  generalInputStore.updateEntWahl(section, field, parseFloat(value))
}

const updateEntSachLeistung = (section, field, value) => {
  generalInputStore.updateEntSachLeistung(section, field, parseFloat(value))
}

const saveToServer = () => {
  generalInputStore.saveToServer()
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
