// Types of economic events
export enum EventType {
  WAR_START = "War Begins",
  WAR_ONGOING = "War Continues",
  WAR_END = "War Ends",
  RECESSION = "Economic Recession",
  DEPRESSION = "Economic Depression",
  ECONOMIC_BOOM = "Economic Boom",
  NATURAL_DISASTER = "Natural Disaster",
  PANDEMIC = "Global Pandemic",
  TECH_REVOLUTION = "Technological Revolution",
  ENERGY_CRISIS = "Energy Crisis",
  PEACETIME_DIVIDEND = "Peace Dividend",
  FINANCIAL_CRISIS = "Financial Crisis",
}

export interface EconomicEvent {
  type: EventType;
  name: string;
  description: string;
  deficitImpact: number; // Impact on deficit in trillions
  gdpGrowthImpact: number; // Modification to GDP growth rate
  inflationImpact: number; // Modification to inflation rate
  interestRateImpact: number; // Modification to interest rate
  duration: number; // Event duration in years
  aftereffectsDuration: number; // Duration of aftereffects
  aftereffectsMultiplier: number; // Multiplier for impact during aftereffects (0.5 = half impact)
  populationGrowthImpact?: number; // Modification to population growth rate
}

/**
 * Class to handle random events generation and their impacts
 */
export class EventSimulator {
  private ongoing: Map<
    EventType,
    { event: EconomicEvent; yearsRemaining: number; inAftermathPhase: boolean }
  > = new Map();
  private random: () => number;
  private yearsPassed: number = 0;

  constructor(seed?: number) {
    // Initialize pseudorandom number generator with optional seed
    this.random = seed !== undefined ? this.seededRandom(seed) : Math.random;
  }

  // Simple seeded random number generator for a deterministic simulation returning a psuedo
  // random number between 0 and 1. The seed is incremented each time the random number
  // generator is called to ensures that the same seed will always produce the same sequence.
  private seededRandom(seed: number): () => number {
    return () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
  }

