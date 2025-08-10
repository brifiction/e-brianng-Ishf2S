<script setup lang="ts">
import type { Race } from "@/types/racing";
import { getCategoryName } from "@/utils/categories";

interface Props {
  race: Race;
  countdown: string;
}

defineProps<Props>();
</script>

<template>
  <div class="race-card">
    <div class="race-header">
      <div class="race-info">
        <h3>{{ race.meeting_name }}</h3>
        <p>Venue: {{ race.venue_name }}</p>
      </div>
      <div class="race-number">Race {{ race.race_number }}</div>
    </div>

    <div class="race-details">
      <span class="category">{{ getCategoryName(race.category_id) }}</span>
      <span class="countdown">{{ countdown }}</span>
    </div>
  </div>
</template>

<style scoped>
.race-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 12px;
}

.race-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.race-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.race-info p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.race-number {
  background: #3b82f6;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.race-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #4b5563;
}

.category {
  background: #f3f4f6;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.countdown {
  font-weight: 600;
  color: #059669;
  font-family: monospace;
  font-size: 16px;
}

@media (max-width: 600px) {
  .race-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
