import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import orderRoutes from './orderRoutes';
import deliveryRoutes from './deliveryRoutes';
import userRoutes from './userRoutes';
import { requireAuth } from '../middleware/auth';
import { env } from '../config/env';
import { isMongoConnected } from '../db/mongoose';

const api = Router();

// Public — reports the data source and (for mongo) the live connection state.
api.get('/health', (_req: Request, res: Response) =>
  res.json({
    status: 'ok',
    dataSource: env.dataSource,
    db: env.dataSource === 'mongo' ? (isMongoConnected() ? 'connected' : 'disconnected') : 'memory'
  })
);
api.use('/auth', authRoutes);

// Everything below requires a valid JWT.
api.use(requireAuth);
api.use('/orders', orderRoutes);
api.use('/deliveries', deliveryRoutes);
api.use('/users', userRoutes);

export default api;
