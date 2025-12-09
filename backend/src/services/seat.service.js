// backend/src/services/seat.service.js
import { SeatModel } from "../models/seat.model.js";
import { RoomModel } from "../models/room.model.js";

export const SeatService = {
  async listByRoom(roomId) {
    return SeatModel.getByRoom(roomId);
  },

  async generateForRoom(roomId) {
    // 1. Lấy thông tin phòng
    const room = await RoomModel.getById(roomId);
    if (!room) throw new Error("Phòng không tồn tại");

    // 2. Kiểm tra xem đã có ghế chưa
    const existing = await SeatModel.countByRoom(roomId);
    if (existing > 0) {
      throw new Error("Phòng này đã có ghế, không thể generate lại");
      // nếu sau này muốn cho phép generate lại:
      // await SeatModel.clearByRoom(roomId);
    }

    const totalRows = room.total_rows;
    const totalCols = room.total_cols;

    if (!totalRows || !totalCols) {
      throw new Error("Phòng chưa cấu hình total_rows / total_cols");
    }

    // 3. Generate danh sách ghế
    const seats = [];
    const baseCharCode = "A".charCodeAt(0); // 65

    for (let r = 0; r < totalRows; r++) {
      const rowLabel = String.fromCharCode(baseCharCode + r); // A,B,C,...
      for (let num = 1; num <= totalCols; num++) {
        seats.push({
          row_label: rowLabel,
          seat_number: num,
          seat_type: "NORMAL" // mặc định, sau này có thể logic VIP/COUPLE
        });
      }
    }

    // 4. Insert batch
    await SeatModel.bulkInsert(roomId, seats);

    return {
      message: "Đã generate ghế cho phòng",
      room_id: roomId,
      total_seats: seats.length
    };
  }
};
