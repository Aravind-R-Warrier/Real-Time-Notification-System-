export interface ActiveUserPoint {
  time: string;
  value: number;
  region: string;
  device: string;
}

export interface ActiveUserStats {
  totalUsers: number;
  peakHour: string;
  peakValue: number;
  average: number;
  growth: number;
  byRegion: Record<string, number>;
  byDevice: Record<string, number>;
}
