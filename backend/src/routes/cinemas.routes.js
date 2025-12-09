// backend/src/routes/cinemas.routes.js
import { Router } from "express";
import { CinemaController } from "../controllers/cinema.controller.js";

const router = Router();

// USER CHỈ ĐƯỢC XEM
router.get("/", CinemaController.getAll);
router.get("/:id", CinemaController.getById);

// ❌ KHÔNG được để CRUD ở đây
// router.post("/", ...)
// router.put("/:id", ...)
// router.delete("/:id", ...)

export default router;
