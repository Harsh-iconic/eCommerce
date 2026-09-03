const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.json({
                success: false,
                message: "Product doesn't exist"
            });
        }

        if (product.stock < quantity) {
            return res.json({
                success: false,
                message: "Not enough stock"
            });
        }

        let cart = await Cart.findOne({
            user: req.user.userId
        });

        // Cart doesn't exist
        if (!cart) {
            cart = await Cart.create({
                user: req.user.userId,
                items: [
                    {
                        product: productId,
                        quantity,
                        price: product.price
                    }
                ]
            });

            return res.json({
                success: true,
                message: "Product added to cart",
                cart
            });
        }

        // Check if product already exists
        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();

        res.json({
            success: true,
            message: "Product added to cart",
            cart
        });

    } catch (error) {
        console.log("CART ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.userId
        }).populate("items.product");

        if (!cart) {
            return res.json({
                success: true,
                message: "Cart is empty",
                cart: {
                    items: []
                }
            });
        }

        res.json({
            success: true,
            cart
        });

    } catch (error) {
        console.log("GET CART ERROR:", error);

        res.status(500).json({
        success: false,
        message: error.message
    });
}
};


const removeFromCart = async (req, res) => {
    const { productId } = req.params

    try {
        const cart = await Cart.findOne({
            user: req.user.userId
        })

        if(!cart){
            return res.json({
                success: false,
                message: "Cart not found"
            })
        }

        const itemExists = cart.items.some(
            (item) => item.product.toString() === productId
        )

        if(!itemExists){
            return res.json({
                success: false,
                message: "Product not found in cart"
            })
        }

        cart.items = cart.items.filter(
            (item) => item.product.toString() !== productId
        );

        await cart.save()

        res.json({
            success: true,
            message: " Item remove from cart",
            cart
        })

        

    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {addToCart, getCart, removeFromCart}