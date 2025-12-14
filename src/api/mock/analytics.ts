import type {LinePoint,BarPoint} from '../../types/chartTypes'



type AnalyticsBundle = {
  line: LinePoint[];
  bar: BarPoint[];
  summary: {
    totalUsers: number;
    activeUsers: number;
    avgSession: string;
    errors: number;
    conversionRate: number;
    revenue: number;
  };
  activityLog: Array<{
    id: string;
    user: string;
    action: string;
    timestamp: string;
    severity: 'info' | 'warning' | 'error' | 'success';
  }>;
};

/** SaaS-specific line chart data for user growth */
function generateUserGrowthSeries(points: number = 6): LinePoint[] {
  const result: LinePoint[] = [];
  let base = 1000;
  for (let i = 0; i < points; i++) {
    const hour = 9 + i;
    const label = `${hour.toString().padStart(2, "0")}:00`;
    const growth = Math.floor(Math.random() * 50) + 20;
    base += growth;
    result.push({ time: label, value: base });
  }
  return result;
}

/** SaaS-specific bar chart for signup sources */
function generateSignupSources(): BarPoint[] {
  const sources = [
    { name: "Organic", base: 120 },
    { name: "Google Ads", base: 85 },
    { name: "Social Media", base: 65 },
    { name: "Referral", base: 45 },
    { name: "Email Campaign", base: 75 },
  ];
  
  return sources.map(source => ({
    name: source.name,
    count: source.base + Math.floor(Math.random() * 30)
  }));
}

/** Generate realistic user activity log */
function generateActivityLog(count: number = 8) {
  const actions = [
    { action: "New user signed up", severity: "success" as const },
    { action: "Payment failed - Retry required", severity: "error" as const },
    { action: "Subscription renewed", severity: "success" as const },
    { action: "Server error: 500", severity: "error" as const },
    { action: "User upgraded plan", severity: "success" as const },
    { action: "API rate limit exceeded", severity: "warning" as const },
    { action: "New feature launched", severity: "info" as const },
    { action: "Monthly report generated", severity: "info" as const },
  ];
  
  const users = ["Alex Chen", "Maria Garcia", "David Kim", "Sarah Johnson", "James Wilson", "Lisa Brown"];
  
  return Array(count).fill(null).map((_, i) => ({
    id: `act-${Date.now()}-${i}`,
    user: users[Math.floor(Math.random() * users.length)],
    action: actions[i % actions.length].action,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    severity: actions[i % actions.length].severity,
  }));
}

export function fetchMockLineData(): LinePoint[] {
  return generateUserGrowthSeries(6);
}

export function fetchMockBarData(): BarPoint[] {
  return generateSignupSources();
}

export function fetchAnalyticsBundle(): AnalyticsBundle {
  return {
    line: fetchMockLineData(),
    bar: fetchMockBarData(),
    summary: {
      totalUsers: 2568,
      activeUsers: 1842,
      avgSession: "4m 32s",
      errors: 12,
      conversionRate: 3.4,
      revenue: 45230,
    },
    activityLog: generateActivityLog(),
  };
}