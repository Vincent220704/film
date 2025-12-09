// backend/src/models/user.model.js
import { pool } from "../config/db.js";

export const UserModel = {
  async createUser({ full_name, email, password_hash, phone }) {
    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, phone)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, password_hash, phone]
    );

    return {
      id: result.insertId,
      full_name,
      email,
      phone,
      role: "USER",
    };
  },

  async getByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, phone, role, created_at
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Lấy người dùng theo email
  async getByEmail(email) {
    const [rows] = await pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    return rows[0] || null;
  },

  // Lấy người dùng theo ID
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT id, full_name, email, phone, role, created_at, updated_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  // Lấy tất cả người dùng
  async getAll() {
    try {
      const [rows] = await pool.query(`SELECT id, full_name, email, phone, role FROM users`);
      return rows;
    } catch (err) {
      throw new Error("Không thể truy vấn cơ sở dữ liệu");
    }
  },

  // Cập nhật thông tin người dùng
  async update(id, { full_name, email, phone, role }) {
    await pool.query(
      `UPDATE users SET 
        full_name = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [full_name, email, phone, id]
    );

    return { id, full_name, email, phone };
  },

  // Xóa người dùng
  async remove(id) {
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return true;
  },

};
