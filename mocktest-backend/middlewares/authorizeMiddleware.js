const dotenv = require("dotenv");
dotenv.config();

const permissions = require("../config/permissions");

// Get admin IDs from .env and convert to an array
const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : [];

const matchRoute = (path) => {
  if (permissions[path]) return permissions[path];

  // Convert dynamic routes like "/api/tests/:id/start" to match "/api/tests/3/start"
  for (let key in permissions) {
    const pattern = key.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${pattern}$`);
    if (regex.test(path)) {
      return permissions[key];
    }
  }

  // Check for wildcard match (e.g., "/api/tests*")
  for (let key in permissions) {
    if (key.endsWith("*") && path.startsWith(key.replace("*", ""))) {
      return permissions[key];
    }
  }

  return null;
};

const authorizeMiddleware = (req, res, next) => {
  if (!req.user || !req.user.user || !req.user.user.userId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  const userId = req.user.user.userId;
  const path = req.path;

  let userRole = null; // Default to null (unauthorized)
  if (adminIds.includes(userId + "")) {
    userRole = "admin";
  } else {
    userRole = "user"; // Consider only authenticated users as "user"
  }

  const allowedRoles = matchRoute(path);

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  if (!allowedRoles && userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin access only" });
  }

  next();
};

module.exports = authorizeMiddleware;
