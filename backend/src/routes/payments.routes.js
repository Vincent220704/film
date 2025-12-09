// backend/src/routes/payments.routes.js
import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";

const router = Router();

// Webhook (MoMo gọi) → localhost bỏ qua
router.post("/webhook", PaymentController.webhook);

// return URL khi user thanh toán xong trên MoMo
router.get("/return", PaymentController.returnFromMomo);

export default router;
