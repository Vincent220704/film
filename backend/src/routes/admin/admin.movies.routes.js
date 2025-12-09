// backend/src/routes/admin/admin.movies.routes.js
import { Router } from "express";
import { MovieController } from "../../controllers/movie.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

// tất cả route admin phim phải là ADMIN đã đăng nhập
router.use(authMiddleware, adminMiddleware);

router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getDetail);
router.post("/", MovieController.create);
router.put("/:id", MovieController.update);
router.delete("/:id", MovieController.remove);

export default router;
