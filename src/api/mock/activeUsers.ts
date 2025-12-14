import activeUsersData from './data/activeUsers.json';
import type {ActiveUserPoint,ActiveUserStats} from '../../types/analytics'



class ActiveUsersService {
  private data: ActiveUserPoint[] = activeUsersData;

  async fetchActiveUsers(options?: {
    timeRange?: 'today' | 'week' | 'month';
    interval?: 'hour' | 'day' | 'week';
    region?: string;
    device?: string;
  }): Promise<ActiveUserPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.data];
        
        // Filter by region if specified
        if (options?.region) {
          result = result.filter(item => item.region === options.region);
        }
        
        // Filter by device if specified
        if (options?.device) {
          result = result.filter(item => item.device === options.device);
        }
        
        // Simulate different time ranges
        if (options?.timeRange === 'week') {
          // For week data, create daily aggregates
          result = this.generateWeekData();
        } else if (options?.timeRange === 'month') {
          // For month data, create weekly aggregates
          result = this.generateMonthData();
        }
        
        resolve(result);
      }, 400);
    });
  }

  async fetchUserStats(): Promise<ActiveUserStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalUsers = this.data.reduce((sum, item) => sum + item.value, 0);
        const peak = [...this.data].sort((a, b) => b.value - a.value)[0];
        const average = totalUsers / this.data.length;
        
        const byRegion = this.data.reduce((acc, item) => {
          acc[item.region] = (acc[item.region] || 0) + item.value;
          return acc;
        }, {} as Record<string, number>);
        
        const byDevice = this.data.reduce((acc, item) => {
          acc[item.device] = (acc[item.device] || 0) + item.value;
          return acc;
        }, {} as Record<string, number>);
        
        resolve({
          totalUsers,
          peakHour: peak.time,
          peakValue: peak.value,
          average: Math.round(average),
          growth: 8.7, // Simulated growth percentage
          byRegion,
          byDevice
        });
      }, 300);
    });
  }

  private generateWeekData(): ActiveUserPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      time: day,
      value: Math.floor(Math.random() * 5000) + 2000,
      region: 'Global',
      device: 'All'
    }));
  }

  private generateMonthData(): ActiveUserPoint[] {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map(week => ({
      time: week,
      value: Math.floor(Math.random() * 15000) + 10000,
      region: 'Global',
      device: 'All'
    }));
  }

  // Simulate real-time updates
  subscribe(callback: (data: ActiveUserPoint[]) => void): () => void {
    // Send initial data
    callback([...this.data]);
    
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      const newData = [...this.data];
      const lastItem = newData[newData.length - 1];
      
      // Add a new data point
      const newTime = this.getNextTime(lastItem.time);
      newData.push({
        time: newTime,
        value: Math.floor(Math.random() * 1000) + 3000,
        region: lastItem.region,
        device: lastItem.device
      });
      
      // Keep only last 24 points
      if (newData.length > 24) {
        newData.shift();
      }
      
      this.data = newData;
      callback([...newData]);
    }, 10000);
    
    return () => clearInterval(interval);
  }

  private getNextTime(currentTime: string): string {
    const [hours] = currentTime.split(':').map(Number);
    const nextHour = (hours + 1) % 24;
    return `${nextHour.toString().padStart(2, '0')}:00`;
  }
}

export const activeUsersService = new ActiveUsersService();