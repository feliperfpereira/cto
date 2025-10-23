"use client";

import { useEffect } from "react";

import { useThemeStore, type ThemeMode } from "@/store/theme-store";

const THEME_STORAGE_KEY = "worldforge:theme";

const resolveInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _error
  ) {
    // Access to localStorage can fail in private mode; ignore and fallback.
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const markHydrated = useThemeStore((state) => state.markHydrated);

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    setTheme(initialTheme);
    markHydrated();
  }, [markHydrated, setTheme]);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("color-scheme", theme);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _error
    ) {
      // Ignore write failures (e.g., Safari private mode).
    }
  }, [theme]);

  return <>{children}</>;
}
