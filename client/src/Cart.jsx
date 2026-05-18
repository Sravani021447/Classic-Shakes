import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://classic-shakes-backend.onrender.com/api";

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
          <button style={styles.menuBtn} onClick={() => navigate("/menu")}>← Back to Menu</button>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>🛒 Your Cart</h2>
        <p style={styles.heroSub}>{cart.length} item(s) in your cart</p>
      </div>

      <div style={styles.content}>
        {message && (
          <div style={{ ...styles.msg, background: message.includes("✅") ? "#f0fdf4" : "#fef2f2", color: message.includes("✅") ? "#16a34a" : "#dc2626", border: message.includes("✅") ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
            {message}
          </div>
        )}
        {cart.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={styles.emptyEmoji}>🛒</span>
            <p style={styles.emptyText}>Your cart is empty!</p>
            <p style={styles.emptySubText}>Add some delicious shakes!</p>
            <button style={styles.shopBtn} onClick={() => navigate("/menu")}>Browse Menu 🥤</button>
          </div>
        ) : (
          <div style={styles.cartLayout}>
            <div style={styles.cartItems}>
              <h3 style={styles.sectionTitle}>Order Items</h3>
              {cart.map(item => (
                <div key={item._id} style={styles.item}>
                  <div style={styles.itemLeft}>
                    <span style={styles.itemEmoji}>🥤</span>
                    <div>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemQty}>Quantity: {item.quantity}</p>
                      <p style={styles.itemUnit}>₹{item.price} each</p>
                    </div>
                  </div>
                  <div style={styles.itemRight}>
                    <span style={styles.itemPrice}>₹{item.price * item.quantity}</span>
                    <button style={styles.removeBtn} onClick={() => onRemove(item._id)}>🗑️ Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.summary}>
              <h3 style={styles.sectionTitle}>Order Summary</h3>
              {cart.map(item => (
                <div key={item._id} style={styles.summaryRow}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div style={styles.divider} />
              <div style={styles.totalRow}>
                <span style={styles.totalText}>Total</span>
                <span style={styles.totalPrice}>₹{total}</span>
              </div>
              <button style={styles.orderBtn} onClick={handleOrder} disabled={loading}>
                {loading ? "Placing Order..." : "Place Order 🎉"}
              </button>
            </div>
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
  content: { maxWidth: "1100px", margin: "0 auto", padding: "2rem" },
  msg: { padding: "1rem", borderRadius: "12px", marginBottom: "1.5rem", fontWeight: "600" },
  emptyCard: { background: "white", borderRadius: "20px", padding: "4rem", textAlign: "center", boxShadow: "0 4px 20px rgba(127,29,29,0.1)" },
  emptyEmoji: { fontSize: "4rem" },
  emptyText: { fontSize: "1.5rem", color: "#991b1b", fontWeight: "700", marginTop: "1rem" },
  emptySubText: { color: "#94a3b8", marginBottom: "1.5rem" },
  shopBtn: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", padding: "0.85rem 2rem", cursor: "pointer", fontWeight: "700", fontSize: "1rem" },
  cartLayout: { display: "grid", gridTemplateColumns: "1fr 350px", gap: "1.5rem" },
  cartItems: { background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(127,29,29,0.1)" },
  sectionTitle: { fontSize: "1.2rem", fontWeight: "800", color: "#991b1b", marginBottom: "1.5rem" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid #fef2f2" },
  itemLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  itemEmoji: { fontSize: "2.5rem" },
  itemName: { fontWeight: "700", color: "#1e293b", marginBottom: "0.25rem" },
  itemQty: { color: "#64748b", fontSize: "0.85rem" },
  itemUnit: { color: "#991b1b", fontSize: "0.85rem", fontWeight: "600" },
  itemRight: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" },
  itemPrice: { fontSize: "1.2rem", fontWeight: "800", color: "#991b1b" },
  removeBtn: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" },
  summary: { background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(127,29,29,0.1)", height: "fit-content" },
  summaryRow: { display: "flex", justifyContent: "space-between", padding: "0.5rem 0", color: "#64748b", fontSize: "0.9rem" },
  divider: { height: "1px", background: "#fecaca", margin: "1rem 0" },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" },
  totalText: { fontSize: "1.1rem", fontWeight: "700", color: "#1e293b" },
  totalPrice: { fontSize: "1.5rem", fontWeight: "900", color: "#991b1b" },
  orderBtn: { width: "100%", padding: "1rem", background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(153,27,27,0.4)" },
};