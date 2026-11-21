const test = require("node:test");
const assert = require("node:assert/strict");
const validateEnvironment = require("../config/validateEnv");

test("accepts required database and strong token configuration", () => {
  assert.equal(validateEnvironment({
    MONGO_URI: "mongodb://localhost:27017/shopkart",
    JWT_SECRET: "a".repeat(40),
    PORT: "5000",
  }), true);
});

test("rejects missing required configuration", () => {
  assert.throws(() => validateEnvironment({}), /MONGO_URI/);
});

test("rejects weak JWT secrets", () => {
  assert.throws(() => validateEnvironment({
    MONGO_URI: "mongodb://localhost:27017/shopkart",
    JWT_SECRET: "short",
  }), /32 characters/);
});

test("rejects invalid ports", () => {
  assert.throws(() => validateEnvironment({
    MONGO_URI: "mongodb://localhost:27017/shopkart",
    JWT_SECRET: "a".repeat(40),
    PORT: "70000",
  }), /valid TCP port/);
});
