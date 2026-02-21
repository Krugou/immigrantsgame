import { PolicyCard, PolicyId, GameState } from '../models/types';

// defined policy cards and their effects on immigration multiplier
export const policyCatalog: Record<PolicyId, PolicyCard> = {
  [PolicyId.openBorders]: {
    id: PolicyId.openBorders,
    name: 'Open Borders',
    description: 'Immigration events are more likely to succeed (+20%).',
    immigrationMultiplier: 1.2,
  },
  [PolicyId.closedBorders]: {
    id: PolicyId.closedBorders,
    name: 'Closed Borders',
    description: 'Immigration events are reduced (-50%).',
    immigrationMultiplier: 0.5,
  },
};

export class PolicyService {
  static getActivePolicies(state: GameState): PolicyCard[] {
    return state.policies.map((id) => policyCatalog[id]).filter(Boolean);
  }

  static immigrationMultiplier(state: GameState): number {
    return this.getActivePolicies(state).reduce((m, p) => m * p.immigrationMultiplier, 1);
  }

  static togglePolicy(state: GameState, id: PolicyId): GameState {
    const has = state.policies.includes(id);
    const policies = has ? state.policies.filter((pid) => pid !== id) : [...state.policies, id];
    return { ...state, policies };
  }
}
