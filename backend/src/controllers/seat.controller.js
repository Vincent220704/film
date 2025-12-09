// backend/src/controllers/seat.controller.js
import { SeatService } from "../services/seat.service.js";

export const SeatController = {
  async listByRoom(req, res) {
    try {
      const roomId = req.params.roomId;
      const seats = await SeatService.listByRoom(roomId);
      res.json(seats);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async generateForRoom(req, res) {
    try {
      const roomId = req.params.roomId;
      const result = await SeatService.generateForRoom(roomId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
