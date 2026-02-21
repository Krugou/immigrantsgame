import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// mock translations to return keys
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

import PolicySelector from './PolicySelector';
import { PolicyId } from '../../models/types';

describe('PolicySelector', () => {
  it('renders each policy with checkbox', () => {
    const toggle = vi.fn();
    render(<PolicySelector activePolicies={[PolicyId.openBorders]} togglePolicy={toggle} />);
    // mock returns the key itself
    expect(screen.getByText('policies.openBorders')).toBeInTheDocument();
    const checkbox = screen.getByLabelText('policies.openBorders');
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(toggle).toHaveBeenCalledWith(PolicyId.openBorders);
  });
});
