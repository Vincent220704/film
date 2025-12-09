// backend/src/routes/admin/admin.combos.routes.js
import { Router } from "express";
import { ComboController } from "../../controllers/combo.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", ComboController.getAll);
router.get("/:id", ComboController.getDetail);
router.post("/", ComboController.create);
router.put("/:id", ComboController.update);
router.delete("/:id", ComboController.remove);

export default router;
