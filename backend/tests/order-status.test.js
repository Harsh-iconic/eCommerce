const test = require("node:test");
const assert = require("node:assert/strict");
const { canTransitionOrder, ORDER_TRANSITIONS } = require("../utils/orderStatus");

test("allows forward fulfilment transitions", () => {
  assert.equal(canTransitionOrder("pending", "processing"), true);
  assert.equal(canTransitionOrder("processing", "shipped"), true);
  assert.equal(canTransitionOrder("shipped", "delivered"), true);
});

test("allows cancellation only before shipment", () => {
  assert.equal(canTransitionOrder("pending", "cancelled"), true);
  assert.equal(canTransitionOrder("processing", "cancelled"), true);
  assert.equal(canTransitionOrder("shipped", "cancelled"), false);
});

test("prevents terminal and backwards transitions", () => {
  assert.equal(canTransitionOrder("delivered", "processing"), false);
  assert.equal(canTransitionOrder("cancelled", "pending"), false);
  assert.equal(canTransitionOrder("unknown", "delivered"), false);
});

test("keeps the transition map immutable", () => {
  assert.equal(Object.isFrozen(ORDER_TRANSITIONS), true);
});
