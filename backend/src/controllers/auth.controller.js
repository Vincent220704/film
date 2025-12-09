import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  // Đăng ký user mới
  async register(req, res) {
    try {
      const result = await AuthService.register(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Đăng nhập
  async login(req, res) {
    try {
      const result = await AuthService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Lấy thông tin người dùng hiện tại
  async me(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized, user ID not found" });
      }

      const user = await AuthService.me(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User không tồn tại" });
      }

      res.json(user);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

// Lấy tất cả người dùng
  async getAllUsers(req, res) {
    try {
      const users = await AuthService.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Cập nhật thông tin người dùng
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const result = await AuthService.updateUser(id, req.body);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Xóa người dùng
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await AuthService.deleteUser(id);
      res.json({ message: "Người dùng đã bị xóa" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },


};
