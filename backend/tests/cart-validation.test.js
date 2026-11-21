const test = require("node:test");
const assert = require("node:assert/strict");
const { isPositiveInteger, calculateLineTotal } = require("../utils/validation");

test("rejects invalid cart quantities before database writes", () => {
  for (const quantity of [undefined, null, 0, -2, 1.2, "nope"]) {
    assert.equal(isPositiveInteger(quantity), false);
  }
});

test("calculates cart line totals from numeric values", () => {
  assert.equal(calculateLineTotal("120.50", "2"), 241);
  assert.equal(calculateLineTotal(0.1, 3), 0.3);
});
