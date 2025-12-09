// backend/src/routes/admin/admin.showtimes.routes.js
import { Router } from "express";
import { ShowtimeController } from "../../controllers/showtime.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", ShowtimeController.getAll);
router.get("/:id", ShowtimeController.getDetail);
router.post("/", ShowtimeController.create);
router.put("/:id", ShowtimeController.update);
router.delete("/:id", ShowtimeController.remove);

export default router;
