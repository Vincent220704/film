// backend/src/models/cinema.model.js
import { pool } from "../config/db.js";

export const CinemaModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM cinemas ORDER BY id DESC");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM cinemas WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async create(data) {
    const {
      name,
      address,
      city,
      hotline,
      description,
      logo_url,
      map_url,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO cinemas 
        (name, address, city, hotline, description, logo_url, map_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, address, city, hotline, description, logo_url, map_url]
    );

    return {
      id: result.insertId,
      name,
      address,
      city,
      hotline,
      description,
      logo_url,
      map_url,
    };
  },

  async update(id, data) {
    const {
      name,
      address,
      city,
      hotline,
      description,
      logo_url,
      map_url,
    } = data;

    await pool.query(
      `UPDATE cinemas SET
        name = ?, address = ?, city = ?, hotline = ?,
        description = ?, logo_url = ?, map_url = ?
       WHERE id = ?`,
      [name, address, city, hotline, description, logo_url, map_url, id]
    );

    return {
      id,
      name,
      address,
      city,
      hotline,
      description,
      logo_url,
      map_url,
    };
  },

  async remove(id) {
    await pool.query("DELETE FROM cinemas WHERE id = ?", [id]);
    return true;
  },
};
