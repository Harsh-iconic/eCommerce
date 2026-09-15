const express = require("express");
const { placeOrder, getMyOrders, getSingleOrder } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:orderId", authMiddleware, getSingleOrder);

module.exports = router;