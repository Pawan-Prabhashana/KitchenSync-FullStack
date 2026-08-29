import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/httpError';

/**
 * Centralized error handler. Produces a consistent JSON shape:
 *   { error: { message, code }, ...details }
 * For 409 version conflicts, `details.current` (version, lastUpdatedBy,
 * lastUpdatedAt) is spread onto the response so the client can surface it.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: { message: err.message, code: err.code },
      ...(err.details || {})
    });
    return;
  }

  console.error('[error] Unhandled:', err);
  res.status(500).json({
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' }
  });
}

/** 404 for unmatched routes. */
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: 'Route not found', code: 'ROUTE_NOT_FOUND' } });
}
