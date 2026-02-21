import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-user' },
    loading: false,
  }),
}));

import TechTree from './TechTree';
import { GameProvider } from '../context/GameContext';

describe('TechTree', () => {
  it('renders tech cards and allows toggling', async () => {
    // stub localStorage so GameProvider mounts cleanly
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      },
      configurable: true,
    });

    render(
      <GameProvider>
        <TechTree />
      </GameProvider>,
    );

    // heading should still be present
    expect(screen.getByText('ui.techTree')).toBeInTheDocument();

    // verify each tech name from catalog appears
    const techNames = ['Advanced Agriculture', 'Efficient Transport', 'Universal Healthcare'];
    techNames.forEach((name) => expect(screen.getByText(name)).toBeInTheDocument());

    // first card button should allow research toggle
    const firstButton = screen.getAllByRole('button', { name: 'ui.research' })[0];
    fireEvent.click(firstButton);
    // state update is asynchronous, wait for text change
    await waitFor(() => expect(firstButton).toHaveTextContent('ui.unresearch'));
  });
});
