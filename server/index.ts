import { createApp } from './app';
import { env } from './config/env';
import { DEMO_PASSWORD } from './repositories/memory/memoryStore';
import { connectMongo } from './db/mongoose';
import { seedMongoIfEmpty } from './db/seed';

async function start() {
  let summary: string;

  if (env.dataSource === 'mongo') {
    await connectMongo(env.mongodbUri as string);
    const counts = await seedMongoIfEmpty();
    summary = `MongoDB — ${counts.users} users, ${counts.orders} kitchen orders, ${counts.deliveries} deliveries`;
  } else {
    // The in-memory store seeds itself on import.
    const { store } = await import('./repositories/memory/memoryStore');
    summary = `in-memory — ${store.users.length} users, ${store.orders.length} kitchen orders, ${store.deliveries.length} deliveries`;
  }

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`\n  KitchenSync API listening on http://localhost:${env.port}`);
    console.log(`  CORS origins: ${env.corsOrigins.join(', ')}`);
    console.log(`  Data source: ${summary}`);
    console.log(`  Demo login: priya@kitchensync.com / ${DEMO_PASSWORD}\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
