const express = require("express")
const { register, loginUser } = require("../controllers/authControllers")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")

const router = express.Router()

router.post("/register", register)
router.post("/login", loginUser)
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "You can access this protected route",
        user: req.user,
    })
})

router.get("/admin",authMiddleware, adminMiddleware, (req, res) => {
    res.json(({
        message: "Welcom admin",
    }))
})

module.exports = router