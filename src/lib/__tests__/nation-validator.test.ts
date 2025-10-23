import { describe, it, expect } from "vitest";
import { validateNation, validateNations, getValidationSummary } from "../nation-validator";
import { NATIONS } from "@/data/nations";
import { DiplomaticStance } from "@/types/nation";

describe("Nation Validator", () => {
  describe("Valid Nation", () => {
    it("should validate a correct nation without errors", () => {
      const usa = NATIONS.find((n) => n.code === "USA")!;
      const result = validateNation(usa);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("should validate all nations in the dataset", () => {
      NATIONS.forEach((nation) => {
        const result = validateNation(nation);
        expect(result.valid).toBe(true);
        if (!result.valid) {
          console.error(`${nation.code} validation errors:`, result.errors);
        }
      });
    });
  });

  describe("Invalid Code", () => {
    it("should reject invalid ISO code format", () => {
      const invalidNation = { ...NATIONS[0], code: "US" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "code")).toBe(true);
    });

    it("should reject lowercase ISO code", () => {
      const invalidNation = { ...NATIONS[0], code: "usa" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "code")).toBe(true);
    });

    it("should reject numeric code", () => {
      const invalidNation = { ...NATIONS[0], code: "123" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "code")).toBe(true);
    });
  });

  describe("Invalid Names", () => {
    it("should reject empty name", () => {
      const invalidNation = { ...NATIONS[0], name: "" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "name")).toBe(true);
    });

    it("should reject empty official name", () => {
      const invalidNation = { ...NATIONS[0], officialName: "" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "officialName")).toBe(true);
    });
  });

  describe("Invalid Geography", () => {
    it("should reject negative area", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: { ...NATIONS[0].geography, area: -1000 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "geography.area")).toBe(true);
    });

    it("should reject zero area", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: { ...NATIONS[0].geography, area: 0 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
    });

    it("should reject negative coastline", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: { ...NATIONS[0].geography, coastline: -100 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "geography.coastline")).toBe(true);
    });

    it("should reject invalid latitude", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: {
          ...NATIONS[0].geography,
          coordinates: { latitude: 100, longitude: 0 },
        },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field.includes("latitude"))).toBe(true);
    });

    it("should reject invalid longitude", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: {
          ...NATIONS[0].geography,
          coordinates: { latitude: 0, longitude: 200 },
        },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field.includes("longitude"))).toBe(true);
    });

    it("should reject empty capital", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: { ...NATIONS[0].geography, capital: "" },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "geography.capital")).toBe(true);
    });

    it("should reject empty major cities array", () => {
      const invalidNation = {
        ...NATIONS[0],
        geography: { ...NATIONS[0].geography, majorCities: [] },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "geography.majorCities")).toBe(true);
    });
  });

  describe("Invalid Economy", () => {
    it("should reject negative GDP", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, gdp: -1000 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.gdp")).toBe(true);
    });

    it("should reject unrealistic GDP growth rate", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, gdpGrowthRate: 100 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.gdpGrowthRate")).toBe(true);
    });

    it("should reject invalid unemployment rate", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, unemployment: 150 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.unemployment")).toBe(true);
    });

    it("should reject negative public debt", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, publicDebt: -50 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.publicDebt")).toBe(true);
    });

    it("should reject empty currency", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, currency: "" },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.currency")).toBe(true);
    });

    it("should reject empty major industries", () => {
      const invalidNation = {
        ...NATIONS[0],
        economy: { ...NATIONS[0].economy, majorIndustries: [] },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "economy.majorIndustries")).toBe(true);
    });
  });

  describe("Invalid Demographics", () => {
    it("should reject negative population", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, population: -1000 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.population")).toBe(true);
    });

    it("should reject invalid median age", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, medianAge: 150 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.medianAge")).toBe(true);
    });

    it("should reject invalid urbanization rate", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, urbanizationRate: 150 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.urbanizationRate")).toBe(true);
    });

    it("should reject invalid literacy rate", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, literacyRate: -10 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.literacyRate")).toBe(true);
    });

    it("should reject invalid life expectancy", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, lifeExpectancy: 200 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.lifeExpectancy")).toBe(true);
    });

    it("should reject empty languages array", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: { ...NATIONS[0].demographics, languages: [] },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "demographics.languages")).toBe(true);
    });

    it("should reject invalid ethnic group percentage", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: {
          ...NATIONS[0].demographics,
          ethnicGroups: [{ name: "Test", percentage: 150 }],
        },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field.includes("ethnicGroups"))).toBe(true);
    });

    it("should reject invalid religion percentage", () => {
      const invalidNation = {
        ...NATIONS[0],
        demographics: {
          ...NATIONS[0].demographics,
          religions: [{ name: "Test", percentage: -10 }],
        },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field.includes("religions"))).toBe(true);
    });
  });

  describe("Invalid Military", () => {
    it("should reject negative active duty", () => {
      const invalidNation = {
        ...NATIONS[0],
        military: { ...NATIONS[0].military, activeDuty: -1000 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "military.activeDuty")).toBe(true);
    });

    it("should reject negative reserves", () => {
      const invalidNation = {
        ...NATIONS[0],
        military: { ...NATIONS[0].military, reserves: -500 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "military.reserves")).toBe(true);
    });

    it("should reject negative defense spending", () => {
      const invalidNation = {
        ...NATIONS[0],
        military: { ...NATIONS[0].military, defense: -100 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "military.defense")).toBe(true);
    });

    it("should reject unrealistic defense as percent GDP", () => {
      const invalidNation = {
        ...NATIONS[0],
        military: { ...NATIONS[0].military, defenseAsPercentGDP: 50 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "military.defenseAsPercentGDP")).toBe(true);
    });
  });

  describe("Invalid Diplomacy", () => {
    it("should reject invalid soft power", () => {
      const invalidNation = {
        ...NATIONS[0],
        diplomacy: { ...NATIONS[0].diplomacy, softPower: 150 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "diplomacy.softPower")).toBe(true);
    });

    it("should reject negative diplomatic missions", () => {
      const invalidNation = {
        ...NATIONS[0],
        diplomacy: { ...NATIONS[0].diplomacy, diplomaticMissions: -10 },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "diplomacy.diplomaticMissions")).toBe(true);
    });

    it("should reject invalid relation nation code", () => {
      const invalidNation = {
        ...NATIONS[0],
        diplomacy: {
          ...NATIONS[0].diplomacy,
          relations: [
            {
              nationCode: "XX",
              stance: DiplomaticStance.ALLIED,
              tradeAgreement: true,
              defensePact: false,
            },
          ],
        },
      };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field.includes("relations"))).toBe(true);
    });
  });

  describe("Invalid Index Scores", () => {
    it("should reject invalid stability", () => {
      const invalidNation = { ...NATIONS[0], stability: 150 };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "stability")).toBe(true);
    });

    it("should reject invalid corruption", () => {
      const invalidNation = { ...NATIONS[0], corruption: -10 };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "corruption")).toBe(true);
    });

    it("should reject invalid freedom index", () => {
      const invalidNation = { ...NATIONS[0], freedomIndex: 200 };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "freedomIndex")).toBe(true);
    });
  });

  describe("Invalid Date", () => {
    it("should reject invalid date format", () => {
      const invalidNation = { ...NATIONS[0], lastUpdated: "not a date" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "lastUpdated")).toBe(true);
    });

    it("should reject empty date", () => {
      const invalidNation = { ...NATIONS[0], lastUpdated: "" };
      const result = validateNation(invalidNation);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.field === "lastUpdated")).toBe(true);
    });
  });

  describe("Batch Validation", () => {
    it("should validate all nations in dataset", () => {
      const results = validateNations(NATIONS);
      expect(results.size).toBe(0);
    });

    it("should return results only for invalid nations", () => {
      const validNations = [NATIONS[0], NATIONS[1]];
      const invalidNation = { ...NATIONS[2], code: "XX" };
      const mixed = [...validNations, invalidNation];

      const results = validateNations(mixed);
      expect(results.size).toBe(1);
      expect(results.has("XX")).toBe(true);
    });

    it("should provide validation summary", () => {
      const invalidNation1 = { ...NATIONS[0], code: "XX", stability: 150 };
      const invalidNation2 = { ...NATIONS[1], name: "" };
      const mixed = [invalidNation1, invalidNation2];

      const results = validateNations(mixed);
      const summary = getValidationSummary(results);

      expect(summary.invalid).toBe(2);
      expect(summary.errorCount).toBeGreaterThan(0);
    });
  });
});
