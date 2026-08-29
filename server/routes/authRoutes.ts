import { Router } from 'express';
import { register, login, me } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { requireFields, asyncHandler } from '../middleware/validate';

const router = Router();

router.post('/register', requireFields(['name', 'email', 'password', 'role']), asyncHandler(register));
router.post('/login', requireFields(['email', 'password']), asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(me));

export default router;
