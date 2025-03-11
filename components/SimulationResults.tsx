"use client";

import Tooltip from "./Tooltip";
import { tooltips } from "./tooltips";
import type {
  EconomicHealthAssessment,
  YearlyDebtData,
} from "../lib/simulator";
import SimulationGraphs from "./SimulationGraphs";

type SimulationResultsProps = {
  data: {
    assessment: EconomicHealthAssessment;
    results: YearlyDebtData[];
  };
};

export default function SimulationResults({ data }: SimulationResultsProps) {
  console.log(data);
  return (
    <>
      <div className="flex flex-col gap-4 w-full max-w-[2000px] mx-auto">
        <h2 className="text-2xl font-semibold mb-2">Assessment</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    <Tooltip text={tooltips.debtAssessment}>
                      Debt Assessment
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            {
                              Excellent: "bg-green-100 text-green-800",
                              Good: "bg-blue-100 text-blue-800",
                              Fair: "bg-yellow-100 text-yellow-800",
                              Concerning: "bg-orange-100 text-orange-800",
                              Critical: "bg-red-100 text-red-800",
                            }[data.assessment.debtAssessment.rating] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {data.assessment.debtAssessment.rating}
                        </span>
                        <span>
                          {data.assessment.debtAssessment.description}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Debt ratio change:{" "}
                        {data.assessment.debtAssessment.change.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                </tr>

                {/* ... existing assessment rows ... */}
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    <Tooltip text={tooltips.growthAssessment}>
                      Growth Assessment
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            {
                              Excellent: "bg-green-100 text-green-800",
                              Good: "bg-blue-100 text-blue-800",
                              Fair: "bg-yellow-100 text-yellow-800",
                              Concerning: "bg-orange-100 text-orange-800",
                              Critical: "bg-red-100 text-red-800",
                              Weak: "bg-orange-100 text-orange-800",
                              Poor: "bg-red-100 text-red-800",
                            }[
                              data.assessment.growthAssessment.rating as
                                | "Excellent"
                                | "Good"
                                | "Fair"
                                | "Concerning"
                                | "Critical"
                                | "Weak"
                                | "Poor"
                            ]
                          }`}
                        >
                          {data.assessment.growthAssessment.rating}
                        </span>
                        <span>
                          {data.assessment.growthAssessment.description}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Average growth:{" "}
                        {(
                          data.assessment.growthAssessment.avgGrowth * 100
                        ).toFixed(2)}
                        %
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    <Tooltip text={tooltips.stabilityAssessment}>
                      Stability Assessment
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            {
                              Excellent: "bg-green-100 text-green-800",
                              Good: "bg-blue-100 text-blue-800",
                              Fair: "bg-yellow-100 text-yellow-800",
                              Concerning: "bg-orange-100 text-orange-800",
                              Poor: "bg-red-100 text-red-800",
                            }[
                              data.assessment.stabilityAssessment.rating as
                                | "Excellent"
                                | "Good"
                                | "Fair"
                                | "Concerning"
                                | "Poor"
                            ]
                          }`}
                        >
                          {data.assessment.stabilityAssessment.rating}
                        </span>
                        <span>
                          {data.assessment.stabilityAssessment.description}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Recessions:{" "}
                        {data.assessment.stabilityAssessment.recessionYears}{" "}
                        years | Booms:{" "}
                        {data.assessment.stabilityAssessment.boomYears} years |
                        Total: {data.assessment.stabilityAssessment.totalYears}{" "}
                        years
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    <Tooltip text={tooltips.interestBurden}>
                      Interest Burden
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          data.assessment.interestBurden.avgInterestToGDP < 2
                            ? "bg-green-100 text-green-800"
                            : data.assessment.interestBurden.avgInterestToGDP <
                              3
                            ? "bg-blue-100 text-blue-800"
                            : data.assessment.interestBurden.avgInterestToGDP <
                              4
                            ? "bg-yellow-100 text-yellow-800"
                            : data.assessment.interestBurden.avgInterestToGDP <
                              5
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {data.assessment.interestBurden.avgInterestToGDP.toFixed(
                          2
                        )}
                        % of GDP
                      </span>
                      <span>
                        Average interest payments as percentage of GDP
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">
                    <Tooltip text={tooltips.overallAssessment}>
                      Overall Assessment
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            {
                              Excellent: "bg-green-100 text-green-800",
                              Good: "bg-blue-100 text-blue-800",
                              Fair: "bg-yellow-100 text-yellow-800",
                              Concerning: "bg-orange-100 text-orange-800",
                              Critical: "bg-red-100 text-red-800",
                            }[
                              data.assessment.overallAssessment.rating as
                                | "Excellent"
                                | "Good"
                                | "Fair"
                                | "Concerning"
                                | "Critical"
                            ]
                          }`}
                        >
                          {data.assessment.overallAssessment.rating}
                        </span>
                        <span>
                          {data.assessment.overallAssessment.description}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Score: {data.assessment.metrics.score}/20
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto overflow-y-visible border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Tooltip text={tooltips.realDebtChange}>
                  Real Debt Change
                </Tooltip>
              </p>
              <p
                className={`text-lg font-semibold ${
                  data.assessment.metrics.realDebtChangePercent < 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data.assessment.metrics.realDebtChangePercent.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Tooltip text={tooltips.gdpChange}>GDP Change</Tooltip>
              </p>
              <p
                className={`text-lg font-semibold ${
                  data.assessment.metrics.gdpChangePercent > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data.assessment.metrics.gdpChangePercent.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Tooltip text={tooltips.debtRatioChange}>
                  Debt Ratio Change
                </Tooltip>
              </p>
              <p
                className={`text-lg font-semibold ${
                  data.assessment.metrics.debtRatioChange < 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {data.assessment.metrics.debtRatioChange.toFixed(2)}%
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <Tooltip text={tooltips.overallScore}>Overall Score</Tooltip>
              </p>
              <p className="text-lg font-semibold">
                {data.assessment.metrics.score}/20
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-[2000px] mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Simulation Graphs</h2>
        <SimulationGraphs data={data.results} />
      </div>

      <div className="flex flex-col gap-6 w-full max-w-[2000px] mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-2">Yearly Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.results.map((result) => (
            <div
              key={result.year}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-bold border-b pb-2 mb-3">
                Year {result.year}
              </h3>
              {result.events.length > 0 && (
                <div className="mb-3 space-y-2">
                  {result.events.map((event, i) => (
                    <div key={i} className="text-sm">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {event.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 italic mb-1">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            event.deficitImpact > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          Deficit: {event.deficitImpact > 0 ? "+" : ""}
                          {event.deficitImpact.toFixed(2)}T
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            event.gdpGrowthImpact > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          GDP: {event.gdpGrowthImpact > 0 ? "+" : ""}
                          {(event.gdpGrowthImpact * 100).toFixed(2)}%
                        </span>
                        {event.interestRateImpact !== 0 && (
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              event.interestRateImpact < 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            Interest: {event.interestRateImpact > 0 ? "+" : ""}
                            {(event.interestRateImpact * 100).toFixed(2)}%
                          </span>
                        )}
                        {event.inflationImpact !== 0 && (
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                              event.inflationImpact < 0
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            Inflation: {event.inflationImpact > 0 ? "+" : ""}
                            {(event.inflationImpact * 100).toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-gray-700 dark:text-gray-300">
                  <Tooltip text={tooltips.deficitImpact}>
                    Deficit Impact:
                  </Tooltip>
                </p>
                <p className="text-right font-medium">
                  {result.eventDeficitImpact.toFixed(2)}T
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <Tooltip text={tooltips.gdpGrowth}>GDP Growth:</Tooltip>
                </p>
                <p className="text-right font-medium">
                  {(result.gdpGrowthRate * 100).toFixed(2)}%
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <Tooltip text={tooltips.inflationRate}>
                    Inflation Rate:
                  </Tooltip>
                </p>
                <p className="text-right font-medium">
                  {(result.currentInflationRate * 100).toFixed(2)}%
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <Tooltip text={tooltips.interestRate}>Interest Rate:</Tooltip>
                </p>
                <p className="text-right font-medium">
                  {(
                    (result.interestPayment / result.nominalDebt) *
                    100
                  ).toFixed(2)}
                  %
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  <Tooltip text={tooltips.debtToGDP}>Debt-to-GDP:</Tooltip>
                </p>
                <p className="text-right font-medium">
                  {result.debtToGDPRatio.toFixed(2)}%
                </p>
                {result.debtPerCapita && (
                  <>
                    <p className="text-gray-700 dark:text-gray-300">
                      <Tooltip text={tooltips.debtPerCapita}>
                        Debt Per Capita:
                      </Tooltip>
                    </p>
                    <p className="text-right font-medium">
                      ${Math.round(result.debtPerCapita).toLocaleString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
