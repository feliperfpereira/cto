import { create } from "zustand";

import { NATIONS } from "@/data";
import type { Nation } from "@/types/nation";

export type DashboardStatus = "idle" | "loading" | "ready" | "error";

interface NationDashboardState {
  nations: Nation[];
  selectedNationCode?: string;
  status: DashboardStatus;
  selectNation: (code: string) => void;
  clearSelection: () => void;
  setStatus: (status: DashboardStatus) => void;
  setNations: (nations: Nation[]) => void;
  getSelectedNation: () => Nation | undefined;
}

const defaultNations = NATIONS;

export const nationDashboardInitialState: Pick<
  NationDashboardState,
  "nations" | "selectedNationCode" | "status"
> = {
  nations: defaultNations,
  selectedNationCode: defaultNations[0]?.code,
  status: defaultNations.length ? "ready" : "idle",
};

export const useNationDashboardStore = create<NationDashboardState>((set, get) => ({
  ...nationDashboardInitialState,
  selectNation: (code) =>
    set((state) => {
      const exists = state.nations.some((nation) => nation.code === code);

      if (!exists) {
        return { selectedNationCode: undefined, status: "idle" } satisfies Partial<NationDashboardState>;
      }

      return { selectedNationCode: code, status: "ready" } satisfies Partial<NationDashboardState>;
    }),
  clearSelection: () => set({ selectedNationCode: undefined, status: "idle" }),
  setStatus: (status) => set({ status }),
  setNations: (nations) =>
    set(() => ({
      nations,
      selectedNationCode: nations[0]?.code,
      status: nations.length ? "ready" : "idle",
    })),
  getSelectedNation: () => {
    const { nations, selectedNationCode } = get();
    if (!selectedNationCode) {
      return undefined;
    }

    return nations.find((nation) => nation.code === selectedNationCode);
  },
}));