  // Generate possible events for a given year
  public simulateEvents(year: number): EconomicEvent[] {
    this.yearsPassed = year;
    const events: EconomicEvent[] = [];

    // Process ongoing events first
    this.ongoing.forEach((data, type) => {
      if (data.yearsRemaining > 0) {
        data.yearsRemaining--;

        // Check if event transitions to aftermath phase
        if (
          data.yearsRemaining === data.event.aftereffectsDuration &&
          !data.inAftermathPhase
        ) {
          data.inAftermathPhase = true;

          // Create a modified event to represent aftermath
          const aftermathEvent = { ...data.event };
          aftermathEvent.deficitImpact *= data.event.aftereffectsMultiplier;
          aftermathEvent.gdpGrowthImpact *= data.event.aftereffectsMultiplier;
          aftermathEvent.inflationImpact *= data.event.aftereffectsMultiplier;
          aftermathEvent.interestRateImpact *=
            data.event.aftereffectsMultiplier;

          // For war end, create specific aftermath event
          if (type === EventType.WAR_ONGOING) {
            const warEndEvent = this.createWarEndEvent();
            events.push(warEndEvent);

            // Update the ongoing war to war end
            data.event = warEndEvent;
            data.inAftermathPhase = true;
            this.ongoing.set(EventType.WAR_END, data);
            this.ongoing.delete(EventType.WAR_ONGOING);
          } else {
            events.push(aftermathEvent);
          }
        } else {
          // Continue the event
          events.push(data.event);
        }
      } else {
        // Event has ended
        this.ongoing.delete(type);
      }
    });

    // Chance for new events (adjust probabilities as needed)
    if (
      !this.ongoing.has(EventType.WAR_START) &&
      !this.ongoing.has(EventType.WAR_ONGOING) &&
      !this.ongoing.has(EventType.WAR_END) &&
      this.random() < 0.05
    ) {
      // 5% chance of war starting in any peaceful year
      const warEvent = this.createWarEvent();
      events.push(warEvent);
      this.ongoing.set(EventType.WAR_ONGOING, {
        event: warEvent,
        yearsRemaining: warEvent.duration + warEvent.aftereffectsDuration,
        inAftermathPhase: false,
      });
    }

    // Economic events
    if (
      !this.ongoing.has(EventType.RECESSION) &&
      !this.ongoing.has(EventType.DEPRESSION) &&
      this.random() < 0.1
    ) {
      // 10% chance of economic downturn if none ongoing
      if (this.random() < 0.3) {
        // 30% chance it's a depression (once triggered)
        const depressionEvent = this.createDepressionEvent();
        events.push(depressionEvent);
        this.ongoing.set(EventType.DEPRESSION, {
          event: depressionEvent,
          yearsRemaining:
            depressionEvent.duration + depressionEvent.aftereffectsDuration,
          inAftermathPhase: false,
        });
      } else {
        // 70% chance it's a recession
        const recessionEvent = this.createRecessionEvent();
        events.push(recessionEvent);
        this.ongoing.set(EventType.RECESSION, {
          event: recessionEvent,
          yearsRemaining:
            recessionEvent.duration + recessionEvent.aftereffectsDuration,
          inAftermathPhase: false,
        });
      }
    }

    // Economic boom
    if (
      !this.ongoing.has(EventType.ECONOMIC_BOOM) &&
      !this.ongoing.has(EventType.RECESSION) &&
      !this.ongoing.has(EventType.DEPRESSION) &&
      this.random() < 0.08
    ) {
      // 8% chance of economic boom in stable times
      const boomEvent = this.createEconomicBoomEvent();
      events.push(boomEvent);
      this.ongoing.set(EventType.ECONOMIC_BOOM, {
        event: boomEvent,
        yearsRemaining: boomEvent.duration + boomEvent.aftereffectsDuration,
        inAftermathPhase: false,
      });
    }

    // Natural disasters
    if (this.random() < 0.07) {
      // 7% annual chance of significant natural disaster
      events.push(this.createNaturalDisasterEvent());
      // Natural disasters don't persist so no need to track
    }

    // Tech revolutions (rare but impactful)
    if (!this.ongoing.has(EventType.TECH_REVOLUTION) && this.random() < 0.03) {
      // 3% chance of tech revolution
      const techEvent = this.createTechRevolutionEvent();
      events.push(techEvent);
      this.ongoing.set(EventType.TECH_REVOLUTION, {
        event: techEvent,
        yearsRemaining: techEvent.duration + techEvent.aftereffectsDuration,
        inAftermathPhase: false,
      });
    }

    // Peacetime dividend (if no wars and economy stable)
    if (
      !this.ongoing.has(EventType.WAR_START) &&
      !this.ongoing.has(EventType.WAR_ONGOING) &&
      !this.ongoing.has(EventType.RECESSION) &&
      !this.ongoing.has(EventType.DEPRESSION) &&
      !this.ongoing.has(EventType.PEACETIME_DIVIDEND) &&
      this.random() < 0.1
    ) {
      // 10% chance of peace dividend in stable, peaceful times
      const peaceEvent = this.createPeaceDividendEvent();
      events.push(peaceEvent);
      this.ongoing.set(EventType.PEACETIME_DIVIDEND, {
        event: peaceEvent,
        yearsRemaining: peaceEvent.duration + peaceEvent.aftereffectsDuration,
        inAftermathPhase: false,
      });
    }

    return events;
  }

  private createWarEvent(): EconomicEvent {
    // Generate a random name for the war
    const warNames = [
      "The AI Sovereignty War",
      "The Second Cyber Cold War",
      "The Water Wars",
      "The Quantum Conflict",
      "The Space Resource War",
      "The Arctic Territorial War",
      "Indo-Pacific Flashpoint War",
      "Great Blackout War",
      "Second South China Sea War",
      "Data War",
      "Green Energy Wars",
      "Global Food Crisis War",
      "Second Korean Conflict",
      "Digital Iron Curtain War",
      "AI Proxy Wars",
      "Eastern European Insurgency",
      "Middle East Water Conflict",
      "North Atlantic Defense War",
      "U.S.-China Economic War",
      "Synthetic Biology War",
      "Lithium Wars",
      "Space Colony Conflict",
      "Rare Earth Metals War",
      "Automated Warfare Crisis",
      "Climate Refugee War",
      "Orbital Skirmishes",
      "Pacific Cyber War",
      "Neo-Cold War",
      "Red Sea Trade War",
      "Second Taiwan Strait Crisis",
      "Quantum Network War",
      "African Resource Wars",
      "Global Resistance Conflict",
      "Second American Civil War",
      "South American Drug Wars 2.0",
      "Meridian Conflict",
      "Azure Coalition War",
      "Resource War",
      "Technological Sovereignty War",
      "Cyber Defense War",
      "Regional Security Crisis",
      "Global Alliance Conflict",
      "War of the Worlds",
      "World War X",
      "Great War",
      "Shit War",
      "Star Wars",
    ];
    const warName = warNames[Math.floor(this.random() * warNames.length)];

    // Scale of war affects its impact
    const scale = 0.5 + this.random(); // Between 0.5 and 1.5

    return {
      type: EventType.WAR_START,
      name: warName,
      description: `The ${warName} has begun, requiring significant military expenditures.`,
      deficitImpact: 0.5 * scale, // Additional 0.5T deficit
      gdpGrowthImpact: 0.005 * scale, // War can stimulate GDP in short term
      inflationImpact: 0.01 * scale, // Increased inflation
      interestRateImpact: 0.002 * scale, // Slight increase in borrowing costs
      duration: Math.floor(2 + this.random() * 5), // 2-6 years
      aftereffectsDuration: Math.floor(3 + this.random() * 4), // 3-6 years of aftereffects
      aftereffectsMultiplier: 0.4, // Reduced impact during aftermath
      populationGrowthImpact: -0.002 * scale, // Wars can reduce population growth
    };
  }

