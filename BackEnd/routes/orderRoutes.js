const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/cart");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

/**
 * PLACE ORDER (COD)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // ✅ VALIDATE SHIPPING ADDRESS
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        message: "All shipping address fields are required"
      });
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        product: item.product._id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity
      };
    });

    // ✅ STOCK CHECK & REDUCE
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.product.name} is out of stock`
        });
      }

      item.product.stock -= item.quantity;
      await item.product.save();
    }

    // ✅ CREATE ORDER
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode
      },
      totalAmount
    });

    // ✅ CLEAR CART
    await Cart.deleteOne({ user: req.user.id });


    res.status(201).json({
      message: "Order placed successfully (Cash on Delivery)",
      order
    });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * USER ORDERS
 */
router.get("/my-orders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * ADMIN - ALL ORDERS
 */
/**
 * ADMIN - ORDERS FOR ADMIN'S PRODUCTS ONLY
 */
router.get("/", protect, admin, async (req, res) => {
  try {
    // 1️⃣ Get admin's product IDs
    const adminProducts = await Product.find(
      { createdBy: req.user.id },
      "_id"
    );

    const productIds = adminProducts.map(p => p._id);

    // 2️⃣ Find orders that include those products
    const orders = await Order.find({
      "items.product": { $in: productIds }
    })
      .populate("items.product", "image")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Admin orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ADMIN - UPDATE STATUS
 */
router.put("/:id/status", protect, admin, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = status;
  await order.save();

  res.json(order);
});


/**
 * USER - REMOVE PRODUCT FROM ORDER
 */
router.delete("/:orderId/item/:productId", protect, async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        message: "Cannot modify this order"
      });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        message: "Product not found in order"
      });
    }

    const removedItem = order.items[itemIndex];

    /* ✅ RESTORE STOCK */
    const product = await Product.findById(productId);
    if (product) {
      product.stock += removedItem.quantity;
      await product.save();
    }

    /* ✅ REMOVE ITEM */
    order.items.splice(itemIndex, 1);

    /* ✅ RECALCULATE TOTAL */
    order.totalAmount = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    /* ✅ DELETE ORDER IF EMPTY */
    if (order.items.length === 0) {
      await order.deleteOne();
      return res.json({
        message: "Order deleted as no products left"
      });
    }

    await order.save();

    res.json({
      message: "Product removed from order",
      order
    });
  } catch (error) {
    console.error("Remove order item error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

