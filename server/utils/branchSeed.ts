import { Order, DeliveryOrder } from '../models/types';
import { BRANCHES } from '../../src/data/branches';
import { seedKitchenForBranch, seedDeliveryForBranch } from '../../src/data/branchSeeds';

/**
 * Per-branch seed data now lives in one file per city under
 * `src/data/branches/<city>.ts` (mapped by `src/data/branchSeeds.ts`), so each
 * teammate can own and extend their own branch without collisions. These helpers
 * just delegate to that shared registry — the frontend offline fallback uses the
 * exact same source, so the API and the client stay in sync.
 */

/** Kitchen orders for a single branch (fresh, deep-cloned). */
export function seedOrdersForBranch(branchId: string): Order[] {
  return seedKitchenForBranch(branchId);
}

/** Delivery orders for a single branch (fresh, deep-cloned). */
export function seedDeliveriesForBranch(branchId: string): DeliveryOrder[] {
  return seedDeliveryForBranch(branchId);
}

/** All branches' kitchen orders, flattened — used to seed the in-memory store. */
export function seedAllOrders(): Order[] {
  return BRANCHES.flatMap(b => seedOrdersForBranch(b.id));
}

/** All branches' delivery orders, flattened — used to seed the in-memory store. */
export function seedAllDeliveries(): DeliveryOrder[] {
  return BRANCHES.flatMap(b => seedDeliveriesForBranch(b.id));
}
