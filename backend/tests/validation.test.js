const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isPositiveInteger,
  normalizeEmail,
  isValidIndianPincode,
  validateShippingAddress,
  calculateLineTotal,
} = require("../utils/validation");

test("accepts only positive integer quantities", () => {
  assert.equal(isPositiveInteger(1), true);
  assert.equal(isPositiveInteger("3"), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger(-1), false);
  assert.equal(isPositiveInteger(1.5), false);
  assert.equal(isPositiveInteger("abc"), false);
});

test("normalizes email addresses", () => {
  assert.equal(normalizeEmail("  USER@Example.COM "), "user@example.com");
});

test("validates Indian PIN codes", () => {
  assert.equal(isValidIndianPincode("462001"), true);
  assert.equal(isValidIndianPincode("062001"), false);
  assert.equal(isValidIndianPincode("12345"), false);
});

test("validates required shipping details and phone number", () => {
  assert.equal(validateShippingAddress({}).valid, false);
  assert.equal(validateShippingAddress({
    name: "A User",
    phone: "9876543210",
    address: "Main Road",
    city: "Indore",
    pincode: "452001",
  }).valid, true);
  assert.equal(validateShippingAddress({
    name: "A User",
    phone: "123",
    address: "Main Road",
    city: "Indore",
    pincode: "452001",
  }).valid, false);
});

test("calculates money values to two decimal places", () => {
  assert.equal(calculateLineTotal(19.99, 3), 59.97);
});
