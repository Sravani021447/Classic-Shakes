require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.model("User", userSchema);

// Shake Schema
const shakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  ingredients: [String],
  available: { type: Boolean, default: true },
});
const Shake = mongoose.model("Shake", shakeSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  items: [{ shake: String, quantity: Number, price: Number }],
  total: Number,
  status: { type: String, enum: ["Pending", "Preparing", "Delivered"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// Middleware
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Not authorized" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
};

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, error: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "customer" });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: "Invalid email or password" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, error: "Invalid email or password" });
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Shake Routes
app.get("/api/shakes", async (req, res) => {
  const shakes = await Shake.find({ available: true });
  res.json({ success: true, shakes });
});

app.post("/api/shakes", protect, adminOnly, async (req, res) => {
  const shake = await Shake.create(req.body);
  res.json({ success: true, shake });
});

app.put("/api/shakes/:id", protect, adminOnly, async (req, res) => {
  const shake = await Shake.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, shake });
});

app.delete("/api/shakes/:id", protect, adminOnly, async (req, res) => {
  await Shake.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Shake deleted" });
});

// Order Routes
app.post("/api/orders", protect, async (req, res) => {
  const { items, total } = req.body;
  const order = await Order.create({ user: req.user.id, userName: req.user.name, items, total });
  res.json({ success: true, order });
});

app.get("/api/orders/my", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

app.get("/api/orders", protect, adminOnly, async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

app.put("/api/orders/:id", protect, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json({ success: true, order });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));