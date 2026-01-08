import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import User from '../models/User.model';
import Product from '../models/Product.model';
import Order from '../models/Order.model';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user', 'name email')
        .populate('items.product', 'name'),
      Product.find({ stockQuantity: { $lte: 10 } })
        .select('name stockQuantity sku')
    ]);

    const stats = {
      users: {
        total: totalUsers,
        newThisMonth: await User.countDocuments({
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        })
      },
      products: {
        total: totalProducts,
        inStock: await Product.countDocuments({ inStock: true }),
        outOfStock: await Product.countDocuments({ inStock: false })
      },
      orders: {
        total: totalOrders,
        pending: await Order.countDocuments({ orderStatus: 'pending' }),
        processing: await Order.countDocuments({ orderStatus: 'processing' }),
        shipped: await Order.countDocuments({ orderStatus: 'shipped' }),
        delivered: await Order.countDocuments({ orderStatus: 'delivered' })
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
        thisMonth: await Order.aggregate([
          {
            $match: {
              paymentStatus: 'paid',
              createdAt: { $gte: new Date(new Date().setDate(1)) }
            }
          },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]).then((result) => result[0]?.total || 0)
      },
      recentOrders,
      lowStockProducts
    };

    res.json(stats);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Update role if provided
    if (role && (role === 'user' || role === 'admin')) {
      user.role = role;
      await user.save();
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const filter: any = {};
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product stock
// @route   PUT /api/admin/products/:id/stock
// @access  Private/Admin
export const updateStock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { stockQuantity } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        stockQuantity,
        inStock: stockQuantity > 0
      },
      { new: true }
    );

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

