<template>
  <div class="results-layout">
    <div class="controls">
      <div class="select-group">
        <label for="category-select">Kategorie:</label>
        <select id="category-select" v-model="selectedCategory" class="select-element">
          <option v-for="category in categoryOptions" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="select-group">
        <label for="subcategory-select">Unterkategorie:</label>
        <select id="subcategory-select" v-model="selectedSubcategory" class="select-element">
          <option v-for="subcategory in subcategoryOptions" :key="subcategory" :value="subcategory">
            {{ subcategory }}
          </option>
        </select>
      </div>
    </div>
    <div class="tables-container">
      <div class="table-section" v-for="(selectedPeriod, index) in selectedPeriods" :key="index">
        <div class="period-select">
          <label :for="'period-select-' + (index + 1)">Periode:</label>
          <select :id="'period-select-' + (index + 1)" v-model="selectedPeriods[index]" @change="onPeriodChange(index)" class="select-element">
            <option v-for="period in periods" :key="period" :value="period">
              {{ period }}
            </option>
          </select>
        </div>
        <Table>
          <TableCaption>Periode: {{ selectedPeriods[index] }}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead class="w-[200px]">Schlüssel</TableHead>
              <TableHead v-for="category in dynamicCategories" :key="category">{{ category }}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(item, idx) in tableData[index]" :key="idx">
              <TableCell class="font-medium">{{ item.key }}</TableCell>
              <TableCell v-for="category in dynamicCategories" :key="category">
                {{ formatValue(item.values[category]) }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
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
} from '@/components/ui/table'

// Initialize the game data store
const gameDataStore = useGameDataStore();
const initData = async () => {
  await gameDataStore.load();
};

// Define interfaces for the data structure
interface ResultData {
  [key: string]: any;
}

// Reactive references
const categoryOptions = ref<string[]>([]);
const selectedCategory = ref<string>('');
const subcategoryOptions = ref<string[]>([]);
const selectedSubcategory = ref<string>('');
const periods = ref<number[]>([]);
const selectedPeriods = ref<number[]>([0, 0]);
const periodData = ref<Record<number, ResultData>>({});
const tableData = ref<{ key: string; values: Record<string, any> }[][]>([[], []]);

// Computed property for dynamic categories
const dynamicCategories = computed(() => {
  // Assuming that the categories are keys within the selected category and subcategory
  if (
    periodData.value[selectedPeriods.value[0]] &&
    periodData.value[selectedPeriods.value[0]][selectedCategory.value] &&
    periodData.value[selectedPeriods.value[0]][selectedCategory.value][selectedSubcategory.value]
  ) {
    return Object.keys(periodData.value[selectedPeriods.value[0]][selectedCategory.value][selectedSubcategory.value]);
  }
  return [];
});

// Theme handling is now managed globally via App.vue

// Token für Authentifizierung
const authStore = useAuthStore();

// Utility function to format values
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number') {
    return value.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  return String(value);
};

