

/**
 * Middleware to allow only admin users
 * Must be used AFTER `protect` middleware
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    console.log();
    
    next();
  } else {
    res.status(403).json({ message: "Admin access denied" });
  }
};

module.exports = admin;
