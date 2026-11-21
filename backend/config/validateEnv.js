const validateEnvironment = (env = process.env) => {
  const missing = [];
  if (!env.MONGO_URI) missing.push("MONGO_URI");
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");
  if (env.JWT_SECRET && env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must contain at least 32 characters. Generate a strong random secret.");
  }
  if (env.PORT && (!Number.isInteger(Number(env.PORT)) || Number(env.PORT) < 1 || Number(env.PORT) > 65535)) {
    throw new Error("PORT must be a valid TCP port between 1 and 65535.");
  }
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  return true;
};

module.exports = validateEnvironment;
