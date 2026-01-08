import express from 'express';
import {
  getCategories,
  getCategory,
  getCategoriesByParent,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getCategories);
router.get('/parent/:parentId', getCategoriesByParent);
router.get('/:id', getCategory);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;

