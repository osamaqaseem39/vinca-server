import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Order from '../models/Order.model';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user?._id })
      .sort({ createdAt: -1 })
      .populate('items.product');

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, paymentIntentId } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    // Check stock availability
    for (const item of cart.items) {
      const product = item.product as any;
      if (!product.inStock || product.stockQuantity < item.quantity) {
        res.status(400).json({ message: `${product.name} is out of stock` });
        return;
      }
    }

    // Calculate totals
    const subtotal = cart.totalPrice;
    const shippingCost = subtotal > 100 ? 0 : 10; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const totalPrice = subtotal + shippingCost + tax;

    // Create order items
    const orderItems = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      prescription: item.prescription,
      lensOptions: item.lensOptions
    }));

    // Create order
    const order = await Order.create({
      user: req.user?._id,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentIntentId,
      paymentStatus: paymentIntentId ? 'paid' : 'pending',
      shippingCost,
      tax,
      totalPrice
    });

    // Update product stock
    for (const item of cart.items) {
      const product = item.product as any;
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await order.populate('items.product');

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    // Can only cancel pending or processing orders
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'processing') {
      res.status(400).json({ message: 'Order cannot be cancelled' });
      return;
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        ...(trackingNumber && { trackingNumber })
      },
      { new: true }
    ).populate('items.product');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

