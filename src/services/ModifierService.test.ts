import { describe, it, expect, vi } from 'vitest';
import { ModifierService } from './ModifierService';
import { EventType, TerritoryType, GameEvent, Territory, EventCategory, GameState } from '../models/types';
import { PolicyService } from './PolicyService';
import { TechService } from './TechService';

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

  it('combines territory, tech, and policy multipliers into a fully composable pipeline', () => {
    const evt: GameEvent = {
      id: 'e1',
      title: '',
      description: '',
      type: EventType.immigration,
      populationChange: 10, // base change 10
      timestamp: Date.now(),
      category: EventCategory.opportunity,
    };
    const terr: Territory = {
      id: 's',
      name: '',
      description: '',
      type: TerritoryType.spaceStation, // territory multiplier 1.5
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };
    const state = {} as GameState;

    // stub tech multiplier to 2.0
    vi.spyOn(TechService, 'populationMultiplier').mockReturnValue(2.0);
    // stub policy multiplier to 1.2
    vi.spyOn(PolicyService, 'immigrationMultiplier').mockReturnValue(1.2);

    const modified = ModifierService.applyModifiers(state, evt, terr);

    // 10 (base) * 1.5 (territory) * 2.0 (tech) * 1.2 (policy) = 36
    expect(modified.populationChange).toBeCloseTo(36);

    vi.restoreAllMocks();
  });

  it('does not apply immigration policy to non-immigration events', () => {
    const evt: GameEvent = {
      id: 'e2',
      title: '',
      description: '',
      type: EventType.disaster, // Not immigration
      populationChange: -10,
      timestamp: Date.now(),
      category: EventCategory.disaster,
    };
    const terr: Territory = {
      id: 't',
      name: '',
      description: '',
      type: TerritoryType.rural, // territory multiplier 1.0
      population: 0,
      capacity: 0,
      isUnlocked: true,
    };
    const state = {} as GameState;

    vi.spyOn(TechService, 'populationMultiplier').mockReturnValue(1.0);
    vi.spyOn(PolicyService, 'immigrationMultiplier').mockReturnValue(1.5); // Should be ignored

    const modified = ModifierService.applyModifiers(state, evt, terr);

    // -10 (base) * 1.0 (territory) * 1.0 (tech) = -10
    expect(modified.populationChange).toBeCloseTo(-10);

    vi.restoreAllMocks();
  });
});
