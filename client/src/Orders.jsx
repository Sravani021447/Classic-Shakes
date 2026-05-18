import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://classic-shakes-backend.onrender.com/api";

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
    if (status === "Delivered") return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
    if (status === "Preparing") return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
    return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
  };

  const statusEmoji = (status) => {
    if (status === "Delivered") return "✅";
    if (status === "Preparing") return "👨‍🍳";
    return "⏳";
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>🥤 Classic Shakes</h1>
        <div style={styles.navRight}>
          <button style={styles.menuBtn} onClick={() => navigate("/menu")}>← Back to Menu</button>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>📦 My Orders</h2>
        <p style={styles.heroSub}>Track all your shake orders here!</p>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.empty}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={styles.emptyEmoji}>📦</span>
            <p style={styles.emptyText}>No orders yet!</p>
            <p style={styles.emptySubText}>Order your first shake now!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/menu")}>Order Now 🥤</button>
          </div>
        ) : (
          <div style={styles.orderList}>
            {orders.map(order => {
              const sc = statusColor(order.status);
              return (
                <div key={order._id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <div>
                      <span style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</span>
                      <span style={styles.orderDate}> • {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                      {statusEmoji(order.status)} {order.status}
                    </span>
                  </div>
                  <div style={styles.itemsBox}>
                    {order.items.map((item, i) => (
                      <div key={i} style={styles.orderItem}>
                        <span>🥤 {item.shake} <span style={styles.qty}>x{item.quantity}</span></span>
                        <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div style={styles.orderFooter}>
                    <span style={styles.totalLabel}>Total Amount</span>
                    <span style={styles.totalPrice}>₹{order.total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#fef2f2", fontFamily: "'Segoe UI', sans-serif" },
  navbar: { background: "linear-gradient(135deg, #7f1d1d, #991b1b)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(127,29,29,0.3)" },
  navTitle: { color: "white", fontSize: "1.5rem", fontWeight: "900" },
  navRight: { display: "flex", gap: "0.75rem" },
  menuBtn: { background: "white", color: "#991b1b", border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700" },
  logoutBtn: { background: "#7f1d1d", color: "white", border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700" },
  hero: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", padding: "2rem", textAlign: "center", color: "white" },
  heroTitle: { fontSize: "2rem", fontWeight: "900", marginBottom: "0.25rem" },
  heroSub: { opacity: 0.85 },
  content: { maxWidth: "800px", margin: "0 auto", padding: "2rem" },
  empty: { textAlign: "center", color: "#94a3b8", padding: "3rem" },
  emptyCard: { background: "white", borderRadius: "20px", padding: "4rem", textAlign: "center", boxShadow: "0 4px 20px rgba(127,29,29,0.1)" },
  emptyEmoji: { fontSize: "4rem" },
  emptyText: { fontSize: "1.5rem", color: "#991b1b", fontWeight: "700", marginTop: "1rem" },
  emptySubText: { color: "#94a3b8", marginBottom: "1.5rem" },
  shopBtn: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", padding: "0.85rem 2rem", cursor: "pointer", fontWeight: "700", fontSize: "1rem" },
  orderList: { display: "flex", flexDirection: "column", gap: "1rem" },
  orderCard: { background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(127,29,29,0.1)", border: "1px solid #fecaca" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  orderId: { fontWeight: "800", color: "#1e293b", fontSize: "1rem" },
  orderDate: { color: "#94a3b8", fontSize: "0.85rem" },
  statusBadge: { padding: "0.35rem 1rem", borderRadius: "999px", fontSize: "0.85rem", fontWeight: "700" },
  itemsBox: { background: "#fef2f2", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" },
  orderItem: { display: "flex", justifyContent: "space-between", padding: "0.4rem 0", color: "#475569", fontSize: "0.95rem" },
  qty: { color: "#991b1b", fontWeight: "700" },
  itemPrice: { fontWeight: "600", color: "#991b1b" },
  orderFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { color: "#64748b", fontWeight: "600" },
  totalPrice: { fontSize: "1.3rem", fontWeight: "900", color: "#991b1b" },
};