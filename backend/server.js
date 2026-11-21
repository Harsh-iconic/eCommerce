require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

const app = express();
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : true;

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/health", (_req, res) =>
  res.json({ success: true, message: "ShopKart API is running." })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found." })
);

app.use((error, _req, res, _next) => {
  console.error("UNHANDLED_ERROR", error);
  const status = error.statusCode || error.status || 500;
  res.status(status).json({
    success: false,
    message: status >= 500 ? "Something went wrong." : error.message,
  });
});

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(PORT, () => console.log(`ShopKart API listening on port ${PORT}`)))
  .catch((error) => {
    console.error("SERVER_START_ERROR", error);
    process.exit(1);
  });

module.exports = app;
