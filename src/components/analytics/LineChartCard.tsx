import React from "react";
import { Card } from "../cards/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type LinePoint = { time: string; value: number };

type Props = {
  data?: LinePoint[];    // optional: will fall back to sampleData
  title?: string;
  showGrid?: boolean;
};

const sampleLineData: LinePoint[] = [
  { time: "09:00", value: 30 },
  { time: "10:00", value: 45 },
  { time: "11:00", value: 60 },
  { time: "12:00", value: 50 },
  { time: "13:00", value: 70 },
];

export default function LineChartCard({
  data = sampleLineData,
  title = "Active Users Over Time",
  showGrid = true,
}: Props) {
  // Guard: if data is empty, show friendly fallback (avoids blank chart)
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
    <Card title={title}>
      {/* Use same height as your BarChartCard for consistent layout */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: 0, bottom: 6 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.12} />}
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                padding: "6px 10px",
                border: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
