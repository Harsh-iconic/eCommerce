const ProductCard = ({ product }) => {
    return (
        <div className="border rounded-lg p-4">

            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md"
            />

            <h2 className="text-lg font-semibold mt-3">
                {product.name}
            </h2>

            <p className="text-gray-600">
                ₹{product.price}
            </p>

            <p className="text-sm text-gray-500">
                Stock: {product.stock}
            </p>

            <button className="mt-3 w-full bg-black text-white py-2 rounded-md">
                Add to Cart
            </button>

        </div>
    );
};

export default ProductCard;