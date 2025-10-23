import { describe, it, expect } from "vitest";
import { NATIONS, NATIONS_BY_CODE, NATION_CODES } from "../nations";
import { AllianceAffiliation } from "@/types/nation";

describe("Nations Dataset", () => {
  describe("Data Structure", () => {
    it("should have at least 20 nations in the dataset", () => {
      expect(NATIONS.length).toBeGreaterThanOrEqual(20);
    });

    it("should have all nations with unique ISO codes", () => {
      const codes = NATIONS.map((n) => n.code);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it("should have all ISO codes in uppercase and 3 characters", () => {
      NATIONS.forEach((nation) => {
        expect(nation.code).toMatch(/^[A-Z]{3}$/);
      });
    });

    it("should have NATIONS_BY_CODE map matching NATIONS array", () => {
      expect(Object.keys(NATIONS_BY_CODE).length).toBe(NATIONS.length);
      NATIONS.forEach((nation) => {
        expect(NATIONS_BY_CODE[nation.code]).toEqual(nation);
      });
    });

    it("should have NATION_CODES array matching NATIONS codes", () => {
      expect(NATION_CODES.length).toBe(NATIONS.length);
      const nationCodes = NATIONS.map((n) => n.code);
      expect(NATION_CODES).toEqual(nationCodes);
    });
  });

  describe("Required Fields", () => {
    NATIONS.forEach((nation) => {
      describe(`${nation.name} (${nation.code})`, () => {
        it("should have all required base fields", () => {
          expect(nation.code).toBeTruthy();
          expect(nation.name).toBeTruthy();
          expect(nation.officialName).toBeTruthy();
          expect(nation.flag).toBeTruthy();
          expect(nation.governmentType).toBeTruthy();
          expect(nation.headOfState).toBeTruthy();
          expect(nation.headOfGovernment).toBeTruthy();
        });

        it("should have valid geography data", () => {
          expect(nation.geography).toBeDefined();
          expect(nation.geography.region).toBeTruthy();
          expect(nation.geography.area).toBeGreaterThan(0);
          expect(Array.isArray(nation.geography.landBorders)).toBe(true);
          expect(nation.geography.coastline).toBeGreaterThanOrEqual(0);
          expect(nation.geography.capital).toBeTruthy();
          expect(Array.isArray(nation.geography.majorCities)).toBe(true);
          expect(nation.geography.majorCities.length).toBeGreaterThan(0);
          expect(nation.geography.coordinates.latitude).toBeGreaterThanOrEqual(-90);
          expect(nation.geography.coordinates.latitude).toBeLessThanOrEqual(90);
          expect(nation.geography.coordinates.longitude).toBeGreaterThanOrEqual(-180);
          expect(nation.geography.coordinates.longitude).toBeLessThanOrEqual(180);
        });

        it("should have valid economy data", () => {
          expect(nation.economy).toBeDefined();
          expect(nation.economy.gdp).toBeGreaterThan(0);
          expect(nation.economy.gdpGrowthRate).toBeGreaterThan(-50);
          expect(nation.economy.gdpGrowthRate).toBeLessThan(50);
          expect(nation.economy.unemployment).toBeGreaterThanOrEqual(0);
          expect(nation.economy.unemployment).toBeLessThan(100);
          expect(nation.economy.inflation).toBeGreaterThan(-20);
          expect(nation.economy.inflation).toBeLessThan(200);
          expect(nation.economy.publicDebt).toBeGreaterThanOrEqual(0);
          expect(nation.economy.economicSystem).toBeTruthy();
          expect(nation.economy.currency).toBeTruthy();
          expect(Array.isArray(nation.economy.majorIndustries)).toBe(true);
          expect(nation.economy.majorIndustries.length).toBeGreaterThan(0);
        });

        it("should have valid demographics data", () => {
          expect(nation.demographics).toBeDefined();
          expect(nation.demographics.population).toBeGreaterThan(0);
          expect(nation.demographics.populationGrowthRate).toBeGreaterThan(-10);
          expect(nation.demographics.populationGrowthRate).toBeLessThan(10);
          expect(nation.demographics.medianAge).toBeGreaterThan(0);
          expect(nation.demographics.medianAge).toBeLessThan(100);
          expect(nation.demographics.urbanizationRate).toBeGreaterThanOrEqual(0);
          expect(nation.demographics.urbanizationRate).toBeLessThanOrEqual(100);
          expect(nation.demographics.literacyRate).toBeGreaterThanOrEqual(0);
          expect(nation.demographics.literacyRate).toBeLessThanOrEqual(100);
          expect(nation.demographics.lifeExpectancy).toBeGreaterThan(40);
          expect(nation.demographics.lifeExpectancy).toBeLessThan(120);
          expect(Array.isArray(nation.demographics.ethnicGroups)).toBe(true);
          expect(Array.isArray(nation.demographics.languages)).toBe(true);
          expect(nation.demographics.languages.length).toBeGreaterThan(0);
          expect(Array.isArray(nation.demographics.religions)).toBe(true);
        });

        it("should have valid military data", () => {
          expect(nation.military).toBeDefined();
          expect(nation.military.activeDuty).toBeGreaterThanOrEqual(0);
          expect(nation.military.reserves).toBeGreaterThanOrEqual(0);
          expect(nation.military.defense).toBeGreaterThanOrEqual(0);
          expect(nation.military.defenseAsPercentGDP).toBeGreaterThanOrEqual(0);
          expect(nation.military.defenseAsPercentGDP).toBeLessThan(20);
          expect(typeof nation.military.nuclearWeapons).toBe("boolean");
          expect(nation.military.militaryPosture).toBeTruthy();
          expect(Array.isArray(nation.military.majorWeaponSystems)).toBe(true);
        });

        it("should have valid diplomacy data", () => {
          expect(nation.diplomacy).toBeDefined();
          expect(Array.isArray(nation.diplomacy.alliances)).toBe(true);
          expect(Array.isArray(nation.diplomacy.relations)).toBe(true);
          expect(nation.diplomacy.softPower).toBeGreaterThanOrEqual(0);
          expect(nation.diplomacy.softPower).toBeLessThanOrEqual(100);
          expect(nation.diplomacy.diplomaticMissions).toBeGreaterThanOrEqual(0);
          expect(typeof nation.diplomacy.unSecurityCouncilMember).toBe("boolean");
        });

        it("should have valid index scores", () => {
          expect(nation.stability).toBeGreaterThanOrEqual(0);
          expect(nation.stability).toBeLessThanOrEqual(100);
          expect(nation.corruption).toBeGreaterThanOrEqual(0);
          expect(nation.corruption).toBeLessThanOrEqual(100);
          expect(nation.freedomIndex).toBeGreaterThanOrEqual(0);
          expect(nation.freedomIndex).toBeLessThanOrEqual(100);
        });

        it("should have valid lastUpdated date", () => {
          expect(nation.lastUpdated).toBeTruthy();
          expect(() => new Date(nation.lastUpdated)).not.toThrow();
        });
      });
    });
  });

  describe("Ethnic Groups Percentages", () => {
    NATIONS.forEach((nation) => {
      it(`${nation.name} ethnic groups should have valid percentages`, () => {
        nation.demographics.ethnicGroups.forEach((group) => {
          expect(group.name).toBeTruthy();
          expect(group.percentage).toBeGreaterThan(0);
          expect(group.percentage).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe("Religions Percentages", () => {
    NATIONS.forEach((nation) => {
      it(`${nation.name} religions should have valid percentages`, () => {
        nation.demographics.religions.forEach((religion) => {
          expect(religion.name).toBeTruthy();
          expect(religion.percentage).toBeGreaterThan(0);
          expect(religion.percentage).toBeLessThanOrEqual(100);
        });
      });
    });
  });

  describe("Diplomatic Relations", () => {
    NATIONS.forEach((nation) => {
      it(`${nation.name} relations should reference valid nation codes`, () => {
        nation.diplomacy.relations.forEach((relation) => {
          expect(relation.nationCode).toMatch(/^[A-Z]{3}$/);
          expect(relation.stance).toBeTruthy();
          expect(typeof relation.tradeAgreement).toBe("boolean");
          expect(typeof relation.defensePact).toBe("boolean");
        });
      });
    });
  });

  describe("Land Borders", () => {
    NATIONS.forEach((nation) => {
      it(`${nation.name} land borders should use valid 3-letter codes`, () => {
        nation.geography.landBorders.forEach((borderCode) => {
          expect(borderCode).toMatch(/^[A-Z]{3}$/);
        });
      });
    });
  });

  describe("UN Security Council Members", () => {
    it("should have exactly 5 permanent members", () => {
      const permanentMembers = NATIONS.filter((n) => n.diplomacy.unSecurityCouncilMember);
      expect(permanentMembers.length).toBe(5);

      const memberCodes = permanentMembers.map((n) => n.code);
      expect(memberCodes).toContain("USA");
      expect(memberCodes).toContain("CHN");
      expect(memberCodes).toContain("RUS");
      expect(memberCodes).toContain("GBR");
      expect(memberCodes).toContain("FRA");
    });
  });

  describe("Nuclear Weapons", () => {
    it("should have realistic nuclear weapons states", () => {
      const nuclearNations = NATIONS.filter((n) => n.military.nuclearWeapons);
      expect(nuclearNations.length).toBeGreaterThan(0);
      expect(nuclearNations.length).toBeLessThan(15);

      const nuclearCodes = nuclearNations.map((n) => n.code);
      expect(nuclearCodes).toContain("USA");
      expect(nuclearCodes).toContain("RUS");
      expect(nuclearCodes).toContain("CHN");
      expect(nuclearCodes).toContain("GBR");
      expect(nuclearCodes).toContain("FRA");
    });
  });

  describe("Regional Distribution", () => {
    it("should have nations from multiple regions", () => {
      const regions = new Set(NATIONS.map((n) => n.geography.region));
      expect(regions.size).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Alliance Memberships", () => {
    it("should have NATO members", () => {
      const natoMembers = NATIONS.filter((n) =>
        n.diplomacy.alliances.includes(AllianceAffiliation.NATO),
      );
      expect(natoMembers.length).toBeGreaterThan(0);
    });

    it("should have G7 members", () => {
      const g7Members = NATIONS.filter((n) =>
        n.diplomacy.alliances.includes(AllianceAffiliation.G7),
      );
      expect(g7Members.length).toBeGreaterThan(0);
      expect(g7Members.length).toBeLessThanOrEqual(7);
    });

    it("should have G20 members", () => {
      const g20Members = NATIONS.filter((n) =>
        n.diplomacy.alliances.includes(AllianceAffiliation.G20),
      );
      expect(g20Members.length).toBeGreaterThan(0);
    });

    it("should have BRICS members", () => {
      const bricsMembers = NATIONS.filter((n) =>
        n.diplomacy.alliances.includes(AllianceAffiliation.BRICS),
      );
      expect(bricsMembers.length).toBeGreaterThan(0);
    });
  });
});
