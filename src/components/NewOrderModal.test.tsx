import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewOrderModal } from './NewOrderModal';

describe('NewOrderModal', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('does not submit when no items are selected (validation)', () => {
    const onSubmit = vi.fn();
    render(<NewOrderModal currentUser={null} onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /punch order live/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('submits the selected items to the handler', () => {
    const onSubmit = vi.fn();
    render(<NewOrderModal currentUser={null} onClose={vi.fn()} onSubmit={onSubmit} />);

    // Mains is the default category — add a menu item, then submit.
    fireEvent.click(screen.getByText('Chicken Fried Rice'));
    fireEvent.click(screen.getByRole('button', { name: /punch order live/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.items).toHaveLength(1);
    expect(payload.items[0]).toMatchObject({ id: 'm1', name: 'Chicken Fried Rice', quantity: 1 });
    expect(payload.tableNumber).toBeTruthy();
  });
});
