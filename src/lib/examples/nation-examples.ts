/**
 * Example usage patterns for nation domain models
 * These examples demonstrate common use cases and patterns
 */

import {
  getNationByCode,
  computeNationMetrics,
  getNationsByRegion,
  getTopNationsByGdp,
  compareNations,
  getNuclearNations,
  searchNationsByName,
  calculateDistance,
  getNeighbors,
} from "@/lib/nation-utils";
import { NATIONS } from "@/data/nations";

/**
 * Example 1: Get basic nation information
 */
export function getBasicNationInfo() {
  const usa = getNationByCode("USA");

  if (!usa) {
    console.log("Nation not found");
    return;
  }

  console.log("=== Basic Nation Info ===");
  console.log(`Name: ${usa.name}`);
  console.log(`Official: ${usa.officialName}`);
  console.log(`Capital: ${usa.geography.capital}`);
  console.log(`Population: ${usa.demographics.population.toLocaleString()}`);
  console.log(`GDP: $${usa.economy.gdp}B`);
  console.log(`Government: ${usa.governmentType}`);
}

/**
 * Example 2: Compute derived metrics
 */
export function getDerivedMetrics() {
  const china = getNationByCode("CHN");

  if (!china) return;

  const metrics = computeNationMetrics(china);

  console.log("=== Derived Metrics ===");
  console.log(`GDP per capita: $${metrics.gdpPerCapita.toLocaleString()}`);
  console.log(`Military per 1000 pop: ${metrics.militaryPerCapita.toFixed(2)}`);
  console.log(`Economic power: ${metrics.economicPowerIndex.toFixed(1)}/100`);
  console.log(`Military power: ${metrics.militaryPowerIndex.toFixed(1)}/100`);
  console.log(`Overall power: ${metrics.overallPowerIndex.toFixed(1)}/100`);
}

/**
 * Example 3: Regional analysis
 */
export function analyzeRegion() {
  const europeanNations = getNationsByRegion("europe");

  console.log("=== European Nations Analysis ===");
  console.log(`Total nations: ${europeanNations.length}`);

  const totalGdp = europeanNations.reduce((sum, n) => sum + n.economy.gdp, 0);
  const totalPop = europeanNations.reduce((sum, n) => sum + n.demographics.population, 0);
  const avgStability =
    europeanNations.reduce((sum, n) => sum + n.stability, 0) / europeanNations.length;

  console.log(`Combined GDP: $${totalGdp.toFixed(0)}B`);
  console.log(`Total population: ${totalPop.toLocaleString()}`);
  console.log(`Average stability: ${avgStability.toFixed(1)}/100`);
}

/**
 * Example 4: Global rankings
 */
export function getGlobalRankings() {
  const topEconomies = getTopNationsByGdp(5);

  console.log("=== Top 5 Economies ===");
  topEconomies.forEach((nation, index) => {
    console.log(`${index + 1}. ${nation.name}: $${nation.economy.gdp}B GDP`);
  });
}

/**
 * Example 5: Compare two nations
 */
export function compareTwoNations() {
  const comparison = compareNations("USA", "CHN");

  if (!comparison) {
    console.log("Comparison failed");
    return;
  }

  console.log("=== USA vs China ===");
  console.log(`Distance: ${comparison.distance.toFixed(0)} km`);
  console.log(`Diplomatic stance: ${comparison.diplomaticStance || "N/A"}`);
  console.log(`Trade agreement: ${comparison.tradeAgreement ? "Yes" : "No"}`);
  console.log(`Defense pact: ${comparison.defensePact ? "Yes" : "No"}`);

  console.log("\nMetrics Comparison:");
  console.log(`USA GDP per capita: $${comparison.metrics1.gdpPerCapita.toLocaleString()}`);
  console.log(`CHN GDP per capita: $${comparison.metrics2.gdpPerCapita.toLocaleString()}`);

  console.log(`USA Overall power: ${comparison.metrics1.overallPowerIndex.toFixed(1)}/100`);
  console.log(`CHN Overall power: ${comparison.metrics2.overallPowerIndex.toFixed(1)}/100`);
}

/**
 * Example 6: Nuclear nations analysis
 */
export function analyzeNuclearNations() {
  const nuclearNations = getNuclearNations();

  console.log("=== Nuclear-Armed Nations ===");
  console.log(`Total: ${nuclearNations.length}`);

  nuclearNations.forEach((nation) => {
    const metrics = computeNationMetrics(nation);
    console.log(
      `- ${nation.name}: ${nation.military.activeDuty.toLocaleString()} active, ` +
        `$${nation.military.defense}B defense, ` +
        `Power: ${metrics.militaryPowerIndex.toFixed(1)}/100`,
    );
  });
}

/**
 * Example 7: Search nations
 */
export function searchExample() {
  const results = searchNationsByName("United");

  console.log("=== Search Results for 'United' ===");
  results.forEach((nation) => {
    console.log(`- ${nation.name} (${nation.code})`);
  });
}

/**
 * Example 8: Analyze neighbors
 */
export function analyzeNeighbors() {
  const germany = getNationByCode("DEU");

  if (!germany) return;

  const neighbors = getNeighbors(germany);

  console.log("=== Germany's Neighbors ===");
  neighbors.forEach((neighbor) => {
    const distance = calculateDistance(germany, neighbor);
    console.log(`- ${neighbor.name}: ${distance.toFixed(0)} km (capital to capital)`);
  });
}

/**
 * Example 9: Analyze all nations
 */
export function getGlobalStatistics() {
  const totalPop = NATIONS.reduce((sum, n) => sum + n.demographics.population, 0);
  const totalGdp = NATIONS.reduce((sum, n) => sum + n.economy.gdp, 0);
  const avgStability = NATIONS.reduce((sum, n) => sum + n.stability, 0) / NATIONS.length;
  const avgFreedom = NATIONS.reduce((sum, n) => sum + n.freedomIndex, 0) / NATIONS.length;

  const nuclearCount = NATIONS.filter((n) => n.military.nuclearWeapons).length;
  const democracies = NATIONS.filter((n) => n.freedomIndex > 70).length;

  console.log("=== Global Statistics (from dataset) ===");
  console.log(`Nations in dataset: ${NATIONS.length}`);
  console.log(`Total population: ${totalPop.toLocaleString()}`);
  console.log(`Total GDP: $${totalGdp.toFixed(0)}B`);
  console.log(`Average stability: ${avgStability.toFixed(1)}/100`);
  console.log(`Average freedom: ${avgFreedom.toFixed(1)}/100`);
  console.log(`Nuclear nations: ${nuclearCount}`);
  console.log(`Free democracies (freedom > 70): ${democracies}`);
}

/**
 * Example 10: Alliance analysis
 */
export function analyzeAlliances() {
  const alliances = ["NATO", "G7", "G20", "BRICS", "EU"];

  console.log("=== Alliance Memberships ===");
  alliances.forEach((alliance) => {
    const members = NATIONS.filter((n) => n.diplomacy.alliances.some((a) => a === alliance));
    console.log(`${alliance}: ${members.length} members`);
    members.forEach((m) => console.log(`  - ${m.name}`));
  });
}

// Uncomment to run examples
// getBasicNationInfo();
// getDerivedMetrics();
// analyzeRegion();
// getGlobalRankings();
// compareTwoNations();
// analyzeNuclearNations();
// searchExample();
// analyzeNeighbors();
// getGlobalStatistics();
// analyzeAlliances();
