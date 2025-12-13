// src/pages/Analytics.tsx
import React, { useState, useEffect } from "react";
import { Card } from "../components/cards/Card";
import Button from "../components/ui/Button";
import { 
  Download, Filter, Calendar, TrendingUp, Users, 
  DollarSign, MousePointer, RefreshCw 
} from "lucide-react";
import LineChartCard from "../components/analytics/LineChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import { fetchAnalyticsBundle } from "../api/mock/analytics";

type DateRange = 'today' | 'week' | 'month' | 'quarter';

export default function Analytics() {
  const [range, setRange] = useState<DateRange>('week');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [range]);

  const loadAnalytics = () => {
    setLoading(true);
    setTimeout(() => {
      setAnalytics(fetchAnalyticsBundle());
      setLoading(false);
    }, 600);
  };

  const handleExport = () => {
    // Mock export functionality
    alert(`Exporting analytics data for ${range} range...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed insights and metrics for your SaaS platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as DateRange)}
              className="bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last quarter</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={loadAnalytics}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="primary"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            title: "Conversion Rate",
            value: `${analytics?.summary.conversionRate || 3.4}%`,
            icon: <TrendingUp className="w-5 h-5" />,
            change: "+0.8%",
            color: "text-green-600 dark:text-green-400",
          },
          {
            title: "Active Users",
            value: analytics?.summary.activeUsers?.toLocaleString() || "1,842",
            icon: <Users className="w-5 h-5" />,
            change: "+8.3%",
            color: "text-blue-600 dark:text-blue-400",
          },
          {
            title: "Revenue",
            value: `$${(analytics?.summary.revenue || 45230).toLocaleString()}`,
            icon: <DollarSign className="w-5 h-5" />,
            change: "+18.2%",
            color: "text-yellow-600 dark:text-yellow-400",
          },
          {
            title: "Click-through",
            value: "2.8%",
            icon: <MousePointer className="w-5 h-5" />,
            change: "+1.2%",
            color: "text-purple-600 dark:text-purple-400",
          },
        ].map((metric, index) => (
          <Card key={index} className="dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {metric.value}
                </div>
                <div className={`flex items-center gap-1 mt-2 text-sm ${metric.color}`}>
                  {metric.change} from last period
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <LineChartCard 
            title="User Activity Timeline" 
            area={true}
            color="#10B981"
          />
          <BarChartCard />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card title="Quick Filters" className="dark:border-gray-700">
            <div className="space-y-3">
              {[
                { label: "New Users", count: "324" },
                { label: "Upgrades", count: "42" },
                { label: "Churned Users", count: "18" },
                { label: "Trials", count: "156" },
              ].map((filter, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <span className="text-gray-700 dark:text-gray-300">{filter.label}</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{filter.count}</span>
                </button>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </Card>

          <Card title="Data Sources" className="dark:border-gray-700">
            <div className="space-y-4">
              {[
                { name: "Google Analytics", status: "active", sync: "5 min ago" },
                { name: "Stripe", status: "active", sync: "2 min ago" },
                { name: "Segment", status: "syncing", sync: "Just now" },
                { name: "HubSpot", status: "error", sync: "2 hours ago" },
              ].map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{source.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Synced {source.sync}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    source.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : source.status === 'syncing'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {source.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}