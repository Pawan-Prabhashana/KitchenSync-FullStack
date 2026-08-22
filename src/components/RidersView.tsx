import React from 'react';
import { DeliveryOrder } from '../types';
import { DEMO_RIDERS } from '../data/menu';
import { Avatar } from './Avatar';

interface RidersViewProps {
  orders: DeliveryOrder[];
  onSelectOrder: (order: DeliveryOrder) => void;
}

export const RidersView: React.FC<RidersViewProps> = ({ orders, onSelectOrder }) => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Rider Dispatch Board</h2>
          <p className="text-xs text-muted">Active rider assignments and delivery queue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_RIDERS.map(rider => {
          const active = orders.filter(o => o.rider === rider.name && o.stage !== 'Delivered');
          const outForDelivery = active.filter(o => o.stage === 'Out for Delivery');
          const pickup = active.filter(o => o.stage === 'Ready for Pickup');
          const deliveredCount = orders.filter(o => o.rider === rider.name && o.stage === 'Delivered').length;

          return (
            <div key={rider.id} className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name={rider.name} role="rider" size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{rider.name}</h3>
                  <div className="text-xs text-sky-ink font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-sky-chip/500 animate-pulse" />
                    On Route (Rider)
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center bg-canvas p-2.5 rounded-xl border border-hairline">
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">Pickup</div>
                  <div className="text-base font-black text-amber-600">{pickup.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">En route</div>
                  <div className="text-base font-black text-sky-ink">{outForDelivery.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">Delivered</div>
                  <div className="text-base font-black text-ink">{deliveredCount}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-faint uppercase tracking-wider">Active Queue</h4>
                {active.length === 0 ? (
                  <div className="text-xs text-faint italic py-3 text-center border border-dashed border-hairline rounded-xl">
                    No active deliveries assigned
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {active.map(order => (
                      <div
                        key={order.id}
                        onClick={() => onSelectOrder(order)}
                        className="p-3 bg-canvas hover:bg-canvas rounded-xl border border-hairline cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-ink truncate">{order.customerName} ({order.id})</div>
                          <div className="text-[10px] text-muted truncate max-w-[180px]">{order.address}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] shrink-0 ${
                          order.stage === 'Out for Delivery' ? 'bg-sky-chip text-sky-ink' : 'bg-peach-chip text-peach-ink'
                        }`}>
                          {order.stage === 'Out for Delivery' ? 'En route' : 'Pickup'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
