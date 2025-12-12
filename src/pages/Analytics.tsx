import React, { useEffect, useMemo, useState } from "react";
import LineChartCard from "../components/analytics/LineChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import Button from "../components/ui/Button";
import { fetchMockLineData, fetchMockBarData } from "../api/mock/analytics";
import { Card } from "../components/cards/Card";

/**
 * Analytics Page — Final Production Version
 */

type RangeOption = "24h" | "7d" | "30d";

function toCSV(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const header = keys.join(",");
  const lines = rows.map((r) =>
    keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")
  );
  return [header, ...lines].join("\n");
}

export default function Analytics() {
  const [range, setRange] = useState<RangeOption>("7d");
  const [showGrid, setShowGrid] = useState(true);

  const [lineData, setLineData] = useState(() => fetchMockLineData());
  const [barData, setBarData] = useState(() => fetchMockBarData());

  const [loading, setLoading] = useState(false);

  // Fetch & update data when range changes
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      if (range === "24h") {
        setLineData([
          { time: "00:00", value: 12 },
          { time: "04:00", value: 18 },
          { time: "08:00", value: 28 },
          { time: "12:00", value: 22 },
          { time: "16:00", value: 30 },
          { time: "20:00", value: 24 },
        ]);

        setBarData([
          { name: "Mon", count: 8 },
          { name: "Tue", count: 12 },
          { name: "Wed", count: 6 },
          { name: "Thu", count: 10 },
          { name: "Fri", count: 9 },
        ]);
      } else if (range === "7d") {
        setLineData(fetchMockLineData());
        setBarData(fetchMockBarData());
      } else {
        // 30 days — amplify the trend
        setLineData(
          fetchMockLineData().map((d, i) => ({
            ...d,
            value: (d as any).value + i * 5,
          }))
        );

        setBarData(
          fetchMockBarData().map((d, i) => ({
            ...d,
            count: (d as any).count + i * 3,
          }))
        );
      }

      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [range]);

  // CSV export
  const aggregatedCSV = useMemo(() => {
    const merged = [
      ...lineData.map((r) => ({ type: "line", ...r })),
      ...barData.map((r) => ({ type: "bar", ...r })),
    ];
    return toCSV(merged);
  }, [lineData, barData]);

  function handleExportCSV() {
    if (!aggregatedCSV) return;

    const blob = new Blob([aggregatedCSV], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `analytics-${range}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of recent activity and trends.
          </p>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3">
          {/* Range Select */}
          <div className="flex items-center gap-2 bg-white rounded-md p-2 shadow-sm">
            <label className="text-xs text-gray-600 mr-2">Range</label>

            <select
              value={range}
              onChange={(e) => setRange(e.target.value as RangeOption)}
              className="border px-2 py-1 rounded-md text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>

          {/* Grid toggle */}
          <div className="flex items-center gap-2 bg-white rounded-md p-2 shadow-sm">
            <label className="text-sm">Grid</label>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="h-4 w-4"
            />
          </div>

          <Button
            variant="outline"
            disabled={loading}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* LINE CHART */}

          <div className="h-72 w-full ">
            <LineChartCard data={lineData} showGrid={showGrid} />
          </div>

          {/* BAR CHART */}

          <div className="h-72 w-full">
            <BarChartCard data={barData} showGrid={showGrid} />
          </div>
        </div>

        {/* RIGHT SIDEBAR SUMMARY */}
        <aside className="space-y-4">
          <Card title="Summary">
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Active (peak)</span>
                <span className="font-medium">
                  {Math.max(...lineData.map((d) => d.value))}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Events</span>
                <span className="font-medium">
                  {barData.reduce((s, b) => s + b.count, 0)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Range</span>
                <span className="font-medium uppercase">{range}</span>
              </div>
            </div>
          </Card>

          <Card title="Controls">
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                onClick={() => alert("Run report (demo)")}
              >
                Run Report
              </Button>

              <Button
                variant="ghost"
                onClick={() => alert("More filters (demo)")}
              >
                More Filters
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
