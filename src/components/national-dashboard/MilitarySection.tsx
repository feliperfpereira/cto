"use client";

import { useMemo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { formatNumber } from "@/lib/utils";
import type { Nation, NationMetrics } from "@/types/nation";

const tooltipStyles = {
  background: "rgba(15, 23, 42, 0.94)",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  color: "#e2e8f0",
  padding: "0.75rem 1rem",
};

interface MilitarySectionProps {
  military: Nation["military"];
  metrics: NationMetrics;
}

export function MilitarySection({ military, metrics }: MilitarySectionProps) {
  const radarData = useMemo(() => {
    const normalize = (value: number, max: number) => Math.min(100, Math.round((value / max) * 100));

    return [
      {
        metric: "Active duty",
        score: normalize(military.activeDuty, 2_200_000),
      },
      {
        metric: "Reserve",
        score: normalize(military.reserves, 1_200_000),
      },
      {
        metric: "Defense spend",
        score: normalize(military.defense, 900),
      },
      {
        metric: "% GDP",
        score: normalize(military.defenseAsPercentGDP, 6),
      },
      {
        metric: "Power index",
        score: Math.min(100, Math.round(metrics.militaryPowerIndex)),
      },
    ];
  }, [military.activeDuty, military.reserves, military.defense, military.defenseAsPercentGDP, metrics.militaryPowerIndex]);

  const metricItems = [
    {
      label: "Active personnel",
      value: formatNumber(military.activeDuty, { maximumFractionDigits: 0 }),
      helper: "Standing forces",
    },
    {
      label: "Reserve forces",
      value: formatNumber(military.reserves, { maximumFractionDigits: 0 }),
      helper: "Ready reserves",
    },
    {
      label: "Defense budget",
      value: `$${military.defense.toFixed(1)}B`,
      helper: "Annual defense expenditure",
    },
    {
      label: "Nuclear capability",
      value: military.nuclearWeapons ? "Nuclear-armed" : "Conventional",
      helper: military.nuclearWeapons ? "Strategic deterrent present" : "No nuclear arsenal",
    },
  ];

  return (
    <section
      aria-labelledby="military-section-title"
      className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Military</p>
        <h3 id="military-section-title" className="text-2xl font-semibold">
          Force readiness profile
        </h3>
        <p className="text-xs text-[rgb(var(--color-muted))]">
          Defense posture: {military.militaryPosture.replace(/_/g, " ")}
        </p>
      </header>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} outerRadius="80%">
            <PolarGrid stroke="rgba(148, 163, 184, 0.25)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }} />
            <PolarRadiusAxis angle={45} domain={[0, 100]} tick={{ fill: "rgb(var(--color-muted))", fontSize: 10 }} />
            <Tooltip
              contentStyle={tooltipStyles}
              formatter={(value: number, name) => [`${value}`, name as string]}
            />
            <Radar
              name="Capability"
              dataKey="score"
              stroke="rgb(14 165 233)"
              fill="rgb(14 165 233)"
              fillOpacity={0.35}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        {metricItems.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4">
            <dt className="text-xs font-medium text-[rgb(var(--color-muted))]" title={metric.helper}>
              {metric.label}
            </dt>
            <dd className="mt-2 text-xl font-semibold text-[rgb(var(--color-foreground))]">
              {metric.value}
            </dd>
            <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">{metric.helper}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
