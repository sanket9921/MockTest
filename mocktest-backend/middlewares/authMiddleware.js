const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies["user-details"];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid token" });
      }

      req.user = decoded; // Attach user data to request
      next(); // Continue to next middleware or route handler
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = authMiddleware;
