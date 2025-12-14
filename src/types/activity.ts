export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  user: string;
  userId: string | null;
  timestamp: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  category: string;
  [key: string]: any; // Additional dynamic properties
}

export interface ActivityStats {
  totalActivities: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  todayCount: number;
  lastHourCount: number;
}