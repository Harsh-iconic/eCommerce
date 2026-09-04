const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const {addToCart, getCart, removeFromCart, updateCartQuantity} = require("../controllers/cartController")

const router = express.Router()

router.post("/", authMiddleware, addToCart)
router.get("/", authMiddleware, getCart)
router.delete("/:productId", authMiddleware, removeFromCart)
router.put("/:productId", authMiddleware, updateCartQuantity)

module.exports = router