/**
 * Enums and constants for nation-related data
 */

export enum GovernmentType {
  DEMOCRACY = "democracy",
  AUTOCRACY = "autocracy",
  MONARCHY = "monarchy",
  THEOCRACY = "theocracy",
  COMMUNIST = "communist",
  MILITARY_JUNTA = "military_junta",
  FEDERATION = "federation",
  REPUBLIC = "republic",
  PARLIAMENTARY = "parliamentary",
  PRESIDENTIAL = "presidential",
}

export enum EconomicSystem {
  CAPITALIST = "capitalist",
  SOCIALIST = "socialist",
  MIXED = "mixed",
  COMMAND = "command",
  TRADITIONAL = "traditional",
}

export enum MilitaryPosture {
  AGGRESSIVE = "aggressive",
  DEFENSIVE = "defensive",
  NEUTRAL = "neutral",
  EXPANSIONIST = "expansionist",
  ISOLATIONIST = "isolationist",
}

export enum DiplomaticStance {
  ALLIED = "allied",
  FRIENDLY = "friendly",
  NEUTRAL = "neutral",
  UNFRIENDLY = "unfriendly",
  HOSTILE = "hostile",
}

export enum Region {
  NORTH_AMERICA = "north_america",
  SOUTH_AMERICA = "south_america",
  EUROPE = "europe",
  AFRICA = "africa",
  MIDDLE_EAST = "middle_east",
  ASIA = "asia",
  OCEANIA = "oceania",
  CENTRAL_AMERICA = "central_america",
}

export enum AllianceAffiliation {
  NATO = "NATO",
  EU = "EU",
  AFRICAN_UNION = "African Union",
  ASEAN = "ASEAN",
  ARAB_LEAGUE = "Arab League",
  BRICS = "BRICS",
  G7 = "G7",
  G20 = "G20",
  UNALIGNED = "Unaligned",
}

/**
 * Economic data for a nation
 */
export interface Economy {
  gdp: number; // Total GDP in billions USD
  gdpGrowthRate: number; // Annual GDP growth rate as percentage
  gdpPerCapita?: number; // Optional, can be computed
  unemployment: number; // Unemployment rate as percentage
  inflation: number; // Inflation rate as percentage
  publicDebt: number; // Public debt as percentage of GDP
  tradeBalance: number; // Trade balance in billions USD
  economicSystem: EconomicSystem;
  currency: string;
  majorIndustries: string[];
}

/**
 * Demographic data for a nation
 */
export interface Demographics {
  population: number; // Total population
  populationGrowthRate: number; // Annual growth rate as percentage
  medianAge: number; // Median age in years
  urbanizationRate: number; // Percentage of population in urban areas
  literacyRate: number; // Percentage of literate population
  lifeExpectancy: number; // Average life expectancy in years
  ethnicGroups: { name: string; percentage: number }[];
  languages: string[];
  religions: { name: string; percentage: number }[];
}

/**
 * Military data for a nation
 */
export interface Military {
  activeDuty: number; // Number of active military personnel
  reserves: number; // Number of reserve military personnel
  defense: number; // Annual defense spending in billions USD
  defenseAsPercentGDP: number; // Defense spending as percentage of GDP
  nuclearWeapons: boolean; // Whether nation possesses nuclear weapons
  militaryPosture: MilitaryPosture;
  majorWeaponSystems: string[];
}

/**
 * Diplomatic relations with other nations
 */
export interface DiplomaticRelation {
  nationCode: string; // ISO code of the related nation
  stance: DiplomaticStance;
  tradeAgreement: boolean;
  defensePact: boolean;
  notes?: string;
}

/**
 * Diplomacy data for a nation
 */
export interface Diplomacy {
  alliances: AllianceAffiliation[];
  relations: DiplomaticRelation[];
  softPower: number; // Soft power index (0-100)
  diplomaticMissions: number; // Number of diplomatic missions
  unSecurityCouncilMember: boolean;
}

/**
 * Geographic data for a nation
 */
export interface Geography {
  region: Region;
  area: number; // Total area in square kilometers
  landBorders: string[]; // ISO codes of bordering nations
  coastline: number; // Coastline length in kilometers
  capital: string;
  majorCities: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Complete nation data structure
 */
export interface Nation {
  code: string; // ISO 3166-1 alpha-3 country code
  name: string;
  officialName: string;
  flag: string; // Emoji or URL to flag
  governmentType: GovernmentType;
  headOfState: string;
  headOfGovernment: string;
  founded?: number; // Year of founding or independence
  geography: Geography;
  economy: Economy;
  demographics: Demographics;
  military: Military;
  diplomacy: Diplomacy;
  stability: number; // Political stability index (0-100)
  corruption: number; // Corruption perception (0-100, higher is less corrupt)
  freedomIndex: number; // Freedom index (0-100, higher is more free)
  lastUpdated: string; // ISO date string
}

/**
 * Computed metrics derived from nation data
 */
export interface NationMetrics {
  gdpPerCapita: number;
  militaryPerCapita: number; // Military personnel per 1000 population
  defensePerCapita: number; // Defense spending per capita
  economicPowerIndex: number; // Composite score (0-100)
  militaryPowerIndex: number; // Composite score (0-100)
  overallPowerIndex: number; // Composite score (0-100)
}
