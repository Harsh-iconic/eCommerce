const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { isPositiveInteger, isValidObjectId, calculateLineTotal } = require("../utils/validation");

const addToCart = async (req, res) => {
  const { productId } = req.body;
  const quantity = req.body.quantity ?? 1;

  try {
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "A valid product ID is required" });
    }
    if (!isPositiveInteger(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    const existingItem = cart?.items.find((item) => item.product.toString() === productId);
    const nextQuantity = Number(quantity) + (existingItem?.quantity || 0);

    if (nextQuantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} item(s) are currently available`,
      });
    }

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [{ product: product._id, quantity: Number(quantity), price: product.price }],
      });
    } else if (existingItem) {
      existingItem.quantity = nextQuantity;
      existingItem.price = product.price;
      await cart.save();
    } else {
      cart.items.push({ product: product._id, quantity: Number(quantity), price: product.price });
      await cart.save();
    }

    await cart.populate("items.product");
    return res.status(200).json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update your cart" });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId }).populate("items.product");
    if (!cart) {
      return res.json({ success: true, cart: { items: [] }, total: 0 });
    }

    // Keep displayed cart prices in sync with the current catalogue and drop deleted products.
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => Boolean(item.product));
    let cartChanged = cart.items.length !== originalLength;
    for (const item of cart.items) {
      if (item.price !== item.product.price) {
        item.price = item.product.price;
        cartChanged = true;
      }
    }
    if (cartChanged) await cart.save();

    const total = cart.items.reduce(
      (sum, item) => sum + calculateLineTotal(item.price, item.quantity),
      0
    );
    return res.json({ success: true, cart, total: Number(total.toFixed(2)) });
  } catch (error) {
    console.error("GET CART ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load your cart" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    if (cart.items.length === initialLength) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    await cart.save();
    await cart.populate("items.product");
    return res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("REMOVE FROM CART ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to remove this item" });
  }
};

const updateCartQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }
    if (!isPositiveInteger(quantity)) {
      return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
    }

    const [cart, product] = await Promise.all([
      Cart.findOne({ user: req.user.userId }),
      Product.findById(productId),
    ]);

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const item = cart.items.find((entry) => entry.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }
    if (Number(quantity) > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} item(s) are currently available`,
      });
    }

    item.quantity = Number(quantity);
    item.price = product.price;
    await cart.save();
    await cart.populate("items.product");
    return res.json({ success: true, message: "Cart quantity updated", cart });
  } catch (error) {
    console.error("UPDATE CART ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update cart quantity" });
  }
};

module.exports = { addToCart, getCart, removeFromCart, updateCartQuantity };
