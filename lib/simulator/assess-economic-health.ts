import { YearlyDebtData } from "./calculate-debt-progression";
import { EventType } from "./event-simulator";

type AssessmentRating =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Concerning"
  | "Critical"
  | "Weak"
  | "Poor";
type DebtAssessmentRating =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Concerning"
  | "Critical";
type OverallAssessmentRating =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Concerning"
  | "Critical";
type StabilityAssessmentRating =
  | "Excellent"
  | "Good"
  | "Fair"
  | "Concerning"
  | "Poor";

/**
 * Assessment result categories and overall score
 */
export interface EconomicHealthAssessment {
  debtAssessment: {
    rating: DebtAssessmentRating;
    description: string;
    change: number; // The debt ratio change value
  };
  growthAssessment: {
    rating: AssessmentRating;
    description: string;
    avgGrowth: number; // The average GDP growth rate
  };
  stabilityAssessment: {
    rating: StabilityAssessmentRating;
    description: string;
    recessionYears: number;
    boomYears: number;
    totalYears: number;
  };
  interestBurden: {
    avgInterestToGDP: number;
  };
  metrics: {
    realDebtChangePercent: number;
    gdpChangePercent: number;
    debtRatioChange: number;
    score: number; // Overall score from 0-20
  };
  overallAssessment: {
    rating: OverallAssessmentRating;
    description: string;
  };
  // For backward compatibility
  formattedReport: string;
}

/**
 * Analyzes simulation results and provides economic health assessment
 */
