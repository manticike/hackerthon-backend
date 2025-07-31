import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { paystackWebhook } from './controllers/paymentController.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Webhook route must come BEFORE express.json()
app.post('/api/paystack/webhook', express.raw({ type: 'application/json' }), paystackWebhook);

// Then parse JSON for all other routes
app.use(express.json());

// Regular API routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/paystack', paymentRoutes);
app.use('/api/orders', orderRoutes);

// Optional health check
app.get('/', (req, res) => {
  res.json('hello, welcome to hackerthon 2025');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
