// backend/src/models/showtime.model.js
import { pool } from "../config/db.js";

export const ShowtimeModel = {
  async getAll() {
    const [rows] = await pool.query(`
      SELECT 
        st.*,
        m.title AS movie_title,
        r.name  AS room_name,
        c.id    AS cinema_id,
        c.name  AS cinema_name
      FROM showtimes st
      JOIN movies  m ON st.movie_id = m.id
      JOIN rooms   r ON st.room_id  = r.id
      JOIN cinemas c ON r.cinema_id = c.id
      ORDER BY st.start_time DESC
    `);
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT 
        st.*,
        m.title AS movie_title,
        r.name  AS room_name,
        c.id    AS cinema_id,
        c.name  AS cinema_name
      FROM showtimes st
      JOIN movies  m ON st.movie_id = m.id
      JOIN rooms   r ON st.room_id  = r.id
      JOIN cinemas c ON r.cinema_id = c.id
      WHERE st.id = ?
    `,
      [id]
    );

    // BookingService đang dùng: showtime.room_id, showtime.base_price, (thêm movie_title, room_name, cinema_name)
    return rows[0] || null;
  },

  async create(data) {
    const {
      movie_id,
      room_id,
      start_time,
      end_time,
      base_price,
      format,
      language,
      status,
    } = data;

    const [result] = await pool.query(
      `
      INSERT INTO showtimes 
        (movie_id, room_id, start_time, end_time, base_price, format, language, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        movie_id,
        room_id,
        start_time,
        end_time,
        base_price,
        format || null,
        language || null,
        status || "SCHEDULED",
      ]
    );

    return {
      id: result.insertId,
      movie_id,
      room_id,
      start_time,
      end_time,
      base_price,
      format: format || null,
      language: language || null,
      status: status || "SCHEDULED",
    };
  },

  async update(id, data) {
    const {
      movie_id,
      room_id,
      start_time,
      end_time,
      base_price,
      format,
      language,
      status,
    } = data;

    await pool.query(
      `
      UPDATE showtimes SET
        movie_id   = ?,
        room_id    = ?,
        start_time = ?,
        end_time   = ?,
        base_price = ?,
        format     = ?,
        language   = ?,
        status     = ?
      WHERE id = ?
    `,
      [
        movie_id,
        room_id,
        start_time,
        end_time,
        base_price,
        format || null,
        language || null,
        status,
        id,
      ]
    );

    return {
      id,
      movie_id,
      room_id,
      start_time,
      end_time,
      base_price,
      format: format || null,
      language: language || null,
      status,
    };
  },

  async remove(id) {
    await pool.query("DELETE FROM showtimes WHERE id = ?", [id]);
    return true;
  },

  async search(filters) {
    let sql = `
      SELECT 
        st.*,
        m.title AS movie_title,
        r.name  AS room_name,
        c.id    AS cinema_id,
        c.name  AS cinema_name
      FROM showtimes st
      JOIN movies  m ON st.movie_id = m.id
      JOIN rooms   r ON st.room_id  = r.id
      JOIN cinemas c ON r.cinema_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.movie_id) {
      sql += " AND st.movie_id = ?";
      params.push(filters.movie_id);
    }

    if (filters.cinema_id) {
      sql += " AND c.id = ?";
      params.push(filters.cinema_id);
    }

    if (filters.date) {
      sql += " AND DATE(st.start_time) = ?";
      params.push(filters.date);
    }

    if (filters.status) {
      sql += " AND st.status = ?";
      params.push(filters.status);
    }

    sql += " ORDER BY st.start_time";

    const [rows] = await pool.query(sql, params);
    return rows;
  },
};
