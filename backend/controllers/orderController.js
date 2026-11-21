const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  isValidObjectId,
  validateShippingAddress,
  calculateLineTotal,
} = require("../utils/validation");
const { canTransitionOrder } = require("../utils/orderStatus");

const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;
  const addressCheck = validateShippingAddress(shippingAddress);

  if (!addressCheck.valid) {
    return res.status(400).json({ success: false, message: addressCheck.message });
  }

  let reservedItems = [];
  let createdOrder = null;

  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty" });
    }

    const productIds = cart.items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((product) => [product._id.toString(), product]));
    const orderItems = [];

    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      if (!product) {
        return res.status(409).json({ success: false, message: "A product in your cart is no longer available" });
      }
      if (product.stock < item.quantity) {
        return res.status(409).json({
          success: false,
          message: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Reserve stock with a conditional update to prevent two buyers overselling the same item.
    for (const item of orderItems) {
      const reservation = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } }
      );
      if (reservation.modifiedCount !== 1) {
        throw new Error("STOCK_CHANGED");
      }
      reservedItems.push(item);
    }

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + calculateLineTotal(item.price, item.quantity),
      0
    );

    createdOrder = await Order.create({
      user: req.user.userId,
      items: orderItems,
      totalAmount: Number(totalAmount.toFixed(2)),
      shippingAddress: {
        name: shippingAddress.name.trim(),
        phone: shippingAddress.phone.trim(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        pincode: shippingAddress.pincode.trim(),
      },
    });

    cart.items = [];
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    // Restore any stock reserved before a later step failed.
    if (createdOrder) {
      await Order.findByIdAndDelete(createdOrder._id).catch(() => {});
    }
    if (reservedItems.length) {
      await Promise.all(
        reservedItems.map((item) =>
          Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
        )
      );
    }

    if (error.message === "STOCK_CHANGED") {
      return res.status(409).json({
        success: false,
        message: "Stock changed while placing your order. Please review your cart.",
      });
    }

    console.error("PLACE ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to place your order right now" });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load your orders" });
  }
};

const getSingleOrder = async (req, res) => {
  const { orderId } = req.params;
  if (!isValidObjectId(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  try {
    const order = await Order.findOne({ _id: orderId, user: req.user.userId })
      .populate("items.product", "name image price");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.json({ success: true, order });
  } catch (error) {
    console.error("GET SINGLE ORDER ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load this order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  if (!isValidObjectId(orderId)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (!canTransitionOrder(order.orderStatus, orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from ${order.orderStatus} to ${orderStatus}`,
      });
    }

    if (orderStatus === "cancelled") {
      await Promise.all(
        order.items.map((item) =>
          Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } })
        )
      );
    }

    order.orderStatus = orderStatus;
    await order.save();
    return res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update order status" });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
};
