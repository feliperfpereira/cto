"use client";

import { useEffect, useMemo } from "react";

import { useTheme } from "@/hooks/useTheme";

const iconClasses = "h-5 w-5";

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClasses}
    {...props}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconClasses}
    {...props}
  >
    <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" />
  </svg>
);

export function ThemeToggle() {
  const { theme, hasHydrated, toggleTheme } = useTheme();

  useEffect(() => {
    if (!hasHydrated || typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [hasHydrated, theme]);

  const icon = useMemo(() => (theme === "light" ? <MoonIcon /> : <SunIcon />), [theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-sm transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgb(var(--color-foreground))] disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Toggle theme"
      disabled={!hasHydrated}
    >
      {icon}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
