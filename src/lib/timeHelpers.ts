// Time utilities for slot/interval logic
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export type Interval = { start: number; end: number };

// Subtracts an interval from a list of intervals
export function subtractInterval(intervals: Interval[], remove: Interval): Interval[] {
  const result: Interval[] = [];
  for (const interval of intervals) {
    if (remove.end <= interval.start || remove.start >= interval.end) {
      result.push(interval);
    } else {
      if (remove.start > interval.start) {
        result.push({ start: interval.start, end: remove.start });
      }
      if (remove.end < interval.end) {
        result.push({ start: remove.end, end: interval.end });
      }
    }
  }
  return result;
}
