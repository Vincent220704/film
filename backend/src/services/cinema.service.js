// backend/src/services/cinema.service.js
import { CinemaModel } from "../models/cinema.model.js";

export const CinemaService = {
  async getAll() {
    return CinemaModel.getAll();
  },

  async getById(id) {
    const cinema = await CinemaModel.getById(id);
    if (!cinema) throw new Error("Không tìm thấy rạp");
    return cinema;
  },

  async create(data) {
    if (!data.name || !data.address) {
      throw new Error("Thiếu name hoặc address");
    }
    return CinemaModel.create(data);
  },

  async update(id, data) {
    return CinemaModel.update(id, data);
  },

  async remove(id) {
    return CinemaModel.remove(id);
  }
};
