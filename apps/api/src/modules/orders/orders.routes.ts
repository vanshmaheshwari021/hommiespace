import { Router } from 'express';
import { getOrders, getOrderById, createOrder, updateOrderStatus } from './orders.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getOrders);
router.get('/my-orders', requireAuth, getOrders);
router.get('/:id', requireAuth, getOrderById);
router.post('/', requireAuth, createOrder);
router.put('/:id/status', requireAuth, updateOrderStatus);

export default router;
