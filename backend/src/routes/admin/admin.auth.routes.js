import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";  // Middleware để kiểm tra quyền admin

const router = Router();

// Các route cần xác thực (authMiddleware) nhưng không cần quyền admin
router.post("/register", AuthController.register);  // Đăng ký người dùng
router.post("/login", AuthController.login);        // Đăng nhập người dùng
router.get("/me", authMiddleware, AuthController.me);  // Lấy thông tin người dùng hiện tại

router.use(authMiddleware, adminMiddleware);  // Áp dụng authMiddleware và adminMiddleware cho các route tiếp theo



export default router;
