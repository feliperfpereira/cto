import { Nation } from "@/types/nation";

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a nation's data integrity
 */
export function validateNation(nation: Nation): ValidationResult {
  const errors: ValidationError[] = [];

  // Basic fields
  if (!nation.code || !/^[A-Z]{3}$/.test(nation.code)) {
    errors.push({
      field: "code",
      message: "Code must be a 3-letter uppercase ISO code",
      value: nation.code,
    });
  }

  if (!nation.name || nation.name.trim().length === 0) {
    errors.push({ field: "name", message: "Name is required", value: nation.name });
  }

  if (!nation.officialName || nation.officialName.trim().length === 0) {
    errors.push({
      field: "officialName",
      message: "Official name is required",
      value: nation.officialName,
    });
  }

  // Geography validation
  if (!nation.geography) {
    errors.push({ field: "geography", message: "Geography data is required" });
  } else {
    if (nation.geography.area <= 0) {
      errors.push({
        field: "geography.area",
        message: "Area must be greater than 0",
        value: nation.geography.area,
      });
    }

    if (nation.geography.coastline < 0) {
      errors.push({
        field: "geography.coastline",
        message: "Coastline cannot be negative",
        value: nation.geography.coastline,
      });
    }

    if (nation.geography.coordinates.latitude < -90 || nation.geography.coordinates.latitude > 90) {
      errors.push({
        field: "geography.coordinates.latitude",
        message: "Latitude must be between -90 and 90",
        value: nation.geography.coordinates.latitude,
      });
    }

    if (
      nation.geography.coordinates.longitude < -180 ||
      nation.geography.coordinates.longitude > 180
    ) {
      errors.push({
        field: "geography.coordinates.longitude",
        message: "Longitude must be between -180 and 180",
        value: nation.geography.coordinates.longitude,
      });
    }

    if (!nation.geography.capital || nation.geography.capital.trim().length === 0) {
      errors.push({
        field: "geography.capital",
        message: "Capital is required",
        value: nation.geography.capital,
      });
    }

    if (!Array.isArray(nation.geography.majorCities) || nation.geography.majorCities.length === 0) {
      errors.push({
        field: "geography.majorCities",
        message: "At least one major city is required",
        value: nation.geography.majorCities,
      });
    }

    if (!Array.isArray(nation.geography.landBorders)) {
      errors.push({
        field: "geography.landBorders",
        message: "Land borders must be an array",
        value: nation.geography.landBorders,
      });
    }
  }

  // Economy validation
  if (!nation.economy) {
    errors.push({ field: "economy", message: "Economy data is required" });
  } else {
    if (nation.economy.gdp <= 0) {
      errors.push({
        field: "economy.gdp",
        message: "GDP must be greater than 0",
        value: nation.economy.gdp,
      });
    }

    if (nation.economy.gdpGrowthRate < -50 || nation.economy.gdpGrowthRate > 50) {
      errors.push({
        field: "economy.gdpGrowthRate",
        message: "GDP growth rate must be between -50 and 50",
        value: nation.economy.gdpGrowthRate,
      });
    }

    if (nation.economy.unemployment < 0 || nation.economy.unemployment > 100) {
      errors.push({
        field: "economy.unemployment",
        message: "Unemployment must be between 0 and 100",
        value: nation.economy.unemployment,
      });
    }

    if (nation.economy.publicDebt < 0) {
      errors.push({
        field: "economy.publicDebt",
        message: "Public debt cannot be negative",
        value: nation.economy.publicDebt,
      });
    }

    if (!nation.economy.currency || nation.economy.currency.trim().length === 0) {
      errors.push({
        field: "economy.currency",
        message: "Currency is required",
        value: nation.economy.currency,
      });
    }

    if (
      !Array.isArray(nation.economy.majorIndustries) ||
      nation.economy.majorIndustries.length === 0
    ) {
      errors.push({
        field: "economy.majorIndustries",
        message: "At least one major industry is required",
        value: nation.economy.majorIndustries,
      });
    }
  }

  // Demographics validation
  if (!nation.demographics) {
    errors.push({ field: "demographics", message: "Demographics data is required" });
  } else {
    if (nation.demographics.population <= 0) {
      errors.push({
        field: "demographics.population",
        message: "Population must be greater than 0",
        value: nation.demographics.population,
      });
    }

    if (nation.demographics.medianAge <= 0 || nation.demographics.medianAge > 100) {
      errors.push({
        field: "demographics.medianAge",
        message: "Median age must be between 0 and 100",
        value: nation.demographics.medianAge,
      });
    }

    if (nation.demographics.urbanizationRate < 0 || nation.demographics.urbanizationRate > 100) {
      errors.push({
        field: "demographics.urbanizationRate",
        message: "Urbanization rate must be between 0 and 100",
        value: nation.demographics.urbanizationRate,
      });
    }

    if (nation.demographics.literacyRate < 0 || nation.demographics.literacyRate > 100) {
      errors.push({
        field: "demographics.literacyRate",
        message: "Literacy rate must be between 0 and 100",
        value: nation.demographics.literacyRate,
      });
    }

    if (nation.demographics.lifeExpectancy < 40 || nation.demographics.lifeExpectancy > 120) {
      errors.push({
        field: "demographics.lifeExpectancy",
        message: "Life expectancy must be between 40 and 120",
        value: nation.demographics.lifeExpectancy,
      });
    }

    if (
      !Array.isArray(nation.demographics.languages) ||
      nation.demographics.languages.length === 0
    ) {
      errors.push({
        field: "demographics.languages",
        message: "At least one language is required",
        value: nation.demographics.languages,
      });
    }

    nation.demographics.ethnicGroups?.forEach((group, index) => {
      if (!group.name || group.name.trim().length === 0) {
        errors.push({
          field: `demographics.ethnicGroups[${index}].name`,
          message: "Ethnic group name is required",
        });
      }
      if (group.percentage <= 0 || group.percentage > 100) {
        errors.push({
          field: `demographics.ethnicGroups[${index}].percentage`,
          message: "Ethnic group percentage must be between 0 and 100",
          value: group.percentage,
        });
      }
    });

    nation.demographics.religions?.forEach((religion, index) => {
      if (!religion.name || religion.name.trim().length === 0) {
        errors.push({
          field: `demographics.religions[${index}].name`,
          message: "Religion name is required",
        });
      }
      if (religion.percentage <= 0 || religion.percentage > 100) {
        errors.push({
          field: `demographics.religions[${index}].percentage`,
          message: "Religion percentage must be between 0 and 100",
          value: religion.percentage,
        });
      }
    });
  }

  // Military validation
  if (!nation.military) {
    errors.push({ field: "military", message: "Military data is required" });
  } else {
    if (nation.military.activeDuty < 0) {
      errors.push({
        field: "military.activeDuty",
        message: "Active duty personnel cannot be negative",
        value: nation.military.activeDuty,
      });
    }

    if (nation.military.reserves < 0) {
      errors.push({
        field: "military.reserves",
        message: "Reserve personnel cannot be negative",
        value: nation.military.reserves,
      });
    }

    if (nation.military.defense < 0) {
      errors.push({
        field: "military.defense",
        message: "Defense spending cannot be negative",
        value: nation.military.defense,
      });
    }

    if (nation.military.defenseAsPercentGDP < 0 || nation.military.defenseAsPercentGDP > 20) {
      errors.push({
        field: "military.defenseAsPercentGDP",
        message: "Defense as percent GDP must be between 0 and 20",
        value: nation.military.defenseAsPercentGDP,
      });
    }

    if (typeof nation.military.nuclearWeapons !== "boolean") {
      errors.push({
        field: "military.nuclearWeapons",
        message: "Nuclear weapons must be a boolean",
        value: nation.military.nuclearWeapons,
      });
    }
  }

  // Diplomacy validation
  if (!nation.diplomacy) {
    errors.push({ field: "diplomacy", message: "Diplomacy data is required" });
  } else {
    if (!Array.isArray(nation.diplomacy.alliances)) {
      errors.push({
        field: "diplomacy.alliances",
        message: "Alliances must be an array",
        value: nation.diplomacy.alliances,
      });
    }

    if (!Array.isArray(nation.diplomacy.relations)) {
      errors.push({
        field: "diplomacy.relations",
        message: "Relations must be an array",
        value: nation.diplomacy.relations,
      });
    } else {
      nation.diplomacy.relations.forEach((relation, index) => {
        if (!relation.nationCode || !/^[A-Z]{3}$/.test(relation.nationCode)) {
          errors.push({
            field: `diplomacy.relations[${index}].nationCode`,
            message: "Relation nation code must be a 3-letter uppercase ISO code",
            value: relation.nationCode,
          });
        }

        if (typeof relation.tradeAgreement !== "boolean") {
          errors.push({
            field: `diplomacy.relations[${index}].tradeAgreement`,
            message: "Trade agreement must be a boolean",
            value: relation.tradeAgreement,
          });
        }

        if (typeof relation.defensePact !== "boolean") {
          errors.push({
            field: `diplomacy.relations[${index}].defensePact`,
            message: "Defense pact must be a boolean",
            value: relation.defensePact,
          });
        }
      });
    }

    if (nation.diplomacy.softPower < 0 || nation.diplomacy.softPower > 100) {
      errors.push({
        field: "diplomacy.softPower",
        message: "Soft power must be between 0 and 100",
        value: nation.diplomacy.softPower,
      });
    }

    if (nation.diplomacy.diplomaticMissions < 0) {
      errors.push({
        field: "diplomacy.diplomaticMissions",
        message: "Diplomatic missions cannot be negative",
        value: nation.diplomacy.diplomaticMissions,
      });
    }

    if (typeof nation.diplomacy.unSecurityCouncilMember !== "boolean") {
      errors.push({
        field: "diplomacy.unSecurityCouncilMember",
        message: "UN Security Council member must be a boolean",
        value: nation.diplomacy.unSecurityCouncilMember,
      });
    }
  }

  // Index scores validation
  if (nation.stability < 0 || nation.stability > 100) {
    errors.push({
      field: "stability",
      message: "Stability must be between 0 and 100",
      value: nation.stability,
    });
  }

  if (nation.corruption < 0 || nation.corruption > 100) {
    errors.push({
      field: "corruption",
      message: "Corruption must be between 0 and 100",
      value: nation.corruption,
    });
  }

  if (nation.freedomIndex < 0 || nation.freedomIndex > 100) {
    errors.push({
      field: "freedomIndex",
      message: "Freedom index must be between 0 and 100",
      value: nation.freedomIndex,
    });
  }

  // Date validation
  if (!nation.lastUpdated) {
    errors.push({ field: "lastUpdated", message: "Last updated date is required" });
  } else {
    try {
      const date = new Date(nation.lastUpdated);
      if (isNaN(date.getTime())) {
        errors.push({
          field: "lastUpdated",
          message: "Last updated must be a valid ISO date string",
          value: nation.lastUpdated,
        });
      }
    } catch {
      errors.push({
        field: "lastUpdated",
        message: "Last updated must be a valid ISO date string",
        value: nation.lastUpdated,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all nations in a dataset
 */
export function validateNations(nations: Nation[]): Map<string, ValidationResult> {
  const results = new Map<string, ValidationResult>();

  nations.forEach((nation) => {
    const result = validateNation(nation);
    if (!result.valid) {
      results.set(nation.code, result);
    }
  });

  return results;
}

/**
 * Get a summary of validation results
 */
export function getValidationSummary(validationResults: Map<string, ValidationResult>): {
  total: number;
  invalid: number;
  errorCount: number;
} {
  let errorCount = 0;
  validationResults.forEach((result) => {
    errorCount += result.errors.length;
  });

  return {
    total: validationResults.size,
    invalid: validationResults.size,
    errorCount,
  };
}
