const test = require("node:test");
const assert = require("node:assert/strict");
const { validateProductInput } = require("../controllers/productController");

test("accepts a complete product with valid price and stock", () => {
  assert.deepEqual(validateProductInput({
    name: "Desk Lamp",
    description: "A simple warm desk lamp.",
    price: 1299,
    category: "Home",
    stock: 8,
  }), []);
});

test("rejects missing required product fields", () => {
  const errors = validateProductInput({ name: "Lamp" });
  assert.ok(errors.some((error) => error.includes("description")));
  assert.ok(errors.some((error) => error.includes("price")));
});

test("rejects negative prices and fractional stock", () => {
  assert.ok(validateProductInput({ price: -1 }, true).length > 0);
  assert.ok(validateProductInput({ stock: 1.5 }, true).length > 0);
});

test("rejects unsupported image URL protocols", () => {
  assert.ok(validateProductInput({ image: "javascript:alert(1)" }, true).length > 0);
  assert.deepEqual(validateProductInput({ image: "https://example.com/item.jpg" }, true), []);
});

test("rejects overly long product descriptions", () => {
  assert.ok(validateProductInput({ description: "x".repeat(3001) }, true).length > 0);
});
