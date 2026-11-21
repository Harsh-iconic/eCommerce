const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const generateToken = require("../utils/genrateToken");

const register = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2 || name.length > 80 || !validator.isEmail(email) || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter a name, valid email and password with at least 8 characters.",
      });
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }
    console.error("REGISTER_ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create your account right now.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!validator.isEmail(email) || !password) {
      return res.status(400).json({ success: false, message: "Enter a valid email and password." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user._id, user.role);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return res.status(500).json({
      success: false,
      message: "Unable to sign in right now.",
    });
  }
};

module.exports = { register, loginUser };
