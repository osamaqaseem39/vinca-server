import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} from '../controllers/review.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.put('/:id/helpful', protect, markHelpful);
router.delete('/:id', protect, deleteReview);

export default router;

