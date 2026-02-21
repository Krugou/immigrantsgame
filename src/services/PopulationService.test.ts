import { describe, it, expect } from 'vitest';
import { PopulationService } from './PopulationService';
import { Territory, TerritoryType } from '../models/types';

/* ── Test helpers ──────────────────────────────────────────────────── */

const makeTerritory = (overrides: Partial<Territory> = {}): Territory => ({
  id: 'test',
  name: 'Test',
  description: '',
  type: TerritoryType.rural,
  population: 100,
  capacity: 1000,
  isUnlocked: true,
  ...overrides,
});

/* ── Tests ─────────────────────────────────────────────────────────── */

describe('PopulationService', () => {
  /* ── totalPopulation ──────────────────────────────────────────────── */
  describe('totalPopulation', () => {
    it('returns 0 for empty array', () => {
      expect(PopulationService.totalPopulation([])).toBe(0);
    });

    it('sums populations across territories', () => {
      const territories = [
        makeTerritory({ population: 100 }),
        makeTerritory({ id: 'b', population: 250 }),
      ];
      expect(PopulationService.totalPopulation(territories)).toBe(350);
    });
  });

  /* ── totalCapacity ────────────────────────────────────────────────── */
  describe('totalCapacity', () => {
    it('returns 0 for empty array', () => {
      expect(PopulationService.totalCapacity([])).toBe(0);
    });

    it('sums capacities across territories', () => {
      const territories = [
        makeTerritory({ capacity: 500 }),
        makeTerritory({ id: 'b', capacity: 1500 }),
      ];
      expect(PopulationService.totalCapacity(territories)).toBe(2000);
    });
  });

  /* ── capacityPercentage ───────────────────────────────────────────── */
  describe('capacityPercentage', () => {
    it('returns 0 when capacity is 0', () => {
      expect(PopulationService.capacityPercentage([makeTerritory({ capacity: 0 })])).toBe(0);
    });

    it('returns correct percentage', () => {
      const territories = [makeTerritory({ population: 500, capacity: 1000 })];
      expect(PopulationService.capacityPercentage(territories)).toBe(50);
    });

    it('caps at 100', () => {
      const territories = [makeTerritory({ population: 2000, capacity: 1000 })];
      expect(PopulationService.capacityPercentage(territories)).toBe(100);
    });
  });

  /* ── growthRate ────────────────────────────────────────────────────── */
  describe('growthRate', () => {
    it('returns 0 when capacity is 0', () => {
      expect(PopulationService.growthRate([makeTerritory({ capacity: 0 })])).toBe(0);
    });

    it('returns correct 0-1 ratio', () => {
      const territories = [makeTerritory({ population: 300, capacity: 1000 })];
      expect(PopulationService.growthRate(territories)).toBeCloseTo(0.3);
    });

    it('caps at 1', () => {
      const territories = [makeTerritory({ population: 2000, capacity: 1000 })];
      expect(PopulationService.growthRate(territories)).toBe(1);
    });
  });

  /* ── populationDistribution ───────────────────────────────────────── */
  describe('populationDistribution', () => {
    it('returns empty object for empty array', () => {
      expect(PopulationService.populationDistribution([])).toEqual({});
    });

    it('returns percentage share per territory', () => {
      const territories = [
        makeTerritory({ id: 'a', population: 750 }),
        makeTerritory({ id: 'b', population: 250 }),
      ];
      const dist = PopulationService.populationDistribution(territories);
      expect(dist.a).toBe(75);
      expect(dist.b).toBe(25);
    });

    it('handles zero total population', () => {
      const territories = [makeTerritory({ id: 'a', population: 0 })];
      const dist = PopulationService.populationDistribution(territories);
      expect(dist.a).toBe(0);
    });
  });

  /* ── clampPopulation ──────────────────────────────────────────────── */
  describe('clampPopulation', () => {
    it('clamps below zero', () => {
      expect(PopulationService.clampPopulation(-50, 1000)).toBe(0);
    });

    it('clamps above capacity', () => {
      expect(PopulationService.clampPopulation(1500, 1000)).toBe(1000);
    });

    it('leaves valid values unchanged', () => {
      expect(PopulationService.clampPopulation(500, 1000)).toBe(500);
    });
  });

  /* ── applyPopulationDelta ─────────────────────────────────────────── */
  describe('applyPopulationDelta', () => {
    it('returns a new territory object', () => {
      const original = makeTerritory();
      const result = PopulationService.applyPopulationDelta(original, 50);
      expect(result).not.toBe(original);
    });

    it('adds population within bounds', () => {
      const t = makeTerritory({ population: 100, capacity: 1000 });
      const result = PopulationService.applyPopulationDelta(t, 200);
      expect(result.population).toBe(300);
    });

    it('clamps to capacity on overflow', () => {
      const t = makeTerritory({ population: 900, capacity: 1000 });
      const result = PopulationService.applyPopulationDelta(t, 500);
      expect(result.population).toBe(1000);
    });

    it('clamps to 0 on negative overflow', () => {
      const t = makeTerritory({ population: 100, capacity: 1000 });
      const result = PopulationService.applyPopulationDelta(t, -500);
      expect(result.population).toBe(0);
    });
  });

  /* ── manualImmigrationAmount ──────────────────────────────────────── */
  describe('manualImmigrationAmount', () => {
    it('returns at least 1', () => {
      expect(PopulationService.manualImmigrationAmount([makeTerritory({ population: 0 })])).toBe(1);
    });

    it('returns 1% of total population', () => {
      const territories = [makeTerritory({ population: 10000 })];
      expect(PopulationService.manualImmigrationAmount(territories)).toBe(100);
    });

    it('caps at 1,000,000', () => {
      const territories = [makeTerritory({ population: 200_000_000 })];
      expect(PopulationService.manualImmigrationAmount(territories)).toBe(1_000_000);
    });
  });

  /* ── bestAvailableTerritory ───────────────────────────────────────── */
  describe('bestAvailableTerritory', () => {
    it('returns first unlocked territory with spare capacity', () => {
      const territories = [
        makeTerritory({ id: 'full', population: 1000, capacity: 1000 }),
        makeTerritory({ id: 'open', population: 100, capacity: 1000 }),
      ];
      expect(PopulationService.bestAvailableTerritory(territories).id).toBe('open');
    });

    it('falls back to first territory when all full', () => {
      const territories = [
        makeTerritory({ id: 'a', population: 1000, capacity: 1000 }),
        makeTerritory({ id: 'b', population: 1000, capacity: 1000 }),
      ];
      expect(PopulationService.bestAvailableTerritory(territories).id).toBe('a');
    });

    it('skips locked territories', () => {
      const territories = [
        makeTerritory({ id: 'locked', isUnlocked: false, population: 0, capacity: 1000 }),
        makeTerritory({ id: 'unlocked', population: 100, capacity: 1000 }),
      ];
      expect(PopulationService.bestAvailableTerritory(territories).id).toBe('unlocked');
    });
  });

  /* ── formatPopulation ─────────────────────────────────────────────── */
  describe('formatPopulation', () => {
    it('floors and formats a number', () => {
      const result = PopulationService.formatPopulation(1234567.89);
      // locale-dependent, but should contain 1234567
      expect(result).toContain('234');
      expect(result).toContain('567');
    });
  });
});
