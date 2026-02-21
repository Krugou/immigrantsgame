export enum TerritoryType {
  rural = 'rural',
  suburbs = 'suburbs',
  urban = 'urban',
  metropolis = 'metropolis',
  border = 'border',
  coastal = 'coastal',
  caves = 'caves',
  underground = 'underground',
  mountains = 'mountains',
  desert = 'desert',
  arctic = 'arctic',
  moon = 'moon',
  orbital = 'orbital',
  spaceStation = 'spaceStation',
  interstellar = 'interstellar',
}

export enum EventType {
  immigration = 'immigration',
  emigration = 'emigration',
  disaster = 'disaster',
  opportunity = 'opportunity',
  milestone = 'milestone',
}

export enum EventCategory {
  opportunity = 'opportunity',
  disaster = 'disaster',
  milestone = 'milestone',
  neutral = 'neutral',
}

export interface Territory {
  id: string;
  name: string;
  description: string;
  type: TerritoryType;
  population: number;
  capacity: number;
  isUnlocked: boolean;
}

export interface GameEvent {
  id: string;
  title: string | { en: string; fi: string };
  description: string | { en: string; fi: string };
  type: EventType;
  populationChange: number;
  targetTerritoryId?: string | null;
  timestamp: number; // Stored as milliseconds since epoch
  category: EventCategory;
}

export enum PolicyId {
  openBorders = 'openBorders',
  closedBorders = 'closedBorders',
}

export enum TechId {
  advancedAgriculture = 'advancedAgriculture',
  efficientTransport = 'efficientTransport',
  universalHealthcare = 'universalHealthcare',
}

export interface TechNode {
  id: TechId;
  name: string;
  description: string;
  // multiplier applied to population change events (generic example)
  populationMultiplier: number;
}

export interface PolicyCard {
  id: PolicyId;
  name: string;
  description: string;
  // multiplier applied to immigration events (e.g. 1.2 for +20%)
  immigrationMultiplier: number;
}

export interface GameState {
  people: number;
  territories: Territory[];
  eventHistory: GameEvent[];
  achievedMilestones: string[];
  achievedEras: string[];
  totalImmigrants: number;
  playTime: number;
  lastSave: number; // Stored as milliseconds since epoch
  userId?: string | null;
  isOnline: boolean;
  gameSpeed: number;
  policies: PolicyId[]; // active policy cards
  techs: TechId[]; // unlocked technologies
}

export const createInitialTerritory = (): Territory => ({
  id: 'village',
  name: 'Rural Village',
  description: 'A small farming community where it all begins',
  type: TerritoryType.rural,
  population: 1.0,
  capacity: 1200.0,
  isUnlocked: true,
});

export const createInitialGameState = (): GameState => ({
  people: 1.0,
  territories: [createInitialTerritory()],
  eventHistory: [],
  achievedMilestones: [],
  achievedEras: [],
  totalImmigrants: 1,
  playTime: 0.0,
  lastSave: Date.now(),
  isOnline: false,
  gameSpeed: 1.0,
  policies: [],
  techs: [],
});
