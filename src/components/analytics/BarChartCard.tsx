import React, { useEffect, useState } from "react";
import { Card } from "../cards/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { signupSourcesService } from "../../api/mock/signupSources";
import { TrendingUp, Users, TrendingDown } from "lucide-react";

export default function BarChartCard() {
  const [data, setData] = useState<SignupSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    average: number;
    topSource: SignupSource;
    growth: number;
  } | null>(null);

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      setLoading(true);
      try {
        const [sourcesData, statsData] = await Promise.all([
          signupSourcesService.fetchSources({ limit: 8, sortBy: 'count', order: 'desc' }),
          signupSourcesService.fetchSourceStats()
        ]);
        setData(sourcesData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load signup sources:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates
    const unsubscribe = signupSourcesService.subscribe((newData) => {
      setData(newData.slice(0, 8));
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <Card title="Signups by Source">
        <div className="h-64 w-full flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading signup data...</div>
        </div>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white mb-2">{data.name}</div>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Signups:</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.count.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Percentage:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{data.percentage}%</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Change:</span>
              <div className={`flex items-center ${data.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {data.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {data.change}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">{data.description}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Signups by Source"
      action={
        stats && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>Total: {stats.total.toLocaleString()}</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Top Source:</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats.topSource.name}</span>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Signups</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="text-sm text-green-600 dark:text-green-400">Avg per Source</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.average.toLocaleString()}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="text-sm text-purple-600 dark:text-purple-400">Growth</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-1" />
                {stats.growth}%
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="text-sm text-orange-600 dark:text-orange-400">Top Source</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.topSource.count.toLocaleString()}</div>
            </div>
          </div>
        )}
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>}
              />
              <Bar
                dataKey="count"
                name="Signup Count"
                radius={[6, 6, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    strokeWidth={2}
                    stroke="transparent"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Data updates in real-time. Hover over bars for detailed information.
        </div>
      </div>
    </Card>
  );
}