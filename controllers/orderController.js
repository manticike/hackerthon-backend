// /controllers/orderController.js

import Order from '../models/orderModel.js';

// 1. Create a new order
export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { quantity, priceAtPurchase, totalAmount, transactionRef } = req.body;

  if (!quantity || !priceAtPurchase || !totalAmount || !transactionRef) {
    return res.status(400).json({ message: "Missing required order fields" });
  }

  try {
    const order = new Order({
      userId,
      quantity,
      priceAtPurchase,
      totalAmount,
      transactionRef,
      status: "pending", // or 'paid' if you're confirming payment immediately
    });

    await order.save();

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// 2. Get all orders for the logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// 3. Get single order by ID
export const getOrderById = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};