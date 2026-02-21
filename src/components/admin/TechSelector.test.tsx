import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TechId } from '../../models/types';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

import TechSelector from './TechSelector';

describe('TechSelector', () => {
  it('renders all tech options and toggles correctly', () => {
    const toggle = vi.fn();
    render(<TechSelector unlockedTechs={[TechId.advancedAgriculture]} toggleTech={toggle} />);

    // should show all three tech labels
    expect(screen.getByText('tech.advancedAgriculture')).toBeInTheDocument();
    expect(screen.getByText('tech.efficientTransport')).toBeInTheDocument();
    expect(screen.getByText('tech.universalHealthcare')).toBeInTheDocument();

    // clicking checkbox should call toggleTech with proper id
    const checkbox = screen.getByLabelText('tech.efficientTransport') as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(toggle).toHaveBeenCalledWith(TechId.efficientTransport);
  });
});
