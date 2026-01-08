import mongoose, { Schema } from 'mongoose';
import { IPrescription } from '../types';

const eyeSchema = new Schema({
  sphere: {
    type: Number,
    min: -20,
    max: 20
  },
  cylinder: {
    type: Number,
    min: -6,
    max: 6
  },
  axis: {
    type: Number,
    min: 0,
    max: 180
  },
  add: {
    type: Number,
    min: 0,
    max: 4
  }
});

const prescriptionSchema = new Schema<IPrescription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['single-vision', 'bifocal', 'progressive'],
      required: true
    },
    rightEye: {
      type: eyeSchema,
      required: true
    },
    leftEye: {
      type: eyeSchema,
      required: true
    },
    pupillaryDistance: {
      type: Number,
      min: 50,
      max: 80
    },
    notes: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;

