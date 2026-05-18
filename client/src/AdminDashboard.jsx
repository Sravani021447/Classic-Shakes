import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function AdminDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [shakes, setShakes] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [form, setForm] = useState({ name: "", description: "", price: "", ingredients: "" });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = async () => {
    const res = await axios.get(`${API}/orders`, { headers });
    setOrders(res.data.orders);
  };

  const fetchShakes = async () => {
    const res = await axios.get(`${API}/shakes`);
    setShakes(res.data.shakes);
  };

  useEffect(() => { fetchOrders(); fetchShakes(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`${API}/orders/${id}`, { status }, { headers });
    fetchOrders();
  };

  const addShake = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/shakes`, {
        ...form,
        price: Number(form.price),
        ingredients: form.ingredients.split(",").map(i => i.trim())
      }, { headers });
      setMessage("✅ Shake added successfully!");
      setForm({ name: "", description: "", price: "", ingredients: "" });
      fetchShakes();
    } catch (err) {
      setMessage("❌ Failed to add shake");
    }
  };

  const deleteShake = async (id) => {
    if (!window.confirm("Delete this shake?")) return;
    await axios.delete(`${API}/shakes/${id}`, { headers });
    fetchShakes();
  };

  const statusColor = (status) => {
    if (status === "Delivered") return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
    if (status === "Preparing") return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
    return { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" };
  };

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <h1 style={styles.navTitle}>🥤 Classic Shakes</h1>
        <div style={styles.navRight}>
          <span style={styles.navUser}>👨‍💼 {user.name}</span>
          <span style={styles.badge}>Admin</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>Admin Dashboard 👨‍💼</h2>
        <p style={styles.heroSub}>Manage your shakes and orders</p>
      </div>

      <div style={styles.content}>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>📦</div>
            <div style={styles.statNum}>{orders.length}</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>⏳</div>
            <div style={styles.statNum}>{orders.filter(o => o.status === "Pending").length}</div>
            <div style={styles.statLabel}>Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>👨‍🍳</div>
            <div style={styles.statNum}>{orders.filter(o => o.status === "Preparing").length}</div>
            <div style={styles.statLabel}>Preparing</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>✅</div>
            <div style={styles.statNum}>{orders.filter(o => o.status === "Delivered").length}</div>
            <div style={styles.statLabel}>Delivered</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statEmoji}>🥤</div>
            <div style={styles.statNum}>{shakes.length}</div>
            <div style={styles.statLabel}>Shakes</div>
          </div>
        </div>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(activeTab === "orders" ? styles.activeTab : {}) }}
            onClick={() => setActiveTab("orders")}>📦 All Orders</button>
          <button style={{ ...styles.tab, ...(activeTab === "shakes" ? styles.activeTab : {}) }}
            onClick={() => setActiveTab("shakes")}>🥤 Manage Shakes</button>
        </div>

        {activeTab === "orders" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📦 All Orders</h2>
            {orders.length === 0 ? (
              <div style={styles.emptyBox}>
                <p style={styles.emptyText}>No orders yet!</p>
              </div>
            ) : (
              orders.map(order => {
                const sc = statusColor(order.status);
                return (
                  <div key={order._id} style={styles.orderCard}>
                    <div style={styles.orderHeader}>
                      <div>
                        <span style={styles.orderId}>#{order._id.slice(-6).toUpperCase()}</span>
                        <span style={styles.orderUser}> — {order.userName}</span>
                        <span style={styles.orderDate}> • {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={styles.orderItems}>
                      {order.items.map((item, i) => (
                        <span key={i} style={styles.orderItemTag}>🥤 {item.shake} x{item.quantity}</span>
                      ))}
                    </div>
                    <div style={styles.orderFooter}>
                      <span style={styles.orderTotal}>₹{order.total}</span>
                      <div style={styles.statusBtns}>
                        <button style={styles.pendingBtn} onClick={() => updateStatus(order._id, "Pending")}>⏳ Pending</button>
                        <button style={styles.preparingBtn} onClick={() => updateStatus(order._id, "Preparing")}>👨‍🍳 Preparing</button>
                        <button style={styles.deliveredBtn} onClick={() => updateStatus(order._id, "Delivered")}>✅ Delivered</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "shakes" && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>➕ Add New Shake</h2>
            {message && (
              <div style={{ ...styles.msg, background: message.includes("✅") ? "#f0fdf4" : "#fef2f2", color: message.includes("✅") ? "#16a34a" : "#dc2626" }}>
                {message}
              </div>
            )}
            <form onSubmit={addShake}>
              <div style={styles.formGrid}>
                <div style={styles.field}>
                  <label style={styles.label}>Shake Name</label>
                  <input style={styles.input} placeholder="e.g. Mango Delight" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Price (₹)</label>
                  <input style={styles.input} type="number" placeholder="e.g. 150" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div style={{ ...styles.field, gridColumn: "span 2" }}>
                  <label style={styles.label}>Description</label>
                  <input style={styles.input} placeholder="Short description of shake" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div style={{ ...styles.field, gridColumn: "span 2" }}>
                  <label style={styles.label}>Ingredients (comma separated)</label>
                  <input style={styles.input} placeholder="e.g. Mango, Milk, Sugar, Ice" value={form.ingredients}
                    onChange={e => setForm({ ...form, ingredients: e.target.value })} />
                </div>
              </div>
              <button style={styles.submitBtn} type="submit">➕ Add Shake</button>
            </form>

            <h2 style={{ ...styles.cardTitle, marginTop: "2rem" }}>🥤 All Shakes ({shakes.length})</h2>
            {shakes.length === 0 ? (
              <p style={styles.emptyText}>No shakes added yet!</p>
            ) : (
              shakes.map(shake => (
                <div key={shake._id} style={styles.shakeItem}>
                  <div style={styles.shakeLeft}>
                    <span style={styles.shakeEmoji}>🥤</span>
                    <div>
                      <span style={styles.shakeName}>{shake.name}</span>
                      <p style={styles.shakeDesc}>{shake.description}</p>
                    </div>
                  </div>
                  <div style={styles.shakeRight}>
                    <span style={styles.shakePrice}>₹{shake.price}</span>
                    <button style={styles.deleteBtn} onClick={() => deleteShake(shake._id)}>🗑️ Delete</button>
                  </div>
                </div>
              ))
            )}
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
  navRight: { display: "flex", alignItems: "center", gap: "1rem" },
  navUser: { color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" },
  badge: { background: "rgba(255,255,255,0.2)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "700", border: "1px solid rgba(255,255,255,0.3)" },
  logoutBtn: { background: "#7f1d1d", color: "white", border: "none", borderRadius: "10px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "700" },
  hero: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", padding: "2rem", textAlign: "center", color: "white" },
  heroTitle: { fontSize: "2rem", fontWeight: "900", marginBottom: "0.25rem" },
  heroSub: { opacity: 0.85 },
  content: { maxWidth: "1200px", margin: "0 auto", padding: "2rem" },
  statsRow: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem", marginBottom: "2rem" },
  statCard: { background: "white", borderRadius: "16px", padding: "1.5rem", textAlign: "center", boxShadow: "0 4px 20px rgba(127,29,29,0.08)", border: "1px solid #fecaca" },
  statEmoji: { fontSize: "2rem", marginBottom: "0.5rem" },
  statNum: { fontSize: "2rem", fontWeight: "900", color: "#991b1b" },
  statLabel: { fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.25rem" },
  tabs: { display: "flex", gap: "0.5rem", marginBottom: "1.5rem" },
  tab: { padding: "0.75rem 1.5rem", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", background: "white", color: "#991b1b", fontSize: "0.95rem", border: "1px solid #fecaca" },
  activeTab: { background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none" },
  card: { background: "white", borderRadius: "20px", padding: "2rem", boxShadow: "0 4px 20px rgba(127,29,29,0.08)", border: "1px solid #fecaca" },
  cardTitle: { fontSize: "1.3rem", fontWeight: "800", color: "#991b1b", marginBottom: "1.5rem" },
  emptyBox: { textAlign: "center", padding: "3rem" },
  emptyText: { color: "#94a3b8", fontSize: "1rem" },
  orderCard: { border: "1px solid #fecaca", borderRadius: "16px", padding: "1.25rem", marginBottom: "1rem", background: "#fef2f2" },
  orderHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" },
  orderId: { fontWeight: "800", color: "#1e293b" },
  orderUser: { color: "#64748b" },
  orderDate: { color: "#94a3b8", fontSize: "0.85rem" },
  statusBadge: { padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: "700" },
  orderItems: { display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" },
  orderItemTag: { background: "white", color: "#991b1b", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.85rem", border: "1px solid #fecaca" },
  orderFooter: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  orderTotal: { fontWeight: "900", color: "#991b1b", fontSize: "1.1rem" },
  statusBtns: { display: "flex", gap: "0.5rem" },
  pendingBtn: { background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" },
  preparingBtn: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" },
  deliveredBtn: { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600", fontSize: "0.85rem" },
  msg: { padding: "0.75rem 1rem", borderRadius: "12px", marginBottom: "1rem", fontWeight: "600" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" },
  field: { display: "flex", flexDirection: "column" },
  label: { fontSize: "0.85rem", fontWeight: "600", color: "#4b5563", marginBottom: "0.4rem" },
  input: { padding: "0.85rem 1rem", borderRadius: "12px", border: "2px solid #fecaca", fontSize: "0.95rem", outline: "none" },
  submitBtn: { marginTop: "1.5rem", background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", padding: "0.85rem 2rem", fontWeight: "700", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 15px rgba(153,27,27,0.3)" },
  shakeItem: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: "1px solid #fef2f2" },
  shakeLeft: { display: "flex", alignItems: "center", gap: "1rem" },
  shakeEmoji: { fontSize: "2rem" },
  shakeName: { fontWeight: "700", color: "#1e293b" },
  shakeDesc: { color: "#64748b", fontSize: "0.85rem", marginTop: "0.2rem" },
  shakeRight: { display: "flex", alignItems: "center", gap: "1rem" },
  shakePrice: { fontWeight: "800", color: "#991b1b", fontSize: "1.1rem" },
  deleteBtn: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", borderRadius: "8px", padding: "0.3rem 0.7rem", cursor: "pointer", fontWeight: "600" },
};