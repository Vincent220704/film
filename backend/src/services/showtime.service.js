// backend/src/services/showtime.service.js
import { ShowtimeModel } from "../models/showtime.model.js";
import { MovieModel } from "../models/movie.model.js";
import { RoomModel } from "../models/room.model.js";
import { SeatModel } from "../models/seat.model.js";
import { BookingModel } from "../models/booking.model.js";

export const ShowtimeService = {
  async getAll() {
    return ShowtimeModel.getAll();
  },

  async getById(id) {
    const st = await ShowtimeModel.getById(id);
    if (!st) throw new Error("Không tìm thấy suất chiếu");
    return st;
  },

  async create(data) {
    const { movie_id, room_id, start_time, end_time, base_price } = data;

    if (!movie_id || !room_id || !start_time || !end_time || !base_price) {
      throw new Error(
        "Thiếu thông tin suất chiếu (movie_id, room_id, start_time, end_time, base_price)"
      );
    }

    const movie = await MovieModel.getById(movie_id);
    if (!movie) throw new Error("Phim không tồn tại");

    const room = await RoomModel.getById(room_id);
    if (!room) throw new Error("Phòng không tồn tại");

    return ShowtimeModel.create(data);
  },

  async update(id, data) {
    // tuỳ ý, có thể kiểm tra lại tồn tại
    return ShowtimeModel.update(id, data);
  },

  async remove(id) {
    return ShowtimeModel.remove(id);
  },

  async search(filters) {
    return ShowtimeModel.search(filters);
  },

  // ============================
  // LẤY SƠ ĐỒ GHẾ + TRẠNG THÁI
  // GET /api/showtimes/:id/seats sẽ dùng hàm này
  // ============================
  async getSeatsWithStatus(showtime_id) {
    // 1. Lấy suất chiếu
    const showtime = await ShowtimeModel.getById(showtime_id);
    if (!showtime) {
      throw new Error("Suất chiếu không tồn tại");
    }

    // 2. Lấy tất cả ghế trong phòng
    const seats = await SeatModel.getByRoom(showtime.room_id);
    if (!seats || seats.length === 0) {
      return {
        showtime: {
          id: showtime.id,
          start_time: showtime.start_time,
          end_time: showtime.end_time,
          room_id: showtime.room_id,
          base_price: showtime.base_price,
        },
        seats: [],
      };
    }

    const allSeatIds = seats.map((s) => Number(s.id));

    // 3. Lấy danh sách seat_id đã được giữ/đặt cho suất chiếu này
    const takenSeatIds = await BookingModel.findExistingSeatsForShowtime(
      showtime_id,
      allSeatIds
    );
    const takenSet = new Set(takenSeatIds.map(Number));

    // 4. Ghép trạng thái vào ghế
    const seatsWithStatus = seats.map((s) => ({
      seat_id: s.id,
      row_label: s.row_label,
      seat_number: s.seat_number,
      seat_type: s.seat_type,
      is_active: !!s.is_active,
      status: !s.is_active
        ? "DISABLED" // ghế bị khoá trong hệ thống
        : takenSet.has(Number(s.id))
        ? "BOOKED" // đã có booking PENDING/PAID
        : "AVAILABLE", // còn trống
    }));

    return {
      showtime: {
        id: showtime.id,
        start_time: showtime.start_time,
        end_time: showtime.end_time,
        room_id: showtime.room_id,
        base_price: showtime.base_price,
      },
      seats: seatsWithStatus,
    };
  },
};
