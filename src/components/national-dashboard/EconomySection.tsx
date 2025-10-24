"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Nation, NationMetrics } from "@/types/nation";

const tooltipStyles = {
  background: "rgba(15, 23, 42, 0.94)",
  borderRadius: "0.75rem",
  border: "1px solid rgba(148, 163, 184, 0.35)",
  color: "#e2e8f0",
  padding: "0.75rem 1rem",
};

const formatCurrency = (value: number, currency: string, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);

const formatPercentage = (value: number, fractionDigits = 1) =>
  `${value.toFixed(fractionDigits)}%`;

const lastUpdatedFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const formatLastUpdatedLabel = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return lastUpdatedFormatter.format(date);
};

interface EconomySectionProps {
  economy: Nation["economy"];
  metrics: NationMetrics;
  lastUpdated: string;
}

export function EconomySection({ economy, metrics, lastUpdated }: EconomySectionProps) {
  const trendData = useMemo(() => {
    const growth = economy.gdpGrowthRate / 100;
    const base = economy.gdp;
    const labels = [-2, -1, 0, 1, 2];

    return labels.map((offset) => {
      const factor = Math.pow(1 + growth, offset);
      const projected = Number.isFinite(factor) ? base * factor : base;
      const label =
        offset === 0 ? "Current" : `${offset > 0 ? `+${offset}` : `−${Math.abs(offset)}`}y`;

      return {
        label,
        gdpBillions: Number(projected.toFixed(2)),
      };
    });
  }, [economy.gdp, economy.gdpGrowthRate]);
  const lastUpdatedLabel = useMemo(() => formatLastUpdatedLabel(lastUpdated), [lastUpdated]);

  const metricItems = [
    {
      label: "Gross domestic product",
      value: `${formatCurrency(economy.gdp * 1_000_000_000, economy.currency, {
        maximumFractionDigits: 1,
        notation: "compact",
      })}`,
      helper: `Total GDP in ${economy.currency}`,
    },
    {
      label: "GDP per capita",
      value: formatCurrency(metrics.gdpPerCapita, economy.currency, {
        maximumFractionDigits: 0,
      }),
      helper: "Economic productivity per citizen",
    },
    {
      label: "Growth rate",
      value: formatPercentage(economy.gdpGrowthRate),
      helper: "Annual GDP growth",
    },
    {
      label: "Inflation",
      value: formatPercentage(economy.inflation),
      helper: "Year-over-year consumer prices",
    },
    {
      label: "Unemployment",
      value: formatPercentage(economy.unemployment),
      helper: "Share of labor force unemployed",
    },
    {
      label: "Public debt",
      value: formatPercentage(economy.publicDebt),
      helper: "Debt as a share of GDP",
    },
  ];

  return (
    <section
      aria-labelledby="economy-section-title"
      className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Economy</p>
        <h3 id="economy-section-title" className="text-2xl font-semibold">
          Economic performance
        </h3>
        <p className="text-xs text-[rgb(var(--color-muted))]">Last refreshed {lastUpdatedLabel}</p>
      </header>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 10, right: 24, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                formatCurrency(value * 1_000_000_000, economy.currency, {
                  maximumFractionDigits: 1,
                  notation: "compact",
                })
              }
              tick={{ fill: "rgb(var(--color-muted))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={tooltipStyles}
              cursor={{ stroke: "rgba(148, 163, 184, 0.3)" }}
              formatter={(value: number) => [
                `${formatCurrency(value * 1_000_000_000, economy.currency, {
                  maximumFractionDigits: 1,
                  notation: "compact",
                })}`,
                "Projected GDP",
              ]}
            />
            <Line
              type="monotone"
              dataKey="gdpBillions"
              stroke="rgb(14 165 233)"
              strokeWidth={2.5}
              dot={{ stroke: "rgb(14 165 233)", strokeWidth: 1.5, r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
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
