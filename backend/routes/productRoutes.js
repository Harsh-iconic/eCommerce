const express = require("express")
const { createProduct, getAllProducs, getSingleProduct, updateProduct, deleteProduct } = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router()

// admin only
router.post("/", authMiddleware, adminMiddleware, createProduct)

// Public routes
router.get("/", getAllProducs)

router.get("/:id", getSingleProduct)

// update
router.put("/:id", authMiddleware, adminMiddleware, updateProduct)

// delete
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct)

module.exports = router