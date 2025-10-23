"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="flex min-h-screen flex-col bg-[rgb(var(--color-background))] text-[rgb(var(--color-foreground))]">
      <header className="sticky top-0 z-30 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-background)_/_0.95)] backdrop-blur supports-[backdrop-filter]:bg-[rgb(var(--color-background)_/_0.85)]">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2 font-semibold" prefetch={false}>
            <Image
              src="/assets/worldforge-mark.svg"
              alt="Worldforge AI"
              width={32}
              height={32}
              priority
            />
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm tracking-[0.2em] text-[rgb(var(--color-muted))] uppercase">
                Worldforge
              </span>
              <span className="text-lg font-semibold">AI Command</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-1 py-1 text-sm md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3 py-1.5 transition-colors duration-200 ease-out",
                    isActive
                      ? "bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))]"
                      : "text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]",
                  )}
                  prefetch={false}
                >
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-2 text-xs font-medium text-[rgb(var(--color-muted))]",
                        isActive && "border-transparent text-[rgb(var(--color-foreground))]",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="hidden items-center rounded-full bg-[rgb(var(--color-foreground))] px-4 py-2 text-sm font-medium text-[rgb(var(--color-background))] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg md:inline-flex"
              prefetch={false}
            >
              Request access
            </Link>
          </div>
        </div>

        <div className="px-4 pb-4 md:hidden">
          <div className="flex items-center justify-between rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-3">
            <div className="flex gap-2 overflow-x-auto text-sm">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={`${item.label}-mobile`}
                    href={item.href}
                    className={cn(
                      "rounded-full px-3 py-1 whitespace-nowrap transition-colors duration-200 ease-out",
                      isActive
                        ? "bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))]"
                        : "text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-foreground))]",
                    )}
                    prefetch={false}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-[rgb(var(--color-border))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-muted))]"
              prefetch={false}
            >
              Request access
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 lg:px-10">{children}</div>
      </main>

      <footer className="border-t border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-[rgb(var(--color-muted))] sm:px-8 sm:py-8 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-10">
          <span>© {year} Worldforge AI. All rights reserved.</span>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/privacy"
              className="hover:text-[rgb(var(--color-foreground))]"
              prefetch={false}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[rgb(var(--color-foreground))]"
              prefetch={false}
            >
              Terms
            </Link>
            <Link
              href="mailto:hello@worldforge.ai"
              className="hover:text-[rgb(var(--color-foreground))]"
            >
              hello@worldforge.ai
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
