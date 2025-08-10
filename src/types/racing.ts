export type Race = {
  race_id: string;
  race_name: string;
  race_number: number;
  meeting_name: string;
  category_id: string;
  advertised_start: {
    seconds: number;
  };
  venue_id: string;
  venue_name: string;
  venue_state: string;
  venue_country: string;
};

export type RacingResponse = {
  status: number;
  data: {
    next_to_go_ids: string[];
    race_summaries: Record<string, Race>;
  };
  message: string;
};

export type RaceCategory = {
  id: string;
  name: string;
  displayName: string;
};

export const RACE_CATEGORIES: RaceCategory[] = [
  {
    id: "9daef0d7-bf3c-4f50-921d-8e818c60fe61",
    name: "greyhound",
    displayName: "Greyhound Racing",
  },
  {
    id: "161d9be2-e909-4326-8c2c-35ed71fb460b",
    name: "harness",
    displayName: "Harness Racing",
  },
  {
    id: "4a2788f8-e825-4d36-9894-efd4baf1cfae",
    name: "horse",
    displayName: "Horse Racing",
  },
];
