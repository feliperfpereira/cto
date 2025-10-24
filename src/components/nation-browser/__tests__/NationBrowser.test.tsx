import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { describe, expect, beforeEach, afterEach, it, vi } from "vitest";

import { NationBrowser } from "@/components/nation-browser";
import { NATIONS } from "@/data";
import { createQueryClient } from "@/lib/react-query";
import { nationDashboardInitialState, useNationDashboardStore } from "@/store/nation-dashboard-store";
import type { NationSortField, SortOrder } from "@/lib/nation-api";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

type FetchArgs = Parameters<typeof fetch>;
type FetchReturn = ReturnType<typeof fetch>;

const fetchMock = vi.fn<FetchReturn, FetchArgs>();

global.fetch = fetchMock as unknown as typeof fetch;

describe("NationBrowser", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockRouterPush.mockReset();
    fetchMock.mockReset();

    act(() => {
      useNationDashboardStore.setState(() => ({
        ...nationDashboardInitialState,
        nations: NATIONS,
      }));
    });

    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const requestUrl = typeof input === "string" ? input : input.toString();
      const url = new URL(requestUrl, "https://worldforge.test");
      const searchParam = url.searchParams.get("search");
      const limitParam = url.searchParams.get("limit");

      const items = searchParam
        ? NATIONS.filter((nation) =>
            nation.name.toLowerCase().includes(searchParam.toLowerCase()) ||
            nation.code.toLowerCase().includes(searchParam.toLowerCase()),
          )
        : NATIONS.slice(0, 6);

      return Promise.resolve({
        ok: true,
        json: async () => ({
          data: items,
          meta: {
            total: NATIONS.length,
            filtered: items.length,
            count: items.length,
            hasMore: false,
            limit: limitParam ? Number.parseInt(limitParam, 10) : null,
            sort: {
              field: (url.searchParams.get("sort") ?? "name") as NationSortField,
              order: (url.searchParams.get("order") ?? "asc") as SortOrder,
            },
            filters: searchParam ? { search: searchParam } : {},
          },
        }),
      } as unknown as Response);
    });
  });

  afterEach(() => {
    useNationDashboardStore.persist?.clearStorage?.();
    act(() => {
      useNationDashboardStore.setState(() => ({
        ...nationDashboardInitialState,
        nations: NATIONS,
      }));
    });
  });

  const renderBrowser = () => {
    const client = createQueryClient();

    return render(
      <QueryClientProvider client={client}>
        <NationBrowser />
      </QueryClientProvider>,
    );
  };

  it("allows selecting a nation and starting the game", async () => {
    renderBrowser();

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    const selectChinaButton = await screen.findByRole("button", { name: /Select China/i });

    fireEvent.click(selectChinaButton);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /China/i })).toBeInTheDocument();
    });

    const startButton = screen.getByRole("button", { name: /Start game with China/i });
    expect(startButton).toBeEnabled();

    fireEvent.click(startButton);

    expect(mockRouterPush).toHaveBeenCalledWith("/command");
    expect(useNationDashboardStore.getState().selectedNationCode).toBe("CHN");
  });

  it("updates results when applying a search filter", async () => {
    renderBrowser();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const searchInput = screen.getByLabelText(/Search nations/i);
    fireEvent.change(searchInput, { target: { value: "Japan" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));

    const selectJapanButton = await screen.findByRole("button", { name: /Select Japan/i });
    expect(selectJapanButton).toBeInTheDocument();
  });
});
