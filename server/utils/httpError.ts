/**
 * Typed HTTP errors thrown by repositories/controllers and translated into
 * consistent JSON by the central error handler.
 */
export class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(400, 'VALIDATION_ERROR', message, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super(401, 'UNAUTHORIZED', message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(404, 'NOT_FOUND', message);
  }
}

/**
 * Optimistic-concurrency failure. Carries the CURRENT server-side version info so
 * the client can surface "just updated by X" without silently overwriting.
 */
export class VersionConflictError extends ApiError {
  constructor(current: { version: number; lastUpdatedBy: string; lastUpdatedAt: string }) {
    super(409, 'VERSION_CONFLICT', 'This record was updated by someone else', { current });
  }
}
