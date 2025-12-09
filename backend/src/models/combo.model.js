// backend/src/models/combo.model.js
import { pool } from "../config/db.js";

export const ComboModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT 
         id,
         name,
         description,
         price,
         image_url,
         is_active,
         created_at,
         updated_at
       FROM combos
       ORDER BY id DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT 
         id,
         name,
         description,
         price,
         image_url,
         is_active,
         created_at,
         updated_at
       FROM combos
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getByIds(ids) {
    if (!ids || !ids.length) return [];
    const [rows] = await pool.query(
      `SELECT 
         id,
         name,
         description,
         price,
         image_url,
         is_active
       FROM combos
       WHERE id IN (?)`,
      [ids]
    );
    return rows;
  },

  async create(data) {
    const { name, description, price, image_url, is_active } = data;

    const [result] = await pool.query(
      `INSERT INTO combos (name, description, price, image_url, is_active)
       VALUES (?, ?, ?, ?, ?)`,
      [
        name,
        description || "",
        price,
        image_url || null,
        is_active ?? true,
      ]
    );

    return {
      id: result.insertId,
      ...data,
    };
  },

  async update(id, data) {
    // Tạo danh sách các trường được update
    const fields = [];
    const values = [];

    for (const key of Object.keys(data)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    // Không update nếu không có dữ liệu
    if (!fields.length) return;

    values.push(id);

    await pool.query(
      `UPDATE combos
       SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );
  },

  async remove(id) {
    await pool.query(`DELETE FROM combos WHERE id = ?`, [id]);
  }
};
