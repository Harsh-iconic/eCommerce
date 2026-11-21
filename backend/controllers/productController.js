const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock = 0, image = "" } = req.body;
    if (!name?.trim() || !description?.trim() || !category?.trim() || !Number.isFinite(Number(price)) || Number(price) <= 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: "Provide valid product details, price and stock." });
    }
    const product = await Product.create({ name: name.trim(), description: description.trim(), price: Number(price), category: category.trim(), stock: Number(stock), image });
    return res.status(201).json({ success: true, message: "Product created.", product });
  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to create product." });
  }
};

const getAllProducs = async (req, res) => {
  try {
    const { search = "", category = "", sort = "newest", page = 1, limit = 12 } = req.query;
    const filter = {};
    if (search.trim()) filter.$or = [{ name: { $regex: search.trim(), $options: "i" } }, { description: { $regex: search.trim(), $options: "i" } }];
    if (category.trim()) filter.category = category.trim();
    const sortOptions = { newest: { createdAt: -1 }, "price-low": { price: 1 }, "price-high": { price: -1 } };
    const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
    const pageSize = Math.min(48, Math.max(1, Number.parseInt(limit, 10) || 12));
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOptions[sort] || sortOptions.newest).skip((pageNumber - 1) * pageSize).limit(pageSize),
      Product.countDocuments(filter)
    ]);
    const categories = await Product.distinct("category");
    return res.json({ success: true, products, categories, pagination: { page: pageNumber, limit: pageSize, total, pages: Math.ceil(total / pageSize) } });
  } catch (error) {
    console.error("GET_PRODUCTS_ERROR", error);
    return res.status(500).json({ success: false, message: "Unable to load products." });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }
};

const updateProduct = async (req, res) => {
  try {
    const allowed = ["name", "description", "price", "category", "stock", "image"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid product details." });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found." });
    return res.json({ success: true, message: "Product deleted." });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid product ID." });
  }
};

module.exports = { createProduct, getAllProducs, getSingleProduct, updateProduct, deleteProduct };