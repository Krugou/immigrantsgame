import { describe, it, expect, vi } from 'vitest';
import { ModifierService } from './ModifierService';
import { EventType, TerritoryType, GameEvent, Territory, EventCategory } from '../models/types';
import { PolicyService } from './PolicyService';

describe('ModifierService', () => {
  it('returns correct territory multiplier', () => {
    expect(ModifierService.territoryMultiplier(undefined)).toBe(1);
    expect(ModifierService.territoryMultiplier({} as Territory)).toBe(1);
    expect(ModifierService.territoryMultiplier({} as Territory & { type: TerritoryType })).toBe(1);
    const spaceTerr: Territory = {
      id: '',
      name: '',
      description: '',
      type: TerritoryType.spaceStation,
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };
    expect(ModifierService.territoryMultiplier(spaceTerr)).toBe(1.5);
    const desertTerr: Territory = {
      id: '',
      name: '',
      description: '',
      type: TerritoryType.desert,
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };
    expect(ModifierService.territoryMultiplier(desertTerr)).toBe(0.8);
  });

  it('does not touch populationChange for policies (handled externally)', () => {
    const evt: GameEvent = {
      id: 'e1',
      title: '',
      description: '',
      type: EventType.immigration,
      populationChange: 10,
      timestamp: Date.now(),
      category: EventCategory.opportunity,
    };
    const terr: Territory = {
      id: 't',
      name: '',
      description: '',
      type: TerritoryType.suburbs,
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };

    // even if policy service is invoked elsewhere, the modifier service itself should not mutate
    const modified = ModifierService.applyModifiers(evt, terr);
    expect(modified.populationChange).toBe(10);
  });

  it('combined with policy yields full pipeline', () => {
    const evt: GameEvent = {
      id: 'e2',
      title: '',
      description: '',
      type: EventType.immigration,
      populationChange: 10,
      timestamp: Date.now(),
      category: EventCategory.opportunity,
    };
    const terr: Territory = {
      id: 's',
      name: '',
      description: '',
      type: TerritoryType.spaceStation,
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };

    // stub policy multiplier
    vi.spyOn(PolicyService, 'immigrationMultiplier').mockReturnValue(1.2);

    const afterTerr = ModifierService.applyModifiers(evt, terr);
    // apply policy manually
    const afterPolicy = {
      ...afterTerr,
      populationChange:
        afterTerr.populationChange *
        PolicyService.immigrationMultiplier({
          policies: [],
        } as unknown as import('../models/types').GameState),
    };
    expect(afterPolicy.populationChange).toBeCloseTo(10 * 1.5 * 1.2);

    vi.restoreAllMocks();
  });
});
