// /controllers/productController.js

import Product from '../models/productModel.js';

// 1. Create a product
export const createProduct = async (req, res) => {
  const { name, price, description, stock, imageUrl } = req.body;

  if (!name || !price || !description || stock == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const product = new Product({
      name,
      price,
      description,
      stock,
      imageUrl: imageUrl || [], // optional
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: "Product creation failed", error: error.message });
  }
};

// 2. Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

// 3. Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// 4. Update a product
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Product update failed", error: error.message });
  }
};

// 5. Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.productId);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Product deletion failed", error: error.message });
  }
};
