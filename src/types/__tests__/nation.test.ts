import { describe, it, expect } from "vitest";
import {
  GovernmentType,
  EconomicSystem,
  MilitaryPosture,
  DiplomaticStance,
  Region,
  AllianceAffiliation,
} from "../nation";

describe("Nation Types and Enums", () => {
  it("should have all government types defined", () => {
    expect(GovernmentType.DEMOCRACY).toBe("democracy");
    expect(GovernmentType.AUTOCRACY).toBe("autocracy");
    expect(GovernmentType.MONARCHY).toBe("monarchy");
    expect(GovernmentType.THEOCRACY).toBe("theocracy");
    expect(GovernmentType.COMMUNIST).toBe("communist");
    expect(GovernmentType.MILITARY_JUNTA).toBe("military_junta");
    expect(GovernmentType.FEDERATION).toBe("federation");
    expect(GovernmentType.REPUBLIC).toBe("republic");
    expect(GovernmentType.PARLIAMENTARY).toBe("parliamentary");
    expect(GovernmentType.PRESIDENTIAL).toBe("presidential");
  });

  it("should have all economic systems defined", () => {
    expect(EconomicSystem.CAPITALIST).toBe("capitalist");
    expect(EconomicSystem.SOCIALIST).toBe("socialist");
    expect(EconomicSystem.MIXED).toBe("mixed");
    expect(EconomicSystem.COMMAND).toBe("command");
    expect(EconomicSystem.TRADITIONAL).toBe("traditional");
  });

  it("should have all military postures defined", () => {
    expect(MilitaryPosture.AGGRESSIVE).toBe("aggressive");
    expect(MilitaryPosture.DEFENSIVE).toBe("defensive");
    expect(MilitaryPosture.NEUTRAL).toBe("neutral");
    expect(MilitaryPosture.EXPANSIONIST).toBe("expansionist");
    expect(MilitaryPosture.ISOLATIONIST).toBe("isolationist");
  });

  it("should have all diplomatic stances defined", () => {
    expect(DiplomaticStance.ALLIED).toBe("allied");
    expect(DiplomaticStance.FRIENDLY).toBe("friendly");
    expect(DiplomaticStance.NEUTRAL).toBe("neutral");
    expect(DiplomaticStance.UNFRIENDLY).toBe("unfriendly");
    expect(DiplomaticStance.HOSTILE).toBe("hostile");
  });

  it("should have all regions defined", () => {
    expect(Region.NORTH_AMERICA).toBe("north_america");
    expect(Region.SOUTH_AMERICA).toBe("south_america");
    expect(Region.EUROPE).toBe("europe");
    expect(Region.AFRICA).toBe("africa");
    expect(Region.MIDDLE_EAST).toBe("middle_east");
    expect(Region.ASIA).toBe("asia");
    expect(Region.OCEANIA).toBe("oceania");
    expect(Region.CENTRAL_AMERICA).toBe("central_america");
  });

  it("should have all alliance affiliations defined", () => {
    expect(AllianceAffiliation.NATO).toBe("NATO");
    expect(AllianceAffiliation.EU).toBe("EU");
    expect(AllianceAffiliation.AFRICAN_UNION).toBe("African Union");
    expect(AllianceAffiliation.ASEAN).toBe("ASEAN");
    expect(AllianceAffiliation.ARAB_LEAGUE).toBe("Arab League");
    expect(AllianceAffiliation.BRICS).toBe("BRICS");
    expect(AllianceAffiliation.G7).toBe("G7");
    expect(AllianceAffiliation.G20).toBe("G20");
    expect(AllianceAffiliation.UNALIGNED).toBe("Unaligned");
  });
});
