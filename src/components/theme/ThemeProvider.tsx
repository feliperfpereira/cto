"use client";

import { useEffect, useRef } from "react";

import { THEME_STORAGE_KEY, useThemeStore, type ThemeMode } from "@/store/theme-store";

const getStoredTheme = (): ThemeMode | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch {
    // Ignore storage access issues (e.g. private browsing modes).
  }

  return null;
};

const getSystemTheme = (): ThemeMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty("color-scheme", theme);
  root.classList.toggle("dark", theme === "dark");
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);
  const setHasHydrated = useThemeStore((state) => state.setHasHydrated);
  const hasResolvedInitialTheme = useRef(false);

  useEffect(() => {
    const rehydrate = async () => {
      try {
        await useThemeStore.persist.rehydrate();
      } finally {
        if (!useThemeStore.getState().hasHydrated) {
          setHasHydrated(true);
        }
      }
    };

    void rehydrate();
  }, [setHasHydrated]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let targetTheme = theme;

    if (!hasResolvedInitialTheme.current) {
      const storedTheme = getStoredTheme();
      const resolvedTheme = storedTheme ?? getSystemTheme();

      hasResolvedInitialTheme.current = true;
      targetTheme = resolvedTheme;

      if (resolvedTheme !== theme) {
        setTheme(resolvedTheme);
      }
    }

    applyThemeToDocument(targetTheme);
  }, [hasHydrated, setTheme, theme]);

  return <>{children}</>;
}
