import { UserRepository } from '../../models/repositories';
import { User, StoredUser } from '../../models/types';
import { UserModel } from '../../db/models/user.model';
import { ApiError } from '../../utils/httpError';

/** Public user shape — strips passwordHash and Mongo internals. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPublic(doc: any): User {
  const { passwordHash, _id, __v, ...rest } = doc;
  void passwordHash;
  void _id;
  void __v;
  return rest as User;
}

/** User repository backed by MongoDB. Mirrors `userRepo.memory.ts`. */
export class MongoUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    const docs = await UserModel.find().lean();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return docs.map((d: any) => toPublic(d));
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findOne({ id }).lean();
    return doc ? toPublic(doc) : null;
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    // Stored emails are lowercased, so an exact lowercase match is case-insensitive
    // in practice. Returns the full record (with hash) for authentication.
    const doc = await UserModel.findOne({ email: email.trim().toLowerCase() }).lean();
    if (!doc) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { _id, __v, ...rest } = doc as any;
    void _id;
    void __v;
    return rest as StoredUser;
  }

  async create(user: StoredUser): Promise<StoredUser> {
    try {
      await UserModel.create(user);
      return user;
    } catch (err) {
      // Turn a duplicate-key (unique email/id) race into the handled 409, not a 500.
      if (err && typeof err === 'object' && (err as { code?: number }).code === 11000) {
        throw new ApiError(409, 'EMAIL_TAKEN', 'An account with that email already exists');
      }
      throw err;
    }
  }
}
