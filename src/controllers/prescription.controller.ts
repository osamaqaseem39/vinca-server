import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import Prescription from '../models/Prescription.model';

// @desc    Get user's prescriptions
// @route   GET /api/prescriptions
// @access  Private
export const getPrescriptions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescriptions = await Prescription.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private
export const getPrescription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    // Check if user owns the prescription
    if (prescription.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Create prescription
// @route   POST /api/prescriptions
// @access  Private
export const createPrescription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescription = await Prescription.create({
      ...req.body,
      user: req.user?._id
    });

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
export const updatePrescription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    // Check if user owns the prescription
    if (prescription.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const updatedPrescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedPrescription);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
export const deletePrescription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    // Check if user owns the prescription
    if (prescription.user.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await Prescription.findByIdAndDelete(req.params.id);

    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Set active prescription
// @route   PUT /api/prescriptions/:id/active
// @access  Private
export const setActivePrescription = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Set all prescriptions to inactive
    await Prescription.updateMany(
      { user: req.user?._id },
      { isActive: false }
    );

    // Set selected prescription to active
    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!prescription) {
      res.status(404).json({ message: 'Prescription not found' });
      return;
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

