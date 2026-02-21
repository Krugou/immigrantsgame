import { TerritoryType } from './types';

export interface TerritoryConfig {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: TerritoryType;
  threshold: number;
  capacityMultiplier: number;
  capacityBaseMultiplier: number;
}

const _thousand: number = 1000.0;
const _million: number = 1000000.0;
const _billion: number = 1000000000.0;
const _trillion: number = 1000000000000.0;

export const territoryConfigs: TerritoryConfig[] = [
  {
    id: 'suburbs',
    nameKey: 'territory.suburbs.name',
    descriptionKey: 'territory.suburbs.description',
    type: TerritoryType.suburbs,
    threshold: 500,
    capacityMultiplier: 25,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'urban_center',
    nameKey: 'territory.urban_center.name',
    descriptionKey: 'territory.urban_center.description',
    type: TerritoryType.urban,
    threshold: 5 * _thousand,
    capacityMultiplier: 40,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'metropolis',
    nameKey: 'territory.metropolis.name',
    descriptionKey: 'territory.metropolis.description',
    type: TerritoryType.metropolis,
    threshold: 100 * _thousand,
    capacityMultiplier: 20,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'border_town',
    nameKey: 'territory.border_town.name',
    descriptionKey: 'territory.border_town.description',
    type: TerritoryType.border,
    threshold: _million,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'coastal_port',
    nameKey: 'territory.coastal_port.name',
    descriptionKey: 'territory.coastal_port.description',
    type: TerritoryType.coastal,
    threshold: 5 * _million,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'cave_network',
    nameKey: 'territory.cave_network.name',
    descriptionKey: 'territory.cave_network.description',
    type: TerritoryType.caves,
    threshold: 25 * _million,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'underground_city',
    nameKey: 'territory.underground_city.name',
    descriptionKey: 'territory.underground_city.description',
    type: TerritoryType.underground,
    threshold: 100 * _million,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'mountain_settlement',
    nameKey: 'territory.mountain_settlement.name',
    descriptionKey: 'territory.mountain_settlement.description',
    type: TerritoryType.mountains,
    threshold: 500 * _million,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'desert_outpost',
    nameKey: 'territory.desert_outpost.name',
    descriptionKey: 'territory.desert_outpost.description',
    type: TerritoryType.desert,
    threshold: 2.5 * _billion,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'arctic_base',
    nameKey: 'territory.arctic_base.name',
    descriptionKey: 'territory.arctic_base.description',
    type: TerritoryType.arctic,
    threshold: 10 * _billion,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'moon_colony',
    nameKey: 'territory.moon_colony.name',
    descriptionKey: 'territory.moon_colony.description',
    type: TerritoryType.moon,
    threshold: 50 * _billion,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'orbital_platform',
    nameKey: 'territory.orbital_platform.name',
    descriptionKey: 'territory.orbital_platform.description',
    type: TerritoryType.orbital,
    threshold: 250 * _billion,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'space_station_alpha',
    nameKey: 'territory.space_station_alpha.name',
    descriptionKey: 'territory.space_station_alpha.description',
    type: TerritoryType.spaceStation,
    threshold: _trillion,
    capacityMultiplier: 10,
    capacityBaseMultiplier: 1,
  },
  {
    id: 'interstellar_ark',
    nameKey: 'territory.interstellar_ark.name',
    descriptionKey: 'territory.interstellar_ark.description',
    type: TerritoryType.interstellar,
    threshold: 10 * _trillion,
    capacityMultiplier: 100,
    capacityBaseMultiplier: 1,
  },
];

export const getCapacity = (config: TerritoryConfig): number =>
  config.threshold * config.capacityMultiplier * config.capacityBaseMultiplier;

export const getAvailableConfigs = (totalPopulation: number): TerritoryConfig[] =>
  territoryConfigs.filter((config) => totalPopulation >= config.threshold);

export const getNextUnlockConfig = (totalPopulation: number): TerritoryConfig | null => {
  const nextTarget = territoryConfigs.find((config) => totalPopulation < config.threshold);
  return nextTarget || null;
};

export const getConfigById = (id: string): TerritoryConfig | null =>
  territoryConfigs.find((config) => config.id === id) || null;

export const getConfigByType = (type: TerritoryType): TerritoryConfig | null =>
  territoryConfigs.find((config) => config.type === type) || null;
