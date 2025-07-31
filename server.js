import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();
connectDB();

const app = express()

app.use(express.json());
app.use('/api/paystack', paymentRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json("hello, welcome to hackerthon 2025");
})

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});