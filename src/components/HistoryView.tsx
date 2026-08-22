import React from 'react';
import { Clock, CheckCircle2, User, Calendar } from 'lucide-react';
import { Order } from '../types';

interface HistoryViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ orders, onSelectOrder }) => {
  const servedOrders = orders.filter(o => o.stage === 'Served');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Completed Order History</h2>
          <p className="text-xs text-muted">Log of all served orders and stage change timestamps</p>
        </div>
        <div className="text-xs font-bold text-emerald-800 bg-green-chip/50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          {servedOrders.length} Served Orders
        </div>
      </div>

      <div className="space-y-3">
        {servedOrders.length === 0 ? (
          <div className="text-center py-12 text-faint text-xs border border-dashed border-hairline rounded-2xl">
            No completed orders in history yet
          </div>
        ) : (
          servedOrders.map(order => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-surface border border-hairline hover:border-emerald-300 rounded-2xl p-4 shadow-soft transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-chip text-green-ink flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">{order.tableNumber}</span>
                    <span className="text-xs font-mono text-faint">({order.id})</span>
                  </div>
                  <div className="text-xs text-muted font-medium truncate max-w-md">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted font-medium">
                <div>
                  <div className="text-[10px] uppercase font-bold text-faint">Staff</div>
                  <div className="text-ink font-semibold">{order.waiter} / {order.chef || 'Chef'}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-faint">Served At</div>
                  <div className="text-ink font-semibold">{order.servedAt || order.lastUpdatedAt}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
