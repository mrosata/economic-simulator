"use client";

import { DebtParameters } from "@/lib/simulator/index";

type SimulationFormProps = {
  parameters: DebtParameters;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetToDefaults: () => void;
};

export default function SimulationForm({
  parameters,
  handleInputChange,
  handleSubmit,
  resetToDefaults,
}: SimulationFormProps) {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-semibold mb-4">Simulation Parameters</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="initialDebt"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Initial Debt (trillion $)
            </label>
            <input
              type="number"
              id="initialDebt"
              name="initialDebt"
              value={parameters.initialDebt}
              onChange={handleInputChange}
              step="0.1"
              min="0"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="simulationYears"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Simulation Years
            </label>
            <input
              type="number"
              id="simulationYears"
              name="simulationYears"
              value={parameters.simulationYears}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="averageInterestRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Average Interest Rate (%)
            </label>
            <input
              type="number"
              id="averageInterestRate"
              name="averageInterestRate"
              value={parameters.averageInterestRate * 100}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "averageInterestRate",
                    value: (parseFloat(e.target.value) / 100).toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              step="0.1"
              min="0"
              max="20"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="inflationRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Inflation Rate (%)
            </label>
            <input
              type="number"
              id="inflationRate"
              name="inflationRate"
              value={parameters.inflationRate * 100}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "inflationRate",
                    value: (parseFloat(e.target.value) / 100).toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              step="0.1"
              min="-5"
              max="20"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="initialGDP"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Initial GDP (trillion $)
            </label>
            <input
              type="number"
              id="initialGDP"
              name="initialGDP"
              value={parameters.initialGDP}
              onChange={handleInputChange}
              step="0.1"
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="baseGDPGrowthRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Base GDP Growth Rate (%)
            </label>
            <input
              type="number"
              id="baseGDPGrowthRate"
              name="baseGDPGrowthRate"
              value={parameters.baseGDPGrowthRate * 100}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "baseGDPGrowthRate",
                    value: (parseFloat(e.target.value) / 100).toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              step="0.1"
              min="-10"
              max="20"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="annualDeficit"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Annual Deficit (trillion $)
            </label>
            <input
              type="number"
              id="annualDeficit"
              name="annualDeficit"
              value={parameters.annualDeficits[0]}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "annualDeficits",
                    value: JSON.stringify(Array(100).fill(value)),
                  },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              step="0.1"
              min="-5"
              max="10"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="initialPopulation"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Initial Population (millions)
            </label>
            <input
              type="number"
              id="initialPopulation"
              name="initialPopulation"
              value={parameters.initialPopulation}
              onChange={handleInputChange}
              step="1"
              min="1"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="basePopulationGrowthRate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Population Growth Rate (%)
            </label>
            <input
              type="number"
              id="basePopulationGrowthRate"
              name="basePopulationGrowthRate"
              value={(parameters.basePopulationGrowthRate ?? 0) * 100}
              onChange={(e) =>
                handleInputChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: "basePopulationGrowthRate",
                    value: (parseFloat(e.target.value) / 100).toString(),
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
              step="0.1"
              min="-5"
              max="5"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2 flex items-center">
            <label htmlFor="randomEventsEnabled" className="flex items-center">
              <input
                type="checkbox"
                id="randomEventsEnabled"
                name="randomEventsEnabled"
                checked={parameters.randomEventsEnabled}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Enable Random Events
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Run Simulation
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            onClick={resetToDefaults}
          >
            Reset to Defaults
          </button>
        </div>
      </form>
    </div>
  );
}
