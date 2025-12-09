// backend/src/routes/auth.routes.js (dành cho người dùng)
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Đăng ký người dùng mới
router.post("/register", AuthController.register);

// Đăng nhập
router.post("/login", AuthController.login);

// Lấy thông tin người dùng hiện tại (yêu cầu xác thực)
router.get("/me", authMiddleware, AuthController.me);
router.get("/users", authMiddleware, AuthController.getAllUsers);
router.put("/users/:id", authMiddleware, AuthController.updateUser);
router.delete("/users/:id", authMiddleware, AuthController.deleteUser);


export default router;
