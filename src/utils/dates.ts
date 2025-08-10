import { addMinutes, formatDistanceToNow, isAfter } from "date-fns";

export function getRaceStartTime(advertisedStartSeconds: number): Date {
  return new Date(advertisedStartSeconds * 1000);
}

export function getTimeUntilRace(advertisedStartSeconds: number): string {
  const startTime = getRaceStartTime(advertisedStartSeconds);
  const now = new Date();

  if (isAfter(now, startTime)) {
    return "Started";
  }

  return formatDistanceToNow(startTime, { addSuffix: true });
}

export function hasRaceExpired(advertisedStartSeconds: number): boolean {
  const startTime = getRaceStartTime(advertisedStartSeconds);
  const expiryTime = addMinutes(startTime, 1);
  const now = new Date();

  return isAfter(now, expiryTime);
}

export function getFormattedStartTime(advertisedStartSeconds: number): string {
  const startTime = getRaceStartTime(advertisedStartSeconds);
  return startTime.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
