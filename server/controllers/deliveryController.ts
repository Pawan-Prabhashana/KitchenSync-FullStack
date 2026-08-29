import { Request, Response } from 'express';
import { deliveryRepository } from '../repositories';
import { NotFoundError, ValidationError } from '../utils/httpError';
import { makeDeliveryId, makeHistoryId } from '../utils/ids';
import { nowTime } from '../utils/versioning';
import { DeliveryOrder, DeliveryStage, OrderItem, PaymentMethod, Actor } from '../models/types';

const DELIVERY_STAGES: DeliveryStage[] = [
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered'
];
const PAYMENTS: PaymentMethod[] = ['Cash', 'Card', 'Online'];

function actorFrom(req: Request): Actor {
  const u = req.user!;
  return { name: u.name, role: u.role };
}

/** GET /api/deliveries?branchId=... */
export async function listDeliveries(req: Request, res: Response): Promise<void> {
  const branchId = typeof req.query.branchId === 'string' ? req.query.branchId : undefined;
  res.json(await deliveryRepository.findAll(branchId));
}

/** GET /api/deliveries/:id */
export async function getDelivery(req: Request, res: Response): Promise<void> {
  const order = await deliveryRepository.findById(req.params.id);
  if (!order) throw new NotFoundError(`Delivery ${req.params.id} not found`);
  res.json(order);
}

/** POST /api/deliveries */
export async function createDelivery(req: Request, res: Response): Promise<void> {
  const {
    branchId, customerName, address, distanceKm, items, paymentMethod,
    orderTotal, etaMinutes, specialNotes, riderName
  } = req.body as {
    branchId: string;
    customerName: string;
    address: string;
    distanceKm: number;
    items: OrderItem[];
    paymentMethod: PaymentMethod;
    orderTotal?: number;
    etaMinutes?: number;
    specialNotes?: string;
    riderName?: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    throw new ValidationError('A delivery needs at least one item');
  }
  if (!PAYMENTS.includes(paymentMethod)) {
    throw new ValidationError(`Invalid paymentMethod. Expected one of: ${PAYMENTS.join(', ')}`);
  }

  const now = nowTime();
  const actor = actorFrom(req);
  const distance = Number(distanceKm) || 0;

  const order: DeliveryOrder = {
    id: makeDeliveryId(),
    branchId,
    customerName,
    address,
    distanceKm: distance,
    items,
    specialNotes,
    stage: 'Preparing',
    rider: riderName || undefined,
    paymentMethod,
    orderTotal: orderTotal ?? 0,
    etaMinutes: etaMinutes ?? Math.max(25, Math.round(25 + distance * 2.5)),
    createdAt: now,
    createdAtTimestamp: Date.now(),
    lastUpdatedBy: actor.name,
    lastUpdatedAt: now,
    version: 1,
    history: [{ id: makeHistoryId('dh'), stage: 'Preparing', timestamp: now, user: actor.name, role: actor.role }]
  };

  res.status(201).json(await deliveryRepository.create(order));
}

/** PATCH /api/deliveries/:id — move stage and/or assign rider, with concurrency check. */
export async function updateDelivery(req: Request, res: Response): Promise<void> {
  const { stage, rider, expectedVersion } = req.body as {
    stage?: DeliveryStage;
    rider?: string;
    expectedVersion?: number;
  };

  if (stage !== undefined && !DELIVERY_STAGES.includes(stage)) {
    throw new ValidationError(`Invalid stage. Expected one of: ${DELIVERY_STAGES.join(', ')}`);
  }
  if (stage === undefined && rider === undefined) {
    throw new ValidationError('Provide a `stage` and/or `rider` to update');
  }

  const patch: Partial<DeliveryOrder> = {};
  if (stage !== undefined) {
    patch.stage = stage;
    if (stage === 'Delivered') {
      patch.deliveredAt = nowTime();
      patch.deliveredAtTimestamp = Date.now();
    }
  }
  if (rider !== undefined) patch.rider = rider;

  const updated = await deliveryRepository.update(req.params.id, patch, actorFrom(req), expectedVersion);
  res.json(updated);
}

/** DELETE /api/deliveries/:id */
export async function deleteDelivery(req: Request, res: Response): Promise<void> {
  await deliveryRepository.remove(req.params.id);
  res.status(204).send();
}
