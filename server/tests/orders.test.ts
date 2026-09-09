import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();
const BRANCH = 'br-colombo';
let token = '';

async function login() {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'priya@kitchensync.com', password: 'kitchen123' });
  return res.body.token as string;
}

const auth = () => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  token = await login();
});

describe('Orders CRUD + concurrency', () => {
  it('creates an order (stage New, version 1, one history entry)', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set(auth())
      .send({
        branchId: BRANCH,
        tableNumber: 'Table 15',
        items: [{ id: 'm1', name: 'Chicken Fried Rice', quantity: 2 }]
      });
    expect(res.status).toBe(201);
    expect(res.body.stage).toBe('New');
    expect(res.body.version).toBe(1);
    expect(res.body.history).toHaveLength(1);
    expect(res.body.branchId).toBe(BRANCH);
    expect(res.body).not.toHaveProperty('_id');
  });

  it('lists orders scoped to a branch', async () => {
    const res = await request(app).get(`/api/orders?branchId=${BRANCH}`).set(auth());
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((o: { branchId: string }) => o.branchId === BRANCH)).toBe(true);
  });

  it('PATCH advances the stage and bumps the version + history', async () => {
    const created = await request(app)
      .post('/api/orders')
      .set(auth())
      .send({ branchId: BRANCH, tableNumber: 'Table 16', items: [{ id: 'm2', name: 'Grilled Chicken', quantity: 1 }] });
    const id = created.body.id as string;

    const res = await request(app)
      .patch(`/api/orders/${encodeURIComponent(id)}`)
      .set(auth())
      .send({ stage: 'Cooking', expectedVersion: 1 });

    expect(res.status).toBe(200);
    expect(res.body.stage).toBe('Cooking');
    expect(res.body.version).toBe(2);
    expect(res.body.history.length).toBe(2);
  });

  it('returns 409 with current version info on a stale expectedVersion', async () => {
    const created = await request(app)
      .post('/api/orders')
      .set(auth())
      .send({ branchId: BRANCH, tableNumber: 'Table 17', items: [{ id: 'm3', name: 'BBQ Chicken Pizza', quantity: 1 }] });
    const id = created.body.id as string;

    // advance to v2
    await request(app).patch(`/api/orders/${encodeURIComponent(id)}`).set(auth()).send({ stage: 'Cooking', expectedVersion: 1 });
    // replay the now-stale version
    const stale = await request(app)
      .patch(`/api/orders/${encodeURIComponent(id)}`)
      .set(auth())
      .send({ stage: 'Ready', expectedVersion: 1 });

    expect(stale.status).toBe(409);
    expect(stale.body.error.code).toBe('VERSION_CONFLICT');
    expect(stale.body.current.version).toBe(2);
    expect(stale.body.current.lastUpdatedBy).toBeTruthy();
  });

  it('deletes an order (204) and then 404s', async () => {
    const created = await request(app)
      .post('/api/orders')
      .set(auth())
      .send({ branchId: BRANCH, tableNumber: 'Table 18', items: [{ id: 'm5', name: 'Beef Burger', quantity: 1 }] });
    const id = created.body.id as string;

    const del = await request(app).delete(`/api/orders/${encodeURIComponent(id)}`).set(auth());
    expect(del.status).toBe(204);

    const after = await request(app).get(`/api/orders/${encodeURIComponent(id)}`).set(auth());
    expect(after.status).toBe(404);
  });

  it('returns 404 (not 500) for a bogus id', async () => {
    const res = await request(app).get('/api/orders/NOPE-DOES-NOT-EXIST').set(auth());
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});

describe('GET /api/orders/stats', () => {
  it('returns grouped counts by status', async () => {
    const res = await request(app).get(`/api/orders/stats?branchId=${BRANCH}`).set(auth());
    expect(res.status).toBe(200);
    expect(res.body.branchId).toBe(BRANCH);
    expect(typeof res.body.total).toBe('number');
    expect(Array.isArray(res.body.byStatus)).toBe(true);
    // each bucket has a status + numeric count
    expect(res.body.byStatus.every((b: { status: string; count: number }) => typeof b.count === 'number')).toBe(true);
  });
});
