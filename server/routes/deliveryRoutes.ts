import { Router } from 'express';
import {
  listDeliveries, getDelivery, createDelivery, updateDelivery, deleteDelivery
} from '../controllers/deliveryController';
import { requireFields, asyncHandler } from '../middleware/validate';

const router = Router();

router.get('/', asyncHandler(listDeliveries));
router.get('/:id', asyncHandler(getDelivery));
router.post(
  '/',
  requireFields(['branchId', 'customerName', 'address', 'items', 'paymentMethod']),
  asyncHandler(createDelivery)
);
router.patch('/:id', asyncHandler(updateDelivery));
router.delete('/:id', asyncHandler(deleteDelivery));

export default router;
