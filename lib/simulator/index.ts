import {
  DebtParameters,
  YearlyDebtData,
  calculateDebtProgression,
} from "./calculate-debt-progression";
import type { EconomicHealthAssessment } from "./assess-economic-health";
import { assessEconomicHealth } from "./assess-economic-health";
export type {
  DebtParameters,
  YearlyDebtData,
} from "./calculate-debt-progression";
export type { EconomicHealthAssessment } from "./assess-economic-health";

/**
 * # U.S. Debt Calculator with Random Economic Events
 *
 * This program simulates the growth of U.S. national debt over time,
 * accounting for:
 * - Annual budget deficits/surpluses (affecting principal)
 * - Interest payments on existing debt
 * - Inflation effects on real debt value
 * - Random economic events (wars, recessions, economic booms, etc.)
 * - Economic health assessment
 *
 * # Example usage:
 * const debtParameters: DebtParameters = {
 *   initialDebt: 20,
 *   simulationYears: 100,
 *   averageInterestRate: 0.03,
 *   inflationRate: 0.02,
 *   annualDeficits: Array(100).fill(0.5),
 *   initialGDP: 20,
 *   baseGDPGrowthRate: 0.02,
 *   randomEventsEnabled: true,
 *   randomSeed: 12345,
 * };
 * const simulator = new EconomicSimulator(debtParameters);
 * const results = simulator.simulate();
 * console.log(results);
 */
export class EconomicSimulator {
  public results?: YearlyDebtData[];
  public assessment?: EconomicHealthAssessment;

  constructor(private debtParameters: DebtParameters) {}

  public simulate() {
    this.results = calculateDebtProgression(this.debtParameters);
    this.assessment = assessEconomicHealth(this.results, {
      debt: this.debtParameters.initialDebt,
      gdp: this.debtParameters.initialGDP,
      debtRatio:
        this.debtParameters.initialDebt / this.debtParameters.initialGDP,
    });
    return this;
  }

  public getAssessment(): EconomicHealthAssessment {
    if (!this.assessment) {
      throw new Error("Assessment not yet generated");
    }
    return this.assessment;
  }

  public getResults(): YearlyDebtData[] {
    if (!this.results) {
      throw new Error("Results not yet generated");
    }
    return this.results;
  }
}
