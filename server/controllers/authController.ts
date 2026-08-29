import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories';
import { signToken } from '../utils/jwt';
import { ApiError, UnauthorizedError, ValidationError } from '../utils/httpError';
import { makeUserId } from '../utils/ids';
import { AuthResponse, Role, StoredUser, User } from '../models/types';

const VALID_ROLES: Role[] = ['waiter', 'chef', 'admin', 'rider'];

function toPublic(u: StoredUser): User {
  const { passwordHash: _hash, ...pub } = u;
  return pub;
}

function issue(user: StoredUser): AuthResponse {
  const publicUser = toPublic(user);
  const token = signToken({ sub: publicUser.id, role: publicUser.role, name: publicUser.name });
  return { token, user: publicUser };
}

/** POST /api/auth/register */
export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body as {
    name: string; email: string; password: string; role: Role;
  };

  if (!VALID_ROLES.includes(role)) {
    throw new ValidationError(`Invalid role. Expected one of: ${VALID_ROLES.join(', ')}`);
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'An account with that email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const stored: StoredUser = {
    id: makeUserId(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role,
    passwordHash
  };
  await userRepository.create(stored);

  res.status(201).json(issue(stored));
}

/** POST /api/auth/login */
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  const user = await userRepository.findByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new UnauthorizedError('Invalid email or password');

  res.json(issue(user));
}

/** GET /api/auth/me (protected) */
export async function me(req: Request, res: Response): Promise<void> {
  // requireAuth guarantees req.user.
  res.json({ user: req.user });
}
