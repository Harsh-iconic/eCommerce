import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/Api";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get("/wishlist");
      setProducts(data.wishlist || []);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setError("Sign in to keep your favourite finds in one place.");
      setLoading(false);
      return;
    }
    load();
  }, []);

  const remove = async (product) => {
    try {
      await api.delete(`/wishlist/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove this item.");
    }
  };

  const addToCart = async (product) => {
    if (!localStorage.getItem("token")) return navigate("/login");
    try {
      await api.post("/cart", { productId: product._id, quantity: 1 });
      setError(`${product.name} added to your bag.`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not add this item.");
    }
  };

  if (!localStorage.getItem("token")) {
    return <main className="container empty-state"><h2>Your favourites belong here.</h2><p>{error}</p><Link className="button button-dark" to="/login">Sign in</Link></main>;
  }

  return (
    <main className="container content-page">
      <span className="eyebrow">SAVED FOR LATER</span>
      <h1>Your wishlist<span className="period">.</span></h1>
      {error && <p className="notice" role="status">{error}</p>}
      {loading ? <p>Loading your saved finds...</p> : products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <div className="wishlist-item" key={product._id}>
              <ProductCard product={product} onAdd={addToCart} />
              <button className="text-button danger wishlist-remove" onClick={() => remove(product)}>Remove from wishlist</button>
            </div>
          ))}
        </div>
      ) : <div className="empty-state"><h3>Nothing saved just yet.</h3><p>Keep the things you love close by.</p><Link to="/" className="button button-dark">Explore the shop</Link></div>}
    </main>
  );
};

export default Wishlist;
