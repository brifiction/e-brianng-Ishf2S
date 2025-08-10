import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRaceStartTime, getTimeUntilRace, hasRaceExpired } from "../dates";

describe("Date Utilities", () => {
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date("2025-01-01T12:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getRaceStartTime", () => {
    it("should convert seconds to Date object", () => {
      const seconds = 1735732800; // 2025-01-01 12:00:00 UTC
      const result = getRaceStartTime(seconds);

      expect(result).toBeInstanceOf(Date);
      expect(result.getTime()).toBe(seconds * 1000);
    });
  });

  describe("getTimeUntilRace", () => {
    it('should return "Started" for past races', () => {
      const pastSeconds = Math.floor(mockDate.getTime() / 1000) - 300; // 5 minutes ago
      const result = getTimeUntilRace(pastSeconds);

      expect(result).toBe("Started");
    });

    it("should return time until race for future races", () => {
      const futureSeconds = Math.floor(mockDate.getTime() / 1000) + 300; // 5 minutes from now
      const result = getTimeUntilRace(futureSeconds);

      expect(result).toContain("in");
      expect(result).toContain("5 minutes");
    });
  });

  describe("hasRaceExpired", () => {
    it("should return false for races that just started", () => {
      const justStartedSeconds = Math.floor(mockDate.getTime() / 1000) - 30; // 30 seconds ago
      const result = hasRaceExpired(justStartedSeconds);

      expect(result).toBe(false);
    });

    it("should return true for races that started more than 1 minute ago", () => {
      const expiredSeconds = Math.floor(mockDate.getTime() / 1000) - 90; // 1.5 minutes ago
      const result = hasRaceExpired(expiredSeconds);

      expect(result).toBe(true);
    });

    it("should return false for future races", () => {
      const futureSeconds = Math.floor(mockDate.getTime() / 1000) + 300; // 5 minutes from now
      const result = hasRaceExpired(futureSeconds);

      expect(result).toBe(false);
    });
  });
});
