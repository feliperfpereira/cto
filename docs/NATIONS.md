# Nation Domain Models

This document describes the nation domain models, seed data, utility helpers, and validation functions implemented for the Worldforge AI Command Center.

## Overview

The nation domain system provides comprehensive TypeScript types, realistic seed data for 20 modern nations, utility functions for data manipulation and analysis, and robust validation tools.

## Files Structure

```
src/
├── types/
│   ├── nation.ts                          # TypeScript interfaces and enums
│   └── __tests__/nation.test.ts          # Type/enum tests
├── data/
│   ├── nations.ts                         # Seed data (20 nations)
│   └── __tests__/nations.test.ts         # Data integrity tests
├── lib/
│   ├── nation-utils.ts                    # Utility helpers
│   ├── nation-validator.ts                # Validation functions
│   └── __tests__/
│       ├── nation-utils.test.ts          # Utility tests
│       └── nation-validator.test.ts      # Validator tests
```

## Type System

### Core Types

- **`Nation`**: Complete nation data structure with all categories
- **`Economy`**: Economic metrics (GDP, growth, debt, currency, industries)
- **`Demographics`**: Population data (size, age, urbanization, languages, religions)
- **`Military`**: Defense data (personnel, spending, weapons, nuclear status)
- **`Diplomacy`**: International relations (alliances, relations, soft power)
- **`Geography`**: Physical data (area, borders, coastline, coordinates)
- **`NationMetrics`**: Computed metrics (GDP per capita, power indices)

### Enums

- **`GovernmentType`**: Democracy, autocracy, monarchy, communist, etc.
- **`EconomicSystem`**: Capitalist, socialist, mixed, command, traditional
- **`MilitaryPosture`**: Aggressive, defensive, neutral, expansionist, isolationist
- **`DiplomaticStance`**: Allied, friendly, neutral, unfriendly, hostile
- **`Region`**: North America, Europe, Asia, Africa, Middle East, etc.
- **`AllianceAffiliation`**: NATO, EU, G7, G20, BRICS, etc.

## Seed Data

The dataset includes 20 representative modern nations with realistic 2024 metrics:

- **Americas**: USA, Canada, Mexico, Brazil, Argentina
- **Europe**: UK, Germany, France, Italy, Spain, Russia, Turkey
- **Asia**: China, India, Japan, South Korea
- **Middle East**: Saudi Arabia
- **Africa**: South Africa, Egypt
- **Oceania**: Australia

Each nation includes:

- Complete geography (area, borders, coordinates, cities)
- Economic data (GDP, growth, trade, industries)
- Demographics (population, age, urbanization, ethnicities, languages)
- Military capabilities (personnel, spending, weapons systems)
- Diplomatic relations (alliances, bilateral relations, soft power)
- Governance indices (stability, corruption, freedom)

## Utility Functions

### Computed Values

```typescript
computeGdpPerCapita(nation: Nation): number
computeMilitaryPerCapita(nation: Nation): number
computeDefensePerCapita(nation: Nation): number
computeEconomicPowerIndex(nation: Nation): number  // 0-100
computeMilitaryPowerIndex(nation: Nation): number  // 0-100
computeOverallPowerIndex(nation: Nation): number   // 0-100
computeNationMetrics(nation: Nation): NationMetrics
```

### Lookup and Filtering

```typescript
getNationByCode(code: string): Nation | undefined
getNationsByRegion(region: string): Nation[]
getNationsByAlliance(alliance: string): Nation[]
getNuclearNations(): Nation[]
```

### Rankings

```typescript
getTopNationsByGdp(count?: number): Nation[]
getTopNationsByPopulation(count?: number): Nation[]
getTopNationsByDefenseSpending(count?: number): Nation[]
```

### Diplomatic Relations

```typescript
getDiplomaticStance(code1: string, code2: string): string | undefined
haveTradeAgreement(code1: string, code2: string): boolean
haveDefensePact(code1: string, code2: string): boolean
```

### Geographic Analysis

```typescript
calculateDistance(nation1: Nation, nation2: Nation): number
getNeighbors(nation: Nation): Nation[]
```

### Search and Comparison

```typescript
searchNationsByName(query: string): Nation[]
compareNations(code1: string, code2: string): NationComparison | null
```

## Validation

### Functions

```typescript
validateNation(nation: Nation): ValidationResult
validateNations(nations: Nation[]): Map<string, ValidationResult>
getValidationSummary(results: Map<string, ValidationResult>): Summary
```

