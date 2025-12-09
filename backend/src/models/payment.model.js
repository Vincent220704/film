// backend/src/models/payment.model.js
import { pool } from "../config/db.js";

export const PaymentModel = {
  async create(data) {
    const {
      booking_id,
      provider = "MOMO",
      order_id,
      request_id,
      amount,
      status = "PENDING",
      raw_response = null,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO payments 
        (booking_id, provider, order_id, request_id, amount, status, raw_response)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        booking_id,
        provider,
        order_id,
        request_id,
        amount,
        status,
        raw_response,
      ]
    );

    return { id: result.insertId, ...data };
  },

  async findByOrderId(order_id) {
    const [rows] = await pool.query(
      `SELECT * FROM payments WHERE order_id = ? LIMIT 1`,
      [order_id]
    );
    return rows[0] || null;
  },

  async updateStatusByOrderId(order_id, status) {
    await pool.query(
      `UPDATE payments
       SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE order_id = ?`,
      [status, order_id]
    );
  },
};
