import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { productId, quantity, prescription, lensOptions } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (!product.inStock || product.stockQuantity < quantity) {
      res.status(400).json({ message: 'Product out of stock' });
      return;
    }

    let cart = await Cart.findOne({ user: req.user?._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const price = product.discountPrice || product.price;

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].price = price;
      if (prescription) cart.items[existingItemIndex].prescription = prescription;
      if (lensOptions) cart.items[existingItemIndex].lensOptions = lensOptions;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price,
        prescription,
        lensOptions
      });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { quantity, prescription, lensOptions } = req.body;

    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item._id?.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    if (quantity) {
      const product = await Product.findById(cart.items[itemIndex].product);
      if (product && product.stockQuantity < quantity) {
        res.status(400).json({ message: 'Insufficient stock' });
        return;
      }
      cart.items[itemIndex].quantity = quantity;
    }

    if (prescription) cart.items[itemIndex].prescription = prescription;
    if (lensOptions) cart.items[itemIndex].lensOptions = lensOptions;

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item._id?.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    next(error);
  }
};

