import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Register({ onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onLogin(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <div style={styles.logoBox}>
          <span style={styles.logoEmoji}>🥤</span>
        </div>
        <h1 style={styles.brand}>Classic Shakes</h1>
        <p style={styles.tagline}>Join us & sip the happiness ✨</p>
        <div style={styles.features}>
          <div style={styles.feature}>🍓 Strawberry Bliss</div>
          <div style={styles.feature}>🍌 Banana Dream</div>
          <div style={styles.feature}>🍫 Chocolate Heaven</div>
          <div style={styles.feature}>🥭 Mango Magic</div>
        </div>
      </div>
      <div style={styles.right}>
        <div style={styles.card}>
          <h2 style={styles.title}>Create Account! 🎉</h2>
          <p style={styles.subtitle}>Register to enjoy your shakes</p>
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Full Name</label>
              <input style={styles.input} type="text" placeholder="Enter your full name"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email Address</label>
              <input style={styles.input} type="email" placeholder="Enter your email"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input style={styles.input} type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Register As</label>
              <select style={styles.input} value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {error && <p style={styles.error}>❌ {error}</p>}
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Register 🥤"}
            </button>
          </form>
          <p style={styles.link}>
            Already have an account?{" "}
            <a href="/login" style={styles.a}>Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", fontFamily: "'Segoe UI', sans-serif" },
  left: { flex: 1, background: "linear-gradient(160deg, #7f1d1d, #991b1b, #b91c1c)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "3rem", color: "white" },
  logoBox: { width: "100px", height: "100px", background: "rgba(255,255,255,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", backdropFilter: "blur(10px)", border: "2px solid rgba(255,255,255,0.3)" },
  logoEmoji: { fontSize: "3.5rem" },
  brand: { fontSize: "2.8rem", fontWeight: "900", marginBottom: "0.5rem", letterSpacing: "-1px" },
  tagline: { fontSize: "1.1rem", opacity: 0.85, marginBottom: "2.5rem" },
  features: { display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" },
  feature: { background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)", padding: "0.7rem 1.5rem", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "600" },
  right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", padding: "2rem" },
  card: { background: "white", padding: "2.5rem", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(127,29,29,0.15)" },
  title: { fontSize: "1.8rem", fontWeight: "800", color: "#7f1d1d", marginBottom: "0.25rem" },
  subtitle: { color: "#9ca3af", marginBottom: "2rem", fontSize: "0.95rem" },
  field: { marginBottom: "1.2rem" },
  label: { display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#4b5563", marginBottom: "0.4rem" },
  input: { width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "2px solid #fecaca", fontSize: "0.95rem", boxSizing: "border-box", outline: "none", background: "#fff" },
  btn: { width: "100%", padding: "0.9rem", background: "linear-gradient(135deg, #991b1b, #b91c1c)", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "700", cursor: "pointer", marginTop: "0.5rem", boxShadow: "0 4px 15px rgba(153,27,27,0.4)" },
  error: { color: "#ef4444", fontSize: "0.85rem", marginBottom: "0.5rem" },
  link: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "#6b7280" },
  a: { color: "#991b1b", fontWeight: "700", textDecoration: "none" },
};