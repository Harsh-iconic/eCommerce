import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/Api";
import Reviews from "../components/Reviews";
import WishlistButton from "../components/WishlistButton";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    api.get(`/products/${id}`)
      .then(({ data }) => {
        if (active && data.success) setProduct(data.product);
        else if (active) setError("This product could not be found.");
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Unable to load this product.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const addToCart = async () => {
    if (!localStorage.getItem("token")) return navigate("/login");
    setBusy(true);
    setNotice("");
    try {
      await api.post("/cart", { productId: product._id, quantity });
      setNotice("Added to your bag. Good choice.");
    } catch (err) {
      setNotice(err.response?.data?.message || "Could not add this item to your bag.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <main className="container content-page"><p>Finding the good stuff...</p></main>;
  if (error || !product) return <main className="container empty-state"><h2>We couldn't find that item.</h2><p>{error}</p><Link to="/" className="button button-dark">Back to the shop</Link></main>;

  return (
    <main className="container detail-page">
      <div className="detail-image">
        <img src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000"} alt={product.name} />
      </div>
      <section className="detail-copy">
        <span className="eyebrow">{product.category}</span>
        <h1>{product.name}<span className="period">.</span></h1>
        <p className="price">₹{Number(product.price).toLocaleString("en-IN")}</p>
        <p>{product.description}</p>
        <p className="stock-note">{product.stock > 0 ? `${product.stock} available · Ready to ship` : "Currently out of stock"}</p>
        {product.stock > 0 && <div className="detail-actions">
          <label className="quantity-picker">Quantity
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
              {Array.from({ length: Math.min(product.stock, 10) }, (_, index) => index + 1).map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <button disabled={busy} onClick={addToCart} className="button button-dark">{busy ? "Adding..." : "Add to bag ↗"}</button>
          <WishlistButton productId={product._id} />
        </div>}
        {notice && <p className="notice" role="status">{notice}</p>}
        <div className="detail-assurances"><span>Thoughtful quality</span><span>Secure checkout</span><span>Helpful support</span></div>
        <Link to="/" className="back-link">← Continue exploring</Link>
      </section>
      <div className="product-reviews-wrap"><Reviews productId={product._id} /></div>
    </main>
  );
};

export default ProductDetails;
