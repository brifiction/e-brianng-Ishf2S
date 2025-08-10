<script setup lang="ts">
import type { Race } from "@/types/racing";
import RaceCard from "./RaceCard.vue";

interface Props {
  races: Race[];
  countdowns: string[];
}

defineProps<Props>();
</script>

<template>
  <section class="races">
    <div class="race-list">
      <RaceCard
        v-for="(race, index) in races"
        :key="race.race_id"
        :race="race"
        :countdown="countdowns[index]"
      />
    </div>
  </section>
</template>

<style scoped>
.races {
  margin-bottom: 20px;
}

.race-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
