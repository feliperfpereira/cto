"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatNumber } from "@/lib/utils";
import type { Nation } from "@/types/nation";

const tooltipStyles = {
  background: "rgba(15, 23, 42, 0.94)",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  color: "#e2e8f0",
  padding: "0.75rem 1rem",
};

const formatPercentage = (value: number, fractionDigits = 1) =>
  `${value.toFixed(fractionDigits)}%`;

interface DemographicsSectionProps {
  demographics: Nation["demographics"];
}

export function DemographicsSection({ demographics }: DemographicsSectionProps) {
  const ethnicityData = useMemo(
    () =>
      demographics.ethnicGroups
        .slice(0, 4)
        .map((group) => ({
          name: group.name,
          percentage: Number(group.percentage.toFixed(1)),
        })),
    [demographics.ethnicGroups],
  );

  const metricItems = [
    {
      label: "Population",
      value: formatNumber(demographics.population, { maximumFractionDigits: 0 }),
      helper: "Total residents",
    },
    {
      label: "Median age",
      value: `${demographics.medianAge.toFixed(1)} years`,
      helper: "Population median age",
    },
    {
      label: "Urbanization",
      value: formatPercentage(demographics.urbanizationRate),
      helper: "Residents in urban areas",
    },
    {
      label: "Life expectancy",
      value: `${demographics.lifeExpectancy.toFixed(1)} years`,
      helper: "Average life expectancy",
    },
  ];

  return (
    <section
      aria-labelledby="demographics-section-title"
      className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Demographics</p>
        <h3 id="demographics-section-title" className="text-2xl font-semibold">
          Population insights
        </h3>
        <p className="text-xs text-[rgb(var(--color-muted))]">
          Linguistic diversity includes {demographics.languages.slice(0, 3).join(", ")}
          {demographics.languages.length > 3 ? " and more" : ""}.
        </p>
      </header>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ethnicityData} margin={{ top: 10, right: 24, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={tooltipStyles}
              cursor={{ fill: "rgba(14, 165, 233, 0.08)" }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, "Population share"]}
            />
            <Bar dataKey="percentage" radius={[10, 10, 10, 10]} fill="rgb(56 189 248)" />
          </BarChart>
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
