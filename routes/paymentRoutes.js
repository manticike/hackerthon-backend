import express from "express";
import axios from "axios";
import User from '../models/userModel.js';
import Payment from '../models/paymentModel.js'
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/initiate', protect, async (req, res) => {
    const { amount } = req.body;

    const userId = req.user.id;

         // Checking to see if the user exists
    if (!user) {
        return res.status(401).json({ message: 'User not found' });
    }
    if (!amount) {
        return res.status(400).json({ message: 'Amount is required'});
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number'});
    }

    try {
        const user = await User.findById(userId);
    
    const email = user.email;

    // Paystack payload
    const paystackData = {
            email,
            // Paystack expects amount to be in "pesewas" (i.e., GHS x 100)
            amount: Math.round(amount * 100)
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
        res.status(200).json({ authorization_url, reference  });
    }
    
    catch (error) {
        console.error('Paystack error:', error.response?.data || error.message);
        res.status(500).json({
            message: 'Payment initialization failed',
            error: error.response?.data || error.message
        });
    }
});


// Verify payment
router.get('/verify', protect, async (req, res) => {
    const { reference } = req.query;

    if (!reference) {
        return res.status(400).json({ message: 'Missing payment reference'});
    }

    try {
        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const data = response.data.data;

        // Saving the payment details to the database
        const payment = new Payment({
            user: req.user.id,
            reference: data.reference,
            amount: data.amount,
            status: data.channel,
            paid_at: data.paid_at,
            email: data.customer.email
        });

        await payment.save();

        res.status(200).json({
            message: 'Payment verified successfully',
            payment
        });

    } catch (error) {
        console.error('Verification error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Payment verification failded'});
    }
});

export default router;