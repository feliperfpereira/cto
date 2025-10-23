import { Nation, NationMetrics } from "@/types/nation";
import { NATIONS, NATIONS_BY_CODE } from "@/data/nations";

/**
 * Compute GDP per capita from nation data
 */
export function computeGdpPerCapita(nation: Nation): number {
  if (nation.demographics.population === 0) return 0;
  return (nation.economy.gdp * 1_000_000_000) / nation.demographics.population;
}

/**
 * Compute military personnel per 1000 population
 */
export function computeMilitaryPerCapita(nation: Nation): number {
  if (nation.demographics.population === 0) return 0;
  const totalMilitary = nation.military.activeDuty + nation.military.reserves;
  return (totalMilitary / nation.demographics.population) * 1000;
}

/**
 * Compute defense spending per capita
 */
export function computeDefensePerCapita(nation: Nation): number {
  if (nation.demographics.population === 0) return 0;
  return (nation.military.defense * 1_000_000_000) / nation.demographics.population;
}

/**
 * Compute economic power index (0-100)
 * Based on GDP, GDP growth, and trade balance
 */
export function computeEconomicPowerIndex(nation: Nation): number {
  const gdpScore = Math.min((nation.economy.gdp / 30000) * 40, 40);
  const growthScore = Math.min(Math.max(nation.economy.gdpGrowthRate * 2, 0), 30);
  const tradeScore =
    nation.economy.tradeBalance > 0 ? Math.min((nation.economy.tradeBalance / 1000) * 15, 15) : 0;
  const debtScore = Math.max(15 - (nation.economy.publicDebt / 100) * 15, 0);

  return Math.min(gdpScore + growthScore + tradeScore + debtScore, 100);
}

/**
 * Compute military power index (0-100)
 * Based on active military, defense spending, and nuclear capability
 */
export function computeMilitaryPowerIndex(nation: Nation): number {
  const personnelScore = Math.min((nation.military.activeDuty / 2_000_000) * 30, 30);
  const spendingScore = Math.min((nation.military.defense / 900) * 40, 40);
  const nuclearBonus = nation.military.nuclearWeapons ? 20 : 0;
  const postureBonus = nation.military.militaryPosture === "aggressive" ? 10 : 5;

  return Math.min(personnelScore + spendingScore + nuclearBonus + postureBonus, 100);
}

/**
 * Compute overall power index (0-100)
 * Weighted combination of economic, military, and soft power
 */
export function computeOverallPowerIndex(nation: Nation): number {
  const economicIndex = computeEconomicPowerIndex(nation);
  const militaryIndex = computeMilitaryPowerIndex(nation);
  const softPowerScore = nation.diplomacy.softPower;

  return economicIndex * 0.4 + militaryIndex * 0.35 + softPowerScore * 0.25;
}

/**
 * Compute all metrics for a nation
 */
export function computeNationMetrics(nation: Nation): NationMetrics {
  return {
    gdpPerCapita: computeGdpPerCapita(nation),
    militaryPerCapita: computeMilitaryPerCapita(nation),
    defensePerCapita: computeDefensePerCapita(nation),
    economicPowerIndex: computeEconomicPowerIndex(nation),
    militaryPowerIndex: computeMilitaryPowerIndex(nation),
    overallPowerIndex: computeOverallPowerIndex(nation),
  };
}

/**
 * Get nation by ISO 3166-1 alpha-3 code
 */
export function getNationByCode(code: string): Nation | undefined {
  return NATIONS_BY_CODE[code.toUpperCase()];
}

/**
 * Get all nations in a specific region
 */
export function getNationsByRegion(region: string): Nation[] {
  return NATIONS.filter((nation) => nation.geography.region === region);
}

/**
 * Get nations by alliance affiliation
 */
export function getNationsByAlliance(alliance: string): Nation[] {
  return NATIONS.filter((nation) => nation.diplomacy.alliances.some((a) => a === alliance));
}

/**
 * Get nations with nuclear weapons
 */
