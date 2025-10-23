"use client";

import { useThemeStore, type ThemeMode } from "@/store/theme-store";

interface UseThemeResult {
  theme: ThemeMode;
  toggleTheme: () => void;
  hasHydrated: boolean;
}

export const useTheme = (): UseThemeResult =>
  useThemeStore((state) => ({
    theme: state.theme,
    toggleTheme: state.toggleTheme,
    hasHydrated: state.hasHydrated,
  }));
