/**
 * Centralized Era configuration.
 * Each Era is triggered when a specific territory is first unlocked.
 * The game progression arc is: Caves → Surface → Seas → Mountains → Moon → Orbit → Stars.
 */

export interface EraConfig {
  id: string;
  name: string;
  quote: string;
  image: string;
  triggerTerritoryId: string;
}

export const eraConfigs: EraConfig[] = [
  {
    id: 'suburban_sprawl',
    name: 'Suburban Sprawl',
    quote: 'From caves to cul-de-sacs — the first neighborhoods take root under an open sky.',
    image: '/cover.png',
    triggerTerritoryId: 'suburbs',
  },
  {
    id: 'urban_rise',
    name: 'The Urban Rise',
    quote: 'Steel and glass pierce the clouds. The age of cities has begun.',
    image: '/cover.png',
    triggerTerritoryId: 'urban_center',
  },
  {
    id: 'great_metropolis',
    name: 'The Great Metropolis',
    quote: 'Millions breathe in unison. A single heartbeat echoes across the skyline.',
    image: '/cover.png',
    triggerTerritoryId: 'metropolis',
  },
  {
    id: 'cave_exit',
    name: 'Beyond the Depths',
    quote: 'We spent an eternity in the dark. Today, the stars are no longer a myth.',
    image: '/firstphase.png',
    triggerTerritoryId: 'underground_city',
  },
  {
    id: 'across_the_seas',
    name: 'Across the Seas',
    quote: 'The horizon is not an edge — it is an invitation.',
    image: '/cover.png',
    triggerTerritoryId: 'coastal_port',
  },
  {
    id: 'mountain_frontier',
    name: 'The Mountain Frontier',
    quote: 'Where the air thins, our resolve only grows stronger.',
    image: '/cover.png',
    triggerTerritoryId: 'mountain_settlement',
  },
  {
    id: 'lunar_footprint',
    name: 'Lunar Footprint',
    quote: 'One small step for an immigrant, one giant leap for civilization.',
    image: '/lastphase.png',
    triggerTerritoryId: 'moon_colony',
  },
  {
    id: 'orbit_achieved',
    name: 'Orbit Achieved',
    quote: 'Gravity is just a suggestion we have learned to politely decline.',
    image: '/lastphase.png',
    triggerTerritoryId: 'orbital_platform',
  },
  {
    id: 'interstellar',
    name: 'The Eternal Shore',
    quote: 'Earth was a cradle, but one cannot live in a cradle forever.',
    image: '/lastphase.png',
    triggerTerritoryId: 'interstellar_ark',
  },
];

/**
 * Find an Era that should be triggered based on current territories and achieved Eras.
 */
export const detectNewEra = (territoryIds: string[], achievedEras: string[]): EraConfig | null => {
  for (const era of eraConfigs) {
    if (territoryIds.includes(era.triggerTerritoryId) && !achievedEras.includes(era.id)) {
      return era;
    }
  }
  return null;
};
