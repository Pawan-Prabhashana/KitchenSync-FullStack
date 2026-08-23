import { Router } from 'express';
import {
  listOrders, getOrder, createOrder, updateOrder, deleteOrder
} from '../controllers/orderController';
import { requireFields, asyncHandler } from '../middleware/validate';

const router = Router();

router.get('/', asyncHandler(listOrders));
router.get('/:id', asyncHandler(getOrder));
router.post('/', requireFields(['branchId', 'tableNumber', 'items']), asyncHandler(createOrder));
router.patch('/:id', asyncHandler(updateOrder));
router.delete('/:id', asyncHandler(deleteOrder));

export default router;
