import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { AuthRequest } from '../types';
import Cart from '../models/Cart.model';
import Order from '../models/Order.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

// @desc    Create payment intent
// @route   POST /api/payments/create-intent
// @access  Private
export const createPaymentIntent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Calculate totals
    const subtotal = cart.totalPrice;
    const shippingCost = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const totalPrice = Math.round((subtotal + shippingCost + tax) * 100); // Convert to cents

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: 'usd',
      metadata: {
        userId: req.user?._id?.toString() || '',
        cartId: cart._id.toString()
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: totalPrice / 100
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public (Stripe)
export const stripeWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      res.status(500).json({ message: 'Webhook secret not configured' });
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Update order payment status
        await Order.findOneAndUpdate(
          { paymentIntentId: paymentIntent.id },
          { paymentStatus: 'paid', orderStatus: 'processing' }
        );
        
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        // Update order payment status
        await Order.findOneAndUpdate(
          { paymentIntentId: failedPayment.id },
          { paymentStatus: 'failed' }
        );
        
        console.log('PaymentIntent failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

