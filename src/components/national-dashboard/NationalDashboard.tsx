"use client";

import { useMemo } from "react";

import { cn, formatEnumLabel, formatNumber } from "@/lib/utils";
import { computeNationMetrics } from "@/lib/nation-utils";
import type { Nation } from "@/types/nation";
import { useNationDashboardStore } from "@/store/nation-dashboard-store";

import { DashboardPlaceholder } from "./DashboardPlaceholder";
import { DiplomacySection } from "./DiplomacySection";
import { EconomySection } from "./EconomySection";
import { DemographicsSection } from "./DemographicsSection";
import { MilitarySection } from "./MilitarySection";

type NationalDashboardProps = {
  className?: string;
};

interface NationSelectProps {
  nations: Nation[];
  selectedCode?: string;
  onSelect: (code: string) => void;
}

function NationSelector({ nations, selectedCode, onSelect }: NationSelectProps) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] shadow-sm">
      <span className="sr-only">Select nation</span>
      <select
        value={selectedCode ?? ""}
        onChange={(event) => onSelect(event.target.value)}
        className="bg-transparent text-sm focus:outline-none"
        aria-label="Select a nation"
      >
        <option value="" disabled>
          Choose a nation
        </option>
        {nations.map((nation) => (
          <option key={nation.code} value={nation.code}>
            {nation.flag} {nation.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function NationalDashboard({ className }: NationalDashboardProps) {
  const nations = useNationDashboardStore((state) => state.nations);
  const status = useNationDashboardStore((state) => state.status);
  const selectedNationCode = useNationDashboardStore((state) => state.selectedNationCode);
  const selectNation = useNationDashboardStore((state) => state.selectNation);

  const selectedNation = useMemo(
    () => nations.find((nation) => nation.code === selectedNationCode),
    [nations, selectedNationCode],
  );

  const metrics = useMemo(
    () => (selectedNation ? computeNationMetrics(selectedNation) : undefined),
    [selectedNation],
  );

  if (status === "loading") {
    return (
      <DashboardPlaceholder
        status="loading"
        title="Loading national data"
        description="We are preparing the latest intelligence snapshot."
      />
    );
  }

  if (status === "error") {
    return (
      <DashboardPlaceholder
        status="error"
        title="Dashboard unavailable"
        description="We were unable to load the requested nation. Please try again later."
        action={<NationSelector nations={nations} selectedCode={selectedNationCode} onSelect={selectNation} />}
      />
    );
  }

  if (!selectedNation || !metrics) {
    return (
      <DashboardPlaceholder
        title="Select a nation"
        description="Choose a nation from the list to explore its economic, demographic, military, and diplomatic profile."
        action={<NationSelector nations={nations} selectedCode={selectedNationCode} onSelect={selectNation} />}
      />
    );
  }

  const summaryItems = [
    {
      label: "Population",
      value: formatNumber(selectedNation.demographics.population, { maximumFractionDigits: 0 }),
      helper: "Total residents",
    },
    {
      label: "GDP per capita",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: selectedNation.economy.currency,
        maximumFractionDigits: 0,
      }).format(metrics.gdpPerCapita),
      helper: "Economic productivity",
    },
    {
      label: "Overall power index",
      value: metrics.overallPowerIndex.toFixed(0),
      helper: "Composite national strength",
    },
  ];

  return (
    <section
      className={cn("space-y-6", className)}
      aria-label={`National dashboard for ${selectedNation.name}`}
    >
      <header className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">National dashboard</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {selectedNation.flag}
              </span>
              <h2 className="text-3xl font-semibold sm:text-4xl">{selectedNation.name}</h2>
            </div>
            <p className="text-sm text-[rgb(var(--color-muted))]">{selectedNation.officialName}</p>
            <p className="text-xs text-[rgb(var(--color-muted))]">
              Region: {formatEnumLabel(selectedNation.geography.region)} · Government: {formatEnumLabel(selectedNation.governmentType)}
            </p>
          </div>
          <NationSelector nations={nations} selectedCode={selectedNationCode} onSelect={selectNation} />
        </div>

        <dl className="grid gap-4 sm:grid-cols-3">
          {summaryItems.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4"
            >
              <dt className="text-xs font-medium text-[rgb(var(--color-muted))]" title={metric.helper}>
                {metric.label}
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-[rgb(var(--color-foreground))]">
                {metric.value}
              </dd>
              <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">{metric.helper}</p>
            </div>
          ))}
        </dl>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <EconomySection economy={selectedNation.economy} metrics={metrics} lastUpdated={selectedNation.lastUpdated} />
        <DemographicsSection demographics={selectedNation.demographics} />
        <MilitarySection military={selectedNation.military} metrics={metrics} />
        <DiplomacySection diplomacy={selectedNation.diplomacy} />
      </div>
    </section>
  );
}
