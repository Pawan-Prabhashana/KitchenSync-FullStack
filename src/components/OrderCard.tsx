import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Trash2, CheckCircle2, User as UserIcon, ArrowRight, AlertTriangle } from 'lucide-react';
import SelectMenu from './SelectMenu';
import { Avatar } from './Avatar';
import { Order, Stage, User } from '../types';
import { DEMO_USERS } from '../data/menu';
import { getNextKitchenStage } from '../lib/boardConfig';
import { useUpdateFlash } from '../hooks/useUpdateFlash';

interface OrderCardProps {
  order: Order;
  currentUser: User | null;
  onSelect: (order: Order) => void;
  onMoveStage: (orderId: string, toStage: Stage) => void;
  onAssignChef: (orderId: string, chefName: string) => void;
  onDelete: (orderId: string) => void;
  isConflict?: boolean;
  conflictBy?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onSelect,
  onMoveStage,
  onAssignChef,
  onDelete,
  isConflict,
  conflictBy
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const flash = useUpdateFlash(order.version);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = Date.now();
      const created = order.createdAtTimestamp || now;
      setElapsedSeconds(Math.max(0, Math.floor((now - created) / 1000)));
    };
    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [order.createdAtTimestamp]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      return `${pad(hrs)}:${pad(mins % 60)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const elapsedMins = elapsedSeconds / 60;

  let timerBadgeStyle = 'text-green-ink bg-green-chip border-green-chip';
  if (elapsedMins >= 12) {
    timerBadgeStyle = 'text-coral-ink bg-coral-chip border-coral-dot font-bold shadow-[0_0_0_1px_rgba(239,68,68,0.25)] animate-pulse';
  } else if (elapsedMins >= 8) {
    timerBadgeStyle = 'text-peach-ink bg-peach-chip border-peach-dot font-semibold shadow-[0_0_0_1px_rgba(245,158,11,0.2)]';
  }

  const chefs = DEMO_USERS.filter(u => u.role === 'chef');
  const nextStage = getNextKitchenStage(order.stage);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', order.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  if (order.stage === 'Served') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        draggable
        onDragStart={handleDragStart}
        onClick={() => onSelect(order)}
        className="bg-surface border border-hairline rounded-xl p-3 shadow-soft hover:shadow-md transition-all cursor-pointer group hover:border-slate-300"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-chip text-green-ink flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-ink">{order.tableNumber}</div>
              <div className="text-[10px] text-faint">
                Served at {order.servedAt || order.lastUpdatedAt}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(order.id); }}
            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
            aria-label="Delete served record"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelect(order)}
      className={`bg-surface border rounded-xl p-3.5 shadow-soft hover:shadow-md transition-all cursor-pointer group relative ${
        isConflict ? 'border-amber-400 ring-2 ring-amber-200' : 'border-hairline hover:border-green-dot/60'
      }`}
    >
      {flash && (
        <motion.span
          initial={{ opacity: 0.55 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.85 }}
          className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-green-dot bg-green-dot/10"
        />
      )}

      {isConflict && conflictBy && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 -mt-0.5 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-900"
        >
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span className="truncate">Updated by {conflictBy}</span>
        </motion.div>
      )}

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-bold text-ink">{order.tableNumber}</span>
          <span className="text-[10px] text-faint font-mono truncate">({order.id})</span>
        </div>
        <span className="text-[11px] font-medium text-faint shrink-0">{order.createdAt}</span>
      </div>

      <div className="space-y-0.5 mb-3">
        {order.items.slice(0, 3).map((item, idx) => (
          <div key={idx} className="text-xs text-ink font-medium">
            {item.quantity}x {item.name}
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="text-[10px] text-faint font-medium italic">
            +{order.items.length - 3} more item(s)...
          </div>
        )}
      </div>

      <div className="text-[11px] text-muted font-medium mb-3 flex flex-wrap items-center justify-between gap-1">
        {order.waiter && (
          <span className="flex items-center gap-1">
            <UserIcon className="w-3 h-3 text-faint" />
            Waiter: <strong className="text-ink font-semibold">{order.waiter}</strong>
          </span>
        )}
        {order.chef ? (
          <span className="flex items-center gap-1">
            Chef: <strong className="text-ink font-semibold">{order.chef}</strong>
          </span>
        ) : null}
      </div>

      {(!order.chef || order.stage === 'New') && (
        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between text-[11px] text-muted mb-1">
            <span>Assign:</span>
          </div>
          <SelectMenu
            options={[{ value: '', label: 'Select Chef' }, ...chefs.map(c => ({ value: c.name, label: c.name }))]}
            value={order.chef || ''}
            onChange={(v) => onAssignChef(order.id, v)}
            placeholder="Select Chef"
            size="sm"
            renderItem={(opt) => {
              const chef = DEMO_USERS.find(u => u.name === opt.label);
              return (
                <div className="flex items-center gap-2">
                  <Avatar name={opt.label} role="chef" size="xs" showRing={false} />
                  <span className="text-sm font-medium text-ink">{opt.label}</span>
                </div>
              );
            }}
          />
        </div>
      )}

      {order.specialNotes && (
        <div className="mb-3 px-2 py-1 bg-amber-50 border border-amber-200/60 rounded-md text-[10px] font-medium text-amber-900 line-clamp-1">
          📝 {order.specialNotes}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-2 border-t border-hairline" onClick={(e) => e.stopPropagation()}>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono border ${timerBadgeStyle}`}
          title={elapsedMins >= 12 ? 'Critical — overdue' : elapsedMins >= 8 ? 'Warning — aging' : 'On track'}
        >
          <Clock className="w-3 h-3 shrink-0" />
          <span>{formatTimer(elapsedSeconds)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {nextStage && (
            <button
              onClick={() => onMoveStage(order.id, nextStage)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all shadow-soft active:scale-95 ${
                order.stage === 'Ready'
                  ? 'bg-charcoal hover:bg-charcoal-hover text-white'
                  : 'bg-green-chip hover:brightness-95 text-green-ink border border-green-chip'
              }`}
            >
              <span>{nextStage === 'Cooking' ? 'Start' : nextStage === 'Ready' ? 'Ready!' : 'Serve'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => onDelete(order.id)}
            className="p-1.5 text-faint hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Cancel / delete order"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
