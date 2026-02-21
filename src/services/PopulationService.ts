import { Territory } from '../models/types';

/**
 * PopulationService – encapsulates population-related calculations.
 * Extracted from GameContext to keep the context clean per INSTRUCTIONS.md.
 *
 * All methods are pure static functions that operate on immutable territory
 * arrays, making them safe to call inside React render and `useMemo` hooks.
 */
export class PopulationService {
  /* ------------------------------------------------------------------ */
  /*  Aggregation helpers                                                */
  /* ------------------------------------------------------------------ */

  /** Calculate total population across all territories.
   *  @returns Summed population (may be fractional during growth ticks). */
  static totalPopulation(territories: Territory[]): number {
    return territories.reduce((sum, t) => sum + t.population, 0);
  }

  /** Calculate total capacity across all territories.
   *  @returns Summed capacity. */
  static totalCapacity(territories: Territory[]): number {
    return territories.reduce((sum, t) => sum + t.capacity, 0);
  }

  /** Capacity usage percentage (0-100), rounded to the nearest integer.
   *  @returns Integer between 0 and 100 inclusive. */
  static capacityPercentage(territories: Territory[]): number {
    const pop = PopulationService.totalPopulation(territories);
    const cap = PopulationService.totalCapacity(territories);
    if (cap === 0) {
      return 0;
    }
    return Math.min(100, Math.round((pop / cap) * 100));
  }

  /** Growth rate as a 0–1 ratio (population / capacity).
   *  Useful for visual indicators and dynamic backgrounds.
   *  @returns Float between 0 and 1, or 0 when capacity is zero. */
  static growthRate(territories: Territory[]): number {
    const cap = PopulationService.totalCapacity(territories);
    if (cap === 0) {
      return 0;
    }
    return Math.min(1, PopulationService.totalPopulation(territories) / cap);
  }

  /** Map of territory ID → percentage share of total population.
   *  @returns Record where values sum to ~100. Empty territories show 0. */
  static populationDistribution(territories: Territory[]): Record<string, number> {
    const total = PopulationService.totalPopulation(territories);
    const dist: Record<string, number> = {};
    for (const t of territories) {
      dist[t.id] = total === 0 ? 0 : Math.round((t.population / total) * 100);
    }
    return dist;
  }

  /* ------------------------------------------------------------------ */
  /*  Mutation helpers (return new objects – never mutate)               */
  /* ------------------------------------------------------------------ */

  /** Clamp a raw population value between 0 and a given capacity.
   *  @returns Clamped number. */
  static clampPopulation(value: number, capacity: number): number {
    return Math.max(0, Math.min(capacity, value));
  }

  /** Return a **new** territory with its population adjusted by `delta`,
   *  automatically clamped to [0, capacity].
   *  @returns A shallow copy of the territory with updated population. */
  static applyPopulationDelta(territory: Territory, delta: number): Territory {
    return {
      ...territory,
      population: PopulationService.clampPopulation(
        territory.population + delta,
        territory.capacity,
      ),
    };
  }

  /* ------------------------------------------------------------------ */
  /*  Immigration helpers                                               */
  /* ------------------------------------------------------------------ */

  /** Calculate manual immigration amount (1% of current pop, clamped 1–1 000 000).
   *  @returns Integer immigrant count. */
  static manualImmigrationAmount(territories: Territory[]): number {
    const currentPop = PopulationService.totalPopulation(territories);
    return Math.max(1, Math.min(1000000, Math.ceil(currentPop * 0.01)));
  }

  /** Find the best territory for new immigrants (first unlocked with spare capacity).
   *  Falls back to the first territory if none qualify.
   *  @returns Territory reference. */
  static bestAvailableTerritory(territories: Territory[]): Territory {
    return territories.find((t) => t.isUnlocked && t.population < t.capacity) || territories[0];
  }

  /* ------------------------------------------------------------------ */
  /*  Display helpers                                                    */
  /* ------------------------------------------------------------------ */

  /** Format a population number with locale-aware thousand separators.
   *  @returns Formatted string, e.g. "1,234,567". */
  static formatPopulation(value: number): string {
    return Math.floor(value).toLocaleString();
  }

  /* ------------------------------------------------------------------ */
  /*  Haptic feedback (mobile)                                          */
  /* ------------------------------------------------------------------ */

  /** Trigger a short haptic vibration on supported devices.
   *  @param duration Vibration duration in ms (default 50). */
  static triggerHaptic(duration: number = 50): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  }

  /** Milestone haptic pattern — two distinct pulses for major achievements. */
  static triggerMilestoneHaptic(): void {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 200]);
    }
  }
}
