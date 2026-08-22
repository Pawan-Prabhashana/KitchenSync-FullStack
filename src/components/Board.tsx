import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { Order, Stage, User, FilterOptions, ConflictInfo } from '../types';
import { OrderCard } from './OrderCard';

interface BoardProps {
  orders: Order[];
  currentUser: User | null;
  filters: FilterOptions;
  onSelectOrder: (order: Order) => void;
  onMoveStage: (orderId: string, toStage: Stage) => void;
  onAssignChef: (orderId: string, chefName: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onOpenNewOrder: () => void;
  conflict?: ConflictInfo | null;
}

export const Board: React.FC<BoardProps> = ({
  orders,
  currentUser,
  filters,
  onSelectOrder,
  onMoveStage,
  onAssignChef,
  onDeleteOrder,
  onOpenNewOrder,
  conflict
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<Stage | null>(null);

  const filteredOrders = orders.filter(order => {
    if (filters.chef !== 'all' && order.chef !== filters.chef) return false;
    if (filters.table !== 'all' && order.tableNumber !== filters.table) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matches =
        order.tableNumber.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.waiter.toLowerCase().includes(q) ||
        (order.chef?.toLowerCase().includes(q) ?? false) ||
        order.items.some(i => i.name.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (filters.viewMode === 'mine' && currentUser) {
      if (currentUser.role === 'chef' && order.chef !== currentUser.name) return false;
      if (currentUser.role === 'waiter' && order.waiter !== currentUser.name) return false;
    }
    return true;
  });

  const stages: Array<{ id: Stage; label: string; dot: string; textBadge: string }> = [
    { id: 'New', label: 'New', dot: 'bg-sky-dot', textBadge: 'bg-sky-chip text-sky-ink' },
    { id: 'Cooking', label: 'Cooking', dot: 'bg-peach-dot', textBadge: 'bg-peach-chip text-peach-ink' },
    { id: 'Ready', label: 'Ready', dot: 'bg-green-dot', textBadge: 'bg-green-chip text-green-ink' },
    { id: 'Served', label: 'Served', dot: 'bg-lilac-dot', textBadge: 'bg-lilac-chip text-lilac-ink' }
  ];

  const handleDrop = (e: React.DragEvent, toStage: Stage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain');
    if (orderId) onMoveStage(orderId, toStage);
  };

  return (
    <div className="p-4 flex gap-4 items-start overflow-x-auto max-w-[1800px] mx-auto w-full">
      {stages.map(stage => {
        const columnOrders = filteredOrders.filter(o => o.stage === stage.id);
        const isTarget = dragOverColumn === stage.id;

        return (
          <div
            key={stage.id}
            onDragOver={(e) => { e.preventDefault(); setDragOverColumn(stage.id); }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`flex flex-col rounded-2xl border p-2.5 transition-all min-h-[600px] flex-1 min-w-[260px] ${
              isTarget ? 'ring-2 ring-green-dot border-green-dot bg-green-chip/20' : 'border-hairline bg-canvas/40'
            }`}
          >
            <div className="flex items-center justify-between px-2 py-2 mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                <span>{stage.label}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold ${stage.textBadge}`}>
                {columnOrders.length}
              </span>
            </div>

            <div className="space-y-3 flex-1">
              {columnOrders.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-hairline rounded-xl flex items-center justify-center text-xs text-faint font-medium">
                  Drop orders here
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {columnOrders.map(order => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      currentUser={currentUser}
                      onSelect={onSelectOrder}
                      onMoveStage={onMoveStage}
                      onAssignChef={onAssignChef}
                      onDelete={onDeleteOrder}
                      isConflict={conflict?.orderId === order.id}
                      conflictBy={conflict?.orderId === order.id ? conflict.updatedBy : undefined}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {stage.id === 'New' && (
              <button
                onClick={onOpenNewOrder}
                className="mt-3 w-full border border-dashed border-hairline hover:border-green-dot hover:bg-green-chip/40 text-muted hover:text-green-ink py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Order</span>
              </button>
            )}

            {stage.id === 'Served' && columnOrders.length > 0 && (
              <div className="mt-3 text-center text-xs text-muted font-medium py-1.5 bg-canvas rounded-xl">
                Completed ({columnOrders.length})
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
