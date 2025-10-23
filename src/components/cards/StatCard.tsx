interface StatCardProps {
  title: string;
  value: string;
  delta?: {
    value: string;
    trend: "up" | "down" | "neutral";
  };
  helper?: string;
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "neutral" }) => {
  if (trend === "neutral") {
    return (
      <svg className="h-3.5 w-3.5 text-[rgb(var(--color-muted))]" viewBox="0 0 12 12" aria-hidden>
        <path
          d="M2 6h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return trend === "up" ? (
    <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 12 12" aria-hidden>
      <path
        d="M3 7L6 4l3 3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg className="h-3.5 w-3.5 text-rose-500" viewBox="0 0 12 12" aria-hidden>
      <path
        d="M3 5l3 3 3-3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export function StatCard({ title, value, delta, helper }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-3 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-sm">
      <div>
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">{title}</p>
        <p className="mt-2 text-3xl leading-tight font-semibold">{value}</p>
      </div>

      {helper ? <p className="text-sm text-[rgb(var(--color-muted))]">{helper}</p> : null}

      {delta ? (
        <div className="flex items-center gap-2 text-xs font-medium text-[rgb(var(--color-muted))]">
          <TrendIcon trend={delta.trend} />
          <span>{delta.value}</span>
        </div>
      ) : null}
    </div>
  );
}
