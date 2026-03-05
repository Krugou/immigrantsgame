import { GameEvent, GameState, Territory, TerritoryType, EventType } from '../models/types';
import { TechService } from './TechService';
import { PolicyService } from './PolicyService';

export class ModifierService {
  /**
   * Apply a fully composable chain of multipliers to an event's population change.
   * Base Change × Territory Multiplier × Tech Bonus × Policy Multiplier
   */
  static applyModifiers(state: GameState, event: GameEvent, territory?: Territory): GameEvent {
    let change = event.populationChange;

    // 1. Territory multiplier
    change *= ModifierService.territoryMultiplier(territory);

    // 2. Tech multiplier
    change *= TechService.populationMultiplier(state);

    // 3. Policy multiplier (e.g., immigration)
    if (event.type === EventType.immigration) {
      change *= PolicyService.immigrationMultiplier(state);
    }

    return { ...event, populationChange: change };
  }

  static territoryMultiplier(territory?: Territory): number {
    if (!territory) {
      return 1;
    }
    // simple example: space station type yields 1.5x
    if (territory.type === TerritoryType.spaceStation) {
      return 1.5;
    }
    // example: desert outposts are harsh so events are weaker
    if (territory.type === TerritoryType.desert) {
      return 0.8;
    }
    return 1;
  }
}
