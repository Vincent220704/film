// backend/src/routes/admin/admin.cinemas.routes.js
import { Router } from "express";
import { CinemaController } from "../../controllers/cinema.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", CinemaController.getAll);
router.get("/:id", CinemaController.getDetail);
router.post("/", CinemaController.create);
router.put("/:id", CinemaController.update);
router.delete("/:id", CinemaController.remove);

export default router;
