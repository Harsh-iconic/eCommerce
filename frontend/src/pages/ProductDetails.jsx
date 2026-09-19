import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/Api.js";

const ProductDetails = () => {

    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const getProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);

            if (response.data.success) {
                setProduct(response.data.product);
            }

        } catch (error) {
            console.log("ERROR:", error);
        }
    };

    useEffect(() => {
        getProduct();
    }, [id]);

    if (!product) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                />

                <div>

                    <h1 className="text-3xl font-bold">
                        {product.name}
                    </h1>

                    <p className="text-2xl font-semibold mt-4">
                        ₹{product.price}
                    </p>

                    <p className="text-gray-600 mt-4">
                        {product.description}
                    </p>

                    <p className="mt-4">
                        Category: {product.category}
                    </p>

                    <p className="mt-2">
                        Stock: {product.stock}
                    </p>

                    <button className="mt-6 bg-black text-white px-6 py-3 rounded-md">
                        Add to Cart
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ProductDetails;