"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  type QueryFunctionContext,
  useQuery,
} from "@tanstack/react-query";

import { computeNationMetrics } from "@/lib/nation-utils";
import { cn, formatEnumLabel, formatNumber } from "@/lib/utils";
import { useNationDashboardStore } from "@/store/nation-dashboard-store";
import type { Nation } from "@/types/nation";
import { AllianceAffiliation, Region } from "@/types/nation";
import type { NationSortField, SortOrder } from "@/lib/nation-api";

const DEFAULT_LIMIT = 60;

const sortOptions: Array<{ value: NationSortField; label: string }> = [
  { value: "name", label: "Name" },
  { value: "population", label: "Population" },
  { value: "gdp", label: "GDP" },
  { value: "area", label: "Land area" },
  { value: "stability", label: "Stability" },
  { value: "freedomIndex", label: "Freedom index" },
  { value: "softPower", label: "Soft power" },
];

const regionOptions = Object.values(Region);
const allianceOptions = Object.values(AllianceAffiliation);

type QueryFilters = {
  search: string;
  region: string;
  alliance: string;
  sort: NationSortField;
  order: SortOrder;
};

interface NationListResponse {
  data: Nation[];
  meta: {
    total: number;
    filtered: number;
    count: number;
    hasMore: boolean;
    limit: number | null;
    sort: {
      field: NationSortField;
      order: SortOrder;
    };
    filters: Record<string, string | string[]>;
  };
}

async function fetchNationList({
  queryKey,
  signal,
}: QueryFunctionContext<["nation-browser", QueryFilters]>): Promise<NationListResponse> {
  const [, filters] = queryKey;
  const params = new URLSearchParams();
  params.set("sort", filters.sort);
  params.set("order", filters.order);
  params.set("limit", String(DEFAULT_LIMIT));

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.region) {
    params.set("region", filters.region);
  }

  if (filters.alliance) {
    params.set("alliance", filters.alliance);
  }

  const response = await fetch(`/api/nations?${params.toString()}`, { signal });
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? (payload.error as string)
        : "Failed to load nation data.";

    throw new Error(message);
  }

  return payload as NationListResponse;
}

interface NationCardProps {
  nation: Nation;
  selected: boolean;
  onSelect: (code: string) => void;
}

function NationCard({ nation, selected, onSelect }: NationCardProps) {
  const metrics = useMemo(() => computeNationMetrics(nation), [nation]);
  const alliances = nation.diplomacy.alliances.join(", ");

  return (
    <button
      type="button"
      onClick={() => onSelect(nation.code)}
      aria-pressed={selected}
      aria-label={`Select ${nation.name}`}
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 text-left transition-all duration-200 ease-out",
        selected
          ? "border-[rgb(var(--color-foreground))] shadow-lg"
          : "hover:border-[rgb(var(--color-foreground))]/40 hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {nation.flag}
        </span>
        <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-1 text-xs font-medium text-[rgb(var(--color-muted))]">
          {formatEnumLabel(nation.geography.region)}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-lg font-semibold text-[rgb(var(--color-foreground))]">
          {nation.name}
        </p>
        <p className="text-xs text-[rgb(var(--color-muted))]">
          {nation.officialName}
        </p>
      </div>

      <dl className="grid gap-3 text-sm">
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-[rgb(var(--color-muted))]">Population</dt>
          <dd className="font-medium">{formatNumber(nation.demographics.population)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-[rgb(var(--color-muted))]">GDP</dt>
          <dd className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: nation.economy.currency,
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(nation.economy.gdp * 1_000_000_000)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <dt className="text-[rgb(var(--color-muted))]">Overall power</dt>
          <dd className="font-medium">{metrics.overallPowerIndex.toFixed(0)}</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--color-muted))]">
        <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-2 py-0.5">
          {formatEnumLabel(nation.governmentType)} government
        </span>
        {alliances ? (
          <span className="truncate">{alliances}</span>
        ) : (
          <span>No major alliances</span>
        )}
      </div>

      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-offset-2 transition-opacity",
          selected
            ? "ring-[rgb(var(--color-foreground))] ring-offset-[rgb(var(--color-background))]"
            : "ring-transparent",
        )}
        aria-hidden
      />
    </button>
  );
}

interface NationDetailsProps {
  nation?: Nation;
  onStart: () => void;
  startDisabled: boolean;
}

