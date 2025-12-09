// backend/src/routes/bookings.routes.js
import { Router } from "express";
import { BookingController } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Lịch sử booking của user hiện tại
router.get("/me/history", authMiddleware, BookingController.getMine);

// Thanh toán booking
router.patch("/:id/pay", authMiddleware, BookingController.pay);

// Huỷ booking
router.patch("/:id/cancel", authMiddleware, BookingController.cancel);

// Chi tiết 1 booking
router.get("/:id", authMiddleware, BookingController.getDetail);

// Tạo booking
router.post("/", authMiddleware, BookingController.create);

export default router;
