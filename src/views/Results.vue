<template>
  <div class="p-4">
    <div class="flex space-x-4 mb-4">
      <!-- Zeitraum Select für Vergleich 1 -->
      <div>
        <label class="block text-sm font-medium">Periode Vergleich 1</label>
        <select
          v-model="selectedPeriod1"
          @change="() => fetchData('data1')"
          class="p-2 border rounded text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800"        >
          <option v-for="period in periods" :key="period" :value="period">
            Periode {{ period }}
          </option>
        </select>
      </div>

      <!-- Zeitraum Select für Vergleich 2 -->
      <div>
        <label class="block text-sm font-medium">Periode Vergleich 2</label>
        <select
          v-model="selectedPeriod2"
          @change="() => fetchData('data2')"
          class="p-2 border rounded text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800"
        >
          <option v-for="period in periods" :key="period" :value="period">
            Periode {{ period }}
          </option>
        </select>
      </div>

      <!-- Kategorie Select -->
      <div>
        <label class="block text-sm font-medium">Kategorie</label>
        <select v-model="selectedCategory" class="p-2 border rounded text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800">
          <option
            v-for="category in categoryOptions"
            :key="category.key"
            :value="category.key"
          >
            {{ category.label }}
          </option>
        </select>
      </div>

      <!-- Hauptbereich Select (nur aktiv, wenn nicht Spezialkategorie) -->
      <div>
        <label class="block text-sm font-medium">Hauptbereich</label>
        <select
          v-model="selectedMainArea"
          :disabled="isSpecialCategory && selectedCategory !== 'Periodenergebnis'"
          class="p-2 border rounded text-gray-800 dark:text-gray-300 bg-white dark:bg-gray-800"
        >
          <option
            v-for="mainArea in mainAreas"
            :key="mainArea"
            :value="mainArea"
          >
            {{ mainArea }}
          </option>
        </select>
      </div>
    </div>

    <!-- Fehleranzeige -->
    <div v-if="errorMessage" class="text-red-500 mb-4">
      {{ errorMessage }}
    </div>

    <!-- Vergleichstabellen -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Vergleich 1 -->
      <div>
        <h2 class="text-lg font-bold mb-2">Vergleich 1</h2>
        <!-- Standard Tabelle -->
        <Table v-if="!isSpecialCategory">
          <TableCaption>Daten für Vergleich 1</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Feldname</TableHead>
              <TableHead
                v-for="subArea in subAreas"
                :key="subArea"
              >
              {{ fieldNameMapping[subArea] || subArea }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="field in fieldNames" :key="field">
              <TableCell>{{ fieldNameMapping[field] || field }}</TableCell>
              <TableCell
                v-for="subArea in subAreas"
                :key="subArea"
              >
                {{ getValue(filteredData1, subArea, field) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Tabelle für Qualitäten -->
        <Table v-else-if="selectedCategory === 'Qualitaeten'">
          <TableCaption>Daten für Qualitäten Vergleich 1</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Feldname</TableHead>
              <TableHead
                v-for="subGroup in qualitaetenSubGroups"
                :key="subGroup"
              >
              {{ fieldNameMapping[subGroup] || subGroup }}
              </TableHead>
              <TableHead>Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Top-Level Felder -->

            <!-- Subgruppen Felder -->
            <TableRow v-for="subField in qualitaetenFields"
            :key="subField">
              <TableCell>{{ fieldNameMapping[subField] || subField }}</TableCell>
              <TableCell v-for="subGroup in qualitaetenSubGroups"
                :key="subGroup"
              >
                {{ getValue(filteredData1, subGroup, subField) }}
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Durchschnitt</TableCell>
                <TableCell v-for="subGroup in qualitaetenSubGroups"
                    :key="subGroup"
                >
                {{ getValue(filteredData1, subGroup, "SummeQual") }}
                </TableCell>
                <TableCell>{{ getValue(filteredData1, 'GesamtQualitaet', null) }}</TableCell>     
            </TableRow>
            <TableRow v-for="field in qualitaetenTopFields" :key="field">
              <TableCell>{{ fieldNameMapping[field] || field }}</TableCell>
              <TableCell v-for="subGroup in qualitaetenSubGroups"
                    :key="subGroup"
                >
                </TableCell>
              <TableCell colspan="3">{{ getValue(filteredData1, field, null) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Tabelle für Ankunftsraten -->
        <Table v-else-if="selectedCategory === 'Ankuenfte'">
          <TableCaption>Daten für Ankunftsraten Vergleich 1</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Not</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="day in ankuenfteDays" :key="day">
              <TableCell>{{ day }}</TableCell>
              <TableCell>{{ getValue(filteredData1, 'Rate', day) }}</TableCell>
              <TableCell>{{ getValue(filteredData1, 'Not', day) }}</TableCell>
            </TableRow>

          </TableBody>
        </Table>
        <!-- Spezielle Tabelle für Periodenergebnis und Ergebnis -->
        <Table v-else-if="selectedCategory === 'Periodenergebnis' && selectedMainArea === 'Ergebnis'">
        <TableCaption>Periodenergebnis</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead>Feld</TableHead>
            <TableHead>Periodenergebnis</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(value, key) in filteredData2" :key="key">
                <TableCell>{{ fieldNameMapping[key] || key }}</TableCell>
                <TableCell>{{ getValue(filteredData2, key, null) }}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
      </div>

      <!-- Vergleich 2 -->
      <div>
        <h2 class="text-lg font-bold mb-2">Vergleich 2</h2>
        <!-- Standard Tabelle -->
        <Table v-if="!isSpecialCategory">
          <TableCaption>Daten für Vergleich 2</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Feldname</TableHead>
              <TableHead
                v-for="subArea in subAreas"
                :key="subArea"
              >
              {{ fieldNameMapping[subArea] || subArea }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="field in fieldNames" :key="field">
              <TableCell>{{ fieldNameMapping[field] || field }}</TableCell>
              <TableCell
                v-for="subArea in subAreas"
                :key="subArea"
              >
                {{ getValue(filteredData2, subArea, field) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Tabelle für Qualitäten -->
        <Table v-else-if="selectedCategory === 'Qualitaeten'">
          <TableCaption>Daten für Qualitäten Vergleich 2</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Feldname</TableHead>
              <TableHead
                v-for="subGroup in qualitaetenSubGroups"
                :key="subGroup"
              >
              {{ fieldNameMapping[subGroup] || subGroup }}
              </TableHead>
              <TableHead>Gesamt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <!-- Top-Level Felder -->

            <!-- Subgruppen Felder -->
            <TableRow v-for="subField in qualitaetenFields"
            :key="subField">
              <TableCell>{{ fieldNameMapping[subField] || subField }}</TableCell>
              <TableCell v-for="subGroup in qualitaetenSubGroups"
                :key="subGroup"
              >
                {{ getValue(filteredData2, subGroup, subField) }}
              </TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Durchschnitt</TableCell>
                <TableCell v-for="subGroup in qualitaetenSubGroups"
                    :key="subGroup"
                >
                {{ getValue(filteredData2, subGroup, "SummeQual") }}
                </TableCell>
                <TableCell>{{ getValue(filteredData2, 'GesamtQualitaet', null) }}</TableCell>     
            </TableRow>
            <TableRow v-for="field in qualitaetenTopFields" :key="field">
              <TableCell> {{ fieldNameMapping[field] || field }}</TableCell>
              <TableCell v-for="subGroup in qualitaetenSubGroups"
                    :key="subGroup"
                >
                </TableCell>
              <TableCell colspan="3">{{ getValue(filteredData2, field, null) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <!-- Tabelle für Ankunftsraten -->
        <Table v-else-if="selectedCategory === 'Ankuenfte'">
          <TableCaption>Daten für Ankunftsraten Vergleich 2</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Not</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="day in ankuenfteDays" :key="day">
              <TableCell>{{ day }}</TableCell>
              <TableCell>{{ getValue(filteredData2, 'Rate', day) }}</TableCell>
              <TableCell>{{ getValue(filteredData2, 'Not', day) }}</TableCell>
            </TableRow>

        
          </TableBody>
        </Table>
        <!-- Spezielle Tabelle für Periodenergebnis und Ergebnis -->
        <Table v-else-if="selectedCategory === 'Periodenergebnis' && selectedMainArea === 'Ergebnis'">
        <TableCaption>Periodenergebnis</TableCaption>
        <TableHeader>
            <TableRow>
            <TableHead>Feld</TableHead>
            <TableHead>Periodenergebnis</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow v-for="(value, key) in filteredData2" :key="key">
                <TableCell>{{ fieldNameMapping[key] || key }}</TableCell>
                <TableCell>{{ getValue(filteredData2, key, null) }}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useGameDataStore } from '@/stores/data';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';


// Stores
const gameDataStore = useGameDataStore();
const authStore = useAuthStore();

// Reaktive Referenzen
const selectedPeriod1 = ref<number>(0);
const selectedPeriod2 = ref<number>(0);
const selectedCategory = ref<string>('Belegungsdaten'); // Initialer Key
const selectedMainArea = ref<string>(''); // Initial leer, wird später gesetzt

const periods = ref<number[]>([]);

// Mapping der Kategorien
const categoryOptions = [
  { label: 'Belegungsdaten', key: 'Belegungsdaten' },
  { label: 'Periodenergebnis', key: 'Periodenergebnis' },
  { label: 'Deckungsbeiträge', key: 'DB' },
  { label: 'Vollkosten', key: 'Kosten' },
  { label: 'Qualitäten', key: 'Qualitaeten' },
  { label: 'Ankunftsraten', key: 'Ankuenfte' },
  { label: 'Personal', key: 'Personal' },
];

const data1 = ref<Record<string, any>>({});
const data2 = ref<Record<string, any>>({});

const errorMessage = ref<string>('');

// Mapping der Feldnamen
const fieldNameMapping: Record<string, string> = {
  Innere: 'Innere Medizin',
  Chir: 'Chirurgie',
  Gyn: 'Gynäkologie',
  SummeAbt: 'Summe Abteilungen',
  medQualitaet: 'Medizinische Qualität',
  GesamtQualitaet: 'Gesamtqualität',
  VerwaltungsQualitaet: 'Verwaltungsqualität',
  Durchschnitt: 'Durchschnitt',
  Ergebnis: 'Periodenergebnis',
  DbChir: 'DB Chirurgie',
  DbGyn: 'DB Gynäkologie',
  DbInnere: 'DB Innere Medizin',
  DbWahl1: 'DB Wahl 1',
  DbWahl2: 'DB Wahl 2',
  KostenFunktion: 'Kosten Funktion',
  KostenZentral: 'Kosten Zentral',
  SummeDb: 'Summe DB',
  Ueberschuss: 'Überschuss',
  UeberschussAlle: 'Überschuss Alle',
  // Weitere Feldnamen bei Bedarf hinzufügen
};

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// Computed Property zur Überprüfung, ob die ausgewählte Kategorie eine Spezialkategorie ist
const isSpecialCategory = computed(() => {
  if (selectedCategory.value === 'Periodenergebnis') {
    return selectedMainArea.value === 'Ergebnis';
  }
  return ['Qualitaeten', 'Ankuenfte'].includes(selectedCategory.value);
});

// Computed Property für Hauptbereiche basierend auf ausgewählter Kategorie
const mainAreas = computed(() => {
  if (isSpecialCategory.value && selectedCategory.value !== 'Periodenergebnis') {
    return [];
  }
  if (data1.value && data1.value[selectedCategory.value]) {
    return Object.keys(data1.value[selectedCategory.value]);
  }
  return [];
});

// Computed Property für SubAreas basierend auf ausgewählter Kategorie und Hauptbereich
const subAreas = computed(() => {
  if (isSpecialCategory.value && selectedCategory.value !== 'Periodenergebnis') {
    return [];
  }
  if (
    data1.value &&
    data1.value[selectedCategory.value] &&
    data1.value[selectedCategory.value][selectedMainArea.value]
  ) {
    return Object.keys(data1.value[selectedCategory.value][selectedMainArea.value]);
  }
  return [];
});

// Computed Property für Feldnamen basierend auf SubAreas
const fieldNames = computed(() => {
  if (isSpecialCategory.value && selectedCategory.value !== 'Periodenergebnis') {
    return [];
  }
  if (selectedCategory.value === 'Periodenergebnis' && selectedMainArea.value === 'Ergebnis') {
    return Object.keys(data1.value[selectedCategory.value][selectedMainArea.value]);
  }
  const fieldsSet = new Set<string>();
  subAreas.value.forEach(subArea => {
    const fields = Object.keys(
      data1.value[selectedCategory.value][selectedMainArea.value][subArea] || {}
    );
    fields.forEach(field => fieldsSet.add(field));
  });
  return Array.from(fieldsSet);
});

// Computed Properties zur Filterung der Daten basierend auf Kategorie und Hauptbereich
const filteredData1 = computed(() => {
  if (isSpecialCategory.value && (selectedCategory.value != 'Periodenergebnis' && selectedMainArea.value !== 'Ergebnis')) {
    return data1.value[selectedCategory.value] || {};
  }
  if (!data1.value || !selectedCategory.value || !selectedMainArea.value) return {};
  return data1.value[selectedCategory.value][selectedMainArea.value] || {};
});

const filteredData2 = computed(() => {
  if (isSpecialCategory.value &&  (selectedCategory.value != 'Periodenergebnis' && selectedMainArea.value !== 'Ergebnis')) {
    return data2.value[selectedCategory.value] || {};
  }
  if (!data2.value || !selectedCategory.value || !selectedMainArea.value) return {};
  return data2.value[selectedCategory.value][selectedMainArea.value] || {};
});

// Spezifische Computed Properties für Qualitäten
const qualitaetenTopFields = computed(() => {
  if (selectedCategory.value !== 'Qualitaeten') return [];
  return ['GesamtQualitaet', 'VerwaltungsQualitaet'];
});

const qualitaetenSubGroups = computed(() => {
  if (selectedCategory.value !== 'Qualitaeten') return [];
  return ['Patientenbefragung', 'medQualitaet', 'SummeAbt'];
});

const qualitaetenFields = computed(() => {
  if (selectedCategory.value !== 'Qualitaeten') return [];
  const fieldsSet = new Set<string>();
  qualitaetenSubGroups.value.forEach(group => {
    const fields = Object.keys(
      data1.value[selectedCategory.value][group] || {}
    );
    fields.forEach(field => {
      if (field !== 'SummeQual') {
        fieldsSet.add(field);
      }
    });
  });
  console.log('Qualitäten Felder:', Array.from(fieldsSet));
  return Array.from(fieldsSet);
});

// Spezifische Computed Properties für Ankunftsraten
const ankuenfteDays = computed(() => {
  if (selectedCategory.value !== 'Ankuenfte') return [];
  return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So', 'Average'];
});

// Funktion zum Ermitteln des aktuellen Periodenindex
const getCurrentPeriod = (): number => {
  return gameDataStore.metadata.currentPeriod;
};

// Funktion zum Generieren der Perioden
const generatePeriods = async () => {
  const current = getCurrentPeriod();
  periods.value = Array.from({ length: current + 1 }, (_, i) => i);
  selectedPeriod1.value = current;
  selectedPeriod2.value = current > 1 ? current - 1 : 0; // Initial unterschiedliche Perioden
};

// Funktion zum Abrufen der Daten
const fetchData = async (dataType: 'data1' | 'data2') => {
  try {
    console.log("selected periods", selectedPeriod1.value, selectedPeriod2.value);
    const token = authStore.accessToken || localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const period =
      dataType === 'data1' ? selectedPeriod1.value : selectedPeriod2.value;

    // Vermeidung von redundanten API-Aufrufen
    if (
      dataType === 'data2' &&
      selectedPeriod2.value === selectedPeriod1.value
    ) {
      data2.value = { ...data1.value };
      return;
    }

    const response = await axios.get(`/api/periods/${period}`, { headers });

    // Annahme: Die API gibt ein Objekt mit einer 'results' Eigenschaft zurück
    const result = response.data['results']; // Anpassung je nach Datenstruktur
    console.log(`Daten für ${dataType}:`, result);

    if (dataType === 'data1') {
      data1.value = result;
    } else {
      data2.value = result;
    }

    errorMessage.value = ''; // Fehler zurücksetzen
  } catch (error) {
    console.error(`Fehler beim Abrufen der Daten für ${dataType}:`, error);
    errorMessage.value = `Fehler beim Abrufen der Daten für ${dataType}. Bitte versuchen Sie es später erneut.`;
  }
};

// Funktion zum Abrufen des Wertes aus den Daten
const getValue = (
  filteredData: Record<string, any>,
  key: string,
  field: string | null
): string => {
  const displayKey = fieldNameMapping[key] || key;
  const value = field ? filteredData[key]?.[field] : filteredData[key];

  if (isSpecialCategory.value) {
    if (selectedCategory.value === 'Qualitaeten') {
      return value !== undefined ? formatNumber(Number(value)) : '-';
    } else if (selectedCategory.value === 'Ankuenfte') {
      return value !== undefined ? formatNumber(Number(value)) : '-';
    } else if (selectedCategory.value === 'Periodenergebnis') {
      return value !== undefined ? formatNumber(Number(value)) : '-';
    }
  } else {
    return value !== undefined ? formatNumber(Number(value)) : '-';
  }

  return '-';
};

// Initialisierung beim Mounten
onMounted(() => {
  generatePeriods();
  fetchData('data1');
  fetchData('data2');
});

// Watcher für Kategorieänderungen, um ausgewählten Hauptbereich zu aktualisieren
watch(selectedCategory, (newCategory) => {
  if (isSpecialCategory.value && newCategory !== 'Periodenergebnis') {
    selectedMainArea.value = '';
  } else {
    const availableMainAreas = data1.value[newCategory]
      ? Object.keys(data1.value[newCategory])
      : [];
    if (!availableMainAreas.includes(selectedMainArea.value)) {
      selectedMainArea.value = availableMainAreas.length > 0 ? availableMainAreas[0] : '';
    }
  }
});

// Watcher für Hauptbereichsänderungen, um ausgewählten Hauptbereich zu validieren
watch([selectedCategory, selectedMainArea], () => {
    if (isSpecialCategory.value && (selectedCategory.value !== 'Periodenergebnis' || selectedMainArea.value === 'Ergebnis')) {
    selectedMainArea.value = mainAreas.value.length > 0 ? mainAreas.value[0] : '';
  }
});
</script>

<style scoped>
/* Optionales Styling */
label {
  display: block;
  margin-bottom: 0.25rem;
}
</style>