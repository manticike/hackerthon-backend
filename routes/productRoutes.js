// /routes/productRoutes.js

import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

import { protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getAllProducts);
router.get('/:productId', getProductById);

// Admin-only
router.post('/', protect, createProduct);
router.put('/:productId', protect, updateProduct);
router.delete('/:productId', protect, deleteProduct);

export default router;
