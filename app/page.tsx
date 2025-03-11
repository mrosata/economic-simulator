"use client";

import { useState, useMemo, useEffect } from "react";
import { DebtParameters, EconomicSimulator } from "@/lib/simulator/index";
import SimulationForm from "@/components/SimulationForm";
import SimulationResults from "@/components/SimulationResults";

export default function Home() {
  const defaultParameters: DebtParameters = {
    initialDebt: 20,
    simulationYears: 15,
    averageInterestRate: 0.03,
    inflationRate: 0.02,
    annualDeficits: Array(100).fill(0.5),
    initialGDP: 100,
    baseGDPGrowthRate: 0.02,
    randomEventsEnabled: true,
    initialPopulation: 330,
    basePopulationGrowthRate: 0.007,
  };

  const [parameters, setParameters] =
    useState<DebtParameters>(defaultParameters);
  const [runSimulation, setRunSimulation] = useState(false);
  const [simulationKey, setSimulationKey] = useState(0);

  useEffect(() => {
    setRunSimulation(true);
  }, []);

  const data = useMemo(() => {
    if (!runSimulation || !simulationKey) return null;

    const simulator = new EconomicSimulator(parameters).simulate();
    const assessment = simulator.getAssessment();
    const results = simulator.getResults();
    return { assessment, results };
  }, [parameters, runSimulation, simulationKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setParameters((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRunSimulation(true);
    setSimulationKey((prev) => prev + 1);
  };

  const resetToDefaults = () => {
    setParameters(defaultParameters);
    setRunSimulation(true);
    setSimulationKey((prev) => prev + 1);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-6xl">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        /> */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">U.S. Debt Simulator</h1>
          <p className="text-gray-600">
            Simulating the growth of U.S. national debt over time
          </p>
        </div>

        <SimulationForm
          parameters={parameters}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          resetToDefaults={resetToDefaults}
        />

        {data && <SimulationResults data={data} />}
      </main>
    </div>
  );
}
