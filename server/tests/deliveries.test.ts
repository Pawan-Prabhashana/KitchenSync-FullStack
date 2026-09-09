import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

const app = createApp();
const BRANCH = 'br-colombo';
let token = '';
const auth = () => ({ Authorization: `Bearer ${token}` });

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'priya@kitchensync.com', password: 'kitchen123' });
  token = res.body.token;
});

describe('Deliveries CRUD + concurrency', () => {
  it('creates a delivery (stage Preparing, version 1)', async () => {
    const res = await request(app)
      .post('/api/deliveries')
      .set(auth())
      .send({
        branchId: BRANCH,
        customerName: 'Test Customer',
        address: '1 Test Road, Colombo',
        items: [{ id: 'm2', name: 'Grilled Chicken', quantity: 1 }],
        paymentMethod: 'Cash',
        distanceKm: 3,
        orderTotal: 16
      });
    expect(res.status).toBe(201);
    expect(res.body.stage).toBe('Preparing');
    expect(res.body.version).toBe(1);
    expect(res.body).not.toHaveProperty('_id');
  });

  it('assigns a rider + advances stage, then 409s on a stale version', async () => {
    const created = await request(app)
      .post('/api/deliveries')
      .set(auth())
      .send({
        branchId: BRANCH,
        customerName: 'Conflict Customer',
        address: '2 Test Road',
        items: [{ id: 'm1', name: 'Chicken Fried Rice', quantity: 1 }],
        paymentMethod: 'Card',
        distanceKm: 4
      });
    const id = created.body.id as string;

    const moved = await request(app)
      .patch(`/api/deliveries/${encodeURIComponent(id)}`)
      .set(auth())
      .send({ stage: 'Ready for Pickup', rider: 'Sanjaya Bandara', expectedVersion: 1 });
    expect(moved.status).toBe(200);
    expect(moved.body.stage).toBe('Ready for Pickup');
    expect(moved.body.version).toBe(2);

    const stale = await request(app)
      .patch(`/api/deliveries/${encodeURIComponent(id)}`)
      .set(auth())
      .send({ stage: 'Out for Delivery', expectedVersion: 1 });
    expect(stale.status).toBe(409);
    expect(stale.body.error.code).toBe('VERSION_CONFLICT');
  });
});
