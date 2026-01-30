const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();


/**
 * @route   POST /api/products
 * @desc    Create a new product (Admin only)
 * @access  Private/Admin
 */
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, category, price, description, image, stock } = req.body;

    if (!name || !category || !price || !description || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.create({
      name,
      category,
      price,
      description,
      image,
      stock: stock || 0,
      createdBy: req.user.id
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID (Admin only)
 * @access  Private/Admin
 */

router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, category, price, description, image, stock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.stock = stock != null ? stock : product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID (Admin only)
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

   await Product.findByIdAndDelete(req.params.id);
   
    res.json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * @route   GET /api/products/admin/my-products
 * @desc    Get products created by logged-in admin
 * @access  Private/Admin
 */
router.get("/admin/my-products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Get admin products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
