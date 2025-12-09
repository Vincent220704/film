// backend/src/routes/admin/admin.seats.routes.js
import { Router } from "express";
import { SeatController } from "../../controllers/seat.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

// Admin mới được generate ghế
router.post("/generate-for-room/:roomId", SeatController.generateForRoom);

// Tuỳ bạn có làm thêm CRUD ghế hay không
// router.put("/:id", SeatController.update);
// router.delete("/:id", SeatController.remove);

export default router;
