const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateLineTotal } = require("../utils/validation");

test("handles integer prices", () => {
  assert.equal(calculateLineTotal(250, 4), 1000);
});

test("rounds fractional totals consistently", () => {
  assert.equal(calculateLineTotal(10.105, 1), 10.11);
});

test("returns zero for a zero-priced promotional item", () => {
  assert.equal(calculateLineTotal(0, 5), 0);
});
