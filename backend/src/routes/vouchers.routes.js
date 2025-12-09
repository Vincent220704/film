// backend/src/routes/vouchers.routes.js
import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller.js";

const router = Router();

// USER chỉ được xem voucher
router.get("/", VoucherController.getAll);
router.get("/:id", VoucherController.getDetail);

export default router;
