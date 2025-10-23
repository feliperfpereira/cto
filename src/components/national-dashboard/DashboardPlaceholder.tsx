"use client";

import type { ReactNode } from "react";

interface DashboardPlaceholderProps {
  title: string;
  description: string;
  status?: "loading" | "empty" | "error";
  action?: ReactNode;
}

export function DashboardPlaceholder({ title, description, status = "empty", action }: DashboardPlaceholderProps) {
  return (
    <section
      aria-busy={status === "loading"}
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-10 text-center"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">
          {status === "loading" ? "Loading" : status === "error" ? "Unavailable" : "No selection"}
        </p>
        <h3 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">{title}</h3>
        <p className="text-sm text-[rgb(var(--color-muted))]">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </section>
  );
}
