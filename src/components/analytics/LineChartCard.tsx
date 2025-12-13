import React, { useEffect, useState } from "react";
import { Card } from "../cards/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Legend,
} from "recharts";
import { activeUsersService } from "../../api/mock/activeUsers";
import { Users, TrendingUp, Clock, Smartphone, Monitor } from "lucide-react";

export type LineChartProps = {
  title?: string;
  showGrid?: boolean;
  color?: string;
  area?: boolean;
  timeRange?: 'today' | 'week' | 'month';
  region?: string;
  device?: string;
};

export default function LineChartCard({
  title = "Active Users Over Time",
  showGrid = true,
  color = "#2563EB",
  area = true,
  timeRange = 'today',
  region,
  device,
}: LineChartProps) {
  const [data, setData] = useState<ActiveUserPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ActiveUserStats | null>(null);
  const [timeFilter, setTimeFilter] = useState(timeRange);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData] = await Promise.all([
          activeUsersService.fetchActiveUsers({ 
            timeRange: timeFilter,
            region,
            device 
          }),
          activeUsersService.fetchUserStats()
        ]);
        setData(usersData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load active users data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time updates only for today's data
    if (timeFilter === 'today' && !region && !device) {
      const unsubscribe = activeUsersService.subscribe((newData) => {
        setData(newData);
      });
      return unsubscribe;
    }
  }, [timeFilter, region, device]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-gray-900 dark:text-white mb-2">
            {timeFilter === 'today' ? `${point.time}` : `${label}`}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-gray-600 dark:text-gray-400">Active Users:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {point.value.toLocaleString()}
              </span>
            </div>
            {point.region && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600 dark:text-gray-400">Region:</span>
                <span className="font-medium text-gray-900 dark:text-white">{point.region}</span>
              </div>
            )}
            {point.device && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600 dark:text-gray-400">Device:</span>
                <div className="flex items-center gap-1">
                  {point.device === 'Mobile' ? (
                    <Smartphone className="w-3 h-3" />
                  ) : (
                    <Monitor className="w-3 h-3" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{point.device}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card title={title}>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading active users data...</div>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title={title}>
        <div className="h-64 w-full flex items-center justify-center">
          <div className="text-sm text-gray-500">No data to display</div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      title={title}
      action={
        <div className="flex items-center gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      }
    >
      <div className="space-y-4">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Today</div>
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-green-600 dark:text-green-400">Peak Hour</div>
                <Clock className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.peakHour}
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-purple-600 dark:text-purple-400">Growth</div>
                <TrendingUp className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.growth}%
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-orange-600 dark:text-orange-400">Peak Users</div>
                <Users className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.peakValue.toLocaleString()}
              </div>
            </div>
          </div>
        )}
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#E5E7EB" 
                  opacity={0.3}
                />
              )}
              
              <XAxis
                dataKey="time"
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
              
              {area ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Active Users"
                    stroke={color}
                    fill={color}
                    strokeWidth={2}
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Active Users"
                    stroke={color}
                    strokeWidth={2}
                    dot={{ 
                      fill: color, 
                      strokeWidth: 2, 
                      r: 3, 
                      stroke: "#ffffff" 
                    }}
                    activeDot={{ 
                      r: 6, 
                      fill: color, 
                      stroke: "#ffffff", 
                      strokeWidth: 2 
                    }}
                  />
                </>
              ) : (
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Active Users"
                  stroke={color}
                  strokeWidth={2}
                  dot={{ 
                    fill: color, 
                    strokeWidth: 2, 
                    r: 3, 
                    stroke: "#ffffff" 
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: color, 
                    stroke: "#ffffff", 
                    strokeWidth: 2 
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {timeFilter === 'today' 
            ? 'Live data updates every 10 seconds. Hover for detailed metrics.' 
            : 'Historical data view. Switch to "Today" for real-time updates.'}
        </div>
      </div>
    </Card>
  );
}