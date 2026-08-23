import {
  Order,
  DeliveryOrder,
  User,
  StoredUser,
  Actor
} from './types';

/**
 * Data-access contracts. Controllers depend ONLY on these interfaces — never on a
 * concrete store — so Milestone 3 can drop in Mongoose-backed implementations
 * without touching any route or controller. The current implementations live in
 * `server/repositories/memory/`.
 */

export interface UserRepository {
  /** All users, public shape (no password hashes). */
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  /** Full stored record incl. hash — used only for authentication. */
  findByEmail(email: string): Promise<StoredUser | null>;
  create(user: StoredUser): Promise<StoredUser>;
}

/**
 * Shared CRUD contract for the two order types. `update` takes an optional
 * `expectedVersion`: when provided and it doesn't match the stored version, the
 * implementation MUST reject with a {@link VersionConflictError} (409) instead of
 * overwriting. On success it bumps the version, stamps the actor, and appends a
 * history entry when the stage changes (see `utils/versioning.ts`).
 */
export interface CrudRepository<T> {
  /** All entities, optionally scoped to a single branch. */
  findAll(branchId?: string): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: T): Promise<T>;
  update(id: string, patch: Partial<T>, actor: Actor, expectedVersion?: number): Promise<T>;
  remove(id: string): Promise<void>;
}

export type OrderRepository = CrudRepository<Order>;
export type DeliveryOrderRepository = CrudRepository<DeliveryOrder>;
