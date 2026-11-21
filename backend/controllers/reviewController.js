const Review = require("../models/Review");
const Product = require("../models/Product");
const { isValidObjectId, validateReviewInput } = require("../utils/validation");

const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const [reviews, summary] = await Promise.all([
      Review.find({ product: productId })
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .limit(100),
      Review.aggregate([
        { $match: { product: require("mongoose").Types.ObjectId.createFromHexString(productId) } },
        { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } },
      ]),
    ]);

    return res.json({
      success: true,
      reviews,
      summary: {
        average: summary[0]?.average ? Number(summary[0].average.toFixed(1)) : 0,
        count: summary[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load product reviews" });
  }
};

const upsertProductReview = async (req, res) => {
  const { productId } = req.params;
  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || "").trim();

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }
  const validation = validateReviewInput(rating, comment);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const product = await Product.exists({ _id: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = await Review.findOneAndUpdate(
      { product: productId, user: req.user.userId },
      { $set: { rating, comment } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate("user", "name");

    return res.status(200).json({
      success: true,
      message: "Your review has been saved",
      review,
    });
  } catch (error) {
    console.error("SAVE REVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to save your review" });
  }
};

module.exports = { getProductReviews, upsertProductReview };
