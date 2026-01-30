const jwt = require("jsonwebtoken");

/**
 * Middleware to protect routes.
 * Checks for JWT token in HTTP-only cookies.
 */
const protect = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded"+decoded);
    
    req.user = decoded; // contains { id, role }
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = protect;
