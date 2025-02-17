<template>
  <div class="results-layout">
    <div class="controls">
      <div class="select-group">
        <label for="category-select">Kategorie:</label>
        <select id="category-select" v-model="selectedCategory">
          <option v-for="category in categoryOptions" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="select-group">
        <label for="subcategory-select">Unterkategorie:</label>
        <select id="subcategory-select" v-model="selectedSubcategory">
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
          <select :id="'period-select-' + (index + 1)" v-model="selectedPeriods[index]" @change="onPeriodChange(index)">
            <option v-for="period in periods" :key="period" :value="period">
              {{ period }}
            </option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Schlüssel</th>
              <th>Wert</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in tableData[index]" :key="idx">
              <td>{{ item.key }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useGameDataStore } from '@/stores/data';

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
const tableData = ref<{ key: string; value: any }[][]>([[], []]);

// Token for authentication
const authStore = useAuthStore();

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

      // Store the fetched data
      periodData.value[period] = results;

      // Set the table data based on the selected category and subcategory
      if (
        results &&
        results.Periode &&
        results.Periode.Belegungsdaten[selectedCategory.value] &&
        results.Periode.Belegungsdaten[selectedCategory.value][selectedSubcategory.value]
      ) {
        const relevantData = results.Periode.Belegungsdaten[selectedCategory.value][selectedSubcategory.value];
        const entries = Object.entries(relevantData);
        tableData.value[tableIndex] = entries.map(([key, value]) => ({ key, value }));
      } else {
        tableData.value[tableIndex] = [];
      }
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

// Extract categories and subcategories from the fetched period data
const extractCategories = () => {
  // Assuming categories are consistent across periods
  // Extract from the first period that has data
  const periodsFetched = Object.keys(periodData.value).map(p => parseInt(p, 10)).sort((a, b) => a - b);
  for (const period of periodsFetched) {
    const results = periodData.value[period];
    if (results && results.Periode && results.Periode.Belegungsdaten) {
      const fetchedCategories = Object.keys(results.Periode.Belegungsdaten);
      if (fetchedCategories.length > 0) {
        categoryOptions.value = fetchedCategories;
        selectedCategory.value = categoryOptions.value[0];
        // Extract subcategories based on the selected category
        const fetchedSubcategories = Object.keys(results.Periode.Belegungsdaten[selectedCategory.value]);
        subcategoryOptions.value = fetchedSubcategories;
        selectedSubcategory.value = subcategoryOptions.value[0] || '';
        break;
      }
    }
  }
};

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
      const results = periodData.value[period];
      if (
        results &&
        results.Periode &&
        results.Periode.Belegungsdaten[selectedCategory.value] &&
        results.Periode.Belegungsdaten[selectedCategory.value][selectedSubcategory.value]
      ) {
        const relevantData = results.Periode.Belegungsdaten[selectedCategory.value][selectedSubcategory.value];
        const entries = Object.entries(relevantData);
        tableData.value[i] = entries.map(([key, value]) => ({ key, value }));
      } else {
        tableData.value[i] = [];
      }
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

.tables-container {
  display: flex;
  gap: 40px;
}

.table-section {
  flex: 1;
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

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ddd;
}

tbody td {
  padding: 8px;
  border: 1px solid #ddd;
}
</style>