// Fetch table data for a specific period and store it
const fetchTableData = async (period: number, tableIndex: number) => {
  try {
    const response = await fetch(`/api/periods/${period}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      const results: ResultData = data.results;

      // manual data transformation
      if (results["Belegungsdaten"] && results["Belegungsdaten"]["BelegGesamt"]) {
        const belegGesamt = results["Belegungsdaten"]["BelegGesamt"];
        const belegGradNotfall = belegGesamt["BelegGradNotfall"];
        delete belegGesamt["BelegGradNotfall"];
        
        const keys = Object.keys(belegGesamt);
        keys.forEach((key, index) => {
          belegGesamt[key]["BelegGradNotfall"] = null;
          if (index === keys.length - 1 && belegGradNotfall !== undefined) {
            belegGesamt[key]["BelegGradNotfall"] = belegGradNotfall;
          }
        });
      }
      if(results['Periodenergebnis'] && results['Periodenergebnis']['Ergebnis']) {
        const Ergebnis = results['Periodenergebnis']['Ergebnis'];
        results['Periodenergebnis']['Ergebnis'] ={ "Ergebnis": Ergebnis};
      }
      if(results['Qualitaeten']) {
        const VerwaltungsQualitaet = results['Qualitaeten']['VerwaltungsQualitaet'];
        const GesamtQualitaet = results['Qualitaeten']['GesamtQualitaet'];
        const GesamtKrankenhaus = results['Qualitaeten']['GesamtKrankenhaus'];
        delete results['Qualitaeten']['VerwaltungsQualitaet'];
        delete results['Qualitaeten']['GesamtQualitaet'];
        delete results['Qualitaeten']['GesamtKrankenhaus'];
        const keys = Object.keys(results['Qualitaeten']);
        keys.forEach((key, index) => {
          results['Qualitaeten'][key]["VerwaltungsQualitaet"] = null;
          results['Qualitaeten'][key]["GesamtQualitaet"] = null;
          results['Qualitaeten'][key]["Durchschnitt"] = results['Qualitaeten'][key]["SummeQual"];
          delete results['Qualitaeten'][key]["SummeQual"];

        });
        results['Qualitaeten']["Gesamt"] = {"Innere": null, "Chir": null, "Gyn": null,"VerwaltungsQualitaet": VerwaltungsQualitaet, "Durchschnitt": GesamtQualitaet, "GesamtQualitaet": GesamtKrankenhaus
        }
        results['Qualitaeten'] = {"Qualitaeten": results['Qualitaeten']};
      }
      if(results['Ankuenfte']) {
        results['Ankuenfte'] = {"Ankunftsraten": results['Ankuenfte']};
      }

      // Store the fetched data
      periodData.value[period] = results;

      // Compute table data separately
      computeTableData(period, tableIndex);
    } else {
      console.error(`Failed to fetch data for period ${period}.`);
      tableData.value[tableIndex] = [];
      periodData.value[period] = {};
    }
  } catch (error) {
    console.error(`Error fetching data for period ${period}:`, error);
    tableData.value[tableIndex] = [];
    periodData.value[period] = {};
  }
};

// Compute table data based on selected category and subcategory
const computeTableData = (period: number, tableIndex: number) => {
  const results = periodData.value[period];
  if (
    results &&
    results[selectedCategory.value] &&
    results[selectedCategory.value][selectedSubcategory.value]
  ) {
    const relevantData = results[selectedCategory.value][selectedSubcategory.value];
    const categories = dynamicCategories.value;
    const keysSet = new Set<string>();

    // Collect all keys from each category
    categories.forEach(category => {
      const categoryData = relevantData[category];
      if (categoryData && typeof categoryData === 'object') {
        Object.keys(categoryData).forEach(key => keysSet.add(key));
      }
    });

    const keys = Array.from(keysSet).sort();

    // Build tableData
    const data = keys.map(key => {
      const values: Record<string, any> = {};
      categories.forEach(category => {
        if (relevantData[category] && relevantData[category][key] !== undefined) {
          values[category] = relevantData[category][key];
        } else {
          values[category] = null;
        }
      });
      return { key, values };
    });

    tableData.value[tableIndex] = data;
  } else {
    console.error(`No data found for category: ${selectedCategory.value}, subcategory: ${selectedSubcategory.value}`);
    tableData.value[tableIndex] = [];
  }
};

// Extract categories and subcategories from the fetched period data
const extractCategories = () => {
  // Assuming categories are consistent across periods
  // Extract from the first period that has data
  const periodsFetched = Object.keys(periodData.value).map(p => parseInt(p, 10)).sort((a, b) => a - b);
  for (const period of periodsFetched) {
    const results = periodData.value[period];
    if (results) {
      const fetchedCategories = Object.keys(results).filter(key => typeof results[key] === 'object');
      if (fetchedCategories.length > 0) {
        categoryOptions.value = fetchedCategories;
        selectedCategory.value = categoryOptions.value[0];
        // Extract subcategories based on the selected category
        const fetchedSubcategories = Object.keys(results[selectedCategory.value]);
        subcategoryOptions.value = fetchedSubcategories;
        selectedSubcategory.value = subcategoryOptions.value[0] || '';
        break;
      }
    }
  }
};

// Watcher to handle changes in selectedCategory
watch(
  selectedCategory,
  (newCategory) => {
    if (
      periodData.value[selectedPeriods.value[0]] &&
      periodData.value[selectedPeriods.value[0]][newCategory]
    ) {
      const newSubcategories = Object.keys(periodData.value[selectedPeriods.value[0]][newCategory]);
      subcategoryOptions.value = newSubcategories;
      selectedSubcategory.value = newSubcategories[0] || '';
    } else {
      subcategoryOptions.value = [];
      selectedSubcategory.value = '';
    }
  },
  { immediate: false }
);

// Initialize data on mount
onMounted(async () => {
  await initData();
  const currentPeriod = gameDataStore.metadata.currentPeriod;
  periods.value = Array.from({ length: currentPeriod + 1 }, (_, i) => i);
  selectedPeriods.value = [currentPeriod, currentPeriod]; // Set to current period

  // Fetch data for selected periods
  await Promise.all([
    fetchTableData(selectedPeriods.value[0], 0),
    fetchTableData(selectedPeriods.value[1], 1),
  ]);

  // Extract categories once from the fetched data
  extractCategories();
});

// Watcher to update table data when the selected periods change
watch(
  selectedPeriods,
  async (newPeriods, oldPeriods) => {
    for (let i = 0; i < newPeriods.length; i++) {
      await fetchTableData(newPeriods[i], i);
    }
  },
  { deep: true }
);

// Watcher to update table data when the selected category or subcategory changes
watch(
  [selectedCategory, selectedSubcategory],
  () => {
    for (let i = 0; i < selectedPeriods.value.length; i++) {
      const period = selectedPeriods.value[i];
      computeTableData(period, i);
    }
  },
  { deep: true }
);

// Handle period change to update table data
const onPeriodChange = async (tableIndex: number) => {
  const period = selectedPeriods.value[tableIndex];
  await fetchTableData(period, tableIndex);
};
</script>

<style scoped>
.results-layout {
  display: flex;
  flex-direction: column;
  padding: 20px;
}

/* Light Mode */
.results-layout .controls,
.results-layout .table-section table,
.results-layout .select-group select {
  background-color: #ffffff;
  color: #000000;
}

.results-layout .table-section th,
.results-layout .table-section td {
  border: 1px solid #ddd;
}

.results-layout .table-section th {
  background-color: #f2f2f2;
}

.results-layout .select-element {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ccc;
}

/* Dark Mode */
.dark .results-layout .controls,
.dark .results-layout .table-section table,
.dark .results-layout .select-group select {
  background-color: #2d2d2d;
  color: #ffffff;
}

.dark .results-layout .table-section th,
.dark .results-layout .table-section td {
  border: 1px solid #444;
}

.dark .results-layout .table-section th {
  background-color: #3c3c3c;
}

.dark .results-layout .select-element {
  background-color: #2d2d2d;
  color: #ffffff;
  border: 1px solid #555;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.select-group {
  display: flex;
  flex-direction: column;
}

.select-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.select-element {
  padding: 5px;
  border-radius: 4px;
  appearance: none;
  /* Ensures the select elements blend with custom styles */
}

/* Style for the select dropdown arrow */
.select-element {
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 10px 5px;
}

.tables-container {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
}

.table-section {
  flex: 1;
  min-width: 500px;
}

.period-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.period-select label {
  margin-bottom: 5px;
  font-weight: bold;
}

.table-section table {
  width: 100%;
  border-collapse: collapse;
}

.table-section th,
.table-section td {
  padding: 8px;
}

.table-section th {
  text-align: left;
}

.table-section .font-medium {
  font-weight: 500;
}

/* Transition for smooth theme change */
.results-layout,
.controls,
.select-group select,
.select-element,
.table-section table,
.table-section th,
.table-section td {
  transition: background-color 0.3s, color 0.3s, border 0.3s;
}
</style>
