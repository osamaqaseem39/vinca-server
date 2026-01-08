import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// Validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('frameType').isIn(['full-rim', 'semi-rimless', 'rimless', 'browline', 'cat-eye', 'round', 'square', 'aviator']).withMessage('Invalid frame type'),
  body('frameMaterial').isIn(['acetate', 'metal', 'titanium', 'plastic', 'wood', 'carbon-fiber']).withMessage('Invalid frame material'),
  body('lensType').isIn(['single-vision', 'bifocal', 'progressive', 'reading', 'sunglasses']).withMessage('Invalid lens type'),
  body('gender').isIn(['men', 'women', 'unisex', 'kids']).withMessage('Invalid gender'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
];

export const reviewValidation = [
  body('product').notEmpty().withMessage('Product ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

export const prescriptionValidation = [
  body('type').isIn(['single-vision', 'bifocal', 'progressive']).withMessage('Invalid prescription type'),
  body('rightEye').notEmpty().withMessage('Right eye prescription is required'),
  body('leftEye').notEmpty().withMessage('Left eye prescription is required')
];

