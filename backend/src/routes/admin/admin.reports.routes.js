// backend/src/routes/admin/admin.reports.routes.js
import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

// tạm: trả về chuỗi, sau này gắn ReportController
router.get("/overview", (req, res) => {
  res.json({ message: "Report API sẽ làm sau" });
});

export default router;
