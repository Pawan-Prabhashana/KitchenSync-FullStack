import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/httpError';

/**
 * Tiny body validator: fails with 400 when any required field is missing,
 * `null`, or an empty string. Enough for this milestone without pulling in a
 * schema library.
 */
export function requireFields(fields: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const missing = fields.filter(f => {
      const v = body[f];
      return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    });
    if (missing.length > 0) {
      next(new ValidationError(`Missing required field(s): ${missing.join(', ')}`, { missing }));
      return;
    }
    next();
  };
}

/** Wraps an async route handler so rejected promises reach the error handler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
