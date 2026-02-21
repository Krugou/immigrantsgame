/* eslint-disable no-console */
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  GameState,
  createInitialGameState,
  GameEvent,
  Territory,
  EventType,
  EventCategory,
  PolicyId,
  TechId,
} from '../models/types';
import { getAvailableConfigs } from '../models/territoryConfig';
import {
  generateEventForTerritory,
  checkMilestoneEvent,
  updateEventPool,
  EventTemplate,
} from '../services/eventSystem';
import { detectNewEra } from '../models/eraConfig';
import { PopulationService } from '../services/PopulationService';
import { PolicyService } from '../services/PolicyService';
import { ModifierService } from '../services/ModifierService';
import { TechService } from '../services/TechService';
import StorageModal from '../components/StorageModal';

export interface SystemConfig {
  territoryTypes: string[];
  eventTypes: string[];
  categories: string[];
}

interface GameContextType {
  gameState: GameState;
  manualImmigration: () => void;
  togglePolicy: (id: PolicyId) => void;
  toggleTech: (id: TechId) => void;
  resetGame: () => void;
  openStorageSettings: () => void;
  activeEra: { name: string; quote: string; image: string } | null;
  completeEra: () => void;
  latestEvent: GameEvent | null;
  tickCount: number;
  simulateTicks: (count: number) => void; // developer helper for fast-forward testing
  sysConfig: SystemConfig;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// storage key used for local saves; name expanded for clarity
// if we add cloud saving the same identifier would be handled by the server
const STORAGE_KEY = 'immigrants_game_save';

// track whether player chose local or cloud persistence; `null` means prompt not answered yet

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine where to store game: cloud vs local.  a real cloud
  // option would involve an auth/login flow and API calls; here we
  // simply ask once via confirm and use a flag for the rest of the
  // session.  null indicates the user hasn't chosen yet.
  const [useCloud, setUseCloud] = useState<boolean | null>(() => {
    if (typeof window !== 'undefined') {
      const choice = localStorage.getItem('useCloudChoice');
      if (choice === 'true') {
        return true;
      }
      if (choice === 'false') {
        return false;
      }
    }
    return null;
  });
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [activeEra, setActiveEra] = useState<{ name: string; quote: string; image: string } | null>(
    null,
  );
  const [latestEvent, setLatestEvent] = useState<GameEvent | null>(null);
  const [tickCount, setTickCount] = useState(0);
  const [sysConfig, setSysConfig] = useState<SystemConfig>({
    territoryTypes: [
      'rural',
      'suburbs',
      'urban',
      'metropolis',
      'border',
      'coastal',
      'caves',
      'underground',
      'mountains',
      'desert',
      'arctic',
      'moon',
      'orbital',
      'spaceStation',
      'interstellar',
      'milestone',
    ],
    eventTypes: ['immigration', 'emigration', 'disaster', 'opportunity', 'milestone'],
    categories: ['opportunity', 'disaster', 'milestone', 'neutral'],
  });

