import { UserRepository } from '../../models/repositories';
import { User, StoredUser } from '../../models/types';
import { store } from './memoryStore';

/** Strip the password hash before a user record leaves the API. */
function toPublic(u: StoredUser): User {
  const { passwordHash: _hash, ...pub } = u;
  return pub;
}

export class MemoryUserRepository implements UserRepository {
  async findAll(): Promise<User[]> {
    return store.users.map(toPublic);
  }

  async findById(id: string): Promise<User | null> {
    const u = store.users.find(x => x.id === id);
    return u ? toPublic(u) : null;
  }

  async findByEmail(email: string): Promise<StoredUser | null> {
    const target = email.trim().toLowerCase();
    return store.users.find(x => x.email.toLowerCase() === target) ?? null;
  }

  async create(user: StoredUser): Promise<StoredUser> {
    store.users.push(user);
    return user;
  }
}
