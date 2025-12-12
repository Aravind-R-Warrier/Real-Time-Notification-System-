import React from "react";
import LineChartCard from "../components/analytics/LineChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import { Card } from "../components/cards/Card";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left side charts */}
      <div className="lg:col-span-2 space-y-6">
        <LineChartCard />
        <BarChartCard />
      </div>

      {/* Right side */}
      <div className="space-y-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <button className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
              Create report
            </button>

            <button className="w-full py-2.5 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium transition">
              Export
            </button>
          </div>
        </Card>

        <Card title="Stats">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Total Users</span>
              <span className="font-semibold">1,243</span>
            </li>
            <li className="flex justify-between">
              <span>Active Sessions</span>
              <span className="font-semibold">342</span>
            </li>
            <li className="flex justify-between">
              <span>Errors Today</span>
              <span className="text-red-600 font-semibold">5</span>
            </li>
          </ul>
        </Card>

        <Card title="System Status">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>Servers operational</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span>Latency slightly elevated</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
