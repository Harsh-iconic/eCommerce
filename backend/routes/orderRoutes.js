const express = require("express");
const { placeOrder, getMyOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders)

module.exports = router;