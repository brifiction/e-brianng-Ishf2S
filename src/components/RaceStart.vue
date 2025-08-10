<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";
import { getRacesByCategories } from "@/services/racingApi";
import type { RacingResponse } from "@/types/racing";
import RaceList from "./RaceList.vue";
import { filterAndSortRaces, calculateCountdowns } from "@/utils/races";
import { RACE_CATEGORIES } from "@/types/racing";

const races = ref<RacingResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const currentTime = ref(Date.now());

const filteredRaces = computed(() => {
  return filterAndSortRaces(races.value, currentTime.value);
});

const countdownTimers = computed(() => {
  return calculateCountdowns(filteredRaces.value, currentTime.value);
});

const fetchRaces = async () => {
  loading.value = true;
  error.value = null;

  try {
    const categoryIds = RACE_CATEGORIES.map((cat) => cat.id);
    const response = await getRacesByCategories(categoryIds, 10);
    races.value = response;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to fetch races";
  } finally {
    loading.value = false;
  }
};

const updateTime = () => {
  currentTime.value = Date.now();
};

let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  fetchRaces();
  intervalId = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <main class="app">
    <section class="header">
      <h1>Next to Go Races</h1>
    </section>

    <section v-if="loading" class="loading">Loading races...</section>

    <section v-else-if="error" class="error">
      {{ error }}
    </section>

    <RaceList
      v-else-if="filteredRaces.length > 0"
      :races="filteredRaces"
      :countdowns="countdownTimers"
    />

    <section v-else class="no-races">
      <p>No races available</p>
    </section>
  </main>
</template>

<style scoped>
.app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 20px;
  color: #111827;
  font-size: 28px;
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
}

.error {
  background: #fef2f2;
  color: #dc2626;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #fecaca;
  font-size: 14px;
}

.no-races {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 16px;
}
</style>
