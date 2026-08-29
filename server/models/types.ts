/**
 * Single source of truth for domain types.
 *
 * The backend re-exports the SAME shared types the frontend uses (`src/types.ts`)
 * so the two can never drift. `src/types.ts` is pure types with no runtime or DOM
 * dependencies, which makes importing it directly from the server the
 * lowest-friction option for this Vite setup — no file moves, no build changes.
 */
export * from '../../src/types';

import type { Role, User } from '../../src/types';

/** A user record as stored server-side — the public {@link User} plus its hash. */
export interface StoredUser extends User {
  passwordHash: string;
}

/** Fields needed to register/create a new user. */
export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  avatar?: string;
}

/** The authenticated actor performing a mutation (from the JWT). */
export interface Actor {
  name: string;
  role: Role;
}
