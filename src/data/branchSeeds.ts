import { Order, DeliveryOrder } from '../types';
import { DEFAULT_BRANCH_ID } from './branches';

import { colomboKitchenOrders, colomboDeliveryOrders } from './branches/colombo';
import { galleKitchenOrders, galleDeliveryOrders } from './branches/galle';
import { kandyKitchenOrders, kandyDeliveryOrders } from './branches/kandy';
import { jaffnaKitchenOrders, jaffnaDeliveryOrders } from './branches/jaffna';
import { negomboKitchenOrders, negomboDeliveryOrders } from './branches/negombo';
import { kurunegalaKitchenOrders, kurunegalaDeliveryOrders } from './branches/kurunegala';
import { anuradhapuraKitchenOrders, anuradhapuraDeliveryOrders } from './branches/anuradhapura';
import { batticaloaKitchenOrders, batticaloaDeliveryOrders } from './branches/batticaloa';

export interface BranchSeed {
  kitchen: Order[];
  delivery: DeliveryOrder[];
}

/**
 * branchId → that city's starter orders. Each teammate owns one file under
 * `src/data/branches/<city>.ts`; adding orders there flows into both the API seed
 * (server/utils/branchSeed.ts) and the frontend offline fallback (App.tsx).
 */
export const BRANCH_SEEDS: Record<string, BranchSeed> = {
  'br-colombo': { kitchen: colomboKitchenOrders, delivery: colomboDeliveryOrders },
  'br-galle': { kitchen: galleKitchenOrders, delivery: galleDeliveryOrders },
  'br-kandy': { kitchen: kandyKitchenOrders, delivery: kandyDeliveryOrders },
  'br-jaffna': { kitchen: jaffnaKitchenOrders, delivery: jaffnaDeliveryOrders },
  'br-negombo': { kitchen: negomboKitchenOrders, delivery: negomboDeliveryOrders },
  'br-kurunegala': { kitchen: kurunegalaKitchenOrders, delivery: kurunegalaDeliveryOrders },
  'br-anuradhapura': { kitchen: anuradhapuraKitchenOrders, delivery: anuradhapuraDeliveryOrders },
  'br-batticaloa': { kitchen: batticaloaKitchenOrders, delivery: batticaloaDeliveryOrders }
};

function seedFor(branchId: string): BranchSeed {
  // Fallback to the default branch so an unknown id is never empty.
  return BRANCH_SEEDS[branchId] ?? BRANCH_SEEDS[DEFAULT_BRANCH_ID];
}

/**
 * Fresh, deep-cloned kitchen orders for a branch, with branchId stamped in (so a
 * teammate can't forget it). Cloning keeps the exported fixtures immutable even
 * though the in-memory store mutates orders as they move through stages.
 */
export function seedKitchenForBranch(branchId: string): Order[] {
  return structuredClone(seedFor(branchId).kitchen).map(o => ({ ...o, branchId }));
}

export function seedDeliveryForBranch(branchId: string): DeliveryOrder[] {
  return structuredClone(seedFor(branchId).delivery).map(o => ({ ...o, branchId }));
}
