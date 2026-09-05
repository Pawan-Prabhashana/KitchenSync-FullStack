import bcrypt from 'bcryptjs';
import { UserModel } from './models/user.model';
import { OrderModel } from './models/order.model';
import { DeliveryModel } from './models/delivery.model';
import { DEMO_USERS, DEMO_RIDERS } from '../../src/data/menu';
import { seedAllOrders, seedAllDeliveries } from '../utils/branchSeed';
import { DEMO_PASSWORD } from '../repositories/memory/memoryStore';

/**
 * Seed MongoDB the first time each collection is empty, reusing the EXACT same
 * sources as the in-memory store (DEMO_USERS + DEMO_RIDERS with the shared
 * bcrypt-hashed `kitchen123` password, and the per-branch seeders). Idempotent —
 * safe to call on every boot; guards on countDocuments so restarts never duplicate.
 */
export async function seedMongoIfEmpty(): Promise<{ users: number; orders: number; deliveries: number }> {
  const [users, orders, deliveries] = await Promise.all([
    UserModel.countDocuments(),
    OrderModel.countDocuments(),
    DeliveryModel.countDocuments()
  ]);

  if (users === 0) {
    const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
    await UserModel.insertMany(
      [...DEMO_USERS, ...DEMO_RIDERS].map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        passwordHash: hash
      }))
    );
  }

  if (orders === 0) await OrderModel.insertMany(seedAllOrders());
  if (deliveries === 0) await DeliveryModel.insertMany(seedAllDeliveries());

  return {
    users: await UserModel.countDocuments(),
    orders: await OrderModel.countDocuments(),
    deliveries: await DeliveryModel.countDocuments()
  };
}
