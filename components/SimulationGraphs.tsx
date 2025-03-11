"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlyDebtData } from "../lib/simulator";

type SimulationGraphsProps = {
  data: YearlyDebtData[];
};

export default function SimulationGraphs({ data }: SimulationGraphsProps) {
  // Transform data for the charts
  const chartData = data.map((yearData) => ({
    year: yearData.year,
    gdp: yearData.gdp,
    debt: yearData.nominalDebt,
    debtToGDP: yearData.debtToGDPRatio,
    interestRate: (yearData.interestPayment / yearData.nominalDebt) * 100,
    inflationRate: yearData.currentInflationRate * 100,
    gdpGrowth: yearData.gdpGrowthRate * 100,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 w-full">
      <div className="w-full h-[400px] lg:h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">GDP and Debt Over Time</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{ right: 30, left: 10, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} tickMargin={8} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              tickFormatter={(value) => `${value}T`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}T`, undefined]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="gdp"
              name="GDP"
              stroke="#4ade80"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="debt"
              name="Debt"
              stroke="#f87171"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full h-[400px] lg:h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Economic Indicators</h3>
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            data={chartData}
            margin={{ right: 30, left: 10, top: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} tickMargin={8} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`, undefined]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="debtToGDP"
              name="Debt to GDP Ratio"
              stroke="#a78bfa"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="interestRate"
              name="Interest Rate"
              stroke="#fbbf24"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="inflationRate"
              name="Inflation Rate"
              stroke="#60a5fa"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="gdpGrowth"
              name="GDP Growth"
              stroke="#34d399"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
