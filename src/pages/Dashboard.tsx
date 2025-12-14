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
import PageHeader from "../components/layout/PageHeader";


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
    color: "blue",
    trend: "up",
  },
  {
    title: "Active Sessions",
    value: analytics?.summary.activeUsers || "1,842",
    change: "+8.3%",
    icon: <Activity className="w-5 h-5" />,
    color: "green",
    trend: "up",
  },
  {
    title: "Avg Session",
    value: analytics?.summary.avgSession || "4m 32s",
    change: "-2.1%",
    icon: <Clock className="w-5 h-5" />,
    color: "purple",
    trend: "down",
  },
  {
    title: "Revenue",
    value: `$${(analytics?.summary.revenue || 45230).toLocaleString()}`,
    change: "+18.2%",
    icon: <DollarSign className="w-5 h-5" />,
    color: "yellow",
    trend: "up",
  },
];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
          <PageHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your SaaS today."
      />
      </div>

      {/* Metrics Grid */}
      {/* Metrics Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {metricCards.map((card, index) => {
    const trendUp = card.trend === "up";

    const accent = {
      blue: "from-blue-500/10 to-blue-500/5 text-blue-600 dark:text-blue-400",
      green: "from-green-500/10 to-green-500/5 text-green-600 dark:text-green-400",
      purple: "from-purple-500/10 to-purple-500/5 text-purple-600 dark:text-purple-400",
      yellow: "from-yellow-500/10 to-yellow-500/5 text-yellow-600 dark:text-yellow-400",
    }[card.color];

    return (
      <Card
        key={index}
        className="relative overflow-hidden group 
                   hover:shadow-lg hover:-translate-y-0.5 
                   transition-all duration-300"
      >
        {/* Glow gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 
                      group-hover:opacity-100 transition-opacity`}
        />

        <div className="relative flex items-start justify-between gap-4">
          {/* Left content */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {card.title}
            </p>

            <h3 className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {card.value}
            </h3>

            <div
              className={`mt-3 inline-flex items-center gap-1 rounded-full 
                          px-2.5 py-1 text-xs font-medium
                          ${
                            trendUp
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
            >
              <TrendingUp
                className={`w-3.5 h-3.5 ${!trendUp ? "rotate-180" : ""}`}
              />
              {card.change}
              <span className="opacity-70 ml-1">vs last week</span>
            </div>
          </div>

          {/* Icon */}
          <div
            className={`shrink-0 p-3 rounded-xl 
                        bg-gradient-to-br ${accent}
                        backdrop-blur-sm`}
          >
            {card.icon}
          </div>
        </div>
      </Card>
    );
  })}
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