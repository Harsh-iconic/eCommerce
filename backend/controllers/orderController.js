const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const placeOrder = async (req, res) => {
    const { shippingAddress } = req.body;

    try {
        // 1. Get user's cart
        const cart = await Cart.findOne({
            user: req.user.userId
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // 2. Check stock and calculate total
        let totalAmount = 0;

        for (const item of cart.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found"
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}`
                });
            }

            totalAmount += item.price * item.quantity;
        }

        // 3. Create order
        const order = await Order.create({
            user: req.user.userId,
            items: cart.items,
            totalAmount,
            shippingAddress
        });

        // 4. Reduce product stock
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(
                item.product,
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            );
        }

        // 5. Clear cart
        cart.items = [];
        await cart.save();

        // 6. Response
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.log("PLACE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId
        })
        .populate("items.product")
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.log("GET ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSingleOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findOne({
            _id: orderId,
            user: req.user.userId
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        console.log("GET SINGLE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.log("GET ALL ORDERS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getMyOrders,
    getSingleOrder,
    getAllOrders
};