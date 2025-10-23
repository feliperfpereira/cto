import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { GET as getNationList } from "../route";
import { GET as getNationByCode } from "../[code]/route";
import { NATIONS } from "@/data/nations";
import type { Nation } from "@/types/nation";

type NationsListResponse = {
  data: Nation[];
  meta: {
    total: number;
    filtered: number;
    count: number;
    hasMore: boolean;
    limit: number | null;
    sort: { field: string; order: string };
    filters: Record<string, unknown>;
  };
};

type NationDetailResponse = {
  data: Nation;
  meta: { code: string };
};

describe("Nations API routes", () => {
  it("returns the full list of nations sorted by name", async () => {
    const request = new NextRequest("http://localhost/api/nations");
    const response = await getNationList(request);

    expect(response.status).toBe(200);

    const body = (await response.json()) as NationsListResponse;
    expect(body.data).toHaveLength(NATIONS.length);
    const names = body.data.map((nation) => nation.name);
    const sortedNames = [...names].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    expect(names).toEqual(sortedNames);
    expect(body.meta.total).toBe(NATIONS.length);
    expect(body.meta.count).toBe(NATIONS.length);
    expect(body.meta.filtered).toBe(NATIONS.length);
    expect(body.meta.sort).toEqual({ field: "name", order: "asc" });
    expect(body.meta.hasMore).toBe(false);
    expect(body.meta.limit).toBeNull();
    expect(body.meta.filters).toEqual({});
  });

  it("supports search filtering and reports applied filters", async () => {
    const request = new NextRequest("http://localhost/api/nations?search=United");
    const response = await getNationList(request);

    expect(response.status).toBe(200);

    const body = (await response.json()) as NationsListResponse;
    expect(body.data.length).toBeGreaterThan(0);
    body.data.forEach((nation) => {
      const haystacks = [nation.name, nation.officialName, nation.code];
      expect(haystacks.some((value) => value.toLowerCase().includes("united"))).toBe(true);
    });
    expect(body.meta.filters).toHaveProperty("search", "United");
  });

  it("supports region filters, sorting, and limiting results", async () => {
    const request = new NextRequest(
      "http://localhost/api/nations?region=asia&sort=population&order=desc&limit=3",
    );
    const response = await getNationList(request);

    expect(response.status).toBe(200);

    const body = (await response.json()) as NationsListResponse;
    expect(body.data).toHaveLength(3);
    const populations = body.data.map((nation) => nation.demographics.population);
    const sortedPopulations = [...populations].sort((a, b) => b - a);

    expect(populations).toEqual(sortedPopulations);
    body.data.forEach((nation) => {
      expect(nation.geography.region).toBe("asia");
    });
    expect(body.meta.filters).toHaveProperty("region", "asia");
    expect(body.meta.sort).toEqual({ field: "population", order: "desc" });
    expect(body.meta.limit).toBe(3);
    expect(body.meta.hasMore).toBe(body.meta.filtered > body.meta.count);
    expect(body.meta.filtered).toBeGreaterThanOrEqual(body.meta.count);
  });

  it("returns a 400 error for invalid query parameters", async () => {
    const request = new NextRequest("http://localhost/api/nations?sort=unknown");
    const response = await getNationList(request);

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("Invalid sort field");
  });

  it("returns a single nation by code", async () => {
    const code = "USA";
    const response = await getNationByCode(new NextRequest(`http://localhost/api/nations/${code}`), {
      params: { code },
    });

    expect(response.status).toBe(200);

    const body = (await response.json()) as NationDetailResponse;
    expect(body.data.code).toBe(code);
    expect(body.meta).toEqual({ code });
  });

  it("returns 404 for unknown nation codes", async () => {
    const code = "ZZZ";
    const response = await getNationByCode(new NextRequest(`http://localhost/api/nations/${code}`), {
      params: { code },
    });

    expect(response.status).toBe(404);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain(code);
  });

  it("validates nation code format", async () => {
    const response = await getNationByCode(new NextRequest("http://localhost/api/nations/us"), {
      params: { code: "us" },
    });

    expect(response.status).toBe(400);
    const body = (await response.json()) as { error: string };
    expect(body.error).toContain("Invalid nation code format");
  });
});
