import type { Metadata } from "next";

import { NationBrowser } from "@/components/nation-browser";

export const metadata: Metadata = {
  title: "Launch Scenario | Worldforge AI Command",
  description: "Explore the nation catalog to configure your next Worldforge campaign.",
};

export default function LaunchPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="space-y-3">
        <p className="text-xs tracking-[0.3em] text-[rgb(var(--color-muted))] uppercase">Scenario setup</p>
        <h1 className="text-4xl font-semibold text-[rgb(var(--color-foreground))] sm:text-5xl">
          Launch a new command scenario
        </h1>
        <p className="max-w-2xl text-sm text-[rgb(var(--color-muted))]">
          Choose a nation to seed your simulation. Filters help you zero in on alliances, demographics, and
          power projection profiles that match your objectives.
        </p>
      </header>

      <NationBrowser />
    </div>
  );
}
