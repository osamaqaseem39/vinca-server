import express from 'express';
import {
  getPrescriptions,
  getPrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
  setActivePrescription
} from '../controllers/prescription.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect);

router.get('/', getPrescriptions);
router.get('/:id', getPrescription);
router.post('/', createPrescription);
router.put('/:id', updatePrescription);
router.put('/:id/active', setActivePrescription);
router.delete('/:id', deletePrescription);

export default router;