### Validation Rules

- **ISO Codes**: Must be 3-letter uppercase (e.g., "USA")
- **Geography**:
  - Area > 0 km²
  - Coordinates: latitude [-90, 90], longitude [-180, 180]
  - Coastline ≥ 0
- **Economy**:
  - GDP > 0
  - Growth rate [-50, 50]%
  - Unemployment [0, 100]%
  - Public debt ≥ 0%
- **Demographics**:
  - Population > 0
  - Median age (0, 100]
  - Rates [0, 100]%
  - Life expectancy [40, 120]
- **Military**:
  - Personnel ≥ 0
  - Spending ≥ 0
  - Defense/GDP [0, 20]%
- **Diplomacy**:
  - Soft power [0, 100]
  - Missions ≥ 0
- **Indices**: All scores [0, 100]

## Usage Examples

### Basic Lookup

```typescript
import { getNationByCode, computeNationMetrics } from "@/lib/nation-utils";

const usa = getNationByCode("USA");
if (usa) {
  const metrics = computeNationMetrics(usa);
  console.log(`GDP per capita: $${metrics.gdpPerCapita.toFixed(2)}`);
  console.log(`Overall power index: ${metrics.overallPowerIndex.toFixed(1)}`);
}
```

### Regional Analysis

```typescript
import { getNationsByRegion } from "@/lib/nation-utils";

const europeanNations = getNationsByRegion("europe");
console.log(`European nations: ${europeanNations.length}`);
```

### Diplomatic Analysis

```typescript
import { compareNations } from "@/lib/nation-utils";

const comparison = compareNations("USA", "CHN");
if (comparison) {
  console.log(`Distance: ${comparison.distance.toFixed(0)} km`);
  console.log(`Diplomatic stance: ${comparison.diplomaticStance}`);
  console.log(`Trade agreement: ${comparison.tradeAgreement}`);
}
```

### Data Validation

```typescript
import { validateNations } from "@/lib/nation-validator";
import { NATIONS } from "@/data/nations";

const results = validateNations(NATIONS);
if (results.size === 0) {
  console.log("All nations valid!");
} else {
  results.forEach((result, code) => {
    console.error(`${code}: ${result.errors.length} errors`);
  });
}
```

### Power Rankings

```typescript
import { getTopNationsByGdp, computeOverallPowerIndex } from "@/lib/nation-utils";

const topEconomies = getTopNationsByGdp(5);
topEconomies.forEach((nation, index) => {
  const powerIndex = computeOverallPowerIndex(nation);
  console.log(
    `${index + 1}. ${nation.name}: GDP $${nation.economy.gdp}B, Power ${powerIndex.toFixed(1)}`,
  );
});
```

## Testing

The implementation includes comprehensive test coverage:

- **349 total tests** across 4 test suites
- **Type/Enum tests**: Verify all enums are properly defined
- **Data integrity tests**: Validate all 20 nations have complete, valid data
- **Utility tests**: Test all computation, lookup, and analysis functions
- **Validator tests**: Test validation rules for all fields and edge cases

### Running Tests

```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
```

## Data Sources

The seed data is based on real-world 2024 estimates from:

- World Bank
- IMF
- Stockholm International Peace Research Institute (SIPRI)
- CIA World Factbook
- United Nations
- Freedom House
- Transparency International

## Future Enhancements

Potential improvements for future iterations:

1. **More Nations**: Expand dataset to 100+ nations
2. **Historical Data**: Add time-series data for trends
3. **Real-time Updates**: Integration with live data APIs
4. **Advanced Analytics**: More sophisticated power indices
5. **Network Analysis**: Graph-based diplomatic relationship modeling
6. **Economic Modeling**: Trade flow and dependency analysis
7. **Conflict Prediction**: Risk assessment algorithms
8. **Resource Data**: Natural resources, energy, food security
9. **Climate Data**: Emissions, vulnerability, adaptation metrics
10. **Cultural Metrics**: Soft power components, cultural exports

## Contributing

When adding new nations or updating data:

1. Follow the `Nation` interface structure exactly
2. Use ISO 3166-1 alpha-3 codes
3. Ensure all numeric values are realistic
4. Include at least basic diplomatic relations
5. Run validation: `validateNation(newNation)`
6. Add test coverage for any new fields
7. Update this documentation

## License

Part of the Worldforge AI Command Center project.
