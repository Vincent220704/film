// backend/src/services/voucher.service.js
import { VoucherModel } from "../models/voucher.model.js";

export const VoucherService = {
  async getAll() {
    return VoucherModel.getAll();
  },

  async getById(id) {
    const voucher = await VoucherModel.getById(id);
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }
    return voucher;
  },

  async getByCode(code) {
    const voucher = await VoucherModel.getByCode(code);
    if (!voucher) {
      throw new Error("Voucher không hợp lệ hoặc không tồn tại");
    }
    return voucher;
  },

  async create(data) {
    const { code, discount_type, discount_value, start_date, end_date } = data;

    if (!code || !discount_type || !discount_value || !start_date || !end_date) {
      throw new Error("Thiếu thông tin voucher (code, discount_type, discount_value, start_date, end_date)");
    }

    return VoucherModel.create(data);
  },

  async update(id, data) {
    const voucher = await VoucherModel.getById(id);
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }

    await VoucherModel.update(id, data);
    return VoucherModel.getById(id);
  },

  async remove(id) {
    const voucher = await VoucherModel.getById(id);
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }

    await VoucherModel.remove(id);
    return { message: "Xoá voucher thành công" };
  },

  async increaseUsage(id) {
    const voucher = await VoucherModel.getById(id);
    if (!voucher) {
      throw new Error("Voucher không tồn tại");
    }

    await VoucherModel.increaseUsage(id);
  },
};
