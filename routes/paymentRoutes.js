// /routes/paymentRoutes.js

import express from "express";
import axios from "axios";
import crypto from "crypto";
import User from "../models/userModel.js";
import Payment from "../models/paymentModel.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 1. Initiate Payment
router.post("/initiate", protect, async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;

  // Validate amount
  if (!amount) {
    return res.status(400).json({ message: "Amount is required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be a positive number" });
  }

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  try {
    const paystackData = {
      email: user.email,
      amount: Math.round(amount * 100), // in pesewas
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { authorization_url, reference } = response.data.data;
    res.status(200).json({ authorization_url, reference });
  } catch (error) {
    console.error("Paystack error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
});

// 2. Verify Payment
router.get("/verify", protect, async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ message: "Missing payment reference" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    const payment = new Payment({
      user: req.user.id,
      reference: data.reference,
      amount: data.amount / 100, // convert back to GHS
      status: data.status,
      paid_at: data.paid_at,
      email: data.customer.email,
    });

    await payment.save();

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// 3. Paystack Webhook Handler
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    const hash = crypto
      .createHmac("sha512", secret)
      .update(req.body)
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    if (hash !== signature) {
      return res.status(401).send("Invalid signature");
    }

    let event;

    try {
      event = JSON.parse(req.body);
    } catch (err) {
      return res.status(400).send("Invalid JSON");
    }

    if (event.event === "charge.success" && event.data.status === "success") {
      const paymentInfo = {
        reference: event.data.reference,
        status: event.data.status,
        amount: event.data.amount / 100,
        email: event.data.customer.email,
        paidAt: event.data.paid_at,
        gatewayResponse: event.data.gateway_response,
      };

      try {
        const user = await User.findOne({ email: paymentInfo.email });

        if (user) {
          const payment = new Payment({
            user: user._id,
            ...paymentInfo,
          });

          await payment.save();
          console.log("✅ Webhook payment saved:", payment);
        }
      } catch (error) {
        console.error("Error saving webhook payment:", error.message);
      }
    }

    res.sendStatus(200); // Always respond OK to Paystack
  }
);

export default router;
