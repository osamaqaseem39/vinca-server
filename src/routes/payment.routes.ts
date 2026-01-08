import express from 'express';
import { createPaymentIntent } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);

export default router;

