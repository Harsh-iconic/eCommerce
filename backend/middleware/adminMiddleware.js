const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to access this resource.",
    });
  }
  return next();
};

module.exports = adminMiddleware;
