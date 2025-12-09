// backend/src/routes/seats.routes.js
import { Router } from "express";
import { SeatController } from "../controllers/seat.controller.js";

const router = Router();

// Lấy danh sách ghế theo phòng
router.get("/by-room/:roomId", SeatController.listByRoom);

// Generate ghế cho 1 phòng (dựa vào total_rows, total_cols)
// router.post("/generate-for-room/:roomId", SeatController.generateForRoom);

export default router;
