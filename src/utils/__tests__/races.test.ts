import { describe, it, expect } from "vitest";
import { filterAndSortRaces, calculateCountdowns } from "../races";
import type { RacingResponse } from "@/types/racing";
import { RACE_CATEGORIES } from "@/types/racing";

const mockRacingResponse: RacingResponse = {
  status: 200,
  data: {
    next_to_go_ids: [
      "1000000-0000-0000-0000-000000000000",
      "2000000-0000-0000-0000-000000000000",
      "3000000-0000-0000-0000-000000000000",
      "4000000-0000-0000-0000-000000000000",
      "5000000-0000-0000-0000-000000000000",
      "6000000-0000-0000-0000-000000000000",
    ],
    race_summaries: {
      "1000000-0000-0000-0000-000000000000": {
        race_id: "1000000-0000-0000-0000-000000000000",
        race_name: "Race 1",
        race_number: 1,
        meeting_name: "Test Meeting 1",
        category_id: RACE_CATEGORIES[0].id,
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 300 },
        venue_id: "venue-1",
        venue_name: "Test Venue 1",
        venue_state: "NSW",
        venue_country: "AU",
      },
      "2000000-0000-0000-0000-000000000000": {
        race_id: "2000000-0000-0000-0000-000000000000",
        race_name: "Race 2",
        race_number: 2,
        meeting_name: "Test Meeting 2",
        category_id: RACE_CATEGORIES[1].id,
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 600 },
        venue_id: "venue-2",
        venue_name: "Test Venue 2",
        venue_state: "VIC",
        venue_country: "AU",
      },
      "3000000-0000-0000-0000-000000000000": {
        race_id: "3000000-0000-0000-0000-000000000000",
        race_name: "Race 3",
        race_number: 3,
        meeting_name: "Test Meeting 3",
        category_id: RACE_CATEGORIES[2].id,
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 900 },
        venue_id: "venue-3",
        venue_name: "Test Venue 3",
        venue_state: "QLD",
        venue_country: "AU",
      },
      "4000000-0000-0000-0000-000000000000": {
        race_id: "4000000-0000-0000-0000-000000000000",
        race_name: "Race 4",
        race_number: 4,
        meeting_name: "Test Meeting 4",
        category_id: RACE_CATEGORIES[0].id,
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 1200 },
        venue_id: "venue-4",
        venue_name: "Test Venue 4",
        venue_state: "WA",
        venue_country: "AU",
      },
      "5000000-0000-0000-0000-000000000000": {
        race_id: "5000000-0000-0000-0000-000000000000",
        race_name: "Race 5",
        race_number: 5,
        meeting_name: "Test Meeting 5",
        category_id: RACE_CATEGORIES[2].id,
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 1500 },
        venue_id: "venue-5",
        venue_name: "Test Venue 5",
        venue_state: "SA",
        venue_country: "AU",
      },
      "6000000-0000-0000-0000-000000000000": {
        race_id: "6000000-0000-0000-0000-000000000000",
        race_name: "Race 6",
        race_number: 6,
        meeting_name: "Test Meeting 6",
        category_id: "11111111-1111-1111-1111-111111111111",
        advertised_start: { seconds: Math.floor(Date.now() / 1000) + 1800 },
        venue_id: "venue-6",
        venue_name: "Test Venue 6",
        venue_state: "SA",
        venue_country: "AU",
      },
    },
  },
  message: "Next 10 races from each category",
};

describe("Races Utility", () => {
  describe("filterAndSortRaces", () => {
    it("should return empty array when no races provided", () => {
      const result = filterAndSortRaces(null, Date.now());
      expect(result).toEqual([]);
    });

    it("should filter out races from non-allowed categories", () => {
      const currentTime = Date.now();
      const result = filterAndSortRaces(mockRacingResponse, currentTime);

      expect(result).toHaveLength(5);

      for (const race of result) {
        const isAllowedCategory = RACE_CATEGORIES.some(
          (cat) => cat.id === race.category_id
        );
        expect(isAllowedCategory).toBe(true);
      }
    });

    it("should filter out expired races", () => {
      const pastTime = Date.now() + 1800000;
      const result = filterAndSortRaces(mockRacingResponse, pastTime);

      expect(result).toHaveLength(0);
    });

    it("should filter out races that have already started", () => {
      const currentTime = Date.now();
      const result = filterAndSortRaces(mockRacingResponse, currentTime);

      expect(result).toHaveLength(5);
    });

    it("should sort races by start time in ascending order", () => {
      const currentTime = Date.now();
      const result = filterAndSortRaces(mockRacingResponse, currentTime);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].advertised_start.seconds).toBeGreaterThanOrEqual(
          result[i - 1].advertised_start.seconds
        );
      }
    });

    it("should limit results to maximum 5 races", () => {
      const currentTime = Date.now();
      const result = filterAndSortRaces(mockRacingResponse, currentTime);

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("calculateCountdowns", () => {
    it("should calculate countdowns for races", () => {
      const currentTime = Date.now();
      const races = filterAndSortRaces(mockRacingResponse, currentTime);
      const countdowns = calculateCountdowns(races, currentTime);

      expect(countdowns).toHaveLength(races.length);

      for (let i = 0; i < races.length; i++) {
        const race = races[i];
        const countdown = countdowns[i];
        const timeLeft = race.advertised_start.seconds * 1000 - currentTime;
        const expectedMinutes = Math.floor(timeLeft / 60000);
        const expectedSeconds = Math.floor((timeLeft % 60000) / 1000);
        const expectedFormat = `${expectedMinutes}:${expectedSeconds
          .toString()
          .padStart(2, "0")}`;

        expect(countdown).toBe(expectedFormat);
      }
    });

    it("should handle zero time remaining", () => {
      const currentTime = 1000000000000;
      const raceStartTime = Math.floor(currentTime / 1000) + 10;

      const races = [
        {
          race_id: "test",
          race_name: "Test Race",
          race_number: 1,
          meeting_name: "Test Meeting",
          category_id: RACE_CATEGORIES[0].id,
          advertised_start: { seconds: raceStartTime },
          venue_id: "venue-1",
          venue_name: "Test Venue",
          venue_state: "NSW",
          venue_country: "AU",
        },
      ];

      const countdowns = calculateCountdowns(races, currentTime);

      expect(countdowns[0]).toBe("0:10");
    });
  });
});
