const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getProductReviews, upsertProductReview } = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/:productId", authMiddleware, upsertProductReview);

module.exports = router;
