import React, { useEffect, useRef, useState } from "react";
import { Card } from "../cards/Card";
import {
  Clock,
  Filter,
  Download,
  RefreshCw,
  ChevronRight,
  Activity as ActivityIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import {
  activityLogService,
  type ActivityLog,
  type ActivityStats,
} from "../../api/mock/activityLog";
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
  compact = false,
}: ActivityLogProps) {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [timeRange, setTimeRange] = useState("today");

  const minLoadingMs = 400;
  const lastLoadStartRef = useRef<number | null>(null);

  const loadData = async (showLoading = true) => {
    if (showLoading) {
      lastLoadStartRef.current = Date.now();
      setLoading(true);
    }

    try {
      let startDate: string | undefined;
      const now = new Date();

      if (timeRange === "today") {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();
      } else if (timeRange === "week") {
        startDate = new Date(now.getTime() - 7 * 86400000).toISOString();
      } else if (timeRange === "month") {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        ).toISOString();
      }

      const [list, stats] = await Promise.all([
        activityLogService.fetchActivities({
          limit,
          severity: selectedSeverity || undefined,
          category: selectedCategory || undefined,
          startDate,
          sortBy: "timestamp",
          order: "desc",
        }),
        activityLogService.fetchActivityStats(),
      ]);

      setActivities(list);
      setStats(stats);
    } finally {
      const elapsed = Date.now() - (lastLoadStartRef.current ?? 0);
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
        lastLoadStartRef.current = null;
      }, Math.max(0, minLoadingMs - elapsed));
    }
  };

  useEffect(() => {
    loadData();
    let unsub: (() => void) | undefined;

    if (autoRefresh) {
      unsub = activityLogService.subscribe((incoming) => {
        setActivities((prev) => {
          const merged = [...incoming, ...prev];
          const seen = new Set<string>();
          return merged
            .filter((a) => !seen.has(a.id) && seen.add(a.id))
            .slice(0, limit);
        });
      });
    }
    return () => unsub?.();
  }, [limit, autoRefresh]);

  useEffect(() => {
    loadData();
  }, [selectedSeverity, selectedCategory, timeRange]);

  const severityIcon = (s: string) => {
    switch (s) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "info":
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const severityBg = (s: string) => {
    switch (s) {
      case "success":
        return "bg-green-100 dark:bg-green-900/30";
      case "error":
        return "bg-red-100 dark:bg-red-900/30";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/30";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const formatTime = (t: string) => {
    const d = new Date(t);
    const mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const exportCSV = () => {
    const rows = [
      ["Time", "Action", "User", "Severity", "Category", "Description"],
      ...activities.map((a) => [
        new Date(a.timestamp).toLocaleString(),
        a.action,
        a.user,
        a.severity,
        a.category,
        a.description,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    Object.assign(document.createElement("a"), {
      href: url,
      download: "activity-log.csv",
    }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card
      title="Live Activity Log"
      action={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              loadData(false);
            }}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      }
    >
      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        <select
          className="input"
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
        >
          <option value="">All Severity</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>

        <select
          className="input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="system">System</option>
          <option value="security">Security</option>
          <option value="billing">Billing</option>
          <option value="api">API</option>
        </select>

        <select
          className="input"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
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
        >
          Clear
        </Button>
      </div>

    {/* Activity List */}
<div className="space-y-3">
  {loading ? (
    Array.from({ length: limit }).map((_, i) => (
      <div
        key={i}
        className="flex items-start gap-3 p-4 border rounded-lg animate-pulse"
      >
        {/* Skeleton icon */}
        <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0" />

        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    ))
  ) : activities.length === 0 ? (
    <div className="text-center py-10 text-gray-500">
      <ActivityIcon className="mx-auto mb-2" />
      No activity found
    </div>
  ) : (
    activities.map((a) => (
      <div
        key={a.id}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between
                   gap-4 p-4 border rounded-lg hover:shadow-sm transition"
      >
        {/* Left side */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div
            className={`w-10 h-10 flex items-center justify-center
                        rounded-lg shrink-0 ${severityBg(a.severity)}`}
          >
            {severityIcon(a.severity)}
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="font-medium text-sm line-clamp-2">
              {a.action}
            </div>

            <div className="text-sm text-gray-500 line-clamp-2">
              {a.description}
            </div>

            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
              <span>{formatTime(a.timestamp)}</span>
              <span>by {a.user}</span>

              <span className="px-2 py-0.5 rounded bg-gray-100">
                {a.category}
              </span>

              <span className="px-2 py-0.5 rounded bg-gray-100 capitalize">
                {a.severity}
              </span>
            </div>
          </div>
        </div>

        {/* Right time */}
        <div className="text-xs sm:text-sm text-gray-500 shrink-0">
          {new Date(a.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    ))
  )}
</div>

    </Card>
  );
}
