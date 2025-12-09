// backend/src/routes/movies.routes.js
import { Router } from "express";
import { MovieController } from "../controllers/movie.controller.js";

const router = Router();

// USER chỉ được xem phim, không được CRUD
router.get("/", MovieController.getAll);
router.get("/:id", MovieController.getById);

// ❌ KHÔNG được để cho user CRUD
// router.post("/", ...)
// router.put("/:id", ...)
// router.delete("/:id", ...)

export default router;
