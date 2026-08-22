import React from 'react';
import { BarChart3, Clock, TrendingUp, CheckCircle, Flame, Users } from 'lucide-react';
import { Order } from '../types';

interface AnalyticsViewProps {
  orders: Order[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders }) => {
  const total = orders.length;
  const newCount = orders.filter(o => o.stage === 'New').length;
  const cookingCount = orders.filter(o => o.stage === 'Cooking').length;
  const readyCount = orders.filter(o => o.stage === 'Ready').length;
  const servedCount = orders.filter(o => o.stage === 'Served').length;

  // Calculate item frequencies
  const itemCounts = new Map<string, number>();
  orders.forEach(o => {
    o.items.forEach(i => {
      itemCounts.set(i.name, (itemCounts.get(i.name) || 0) + i.quantity);
    });
  });

  const sortedItems = Array.from(itemCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="border-b border-hairline pb-4">
        <h2 className="text-xl font-bold text-ink">Kitchen Operations Analytics</h2>
        <p className="text-xs text-muted">Real-time throughput, preparation times, and top dishes</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Total Tickets</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><BarChart3 className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-ink">{total}</div>
          <div className="text-[11px] text-faint mt-1">Active + Served today</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">In Cooking</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Flame className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-600">{cookingCount}</div>
          <div className="text-[11px] text-faint mt-1">Active cooking line</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Avg Prep Time</span>
            <span className="p-2 bg-green-chip/50 text-green-ink rounded-xl"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-green-ink">11.4 min</div>
          <div className="text-[11px] text-green-ink font-semibold mt-1">↓ 2.1 min target</div>
        </div>

        <div className="bg-surface border border-hairline rounded-2xl p-4 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted uppercase">Served Total</span>
            <span className="p-2 bg-canvas text-ink rounded-xl"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-ink">{servedCount}</div>
          <div className="text-[11px] text-faint mt-1">Completed orders</div>
        </div>
      </div>

      {/* Visual stage throughput breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-ink">Current Order Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-ink mb-1">
                <span>New Tickets ({newCount})</span>
                <span>{total ? Math.round((newCount / total) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${total ? (newCount / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-ink mb-1">
                <span>Cooking ({cookingCount})</span>
                <span>{total ? Math.round((cookingCount / total) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${total ? (cookingCount / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-ink mb-1">
                <span>Ready to Serve ({readyCount})</span>
                <span>{total ? Math.round((readyCount / total) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                <div className="h-full bg-green-chip/500" style={{ width: `${total ? (readyCount / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-ink mb-1">
                <span>Served ({servedCount})</span>
                <span>{total ? Math.round((servedCount / total) * 100) : 0}%</span>
              </div>
              <div className="h-2.5 bg-canvas rounded-full overflow-hidden">
                <div className="h-full bg-slate-400" style={{ width: `${total ? (servedCount / total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Ordered Dishes */}
        <div className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-ink">Top Ordered Dishes</h3>
          <div className="space-y-3">
            {sortedItems.map(([name, qty], idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-canvas rounded-xl border border-hairline text-xs">
                <div className="flex items-center gap-2.5 font-bold text-ink">
                  <span className="w-6 h-6 rounded-lg bg-green-chip text-green-ink text-[11px] flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <span>{name}</span>
                </div>
                <span className="font-mono font-bold text-green-ink">{qty} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
