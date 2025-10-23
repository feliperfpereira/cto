import { describe, it, expect } from "vitest";
import {
  computeGdpPerCapita,
  computeMilitaryPerCapita,
  computeDefensePerCapita,
  computeEconomicPowerIndex,
  computeMilitaryPowerIndex,
  computeOverallPowerIndex,
  computeNationMetrics,
  getNationByCode,
  getNationsByRegion,
  getNationsByAlliance,
  getNuclearNations,
  getTopNationsByGdp,
  getTopNationsByPopulation,
  getTopNationsByDefenseSpending,
  getDiplomaticStance,
  haveTradeAgreement,
  haveDefensePact,
  calculateDistance,
  getNeighbors,
  searchNationsByName,
  compareNations,
} from "../nation-utils";
import { NATIONS } from "@/data/nations";

describe("Nation Utilities", () => {
  describe("Computed Values", () => {
    const usa = getNationByCode("USA")!;

    it("should compute GDP per capita correctly", () => {
      const gdpPerCapita = computeGdpPerCapita(usa);
      expect(gdpPerCapita).toBeGreaterThan(0);
      expect(gdpPerCapita).toBeLessThan(1_000_000);
    });

    it("should compute military per capita correctly", () => {
      const militaryPerCapita = computeMilitaryPerCapita(usa);
      expect(militaryPerCapita).toBeGreaterThan(0);
      expect(militaryPerCapita).toBeLessThan(100);
    });

    it("should compute defense per capita correctly", () => {
      const defensePerCapita = computeDefensePerCapita(usa);
      expect(defensePerCapita).toBeGreaterThan(0);
      expect(defensePerCapita).toBeLessThan(100_000);
    });

    it("should handle zero population gracefully", () => {
      const mockNation = { ...usa, demographics: { ...usa.demographics, population: 0 } };
      expect(computeGdpPerCapita(mockNation)).toBe(0);
      expect(computeMilitaryPerCapita(mockNation)).toBe(0);
      expect(computeDefensePerCapita(mockNation)).toBe(0);
    });
  });

  describe("Power Indices", () => {
    const usa = getNationByCode("USA")!;
    const smallNation = getNationByCode("MEX")!;

    it("should compute economic power index in valid range", () => {
      const index = computeEconomicPowerIndex(usa);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(100);
    });

    it("should compute military power index in valid range", () => {
      const index = computeMilitaryPowerIndex(usa);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(100);
    });

    it("should compute overall power index in valid range", () => {
      const index = computeOverallPowerIndex(usa);
      expect(index).toBeGreaterThanOrEqual(0);
      expect(index).toBeLessThanOrEqual(100);
    });

    it("should rank larger economies higher", () => {
      const usaIndex = computeEconomicPowerIndex(usa);
      const mexIndex = computeEconomicPowerIndex(smallNation);
      expect(usaIndex).toBeGreaterThan(mexIndex);
    });

    it("should give nuclear nations higher military power", () => {
      const nuclearNation = NATIONS.find((n) => n.military.nuclearWeapons)!;
      const nonNuclearNation = NATIONS.find((n) => !n.military.nuclearWeapons)!;

      const nuclearIndex = computeMilitaryPowerIndex(nuclearNation);
      const nonNuclearIndex = computeMilitaryPowerIndex({
        ...nonNuclearNation,
        military: {
          ...nonNuclearNation.military,
          activeDuty: nuclearNation.military.activeDuty,
          defense: nuclearNation.military.defense,
        },
      });

      expect(nuclearIndex).toBeGreaterThan(nonNuclearIndex);
    });
  });

  describe("Nation Metrics", () => {
    it("should compute all metrics for a nation", () => {
      const usa = getNationByCode("USA")!;
      const metrics = computeNationMetrics(usa);

      expect(metrics.gdpPerCapita).toBeGreaterThan(0);
      expect(metrics.militaryPerCapita).toBeGreaterThan(0);
      expect(metrics.defensePerCapita).toBeGreaterThan(0);
      expect(metrics.economicPowerIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.economicPowerIndex).toBeLessThanOrEqual(100);
      expect(metrics.militaryPowerIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.militaryPowerIndex).toBeLessThanOrEqual(100);
      expect(metrics.overallPowerIndex).toBeGreaterThanOrEqual(0);
      expect(metrics.overallPowerIndex).toBeLessThanOrEqual(100);
    });
  });

  describe("Nation Lookup", () => {
    it("should find nation by exact code", () => {
      const usa = getNationByCode("USA");
      expect(usa).toBeDefined();
      expect(usa?.code).toBe("USA");
      expect(usa?.name).toBe("United States");
    });

    it("should find nation by lowercase code", () => {
      const usa = getNationByCode("usa");
      expect(usa).toBeDefined();
      expect(usa?.code).toBe("USA");
    });

    it("should return undefined for invalid code", () => {
      const invalid = getNationByCode("XXX");
      expect(invalid).toBeUndefined();
    });
  });

  describe("Region Filtering", () => {
    it("should find nations in North America", () => {
      const northAmerican = getNationsByRegion("north_america");
      expect(northAmerican.length).toBeGreaterThan(0);
      northAmerican.forEach((nation) => {
        expect(nation.geography.region).toBe("north_america");
      });
    });

    it("should find nations in Europe", () => {
      const european = getNationsByRegion("europe");
      expect(european.length).toBeGreaterThan(0);
      european.forEach((nation) => {
        expect(nation.geography.region).toBe("europe");
      });
    });

    it("should return empty array for invalid region", () => {
      const invalid = getNationsByRegion("invalid_region");
      expect(invalid).toEqual([]);
    });
  });

  describe("Alliance Filtering", () => {
    it("should find NATO members", () => {
      const nato = getNationsByAlliance("NATO");
      expect(nato.length).toBeGreaterThan(0);
      nato.forEach((nation) => {
        expect(nation.diplomacy.alliances).toContain("NATO");
      });
    });

    it("should find G7 members", () => {
      const g7 = getNationsByAlliance("G7");
      expect(g7.length).toBeGreaterThan(0);
      expect(g7.length).toBeLessThanOrEqual(7);
    });

    it("should find BRICS members", () => {
      const brics = getNationsByAlliance("BRICS");
      expect(brics.length).toBeGreaterThan(0);
      brics.forEach((nation) => {
        expect(nation.diplomacy.alliances).toContain("BRICS");
      });
    });
  });

  describe("Nuclear Nations", () => {
    it("should find all nuclear nations", () => {
      const nuclear = getNuclearNations();
      expect(nuclear.length).toBeGreaterThan(0);
      nuclear.forEach((nation) => {
        expect(nation.military.nuclearWeapons).toBe(true);
      });
    });

    it("should include P5 members", () => {
      const nuclear = getNuclearNations();
      const codes = nuclear.map((n) => n.code);
      expect(codes).toContain("USA");
      expect(codes).toContain("RUS");
      expect(codes).toContain("CHN");
      expect(codes).toContain("GBR");
      expect(codes).toContain("FRA");
    });
  });

  describe("Top Nations Rankings", () => {
    it("should get top nations by GDP", () => {
      const top = getTopNationsByGdp(5);
      expect(top.length).toBe(5);

      for (let i = 0; i < top.length - 1; i++) {
        expect(top[i].economy.gdp).toBeGreaterThanOrEqual(top[i + 1].economy.gdp);
      }
    });

    it("should get top nations by population", () => {
      const top = getTopNationsByPopulation(5);
      expect(top.length).toBe(5);

      for (let i = 0; i < top.length - 1; i++) {
        expect(top[i].demographics.population).toBeGreaterThanOrEqual(
          top[i + 1].demographics.population,
        );
      }
    });

    it("should get top nations by defense spending", () => {
      const top = getTopNationsByDefenseSpending(5);
      expect(top.length).toBe(5);

      for (let i = 0; i < top.length - 1; i++) {
        expect(top[i].military.defense).toBeGreaterThanOrEqual(top[i + 1].military.defense);
      }
    });

    it("should return all nations if count exceeds total", () => {
      const top = getTopNationsByGdp(1000);
      expect(top.length).toBe(NATIONS.length);
    });
  });

  describe("Diplomatic Relations", () => {
    it("should get diplomatic stance between nations", () => {
      const stance = getDiplomaticStance("USA", "GBR");
      expect(stance).toBeDefined();
      expect(stance).toBe("allied");
    });

    it("should return undefined for non-existent relation", () => {
      const stance = getDiplomaticStance("USA", "XXX");
      expect(stance).toBeUndefined();
    });

    it("should check trade agreements", () => {
      const hasAgreement = haveTradeAgreement("USA", "GBR");
      expect(typeof hasAgreement).toBe("boolean");
    });

    it("should check defense pacts", () => {
      const hasPact = haveDefensePact("USA", "GBR");
      expect(typeof hasPact).toBe("boolean");
    });

    it("should return false for invalid nation codes", () => {
      expect(haveTradeAgreement("XXX", "YYY")).toBe(false);
      expect(haveDefensePact("XXX", "YYY")).toBe(false);
    });
  });

  describe("Distance Calculation", () => {
    it("should calculate distance between nations", () => {
      const usa = getNationByCode("USA")!;
      const gbr = getNationByCode("GBR")!;
      const distance = calculateDistance(usa, gbr);

      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeGreaterThan(5000);
      expect(distance).toBeLessThan(10000);
    });

    it("should calculate zero distance for same nation", () => {
      const usa = getNationByCode("USA")!;
      const distance = calculateDistance(usa, usa);
      expect(distance).toBe(0);
    });

    it("should be symmetric", () => {
      const usa = getNationByCode("USA")!;
      const chn = getNationByCode("CHN")!;
      const distance1 = calculateDistance(usa, chn);
      const distance2 = calculateDistance(chn, usa);
      expect(distance1).toBeCloseTo(distance2, 1);
    });
  });

  describe("Neighbors", () => {
    it("should find neighbors for USA", () => {
      const usa = getNationByCode("USA")!;
      const neighbors = getNeighbors(usa);
      expect(neighbors.length).toBeGreaterThan(0);

      const codes = neighbors.map((n) => n.code);
      expect(codes).toContain("CAN");
      expect(codes).toContain("MEX");
    });

    it("should return empty array for island nations without neighbors", () => {
      const aus = getNationByCode("AUS")!;
      const neighbors = getNeighbors(aus);
      expect(neighbors).toEqual([]);
    });

    it("should filter out invalid border codes", () => {
      const usa = getNationByCode("USA")!;
      const mockNation = {
        ...usa,
        geography: { ...usa.geography, landBorders: ["CAN", "XXX", "MEX"] },
      };
      const neighbors = getNeighbors(mockNation);
      expect(neighbors.length).toBe(2);
    });
  });

  describe("Search", () => {
    it("should find nations by full name", () => {
      const results = searchNationsByName("United States");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].code).toBe("USA");
    });

    it("should find nations by partial name", () => {
      const results = searchNationsByName("United");
      expect(results.length).toBeGreaterThan(0);
      const codes = results.map((n) => n.code);
      expect(codes).toContain("USA");
      expect(codes).toContain("GBR");
    });

    it("should find nations by code", () => {
      const results = searchNationsByName("USA");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].code).toBe("USA");
    });

    it("should be case-insensitive", () => {
      const results1 = searchNationsByName("CHINA");
      const results2 = searchNationsByName("china");
      expect(results1.length).toBe(results2.length);
    });

    it("should return empty array for no matches", () => {
      const results = searchNationsByName("Atlantis");
      expect(results).toEqual([]);
    });
  });

  describe("Nation Comparison", () => {
    it("should compare two nations successfully", () => {
      const comparison = compareNations("USA", "CHN");
      expect(comparison).not.toBeNull();
      expect(comparison?.nation1.code).toBe("USA");
      expect(comparison?.nation2.code).toBe("CHN");
      expect(comparison?.metrics1).toBeDefined();
      expect(comparison?.metrics2).toBeDefined();
      expect(comparison?.distance).toBeGreaterThan(0);
    });

    it("should include diplomatic data in comparison", () => {
      const comparison = compareNations("USA", "GBR");
      expect(comparison).not.toBeNull();
      expect(comparison?.diplomaticStance).toBeDefined();
      expect(typeof comparison?.tradeAgreement).toBe("boolean");
      expect(typeof comparison?.defensePact).toBe("boolean");
    });

    it("should return null for invalid nations", () => {
      const comparison1 = compareNations("XXX", "USA");
      expect(comparison1).toBeNull();

      const comparison2 = compareNations("USA", "YYY");
      expect(comparison2).toBeNull();

      const comparison3 = compareNations("XXX", "YYY");
      expect(comparison3).toBeNull();
    });

    it("should work with lowercase codes", () => {
      const comparison = compareNations("usa", "gbr");
      expect(comparison).not.toBeNull();
    });
  });

  describe("Integration Tests", () => {
    it("should find all G7 members and verify they're major economies", () => {
      const g7 = getNationsByAlliance("G7");

      g7.forEach((nation) => {
        expect(nation.economy.gdp).toBeGreaterThan(1000);
      });
    });

    it("should verify nuclear nations have high military spending", () => {
      const nuclear = getNuclearNations();
      nuclear.forEach((nation) => {
        expect(nation.military.defense).toBeGreaterThan(10);
      });
    });

    it("should verify NATO members have defense pacts with each other", () => {
      const nato = getNationsByAlliance("NATO");
      if (nato.length >= 2) {
        const nation1 = nato[0];
        const nation2 = nato[1];

        if (nation1.diplomacy.relations.some((r) => r.nationCode === nation2.code)) {
          const hasPact = haveDefensePact(nation1.code, nation2.code);
          expect(hasPact).toBe(true);
        }
      }
    });
  });
});
