const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;