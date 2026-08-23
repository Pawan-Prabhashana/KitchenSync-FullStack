import { Router } from 'express';
import { listUsers, getUser } from '../controllers/userController';
import { asyncHandler } from '../middleware/validate';

const router = Router();

router.get('/', asyncHandler(listUsers));
router.get('/:id', asyncHandler(getUser));

export default router;
