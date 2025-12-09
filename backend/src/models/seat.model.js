// backend/src/models/seat.model.js
import { pool } from "../config/db.js";

export const SeatModel = {
  async getByRoom(room_id) {
    const [rows] = await pool.query(
      `SELECT 
         id,
         room_id,
         row_label,
         seat_number,
         seat_type,
         is_active,
         created_at,
         updated_at
       FROM seats
       WHERE room_id = ?
       ORDER BY row_label, seat_number`,
      [room_id]
    );
    return rows;
  },

  async getSeatsByIds(seat_ids) {
    if (!seat_ids.length) return [];

    const [rows] = await pool.query(
      `SELECT 
         id,
         room_id,
         row_label,
         seat_number,
         seat_type,
         is_active
       FROM seats
       WHERE id IN (?)`,
      [seat_ids]
    );

    return rows;
  },

  async countByRoom(room_id) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM seats 
       WHERE room_id = ?`,
      [room_id]
    );
    return rows[0]?.total || 0;
  },

  async clearByRoom(room_id) {
    await pool.query(
      `DELETE FROM seats 
       WHERE room_id = ?`,
      [room_id]
    );
  },

  async bulkInsert(room_id, seats) {
    if (!seats.length) return;

    const values = seats.map((s) => [
      room_id,
      s.row_label,
      s.seat_number,
      s.seat_type || "NORMAL",
      1 // is_active = 1 mặc định
    ]);

    await pool.query(
      `INSERT INTO seats 
        (room_id, row_label, seat_number, seat_type, is_active)
       VALUES ?`,
      [values]
    );
  },
};
