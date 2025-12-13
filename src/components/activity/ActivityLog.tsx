// src/components/activity/ActivityLog.tsx
import React, { useEffect, useRef, useState } from "react";
import { Card } from "../cards/Card";
import {
  TrendingUp,
  AlertCircle,
  Shield,
  Zap,
  Clock,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Activity as ActivityIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { activityLogService, type ActivityLog, type ActivityStats } from "../../api/mock/activityLog";
import Button from "../ui/Button";

interface ActivityLogProps {
  limit?: number;
  showViewAll?: boolean;
  autoRefresh?: boolean;
  compact?: boolean;
}

export default function ActivityLog({
  limit = 6,
  showViewAll = true,
  autoRefresh = true,
  compact = false
}: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [timeRange, setTimeRange] = useState<string>("today");

  // Minimum skeleton display time to avoid flicker
  const minLoadingMs = 400;
  const lastLoadStartRef = useRef<number | null>(null);

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      lastLoadStartRef.current = Date.now();
      setLoading(true);
    }

    try {
      // Calculate date range
      let startDate: string | undefined;
      const now = new Date();

      if (timeRange === "today") {
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startDate = todayStart.toISOString();
      } else if (timeRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        startDate = weekAgo.toISOString();
      } else if (timeRange === "month") {
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        startDate = monthAgo.toISOString();
      } else {
        // "all" or unknown -> do not pass startDate
        startDate = undefined;
      }

      const [activitiesData, statsData] = await Promise.all([
        activityLogService.fetchActivities({
          limit,
          severity: selectedSeverity || undefined,
          category: selectedCategory || undefined,
          startDate,
          sortBy: "timestamp",
          order: "desc"
        }),
        activityLogService.fetchActivityStats()
      ]);

      setActivities(activitiesData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to load activity log:", error);
    } finally {
      // ensure minimum loading time to avoid flicker
      if (lastLoadStartRef.current) {
        const elapsed = Date.now() - lastLoadStartRef.current;
        const remaining = Math.max(0, minLoadingMs - elapsed);
        setTimeout(() => {
          setLoading(false);
          setRefreshing(false);
          lastLoadStartRef.current = null;
        }, remaining);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates if autoRefresh is enabled
    let unsubscribe: (() => void) | undefined;
    if (autoRefresh) {
      unsubscribe = activityLogService.subscribe((newActivities: ActivityLog[]) => {
        setActivities(prev => {
          // Prepend incoming newActivities, then keep unique by id preserving the newest-first order
          const combined = [...newActivities, ...prev];
          const seen = new Set<string>();
          const merged: ActivityLog[] = [];
          for (const a of combined) {
            if (!seen.has(a.id)) {
              seen.add(a.id);
              merged.push(a);
            }
          }
          return merged.slice(0, limit);
        });
      });
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
    // keep dependencies minimal for subscription (limit and autoRefresh)
  }, [limit, autoRefresh]);

  // Reload when filters change
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeverity, selectedCategory, timeRange]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-100 dark:bg-green-900/20";
      case "error":
        return "bg-red-100 dark:bg-red-900/20";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const handleExport = () => {
    const csvContent = [
      ["Time", "Action", "User", "Severity", "Category", "Description"],
      ...activities.map(activity => [
        new Date(activity.timestamp).toLocaleString(),
        activity.action,
        activity.user,
        activity.severity,
        activity.category,
        activity.description
      ])
    ]
      .map(row => row.map(cell => {
        // basic CSV escaping for commas and quotes
        const cellStr = (cell ?? "").toString();
        if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (compact) {
    return (
      <Card title="Recent Activity" className={compact ? "p-0" : ""}>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : activities.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">No recent activity</div>
          ) : (
            activities.slice(0, limit).map(activity => (
              <div
                key={activity.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => window.alert(`Activity Details:\n\n${JSON.stringify(activity, null, 2)}`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${getSeverityColor(activity.severity)}`}>
                    {getSeverityIcon(activity.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {activity.action}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {activity.user} • {formatTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {showViewAll && (
          <button
            className="w-full mt-3 py-2 text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium border-t border-gray-200 dark:border-gray-700"
            onClick={() => window.alert("View all activity - This would navigate to a detailed activity page")}
          >
            View all activity <ChevronRight className="w-4 h-4 inline ml-1" />
          </button>
        )}
      </Card>
    );
  }

  return (
    <Card
      title="Activity Log"
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      }
    >
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Total Activities</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {stats.totalActivities.toLocaleString()}
                </div>
              </div>
              <ActivityIcon className="w-6 h-6 text-blue-500 opacity-70" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="text-sm text-green-600 dark:text-green-400">Today</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.todayCount}</div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <div className="text-sm text-purple-600 dark:text-purple-400">Last Hour</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.lastHourCount}</div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
            <div className="text-sm text-orange-600 dark:text-orange-400">Real-time</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              Live
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Severity</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="">All Categories</option>
            <option value="authentication">Authentication</option>
            <option value="billing">Billing</option>
            <option value="security">Security</option>
            <option value="system">System</option>
            <option value="data">Data</option>
            <option value="api">API</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedSeverity("");
              setSelectedCategory("");
              setTimeRange("today");
            }}
            className="flex items-center justify-center gap-1"
          >
            <Filter className="w-4 h-4 " />
            <span className="text-gray-400">Clear Filters</span>
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                </div>
              </div>
              <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <div className="text-gray-500 dark:text-gray-400">No activities found</div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try changing your filters</div>
          </div>
        ) : (
          activities.map(activity => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all cursor-pointer group"
              onClick={() => window.alert(`Activity Details:\n\n${JSON.stringify(activity, null, 2)}`)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${getSeverityColor(activity.severity)} group-hover:scale-105 transition-transform`}>
                  {getSeverityIcon(activity.severity)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {activity.action}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.description}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(activity.timestamp)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">by {activity.user}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activity.severity === "success" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      activity.severity === "error" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      activity.severity === "warning" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {activity.severity}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                      {activity.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(activity.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
