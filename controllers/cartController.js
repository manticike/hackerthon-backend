// /controllers/cartController.js

import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js'; // Needed to calculate price

// 1. Get current user's cart
export const getCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId }).populate('items.product');
  if (!cart) return res.status(200).json({ items: [], totalAmount: 0 });

  res.status(200).json(cart);
};

// 2. Add item to cart or update quantity
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ userId });

  const itemSubtotal = product.price * quantity;

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ product: productId, quantity, subtotal: itemSubtotal }],
      totalAmount: itemSubtotal,
    });
  } else {
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].subtotal =
        cart.items[itemIndex].quantity * product.price;
    } else {
      cart.items.push({ product: productId, quantity, subtotal: itemSubtotal });
    }

    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
  }

  await cart.save();
  res.status(200).json(cart);
};

// 3. Update quantity of an item
export const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  item.quantity = quantity;
  item.subtotal = product.price * quantity;
  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  await cart.save();
  res.status(200).json(cart);
};

// 4. Remove item from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  cart.totalAmount = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  await cart.save();
  res.status(200).json(cart);
};

// 5. Clear all items from cart
export const clearCart = async (req, res) => {
  const userId = req.user.id;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = [];
  cart.totalAmount = 0;

  await cart.save();
  res.status(200).json({ message: 'Cart cleared' });
};
