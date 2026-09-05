import mongoose from 'mongoose';

/**
 * Connect to MongoDB via Mongoose. Idempotent: if a connection is already open
 * (or opening) it resolves without opening a second one, so repeated calls during
 * tests or hot-reload are safe.
 */
export async function connectMongo(uri: string): Promise<void> {
  // 1 = connected, 2 = connecting
  if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) return;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('  MongoDB connected');
  } catch (err) {
    console.error('  MongoDB connection FAILED:', err instanceof Error ? err.message : err);
    throw err;
  }
}

/** Close the connection (clean shutdown / tests). */
export async function disconnectMongo(): Promise<void> {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

/** True when a live MongoDB connection is open (used by the health check). */
export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
