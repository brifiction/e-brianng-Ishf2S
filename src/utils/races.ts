import type { RacingResponse, Race } from "@/types/racing";
import { hasRaceExpired } from "@/utils/dates";
import { RACE_CATEGORIES } from "@/types/racing";

const ALLOWED_CATEGORY_IDS = RACE_CATEGORIES.map(cat => cat.id);

export function filterAndSortRaces(
  races: RacingResponse | null,
  currentTime: number
): Race[] {
  if (!races) return [];

  const raceList = Object.values(races.data.race_summaries);

  return raceList
    .filter((race) => {
      const timeLeft = race.advertised_start.seconds * 1000 - currentTime;
      const isAllowedCategory = ALLOWED_CATEGORY_IDS.includes(race.category_id);
      return timeLeft > 0 && !hasRaceExpired(race.advertised_start.seconds) && isAllowedCategory;
    })
    .sort((a, b) => a.advertised_start.seconds - b.advertised_start.seconds)
    .slice(0, 5);
}

export function calculateCountdowns(races: Race[], currentTime: number): string[] {
  return races.map((race) => {
    const timeLeft = race.advertised_start.seconds * 1000 - currentTime;
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });
}
