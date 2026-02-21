import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

import EventForm from './EventForm';
import { EventTemplate } from './EventTable';

describe('EventForm', () => {
  const dummy: EventTemplate = {
    id: '1',
    title: 'T',
    description: 'D',
    type: 'immigration',
    territoryType: 'rural',
    populationChange: 1,
    probability: 0.5,
    category: 'opportunity',
  };

  it('calls save on submit', () => {
    const save = vi.fn();
    const reset = vi.fn();
    const handleChange = vi.fn();

    render(
      <EventForm
        editing={null}
        form={dummy}
        handleChange={handleChange}
        save={save}
        resetForm={reset}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(save).toHaveBeenCalled();
  });
});
