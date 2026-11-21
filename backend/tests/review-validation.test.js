const test = require("node:test");
const assert = require("node:assert/strict");
const { validateReviewInput } = require("../utils/validation");

test("accepts a valid product review", () => {
  assert.deepEqual(validateReviewInput(5, "Excellent quality"), { valid: true });
});

test("rejects ratings outside the one-to-five range", () => {
  for (const rating of [0, 6, 2.5, "stars"]) {
    assert.equal(validateReviewInput(rating, "Good product").valid, false);
  }
});

test("rejects reviews that are too short or too long", () => {
  assert.equal(validateReviewInput(4, "ok").valid, false);
  assert.equal(validateReviewInput(4, "x".repeat(801)).valid, false);
});

test("trims review content before validating", () => {
  assert.equal(validateReviewInput(3, "   ").valid, false);
  assert.equal(validateReviewInput(3, "  Looks good  ").valid, true);
});
