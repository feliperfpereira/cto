import { act, render, screen } from "@testing-library/react";

import { NATIONS } from "@/data";
import { NationalDashboard } from "@/components/national-dashboard";
import { nationDashboardInitialState, useNationDashboardStore } from "@/store/nation-dashboard-store";

const resetNationStore = () => {
  act(() => {
    useNationDashboardStore.setState((state) => ({
      ...state,
      ...nationDashboardInitialState,
      nations: NATIONS,
    }));
  });
};

describe("NationalDashboard", () => {
  beforeEach(() => {
    resetNationStore();
  });

  afterEach(() => {
    resetNationStore();
  });

  it("renders the dashboard overview when data is available", () => {
    render(<NationalDashboard />);

    expect(
      screen.getByRole("region", { name: /National dashboard for United States/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Economic performance/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Population insights/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Force readiness profile/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /International alignment/i })).toBeInTheDocument();
  });

  it("renders a loading placeholder when data is being prepared", () => {
    act(() => {
      useNationDashboardStore.setState((state) => ({ ...state, status: "loading" }));
    });

    render(<NationalDashboard />);

    expect(screen.getByText(/Loading national data/i)).toBeInTheDocument();
  });

  it("renders an empty placeholder when no nation is selected", () => {
    act(() => {
      useNationDashboardStore.setState((state) => ({
        ...state,
        selectedNationCode: undefined,
        status: "idle",
      }));
    });

    render(<NationalDashboard />);

    expect(screen.getByText(/Select a nation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select a nation/i)).toBeInTheDocument();
  });
});
