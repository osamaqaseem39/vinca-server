import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  dateOfBirth?: Date;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAddress {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  description: string; // Short description for listings
  longDescription?: string; // Detailed description for product page
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  frameType: 'full-rim' | 'semi-rimless' | 'rimless' | 'browline' | 'cat-eye' | 'round' | 'square' | 'aviator';
  frameMaterial: 'acetate' | 'metal' | 'titanium' | 'plastic' | 'wood' | 'carbon-fiber';
  frameColor: string;
  lensType: 'single-vision' | 'bifocal' | 'progressive' | 'reading' | 'sunglasses';
  lensMaterial?: 'polycarbonate' | 'trivex' | 'high-index' | 'glass';
  gender: 'men' | 'women' | 'unisex' | 'kids';
  size: {
    eye: number; // lens width
    bridge: number; // bridge width
    temple: number; // temple length
  };
  features: string[];
  specifications?: {
    weight?: string; // Frame weight in grams
    lensWidth?: string; // Detailed lens width info
    bridgeWidth?: string; // Detailed bridge width info
    templeLength?: string; // Detailed temple length info
    frameWidth?: string; // Total frame width
    lensHeight?: string; // Lens height
    warranty?: string; // Warranty period
  };
  careInstructions?: string; // How to care for the glasses
  whatsIncluded?: string[]; // What comes with the product (case, cloth, etc.)
  lensOptions?: {
    availableTypes?: string[]; // Available lens types
    availableCoatings?: string[]; // Available coatings (anti-reflective, blue light, etc.)
    availableTints?: string[]; // Available tint options
    prescriptionRange?: {
      sphere?: { min: number; max: number };
      cylinder?: { min: number; max: number };
    };
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  _id?: string;
  product: string | IProduct;
  quantity: number;
  prescription?: string;
  lensOptions?: {
    type: string;
    coating: string[];
    tint?: string;
  };
  price: number;
}

export interface ICart extends Document {
  _id: string;
  user: string | IUser;
  items: ICartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPrescription extends Document {
  _id: string;
  user: string | IUser;
  type: 'single-vision' | 'bifocal' | 'progressive';
  rightEye: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    add?: number;
  };
  leftEye: {
    sphere?: number;
    cylinder?: number;
    axis?: number;
    add?: number;
  };
  pupillaryDistance?: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  product: string | IProduct;
  quantity: number;
  price: number;
  prescription?: string;
  lensOptions?: {
    type: string;
    coating: string[];
    tint?: string;
  };
}

export interface IOrder extends Document {
  _id: string;
  user: string | IUser;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: 'card' | 'paypal' | 'cash-on-delivery';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingCost: number;
  tax: number;
  totalPrice: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview extends Document {
  _id: string;
  user: string | IUser;
  product: string | IProduct;
  rating: number;
  title?: string;
  comment?: string;
  verifiedPurchase: boolean;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface ProductFilters extends PaginationQuery {
  category?: string;
  brand?: string;
  frameType?: string;
  frameMaterial?: string;
  lensType?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  search?: string;
}

