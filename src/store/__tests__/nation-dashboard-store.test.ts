import { act } from "react";
import { afterEach, describe, expect, beforeEach, it } from "vitest";

import { NATIONS } from "@/data";
import { nationDashboardInitialState, useNationDashboardStore } from "@/store/nation-dashboard-store";

describe("nation-dashboard-store", () => {
  beforeEach(() => {
    sessionStorage.clear();
    act(() => {
      useNationDashboardStore.setState(() => ({
        ...nationDashboardInitialState,
        nations: NATIONS,
      }));
    });
  });

  afterEach(() => {
    sessionStorage.clear();
    act(() => {
      useNationDashboardStore.setState(() => ({
        ...nationDashboardInitialState,
        nations: NATIONS,
      }));
    });
  });

  it("persists the selected nation across rehydration", async () => {
    act(() => {
      useNationDashboardStore.getState().selectNation("CHN");
    });

    const persisted = sessionStorage.getItem("nation-dashboard");
    expect(persisted).not.toBeNull();
    expect(persisted ?? "").toContain("CHN");

    act(() => {
      useNationDashboardStore.setState((state) => ({
        ...state,
        selectedNationCode: "USA",
      }));
    });

    await act(async () => {
      await useNationDashboardStore.persist?.rehydrate?.();
    });

    expect(useNationDashboardStore.getState().selectedNationCode).toBe("CHN");
  });
});
