// backend/src/controllers/cinema.controller.js
import { CinemaService } from "../services/cinema.service.js";

export const CinemaController = {
  async getAll(req, res) {
    try {
      const cinemas = await CinemaService.getAll();
      res.json(cinemas);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const cinema = await CinemaService.getById(req.params.id);
      res.json(cinema);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const cinema = await CinemaService.create(req.body);
      res.json(cinema);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const cinema = await CinemaService.update(req.params.id, req.body);
      res.json(cinema);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await CinemaService.remove(req.params.id);
      res.json({ message: "Đã xoá rạp" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
