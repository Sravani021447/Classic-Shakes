import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function Orders({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/orders/my`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to fetch orders");
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const statusColor = (status) => {
    if (status === "Delivered") return "#16a34a";
    if (status === "Preparing") return "#d97706";
    return "#2563eb";
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>🥤 Classic Shakes</h1>
        <div style={styles.navRight}>
          <button style={styles.menuBtn} onClick={() => navigate("/menu")}>← Menu</button>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h2 style={styles.title}>📦 My Orders</h2>
        {loading ? (
          <p style={styles.empty}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>No orders yet!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/menu")}>Order Now</button>
          </div>
        ) : (
          <div style={styles.orderList}>
            {orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <span style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span style={{ ...styles.statusBadge, background: statusColor(order.status) }}>
                    {order.status}
                  </span>
                </div>
                <div style={styles.items}>
                  {order.items.map((item, i) => (
                    <div key={i} style={styles.orderItem}>
                      <span>🥤 {item.shake} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.orderFooter}>
                  <span style={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <span style={styles.total}>Total: ₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#fff7ed", fontFamily: "sans-serif" },
  navbar: { background: "#ea580c", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navTitle: { color: "white", fontSize: "1.5rem", fontWeight: "800" },
  navRight: { display: "flex", gap: "1rem" },
  menuBtn: { background: "white", color: "#ea580c", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700" },
  logoutBtn: { background: "#dc2626", color: "white", border: "none", borderRadius: "8px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700" },
  content: { maxWidth: "800px", margin: "0 auto", padding: "2rem" },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#ea580c", marginBottom: "1.5rem" },
  empty: { textAlign: "center", color: "#94a3b8", padding: "3rem" },
  emptyCard: { background: "white", borderRadius: "16px", padding: "3rem", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  emptyText: { fontSize: "1.2rem", color: "#94a3b8", marginBottom: "1rem" },
  shopBtn: { background: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "0.75rem 2rem", cursor: "pointer", fontWeight: "700", fontSize: "1rem" },
  orderList: { display: "flex", flexDirection: "column", gap: "1rem" },
  orderCard: { background: "white", borderRadius: "16px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  orderId: { fontWeight: "700", color: "#1e293b", fontSize: "1rem" },
  statusBadge: { color: "white", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700" },
  items: { borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", padding: "0.75rem 0", marginBottom: "0.75rem" },
  orderItem: { display: "flex", justifyContent: "space-between", padding: "0.3rem 0", color: "#475569" },
  orderFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { color: "#94a3b8", fontSize: "0.85rem" },
  total: { fontWeight: "800", color: "#ea580c", fontSize: "1.1rem" },
};