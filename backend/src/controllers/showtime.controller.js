// backend/src/controllers/showtime.controller.js
import { ShowtimeService } from "../services/showtime.service.js";

export const ShowtimeController = {
  async getAll(req, res) {
    try {
      const showtimes = await ShowtimeService.getAll();
      res.json(showtimes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const st = await ShowtimeService.getById(req.params.id);
      res.json(st);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const st = await ShowtimeService.create(req.body);
      res.json(st);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const st = await ShowtimeService.update(req.params.id, req.body);
      res.json(st);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await ShowtimeService.remove(req.params.id);
      res.json({ message: "Đã xoá suất chiếu" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async search(req, res) {
    try {
      const { movie_id, cinema_id, date, status } = req.query;
      const showtimes = await ShowtimeService.search({
        movie_id,
        cinema_id,
        date,
        status
      });
      res.json(showtimes);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
 // GET /api/showtimes/:id/seats
  async getSeats(req, res) {
    try {
      const showtime_id = req.params.id;
      const data = await ShowtimeService.getSeatsWithStatus(showtime_id);
      return res.json(data);
    } catch (err) {
      console.error("Get showtime seats error:", err);
      return res
        .status(400)
        .json({ message: err.message || "Lấy danh sách ghế thất bại" });
    }
  },
};