  // Load system configuration from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/config');
        if (res.ok) {
          const data = await res.json();
          setSysConfig(data);
        }
      } catch (e) {
        console.warn('Failed to fetch system config, using hardcoded fallbacks', e);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (useCloud === null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowStorageModal(true);
    }
  }, [useCloud]);

  // Load game after choice has been made (or immediately for local)
  useEffect(() => {
    if (useCloud) {
      // TODO: fetch from server once auth is available
      console.log('cloud save selected - loading not implemented');
    } else if (useCloud === false || useCloud === null) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setGameState({
            ...createInitialGameState(),
            ...parsed,
            lastSave: Date.now(),
          });
        } catch (e) {
          console.error('Failed to load game save', e);
        }
      }
    }
    setIsLoaded(true);
  }, [useCloud]);

  // Load events from API to bridge with Admin UI
  useEffect(() => {
    const fetchAdminEvents = async () => {
      try {
        const res = await fetch('/api/admin/events');
        if (res.ok) {
          const eventsRaw: unknown = await res.json();
          let events = eventsRaw as EventTemplate[];

          // only keep templates where title/description are translation objects
          events = events.filter(
            (ev) => typeof ev.title !== 'string' && typeof ev.description !== 'string',
          );

          const territoryData: Record<string, EventTemplate[]> = {};
          const milestoneData: EventTemplate[] = [];

          events.forEach((ev) => {
            if (ev.territoryType === 'milestone') {
              milestoneData.push(ev);
            } else if (ev.territoryType) {
              if (!territoryData[ev.territoryType]) {
                territoryData[ev.territoryType] = [];
              }
              territoryData[ev.territoryType].push(ev);
            }
          });

          updateEventPool(territoryData, milestoneData);
          console.log('Synchronized with admin event pool');
        }
      } catch (e) {
        console.warn('Failed to fetch admin events, using local defaults', e);
      }
    };
    fetchAdminEvents();
  }, []);

  // Save game on interval to whichever storage was chosen
  useEffect(() => {
    // always return a cleanup function
    let saveInterval: number | undefined;
    if (isLoaded) {
      saveInterval = setInterval(() => {
        const now = Date.now();
        setGameState((prev) => ({ ...prev, lastSave: now }));

        // Perform side effect based on latest state
        // (Using a ref might be better, but for now we'll use local storage immediately
        // and cloud save will use the 'updated' value if we capture it or wait for next tick)
      }, 10000) as unknown as number;
    }
    return () => {
      if (saveInterval !== undefined) {
        clearInterval(saveInterval);
      }
    };
  }, [isLoaded]);

  // Handle actual persistence as a side effect of gameState.lastSave changing
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (useCloud && user) {
      fetch('/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          gameState: gameState,
        }),
      }).catch((err) => console.error('Cloud save failed', err));
    } else if (!useCloud) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState.lastSave, useCloud, user, isLoaded, gameState]);

  const processEvent = useCallback((state: GameState, event: GameEvent): GameState => {
    const newState = { ...state };
    // run the full modifier pipeline (territory, tech, etc.)
    const territory = event.targetTerritoryId
      ? newState.territories.find((t) => t.id === event.targetTerritoryId) || undefined
      : undefined;
    let modifiedEvent = ModifierService.applyModifiers(event, territory);

    // apply technology bonuses (global multipliers)
    const techMult = TechService.populationMultiplier(state);
    if (techMult !== 1) {
      modifiedEvent = {
        ...modifiedEvent,
        populationChange: modifiedEvent.populationChange * techMult,
      };
    }

    // apply policy modifiers (immigration only for now)
    if (modifiedEvent.type === EventType.immigration) {
      const pMult = PolicyService.immigrationMultiplier(state);
      if (pMult !== 1) {
        modifiedEvent = {
          ...modifiedEvent,
          populationChange: modifiedEvent.populationChange * pMult,
        };
      }
    }

    newState.eventHistory = [modifiedEvent, ...newState.eventHistory].slice(0, 50); // Keep last 50

    if (event.targetTerritoryId) {
      const tIndex = newState.territories.findIndex((t) => t.id === event.targetTerritoryId);
      if (tIndex >= 0) {
        newState.territories = [...newState.territories];
        newState.territories[tIndex] = PopulationService.applyPopulationDelta(
          newState.territories[tIndex],
          modifiedEvent.populationChange,
        );
      }
    } else {
      newState.people = Math.max(0, newState.people + modifiedEvent.populationChange);
    }

    if (modifiedEvent.populationChange > 0) {
      newState.totalImmigrants += Math.floor(modifiedEvent.populationChange);
    }

    return newState;
  }, []);

  // Helper functions used by both worker messages and inline intervals
  const runGameTick = useCallback(() => {
    setGameState((prev) => {
      let newState = { ...prev, playTime: prev.playTime + prev.gameSpeed };
      const currentTotalPop = PopulationService.totalPopulation(newState.territories);

      // Check locks
      const availableConfigs = getAvailableConfigs(currentTotalPop);
      for (const config of availableConfigs) {
        if (!newState.territories.find((t) => t.id === config.id)) {
          const newTerritory: Territory = {
            id: config.id,
            name: config.nameKey,
            description: config.descriptionKey,
            type: config.type,
            capacity: config.threshold * config.capacityMultiplier * config.capacityBaseMultiplier,
            population: 0,
            isUnlocked: true,
          };
          newState.territories = [...newState.territories, newTerritory];

          const unlockEvent: GameEvent = {
            id: `unlock_${config.id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            title: { en: 'Territory Unlocked', fi: 'Alue avattu' },
            description: {
              en: `New territory available: ${config.nameKey}`,
              fi: `Uusi alue käytettävissä: ${config.nameKey}`,
            },
            type: EventType.milestone,
            populationChange: 0,
            targetTerritoryId: config.id,
            timestamp: Date.now(),
            category: EventCategory.milestone,
          };
          newState = processEvent(newState, unlockEvent);
        }
      }

      // Era Detection (centralized)
      const territoryIds = newState.territories.map((t) => t.id);
      const newEra = detectNewEra(territoryIds, newState.achievedEras);
      if (newEra) {
        newState.achievedEras = [...newState.achievedEras, newEra.id];
        setActiveEra({
          name: newEra.name,
          quote: newEra.quote,
          image: newEra.image,
        });
        PopulationService.triggerMilestoneHaptic();
      }

      return newState;
    });
  }, [processEvent]);

  const runEventTick = useCallback(() => {
    let lastEvt: GameEvent | null = null;
    setGameState((prev) => {
      let newState = { ...prev };
      const currentTotalPop = PopulationService.totalPopulation(newState.territories);

      // Check milestones
      const milestoneEvent = checkMilestoneEvent(currentTotalPop, newState.achievedMilestones);
      if (milestoneEvent) {
        newState = processEvent(newState, milestoneEvent);
        if (!newState.achievedMilestones.includes(milestoneEvent.id)) {
          newState.achievedMilestones = [...newState.achievedMilestones, milestoneEvent.id];
        }
        PopulationService.triggerHaptic();
        lastEvt = milestoneEvent;
      }

      // Territory events
      for (const territory of newState.territories) {
        if (territory.isUnlocked) {
          const event = generateEventForTerritory(territory);
          if (event) {
            newState = processEvent(newState, event);
            lastEvt = event;
          }
        }
      }

      return newState;
    });

    if (lastEvt) {
      setLatestEvent(lastEvt);
    }
    setTickCount((c) => c + 1);
  }, [processEvent]);

  // Core Game Loop
  useEffect(() => {
    let gameTimer: number | undefined;
    let eventTimer: number | undefined;
    let worker: Worker | null = null;

    if (isLoaded) {
      if (typeof window !== 'undefined' && 'Worker' in window) {
        worker = new Worker(new URL('../workers/gameLoop.worker.ts', import.meta.url));
        worker.onmessage = (e) => {
          if (e.data.type === 'gameTick') {
            runGameTick();
          } else if (e.data.type === 'eventTick') {
            runEventTick();
          }
        };
        worker.postMessage({ action: 'start' });
      } else if (typeof window !== 'undefined') {
        // fallback to timers if we are in a browser without worker support
        // use global setInterval to avoid narrowing issues with `window`
        gameTimer = setInterval(runGameTick, 1000) as unknown as number;
        eventTimer = setInterval(runEventTick, 5000) as unknown as number;
      }
    }

    return () => {
      if (worker) {
        worker.postMessage({ action: 'stop' });
        worker.terminate();
      } else {
        if (gameTimer !== undefined) {
          clearInterval(gameTimer);
        }
        if (eventTimer !== undefined) {
          clearInterval(eventTimer);
        }
      }
    };
  }, [isLoaded, runGameTick, runEventTick]);

  const manualImmigration = useCallback(() => {
    setGameState((prev) => {
      const available = PopulationService.bestAvailableTerritory(prev.territories);
      const amount = PopulationService.manualImmigrationAmount(prev.territories);

      const manualEvent: GameEvent = {
        id: `manual_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: 'Manual Immigration',
        description: `You helped ${amount} new immigrants settle in ${available.name}`,
        type: EventType.immigration,
        populationChange: amount,
        targetTerritoryId: available.id,
        timestamp: Date.now(),
        category: EventCategory.opportunity,
      };

      return processEvent(prev, manualEvent);
    });
  }, [processEvent]);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
    localStorage.removeItem('useCloudChoice');
    if (useCloud) {
      // TODO: delete cloud save
      console.log('cloud save deleted');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [useCloud]);

  const openStorageSettings = useCallback(() => {
    setShowStorageModal(true);
  }, []);

  const completeEra = useCallback(() => {
    setActiveEra(null);
  }, []);

  const togglePolicy = useCallback((id: PolicyId) => {
    setGameState((prev) => PolicyService.togglePolicy(prev, id));
  }, []);

  const toggleTech = useCallback((id: TechId) => {
    setGameState((prev) => TechService.toggleTech(prev, id));
  }, []);

  const simulateTicks = useCallback(
    (count: number) => {
      // run both game and event ticks sequentially for deterministic testing
      for (let i = 0; i < count; i++) {
        runGameTick();
        runEventTick();
      }
    },
    [runGameTick, runEventTick],
  );

  return (
    <GameContext.Provider
      value={{
        gameState,
        manualImmigration,
        togglePolicy,
        toggleTech,
        resetGame,
        openStorageSettings,
        activeEra,
        completeEra,
        latestEvent,
        tickCount,
        simulateTicks,
        sysConfig,
      }}
    >
      {children}
      {!(typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) && (
        <StorageModal
          isOpen={showStorageModal}
          onClose={() => setShowStorageModal(false)}
          canClose={useCloud !== null}
          onSelectLocal={() => {
            setUseCloud(false);
            localStorage.setItem('useCloudChoice', 'false');
            setShowStorageModal(false);
          }}
          onSelectCloud={() => {
            setUseCloud(true);
            localStorage.setItem('useCloudChoice', 'true');
            setShowStorageModal(false);
          }}
          onReset={() => {
            if (
              window.confirm(
                'Are you absolutely sure you want to reset all game data? This cannot be undone.',
              )
            ) {
              resetGame();
              setShowStorageModal(false);
            }
          }}
        />
      )}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
