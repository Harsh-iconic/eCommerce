import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../services/Api";

const EMPTY_FORM = { name: "", description: "", price: "", category: "", stock: "", image: "" };

const AdminProducts = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/products", { params: { limit: 48 } });
      setProducts(data.products || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load products.");
    }
  };

  useEffect(() => { load(); }, []);

  if (!user || user.role !== "admin") return <Navigate to="/" replace />;

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const reset = () => {
    setForm(EMPTY_FORM);
    setEditingId("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage("Product changes saved.");
      } else {
        await api.post("/products", payload);
        setMessage("Product published.");
      }
      reset();
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save this product.");
    } finally {
      setBusy(false);
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      image: product.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.name}" from the catalogue?`)) return;
    try {
      await api.delete(`/products/${product._id}`);
      setMessage("Product deleted.");
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not delete this product.");
    }
  };

  return (
    <main className="container content-page">
      <div className="admin-page-heading">
        <div><span className="eyebrow">STORE MANAGEMENT</span><h1>Admin studio<span className="period">.</span></h1></div>
        <Link to="/admin/orders" className="button button-dark">Manage orders ↗</Link>
      </div>
      <section className="admin-editor">
        <h2>{editingId ? "Edit product" : "Add a product"}</h2>
        <form onSubmit={submit} className="admin-form">
          <input name="name" required minLength={2} maxLength={120} placeholder="Product name" value={form.name} onChange={change} />
          <input name="category" required placeholder="Category" value={form.category} onChange={change} />
          <input name="price" required type="number" min="0" step="0.01" placeholder="Price (₹)" value={form.price} onChange={change} />
          <input name="stock" required type="number" min="0" step="1" placeholder="Stock" value={form.stock} onChange={change} />
          <input name="image" type="url" placeholder="Image URL (optional)" value={form.image} onChange={change} />
          <textarea name="description" required maxLength={3000} placeholder="Product description" value={form.description} onChange={change} />
          <div className="admin-form-actions">
            <button disabled={busy} className="button button-dark">{busy ? "Saving..." : editingId ? "Save changes" : "Publish product"}</button>
            {editingId && <button type="button" className="button button-outline" onClick={reset}>Cancel edit</button>}
          </div>
        </form>
      </section>
      {message && <p className="notice" role="status">{message}</p>}
      <div className="admin-product-heading"><h2>Catalogue</h2><span>{products.length} products loaded</span></div>
      <div className="orders-list">
        {products.map((product) => (
          <article className="order-card" key={product._id}>
            <div className="admin-product-row">
              <img src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"} alt="" />
              <div><strong>{product.name}</strong><p>₹{Number(product.price).toLocaleString("en-IN")} · {product.stock} in stock · {product.category}</p></div>
            </div>
            <div className="admin-product-actions">
              <button className="text-button" onClick={() => edit(product)}>Edit</button>
              <button className="text-button danger" onClick={() => remove(product)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
};

export default AdminProducts;
