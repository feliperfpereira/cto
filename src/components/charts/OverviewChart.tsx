"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const buildChartData = () => [
  { name: "Mon", intelligence: 320, coverage: 180 },
  { name: "Tue", intelligence: 420, coverage: 220 },
  { name: "Wed", intelligence: 510, coverage: 230 },
  { name: "Thu", intelligence: 610, coverage: 280 },
  { name: "Fri", intelligence: 760, coverage: 320 },
  { name: "Sat", intelligence: 840, coverage: 350 },
  { name: "Sun", intelligence: 910, coverage: 365 },
];

const tooltipStyles = {
  background: "rgba(15, 23, 42, 0.9)",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.3)",
  color: "#e2e8f0",
  padding: "0.75rem 1rem",
};

export function OverviewChart() {
  const data = useMemo(() => buildChartData(), []);

  return (
    <div className="relative flex h-80 w-full flex-col justify-end overflow-hidden rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.28em] text-[rgb(var(--color-muted))] uppercase">
            Production intelligence
          </p>
          <p className="text-3xl font-semibold">Weekly signal density</p>
        </div>
        <span className="rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-muted))]">
          +18.4% vs last week
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="colorIntelligence" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(14 116 144)" stopOpacity={0.9} />
              <stop offset="95%" stopColor="rgb(14 116 144)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(190 24 93)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="rgb(190 24 93)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
          <XAxis
            axisLine={false}
            tickLine={false}
            dataKey="name"
            tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            dx={-8}
          />
          <Tooltip
            cursor={{ strokeDasharray: "4 4", stroke: "rgba(148, 163, 184, 0.3)" }}
            contentStyle={tooltipStyles}
            itemStyle={{ color: "#f8fafc" }}
          />
          <Area
            type="monotone"
            dataKey="intelligence"
            stroke="rgb(14 116 144)"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorIntelligence)"
          />
          <Area
            type="monotone"
            dataKey="coverage"
            stroke="rgb(190 24 93)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCoverage)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
