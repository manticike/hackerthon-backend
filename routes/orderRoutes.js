// /routes/orderRoutes.js

import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/orderController.js';

import { protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require login

// Create order
router.post('/', createOrder);

// Get user's orders
router.get('/my-orders', getUserOrders);

// Get order by ID
router.get('/:orderId', getOrderById);

export default router;
