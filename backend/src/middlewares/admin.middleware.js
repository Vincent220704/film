// backend/src/middlewares/admin.middleware.js

export function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

  next();
}
