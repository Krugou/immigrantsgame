import { describe, it, expect, vi, beforeAll } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { GameProvider, useGame } from './GameContext';
import { TechId } from '../models/types';

vi.mock('./AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
    loading: false,
  }),
}));

// provide a minimal localStorage stub for node tests
beforeAll(() => {
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  } as unknown as Storage;
});

describe('GameContext', () => {
  it('simulateTicks increments tickCount by requested amount', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <GameProvider>{children}</GameProvider>
    );

    const { result } = renderHook(() => useGame(), { wrapper });
    expect(result.current.tickCount).toBe(0);

    act(() => {
      result.current.simulateTicks(5);
    });

    expect(result.current.tickCount).toBe(5);
  });

  it('toggleTech unlocks tech and boosts immigration', () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <GameProvider>{children}</GameProvider>
    );
    const { result } = renderHook(() => useGame(), { wrapper });

    // initial territory population (people count remains unused for migrations)
    const initialTerrPop = result.current.gameState.territories[0].population;

    // manual immigration without tech
    act(() => {
      result.current.manualImmigration();
    });
    const afterNoTech = result.current.gameState.territories[0].population;
    expect(afterNoTech).toBeGreaterThan(initialTerrPop);

    // reset and add tech
    act(() => {
      result.current.resetGame();
      result.current.toggleTech(TechId.advancedAgriculture);
    });

    const baseline = result.current.gameState.territories[0].population;
    act(() => {
      result.current.manualImmigration();
    });
    const afterWithTech = result.current.gameState.territories[0].population;

    expect(afterWithTech - baseline).toBeGreaterThan(afterNoTech - initialTerrPop);
  });
});
