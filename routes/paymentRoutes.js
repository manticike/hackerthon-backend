import express from "express";
import axios from "axios";

const router = express.Router();

router.post('/initiate', async (req, res) => {
    const { email, amount } = req.body;

    // Checking to see if the user inputed the right email and amount
    if (!email || !amount) {
        return res.status(400).json({ message: 'Email and amount are required' });
    }

    try {
        const paystackData = {
            email,
            amount: amount * 100
        }

        const response = await axios.post(
           "https://api.paystack.co/transaction/initialize" ,
           paystackData,
           {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 
                'Content-Type': 'application/json'
            }
           }
        );

        const { authorization_url } = response.data.data;
        res.status(200).json({ authorization_url });
    } catch (error) {
        console.error('Paystack error:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Payment initialization failed',
            error: error.response?.data || error.message
        });
    }
});

export default router;