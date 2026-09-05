import { Model } from 'mongoose';
import { CrudRepository } from '../../models/repositories';
import { Actor, Versioned } from '../../models/types';
import { NotFoundError, VersionConflictError } from '../../utils/httpError';
import { bumpVersion } from '../../utils/versioning';

type Staged = Versioned & {
  branchId: string;
  stage: string;
  history: Array<{ id: string; stage: string; timestamp: string; user: string; role: string }>;
};

/** Remove Mongo internals so a lean doc becomes the clean domain object. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function strip<T>(doc: any): T | null {
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  void _id;
  void __v;
  return rest as T;
}

/**
 * Mongoose CRUD repository shared by orders and deliveries. Mirrors
 * `crudRepo.memory.ts` method-for-method, reusing `utils/versioning.ts` for the
 * version bump + history and throwing the same `VersionConflictError` on 409.
 */
export class MongoCrudRepository<T extends Staged> implements CrudRepository<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly model: Model<any>, private readonly label = 'Order') {}

  async findAll(branchId?: string): Promise<T[]> {
    const filter = branchId ? { branchId } : {};
    const docs = await this.model.find(filter).sort({ createdAtTimestamp: -1 }).lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((d: any) => strip<T>(d) as T);
  }

  async findById(id: string): Promise<T | null> {
    const doc = await this.model.findOne({ id }).lean();
    return strip<T>(doc);
  }

  async create(entity: T): Promise<T> {
    await this.model.create(entity);
    return entity; // already the clean domain shape, matching the memory repo
  }

  async update(id: string, patch: Partial<T>, actor: Actor, expectedVersion?: number): Promise<T> {
    const currentDoc = await this.model.findOne({ id }).lean();
    if (!currentDoc) throw new NotFoundError(`${this.label} ${id} not found`);
    const current = strip<T>(currentDoc) as T;

    // Client-supplied optimistic-concurrency check (same 409 as memory).
    if (expectedVersion !== undefined && current.version !== expectedVersion) {
      throw new VersionConflictError({
        version: current.version,
        lastUpdatedBy: current.lastUpdatedBy,
        lastUpdatedAt: current.lastUpdatedAt
      });
    }

    // Compute the next state (bumps version, stamps actor, appends history on
    // stage change) via the SAME helper the memory repo uses.
    const next = bumpVersion(current, patch, actor);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { version: _v, id: _id, ...set } = next as Record<string, unknown> & { version: number; id: string };
    void _v;
    void _id;

    // Atomic guard: only write if the stored version still equals what we read, so
    // a concurrent update between read and write cannot be clobbered.
    const updated = await this.model
      .findOneAndUpdate({ id, version: current.version }, { $set: set, $inc: { version: 1 } }, { new: true })
      .lean();

    if (!updated) {
      const latestDoc = await this.model.findOne({ id }).lean();
      if (!latestDoc) throw new NotFoundError(`${this.label} ${id} not found`);
      const latest = strip<T>(latestDoc) as T;
      throw new VersionConflictError({
        version: latest.version,
        lastUpdatedBy: latest.lastUpdatedBy,
        lastUpdatedAt: latest.lastUpdatedAt
      });
    }

    return strip<T>(updated) as T;
  }

  async remove(id: string): Promise<void> {
    const res = await this.model.findOneAndDelete({ id }).lean();
    if (!res) throw new NotFoundError(`${this.label} ${id} not found`);
  }
}
