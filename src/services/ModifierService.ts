import { GameEvent, Territory, TerritoryType } from '../models/types';

export class ModifierService {
  /**
   * Apply a chain of multipliers to an event's population change.
   * The order of operations is intentional: base -> territory -> policy -> tech
   */
  static applyModifiers(event: GameEvent, territory?: Territory): GameEvent {
    let change = event.populationChange;

    // territory-specific multiplier (e.g. space stations get bonus)
    change *= ModifierService.territoryMultiplier(territory);

    // policy multipliers are applied higher in the pipeline (see GameContext.processEvent)
    // this service only handles territory/tech/etc.

    // Tech bonuses or other global modifiers are applied higher in GameContext
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
