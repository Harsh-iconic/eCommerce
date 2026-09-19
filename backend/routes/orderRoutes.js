const express = require("express");
const { placeOrder, getMyOrders, getSingleOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:orderId", authMiddleware, getSingleOrder);
router.put("/admin/:orderId/status",authMiddleware, adminMiddleware, updateOrderStatus);
router.get("/admin/all", authMiddleware,adminMiddleware, getAllOrders);

module.exports = router;