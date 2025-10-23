import Link from "next/link";

import { OverviewChart } from "@/components/charts/OverviewChart";
import { StatCard } from "@/components/cards/StatCard";
import { MapPreview } from "@/components/maps/MapPreview";
import { NationalDashboard } from "@/components/national-dashboard";
import { formatNumber } from "@/lib/utils";

const STATISTICS = [
  {
    title: "Live assets under command",
    value: formatNumber(12450, { maximumFractionDigits: 0 }),
    helper: "Monitored across 42 global regions",
    delta: { value: "+4.6% month over month", trend: "up" as const },
  },
  {
    title: "Autonomous playbooks",
    value: formatNumber(386),
    helper: "Blending geospatial, telemetry, and behavioral data",
    delta: { value: "Stable across the last 24h", trend: "neutral" as const },
  },
  {
    title: "Critical anomalies resolved",
    value: formatNumber(1204, { maximumFractionDigits: 0 }),
    helper: "Adaptive agents mitigated cascading faults in minutes",
    delta: { value: "+12.3% quarter to date", trend: "up" as const },
  },
];

const ACTIVITY_FEED = [
  {
    id: "sahara-array",
    title: "Saharan solar array",
    description: "Stability restored via autonomous cooling orchestration.",
    timestamp: "3 minutes ago",
  },
  {
    id: "pacific-network",
    title: "Pacific relay network",
    description: "Dynamic rerouting prevented 8.4k downtime minutes.",
    timestamp: "18 minutes ago",
  },
  {
    id: "nordic-grid",
    title: "Nordic micro-grid",
    description: "Predictive model pushed resilience patch set 7.2.1.",
    timestamp: "32 minutes ago",
  },
];

const ROADMAP_ITEMS = [
  {
    id: "adaptive-sims",
    title: "Adaptive infrastructure simulations",
    detail: "Stress test fleets with agent-based models and live telemetry overlays.",
  },
  {
    id: "cohort-learning",
    title: "Collaborative cohort learning",
    detail: "Deploy federated intelligence across energy, mobility, and climate verticals.",
  },
  {
    id: "worldforge-exchange",
    title: "Worldforge data exchange",
    detail: "Secure ingress for partner datasets with lineage-aware governance.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-10 pb-16">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-8 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-8 shadow-sm">
          <span className="inline-flex w-fit items-center rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs font-semibold tracking-[0.28em] text-[rgb(var(--color-muted))] uppercase">
            Worldforge AI
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl leading-tight font-semibold sm:text-5xl">
              Orchestrate adaptive infrastructure intelligence
            </h1>
            <p className="max-w-2xl text-lg text-balance text-[rgb(var(--color-muted))]">
              A unified operational plane for geospatial awareness, predictive maintenance, and
              adaptive automation across complex, distributed systems.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/launch"
              className="inline-flex items-center rounded-full bg-[rgb(var(--color-foreground))] px-5 py-2.5 text-sm font-medium text-[rgb(var(--color-background))] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
              prefetch={false}
            >
              Launch orchestration
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center rounded-full border border-[rgb(var(--color-border))] px-5 py-2.5 text-sm font-medium text-[rgb(var(--color-foreground))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--color-background))]"
              prefetch={false}
            >
              Documentation
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATISTICS.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                helper={stat.helper}
                delta={stat.delta}
              />
            ))}
          </div>
        </div>

        <aside className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-6 shadow-sm">
          <header className="space-y-2">
            <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">
              Mission control
            </p>
            <h2 className="text-2xl font-semibold">Live activity stream</h2>
            <p className="text-sm text-[rgb(var(--color-muted))]">
              Prioritized interventions surfaced by Worldforge reasoning agents.
            </p>
          </header>

          <ul className="flex flex-1 flex-col gap-5 text-sm">
            {ACTIVITY_FEED.map((item) => (
              <li
                key={item.id}
                className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-[rgb(var(--color-foreground))]">{item.title}</p>
                  <span className="text-xs text-[rgb(var(--color-muted))]">{item.timestamp}</span>
                </div>
                <p className="mt-2 text-[rgb(var(--color-muted))]">{item.description}</p>
              </li>
            ))}
          </ul>

          <Link
            href="/telemetry"
            className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--color-border))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-foreground))] transition-colors duration-200 ease-out hover:bg-[rgb(var(--color-surface))]"
            prefetch={false}
          >
            View all telemetry
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <OverviewChart />
        <div className="flex h-full flex-col gap-6">
          <MapPreview />
          <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">
                What&apos;s next
              </p>
              <h2 className="text-2xl font-semibold">Worldforge roadmap</h2>
              <p className="text-sm text-[rgb(var(--color-muted))]">
                A preview of the capabilities being tuned for the next release cycle.
              </p>
            </div>
            <ul className="flex flex-1 flex-col gap-4">
              {ROADMAP_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4"
                >
                  <p className="font-medium text-[rgb(var(--color-foreground))]">{item.title}</p>
                  <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <NationalDashboard />
    </div>
  );
}
