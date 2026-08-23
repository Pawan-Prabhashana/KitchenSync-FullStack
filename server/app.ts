import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

/**
 * Builds and returns the Express app WITHOUT calling listen(), so it can be
 * imported directly by tests (Milestone 4) as well as the server entrypoint.
 */
export function createApp() {
  const app = express();

  const allowAll = env.corsOrigins.includes('*');
  app.use(
    cors({
      origin(origin, cb) {
        // Allow non-browser clients (curl/server-to-server) which send no Origin.
        if (!origin || allowAll || env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      credentials: true
    })
  );
  app.use(express.json());

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
