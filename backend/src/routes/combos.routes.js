// backend/src/routes/combos.routes.js
import { Router } from "express";
import { ComboController } from "../controllers/combo.controller.js";

const router = Router();

// USER chỉ được xem combo
router.get("/", ComboController.getAll);
router.get("/:id", ComboController.getDetail);

export default router;
