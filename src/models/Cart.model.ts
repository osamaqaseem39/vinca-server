import mongoose, { Schema } from 'mongoose';
import { ICart, ICartItem } from '../types';

const cartItemSchema = new Schema<ICartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  prescription: {
    type: Schema.Types.ObjectId,
    ref: 'Prescription'
  },
  lensOptions: {
    type: {
      type: String
    },
    coating: {
      type: [String],
      default: []
    },
    tint: {
      type: String
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate total price before saving
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart;

