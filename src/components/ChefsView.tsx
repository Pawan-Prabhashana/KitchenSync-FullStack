import React from 'react';
import { ChefHat, Flame, CheckCircle, Clock } from 'lucide-react';
import { Order, Stage } from '../types';
import { DEMO_USERS } from '../data/menu';
import { Avatar } from './Avatar';

interface ChefsViewProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
}

export const ChefsView: React.FC<ChefsViewProps> = ({ orders, onSelectOrder }) => {
  const chefs = DEMO_USERS.filter(u => u.role === 'chef');

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div>
          <h2 className="text-xl font-bold text-ink">Kitchen Staff Workload</h2>
          <p className="text-xs text-muted">Active chef assignments and cooking queue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {chefs.map(chef => {
          const activeOrders = orders.filter(o => o.chef === chef.name && o.stage !== 'Served');
          const cookingOrders = activeOrders.filter(o => o.stage === 'Cooking');
          const readyOrders = activeOrders.filter(o => o.stage === 'Ready');
          const servedCount = orders.filter(o => o.chef === chef.name && o.stage === 'Served').length;

          return (
            <div key={chef.id} className="bg-surface border border-hairline rounded-2xl p-5 shadow-soft space-y-4">
              {/* Chef Header */}
              <div className="flex items-center gap-3">
                <Avatar name={chef.name} role="chef" size="lg" />
                <div>
                  <h3 className="text-sm font-bold text-ink">{chef.name}</h3>
                  <div className="text-xs text-green-ink font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-chip/500 animate-pulse" />
                    On Duty (Chef)
                  </div>
                </div>
              </div>

              {/* Workload Stats */}
              <div className="grid grid-cols-3 gap-2 text-center bg-canvas p-2.5 rounded-xl border border-hairline">
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">Cooking</div>
                  <div className="text-base font-black text-amber-600">{cookingOrders.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">Ready</div>
                  <div className="text-base font-black text-green-ink">{readyOrders.length}</div>
                </div>
                <div>
                  <div className="text-[10px] text-faint uppercase font-bold">Served</div>
                  <div className="text-base font-black text-ink">{servedCount}</div>
                </div>
              </div>

              {/* Assigned Active Orders List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-faint uppercase tracking-wider">Active Queue</h4>
                {activeOrders.length === 0 ? (
                  <div className="text-xs text-faint italic py-3 text-center border border-dashed border-hairline rounded-xl">
                    No active orders assigned
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {activeOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => onSelectOrder(order)}
                        className="p-3 bg-canvas hover:bg-canvas rounded-xl border border-hairline cursor-pointer flex items-center justify-between text-xs transition-all"
                      >
                        <div>
                          <div className="font-bold text-ink">{order.tableNumber} ({order.id})</div>
                          <div className="text-[10px] text-muted truncate max-w-[160px]">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          order.stage === 'Cooking' ? 'bg-peach-chip text-peach-ink' : 'bg-green-chip text-green-ink'
                        }`}>
                          {order.stage}
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
