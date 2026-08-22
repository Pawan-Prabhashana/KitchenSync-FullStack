import React from 'react';
import { Trash2, ArrowRight } from 'lucide-react';
import { Order, Stage } from '../types';
import { getNextKitchenStage } from '../lib/boardConfig';

interface OrdersTableViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onMoveStage: (orderId: string, toStage: Stage) => void;
  onDeleteOrder: (orderId: string) => void;
}

const stageColors: Record<Stage, string> = {
  New: 'bg-sky-chip text-sky-ink',
  Cooking: 'bg-peach-chip text-peach-ink',
  Ready: 'bg-green-chip text-green-ink',
  Served: 'bg-canvas text-ink'
};

const advanceLabel: Record<Exclude<Stage, 'New'>, string> = {
  Cooking: 'Start',
  Ready: 'Ready',
  Served: 'Serve'
};

export const OrdersTableView: React.FC<OrdersTableViewProps> = ({
  orders,
  onSelectOrder,
  onMoveStage,
  onDeleteOrder
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div>
        <h2 className="text-xl font-bold text-ink">All Orders Table</h2>
        <p className="text-xs text-muted mt-0.5">List of all current active and completed tickets</p>
      </div>

      <div className="bg-surface border border-hairline rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-xs border-separate border-spacing-0">
            <thead>
              <tr className="bg-canvas text-muted font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Order ID</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Table</th>
                <th className="px-4 py-3 border-b border-hairline min-w-[180px]">Items Summary</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Waiter</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Chef</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Placed At</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Stage</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap text-right w-[260px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const nextStage = getNextKitchenStage(order.stage);
                const itemsLabel = order.items.map(i => `${i.quantity}x ${i.name}`).join(', ');

                return (
                  <tr key={order.id} className="hover:bg-canvas/80 transition-colors">
                    <td className="px-4 py-3.5 border-b border-hairline font-mono font-bold text-ink whitespace-nowrap align-middle">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline font-bold text-ink whitespace-nowrap align-middle">
                      {order.tableNumber}
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline text-ink align-middle max-w-[220px]">
                      <span className="block truncate" title={itemsLabel}>{itemsLabel}</span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline text-muted whitespace-nowrap align-middle">
                      {order.waiter}
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline text-muted whitespace-nowrap align-middle">
                      {order.chef || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline text-muted whitespace-nowrap align-middle">
                      {order.createdAt}
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline whitespace-nowrap align-middle">
                      <span className={`inline-flex px-2.5 py-1 rounded-full font-bold text-[10px] ${stageColors[order.stage]}`}>
                        {order.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-b border-hairline align-middle w-[260px]">
                      {/* Fixed 3-slot grid so every row's buttons line up */}
                      <div className="grid grid-cols-[72px_96px_32px] items-center justify-end gap-2 ml-auto w-max">
                        <button
                          type="button"
                          onClick={() => onSelectOrder(order)}
                          className="h-8 px-2.5 bg-canvas hover:bg-lilac-chip text-lilac-ink font-semibold rounded-lg"
                        >
                          Details
                        </button>

                        {nextStage ? (
                          <button
                            type="button"
                            onClick={() => onMoveStage(order.id, nextStage)}
                            className="h-8 px-2.5 bg-charcoal hover:bg-charcoal-hover text-white font-bold rounded-lg inline-flex items-center justify-center gap-1.5"
                          >
                            <span>{advanceLabel[nextStage]}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                          </button>
                        ) : (
                          <div className="h-8" aria-hidden />
                        )}

                        <button
                          type="button"
                          onClick={() => onDeleteOrder(order.id)}
                          className="h-8 w-8 inline-flex items-center justify-center text-faint hover:text-red-500 hover:bg-red-50 rounded-lg"
                          aria-label="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
