// backend/src/services/movie.service.js
import { MovieModel } from "../models/movie.model.js";

export const MovieService = {
  async getAll() {
    return MovieModel.getAll();
  },

  async getById(id) {
    const movie = await MovieModel.getById(id);
    if (!movie) throw new Error("Không tìm thấy phim");
    return movie;
  },

  async create(data) {
    if (!data.title || !data.duration_minutes) {
      throw new Error("Thiếu title hoặc duration_minutes");
    }
    return MovieModel.create(data);
  },

  async update(id, data) {
    return MovieModel.update(id, data);
  },

  async remove(id) {
    return MovieModel.remove(id);
  }
};
