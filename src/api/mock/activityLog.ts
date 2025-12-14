import activityLogData from './data/activityLog.json';
import type {ActivityLog,ActivityStats} from '../../types/activity'



class ActivityLogService {
  private data: ActivityLog[] = activityLogData as ActivityLog[];
  private subscribers: ((data: ActivityLog[]) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start simulated updates every 25 seconds
    this.startSimulatedUpdates();
  }

  async fetchActivities(options?: {
    limit?: number;
    severity?: string;
    category?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'timestamp';
    order?: 'asc' | 'desc';
  }): Promise<ActivityLog[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.data];
        
        // Apply filters
        if (options?.severity) {
          result = result.filter(activity => activity.severity === options.severity);
        }
        
        if (options?.category) {
          result = result.filter(activity => activity.category === options.category);
        }
        
        if (options?.userId) {
          result = result.filter(activity => activity.userId === options.userId);
        }
        
        if (options?.startDate) {
          const start = new Date(options.startDate);
          result = result.filter(activity => new Date(activity.timestamp) >= start);
        }
        
        if (options?.endDate) {
          const end = new Date(options.endDate);
          result = result.filter(activity => new Date(activity.timestamp) <= end);
        }
        
        // Apply sorting (default: newest first)
        const sortBy = options?.sortBy || 'timestamp';
        const order = options?.order || 'desc';
        
        result.sort((a, b) => {
          const aVal = a[sortBy];
          const bVal = b[sortBy];
          
          if (typeof aVal === 'string' && typeof bVal === 'string') {
            if (sortBy === 'timestamp') {
              const aDate = new Date(aVal);
              const bDate = new Date(bVal);
              return order === 'asc' 
                ? aDate.getTime() - bDate.getTime()
                : bDate.getTime() - aDate.getTime();
            }
            return order === 'asc' 
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          return 0;
        });
        
        // Apply limit
        if (options?.limit) {
          result = result.slice(0, options.limit);
        }
        
        resolve(result);
      }, 200);
    });
  }

  async fetchActivityStats(): Promise<ActivityStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const bySeverity = this.data.reduce((acc, activity) => {
          acc[activity.severity] = (acc[activity.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const byCategory = this.data.reduce((acc, activity) => {
          acc[activity.category] = (acc[activity.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const todayCount = this.data.filter(activity => 
          new Date(activity.timestamp) >= todayStart
        ).length;
        
        const lastHourCount = this.data.filter(activity => 
          new Date(activity.timestamp) >= oneHourAgo
        ).length;
        
        resolve({
          totalActivities: this.data.length,
          bySeverity,
          byCategory,
          todayCount,
          lastHourCount
        });
      }, 150);
    });
  }

  async createActivity(activity: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<ActivityLog> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newActivity: ActivityLog = {
          ...activity,
          id: `act_${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        this.data.unshift(newActivity);
        this.notifySubscribers();
        resolve(newActivity);
      }, 300);
    });
  }

  async deleteActivity(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.data.length;
        this.data = this.data.filter(activity => activity.id !== id);
        const deleted = this.data.length < initialLength;
        if (deleted) {
          this.notifySubscribers();
        }
        resolve(deleted);
      }, 200);
    });
  }

  async clearOldActivities(days: number = 30): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const initialLength = this.data.length;
        this.data = this.data.filter(activity => 
          new Date(activity.timestamp) >= cutoffDate
        );
        
        const deletedCount = initialLength - this.data.length;
        if (deletedCount > 0) {
          this.notifySubscribers();
        }
        
        resolve(deletedCount);
      }, 300);
    });
  }

  // Real-time subscription
  subscribe(callback: (data: ActivityLog[]) => void): () => void {
    this.subscribers.push(callback);
    // Send initial data
    callback([...this.data]);
    
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback([...this.data]));
  }

  private startSimulatedUpdates(): void {
    this.updateInterval = setInterval(() => {
      this.generateRandomActivity();
    }, 6000); // Every 25 seconds
  }

  private generateRandomActivity(): void {
    const actions = [
      {
        action: "User login successful",
        description: "User logged in from new location",
        severity: "success" as const,
        category: "authentication"
      },
      {
        action: "Data export completed",
        description: "User exported their data",
        severity: "success" as const,
        category: "data"
      },
      {
        action: "Failed login attempt",
        description: "Invalid credentials provided",
        severity: "error" as const,
        category: "security"
      },
      {
        action: "System alert",
        description: "High memory usage detected",
        severity: "warning" as const,
        category: "system"
      },
      {
        action: "New notification",
        description: "User received a new notification",
        severity: "info" as const,
        category: "notifications"
      }
    ];

    const users = [
      { name: "Alex Johnson", id: "user_001" },
      { name: "Maria Garcia", id: "user_002" },
      { name: "Sophie Williams", id: "user_004" },
      { name: "Kenji Tanaka", id: "user_005" },
      { name: "Lisa Schmidt", id: "user_008" },
      { name: "System", id: "system" }
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      ...randomAction,
      user: randomUser.name,
      userId: randomUser.id,
      timestamp: new Date().toISOString(),
      ...(randomAction.category === 'data' && { records: Math.floor(Math.random() * 1000) + 100 }),
      ...(randomAction.category === 'system' && { memoryUsage: `${Math.floor(Math.random() * 30) + 70}%` })
    };

    this.data.unshift(newActivity);
    
    // Keep only last 1000 activities
    if (this.data.length > 1000) {
      this.data = this.data.slice(0, 1000);
    }
    
    this.notifySubscribers();
  }

  stopUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

// Create and export singleton instance
const activityLogService = new ActivityLogService();

export { activityLogService };
export type { ActivityLog, ActivityStats };