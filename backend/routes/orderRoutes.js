const express = require("express");
const { placeOrder, getMyOrders, getSingleOrder, getAllOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
router.get("/:orderId", authMiddleware, getSingleOrder);
router.get("/admin/all", authMiddleware,adminMiddleware, getAllOrders);


module.exports = router;