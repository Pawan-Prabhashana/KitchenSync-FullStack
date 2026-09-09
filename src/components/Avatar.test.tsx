import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('renders two-letter initials from a full name', () => {
    render(<Avatar name="Priya Fernando" role="chef" />);
    expect(screen.getByText('PF')).toBeInTheDocument();
  });

  it('renders the first two letters for a single-word name', () => {
    render(<Avatar name="Nimal" />);
    expect(screen.getByText('NI')).toBeInTheDocument();
  });

  it('exposes the full name via the title attribute', () => {
    render(<Avatar name="Hasini Dias" role="waiter" />);
    expect(screen.getByText('HD')).toHaveAttribute('title', 'Hasini Dias');
  });
});
