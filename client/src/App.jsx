import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
import Cart from "./Cart";
import Orders from "./Orders";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === "admin") navigate("/admin");
    else navigate("/menu");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
    navigate("/login");
  };

  const addToCart = (shake) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === shake._id);
      if (existing) return prev.map(i => i._id === shake._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...shake, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLogin={handleLogin} />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onLogin={handleLogin} />} />
      <Route path="/menu" element={user ? <Menu user={user} cart={cart} onAdd={addToCart} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
      <Route path="/cart" element={user ? <Cart user={user} cart={cart} onRemove={removeFromCart} onLogout={handleLogout} setCart={setCart} /> : <Login onLogin={handleLogin} />} />
      <Route path="/orders" element={user ? <Orders user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
      <Route path="/admin" element={user?.role === "admin" ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />} />
    </Routes>
  );
}