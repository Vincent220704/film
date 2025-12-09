// backend/src/controllers/room.controller.js
import { RoomService } from "../services/room.service.js";

export const RoomController = {
  async getAll(req, res) {
    try {
      const rooms = await RoomService.getAll();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const room = await RoomService.getById(req.params.id);
      res.json(room);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const room = await RoomService.create(req.body);
      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const room = await RoomService.update(req.params.id, req.body);
      res.json(room);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      await RoomService.remove(req.params.id);
      res.json({ message: "Đã xoá phòng" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};
