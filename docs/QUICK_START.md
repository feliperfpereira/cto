# Nation Domain Models - Quick Start Guide

## Installation

The nation domain models are already integrated into the project. No additional installation needed.

## Basic Usage

### Import What You Need

```typescript
// Get nation data
import { NATIONS, NATIONS_BY_CODE, getNationByCode } from "@/data/nations";

// Use utility functions
import {
  computeNationMetrics,
  getNationsByRegion,
  compareNations,
  getTopNationsByGdp,
} from "@/lib/nation-utils";

// Use types
import type { Nation, Economy, Demographics } from "@/types/nation";

// Validate data
import { validateNation } from "@/lib/nation-validator";
```

## Common Patterns

### 1. Get a Nation by Code

```typescript
import { getNationByCode } from "@/lib/nation-utils";

const usa = getNationByCode("USA"); // Case-insensitive
if (usa) {
  console.log(usa.name); // "United States"
  console.log(usa.economy.gdp); // 27360 (billions)
}
```

### 2. Calculate Metrics

```typescript
import { getNationByCode, computeNationMetrics } from "@/lib/nation-utils";

const nation = getNationByCode("CHN")!;
const metrics = computeNationMetrics(nation);

console.log(`GDP per capita: $${metrics.gdpPerCapita.toLocaleString()}`);
console.log(`Economic power: ${metrics.economicPowerIndex}/100`);
console.log(`Military power: ${metrics.militaryPowerIndex}/100`);
```

### 3. Filter by Region

```typescript
import { getNationsByRegion } from "@/lib/nation-utils";

const europeanNations = getNationsByRegion("europe");
console.log(`Found ${europeanNations.length} European nations`);
```

### 4. Compare Nations

```typescript
import { compareNations } from "@/lib/nation-utils";

const comparison = compareNations("USA", "CHN");
if (comparison) {
  console.log(`Distance: ${comparison.distance} km`);
  console.log(`Stance: ${comparison.diplomaticStance}`);
  console.log(`GDP ratio: ${comparison.metrics1.gdpPerCapita / comparison.metrics2.gdpPerCapita}`);
}
```

### 5. Get Rankings

```typescript
import { getTopNationsByGdp } from "@/lib/nation-utils";

const top5 = getTopNationsByGdp(5);
top5.forEach((nation, i) => {
  console.log(`${i + 1}. ${nation.name}: $${nation.economy.gdp}B`);
});
```

### 6. Search Nations

```typescript
import { searchNationsByName } from "@/lib/nation-utils";

const results = searchNationsByName("united");
// Returns USA and GBR (both have "United" in name)
```

### 7. Validate Data

```typescript
import { validateNation } from "@/lib/nation-validator";

const result = validateNation(myNation);
if (!result.valid) {
  result.errors.forEach((error) => {
    console.error(`${error.field}: ${error.message}`);
  });
}
```

## Available Data

### Nations (20 total)

**Americas:** USA, Canada, Mexico, Brazil, Argentina
**Europe:** UK, Germany, France, Italy, Spain, Russia, Turkey  
**Asia:** China, India, Japan, South Korea
**Middle East:** Saudi Arabia
**Africa:** South Africa, Egypt
**Oceania:** Australia

### Data Categories

Each nation includes:

- **Geography**: Area, borders, coordinates, cities, region
- **Economy**: GDP, growth, unemployment, inflation, debt, currency, industries
- **Demographics**: Population, age, urbanization, literacy, life expectancy, ethnicities, languages, religions
- **Military**: Personnel, spending, weapons, nuclear status, posture
- **Diplomacy**: Alliances, bilateral relations, soft power, UN status
- **Indices**: Stability, corruption, freedom scores

## Utility Functions Reference

### Computed Values

- `computeGdpPerCapita(nation)` → number
- `computeMilitaryPerCapita(nation)` → number
- `computeDefensePerCapita(nation)` → number
- `computeEconomicPowerIndex(nation)` → 0-100
- `computeMilitaryPowerIndex(nation)` → 0-100
- `computeOverallPowerIndex(nation)` → 0-100
- `computeNationMetrics(nation)` → NationMetrics

### Lookups

- `getNationByCode(code)` → Nation | undefined
- `getNationsByRegion(region)` → Nation[]
- `getNationsByAlliance(alliance)` → Nation[]
- `getNuclearNations()` → Nation[]

### Rankings

- `getTopNationsByGdp(count)` → Nation[]
- `getTopNationsByPopulation(count)` → Nation[]
- `getTopNationsByDefenseSpending(count)` → Nation[]

### Diplomatic

- `getDiplomaticStance(code1, code2)` → string | undefined
- `haveTradeAgreement(code1, code2)` → boolean
- `haveDefensePact(code1, code2)` → boolean

### Geographic

- `calculateDistance(nation1, nation2)` → number (km)
- `getNeighbors(nation)` → Nation[]

### Search

- `searchNationsByName(query)` → Nation[]
- `compareNations(code1, code2)` → NationComparison | null

## Type System

```typescript
// Main types
type Nation = {
  code: string;
  name: string;
  officialName: string;
  geography: Geography;
  economy: Economy;
  demographics: Demographics;
  military: Military;
  diplomacy: Diplomacy;
  // ... and more
};

// Enums
enum Region {
  NORTH_AMERICA = "north_america",
  EUROPE = "europe",
  ASIA = "asia",
  // etc.
}

enum GovernmentType {
  DEMOCRACY = "democracy",
  AUTOCRACY = "autocracy",
  // etc.
}

// Computed metrics
type NationMetrics = {
  gdpPerCapita: number;
  militaryPerCapita: number;
  defensePerCapita: number;
  economicPowerIndex: number;
  militaryPowerIndex: number;
  overallPowerIndex: number;
};
```

## Examples

See `src/lib/examples/nation-examples.ts` for 10 complete working examples covering:

1. Basic nation info
2. Derived metrics
3. Regional analysis
4. Global rankings
5. Nation comparison
6. Nuclear nations analysis
7. Search functionality
8. Neighbor analysis
9. Global statistics
10. Alliance analysis

## Testing

Run tests to verify everything works:

```bash
npm run test:run    # Run all tests
npm run typecheck   # Verify types
```

## Need Help?

- **Full Documentation**: See `docs/NATIONS.md`
- **Type Definitions**: Check `src/types/nation.ts`
- **Usage Examples**: Look at `src/lib/examples/nation-examples.ts`
- **Tests**: Review `src/**/__tests__/*.test.ts` for more patterns

## Tips

1. **Case-insensitive codes**: `getNationByCode('usa')` works
2. **Null safety**: Always check if nation exists before using
3. **Metrics caching**: If computing metrics multiple times, cache the result
4. **Region names**: Use lowercase with underscores (e.g., 'north_america')
5. **Alliance names**: Use exact strings (e.g., 'NATO', 'G7', 'BRICS')
