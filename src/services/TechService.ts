import { TechId, TechNode, GameState } from '../models/types';

// basic tech catalog, could be extended later
export const techCatalog: Record<TechId, TechNode> = {
  [TechId.advancedAgriculture]: {
    id: TechId.advancedAgriculture,
    name: 'Advanced Agriculture',
    description: 'Boost all population changes by 10%',
    populationMultiplier: 1.1,
  },
  [TechId.efficientTransport]: {
    id: TechId.efficientTransport,
    name: 'Efficient Transport',
    description: 'Migration-related events get a 15% bonus',
    populationMultiplier: 1.15,
  },
  [TechId.universalHealthcare]: {
    id: TechId.universalHealthcare,
    name: 'Universal Healthcare',
    description: 'Disasters have reduced impact (-20%)',
    populationMultiplier: 0.8,
  },
};

export class TechService {
  static getUnlockedTechs(state: GameState): TechNode[] {
    return state.techs.map((id) => techCatalog[id]).filter(Boolean);
  }

  static populationMultiplier(state: GameState): number {
    return this.getUnlockedTechs(state).reduce((m, t) => m * t.populationMultiplier, 1);
  }

  static toggleTech(state: GameState, id: TechId): GameState {
    const has = state.techs.includes(id);
    const techs = has ? state.techs.filter((tid) => tid !== id) : [...state.techs, id];
    return { ...state, techs };
  }
}
