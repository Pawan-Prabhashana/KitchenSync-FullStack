import bcrypt from 'bcryptjs';
import { Order, DeliveryOrder, StoredUser } from '../../models/types';
import { DEMO_USERS, DEMO_RIDERS } from '../../../src/data/menu';
import { seedAllOrders, seedAllDeliveries } from '../../utils/branchSeed';

/**
 * Shared password for every seeded demo account so the existing quick-login
 * buttons keep working end to end.
 */
export const DEMO_PASSWORD = 'kitchen123';

/**
 * In-memory data holder, seeded from the frontend's `src/data/*` fixtures so the
 * app looks populated on first run. This is the ONLY place mutable state lives;
 * repositories read/write it. In M3 a Mongoose-backed store replaces it behind
 * the same repository interfaces. NOTE: state resets on process restart — real
 * persistence is Milestone 3.
 */
class MemoryStore {
  users: StoredUser[] = [];
  orders: Order[] = [];
  deliveries: DeliveryOrder[] = [];

  constructor() {
    const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);

    this.users = [...DEMO_USERS, ...DEMO_RIDERS].map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      passwordHash: hash
    }));

    // Seed every branch so no location is empty on first run.
    this.orders = seedAllOrders();
    this.deliveries = seedAllDeliveries();
  }
}

/** Process-wide singleton. */
export const store = new MemoryStore();
