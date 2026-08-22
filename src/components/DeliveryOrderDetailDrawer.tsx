import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X, AlertTriangle, RefreshCw, Trash2, MapPin, Bike, Wallet, ArrowRight, FlaskConical
} from 'lucide-react';
import { DeliveryOrder, DeliveryStage, User as UserType } from '../types';
import { DELIVERY_STAGES, getNextDeliveryStage } from '../lib/boardConfig';

interface DeliveryOrderDetailDrawerProps {
  order: DeliveryOrder | null;
  currentUser: UserType | null;
  onClose: () => void;
  onMoveStage: (orderId: string, toStage: DeliveryStage) => void;
  onDeleteOrder: (orderId: string) => void;
  conflictData?: { updatedBy: string; updatedAt: string } | null;
  onRefreshConflict?: () => void;
  onSimulateConflict?: (orderId: string) => void;
}

const stageBadgeColor: Record<DeliveryStage, string> = {
  'Preparing': 'bg-sky-chip text-sky-ink border-blue-200',
  'Ready for Pickup': 'bg-peach-chip text-peach-ink border-amber-200',
  'Out for Delivery': 'bg-sky-chip text-sky-ink border-indigo-200',
  'Delivered': 'bg-canvas text-ink border-hairline'
};

export const DeliveryOrderDetailDrawer: React.FC<DeliveryOrderDetailDrawerProps> = ({
  order,
  currentUser,
  onClose,
  onMoveStage,
  onDeleteOrder,
  conflictData,
  onRefreshConflict,
  onSimulateConflict
}) => {
  if (!order) return null;

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    const calc = () => {
      const now = Date.now();
      const created = order.createdAtTimestamp || now;
      setElapsedSeconds(Math.max(0, Math.floor((now - created) / 1000)));
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [order.createdAtTimestamp]);

  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const nextStage = getNextDeliveryStage(order.stage);
  const advanceLabel =
    nextStage === 'Ready for Pickup' ? 'Mark Ready for Pickup' :
    nextStage === 'Out for Delivery' ? 'Dispatch for Delivery' :
    nextStage === 'Delivered' ? 'Mark Delivered' : '';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label={`Delivery ${order.id} details`}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col overflow-y-auto border-l border-hairline"
      >
        {/* Header */}
        <div className="p-5 border-b border-hairline flex items-start justify-between bg-canvas/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-ink">{order.customerName}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${stageBadgeColor[order.stage]}`}>
                {order.stage}
              </span>
            </div>
            <p className="text-xs text-muted font-medium">
              Order ID: <strong className="text-ink font-mono">{order.id}</strong>
            </p>
            <p className="text-xs text-faint">Placed at {order.createdAt} ({mins} min ago)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-faint hover:text-ink hover:bg-canvas rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 flex-1 overflow-y-auto">
          {/* Delivery destination */}
          <div>
            <h3 className="text-xs font-bold text-faint uppercase tracking-wider mb-2">Delivery To</h3>
            <div className="bg-sky-chip/40 border border-indigo-200/70 p-3.5 rounded-xl flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div className="text-xs">
                <div className="font-semibold text-ink">{order.address}</div>
                <div className="text-muted mt-0.5">{order.distanceKm.toFixed(1)} km away · ETA target {order.etaMinutes} min</div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-bold text-faint uppercase tracking-wider mb-2">Item List</h3>
            <ul className="space-y-2 bg-canvas p-3.5 rounded-xl border border-hairline">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-ink font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-chip/500" />
                  <span>{item.quantity}x {item.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.specialNotes && (
            <div>
              <h3 className="text-xs font-bold text-faint uppercase tracking-wider mb-2">Delivery Notes</h3>
              <div className="bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl text-xs font-medium text-amber-950 whitespace-pre-line leading-relaxed">
                {order.specialNotes}
              </div>
            </div>
          )}

          {/* Info grid */}
          <div>
            <h3 className="text-xs font-bold text-faint uppercase tracking-wider mb-2">Order Info</h3>
            <div className="bg-surface border border-hairline rounded-xl divide-y divide-hairline text-xs">
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-muted flex items-center gap-1.5"><Bike className="w-3.5 h-3.5" /> Rider</span>
                <span className="font-semibold text-ink">{order.rider || 'Unassigned'}</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-muted flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5" /> Payment</span>
                <span className="font-semibold text-ink">{order.paymentMethod}</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-muted">Order Total</span>
                <span className="font-mono font-bold text-ink">${order.orderTotal.toFixed(2)}</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-muted">Time Elapsed</span>
                <span className="font-mono font-bold text-ink">{mins} min {secs} sec</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="text-muted">Last Updated</span>
                <span className="text-ink font-medium">{order.lastUpdatedAt} by {order.lastUpdatedBy}</span>
              </div>
            </div>
          </div>

          {/* History timeline */}
          <div>
            <h3 className="text-xs font-bold text-faint uppercase tracking-wider mb-3">History</h3>
            <div className="space-y-3 relative pl-4 before:absolute before:left-[7px] before:top-1.5 before:bottom-1.5 before:w-[2px] before:bg-slate-200">
              {DELIVERY_STAGES.map(stg => {
                const historyEntry = order.history.find(h => h.stage === stg);
                const isPassed = !!historyEntry;
                const isCurrent = order.stage === stg;
                return (
                  <div key={stg} className="flex items-center justify-between text-xs relative">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center -ml-[19px] bg-surface ring-2 ${
                        isCurrent || isPassed ? 'ring-sky-dot bg-sky-chip/500' : 'ring-slate-300'
                      }`}>
                        {isPassed && <span className="w-1.5 h-1.5 rounded-full bg-surface" />}
                      </span>
                      <span className={`font-semibold ${isPassed ? 'text-ink' : 'text-faint'}`}>{stg}</span>
                    </div>
                    <span className="text-faint font-mono text-[11px]">
                      {historyEntry ? `${historyEntry.timestamp} by ${historyEntry.user}` : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Conflict Guard Alert Banner */}
          {conflictData && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 text-amber-900"
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.4 }}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                </motion.span>
                <span>Just updated by {conflictData.updatedBy} — refresh to see changes</span>
              </div>
              <button
                onClick={onRefreshConflict}
                className="p-1.5 hover:bg-amber-100 rounded-lg text-peach-ink transition-colors shrink-0"
                aria-label="Refresh to latest version"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-hairline bg-canvas/50">
          {/* Demo tool */}
          {onSimulateConflict && order.stage !== 'Delivered' && (
            <div className="px-4 pt-3">
              <button
                onClick={() => onSimulateConflict(order.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 border border-dashed border-hairline text-muted hover:text-sky-ink hover:border-indigo-400 hover:bg-sky-chip/40 text-[11px] font-semibold rounded-lg transition-all"
                title="Demo only: simulate a teammate editing this order to trigger the conflict guard"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                ▲ Simulate conflict (demo)
              </button>
            </div>
          )}

          <div className="p-4 flex items-center gap-2">
            <button
              onClick={() => { onDeleteOrder(order.id); onClose(); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs rounded-xl transition-all shrink-0"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Cancel</span>
            </button>

            {nextStage ? (
              <button
                onClick={() => onMoveStage(order.id, nextStage)}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-charcoal hover:bg-charcoal-hover text-white font-bold text-xs rounded-xl shadow-soft transition-all"
              >
                <span>{advanceLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-soft transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