  private createWarEndEvent(): EconomicEvent {
    const ongoingWar = this.ongoing.get(EventType.WAR_ONGOING);
    const warName = ongoingWar ? ongoingWar.event.name : "Conflict";

    return {
      type: EventType.WAR_END,
      name: `${warName} Aftermath`,
      description: `The ${warName} has ended, but reconstruction costs continue.`,
      deficitImpact: 0.3, // Reduced but still significant costs
      gdpGrowthImpact: 0.01, // Post-war economic recovery
      inflationImpact: 0.005, // Moderate inflation impact
      interestRateImpact: -0.001, // Slightly lower rates as risk decreases
      duration: 0, // No duration as this is handled by the aftermath system
      aftereffectsDuration: 0, // No additional aftermath (already in aftermath)
      aftereffectsMultiplier: 1, // No additional multiplier
    };
  }

  private createPandemicEvent(): EconomicEvent {
    return {
      type: EventType.PANDEMIC,
      name: "Global Pandemic",
      description:
        "A global pandemic has emerged, requiring massive healthcare spending and economic support.",
      deficitImpact: 1.0, // Major deficit impact
      gdpGrowthImpact: -0.05, // Severe negative growth
      inflationImpact: 0.01, // Mixed inflation effects
      interestRateImpact: -0.005, // Lower rates to support economy
      duration: Math.floor(1 + this.random() * 2), // 1-2 years
      aftereffectsDuration: Math.floor(2 + this.random() * 3), // 2-4 years recovery
      aftereffectsMultiplier: 0.5, // Gradual recovery
      populationGrowthImpact: -0.005, // Reduced population growth
    };
  }

  private createRecessionEvent(): EconomicEvent {
    const recessionNames = [
      "Credit Crunch",
      "Market Correction",
      "Economic Contraction",
      "GDP Slowdown",
      "Investment Decline",
      "Consumer Confidence Crisis",
    ];
    const recessionName =
      recessionNames[Math.floor(this.random() * recessionNames.length)];

    const severity = 0.6 + this.random() * 0.8; // Between 0.6 and 1.4

    return {
      type: EventType.RECESSION,
      name: recessionName,
      description: `A recession has hit the economy, reducing tax revenues and requiring stimulus spending.`,
      deficitImpact: 0.4 * severity, // Increased deficit from stimulus and lower tax revenue
      gdpGrowthImpact: -0.025 * severity, // Negative growth
      inflationImpact: -0.01 * severity, // Usually lower inflation during recession
      interestRateImpact: -0.005 * severity, // Lower interest rates to stimulate economy
      duration: Math.floor(1 + this.random() * 3), // 1-3 years
      aftereffectsDuration: Math.floor(2 + this.random() * 3), // 2-4 years recovery
      aftereffectsMultiplier: 0.3, // Reduced impact during recovery
    };
  }

  private createDepressionEvent(): EconomicEvent {
    return {
      type: EventType.DEPRESSION,
      name: "Economic Depression",
      description: `A severe economic depression has begun, dramatically increasing government spending on safety nets and stimulus.`,
      deficitImpact: 1.2, // Major deficit impact
      gdpGrowthImpact: -0.06, // Severe negative growth
      inflationImpact: -0.015, // Deflationary pressure
      interestRateImpact: -0.01, // Much lower rates
      duration: Math.floor(3 + this.random() * 4), // 3-6 years
      aftereffectsDuration: Math.floor(5 + this.random() * 6), // 5-10 years recovery
      aftereffectsMultiplier: 0.4, // Gradual recovery
    };
  }

