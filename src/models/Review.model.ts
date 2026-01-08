import mongoose, { Schema } from 'mongoose';
import { IReview } from '../types';

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true
    },
    comment: {
      type: String,
      trim: true
    },
    verifiedPurchase: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });
reviewSchema.index({ product: 1, rating: 1 });

// Update product ratings after review save
reviewSchema.post('save', async function () {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const reviews = await Review.find({ product: this.product });
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const count = reviews.length;
  
  await Product.findByIdAndUpdate(this.product, {
    'ratings.average': average,
    'ratings.count': count
  });
});

// Update product ratings after review delete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    const Review = mongoose.model('Review');
    const Product = mongoose.model('Product');
    
    const reviews = await Review.find({ product: doc.product });
    if (reviews.length > 0) {
      const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      const count = reviews.length;
      
      await Product.findByIdAndUpdate(doc.product, {
        'ratings.average': average,
        'ratings.count': count
      });
    } else {
      await Product.findByIdAndUpdate(doc.product, {
        'ratings.average': 0,
        'ratings.count': 0
      });
    }
  }
});

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;

