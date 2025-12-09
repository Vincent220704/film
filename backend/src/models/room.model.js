// backend/src/models/room.model.js
import { pool } from "../config/db.js";

export const RoomModel = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT r.*, c.name AS cinema_name
      FROM rooms r
      JOIN cinemas c ON r.cinema_id = c.id
      ORDER BY r.id DESC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(`
      SELECT r.*, c.name AS cinema_name
      FROM rooms r
      JOIN cinemas c ON r.cinema_id = c.id
      WHERE r.id = ?
    `, [id]);

    return rows[0] || null;
  },

  async create(data) {
    const { cinema_id, name, total_rows, total_cols } = data;

    const [result] = await pool.query(
      `INSERT INTO rooms (cinema_id, name, total_rows, total_cols)
       VALUES (?, ?, ?, ?)`,
      [cinema_id, name, total_rows, total_cols]
    );

    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const { cinema_id, name, total_rows, total_cols } = data;

    await pool.query(
      `UPDATE rooms SET 
        cinema_id = ?, name = ?, total_rows = ?, total_cols = ?
       WHERE id = ?`,
      [cinema_id, name, total_rows, total_cols, id]
    );

    return { id, ...data };
  },

  async remove(id) {
    await pool.query("DELETE FROM rooms WHERE id = ?", [id]);
    return true;
  }
};
