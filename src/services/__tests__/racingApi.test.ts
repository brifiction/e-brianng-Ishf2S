import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getNextRaces, getRacesByCategories } from "../racingApi";
import { type RacingResponse, RACE_CATEGORIES } from "@/types/racing";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data using actual API response structure
const mockApiResponse: RacingResponse = {
  status: 200,
  data: {
    next_to_go_ids: [
      "1000000-0000-0000-0000-000000000000",
      "2000000-0000-0000-0000-000000000000",
      "3000000-0000-0000-0000-000000000000",
      "4000000-0000-0000-0000-000000000000",
      "5000000-0000-0000-0000-000000000000",
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
  message: "Next example 6 races from each category",
};

describe("RacingApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getNextRaces", () => {
    it("should fetch races successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await getNextRaces(5);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=5",
        { signal: expect.any(AbortSignal) }
      );
      expect(result).toEqual(mockApiResponse);
    });

    it("should use default count when not specified", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      await getNextRaces();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=5",
        { signal: expect.any(AbortSignal) }
      );
    });

    it("should handle timeout", async () => {
      mockFetch.mockImplementation(
        () =>
          new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timeout")), 100);
          })
      );

      await expect(getNextRaces(5, { timeout: 50 })).rejects.toThrow(
        "Request timeout"
      );
    });
  });

  describe("getRacesByCategories", () => {
    it("should filter races by categories", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await getRacesByCategories(
        [RACE_CATEGORIES[0].id, RACE_CATEGORIES[1].id, RACE_CATEGORIES[2].id],
        5
      );

      expect(result.data.next_to_go_ids).toHaveLength(5);

      const filteredRace =
        result.data.race_summaries[result.data.next_to_go_ids[0]];

      expect(filteredRace.category_id).toBe(RACE_CATEGORIES[0].id);
      expect(filteredRace.race_name).toBe("Race 1");
    });

    it("should return empty array when no races match categories", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const nonExistentCategoryId = "non-existent-id";
      const result = await getRacesByCategories([nonExistentCategoryId], 3);

      expect(result.data.next_to_go_ids).toHaveLength(0);
    });

    it("should preserve response structure", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const result = await getRacesByCategories([RACE_CATEGORIES[0].id], 3);

      expect(result.status).toBe(200);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data.next_to_go_ids)).toBe(true);
      expect(typeof result.data.race_summaries).toBe("object");
      expect(result.data.next_to_go_ids).toHaveLength(2);
    });

    it("should handle multiple category IDs", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse,
      } as Response);

      const categoryIds = [
        RACE_CATEGORIES[0].id,
        RACE_CATEGORIES[1].id,
        RACE_CATEGORIES[2].id,
      ];
      const result = await getRacesByCategories(categoryIds, 5);

      expect(result.data.next_to_go_ids.length).toBeGreaterThan(0);

      const filteredRaces = Object.values(result.data.race_summaries);

      for (const race of filteredRaces) {
        expect(categoryIds).toContain(race.category_id);
      }
    });
  });
});
