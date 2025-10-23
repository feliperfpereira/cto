import { NATIONS } from "@/data/nations";
import { AllianceAffiliation, Nation, Region } from "@/types/nation";

export const NATION_SORT_FIELDS = [
  "name",
  "population",
  "gdp",
  "area",
  "stability",
  "freedomIndex",
  "softPower",
] as const;

export type NationSortField = (typeof NATION_SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

export interface NationListQuery {
  search?: string;
  region?: Region;
  alliance?: AllianceAffiliation;
  sort: NationSortField;
  order: SortOrder;
  limit?: number;
  additionalFilters: Record<string, string | string[]>;
}

export interface NationListResult {
  items: Nation[];
  total: number;
  filteredTotal: number;
  hasMore: boolean;
  query: NationListQuery;
}

const SORT_EXTRACTORS: Record<NationSortField, (nation: Nation) => string | number> = {
  name: (nation) => nation.name,
  population: (nation) => nation.demographics.population,
  gdp: (nation) => nation.economy.gdp,
  area: (nation) => nation.geography.area,
  stability: (nation) => nation.stability,
  freedomIndex: (nation) => nation.freedomIndex,
  softPower: (nation) => nation.diplomacy.softPower,
};

export class InvalidQueryError extends Error {
  public readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "InvalidQueryError";
    this.status = status;
  }
}

const DEFAULT_SORT_FIELD: NationSortField = "name";
const DEFAULT_SORT_ORDER: SortOrder = "asc";
const KNOWN_QUERY_KEYS = new Set(["search", "region", "alliance", "sort", "order", "limit"]);
const NATION_CODE_PATTERN = /^[A-Z]{3}$/;

export function normalizeNationCode(input: string): string {
  return input.trim().toUpperCase();
}

export function assertNationCode(input: string): string {
  const normalized = normalizeNationCode(input);
  if (!NATION_CODE_PATTERN.test(normalized)) {
    throw new InvalidQueryError("Invalid nation code format. Expected a 3-letter ISO code.");
  }

  return normalized;
}

export function parseNationListQuery(params: URLSearchParams): NationListQuery {
  const query: NationListQuery = {
    sort: DEFAULT_SORT_FIELD,
    order: DEFAULT_SORT_ORDER,
    additionalFilters: {},
  };

  const search = params.get("search");
  if (search) {
    const trimmed = search.trim();
    if (trimmed.length > 0) {
      query.search = trimmed;
    }
  }

  const regionParam = params.get("region");
  if (regionParam) {
    const normalized = regionParam.toLowerCase();
    const regionMatch = (Object.values(Region) as string[]).find((value) => value === normalized);

    if (!regionMatch) {
      throw new InvalidQueryError(`Invalid region parameter: ${regionParam}`);
    }

    query.region = regionMatch as Region;
  }

  const allianceParam = params.get("alliance");
  if (allianceParam) {
    const normalized = allianceParam.toLowerCase();
    const allianceMatch = (Object.values(AllianceAffiliation) as string[]).find(
      (value) => value.toLowerCase() === normalized,
    );

    if (!allianceMatch) {
      throw new InvalidQueryError(`Invalid alliance parameter: ${allianceParam}`);
    }

    query.alliance = allianceMatch as AllianceAffiliation;
  }

  const sortParam = params.get("sort");
  if (sortParam) {
    const normalized = sortParam.toLowerCase() as NationSortField;
    if (!(NATION_SORT_FIELDS as readonly string[]).includes(normalized)) {
      throw new InvalidQueryError(`Invalid sort field: ${sortParam}`);
    }

    query.sort = normalized;
  }

  const orderParam = params.get("order");
  if (orderParam) {
    const normalized = orderParam.toLowerCase();
    if (normalized !== "asc" && normalized !== "desc") {
      throw new InvalidQueryError(`Invalid order parameter: ${orderParam}`);
    }

    query.order = normalized;
  }

  const limitParam = params.get("limit");
  if (limitParam) {
    const limit = Number.parseInt(limitParam, 10);
    if (Number.isNaN(limit) || limit <= 0) {
      throw new InvalidQueryError('Invalid "limit" parameter. Expected a positive integer.');
    }

    query.limit = limit;
  }

  params.forEach((value, key) => {
    if (!KNOWN_QUERY_KEYS.has(key)) {
      const existing = query.additionalFilters[key];
      if (existing === undefined) {
        query.additionalFilters[key] = value;
      } else if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        query.additionalFilters[key] = [existing, value];
      }
    }
  });

  return query;
}

export function listNations(query: NationListQuery): NationListResult {
  const total = NATIONS.length;
  let items = [...NATIONS];

  if (query.search) {
    const normalizedSearch = query.search.toLowerCase();
    items = items.filter((nation) => {
      const haystacks = [nation.name, nation.officialName, nation.code];
      return haystacks.some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }

  if (query.region) {
    items = items.filter((nation) => nation.geography.region === query.region);
  }

  if (query.alliance) {
    const alliance = query.alliance;
    items = items.filter((nation) => nation.diplomacy.alliances.includes(alliance));
  }

  const filteredTotal = items.length;

  const extractor = SORT_EXTRACTORS[query.sort];
  items.sort((a, b) => {
    const aValue = extractor(a);
    const bValue = extractor(b);

    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue, undefined, { sensitivity: "base" });
      return query.order === "asc" ? comparison : -comparison;
    }

    const comparison = (aValue as number) - (bValue as number);
    return query.order === "asc" ? comparison : -comparison;
  });

  if (query.limit !== undefined) {
    items = items.slice(0, query.limit);
  }

  const hasMore = query.limit !== undefined && query.limit < filteredTotal;

  return {
    items,
    total,
    filteredTotal,
    hasMore,
    query,
  };
}

export function buildFilterSummary(
  query: NationListQuery,
): Record<string, string | string[]> {
  const filters: Record<string, string | string[]> = {};

  if (query.search) {
    filters.search = query.search;
  }

  if (query.region) {
    filters.region = query.region;
  }

  if (query.alliance) {
    filters.alliance = query.alliance;
  }

  for (const [key, value] of Object.entries(query.additionalFilters)) {
    filters[key] = value;
  }

  return filters;
}
