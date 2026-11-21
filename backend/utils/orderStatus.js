const ORDER_TRANSITIONS = Object.freeze({
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
});

const canTransitionOrder = (currentStatus, nextStatus) =>
  Boolean(ORDER_TRANSITIONS[currentStatus]?.includes(nextStatus));

module.exports = { ORDER_TRANSITIONS, canTransitionOrder };
