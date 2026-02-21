import { describe, it, expect, vi, beforeAll } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// mock i18n to return keys
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

// provide a fake game context
const fakeContext = {
  gameState: { policies: [], techs: [] },
  togglePolicy: vi.fn(),
  toggleTech: vi.fn(),
  simulateTicks: vi.fn(),
};

// stub fetch because component hits /api/admin/events
beforeAll(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({ json: () => Promise.resolve([]) } as unknown as Response),
  );
});
vi.mock('../../context/GameContext', () => ({ useGame: () => fakeContext }));

import AdminPage from './page';

describe('AdminPage', () => {
  it('renders simulate button and calls simulateTicks', () => {
    render(<AdminPage />);
    const btn = screen.getByText('admin.simulateHour');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(fakeContext.simulateTicks).toHaveBeenCalledWith(720);
    // notification should appear
    expect(screen.getByText('admin.simulated', { exact: false })).toBeInTheDocument();
  });

  it('shows tech selector checkboxes', () => {
    render(<AdminPage />);
    expect(screen.getByText('tech.advancedAgriculture')).toBeInTheDocument();
    const checkbox = screen.getByLabelText('tech.advancedAgriculture');
    fireEvent.click(checkbox);
    expect(fakeContext.toggleTech).toHaveBeenCalledWith('advancedAgriculture');
  });
});
