import React from 'react';
import { Trash2, ArrowRight, ClipboardList } from 'lucide-react';
import { DeliveryOrder, DeliveryStage } from '../types';
import { getNextDeliveryStage } from '../lib/boardConfig';

interface DeliveryOrdersTableViewProps {
  orders: DeliveryOrder[];
  onSelectOrder: (order: DeliveryOrder) => void;
  onMoveStage: (orderId: string, toStage: DeliveryStage) => void;
  onDeleteOrder: (orderId: string) => void;
}

const stageColors: Record<DeliveryStage, string> = {
  'Preparing': 'bg-sky-chip text-sky-ink',
  'Ready for Pickup': 'bg-peach-chip text-peach-ink',
  'Out for Delivery': 'bg-sky-chip text-sky-ink',
  'Delivered': 'bg-canvas text-ink'
};

export const DeliveryOrdersTableView: React.FC<DeliveryOrdersTableViewProps> = ({
  orders,
  onSelectOrder,
  onMoveStage,
  onDeleteOrder
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-ink">All Delivery Orders</h2>
          <p className="text-xs text-muted mt-0.5">List of active and completed delivery tickets</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted font-medium shrink-0">
          <ClipboardList className="w-4 h-4" />
          {orders.length} total
        </div>
      </div>

      <div className="bg-surface border border-hairline rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-xs border-separate border-spacing-0">
            <thead>
              <tr className="bg-canvas text-muted font-bold uppercase text-[10px] tracking-wider">
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Order</th>
                <th className="px-4 py-3 border-b border-hairline min-w-[180px]">Customer</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Stage</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Rider</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Payment</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap">Total</th>
                <th className="px-4 py-3 border-b border-hairline whitespace-nowrap text-right min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const next = getNextDeliveryStage(order.stage);
                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-canvas/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 border-b border-hairline font-mono font-semibold text-ink whitespace-nowrap align-middle">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 border-b border-hairline align-middle max-w-[220px]">
                      <div className="font-semibold text-ink truncate">{order.customerName}</div>
                      <div className="text-[10px] text-faint truncate">{order.address}</div>
                    </td>
                    <td className="px-4 py-3 border-b border-hairline whitespace-nowrap align-middle">
                      <span className={`inline-flex px-2 py-0.5 rounded-md font-bold ${stageColors[order.stage]}`}>
                        {order.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3 border-b border-hairline text-muted whitespace-nowrap align-middle">
                      {order.rider || '—'}
                    </td>
                    <td className="px-4 py-3 border-b border-hairline text-muted whitespace-nowrap align-middle">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-3 border-b border-hairline font-mono font-bold text-ink whitespace-nowrap align-middle">
                      ${order.orderTotal.toFixed(2)}
                    </td>
                    <td
                      className="px-4 py-3 border-b border-hairline align-middle whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center justify-end gap-2 w-full">
                        {next && (
                          <button
                            type="button"
                            onClick={() => onMoveStage(order.id, next)}
                            className="shrink-0 p-1.5 text-sky-ink hover:bg-sky-chip/50 rounded-lg"
                            aria-label={`Advance to ${next}`}
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onDeleteOrder(order.id)}
                          className="shrink-0 p-1.5 text-faint hover:text-red-500 hover:bg-red-50 rounded-lg"
                          aria-label="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
