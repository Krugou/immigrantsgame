import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

import EventTable, { EventTemplate } from './EventTable';

const dummy: EventTemplate = {
  id: '1',
  title: 'T',
  description: '',
  type: 'immigration',
  territoryType: 'rural',
  populationChange: 1,
  probability: 0.5,
  category: 'opportunity',
};

describe('EventTable', () => {
  it('renders headers', () => {
    const start = vi.fn();
    const remove = vi.fn();
    render(<EventTable events={[dummy]} startEdit={start} remove={remove} />);
    // translation mock yields keys
    expect(screen.getByText('admin.id')).toBeInTheDocument();
    expect(screen.getByText('admin.titleCol')).toBeInTheDocument();
    expect(screen.getByText('admin.actions')).toBeInTheDocument();
  });
});
