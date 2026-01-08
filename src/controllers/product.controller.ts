import { Response, NextFunction } from 'express';
import { AuthRequest, ProductFilters } from '../types';
import Product from '../models/Product.model';
import Category from '../models/Category.model';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '12',
      sort = 'createdAt',
      order = 'desc',
      category,
      brand,
      frameType,
      frameMaterial,
      lensType,
      gender,
      minPrice,
      maxPrice,
      inStock,
      search
    } = req.query as ProductFilters;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const filter: any = {};

    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    if (brand) filter.brand = new RegExp(brand, 'i');
    if (frameType) filter.frameType = frameType;
    if (frameMaterial) filter.frameMaterial = frameMaterial;
    if (lensType) filter.lensType = lensType;
    if (gender) filter.gender = gender;
    if (inStock === 'true') filter.inStock = true;
    if (inStock === 'false') filter.inStock = false;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sortObj: any = {};
    if (search) {
      sortObj.score = { $meta: 'textScore' };
    }
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('-longDescription'); // Exclude long description from list view

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ inStock: true })
      .sort({ 'ratings.average': -1, 'ratings.count': -1 })
      .limit(8)
      .populate('category', 'name slug')
      .select('-longDescription');

    res.json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by brand
// @route   GET /api/products/brand/:brand
// @access  Public
export const getProductsByBrand = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find({ brand: new RegExp(req.params.brand, 'i') })
      .populate('category', 'name slug')
      .select('-longDescription');

    res.json(products);
  } catch (error) {
    next(error);
  }
};
