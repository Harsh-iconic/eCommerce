import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Wishlist from "./pages/Wishlist";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import api from "./services/Api";

const Checkout = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError("");
    try { await api.post("/orders", { shippingAddress: form }); navigate("/orders", { replace: true }); }
    catch (err) { setError(err.response?.data?.message || "Unable to place order. Please check your bag."); }
    finally { setBusy(false); }
  };
  if (!localStorage.getItem("token")) return <Navigate to="/login" replace/>;
  return <main className="form-page"><div className="form-card"><span className="eyebrow">ALMOST YOURS</span><h1>Delivery details<span className="period">.</span></h1><p>Where should we send your order?</p><form onSubmit={submit} className="form-stack">{[["name","Full name","text"],["phone","Phone number","tel"],["address","Street address","text"],["city","City","text"],["pincode","PIN code","text"]].map(([name,label,type])=><label className="field" key={name}>{label}<input required name={name} type={type} value={form[name]} onChange={change} minLength={name==="phone"?10:undefined} /></label>)}{error && <p className="form-error">{error}</p>}<button disabled={busy} className="button button-dark button-full">{busy ? "Placing order..." : "Place order"}</button></form></div></main>;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/orders").then(({data}) => setOrders(data.orders || [])).catch(err => setError(err.response?.data?.message || "Sign in to view your orders.")); }, []);
  if (!localStorage.getItem("token")) return <main className="empty-state"><h2>Your orders live here.</h2><Link className="button button-dark" to="/login">Sign in</Link></main>;
  return <main className="container content-page"><span className="eyebrow">YOUR SHOPPING STORY</span><h1>My orders<span className="period">.</span></h1>{error && <p>{error}</p>}{!orders.length && !error ? <div className="empty-state"><h3>No orders yet.</h3><p>Your next favourite thing is waiting.</p><Link to="/" className="button button-dark">Explore the shop</Link></div> : <div className="orders-list">{orders.map(order=><article className="order-card" key={order._id}><div><span className="eyebrow">ORDER #{order._id.slice(-7).toUpperCase()}</span><h3>₹{Number(order.totalAmount).toLocaleString("en-IN")}</h3><p>{new Date(order.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</p></div><div className="order-status">{order.orderStatus}</div><div>{order.items?.length || 0} item(s)</div></article>)}</div>}</main>;
};


function App() {
  return <BrowserRouter><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/product/:id" element={<ProductDetails/>}/><Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/orders" element={<Orders/>}/><Route path="/admin" element={<AdminProducts/>}/><Route path="/admin/orders" element={<AdminOrders/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="*" element={<main className="empty-state"><h2>Page not found.</h2><Link to="/" className="button button-dark">Back to shop</Link></main>}/></Routes></BrowserRouter>;
}
export default App;