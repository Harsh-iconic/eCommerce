import { useEffect, useState } from "react";
import api from "../services/Api";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusDrafts, setStatusDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/orders/admin/all");
      setOrders(data.orders || []);
      setMessage("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load orders. Admin access is required.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (order) => {
    const nextStatus = statusDrafts[order._id];
    if (!nextStatus || nextStatus === order.orderStatus) return;
    setBusy(order._id);
    setMessage("");
    try {
      await api.put(`/orders/admin/${order._id}/status`, { orderStatus: nextStatus });
      setMessage("Order status updated.");
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not update this order.");
    } finally {
      setBusy("");
    }
  };

  return (
    <main className="container content-page">
      <span className="eyebrow">FULFILMENT DESK</span>
      <h1>Order management<span className="period">.</span></h1>
      {message && <p className="notice" role="status">{message}</p>}
      {loading ? <p>Loading orders...</p> : !orders.length ? <div className="empty-state"><h3>No orders to manage.</h3><p>New customer orders will appear here.</p></div> : (
        <div className="admin-orders-list">
          {orders.map((order) => (
            <article className="admin-order-card" key={order._id}>
              <div className="admin-order-main">
                <span className="eyebrow">#{order._id.slice(-8).toUpperCase()} · {new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                <h3>{order.user?.name || "Customer"}</h3>
                <p>{order.user?.email || "No email"} · {order.items.length} item(s)</p>
                <p>{order.shippingAddress?.address}, {order.shippingAddress?.city} — {order.shippingAddress?.pincode}</p>
                <strong>₹{Number(order.totalAmount).toLocaleString("en-IN")}</strong>
              </div>
              <div className="admin-order-actions">
                <span className={`order-status status-${order.orderStatus}`}>{order.orderStatus}</span>
                <select
                  aria-label={`New status for order ${order._id}`}
                  value={statusDrafts[order._id] || order.orderStatus}
                  onChange={(event) => setStatusDrafts((current) => ({ ...current, [order._id]: event.target.value }))}
                >
                  {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button className="button button-dark button-small" disabled={busy === order._id || (statusDrafts[order._id] || order.orderStatus) === order.orderStatus} onClick={() => updateStatus(order)}>
                  {busy === order._id ? "Saving..." : "Update"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminOrders;
