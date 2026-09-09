import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();

describe('GET /api/health', () => {
  it('returns 200 with status + dataSource (memory in tests)', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.dataSource).toBe('memory');
  });
});

describe('Auth', () => {
  it('registers a user and returns { token, user } without passwordHash', async () => {
    const email = `tester_${Date.now()}@kitchensync.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Tester', email, password: 'kitchen123', role: 'waiter' });

    expect(res.status).toBe(201);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.email).toBe(email);
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('logs in the seeded demo user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'priya@kitchensync.com', password: 'kitchen123' });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe('string');
    expect(res.body.user.name).toBeTruthy();
    expect(res.body.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a wrong password with 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'priya@kitchensync.com', password: 'wrong-password' });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/auth/me returns the user with a token, 401 without', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'priya@kitchensync.com', password: 'kitchen123' });
    const token = login.body.token as string;

    const withToken = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(withToken.status).toBe(200);
    expect(withToken.body.user.email).toBe('priya@kitchensync.com');

    const noToken = await request(app).get('/api/auth/me');
    expect(noToken.status).toBe(401);
  });
});

describe('GET /api/users', () => {
  it('lists staff and never leaks passwordHash', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'priya@kitchensync.com', password: 'kitchen123' });
    const token = login.body.token as string;

    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((u: Record<string, unknown>) => !('passwordHash' in u))).toBe(true);
  });

  it('requires auth (401 without a token)', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });
});
