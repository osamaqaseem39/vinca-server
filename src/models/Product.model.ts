import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true
    },
    longDescription: {
      type: String,
      trim: true
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    } as any,
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      min: 0
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one image is required'
      }
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    frameType: {
      type: String,
      enum: ['full-rim', 'semi-rimless', 'rimless', 'browline', 'cat-eye', 'round', 'square', 'aviator'],
      required: true
    },
    frameMaterial: {
      type: String,
      enum: ['acetate', 'metal', 'titanium', 'plastic', 'wood', 'carbon-fiber'],
      required: true
    },
    frameColor: {
      primary: {
        type: String,
        required: true,
        trim: true
      },
      secondary: {
        type: String,
        trim: true
      },
      finish: {
        type: String,
        enum: ['matte', 'glossy', 'satin', 'metallic']
      }
    },
    lensType: {
      type: String,
      enum: ['single-vision', 'bifocal', 'progressive', 'reading', 'sunglasses'],
      required: true
    },
    lensMaterial: {
      type: String,
      enum: ['polycarbonate', 'trivex', 'high-index', 'glass']
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'kids'],
      required: true
    },
    size: {
      eye: {
        type: Number,
        required: true,
        min: 40,
        max: 70
      },
      bridge: {
        type: Number,
        required: true,
        min: 10,
        max: 30
      },
      temple: {
        type: Number,
        required: true,
        min: 120,
        max: 160
      }
    },
    features: {
      type: [String],
      default: []
    },
    specifications: {
      weight: {
        type: String,
        trim: true
      },
      lensWidth: {
        type: String,
        trim: true
      },
      bridgeWidth: {
        type: String,
        trim: true
      },
      templeLength: {
        type: String,
        trim: true
      },
      frameWidth: {
        type: String,
        trim: true
      },
      lensHeight: {
        type: String,
        trim: true
      },
      warranty: {
        type: String,
        trim: true
      }
    },
    careInstructions: {
      type: String,
      trim: true
    },
    whatsIncluded: {
      type: [String],
      default: []
    },
    lensOptions: {
      availableTypes: {
        type: [String],
        default: []
      },
      availableCoatings: {
        type: [String],
        default: []
      },
      availableTints: {
        type: [String],
        default: []
      },
      prescriptionRange: {
        sphere: {
          min: Number,
          max: Number
        },
        cylinder: {
          min: Number,
          max: Number
        }
      }
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
      },
      count: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  {
    timestamps: true
  }
);

// Index for search
productSchema.index({ name: 'text', description: 'text', longDescription: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1, frameType: 1, gender: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;

