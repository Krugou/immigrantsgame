import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EventLog from './EventLog';
import { GameEvent, EventType, EventCategory } from '../models/types';

const makeEvent = (overrides: Partial<GameEvent> = {}): GameEvent => ({
  id: Math.random().toString(36).substring(2, 9),
  title: { en: 'Test English', fi: 'Test suomeksi' },
  description: { en: 'desc en', fi: 'kuvaus fi' },
  type: EventType.opportunity,
  category: EventCategory.opportunity,
  populationChange: 5,
  timestamp: Date.now(),
  ...overrides,
});

describe('EventLog', () => {
  it('shows placeholder when there are no events', () => {
    render(<EventLog events={[]} />);
    expect(screen.getByText(/awaiting/i)).toBeInTheDocument();
  });

  it('renders a normal list when events are few', () => {
    const events = Array.from({ length: 5 }, () => makeEvent());
    const { container } = render(<EventLog events={events} />);
    const expectedTitle = typeof events[0].title === 'object' ? events[0].title.en : events[0].title;
    const matches = screen.getAllByText(expectedTitle);
    expect(matches.length).toBe(events.length);
    // ensure list container is direct map (no virtuoso wrapper)
    expect(container.innerHTML).not.toContain('virtuoso');
  });

  it('uses virtualization when there are many events', () => {
    const events = Array.from({ length: 150 }, () => makeEvent());
    const { container } = render(<EventLog events={events} />);
    // virtualization branch should include component name in markup
    expect(container.innerHTML).toContain('virtuoso');
  });
});
