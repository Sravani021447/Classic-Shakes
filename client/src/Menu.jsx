import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

export default function Menu({ user, cart, onAdd, onLogout }) {
  const [shakes, setShakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShakes = async () => {
      try {
        const res = await axios.get(`${API}/shakes`);
        setShakes(res.data.shakes);
      } catch (err) {
        console.error("Failed to fetch shakes");
      }
      setLoading(false);
    };
    fetchShakes();
  }, []);

  const emojis = ["🍓", "🍌", "🍫", "🥭", "🍑", "🍇", "🥝", "🍒"];

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>🥤 Classic Shakes</h1>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👋 {user.name}</span>
          <button style={styles.cartBtn} onClick={() => navigate("/cart")}>
            🛒 Cart ({cart.reduce((a, i) => a + i.quantity, 0)})
          </button>
          <button style={styles.ordersBtn} onClick={() => navigate("/orders")}>📦 My Orders</button>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Our Signature Shakes 🥤</h2>
        <p style={styles.heroSub}>Freshly made with love, just for you!</p>
      </div>

      <div style={styles.content}>
        {loading ? (
          <p style={styles.empty}>Loading shakes...</p>
        ) : shakes.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>No shakes available yet!</p>
            <p style={styles.emptySubText}>Please check back later 🙏</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {shakes.map((shake, idx) => (
              <div key={shake._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.emoji}>{emojis[idx % emojis.length]}</span>
                  <div style={styles.priceBadge}>₹{shake.price}</div>
                </div>
                <h3 style={styles.shakeName}>{shake.name}</h3>
                <p style={styles.desc}>{shake.description}</p>
                <div style={styles.ingredients}>
                  {shake.ingredients?.map((ing, i) => (
                    <span key={i} style={styles.tag}>{ing}</span>
                  ))}
                </div>
                <button style={styles.addBtn} onClick={() => onAdd(shake)}>
                  + Add to Cart 🛒
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "#fef2f2", fontFamily: "'Segoe UI', sans-serif" },
  navbar: { background: "linear-gradient(135deg, #7f1d1d, #991b1b)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(127,29,29,0.3)" },
  navTitle: { color: "white", fontSize: "1.5rem", fontWeight: "900", letterSpacing: "-0.5px" },
  navRight: { display: "flex", alignItems: "center", gap: "0.75rem" },
  navUser: { color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" },
  cartBtn: { background: "white", color: "#991b1b", border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" },
  ordersBtn: { background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "600", fontSize: "0.9rem" },
  logoutBtn: { background: "#7f1d1d", color: "white", border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700", fontSize: "0.9rem" },
  hero: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", padding: "3rem 2rem", textAlign: "center", color: "white" },
  heroTitle: { fontSize: "2.5rem", fontWeight: "900", marginBottom: "0.5rem", letterSpacing: "-1px" },
  heroSub: { fontSize: "1.1rem", opacity: 0.85 },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" },
  card: { background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "0 4px 20px rgba(127,29,29,0.1)", border: "1px solid #fecaca", transition: "transform 0.2s" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
  emoji: { fontSize: "3rem" },
  priceBadge: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", padding: "0.4rem 1rem", borderRadius: "999px", fontWeight: "800", fontSize: "1.1rem" },
  shakeName: { fontSize: "1.3rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" },
  desc: { color: "#64748b", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: "1.5" },
  ingredients: { display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.2rem" },
  tag: { background: "#fef2f2", color: "#991b1b", padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "600", border: "1px solid #fecaca" },
  addBtn: { width: "100%", padding: "0.85rem", background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 15px rgba(153,27,27,0.3)" },
  empty: { textAlign: "center", color: "#94a3b8", padding: "3rem" },
  emptyBox: { textAlign: "center", padding: "4rem", background: "white", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" },
  emptyText: { fontSize: "1.5rem", color: "#991b1b", fontWeight: "700" },
  emptySubText: { color: "#94a3b8", marginTop: "0.5rem" },
};