// src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Card } from "../components/cards/Card";
import { 
  Users, TrendingUp, AlertCircle, DollarSign, 
  Clock, Activity, Shield, Zap 
} from "lucide-react";
import LineChartCard from "../components/analytics/LineChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import { fetchAnalyticsBundle } from "../api/mock/analytics";
import ActivityLog from '../components/activity/ActivityLog';


export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalytics(fetchAnalyticsBundle());
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const metricCards = [
    {
      title: "Total Users",
      value: analytics?.summary.totalUsers || "2,568",
      change: "+12.5%",
      icon: <Users className="w-5 h-5" />,
      color: "bg-blue-500",
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: analytics?.summary.activeUsers || "1,842",
      change: "+8.3%",
      icon: <Activity className="w-5 h-5" />,
      color: "bg-green-500",
      trend: "up",
    },
    {
      title: "Avg Session",
      value: analytics?.summary.avgSession || "4m 32s",
      change: "-2.1%",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-purple-500",
      trend: "down",
    },
    {
      title: "Revenue",
      value: `$${(analytics?.summary.revenue || 45230).toLocaleString()}`,
      change: "+18.2%",
      icon: <DollarSign className="w-5 h-5" />,
      color: "bg-yellow-500",
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening with your SaaS today.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{card.title}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {card.value}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  card.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${card.trend === 'down' ? 'transform rotate-180' : ''}`} />
                  <span>{card.change}</span>
                  <span className="text-gray-500 dark:text-gray-400">from last week</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                <div className={card.color.replace('bg-', 'text-')}>{card.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard 
          title="User Growth Trend" 
          area={true}
          color="#8B5CF6"
        />
        <BarChartCard />
      </div>

     <ActivityLog />
    </div>
  );
}