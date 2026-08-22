import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { DeliveryOrder, DeliveryStage, User, FilterOptions, ConflictInfo } from '../types';
import { DeliveryOrderCard } from './DeliveryOrderCard';
import { DELIVERY_STAGES } from '../lib/boardConfig';

interface DeliveryBoardProps {
  orders: DeliveryOrder[];
  currentUser: User | null;
  filters: FilterOptions;
  onSelectOrder: (order: DeliveryOrder) => void;
  onMoveStage: (orderId: string, toStage: DeliveryStage) => void;
  onAssignRider: (orderId: string, riderName: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenNewOrder: () => void;
  conflict?: ConflictInfo | null;
}

const stageMeta: Record<DeliveryStage, { dot: string; textBadge: string }> = {
  'Preparing': { dot: 'bg-peach-dot', textBadge: 'bg-peach-chip text-peach-ink' },
  'Ready for Pickup': { dot: 'bg-sky-dot', textBadge: 'bg-sky-chip text-sky-ink' },
  'Out for Delivery': { dot: 'bg-lilac-dot', textBadge: 'bg-lilac-chip text-lilac-ink' },
  'Delivered': { dot: 'bg-green-dot', textBadge: 'bg-green-chip text-green-ink' }
};

export const DeliveryBoard: React.FC<DeliveryBoardProps> = ({
  orders,
  currentUser,
  filters,
  onSelectOrder,
  onMoveStage,
  onAssignRider,
  onDeleteOrder,
  onOpenNewOrder,
  conflict
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<DeliveryStage | null>(null);

  const filteredOrders = orders.filter(order => {
    // Rider filter (reuses the shared `chef` filter slot).
    if (filters.chef !== 'all' && order.rider !== filters.chef) return false;
    // Payment filter (reuses the shared `table` filter slot).
    if (filters.table !== 'all' && order.paymentMethod !== filters.table) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        order.customerName.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q) ||
        (order.rider?.toLowerCase().includes(q) ?? false) ||
        order.items.some(i => i.name.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (filters.viewMode === 'mine' && currentUser) {
      if (currentUser.role === 'rider' && order.rider !== currentUser.name) return false;
    }
    return true;
  });

  const handleDrop = (e: React.DragEvent, toStage: DeliveryStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain');
    if (orderId) onMoveStage(orderId, toStage);
  };

  return (
    <div className="p-4 flex gap-4 items-start overflow-x-auto max-w-[1800px] mx-auto w-full">
      {DELIVERY_STAGES.map(stage => {
        const meta = stageMeta[stage];
        const columnOrders = filteredOrders.filter(o => o.stage === stage);
        const isTarget = dragOverColumn === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => { e.preventDefault(); setDragOverColumn(stage); }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, stage)}
            className={`flex flex-col rounded-2xl border p-2.5 transition-all min-h-[600px] flex-1 min-w-[280px] ${
              isTarget ? 'ring-2 ring-sky-dot border-sky-dot bg-sky-chip/20' : 'border-hairline bg-canvas/40'
            }`}
          >
            {/* Column header */}
            <div className="flex items-center justify-between px-2 py-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                <span>{stage}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${meta.textBadge}`}>
                {columnOrders.length}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-3 flex-1">
              {columnOrders.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-hairline rounded-xl flex items-center justify-center text-xs text-faint font-medium">
                  Drop orders here
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {columnOrders.map(order => (
                    <DeliveryOrderCard
                      key={order.id}
                      order={order}
                      currentUser={currentUser}
                      onSelect={onSelectOrder}
                      onMoveStage={onMoveStage}
                      onAssignRider={onAssignRider}
                      onDelete={onDeleteOrder}
                      isConflict={conflict?.orderId === order.id}
                      conflictBy={conflict?.orderId === order.id ? conflict?.updatedBy : undefined}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {stage === 'Preparing' && (
              <button
                onClick={onOpenNewOrder}
                className="mt-3 w-full border border-dashed border-slate-300 hover:border-sky-dot hover:bg-sky-chip/40 text-muted hover:text-sky-ink py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Delivery</span>
              </button>
            )}

            {stage === 'Delivered' && columnOrders.length > 0 && (
              <div className="mt-3 text-center text-xs text-muted font-medium py-1.5 bg-canvas rounded-xl">
                Delivered ({columnOrders.length})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
