<template>
    <div class=" dark:text-white">
      <h1 class="text-2xl font-bold mb-4">Periodenergebnisse</h1>
      <div class="flex space-x-4 mb-4">
        <div>
          <label for="categorySelect" class="block mb-2">Kategorie auswählen:</label>
          <select id="categorySelect" v-model="selectedCategory" class="border rounded p-2 dark:bg-stone-800 dark:border-stone-700">
            <option value="" disabled>Kategorie auswählen</option>
            <option v-for="category in categories" :key="category" :value="category">{{ fieldTranslation[category] || category }}</option>
          </select>
        </div>
        <div>
          <label for="subCategorySelect" class="block mb-2">Unterkategorie auswählen:</label>
          <select id="subCategorySelect" v-model="selectedSubCategory" class="border rounded p-2 dark:bg-stone-800 dark:border-stone-700">
            <option value="" disabled>Unterkategorie auswählen</option>
            <option v-for="subCategory in subCategories" :key="subCategory" :value="subCategory">{{ fieldTranslation[subCategory] || subCategory }}</option>
          </select>
        </div>
      </div>
      <div class="table-container">
        <div class="table-section" v-if="Object.keys(filteredData1).length">
          <label for="periodSelect1" class="block mb-2">Periode für Tabelle 1 auswählen:</label>
          <select id="periodSelect1" v-model="selectedPeriod1" @change="() => loadPeriodData(selectedPeriod1, currentData1)" class="border rounded p-2 dark:bg-stone-800 dark:border-stone-700">
            <option v-for="n in periods" :key="n" :value="String(n)">{{ n }}</option>
          </select>
          <Table class="mt-4">
            <TableCaption>Periodenergebnisse für Tabelle 1</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Feld</TableHead>
                <TableHead v-for="department in departmentKeys1" :key="department">{{ fieldTranslation[department] || department }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(value, field) in filteredData1[firstDepartment1]" :key="field">
                <TableCell>{{ fieldTranslation[field] || field }}</TableCell>
                <TableCell v-for="department in departmentKeys1" :key="department">{{ formatNumber(filteredData1[department][field]) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div class="table-section" v-if="Object.keys(filteredData2).length">
          <label for="periodSelect2" class="block mb-2">Periode für Tabelle 2 auswählen:</label>
          <select id="periodSelect2" v-model="selectedPeriod2" @change="() => loadPeriodData(selectedPeriod2, currentData2)" class="border rounded p-2 dark:bg-stone-800 dark:border-stone-700">
            <option v-for="n in periods" :key="n" :value="String(n)">{{ n }}</option>
          </select>
          <Table class="mt-4">
            <TableCaption>Periodenergebnisse für Tabelle 2</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Feld</TableHead>
                <TableHead v-for="department in departmentKeys2" :key="department">{{ fieldTranslation[department] || department }}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="(value, field) in filteredData2[firstDepartment2]" :key="field">
                <TableCell>{{ fieldTranslation[field] || field }}</TableCell>
                <TableCell v-for="department in departmentKeys2" :key="department">{{ formatNumber(filteredData2[department][field]) }}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { useGameDataStore } from '@/stores/data'
  import { useAuthStore } from '@/stores/auth'
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  const store = useGameDataStore()
  const authStore = useAuthStore()
  const maxPeriod = computed(() => store.metadata.currentPeriod)
  const periods = computed(() => Array.from({ length: maxPeriod.value }, (_, i) => i))
  const selectedPeriod1 = ref(String(maxPeriod.value > 1 ? maxPeriod.value - 1 : 0))
  const selectedPeriod2 = ref(String(maxPeriod.value > 1 ? maxPeriod.value : 0))
  const selectedCategory = ref('')
  const selectedSubCategory = ref('')
  
  const currentData1 = ref({})
  const currentData2 = ref({})
  
  const categories = computed(() => {
    const keys = Object.keys(currentData1.value || {})
    console.log('Categories:', keys)
    return keys
  })
  
  const fieldTranslation = {
    "Belegungsgrad": "Belegungsgrad",
    "AnzahlPatienten": "Anzahl Patienten",
    "AngekommenePatienten": "Angekommene Patienten",
    "AufgenommenePatienten": "Aufgenommene Patienten",
    "AbgewiesenePatienten": "Abgewiesene Patienten",
    "AufgenommeneNotfaelle": "Aufgenommene Notfälle",
    "trotzVollbelegung": "Trotz Vollbelegung",
    "Bettenverschwendung": "Bettenverschwendung",
    "Verweildauer1": "Verweildauer 1",
    "Verweildauer2": "Verweildauer 2",
    "Verweildauer3": "Verweildauer 3",
    "Verweildauer4": "Verweildauer 4",
    "VerweildauerGesamt": "Verweildauer Gesamt",
    "Aequivalenzpunkte": "Äquivalenzpunkte",
    "BelegGradNotfall": "Belegungsgrad Notfall",
    "DFKBeleg": "DFK Beleg",
    "ErloeseZinsen": "Erlöse Zinsen",
    "ErloeseZbg": "Erlöse ZBG",
    "KostenFremdVergabe": "Kosten Fremdvergabe",
    "Wirtschaftsbedarf": "Wirtschaftsbedarf",
    "Lebensmittel": "Lebensmittel",
    "SummeLeistungskostenErg": "Summe Leistungskosten Erg",
    "PersonalkostenZentral": "Personalkosten Zentral",
    "KostenSozial": "Kosten Sozial",
    "SachmittelZentral": "Sachmittel Zentral",
    "Oeffentlichkeitsarbeit": "Öffentlichkeitsarbeit",
    "Infopaket": "Infopaket",
    "Ueberziehungszinsen": "Überziehungszinsen",
    "Umstellungskosten": "Umstellungskosten",
    "AbschreibungZentral": "Abschreibung Zentral",
    "AbschreibungTablett": "Abschreibung Tablett",
    "SummeBereitschaftskostenZentral": "Summe Bereitschaftskosten Zentral",
    "PeriodenergebnisZentral": "Periodenergebnis Zentral",
    "SummeLeistungskostenFunk": "Summe Leistungskosten Funk",
    "PersonalkostenFunk": "Personalkosten Funk",
    "SachmittelFunk": "Sachmittel Funk",
    "AbschreibungFunk": "Abschreibung Funk",
    "AbschreibungNeu": "Abschreibung Neu",
    "SummeBereitschaftFunk": "Summe Bereitschaft Funk",
    "PeriodenergebnisFunk": "Periodenergebnis Funk",
    "DbInnere": "DB Innere",
    "DbChir": "DB Chirurgie",
    "DbGyn": "DB Gynäkologie",
    "DbWahl1": "DB Wahlleistung 1",
    "DbWahl2": "DB Wahlleistung 2",
    "SummeDb": "Summe DB",
    "KostenZentral": "Kosten Zentral",
    "KostenFunktion": "Kosten Funktion",
    "Ueberschuss": "Überschuss",
    "UeberschussAlle": "Überschuss Alle",
    "ErgKueche": "Ergebnis Küche",
    "ErgWaescherei": "Ergebnis Wäscherei",
    "ErgReinigungsdienst": "Ergebnis Reinigungsdienst",
    "ErgSonstigeZentral": "Ergebnis Sonstige Zentral",
    "ErgLabor": "Ergebnis Labor",
    "ErgOp": "Ergebnis OP",
    "ErgSonstigeFunk": "Ergebnis Sonstige Funktion",
    "Innere": "Innere Medizin",
    "Chir": "Chirurgie",
    "Gyn": "Gynäkologie",
    "BelegGesamt": "Belegung Gesamt",
    "BelegInnere": "Belegung Innere",
    "BelegChirurgie": "Belegung Chirurgie",
    "BelegGyn": "Belegung Gynäkologie",
    "ErgZentral": "Ergebnis Zentralbereich",
    "ErgFunk": "Ergebnis Funkbereich",
    "DB": "Deckungsbeiträge",
    "DbAbt": "Abteilungen",
    "DbWahl": "Wahlleistungen",
    "KostenInnere": "Innere Medizin",
    "KostenChir": "Chirurgie",
    "KostenGyn": "Gynäkologie",
    "SachmKosten": "Sachmittelkosten",
    "medQualitaet": "Medizinische Qualität",
    "VerwaltungsQualitaet": "Verwaltungsqualität",
    "GesamtQualitaet": "Gesamtqualität",
    "DurchschnittQualitaet": "Durchschnittqualität",
    "PersonalUmfang": "Personal",
    "PersonalUmfangZbFb": "Personal Umfang ZB/FB",
    "PersonalUmfangAerzte": "Personal Umfang Aerzte",
    "PersonalUmfangStationschwestern": "Personal Umfang Stationschwestern",
    "PersonalUmfangSonstige": "Personal Umfang Sonstige",
    "SummeAbt": "Summe Abteilungen",
    "SonstigeFunk": "Sonstige Bereiche",
    "ErloeseFallpauschalen": "Erlöse Fallpauschalen",
    "SummeLeistungskostenDb": "Summe Leistungskosten Deckungsbeitrag",
    "Fallklasse": "Fallklasse",
    "Forschung": "Forschung",
    "PersonalkostenDb": "Personalkosten Deckungsbeitrag",
    "SachmittelkostenDb": "Sachmittelkosten Deckungsbeitrag",
    "AbschreibungDb": "Abschreibung Deckungsbeitrag",
    "SummeBereitschaftskostenDb": "Summe Bereitschaftskosten Deckungsbeitrag",
    "DbAbteilung": "Deckungsbeitrag Abteilung",
  }
  
  const subCategories = computed(() => {
    console.log("selectedCategory", selectedCategory.value)
    const keys = Object.keys(currentData1.value[selectedCategory.value] || {})
    console.log('SubCategories:', keys)
    return keys
  })
  
  const filteredData1 = computed(() => currentData1.value[selectedCategory.value]?.[selectedSubCategory.value] || {})
  const filteredData2 = computed(() => currentData2.value[selectedCategory.value]?.[selectedSubCategory.value] || {})
  
  const departmentKeys1 = computed(() => Object.keys(filteredData1.value))
  const departmentKeys2 = computed(() => Object.keys(filteredData2.value))
  
  const firstDepartment1 = computed(() => departmentKeys1.value[0] || '')
  const firstDepartment2 = computed(() => departmentKeys2.value[0] || '')
  
  const loadPeriodData = async (period, currentData) => {
    try {
      const response = await fetch(`/api/periods/${period.value}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      const data = await response.json()
      console.log('Loaded data:', data)
      
      // Special case handling for 'BelegGradNotfall'
      if (data.results && data.results.Belegungsdaten.BelegGesamt) {
        const belegGesamt = data.results.Belegungsdaten.BelegGesamt;
        const belegGradNotfall = belegGesamt.BelegGradNotfall;
        delete belegGesamt.BelegGradNotfall;
  
        // Move 'BelegGradNotfall' to the last department
        Object.keys(belegGesamt).forEach(department => {
          belegGesamt[department].BelegGradNotfall = null;
        })
        const lastDepartment = Object.keys(belegGesamt).pop();
        if (lastDepartment) {
          belegGesamt[lastDepartment].BelegGradNotfall = belegGradNotfall;
        }
      }
  
      // Special case handling for 'Ergebnis'
      if (data.results && data.results.Periodenergebnis.Ergebnis) {
        const ergebnis = data.results.Periodenergebnis.Ergebnis;
        data.results.Periodenergebnis.Periodenergebnis = {"Periodenergebnis": ergebnis}
        delete data.results.Periodenergebnis.Ergebnis;
      }
  
      // Special case  handling for Ankuenfte
      if (data.results && data.results.Ankuenfte) {
        const ankuenfte = data.results.Ankuenfte;
        data.results.Ankuenfte = {"Ankuenfte": ankuenfte}
      }
  
      //Special case handling for Qualitaeten
      if (data.results && data.results.Qualitaeten) {
        const qualitaeten = data.results.Qualitaeten;
        console.log("qualitaeten", qualitaeten)
        const VerwaltungsQualitaet = qualitaeten.VerwaltungsQualitaet;
        const GesamtQualitaet = qualitaeten.GesamtQualitaet;
        const DurchschnittQualitaet = qualitaeten.GesamtKrankenhaus;
        delete qualitaeten.VerwaltungsQualitaet;
        delete qualitaeten.GesamtQualitaet;
        delete qualitaeten.GesamtKrankenhaus;
        Object.keys(qualitaeten).forEach(department => {
          qualitaeten[department].VerwaltungsQualitaet = null;
          qualitaeten[department].GesamtQualitaet = null;
        })
        qualitaeten["Gesamt"] = {
          "Innere": null,
          "Chir": null,
          "Gyn": null,
          "SummeQual": DurchschnittQualitaet,
          "VerwaltungsQualitaet": VerwaltungsQualitaet,
          "GesamtQualitaet": GesamtQualitaet,
        }
        data.results.Qualitaeten = {"Qualitaeten": qualitaeten};
      }
  
      console.log("editeddata", data)
      currentData.value = data.results || {}
    } catch (error) {
      console.error("Fehler beim Laden der Periodendaten:", error)
      currentData.value = {}
    }
  }
  
  const loadAllPeriodData = () => {
    console.log("loadAllPeriodData called")
    console.log('Perioden:', periods.value, selectedPeriod1.value, selectedPeriod2.value);

    loadPeriodData(selectedPeriod1, currentData1)
    loadPeriodData(selectedPeriod2, currentData2)
  }
  
  const updateSubCategories = () => {
      console.log("updateSubCategories called")
      console.log("selectedCategory", selectedCategory.value)
      console.log("subCategories", subCategories.value)
      selectedSubCategory.value = subCategories.value[0] || ''
  }
  
  // Watcher for selectedCategory
  watch(selectedCategory, (newCategory, oldCategory) => {
    console.log(`Category changed from ${oldCategory} to ${newCategory}`)
    updateSubCategories()
  })
  
  watch(currentData1, () => {
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0]
      updateSubCategories()
    }
  })
  
  onMounted(() => {
    loadAllPeriodData()
  })
  
  // Function to format numbers
  const formatNumber = (value) => {
    if (value === null || value === '') {
      return '-';
    }
    // Prüfen, ob der Wert eine Ganzzahl ist
    const isInteger = Number.isInteger(value);
    return value.toLocaleString('de-DE', {
      minimumFractionDigits: isInteger ? 0 : 2,
      maximumFractionDigits: 2
    });
  }
  </script>
  
  <style scoped>
  .table-container {
    display: flex;
    justify-content: space-between;
  }
  
  .table-section {
    width: 48%;
  }
  </style>