export function assessEconomicHealth(
  results: YearlyDebtData[],
  initialData: { debt: number; gdp: number; debtRatio: number }
): EconomicHealthAssessment {
  const finalYear = results[results.length - 1];

  // Calculate key metrics for assessment
  const realDebtChangePercent =
    (finalYear.realDebt / initialData.debt - 1) * 100;
  const gdpChangePercent = (finalYear.gdp / initialData.gdp - 1) * 100;
  const debtRatioChange = finalYear.debtToGDPRatio - initialData.debtRatio;

  // Count number of recession/depression years
  const recessionYears = results.filter((r) =>
    r.events.some(
      (e) => e.type === EventType.RECESSION || e.type === EventType.DEPRESSION
    )
  ).length;

  // Count number of boom years
  const boomYears = results.filter((r) =>
    r.events.some(
      (e) =>
        e.type === EventType.ECONOMIC_BOOM ||
        e.type === EventType.TECH_REVOLUTION
    )
  ).length;

  // Calculate average GDP growth
  const avgGDPGrowth =
    results.reduce((sum, year) => sum + year.gdpGrowthRate, 0) / results.length;

  // Calculate average interest payments as percentage of GDP
  const avgInterestToGDP =
    (results.reduce((sum, year) => sum + year.interestPayment / year.gdp, 0) /
      results.length) *
    100;

  // Assessment categories
  let debtAssessment, growthAssessment, stabilityAssessment, overallAssessment;
  let debtRating, growthRating, stabilityRating, overallRating;

  // Debt health assessment
  if (debtRatioChange < -10) {
    debtRating = "Excellent";
    debtAssessment =
      "The debt-to-GDP ratio has decreased significantly, indicating a much stronger fiscal position.";
  } else if (debtRatioChange < 0) {
    debtRating = "Good";
    debtAssessment =
      "The debt-to-GDP ratio has decreased, showing improving fiscal sustainability.";
  } else if (debtRatioChange < 10) {
    debtRating = "Fair";
    debtAssessment =
      "The debt-to-GDP ratio has increased modestly, which is manageable but warrants attention.";
  } else if (debtRatioChange < 25) {
    debtRating = "Concerning";
    debtAssessment =
      "The debt-to-GDP ratio has increased substantially, raising fiscal sustainability concerns.";
  } else {
    debtRating = "Critical";
    debtAssessment =
      "The debt-to-GDP ratio has increased dramatically, posing serious risks to fiscal sustainability.";
  }

  // Growth assessment
  if (avgGDPGrowth > 0.03) {
    growthRating = "Excellent";
    growthAssessment = "The economy has experienced strong, sustained growth.";
  } else if (avgGDPGrowth > 0.02) {
    growthRating = "Good";
    growthAssessment = "The economy has grown at a healthy rate.";
  } else if (avgGDPGrowth > 0.01) {
    growthRating = "Fair";
    growthAssessment = "The economy has grown modestly.";
  } else if (avgGDPGrowth > 0) {
    growthRating = "Weak";
    growthAssessment = "The economy has experienced very low growth.";
  } else {
    growthRating = "Poor";
    growthAssessment = "The economy has contracted on average.";
  }

  // Economic stability assessment
  if (recessionYears === 0 && boomYears > 0) {
    stabilityRating = "Excellent";
    stabilityAssessment =
      "The economy avoided recessions while experiencing growth periods.";
  } else if (recessionYears <= results.length * 0.1) {
    stabilityRating = "Good";
    stabilityAssessment =
      "The economy was relatively stable with few downturns.";
  } else if (recessionYears <= results.length * 0.2) {
    stabilityRating = "Fair";
    stabilityAssessment =
      "The economy experienced some instability but maintained overall function.";
  } else if (recessionYears <= results.length * 0.3) {
    stabilityRating = "Concerning";
    stabilityAssessment = "The economy faced frequent instability.";
  } else {
    stabilityRating = "Poor";
    stabilityAssessment =
      "The economy was highly unstable with frequent crises.";
  }

  // Overall economic health assessment
  // Using a simple scoring system
  let score = 0;

  // Debt score (max 5)
  if (debtRatioChange < -15) score += 5;
  else if (debtRatioChange < -5) score += 4;
  else if (debtRatioChange < 5) score += 3;
  else if (debtRatioChange < 15) score += 2;
  else if (debtRatioChange < 30) score += 1;

  // Growth score (max 5)
  if (avgGDPGrowth > 0.035) score += 5;
  else if (avgGDPGrowth > 0.025) score += 4;
  else if (avgGDPGrowth > 0.015) score += 3;
  else if (avgGDPGrowth > 0.005) score += 2;
  else if (avgGDPGrowth > 0) score += 1;

  // Interest burden score (max 5)
  if (avgInterestToGDP < 1) score += 5;
  else if (avgInterestToGDP < 2) score += 4;
  else if (avgInterestToGDP < 3) score += 3;
  else if (avgInterestToGDP < 4) score += 2;
  else if (avgInterestToGDP < 5) score += 1;

  // Stability score (max 5)
  if (recessionYears === 0) score += 5;
  else if (recessionYears <= results.length * 0.1) score += 4;
  else if (recessionYears <= results.length * 0.2) score += 3;
  else if (recessionYears <= results.length * 0.3) score += 2;
  else if (recessionYears <= results.length * 0.4) score += 1;

  // Final assessment based on total score
  if (score >= 16) {
    overallRating = "MUCH BETTER";
    overallAssessment =
      "The economy is in a significantly stronger position than at the start of the simulation.";
  } else if (score >= 12) {
    overallRating = "BETTER";
    overallAssessment =
      "The economy has improved compared to the starting conditions.";
  } else if (score >= 8) {
    overallRating = "STABLE";
    overallAssessment =
      "The economy has maintained roughly similar health to the starting conditions.";
  } else if (score >= 4) {
    overallRating = "WORSE";
    overallAssessment =
      "The economy has deteriorated compared to the starting conditions.";
  } else {
    overallRating = "MUCH WORSE";
    overallAssessment =
      "The economy is in a significantly weaker position than at the start of the simulation.";
  }

  // Create the formatted report for backward compatibility
  const formattedReport = `
ECONOMIC HEALTH ASSESSMENT
==========================

Debt Health: ${debtRating}: ${debtAssessment}
Growth: ${growthRating}: ${growthAssessment}
Stability: ${stabilityRating}: ${stabilityAssessment}

Overall Assessment: ${overallRating}: ${overallAssessment}`;

  // Return structured assessment object
  return {
    debtAssessment: {
      rating: debtRating as DebtAssessmentRating,
      description: debtAssessment,
      change: debtRatioChange,
    },
    growthAssessment: {
      rating: growthRating as AssessmentRating,
      description: growthAssessment,
      avgGrowth: avgGDPGrowth,
    },
    stabilityAssessment: {
      rating: stabilityRating as StabilityAssessmentRating,
      description: stabilityAssessment,
      recessionYears,
      boomYears,
      totalYears: results.length,
    },
    interestBurden: {
      avgInterestToGDP,
    },
    metrics: {
      realDebtChangePercent,
      gdpChangePercent,
      debtRatioChange,
      score,
    },
    overallAssessment: {
      rating: overallRating as OverallAssessmentRating,
      description: overallAssessment,
    },
    formattedReport,
  };
}
