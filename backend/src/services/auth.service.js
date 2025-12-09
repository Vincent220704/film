import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";

export const AuthService = {
  // Đăng ký user mới (mặc định role = USER)
  async register(data) {
    const { full_name, email, password } = data;

    if (!full_name || !email || !password) {
      throw new Error("Thiếu thông tin đăng ký (full_name, email, password)");
    }

    const existing = await UserModel.getByEmail(email);
    if (existing) {
      throw new Error("Email đã tồn tại");
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await UserModel.createUser({
      full_name,
      email,
      password_hash,
      role: "USER", // admin bạn tự sửa trong DB
    });

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };
  },

  // Đăng nhập: trả về token + thông tin user (có role)
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Thiếu email hoặc mật khẩu");
    }

    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      throw new Error("Email hoặc mật khẩu không đúng");
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    };
  },

  // Lấy thông tin user hiện tại (dùng trong /me)
  async me(userId) {
    const user = await UserModel.getById(userId);

    if (!user) {
      throw new Error("User không tồn tại");
    }

    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  },

  // Lấy tất cả người dùng
  async getAllUsers() {
    try {
      return await UserModel.getAll();  // Gọi đến UserModel để lấy tất cả người dùng
    } catch (err) {
      throw new Error("Không thể lấy danh sách người dùng");
    }
  },

  // Cập nhật thông tin người dùng
  async updateUser(id, data) {
    const user = await UserModel.getById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return await UserModel.update(id, data);
  },

  // Xóa người dùng
  async deleteUser(id) {
    const user = await UserModel.getById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    return await UserModel.remove(id);
  },

};
