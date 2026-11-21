const User = require("../models/User");
const Product = require("../models/Product");
const { isValidObjectId } = require("../utils/validation");

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("wishlist", "name image price category stock");
    if (!user) return res.status(404).json({ success: false, message: "Account not found" });
    return res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to load wishlist" });
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) return res.status(404).json({ success: false, message: "Product not found" });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate("wishlist", "name image price category stock");

    if (!user) return res.status(404).json({ success: false, message: "Account not found" });
    return res.json({ success: true, message: "Saved to your wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to save this item" });
  }
};

const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate("wishlist", "name image price category stock");

    if (!user) return res.status(404).json({ success: false, message: "Account not found" });
    return res.json({ success: true, message: "Removed from your wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);
    return res.status(500).json({ success: false, message: "Unable to update wishlist" });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
