import { describe, it, expect } from 'vitest';
import { TechService, techCatalog } from './TechService';
import { TechId, GameState } from '../models/types';

describe('TechService', () => {
  it('returns unlocked techs from state', () => {
    const state: Partial<GameState> = { techs: [TechId.advancedAgriculture] };
    expect(TechService.getUnlockedTechs(state as GameState)).toEqual([
      techCatalog[TechId.advancedAgriculture],
    ]);
  });

  it('calculates population multiplier correctly', () => {
    const state: Partial<GameState> = {
      techs: [TechId.advancedAgriculture, TechId.efficientTransport],
    };
    const multiplier =
      techCatalog[TechId.advancedAgriculture].populationMultiplier *
      techCatalog[TechId.efficientTransport].populationMultiplier;
    expect(TechService.populationMultiplier(state as GameState)).toBeCloseTo(multiplier);
  });

  it('toggles tech entries', () => {
    const base: Partial<GameState> = { techs: [] };
    const added = TechService.toggleTech(base as GameState, TechId.universalHealthcare);
    expect(added.techs).toContain(TechId.universalHealthcare);
    const removed = TechService.toggleTech(added as GameState, TechId.universalHealthcare);
    expect(removed.techs).not.toContain(TechId.universalHealthcare);
  });
});
