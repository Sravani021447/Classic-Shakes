import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function Cart({ user, cart, onRemove, onLogout, setCart }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  const handleOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const items = cart.map(i => ({ shake: i.name, quantity: i.quantity, price: i.price }));
      await axios.post(`${API}/orders`, { items, total }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("✅ Order placed successfully!");
      setCart([]);
      setTimeout(() => navigate("/orders"), 2000);
    } catch (err) {
      setMessage("❌ Failed to place order");
    }
    setLoading(false);
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
        <h2 style={styles.title}>🛒 Your Cart</h2>
        {message && (
          <div style={{ ...styles.msg, background: message.includes("✅") ? "#f0fdf4" : "#fef2f2", color: message.includes("✅") ? "#16a34a" : "#dc2626" }}>
            {message}
          </div>
        )}
        {cart.length === 0 ? (
          <div style={styles.emptyCard}>
            <p style={styles.emptyText}>Your cart is empty!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/menu")}>Browse Menu</button>
          </div>
        ) : (
          <div style={styles.cartBox}>
            {cart.map(item => (
              <div key={item._id} style={styles.item}>
                <div style={styles.itemLeft}>
                  <span style={styles.itemEmoji}>🥤</span>
                  <div>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    <p style={styles.itemQty}>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div style={styles.itemRight}>
                  <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                  <button style={styles.removeBtn} onClick={() => onRemove(item._id)}>Remove</button>
                </div>
              </div>
            ))}
            <div style={styles.totalBox}>
              <span style={styles.totalText}>Total:</span>
              <span style={styles.totalPrice}>₹{total}</span>
            </div>
            <button style={styles.orderBtn} onClick={handleOrder} disabled={loading}>
              {loading ? "Placing Order..." : "Place Order 🎉"}
            </button>
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
  msg: { padding: "1rem", borderRadius: "8px", marginBottom: "1rem", fontWeight: "600" },
  emptyCard: { background: "white", borderRadius: "16px", padding: "3rem", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  emptyText: { fontSize: "1.2rem", color: "#94a3b8", marginBottom: "1rem" },
  shopBtn: { background: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "0.75rem 2rem", cursor: "pointer", fontWeight: "700", fontSize: "1rem" },
  cartBox: { background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid #f1f5f9" },
  itemLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  itemEmoji: { fontSize: "2rem" },
  itemName: { fontWeight: "700", color: "#1e293b" },
  itemQty: { color: "#64748b", fontSize: "0.9rem" },
  itemRight: { display: "flex", alignItems: "center", gap: "1rem" },
  itemPrice: { fontSize: "1.1rem", fontWeight: "700", color: "#ea580c" },
  removeBtn: { background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "6px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600" },
  totalBox: { display: "flex", justifyContent: "space-between", padding: "1rem 0", marginTop: "0.5rem" },
  totalText: { fontSize: "1.2rem", fontWeight: "700", color: "#1e293b" },
  totalPrice: { fontSize: "1.4rem", fontWeight: "800", color: "#ea580c" },
  orderBtn: { width: "100%", padding: "1rem", background: "#ea580c", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "700", cursor: "pointer", marginTop: "1rem" },
};