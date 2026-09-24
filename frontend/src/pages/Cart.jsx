import { useEffect, useState } from "react";
import api from "../services/Api.js";

const Cart = () => {

    const [cart, setCart] = useState(null);
    const [total, setTotal] = useState(0);

    const getCart = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setCart(response.data.cart);
                setTotal(response.data.total);
            }

        } catch (error) {
            console.log("GET CART ERROR:", error);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.put(
                `/cart/${productId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                getCart();
            }

        } catch (error) {
            console.log("UPDATE QUANTITY ERROR:", error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.delete(
                `/cart/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                getCart();
            }

        } catch (error) {
            console.log("REMOVE ITEM ERROR:", error);
        }
    };

    useEffect(() => {
        getCart();
    }, []);

    if (!cart) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Your Cart
            </h1>

            {cart.items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">

                    {cart.items.map((item) => (
                        <div
                            key={item.product._id}
                            className="border rounded-lg p-4 flex items-center justify-between"
                        >

                            <div className="flex items-center gap-4">

                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-24 h-24 object-cover rounded"
                                />

                                <div>
                                    <h2 className="font-semibold">
                                        {item.product.name}
                                    </h2>

                                    <p>
                                        ₹{item.price}
                                    </p>

                                    <div className="flex items-center gap-3 mt-3">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={item.quantity === 1}
                                            className="border px-3 py-1 rounded"
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            className="border px-3 py-1 rounded"
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        onClick={() =>
                                            removeItem(item.product._id)
                                        }
                                        className="text-red-500 mt-3"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                            <p className="font-semibold">
                                ₹{item.price * item.quantity}
                            </p>

                        </div>
                    ))}

                    <div className="text-right text-xl font-bold">
                        Total: ₹{total}
                    </div>

                </div>
            )}

        </div>
    );
};

export default Cart;