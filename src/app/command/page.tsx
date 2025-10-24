import type { Metadata } from "next";

import { NationalDashboard } from "@/components/national-dashboard";

export const metadata: Metadata = {
  title: "Command Deck | Worldforge AI",
  description: "Monitor national intelligence and launch adaptive operations from the Worldforge command deck.",
};

export default function CommandPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Command deck</p>
        <h1 className="text-4xl font-semibold text-[rgb(var(--color-foreground))] sm:text-5xl">
          Operational intelligence dashboard
        </h1>
        <p className="max-w-3xl text-sm text-[rgb(var(--color-muted))]">
          Review your selected nation&apos;s economic posture, demographic signals, military readiness, and
          diplomatic reach. Adjust strategy or switch contexts without losing your campaign state.
        </p>
      </header>

      <NationalDashboard />
    </div>
  );
}
