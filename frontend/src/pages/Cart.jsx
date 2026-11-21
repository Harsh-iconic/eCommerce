import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/Api";

const Cart = () => {
  const [cart,setCart] = useState(null);
  const [total,setTotal] = useState(0);
  const [error,setError] = useState("");
  const [busy,setBusy] = useState("");
  const navigate = useNavigate();
  const getCart = async () => {
    try { const {data} = await api.get("/cart"); setCart(data.cart || {items:[]}); setTotal(data.total || 0); setError(""); }
    catch(err) { setError(err.response?.data?.message || "Please sign in to view your bag."); setCart({items:[]}); }
  };
  const updateQuantity = async (id,quantity) => {
    setBusy(id);
    try { await api.put(`/cart/${id}`,{quantity}); await getCart(); }
    catch(err) { setError(err.response?.data?.message || "Could not update quantity."); }
    finally { setBusy(""); }
  };
  const removeItem = async id => {
    setBusy(id);
    try { await api.delete(`/cart/${id}`); await getCart(); }
    catch(err) { setError(err.response?.data?.message || "Could not remove item."); }
    finally { setBusy(""); }
  };
  useEffect(()=>{ if(!localStorage.getItem("token")) {setError("Sign in to see the items in your bag.");setCart({items:[]});} else getCart(); },[]);
  return <main className="container cart-page"><span className="eyebrow">THE GOOD FINDS YOU PICKED</span><h1>Your bag<span className="period">.</span></h1>{error && <div className="notice">{error} {!localStorage.getItem("token") && <Link to="/login"> Sign in</Link>}</div>}{!cart ? <p>Loading your bag...</p> : !cart.items.length ? <div className="empty-state"><h3>Your bag is taking a little break.</h3><p>Find something lovely to bring home.</p><Link to="/" className="button button-dark">Explore the shop</Link></div> : <><div>{cart.items.map(item=><article className="cart-row" key={item.product?._id}><div className="cart-row-main"><img src={item.product?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"} alt={item.product?.name || "Product"}/><div><strong>{item.product?.name || "Unavailable product"}</strong><p>₹{Number(item.price).toLocaleString("en-IN")}</p><div className="quantity-control"><button disabled={busy===item.product?._id || item.quantity<=1} onClick={()=>updateQuantity(item.product._id,item.quantity-1)}>−</button><span>{item.quantity}</span><button disabled={busy===item.product?._id || item.quantity >= (item.product?.stock || 99)} onClick={()=>updateQuantity(item.product._id,item.quantity+1)}>+</button></div><button className="text-button danger" onClick={()=>removeItem(item.product._id)}>Remove</button></div></div><strong>₹{(item.price*item.quantity).toLocaleString("en-IN")}</strong></article>)}</div><div className="cart-summary"><p>Subtotal</p><strong>₹{Number(total).toLocaleString("en-IN")}</strong><p className="muted">Shipping and taxes are calculated at checkout.</p><button className="button button-dark" onClick={()=>navigate("/checkout")}>Continue to checkout ↗</button></div></>}</main>;
};
export default Cart;