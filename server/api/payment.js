import express from 'express';
import {
  createPayment,
  getPaymentById,
  updatePaymentById,
  deletePaymentById
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', createPayment);
router.get('/:id', getPaymentById);
router.put('/:id', updatePaymentById);
router.delete('/:id', deletePaymentById);

export default router; 