import { Order, DeliveryOrder } from '../models/types';
import { OrderModel } from './models/order.model';
import { DeliveryModel } from './models/delivery.model';

export interface OrderStats {
  branchId: string | null;
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  byChef: Array<{ chef: string; count: number }>;
}

export interface DeliveryStats {
  branchId: string | null;
  total: number;
  byStatus: Array<{ status: string; count: number }>;
  byRider: Array<{ rider: string; count: number }>;
}

/** Count occurrences of a key, returned sorted by count desc then key asc. */
function tally(values: string[]): Array<{ key: string; count: number }> {
  const map = new Map<string, number>();
  for (const v of values) map.set(v, (map.get(v) || 0) + 1);
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

// ─── Mongo: real aggregation pipelines ($match → $group → $sort) ───────────────

export async function aggregateOrderStats(branchId?: string): Promise<OrderStats> {
  const match = branchId ? { branchId } : {};
  const [byStatus, byChef, total] = await Promise.all([
    OrderModel.aggregate([
      { $match: match },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    OrderModel.aggregate([
      { $match: match },
      { $group: { _id: { $ifNull: ['$chef', 'Unassigned'] }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]),
    OrderModel.countDocuments(match)
  ]);
  return {
    branchId: branchId ?? null,
    total,
    byStatus: byStatus.map(b => ({ status: b._id as string, count: b.count as number })),
    byChef: byChef.map(b => ({ chef: b._id as string, count: b.count as number }))
  };
}

export async function aggregateDeliveryStats(branchId?: string): Promise<DeliveryStats> {
  const match = branchId ? { branchId } : {};
  const [byStatus, byRider, total] = await Promise.all([
    DeliveryModel.aggregate([
      { $match: match },
      { $group: { _id: '$stage', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    DeliveryModel.aggregate([
      { $match: match },
      { $group: { _id: { $ifNull: ['$rider', 'Unassigned'] }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }
    ]),
    DeliveryModel.countDocuments(match)
  ]);
  return {
    branchId: branchId ?? null,
    total,
    byStatus: byStatus.map(b => ({ status: b._id as string, count: b.count as number })),
    byRider: byRider.map(b => ({ rider: b._id as string, count: b.count as number }))
  };
}

// ─── Memory: equivalent computed result (same shape) ───────────────────────────

export function computeOrderStats(orders: Order[], branchId?: string): OrderStats {
  const rows = branchId ? orders.filter(o => o.branchId === branchId) : orders;
  return {
    branchId: branchId ?? null,
    total: rows.length,
    byStatus: tally(rows.map(o => o.stage)).map(b => ({ status: b.key, count: b.count })),
    byChef: tally(rows.map(o => o.chef || 'Unassigned')).map(b => ({ chef: b.key, count: b.count }))
  };
}

export function computeDeliveryStats(deliveries: DeliveryOrder[], branchId?: string): DeliveryStats {
  const rows = branchId ? deliveries.filter(o => o.branchId === branchId) : deliveries;
  return {
    branchId: branchId ?? null,
    total: rows.length,
    byStatus: tally(rows.map(o => o.stage)).map(b => ({ status: b.key, count: b.count })),
    byRider: tally(rows.map(o => o.rider || 'Unassigned')).map(b => ({ rider: b.key, count: b.count }))
  };
}
