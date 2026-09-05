import { Request, Response } from 'express';
import { orderRepository } from '../repositories';
import { NotFoundError, ValidationError } from '../utils/httpError';
import { makeOrderId, makeHistoryId } from '../utils/ids';
import { nowTime } from '../utils/versioning';
import { Order, OrderItem, Stage, Actor } from '../models/types';
import { env } from '../config/env';
import { aggregateOrderStats, computeOrderStats } from '../db/stats';

const STAGES: Stage[] = ['New', 'Cooking', 'Ready', 'Served'];

function actorFrom(req: Request): Actor {
  const u = req.user!;
  return { name: u.name, role: u.role };
}

/**
 * GET /api/orders/stats?branchId=... — counts by stage and by chef.
 * Mongo uses a real aggregation pipeline; memory computes the equivalent so the
 * endpoint behaves identically regardless of the data source.
 */
export async function orderStats(req: Request, res: Response): Promise<void> {
  const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : undefined;
  if (env.dataSource === 'mongo') {
    res.json(await aggregateOrderStats(branchId));
  } else {
    res.json(computeOrderStats(await orderRepository.findAll(), branchId));
  }
}

/** GET /api/orders?branchId=... */
export async function listOrders(req: Request, res: Response): Promise<void> {
  const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : undefined;
  res.json(await orderRepository.findAll(branchId));
}

/** GET /api/orders/:id */
export async function getOrder(req: Request, res: Response): Promise<void> {
  const order = await orderRepository.findById(req.params.id);
  if (!order) throw new NotFoundError(`Order ${req.params.id} not found`);
  res.json(order);
}

/** POST /api/orders */
export async function createOrder(req: Request, res: Response): Promise<void> {
  const { branchId, tableNumber, items, specialNotes, waiterName, chefName } = req.body as {
    branchId: string;
    tableNumber: string;
    items: OrderItem[];
    specialNotes?: string;
    waiterName?: string;
    chefName?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('An order needs at least one item');
  }

  const now = nowTime();
  const actor = actorFrom(req);
  const waiter = waiterName || actor.name;

  const order: Order = {
    id: makeOrderId(),
    branchId,
    tableNumber,
    items,
    specialNotes,
    stage: 'New',
    waiter,
    chef: chefName || undefined,
    createdAt: now,
    createdAtTimestamp: Date.now(),
    lastUpdatedBy: waiter,
    lastUpdatedAt: now,
    version: 1,
    history: [{ id: makeHistoryId('h'), stage: 'New', timestamp: now, user: waiter, role: actor.role }]
  };

  res.status(201).json(await orderRepository.create(order));
}

/** PATCH /api/orders/:id — move stage and/or assign chef, with concurrency check. */
export async function updateOrder(req: Request, res: Response): Promise<void> {
  const { stage, chef, expectedVersion } = req.body as {
    stage?: Stage;
    chef?: string;
    expectedVersion?: number;
  };

  if (stage !== undefined && !STAGES.includes(stage)) {
    throw new ValidationError(`Invalid stage. Expected one of: ${STAGES.join(', ')}`);
  }
  if (stage === undefined && chef === undefined) {
    throw new ValidationError('Provide a `stage` and/or `chef` to update');
  }

  const patch: Partial<Order> = {};
  if (stage !== undefined) {
    patch.stage = stage;
    if (stage === 'Served') {
      patch.servedAt = nowTime();
      patch.servedAtTimestamp = Date.now();
    }
  }
  if (chef !== undefined) patch.chef = chef;

  const updated = await orderRepository.update(req.params.id, patch, actorFrom(req), expectedVersion);
  res.json(updated);
}

/** DELETE /api/orders/:id */
export async function deleteOrder(req: Request, res: Response): Promise<void> {
  await orderRepository.remove(req.params.id);
  res.status(204).send();
}