export function getNuclearNations(): Nation[] {
  return NATIONS.filter((nation) => nation.military.nuclearWeapons);
}

/**
 * Get top N nations by GDP
 */
export function getTopNationsByGdp(count: number = 10): Nation[] {
  return [...NATIONS].sort((a, b) => b.economy.gdp - a.economy.gdp).slice(0, count);
}

/**
 * Get top N nations by population
 */
export function getTopNationsByPopulation(count: number = 10): Nation[] {
  return [...NATIONS]
    .sort((a, b) => b.demographics.population - a.demographics.population)
    .slice(0, count);
}

/**
 * Get top N nations by military spending
 */
export function getTopNationsByDefenseSpending(count: number = 10): Nation[] {
  return [...NATIONS].sort((a, b) => b.military.defense - a.military.defense).slice(0, count);
}

/**
 * Get diplomatic stance between two nations
 */
export function getDiplomaticStance(nationCode1: string, nationCode2: string): string | undefined {
  const nation = getNationByCode(nationCode1);
  if (!nation) return undefined;

  const relation = nation.diplomacy.relations.find((r) => r.nationCode === nationCode2);
  return relation?.stance;
}

/**
 * Check if two nations have a trade agreement
 */
export function haveTradeAgreement(nationCode1: string, nationCode2: string): boolean {
  const nation = getNationByCode(nationCode1);
  if (!nation) return false;

  const relation = nation.diplomacy.relations.find((r) => r.nationCode === nationCode2);
  return relation?.tradeAgreement ?? false;
}

/**
 * Check if two nations have a defense pact
 */
export function haveDefensePact(nationCode1: string, nationCode2: string): boolean {
  const nation = getNationByCode(nationCode1);
  if (!nation) return false;

  const relation = nation.diplomacy.relations.find((r) => r.nationCode === nationCode2);
  return relation?.defensePact ?? false;
}

/**
 * Calculate distance between two nations (approximate using capital coordinates)
 */
export function calculateDistance(nation1: Nation, nation2: Nation): number {
  const lat1 = (nation1.geography.coordinates.latitude * Math.PI) / 180;
  const lon1 = (nation1.geography.coordinates.longitude * Math.PI) / 180;
  const lat2 = (nation2.geography.coordinates.latitude * Math.PI) / 180;
  const lon2 = (nation2.geography.coordinates.longitude * Math.PI) / 180;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const earthRadiusKm = 6371;
  return earthRadiusKm * c;
}

/**
 * Find neighbors (nations with shared land borders)
 */
export function getNeighbors(nation: Nation): Nation[] {
  return nation.geography.landBorders
    .map((code) => getNationByCode(code))
    .filter((n): n is Nation => n !== undefined);
}

/**
 * Search nations by name (case-insensitive partial match)
 */
export function searchNationsByName(query: string): Nation[] {
  const lowerQuery = query.toLowerCase();
  return NATIONS.filter(
    (nation) =>
      nation.name.toLowerCase().includes(lowerQuery) ||
      nation.officialName.toLowerCase().includes(lowerQuery) ||
      nation.code.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get nation comparison summary
 */
export interface NationComparison {
  nation1: Nation;
  nation2: Nation;
  metrics1: NationMetrics;
  metrics2: NationMetrics;
  distance: number;
  diplomaticStance?: string;
  tradeAgreement: boolean;
  defensePact: boolean;
}

export function compareNations(code1: string, code2: string): NationComparison | null {
  const nation1 = getNationByCode(code1);
  const nation2 = getNationByCode(code2);

  if (!nation1 || !nation2) return null;

  return {
    nation1,
    nation2,
    metrics1: computeNationMetrics(nation1),
    metrics2: computeNationMetrics(nation2),
    distance: calculateDistance(nation1, nation2),
    diplomaticStance: getDiplomaticStance(code1, code2),
    tradeAgreement: haveTradeAgreement(code1, code2),
    defensePact: haveDefensePact(code1, code2),
  };
}
