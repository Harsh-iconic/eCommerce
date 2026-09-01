
const express = require('express');
const dotenv = require('dotenv')
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js")

dotenv.config();

const app = express();
app.use(express.json())
connectDB()

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("world")
})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
});