function NationDetails({ nation, onStart, startDisabled }: NationDetailsProps) {
  const metrics = useMemo(() => (nation ? computeNationMetrics(nation) : undefined), [nation]);

  if (!nation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-6 text-center text-sm text-[rgb(var(--color-muted))]">
        <p>Select a nation to view its intelligence briefing.</p>
        <p className="max-w-[28ch]">Use the browser on the left to explore candidates for your next scenario.</p>
      </div>
    );
  }

  const formattedAlliances = nation.diplomacy.alliances.length
    ? nation.diplomacy.alliances.join(", ")
    : "Unaffiliated";

  return (
    <aside className="flex h-full flex-col gap-5 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <span className="text-3xl" aria-hidden>
            {nation.flag}
          </span>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
              {nation.name}
            </h2>
            <p className="text-xs text-[rgb(var(--color-muted))]">{nation.officialName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[rgb(var(--color-muted))]">
          <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-2 py-0.5">
            {formatEnumLabel(nation.geography.region)}
          </span>
          <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-2 py-0.5">
            {formatEnumLabel(nation.governmentType)} governance
          </span>
          <span className="rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-2 py-0.5">
            Capital: {nation.geography.capital}
          </span>
        </div>
      </div>

      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">Population</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(nation.demographics.population, { maximumFractionDigits: 0 })}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">GDP</dt>
          <dd className="mt-1 text-lg font-semibold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: nation.economy.currency,
              notation: "compact",
              maximumFractionDigits: 1,
            }).format(nation.economy.gdp * 1_000_000_000)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">Overall power</dt>
          <dd className="mt-1 text-lg font-semibold">{metrics?.overallPowerIndex.toFixed(0) ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">Soft power</dt>
          <dd className="mt-1 text-lg font-semibold">{nation.diplomacy.softPower}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">Defense spend</dt>
          <dd className="mt-1 text-lg font-semibold">
            {formatNumber(nation.military.defense, { maximumFractionDigits: 1 })}B
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--color-muted))]">Alliances</dt>
          <dd className="mt-1 text-sm text-[rgb(var(--color-foreground))]">{formattedAlliances}</dd>
        </div>
      </dl>

      <div className="rounded-2xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-4 text-sm text-[rgb(var(--color-muted))]">
        <p>
          {nation.name} maintains {nation.diplomacy.diplomaticMissions} diplomatic missions and reports a
          stability index of {nation.stability}. The corruption index stands at {nation.corruption} with a
          freedom score of {nation.freedomIndex}.
        </p>
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={startDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ease-out",
          startDisabled
            ? "cursor-not-allowed bg-[rgb(var(--color-border))] text-[rgb(var(--color-muted))]"
            : "bg-[rgb(var(--color-foreground))] text-[rgb(var(--color-background))] hover:-translate-y-0.5 hover:shadow-lg",
        )}
      >
        Start game with {nation.name}
      </button>
    </aside>
  );
}

