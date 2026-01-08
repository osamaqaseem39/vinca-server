import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Category from '../models/Category.model';

// @desc    Get all categories
// @route   GET /api/categories?parentOnly=true
// @access  Public
export const getCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { parentOnly } = req.query;
    let query: any = { isActive: true };
    
    // If parentOnly is true, only return categories without a parent
    if (parentOnly === 'true') {
      query.parent = { $in: [null, undefined] };
    }
    
    const categories = await Category.find(query).sort({ name: 1 }).populate('parent', 'name slug');
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name slug');

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Get child categories by parent
// @route   GET /api/categories/parent/:parentId
// @access  Public
export const getCategoriesByParent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ 
      isActive: true, 
      parent: req.params.parentId 
    }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, image, parent } = req.body;
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parent
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.body.name) {
      req.body.slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

