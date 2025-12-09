// backend/src/services/room.service.js
import { RoomModel } from "../models/room.model.js";
import { CinemaModel } from "../models/cinema.model.js";

export const RoomService = {
  async getAll() {
    return RoomModel.getAll();
  },

  async getById(id) {
    const room = await RoomModel.getById(id);
    if (!room) throw new Error("Không tìm thấy phòng");
    return room;
  },

  async create(data) {
    const { cinema_id, name, total_rows, total_cols } = data;

    if (!cinema_id || !name || !total_rows || !total_cols) {
      throw new Error("Thiếu thông tin phòng chiếu (cinema_id, name, total_rows, total_cols)");
    }

    // kiểm tra rạp tồn tại
    const cinema = await CinemaModel.getById(cinema_id);
    if (!cinema) {
      throw new Error("Rạp không tồn tại");
    }

    return RoomModel.create({
      cinema_id,
      name,
      total_rows,
      total_cols
    });
  },

  async update(id, data) {
    return RoomModel.update(id, data);
  },

  async remove(id) {
    return RoomModel.remove(id);
  }
};
