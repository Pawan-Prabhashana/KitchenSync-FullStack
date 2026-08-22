import React from 'react';
import { BarChart3, Clock, CheckCircle, Bike, Package } from 'lucide-react';
import { DeliveryOrder } from '../types';

interface DeliveryAnalyticsViewProps {
  orders: DeliveryOrder[];
}

export const DeliveryAnalyticsView: React.FC<DeliveryAnalyticsViewProps> = ({ orders }) => {
  const total = orders.length;
  const preparing = orders.filter(o => o.stage === 'Preparing').length;
  const pickup = orders.filter(o => o.stage === 'Ready for Pickup').length;
  const enRoute = orders.filter(o => o.stage === 'Out for Delivery').length;
  const delivered = orders.filter(o => o.stage === 'Delivered').length;

  const revenue = orders.reduce((sum, o) => sum + o.orderTotal, 0);

  const itemCounts = new Map<string, number>();
  orders.forEach(o => {
    o.items.forEach(i => {
      itemCounts.set(i.name, (itemCounts.get(i.name) || 0) + i.quantity);
    });
  });
  const sortedItems = Array.from(itemCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-hairline pb-4">
        <h2 className="text-xl font-bold text-ink">Delivery Operations Analytics</h2>
        <p className="text-xs text-muted">Dispatch throughput, on-route volume, and top delivery dishes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Total Tickets</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-ink">{total}</div>
          <div className="text-[11px] text-faint mt-1">Active + delivered today</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Out for Delivery</span>
            <span className="p-2 bg-sky-chip/50 text-sky-ink rounded-xl"><Bike className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-sky-ink">{enRoute}</div>
          <div className="text-[11px] text-faint mt-1">Riders currently en route</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Avg ETA Window</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-700">35 min</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">Target delivery window</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Delivered</span>
            <span className="p-2 bg-canvas text-ink rounded-xl"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-ink">{delivered}</div>
          <div className="text-[11px] text-faint mt-1">${revenue.toFixed(0)} revenue tracked</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-ink">Current Delivery Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Preparing', count: preparing, color: 'bg-blue-500' },
              { label: 'Ready for Pickup', count: pickup, color: 'bg-amber-500' },
              { label: 'Out for Delivery', count: enRoute, color: 'bg-sky-chip/500' },
              { label: 'Delivered', count: delivered, color: 'bg-slate-400' }
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs font-bold text-ink mb-1">
                  <span>{row.label} ({row.count})</span>
                  <span>{pct(row.count)}%</span>
                </div>
                <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                  <div className={`h-full ${row.color}`} style={{ width: `${pct(row.count)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <Package className="w-4 h-4 text-indigo-500" />
            Top Delivery Dishes
          </h3>
          <div className="space-y-3">
            {sortedItems.map(([name, qty], idx) => (
              <div
                key={name}
                className="flex items-center justify-between p-2.5 bg-canvas rounded-xl border border-hairline text-xs"
              >
                <div className="flex items-center gap-2.5 font-bold text-ink">
                  <span className="w-6 h-6 rounded-lg bg-sky-chip text-sky-ink text-[11px] flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <span>{name}</span>
                </div>
                <span className="font-mono font-bold text-sky-ink">{qty} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
