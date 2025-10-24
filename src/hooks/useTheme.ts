"use client";

import { useThemeStore, type ThemeMode } from "@/store/theme-store";

interface UseThemeResult {
  theme: ThemeMode;
  toggleTheme: () => void;
  hasHydrated: boolean;
}

export const useTheme = (): UseThemeResult => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const hasHydrated = useThemeStore((state) => state.hasHydrated);

  return { theme, toggleTheme, hasHydrated };
};
