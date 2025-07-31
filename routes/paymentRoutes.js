import express from "express";
import axios from "axios";

import User from '../models/userModel.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/initiate', protect, async (req, res) => {
    const { amount } = req.body;

    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
         // Checking to see if the user exists
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (!amount) {
        return res.status(400).json({ message: 'Amount is required'});
    }

    const email = user.email;

    // Paystack payload
    const paystackData = {
            email,
            amount: amount * 100
        };

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
    }
    
    catch (error) {
        console.error('Paystack error:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Payment initialization failed',
            error: error.response?.data || error.message
        });
    }
});

export default router;