import { Request, Response } from 'express';
import { userRepository } from '../repositories';
import { NotFoundError } from '../utils/httpError';

/** GET /api/users — staff list for chef/rider assignment dropdowns (no hashes). */
export async function listUsers(_req: Request, res: Response): Promise<void> {
  res.json(await userRepository.findAll());
}

/** GET /api/users/:id */
export async function getUser(req: Request, res: Response): Promise<void> {
  const user = await userRepository.findById(req.params.id);
  if (!user) throw new NotFoundError(`User ${req.params.id} not found`);
  res.json(user);
}
