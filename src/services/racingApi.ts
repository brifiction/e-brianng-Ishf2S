import type { RacingResponse } from "@/types/racing";

const API_BASE_URL = "https://api.neds.com.au/rest/v1/racing/";

export interface ApiConfig {
  timeout?: number;
}

export async function getNextRaces(
  count = 5,
  config: ApiConfig = {}
): Promise<RacingResponse> {
  const { timeout = 10000 } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(
      `${API_BASE_URL}?method=nextraces&count=${count}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
}

export async function getRacesByCategories(
  categoryIds: string[],
  count = 10,
  config: ApiConfig = {}
): Promise<RacingResponse> {
  const response = await getNextRaces(count, config);

  const filteredRaces = response.data.next_to_go_ids
    .map((id) => response.data.race_summaries[id])
    .filter((race) => race && categoryIds.includes(race.category_id));

  return {
    ...response,
    data: {
      ...response.data,
      next_to_go_ids: filteredRaces.map((race) => race.race_id),
      race_summaries: Object.fromEntries(
        filteredRaces.map((race) => [race.race_id, race])
      ),
    },
  };
}
