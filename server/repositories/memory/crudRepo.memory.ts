import { CrudRepository } from '../../models/repositories';
import { Versioned, Actor } from '../../models/types';
import { NotFoundError, VersionConflictError } from '../../utils/httpError';
import { bumpVersion } from '../../utils/versioning';

type Staged = Versioned & { branchId: string; stage: string; history: Array<{ id: string; stage: string; timestamp: string; user: string; role: string }> };

/**
 * Generic array-backed CRUD repository shared by the kitchen and delivery stores.
 * All optimistic-concurrency and versioning rules live here, so both boards
 * behave identically and a Mongoose repository can mirror this exactly in M3.
 */
export class MemoryCrudRepository<T extends Staged> implements CrudRepository<T> {
  constructor(private readonly getList: () => T[]) {}

  async findAll(branchId?: string): Promise<T[]> {
    const list = this.getList();
    return branchId ? list.filter(o => o.branchId === branchId) : [...list];
  }

  async findById(id: string): Promise<T | null> {
    return this.getList().find(o => o.id === id) ?? null;
  }

  async create(entity: T): Promise<T> {
    this.getList().unshift(entity);
    return entity;
  }

  async update(id: string, patch: Partial<T>, actor: Actor, expectedVersion?: number): Promise<T> {
    const list = this.getList();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) throw new NotFoundError(`Order ${id} not found`);

    const current = list[idx];

    // Authoritative optimistic-concurrency check: reject stale writes with 409.
    if (expectedVersion !== undefined && current.version !== expectedVersion) {
      throw new VersionConflictError({
        version: current.version,
        lastUpdatedBy: current.lastUpdatedBy,
        lastUpdatedAt: current.lastUpdatedAt
      });
    }

    const next = bumpVersion(current, patch, actor);
    list[idx] = next;
    return next;
  }

  async remove(id: string): Promise<void> {
    const list = this.getList();
    const idx = list.findIndex(o => o.id === id);
    if (idx === -1) throw new NotFoundError(`Order ${id} not found`);
    list.splice(idx, 1);
  }
}
