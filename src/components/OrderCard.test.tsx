import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderCard } from './OrderCard';
import { Order } from '../types';

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: '#ORD-T1',
    branchId: 'br-colombo',
    tableNumber: 'Table 04',
    items: [{ id: 'm1', name: 'Chicken Fried Rice', quantity: 2 }],
    stage: 'New',
    waiter: 'Nimal',
    createdAt: '12:40 PM',
    createdAtTimestamp: Date.now(),
    lastUpdatedBy: 'Nimal',
    lastUpdatedAt: '12:40 PM',
    version: 1,
    history: [{ id: 'h1', stage: 'New', timestamp: '12:40 PM', user: 'Nimal', role: 'waiter' }],
    ...overrides
  };
}

describe('OrderCard', () => {
  it('renders the table number, order id and items', () => {
    render(
      <OrderCard
        order={makeOrder()}
        currentUser={null}
        onSelect={vi.fn()}
        onMoveStage={vi.fn()}
        onAssignChef={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Table 04')).toBeInTheDocument();
    expect(screen.getByText('(#ORD-T1)')).toBeInTheDocument();
    expect(screen.getByText('2x Chicken Fried Rice')).toBeInTheDocument();
  });

  it('advances the stage via the primary action button', () => {
    const onMoveStage = vi.fn();
    render(
      <OrderCard
        order={makeOrder()}
        currentUser={null}
        onSelect={vi.fn()}
        onMoveStage={onMoveStage}
        onAssignChef={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    // A 'New' order shows a "Start" action that moves it to Cooking.
    fireEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onMoveStage).toHaveBeenCalledWith('#ORD-T1', 'Cooking');
  });

  it('calls onDelete from the delete button', () => {
    const onDelete = vi.fn();
    render(
      <OrderCard
        order={makeOrder()}
        currentUser={null}
        onSelect={vi.fn()}
        onMoveStage={vi.fn()}
        onAssignChef={vi.fn()}
        onDelete={onDelete}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /cancel \/ delete order/i }));
    expect(onDelete).toHaveBeenCalledWith('#ORD-T1');
  });
});
