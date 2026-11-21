const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const { isValidObjectId } = require("../utils/validation");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validateProductInput = (input, partial = false) => {
  const errors = [];
  const required = ["name", "description", "price", "category", "stock"];
  if (!partial) {
    for (const key of required) {
      if (input[key] === undefined || input[key] === null || input[key] === "") {
        errors.push(`${key} is required`);
      }
    }
  }

  if (input.name !== undefined && (typeof input.name !== "string" || input.name.trim().length < 2 || input.name.trim().length > 120)) {
    errors.push("Name must be between 2 and 120 characters");
  }
  if (input.description !== undefined && (typeof input.description !== "string" || !input.description.trim() || input.description.length > 3000)) {
    errors.push("Description is required and cannot exceed 3000 characters");
  }
  if (input.category !== undefined && (typeof input.category !== "string" || !input.category.trim() || input.category.length > 60)) {
    errors.push("Enter a valid category");
  }
  if (input.price !== undefined && (!Number.isFinite(Number(input.price)) || Number(input.price) < 0)) {
    errors.push("Price must be a non-negative number");
  }
  if (input.stock !== undefined && (!Number.isInteger(Number(input.stock)) || Number(input.stock) < 0)) {
    errors.push("Stock must be a non-negative whole number");
  }
  if (input.image !== undefined && input.image !== "") {
    try {
      const imageUrl = new URL(input.image);
      if (!["http:", "https:"].includes(imageUrl.protocol)) errors.push("Image must use HTTP or HTTPS");
    } catch {
      errors.push("Enter a valid image URL");
    }
  }

  return errors;
};

const createProduct = async (req, res) => {
  const errors = validateProductInput(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  try {
    const product = await Product.create({
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      price: Number(req.body.price),
      category: req.body.category.trim(),
      stock: Number(req.body.stock),
      image: req.body.image || "",
    });
    return res.status(201).json({ success: true, message: "Product created.", product });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to create product." });
  }
};

const getAllProducs = async (req, res) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim().slice(0, 100) : "";
    const category = typeof req.query.category === "string" ? req.query.category.trim().slice(0, 60) : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";
    const filter = {};
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }
    if (category) filter.category = category;

    const sortOptions = {
      newest: { createdAt: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
    };
    const pageNumber = Math.min(100000, Math.max(1, Number.parseInt(req.query.page, 10) || 1));
    const pageSize = Math.min(48, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));

    const [products, total, categories] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
      Product.distinct("category"),
    ]);

    return res.json({
      success: true,
      products,
      categories: categories.sort((a, b) => a.localeCompare(b)),
      pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to load products." });
  }
};

const getSingleProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    console.error("GET_PRODUCT_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to load product." });
  }
};

const updateProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }
  const allowed = ["name", "description", "price", "category", "stock", "image"];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowed.includes(key))
  );
  const errors = validateProductInput(updates, true);
  if (errors.length) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  for (const key of ["name", "description", "category"]) {
    if (typeof updates[key] === "string") updates[key] = updates[key].trim();
  }
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.stock !== undefined) updates.stock = Number(updates.stock);

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    console.error("UPDATE_PRODUCT_ERROR", error);
    return res.status(400).json({ success: false, message: "Invalid product details." });
  }
};

const deleteProduct = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    await Promise.all([
      Cart.updateMany({}, { $pull: { items: { product: product._id } } }),
      User.updateMany({}, { $pull: { wishlist: product._id } }),
    ]);
    return res.json({ success: true, message: "Product deleted and removed from active carts and wishlists." });
  } catch (error) {
    console.error("DELETE_PRODUCT_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to delete product." });
  }
};

module.exports = {
  createProduct,
  getAllProducs,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  validateProductInput,
};
