require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "ShopKart API is running." }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use((error, _req, res, _next) => {
  console.error("UNHANDLED_ERROR", error);
  res.status(500).json({ success: false, message: "Something went wrong." });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`ShopKart API listening on port ${PORT}`))).catch((error) => {
  console.error("SERVER_START_ERROR", error);
  process.exit(1);
});