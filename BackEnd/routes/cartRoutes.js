const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * GET cart (logged-in user)
 */

router.get("/", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  res.json(cart || { items: [] });
});



/**
 * ADD product to cart
 */
router.post("/add", protect, async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  await cart.save();
  res.json(cart);
});


/**
 * UPDATE quantity
 */
router.put("/update", protect, async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) return res.status(404).json({ message: "Product not in cart" });

  item.quantity = quantity;
  await cart.save();

  res.json(cart);
});


/**
 * REMOVE product from cart
 */
router.delete("/remove/:productId", protect, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
});

module.exports = router;
