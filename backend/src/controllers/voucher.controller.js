// backend/src/controllers/voucher.controller.js
import { VoucherService } from "../services/voucher.service.js";

export const VoucherController = {
  async getAll(req, res) {
    try {
      const vouchers = await VoucherService.getAll();
      res.json(vouchers);
    } catch (err) {
      console.error("Get vouchers error:", err);
      res.status(400).json({ message: err.message || "Lấy danh sách voucher thất bại" });
    }
  },

  async getDetail(req, res) {
    try {
      const id = req.params.id;
      const voucher = await VoucherService.getById(id);
      res.json(voucher);
    } catch (err) {
      console.error("Get voucher detail error:", err);
      res.status(404).json({ message: err.message || "Không tìm thấy voucher" });
    }
  },

  async create(req, res) {
    try {
      const voucher = await VoucherService.create(req.body);
      res.status(201).json(voucher);
    } catch (err) {
      console.error("Create voucher error:", err);
      res.status(400).json({ message: err.message || "Tạo voucher thất bại" });
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const voucher = await VoucherService.update(id, req.body);
      res.json(voucher);
    } catch (err) {
      console.error("Update voucher error:", err);
      res.status(400).json({ message: err.message || "Cập nhật voucher thất bại" });
    }
  },

  async remove(req, res) {
    try {
      const id = req.params.id;
      await VoucherService.remove(id);
      res.json({ message: "Xoá voucher thành công" });
    } catch (err) {
      console.error("Delete voucher error:", err);
      res.status(400).json({ message: err.message || "Xoá voucher thất bại" });
    }
  },
};
