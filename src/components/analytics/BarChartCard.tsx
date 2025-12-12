import React from "react";
import { Card } from "../cards/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const sampleBarData = [
  { name: "Mon", count: 12 },
  { name: "Tue", count: 20 },
  { name: "Wed", count: 18 },
  { name: "Thu", count: 27 },
  { name: "Fri", count: 22 },
];

export default function BarChartCard() {
  return (
    <Card title="Weekly Activity Summary">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sampleBarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                padding: "6px 10px",
                border: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="count"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
