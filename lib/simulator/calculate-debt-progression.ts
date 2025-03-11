import { EconomicEvent, EventSimulator } from "./event-simulator";

// Basic types for our simulation
export interface DebtParameters {
  initialDebt: number; // Initial debt in trillions of USD
  simulationYears: number; // Number of years to simulate
  averageInterestRate: number; // Average interest rate on debt (decimal)
  inflationRate: number; // Average annual inflation rate (decimal)
  annualDeficits: number[]; // Projected annual deficits/surpluses in trillions (negative for surplus)
  initialGDP: number; // Initial GDP in trillions
  baseGDPGrowthRate: number; // Base annual GDP growth rate
  randomEventsEnabled: boolean; // Whether to include random events
  randomSeed?: number; // Optional seed for reproducible randomness
  initialPopulation?: number; // Initial population in millions
  basePopulationGrowthRate?: number; // Base annual population growth rate
}

export interface YearlyDebtData {
  year: number;
  nominalDebt: number; // Debt in current dollars
  realDebt: number; // Debt adjusted for inflation (in initial year dollars)
  interestPayment: number; // Interest paid this year
  principalChange: number; // Change in principal (deficit/surplus)
  gdp: number; // Estimated GDP
  debtToGDPRatio: number; // Debt as percentage of GDP
  inflationAdjustment: number; // How much inflation reduced real debt value
  currentInflationRate: number; // This year's inflation rate (may be affected by events)
  gdpGrowthRate: number; // This year's GDP growth rate
  events: EconomicEvent[]; // Economic events that occurred this year
  eventDeficitImpact: number; // Additional deficit from events
  population?: number; // Population in millions
  populationGrowthRate?: number; // This year's population growth rate
  debtPerCapita?: number; // Debt per person in dollars
}

/**
 * Calculates debt progression over time based on provided parameters
 * and includes random economic events
 */
export function calculateDebtProgression(
  params: DebtParameters
): YearlyDebtData[] {
  const results: YearlyDebtData[] = [];

  // Initialize event simulator and event tracking
  const eventSimulator = params.randomEventsEnabled
    ? new EventSimulator(params.randomSeed)
    : null;
  const eventStartYears = new Map<string, number>();

  // Initial values
  let currentNominalDebt = params.initialDebt;
  const currentYear = new Date().getFullYear();
  let inflationFactor = 1;
  let currentGDP = params.initialGDP;
  const baseInterestRate = params.averageInterestRate;

  // Population tracking
  let currentPopulation = params.initialPopulation || 330; // Default to ~US population in millions
  const basePopulationGrowthRate = params.basePopulationGrowthRate || 0.007; // Default ~0.7% annual growth

  // Generate a default deficit array if one wasn't fully provided
  const deficits =
    params.annualDeficits.length >= params.simulationYears
      ? params.annualDeficits
      : [
          ...params.annualDeficits,
          ...Array(params.simulationYears - params.annualDeficits.length).fill(
            0.8
          ),
        ]; // Default to 800B deficit

  // Calculate debt progression year by year
  for (let i = 0; i < params.simulationYears; i++) {
    // Default rates for this year
    let yearInflationRate = params.inflationRate;
    let yearGDPGrowthRate = params.baseGDPGrowthRate;
    let yearInterestRate = baseInterestRate;
    let yearPopulationGrowthRate = basePopulationGrowthRate;
    const events: EconomicEvent[] = [];
    let eventDeficitImpact = 0;

    // Process random events if enabled
    if (params.randomEventsEnabled && eventSimulator) {
      // Apply event impacts
      eventSimulator.simulateEvents(i).forEach((event) => {
        yearInflationRate += event.inflationImpact;
        yearGDPGrowthRate += event.gdpGrowthImpact;
        yearInterestRate += event.interestRateImpact;
        eventDeficitImpact += event.deficitImpact;

        // Apply population growth impact if available
        if (event.populationGrowthImpact !== undefined) {
          yearPopulationGrowthRate += event.populationGrowthImpact;
        }

        // Ensure rates don't go below reasonable floors
        yearInflationRate = Math.max(yearInflationRate, -0.02); // Limit deflation
        yearGDPGrowthRate = Math.max(yearGDPGrowthRate, -0.15); // Limit GDP collapse
        yearInterestRate = Math.max(yearInterestRate, 0.005); // Minimum interest rate
        yearPopulationGrowthRate = Math.max(yearPopulationGrowthRate, -0.03); // Limit population decline

        // Record event impact with concise description for multi-year events
        const isOngoing = event.duration > 1 || event.aftereffectsDuration > 0;
        const totalDuration = event.duration + event.aftereffectsDuration;

        // Track when each event starts using event name as key
        const eventKey = `${event.type}-${event.name}`;
        if (!eventStartYears.has(eventKey)) {
          eventStartYears.set(eventKey, i);
        }
        const yearInEvent = i - eventStartYears.get(eventKey)!;

        let description = event.description;
        if (isOngoing) {
          if (yearInEvent === 0) {
            description = `${event.description} (${event.duration} year event`;
            if (totalDuration - event.duration > 0) {
              description += ` with ${
                totalDuration - event.duration
              } year aftermath)`;
            }
          } else if (yearInEvent < event.duration) {
            description = `(Year ${yearInEvent + 1} of ${event.duration})`;
          } else if (yearInEvent <= totalDuration) {
            description = `(Aftermath year ${
              yearInEvent - event.duration + 1
            } of ${event.aftereffectsDuration})`;
          }
        }

        // Record event with description
        events.push({
          ...event,
          description: description,
        });
      });
    }

    // Update population for this year
    currentPopulation = currentPopulation * (1 + yearPopulationGrowthRate);

    // Update GDP for this year (accounting for real growth, inflation, and population)
    // Population growth contributes to GDP growth (but not 1:1)
    const populationContributionToGDP = yearPopulationGrowthRate * 0.5; // Population growth contributes partially to GDP
    const totalGDPGrowth = yearGDPGrowthRate + populationContributionToGDP;
    currentGDP = currentGDP * (1 + totalGDPGrowth) * (1 + yearInflationRate);

    // Calculate interest payment for this year
    const interestPayment = currentNominalDebt * yearInterestRate;

    // Add annual deficit and interest to the debt
    const basePrincipalChange = deficits[i];
    const totalPrincipalChange = basePrincipalChange + eventDeficitImpact;
    currentNominalDebt += totalPrincipalChange + interestPayment;

    // Update inflation factor
    inflationFactor *= 1 + yearInflationRate;

    // Calculate real debt (adjusted for inflation)
    const realDebt = currentNominalDebt / inflationFactor;

    // The amount by which inflation "reduced" the real value of debt this year
    const inflationAdjustment =
      (currentNominalDebt * yearInflationRate) / (1 + yearInflationRate);

    // Calculate debt-to-GDP ratio
    const debtToGDPRatio = (currentNominalDebt / currentGDP) * 100;

    // Calculate debt per capita
    const debtPerCapita =
      (currentNominalDebt * 1e12) / (currentPopulation * 1e6);

    // Store results for this year
    results.push({
      year: currentYear + i,
      nominalDebt: currentNominalDebt,
      realDebt,
      interestPayment,
      principalChange: totalPrincipalChange,
      gdp: currentGDP,
      debtToGDPRatio,
      inflationAdjustment,
      currentInflationRate: yearInflationRate,
      gdpGrowthRate: yearGDPGrowthRate,
      events,
      eventDeficitImpact,
      debtPerCapita,
      population: currentPopulation,
      populationGrowthRate: yearPopulationGrowthRate,
    });
  }

  return results;
}
