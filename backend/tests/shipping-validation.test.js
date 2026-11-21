const test = require("node:test");
const assert = require("node:assert/strict");
const { validateShippingAddress } = require("../utils/validation");

const validAddress = {
  name: "Harsh",
  phone: "9876543210",
  address: "MG Road",
  city: "Indore",
  pincode: "452001",
};

test("accepts a complete delivery address", () => {
  assert.deepEqual(validateShippingAddress(validAddress), { valid: true });
});

test("rejects missing delivery fields", () => {
  const result = validateShippingAddress({ ...validAddress, city: "" });
  assert.equal(result.valid, false);
  assert.match(result.message, /city/);
});

test("rejects invalid mobile and PIN code values", () => {
  assert.equal(validateShippingAddress({ ...validAddress, phone: "123" }).valid, false);
  assert.equal(validateShippingAddress({ ...validAddress, pincode: "000000" }).valid, false);
});