  private createEconomicBoomEvent(): EconomicEvent {
    const boomNames = [
      "Economic Renaissance",
      "Prosperity Surge",
      "Market Expansion",
      "Growth Acceleration",
      "Investment Boom",
      "Productivity Revolution",
      "Technological Revolution",
      "Energy Revolution",
      "Space Exploration",
      "Healthcare Revolution",
      "Education Revolution",
      "Government Efficiency Period",
      "Financial Boom",
      "Globalization Renaissance",
    ];
    const boomName = boomNames[Math.floor(this.random() * boomNames.length)];

    return {
      type: EventType.ECONOMIC_BOOM,
      name: boomName,
      description: `A period of exceptional economic growth has begun, increasing tax revenues and reducing benefit payments.`,
      deficitImpact: -0.3, // Deficit reduction (or surplus increase)
      gdpGrowthImpact: 0.02, // Strong positive growth
      inflationImpact: 0.005, // Slightly higher inflation from growth
      interestRateImpact: 0.002, // Slightly higher interest rates
      duration: Math.floor(2 + this.random() * 3), // 2-4 years
      aftereffectsDuration: Math.floor(1 + this.random() * 2), // 1-2 years aftereffects
      aftereffectsMultiplier: 0.2, // Strongly reduced aftermath
    };
  }

  private createNaturalDisasterEvent(): EconomicEvent {
    const disasterTypes = [
      "Hurricane",
      "Earthquake",
      "Flood",
      "Wildfire",
      "Drought",
      "Tsunami",
      "Volcanic Eruption",
      "Hurricane",
      "Earthquake",
      "Flood",
      "Wildfire",
      "Drought",
    ];
    const disasterType =
      disasterTypes[Math.floor(this.random() * disasterTypes.length)];

    // Severity affects impact
    const severity = 0.5 + this.random() * 1.0; // Between 0.5 and 1.5

    return {
      type: EventType.NATURAL_DISASTER,
      name: `Major ${disasterType}`,
      description: `A major ${disasterType.toLowerCase()} has caused significant damage requiring federal disaster relief.`,
      deficitImpact: 0.2 * severity, // Additional spending for disaster relief
      gdpGrowthImpact: -0.007 * severity, // Small negative impact
      inflationImpact: 0.003 * severity, // Small inflation impact
      interestRateImpact: 0, // Usually no significant impact on interest rates
      duration: 1, // One-year event
      aftereffectsDuration: Math.floor(1 + this.random() * 2), // 1-2 years recovery
      aftereffectsMultiplier: 0.3, // Diminishing recovery costs
    };
  }

  private createTechRevolutionEvent(): EconomicEvent {
    const techTypes = [
      "Quantum Computing",
      "Renewable Energy",
      "Biotechnology",
      "Space Industry",
      "Manufacturing Automation",
      "Robotics",
      "3D Printing",
      "Nanotechnology",
      "Genetic Engineering",
      "Augmented Reality",
      "Artificial Intelligence",
    ];
    const techType = techTypes[Math.floor(this.random() * techTypes.length)];

    return {
      type: EventType.TECH_REVOLUTION,
      name: `${techType} Revolution`,
      description: `A technological revolution in ${techType} is transforming the economy, boosting productivity and growth.`,
      deficitImpact: -0.15, // Slight deficit reduction from higher tax revenues
      gdpGrowthImpact: 0.015, // Significant growth boost
      inflationImpact: -0.002, // Slight deflationary pressure from productivity gains
      interestRateImpact: 0.001, // Slight increase due to growth
      duration: Math.floor(3 + this.random() * 5), // 3-7 years
      aftereffectsDuration: Math.floor(5 + this.random() * 8), // 5-12 years of ongoing benefits
      aftereffectsMultiplier: 0.6, // Sustained positive impact
    };
  }

  private createPeaceDividendEvent(): EconomicEvent {
    return {
      type: EventType.PEACETIME_DIVIDEND,
      name: "Peace Dividend",
      description: `A sustained period of peace has allowed reduction in military spending.`,
      deficitImpact: -0.2, // Reduced deficit from lower military spending
      gdpGrowthImpact: 0.005, // Slight positive impact on growth
      inflationImpact: -0.001, // Minimal impact
      interestRateImpact: -0.001, // Slightly lower borrowing costs from increased stability
      duration: Math.floor(3 + this.random() * 4), // 3-6 years
      aftereffectsDuration: Math.floor(2 + this.random() * 3), // 2-4 years aftereffects
      aftereffectsMultiplier: 0.5, // Moderate ongoing benefits
    };
  }
}
