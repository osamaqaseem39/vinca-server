import express from 'express';
import {
  getStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllOrders,
  updateStock
} from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.put('/products/:id/stock', updateStock);

export default router;

