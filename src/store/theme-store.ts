import { create } from "zustand";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  theme: ThemeMode;
  hasHydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  markHydrated: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",
  hasHydrated: false,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => {
    const nextTheme = get().theme === "light" ? "dark" : "light";
    set({ theme: nextTheme });
  },
  markHydrated: () => set({ hasHydrated: true }),
}));
