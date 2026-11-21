import { Link } from "react-router-dom";

const ProductCard = ({ product, onAdd }) => (
  <article className="product-card">
    <Link to={`/product/${product._id}`} className="product-image-wrap">
      <img src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"} alt={product.name} loading="lazy" />
      <span className="image-tag">{product.stock > 0 ? "IN STOCK" : "SOLD OUT"}</span>
    </Link>
    <div className="product-info">
      <div className="product-meta"><span>{product.category}</span><span>{product.stock > 0 ? "Ready to ship" : "Out of stock"}</span></div>
      <Link to={`/product/${product._id}`} className="product-name">{product.name}</Link>
      <div className="product-bottom"><strong>₹{Number(product.price).toLocaleString("en-IN")}</strong><button className="add-button" disabled={!product.stock} onClick={() => onAdd(product)}>+ Add</button></div>
    </div>
  </article>
);
export default ProductCard;