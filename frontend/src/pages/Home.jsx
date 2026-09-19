import { useEffect, useState } from "react";
import api from "../services/Api.js";
import ProductCard from "../components/ProductCard";

const Home = () => {

    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        try {
            const response = await api.get("/products");

            console.log("API RESPONSE:", response.data);

            if (response.data.success) {
                setProducts(response.data.products);
            }

        } catch (error) {
            console.log("ERROR:", error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Our Products
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                    />
                ))}

            </div>

        </div>
    );
};

export default Home;