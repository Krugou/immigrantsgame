import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import StarField from './StarField';

// JSDOM stubs for canvas (no actual drawing)
HTMLCanvasElement.prototype.getContext = () => null;

const baseProps = {
  population: 1000,
  territoryCount: 1,
};

describe('StarField', () => {
  it('renders a canvas element', () => {
    const { container } = render(<StarField {...baseProps} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('is not aria-hidden (screen readers can announce it)', () => {
    const { container } = render(<StarField {...baseProps} />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('aria-hidden')).toBe('false');
  });

  it('has an aria-label containing population and territory count', () => {
    const { container } = render(<StarField {...baseProps} />);
    const canvas = container.querySelector('canvas');
    const label = canvas?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/population/i);
    expect(label).toMatch(/territories/i);
  });

  it('does not throw with zero population', () => {
    expect(() => render(<StarField {...baseProps} population={0} />)).not.toThrow();
  });

  it('does not throw with many territories', () => {
    expect(() => render(<StarField {...baseProps} territoryCount={5} />)).not.toThrow();
  });

  it('renders role="img" on the canvas', () => {
    const { container } = render(<StarField {...baseProps} />);
    const canvas = container.querySelector('canvas');
    expect(canvas?.getAttribute('role')).toBe('img');
  });
});
