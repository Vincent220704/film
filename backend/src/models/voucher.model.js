// backend/src/models/voucher.model.js
import { pool } from "../config/db.js";

export const VoucherModel = {
  async getAll() {
    const [rows] = await pool.query(
      `SELECT 
         id,
         code,
         description,
         discount_type,
         discount_value,
         max_discount_amount,
         min_order_total,
         start_date,
         end_date,
         usage_limit,
         usage_count,
         is_active,
         created_at,
         updated_at
       FROM vouchers
       WHERE is_active = 1
       ORDER BY id DESC`
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT 
         id,
         code,
         description,
         discount_type,
         discount_value,
         max_discount_amount,
         min_order_total,
         start_date,
         end_date,
         usage_limit,
         usage_count,
         is_active,
         created_at,
         updated_at
       FROM vouchers
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getByCode(code) {
    const [rows] = await pool.query(
      `SELECT 
         id,
         code,
         description,
         discount_type,
         discount_value,
         max_discount_amount,
         min_order_total,
         start_date,
         end_date,
         usage_limit,
         usage_count,
         is_active,
         created_at,
         updated_at
       FROM vouchers
       WHERE code = ?`,
      [code]
    );
    return rows[0] || null;
  },

  async create(data) {
    const {
      code,
      description,
      discount_type,
      discount_value,
      max_discount_amount,
      min_order_total,
      start_date,
      end_date,
      usage_limit,
      is_active,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO vouchers (
         code,
         description,
         discount_type,
         discount_value,
         max_discount_amount,
         min_order_total,
         start_date,
         end_date,
         usage_limit,
         usage_count,
         is_active
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        code,
        description || "",
        discount_type,
        discount_value,
        max_discount_amount || null,
        min_order_total || null,
        start_date,
        end_date,
        usage_limit || null,
        0, // usage_count default to 0
        is_active ?? true,
      ]
    );

    return {
      id: result.insertId,
      ...data,
    };
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    for (const key of Object.keys(data)) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }

    if (!fields.length) return;

    values.push(id);

    await pool.query(
      `UPDATE vouchers
       SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      values
    );
  },

  async remove(id) {
    await pool.query(`DELETE FROM vouchers WHERE id = ?`, [id]);
  },

  async increaseUsage(id) {
    await pool.query(
      `UPDATE vouchers
       SET usage_count = usage_count + 1
       WHERE id = ?`,
      [id]
    );
  },
};
