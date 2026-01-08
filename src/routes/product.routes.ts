import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsByBrand,
  adjustInventory,
  getInventorySummary
} from '../controllers/product.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brand/:brand', getProductsByBrand);
router.get('/inventory/summary', protect, admin, getInventorySummary);
router.get('/:id', getProduct);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.patch('/:id/inventory', protect, admin, adjustInventory);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

