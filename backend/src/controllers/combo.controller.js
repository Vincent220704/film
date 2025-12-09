// backend/src/controllers/combo.controller.js
import { ComboService } from "../services/combo.service.js";

export const ComboController = {
  async getAll(req, res) {
    try {
      const combos = await ComboService.getAll();
      res.json(combos);
    } catch (err) {
      console.error("Get combos error:", err);
      res.status(400).json({ message: err.message || "Lấy danh sách combo thất bại" });
    }
  },

  async getDetail(req, res) {
    try {
      const id = req.params.id;
      const combo = await ComboService.getById(id);
      res.json(combo);
    } catch (err) {
      console.error("Get combo detail error:", err);
      res.status(404).json({ message: err.message || "Không tìm thấy combo" });
    }
  },

  async create(req, res) {
    try {
      const combo = await ComboService.create(req.body);
      res.status(201).json(combo);
    } catch (err) {
      console.error("Create combo error:", err);
      res.status(400).json({ message: err.message || "Tạo combo thất bại" });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const combo = await ComboService.update(id, req.body);
      res.json(combo);
    } catch (err) {
      console.error("Update combo error:", err);
      res.status(400).json({ message: err.message || "Cập nhật combo thất bại" });
    }
  },

  async remove(req, res) {
    try {
      const id = req.params.id;
      await ComboService.remove(id);
      res.json({ message: "Xoá combo thành công" });
    } catch (err) {
      console.error("Delete combo error:", err);
      res.status(400).json({ message: err.message || "Xoá combo thất bại" });
    }
  },
};
