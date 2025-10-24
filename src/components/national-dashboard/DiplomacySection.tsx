"use client";

import type { Nation } from "@/types/nation";

interface DiplomacySectionProps {
  diplomacy: Nation["diplomacy"];
}

const stanceColors: Record<string, string> = {
  allied: "bg-emerald-500/15 text-emerald-400",
  friendly: "bg-sky-500/15 text-sky-400",
  neutral: "bg-slate-500/15 text-slate-300",
  unfriendly: "bg-amber-500/15 text-amber-400",
  hostile: "bg-rose-500/15 text-rose-400",
};

export function DiplomacySection({ diplomacy }: DiplomacySectionProps) {
  const relations = diplomacy.relations.slice(0, 4);

  const metricItems = [
    {
      label: "Alliance participation",
      value: diplomacy.alliances.length ? diplomacy.alliances.join(", ") : "Unaligned",
      helper: "Active multilateral alliances",
    },
    {
      label: "Soft power index",
      value: diplomacy.softPower.toFixed(0),
      helper: "Cultural and diplomatic influence",
    },
    {
      label: "Diplomatic missions",
      value: diplomacy.diplomaticMissions.toString(),
      helper: "Embassies and consulates worldwide",
    },
    {
      label: "UN Security Council",
      value: diplomacy.unSecurityCouncilMember ? "Sitting member" : "Not a member",
      helper: "Permanent or rotating council status",
    },
  ];

  return (
    <section
      aria-labelledby="diplomacy-section-title"
      className="flex flex-col gap-6 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm"
    >
      <header className="flex flex-col gap-1">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Diplomacy</p>
        <h3 id="diplomacy-section-title" className="text-2xl font-semibold">
          International alignment
        </h3>
        <p className="text-xs text-[rgb(var(--color-muted))]">
          Partnership network across {diplomacy.alliances.length || "no"} formal alliances.
        </p>
      </header>

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

      <div>
        <h4 className="text-sm font-semibold text-[rgb(var(--color-muted))]">Strategic relations</h4>
        <ul className="mt-3 flex flex-col gap-3">
          {relations.map((relation) => (
            <li
              key={relation.nationCode}
              className="flex items-start justify-between gap-3 rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4"
            >
              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">{relation.nationCode}</p>
                <p className="text-xs text-[rgb(var(--color-muted))]">
                  Trade agreement {relation.tradeAgreement ? "active" : "inactive"} · Defense pact {relation.defensePact ? "in force" : "not in force"}
                </p>
                {relation.notes ? (
                  <p className="mt-1 text-xs text-[rgb(var(--color-muted))]">{relation.notes}</p>
                ) : null}
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  stanceColors[relation.stance] ?? stanceColors.neutral
                }`}
                aria-label={`Diplomatic stance: ${relation.stance}`}
              >
                {relation.stance}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
