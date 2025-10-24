import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "worldforge:theme";

type ThemeState = {
  theme: ThemeMode;
  hasHydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const storage: StateStorage =
  typeof window === "undefined"
    ? {
        getItem: (_name: string) => null,
        setItem: (_name: string, _value: string) => undefined,
        removeItem: (_name: string) => undefined,
      }
    : createJSONStorage(() => window.localStorage);

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage,
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
