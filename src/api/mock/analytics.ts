/**
 * Mock Analytics Service
 * Production-ready simulation for charts.
 * Replace these functions with real API calls later.
 */

export type LinePoint = {
  time: string;   // "09:00"
  value: number;  // numeric metric
};

export type BarPoint = {
  name: string;   // "Mon"
  count: number;  // numeric metric
};

/** Utility to generate a time-series line chart */
function generateLineSeries(
  points: number = 6,
  base: number = 20,
  variance: number = 20
): LinePoint[] {
  const result: LinePoint[] = [];
  for (let i = 0; i < points; i++) {
    const hour = 9 + i; // 09:00 → 14:00
    const label = `${hour.toString().padStart(2, "0")}:00`;
    const value = base + Math.floor(Math.random() * variance);
    result.push({ time: label, value });
  }
  return result;
}

/** Utility to generate a 5-day bar series */
function generateBarSeries(
  days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri"],
  base: number = 10,
  variance: number = 20
): BarPoint[] {
  return days.map((day) => ({
    name: day,
    count: base + Math.floor(Math.random() * variance),
  }));
}

/**
 * Fetch line chart data for analytics screen
 */
export function fetchMockLineData(): LinePoint[] {
  return generateLineSeries(6, 30, 40);
}

/**
 * Fetch bar chart data for analytics screen
 */
export function fetchMockBarData(): BarPoint[] {
  return generateBarSeries();
}

/**
 * Fetch combined analytics bundle (example endpoint)
 */
export function fetchAnalyticsBundle() {
  return {
    line: fetchMockLineData(),
    bar: fetchMockBarData(),
    summary: {
      totalUsers: 1234,
      avgSession: "4m 12s",
      errors: 12,
    },
  };
}
