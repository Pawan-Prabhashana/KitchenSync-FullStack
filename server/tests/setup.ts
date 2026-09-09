// Force the in-memory store BEFORE any server module (env.ts → dotenv) is imported,
// so tests never connect to MongoDB. dotenv does not override an already-set var.
process.env.DATA_SOURCE = 'memory';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
delete process.env.MONGODB_URI;
