import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  cancelOrder,
  updateOrderStatus
} from '../controllers/order.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', admin, updateOrderStatus);

export default router;

