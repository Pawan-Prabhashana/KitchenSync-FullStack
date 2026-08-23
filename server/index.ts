import { createApp } from './app';
import { env } from './config/env';
import { store, DEMO_PASSWORD } from './repositories/memory/memoryStore';

const app = createApp();

app.listen(env.port, () => {
  console.log(`\n  KitchenSync API listening on http://localhost:${env.port}`);
  console.log(`  CORS origins: ${env.corsOrigins.join(', ')}`);
  console.log(
    `  Seeded ${store.users.length} users, ${store.orders.length} kitchen orders, ${store.deliveries.length} deliveries`
  );
  console.log(`  Demo login: priya@kitchensync.com / ${DEMO_PASSWORD}\n`);
});
