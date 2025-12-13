import signupSourcesData from './data/signupSources.json';

// Define the interface
export interface SignupSource {
  name: string;
  count: number;
  percentage: number;
  change: string;
  color: string;
  description: string;
}

// Cast the imported JSON data to the correct type
const typedData: SignupSource[] = signupSourcesData as SignupSource[];

class SignupSourcesService {
  private data: SignupSource[] = typedData;
  private subscribers: ((data: SignupSource[]) => void)[] = [];

  constructor() {
    // Simulate live updates
    this.startSimulatedUpdates();
  }

  async fetchSources(options?: {
    limit?: number;
    sortBy?: 'count' | 'name' | 'percentage';
    order?: 'asc' | 'desc';
  }): Promise<SignupSource[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.data];
        
        if (options?.sortBy) {
          result.sort((a, b) => {
            const aVal = a[options.sortBy as keyof SignupSource];
            const bVal = b[options.sortBy as keyof SignupSource];
            
            if (typeof aVal === 'number' && typeof bVal === 'number') {
              return options.order === 'asc' ? aVal - bVal : bVal - aVal;
            }
            
            return options.order === 'asc' 
              ? String(aVal).localeCompare(String(bVal))
              : String(bVal).localeCompare(String(aVal));
          });
        }
        
        if (options?.limit) {
          result = result.slice(0, options.limit);
        }
        
        resolve(result);
      }, 300); // Simulate network delay
    });
  }

  async fetchSourceStats(): Promise<{
    total: number;
    average: number;
    topSource: SignupSource;
    growth: number;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const total = this.data.reduce((sum, item) => sum + item.count, 0);
        const average = total / this.data.length;
        const topSource = [...this.data].sort((a, b) => b.count - a.count)[0];
        const growth = 12.5; // Simulated growth percentage
        
        resolve({
          total,
          average: Math.round(average),
          topSource,
          growth
        });
      }, 200);
    });
  }

  async updateSourceCount(name: string, newCount: number): Promise<SignupSource> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.data.findIndex(item => item.name === name);
        if (index === -1) {
          reject(new Error('Source not found'));
          return;
        }
        
        this.data[index] = {
          ...this.data[index],
          count: newCount,
          percentage: Math.round((newCount / this.data.reduce((sum, item) => sum + item.count, 0)) * 1000) / 10
        };
        
        this.notifySubscribers();
        resolve(this.data[index]);
      }, 200);
    });
  }

  // Real-time subscription methods
  subscribe(callback: (data: SignupSource[]) => void): () => void {
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
    // Simulate live data updates every 30 seconds
    setInterval(() => {
      this.data = this.data.map(item => ({
        ...item,
        count: Math.max(100, item.count + Math.floor(Math.random() * 50) - 25),
        percentage: Math.round((Math.random() * 5) * 10) / 10
      }));
      this.notifySubscribers();
    }, 30000);
  }
}

// Create and export the service instance
const signupSourcesService = new SignupSourcesService();

export { signupSourcesService };