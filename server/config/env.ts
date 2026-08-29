import dotenv from 'dotenv';

dotenv.config();

/**
 * Loads and validates server configuration from the environment. Secrets are
 * never hardcoded: in production `JWT_SECRET` MUST be provided. For local dev we
 * fall back to a clearly-labelled throwaway secret and warn loudly, so the API
 * runs out of the box without a `.env` file.
 */
const isProd = process.env.NODE_ENV === 'production';

const DEV_FALLBACK_SECRET = 'dev-only-insecure-secret-change-me';

let jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  if (isProd) {
    throw new Error('JWT_SECRET is required in production but was not set.');
  }
  jwtSecret = DEV_FALLBACK_SECRET;
  console.warn(
    '[env] JWT_SECRET not set — using an insecure dev fallback. Set JWT_SECRET in .env for anything real.'
  );
}

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  /**
   * Allowed CORS origins. Accepts a comma-separated list (e.g. the Vercel
   * production URL + localhost), or `*` to allow any origin (handy for a demo).
   */
  corsOrigins: (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
  isProd
};
