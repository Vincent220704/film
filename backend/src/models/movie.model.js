// backend/src/models/movie.model.js
import { pool } from "../config/db.js";

export const MovieModel = {
  async getAll() {
    const [rows] = await pool.query("SELECT * FROM movies ORDER BY id DESC");
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    return rows[0] || null;
  },

  async create(data) {
    const {
      title,
      original_title,
      description,
      duration_minutes,
      language,
      age_rating,
      genre,
      poster_url,
      backdrop_url,
      trailer_url,
      release_date,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO movies 
      (title, original_title, description, duration_minutes, language, age_rating, genre,
       poster_url, backdrop_url, trailer_url, release_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        original_title,
        description,
        duration_minutes,
        language,
        age_rating,
        genre,
        poster_url,
        backdrop_url,
        trailer_url,
        release_date,
      ]
    );

    return { id: result.insertId, ...data };
  },

  async update(id, data) {
    const {
      title,
      original_title,
      description,
      duration_minutes,
      language,
      age_rating,
      genre,
      poster_url,
      backdrop_url,
      trailer_url,
      release_date,
    } = data;

    await pool.query(
      `UPDATE movies SET 
        title = ?, original_title = ?, description = ?, duration_minutes = ?, 
        language = ?, age_rating = ?, genre = ?, poster_url = ?, backdrop_url = ?, 
        trailer_url = ?, release_date = ?
       WHERE id = ?`,
      [
        title,
        original_title,
        description,
        duration_minutes,
        language,
        age_rating,
        genre,
        poster_url,
        backdrop_url,
        trailer_url,
        release_date,
        id,
      ]
    );

    return { id, ...data };
  },

  async remove(id) {
    await pool.query("DELETE FROM movies WHERE id = ?", [id]);
    return true;
  }
};
