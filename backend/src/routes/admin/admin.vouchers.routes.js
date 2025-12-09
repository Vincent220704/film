// backend/src/routes/admin/admin.vouchers.routes.js
import { Router } from "express";
import { VoucherController } from "../../controllers/voucher.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", VoucherController.getAll);
router.get("/:id", VoucherController.getDetail);
router.post("/", VoucherController.create);
router.put("/:id", VoucherController.update);
router.delete("/:id", VoucherController.remove);

export default router;
