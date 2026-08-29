import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import orderRoutes from './orderRoutes';
import deliveryRoutes from './deliveryRoutes';
import userRoutes from './userRoutes';
import { requireAuth } from '../middleware/auth';

const api = Router();

// Public
api.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
api.use('/auth', authRoutes);

// Everything below requires a valid JWT.
api.use(requireAuth);
api.use('/orders', orderRoutes);
api.use('/deliveries', deliveryRoutes);
api.use('/users', userRoutes);

export default api;
