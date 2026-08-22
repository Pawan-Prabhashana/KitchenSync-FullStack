import React from 'react';
import { CheckCircle2, MapPin } from 'lucide-react';
import { DeliveryOrder } from '../types';

interface DeliveryHistoryViewProps {
  orders: DeliveryOrder[];
  onSelectOrder: (order: DeliveryOrder) => void;
}

export const DeliveryHistoryView: React.FC<DeliveryHistoryViewProps> = ({
  orders,
  onSelectOrder
}) => {
  const delivered = orders.filter(o => o.stage === 'Delivered');

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Completed Delivery History</h2>
          <p className="text-xs text-muted">Log of all delivered orders and stage timestamps</p>
        </div>
        <div className="text-xs font-bold text-sky-ink bg-sky-chip/50 border border-indigo-200 px-3 py-1.5 rounded-xl">
          {delivered.length} Delivered
        </div>
      </div>

      <div className="space-y-3">
        {delivered.length === 0 ? (
          <div className="text-center py-12 text-faint text-xs border border-dashed border-hairline rounded-2xl">
            No completed deliveries in history yet
          </div>
        ) : (
          delivered.map(order => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className="bg-surface border border-hairline hover:border-indigo-300 rounded-2xl p-4 shadow-soft transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-sky-chip text-sky-ink flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink">
                    {order.customerName}{' '}
                    <span className="font-mono text-faint text-xs">{order.id}</span>
                  </div>
                  <div className="text-[11px] text-muted flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {order.address}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="font-semibold text-ink">
                  Delivered {order.deliveredAt || order.lastUpdatedAt}
                </div>
                <div className="text-faint">
                  Rider: {order.rider || '—'} · ${order.orderTotal.toFixed(2)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
