// /routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import {
  initiatePayment,
  verifyPayment,
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/initiate', protect, initiatePayment);
router.get('/verify', protect, verifyPayment);

export default router;
