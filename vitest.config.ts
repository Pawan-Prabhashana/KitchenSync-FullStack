import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Two test projects share one coverage config:
 *   - server: Node env, Supertest against the Express app (in-memory store — no DB).
 *   - client: jsdom env, React Testing Library.
 * Tests never touch MongoDB: DATA_SOURCE is forced to 'memory' (see server/tests/setup.ts
 * and the `env` below), so CI needs no Atlas/Mongo.
 */
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/*.config.*',
        '**/*.d.ts',
        '**/tests/**',
        '**/test/**',
        '**/*.test.{ts,tsx}',
        'src/types.ts',
        'server/models/types.ts',
        'src/main.tsx',
        'dist/**',
        'coverage/**',
        'node_modules/**'
      ]
    },
    projects: [
      {
        test: {
          name: 'server',
          environment: 'node',
          globals: true,
          include: ['server/**/*.test.ts'],
          setupFiles: ['./server/tests/setup.ts'],
          env: { DATA_SOURCE: 'memory', JWT_SECRET: 'test-secret' }
        }
      },
      {
        plugins: [react()],
        test: {
          name: 'client',
          environment: 'jsdom',
          globals: true,
          include: ['src/**/*.test.{ts,tsx}'],
          setupFiles: ['./src/test/setup.ts']
        }
      }
    ]
  }
});
