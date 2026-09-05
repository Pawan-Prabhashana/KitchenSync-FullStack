import { Router } from 'express';
import {
  listOrders, getOrder, createOrder, updateOrder, deleteOrder, orderStats
} from '../controllers/orderController';
import { requireFields, asyncHandler } from '../middleware/validate';

const router = Router();

router.get('/', asyncHandler(listOrders));
// Must precede '/:id' so 'stats' isn't captured as an order id.
router.get('/stats', asyncHandler(orderStats));
router.get('/:id', asyncHandler(getOrder));
router.post('/', requireFields(['branchId', 'tableNumber', 'items']), asyncHandler(createOrder));
router.patch('/:id', asyncHandler(updateOrder));
router.delete('/:id', asyncHandler(deleteOrder));

export default router;
