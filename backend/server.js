
const express = require('express');
const dotenv = require('dotenv')
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js")
const productRoutes = require("./routes/productRoutes.js")
const cartRoutes = require("./routes/cartRoutes.js")
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();
app.use(express.json())
connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
    res.send("world")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
});