export function NationBrowser() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [alliance, setAlliance] = useState("");
  const [sort, setSort] = useState<NationSortField>("name");
  const [order, setOrder] = useState<SortOrder>("asc");

  const router = useRouter();

  const filters = useMemo(
    () => ({ search, region, alliance, sort, order }),
    [search, region, alliance, sort, order],
  );

  const selectedNationCode = useNationDashboardStore((state) => state.selectedNationCode);
  const selectNation = useNationDashboardStore((state) => state.selectNation);
  const setStatus = useNationDashboardStore((state) => state.setStatus);
  const setNations = useNationDashboardStore((state) => state.setNations);
  const fallbackNations = useNationDashboardStore((state) => state.nations);

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["nation-browser", filters],
    queryFn: fetchNationList,
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });

  const nations = data?.data ?? [];

  useEffect(() => {
    if (isFetching) {
      setStatus("loading");
    }
  }, [isFetching, setStatus]);

  useEffect(() => {
    if (data) {
      setNations(data.data);
    }
  }, [data, setNations]);

  useEffect(() => {
    if (isError) {
      setStatus("error");
    }
  }, [isError, setStatus]);

  const selectedNation = useMemo(() => {
    if (!selectedNationCode) {
      return undefined;
    }

    return nations.find((nation) => nation.code === selectedNationCode) ??
      fallbackNations.find((nation) => nation.code === selectedNationCode);
  }, [fallbackNations, nations, selectedNationCode]);

  const handleResetFilters = () => {
    setSearch("");
    setRegion("");
    setAlliance("");
    setSort("name");
    setOrder("asc");
  };

  const handleStartGame = () => {
    if (!selectedNationCode) return;
    router.push("/command");
  };

  const meta = data?.meta;
  const noResults = !isLoading && !isFetching && nations.length === 0;

  return (
    <section className="space-y-6" aria-label="Nation browser">
      <div className="flex flex-col gap-4 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-[rgb(var(--color-foreground))]">
            Browse strategic nations
          </h1>
          <p className="text-sm text-[rgb(var(--color-muted))]">
            Search and filter to identify the ideal starting point for your campaign.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-5 lg:items-end">
          <label className="lg:col-span-2">
            <span className="text-xs font-medium text-[rgb(var(--color-muted))]">Search nations</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or ISO code"
              className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm text-[rgb(var(--color-foreground))] shadow-sm focus:border-[rgb(var(--color-foreground))] focus:outline-none"
            />
          </label>

          <label>
            <span className="text-xs font-medium text-[rgb(var(--color-muted))]">Region</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm text-[rgb(var(--color-foreground))] shadow-sm focus:border-[rgb(var(--color-foreground))] focus:outline-none"
            >
              <option value="">All regions</option>
              {regionOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnumLabel(option)}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="text-xs font-medium text-[rgb(var(--color-muted))]">Alliance</span>
            <select
              value={alliance}
              onChange={(event) => setAlliance(event.target.value)}
              className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm text-[rgb(var(--color-foreground))] shadow-sm focus:border-[rgb(var(--color-foreground))] focus:outline-none"
            >
              <option value="">Any alliance</option>
              {allianceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2 lg:col-span-2 lg:flex-row lg:items-center lg:justify-end">
            <label className="lg:flex lg:flex-1 lg:flex-col">
              <span className="text-xs font-medium text-[rgb(var(--color-muted))]">Sort by</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as NationSortField)}
                className="mt-1 w-full rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-3 py-2 text-sm text-[rgb(var(--color-foreground))] shadow-sm focus:border-[rgb(var(--color-foreground))] focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => setOrder((current) => (current === "asc" ? "desc" : "asc"))}
              className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] px-4 py-2 text-xs font-semibold text-[rgb(var(--color-foreground))] shadow-sm transition-colors duration-200 ease-out hover:border-[rgb(var(--color-foreground))]"
            >
              {order === "asc" ? "Ascending" : "Descending"}
            </button>

            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--color-border))] px-4 py-2 text-xs font-medium text-[rgb(var(--color-muted))] transition-colors duration-200 ease-out hover:text-[rgb(var(--color-foreground))]"
            >
              Reset
            </button>
          </div>
        </div>

        {meta ? (
          <p className="text-xs text-[rgb(var(--color-muted))]">
            Showing {meta.count} of {meta.filtered} matching nations ({meta.total} total records)
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {isLoading && !nations.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))]"
                />
              ))}
            </div>
          ) : null}

          {isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-6 text-center">
              <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">We couldn't load nations.</p>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Please check your filters and try again.
              </p>
              <button
                type="button"
                onClick={() => {
                  setStatus("loading");
                  refetch();
                }}
                className="inline-flex items-center justify-center rounded-full bg-[rgb(var(--color-foreground))] px-4 py-2 text-xs font-semibold text-[rgb(var(--color-background))]"
              >
                Retry
              </button>
            </div>
          ) : null}

          {noResults ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[rgb(var(--color-border))] bg-[rgb(var(--color-background))] p-6 text-center">
              <p className="text-sm font-medium text-[rgb(var(--color-foreground))]">No nations match your filters.</p>
              <p className="text-xs text-[rgb(var(--color-muted))]">
                Adjust your search criteria or reset filters to view the full catalog.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center rounded-full border border-[rgb(var(--color-border))] px-4 py-2 text-xs font-medium text-[rgb(var(--color-foreground))]"
              >
                Reset filters
              </button>
            </div>
          ) : null}

          {!isError && nations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {nations.map((nation) => (
                <NationCard
                  key={nation.code}
                  nation={nation}
                  selected={nation.code === selectedNationCode}
                  onSelect={selectNation}
                />
              ))}
            </div>
          ) : null}
        </div>

        <NationDetails
          nation={selectedNation}
          onStart={handleStartGame}
          startDisabled={!selectedNationCode || isFetching}
        />
      </div>
    </section>
  );
}
