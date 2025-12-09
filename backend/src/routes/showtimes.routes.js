// backend/src/routes/showtimes.routes.js
import { Router } from "express";
import { ShowtimeController } from "../controllers/showtime.controller.js";

const router = Router();

// User & admin đều có thể dùng list/search này, phân quyền sẽ xử lý sau
router.get("/", ShowtimeController.getAll);
router.get("/search", ShowtimeController.search);
router.get("/:id", ShowtimeController.getById);
// router.post("/", ShowtimeController.create);
// router.put("/:id", ShowtimeController.update);
// router.delete("/:id", ShowtimeController.remove);
// Lấy sơ đồ ghế + trạng thái cho 1 suất chiếu
router.get("/:id/seats", ShowtimeController.getSeats);
export default router;
