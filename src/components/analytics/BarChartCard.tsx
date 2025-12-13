import React, { useEffect, useState } from "react";
import { Card } from "../cards/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
} from "recharts";
import { signupSourcesService } from "../../api/mock/signupSources";
import { TrendingUp, Users, TrendingDown } from "lucide-react";

/* ---------- TYPES ---------- */
type SignupSource = {
  name: string;
  count: number;
  percentage: number;
  change: string;
  description: string;
};

/* ---------- VIBRANT BAR COLORS ---------- */
const BAR_COLORS = [
  "#93C5FD", // soft blue
  "#86EFAC", // soft green
  "#D8B4FE", // soft purple
  "#FDBA74", // soft orange
  "#67E8F9", // soft cyan
  "#FCA5A5", // soft red
  "#BEF264", // soft lime
  "#FDE68A", // soft yellow
];


export default function BarChartCard() {
  const [data, setData] = useState<SignupSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    average: number;
    topSource: SignupSource;
    growth: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sourcesData, statsData] = await Promise.all([
          signupSourcesService.fetchSources({
            limit: 8,
            sortBy: "count",
            order: "desc",
          }),
          signupSourcesService.fetchSourceStats(),
        ]);

        setData(sourcesData);
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load signup sources", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const unsubscribe = signupSourcesService.subscribe((newData) => {
      setData(newData.slice(0, 8));
    });

    return unsubscribe;
  }, []);

  /* ---------- LOADING ---------- */
  if (loading) {
    return (
      <Card title="Signups by Source">
        <div className="h-64 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          Loading signup data…
        </div>
      </Card>
    );
  }

  /* ---------- TOOLTIP ---------- */
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;

    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700">
        <div className="font-semibold text-gray-900 dark:text-slate-100 mb-2">
          {d.name}
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Signups</span>
            <span className="font-medium text-gray-900 dark:text-slate-100">
              {d.count.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Percentage</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {d.percentage}%
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-slate-400">Change</span>
            <span
              className={`flex items-center ${
                d.change.startsWith("+")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {d.change.startsWith("+") ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {d.change}
            </span>
          </div>

          <div className="pt-2 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 dark:text-slate-400">
            {d.description}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card
      title="Signups by Source"
      action={
        stats && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
              <Users className="w-4 h-4" />
              Total: {stats.total.toLocaleString()}
            </div>
            <div className="hidden lg:flex items-center gap-2 text-sm">
              <span className="text-gray-600 dark:text-slate-400">
                Top Source:
              </span>
              <span className="font-medium text-gray-900 dark:text-slate-100">
                {stats.topSource.name}
              </span>
            </div>
          </div>
        )
      }
    >
      <div className="space-y-4">
        {/* ---------- STATS ---------- */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Total Signups" value={stats.total} color="blue" />
            <Stat label="Avg / Source" value={stats.average} color="green" />
            <Stat
              label="Growth"
              value={`${stats.growth}%`}
              color="purple"
              icon={<TrendingUp className="w-5 h-5 mr-1" />}
            />
            <Stat
              label="Top Source"
              value={stats.topSource.count}
              color="orange"
            />
          </div>
        )}

        {/* ---------- CHART ---------- */}
        <div className="h-64 w-full ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="rgba(148,163,184,0.25)"
              />

              {/* 🔑 FORCE ALL X AXIS LABELS */}
              <XAxis
                dataKey="name"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={50}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fontSize: 11, fill: "#6B7280" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toLocaleString()}
              />

              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                formatter={(v) => (
                  <span className="text-xs text-gray-600 dark:text-slate-400">
                    {v}
                  </span>
                )}
              />

              <Bar dataKey="count" name="Signup Count" radius={[6, 6, 0, 0]}>
                {data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={BAR_COLORS[i % BAR_COLORS.length]}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-gray-500 dark:text-slate-400 text-center">
          Data updates in real time. Hover over bars for details.
        </div>
      </div>
    </Card>
  );
}

/* ---------- SMALL STAT CARD ---------- */
function Stat({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={`bg-${color}-50 dark:bg-${color}-900/20 p-3 rounded-lg`}>
      <div className={`text-sm text-${color}-600 dark:text-${color}-400`}>
        {label}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-slate-100 flex items-center">
        {icon}
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
