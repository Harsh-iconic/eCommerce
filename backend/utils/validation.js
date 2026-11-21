const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const isPositiveInteger = (value) =>
  Number.isInteger(Number(value)) && Number(value) > 0;

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const isValidIndianPincode = (value = "") => /^[1-9][0-9]{5}$/.test(String(value).trim());

const validateShippingAddress = (address = {}) => {
  const required = ["name", "phone", "address", "city", "pincode"];
  const missing = required.filter((key) => !String(address[key] ?? "").trim());

  if (missing.length) {
    return { valid: false, message: `Missing shipping details: ${missing.join(", ")}` };
  }

  if (!/^[6-9][0-9]{9}$/.test(String(address.phone).trim())) {
    return { valid: false, message: "Enter a valid 10-digit Indian mobile number" };
  }

  if (!isValidIndianPincode(address.pincode)) {
    return { valid: false, message: "Enter a valid 6-digit PIN code" };
  }

  return { valid: true };
};

const calculateLineTotal = (price, quantity) =>
  Number((Number(price) * Number(quantity)).toFixed(2));

module.exports = {
  isValidObjectId,
  isPositiveInteger,
  normalizeEmail,
  isValidIndianPincode,
  validateShippingAddress,
  calculateLineTotal,
};
