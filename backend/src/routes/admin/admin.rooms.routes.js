// backend/src/routes/admin/admin.rooms.routes.js
import { Router } from "express";
import { RoomController } from "../../controllers/room.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", RoomController.getAll);
router.get("/:id", RoomController.getDetail);
router.post("/", RoomController.create);
router.put("/:id", RoomController.update);
router.delete("/:id", RoomController.remove);

export default router;
