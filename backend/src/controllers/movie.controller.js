// backend/src/controllers/movie.controller.js
import { MovieService } from "../services/movie.service.js";

export const MovieController = {
  async getAll(req, res) {
    try {
      const movies = await MovieService.getAll();
      res.json(movies);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const movie = await MovieService.getById(req.params.id);
      res.json(movie);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const movie = await MovieService.create(req.body);
      res.json(movie);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const movie = await MovieService.update(req.params.id, req.body);
      res.json(movie);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await MovieService.remove(req.params.id);
      res.json({ message: "Đã xoá phim" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
