// backend/src/services/combo.service.js
import { ComboModel } from "../models/combo.model.js";

export const ComboService = {
  async getAll() {
    // có thể filter is_active nếu muốn chỉ show combo đang bật
    return ComboModel.getAll();
  },

  async getById(id) {
    const combo = await ComboModel.getById(id);
    if (!combo) {
      throw new Error("Không tìm thấy combo");
    }
    return combo;
  },

  async create(data) {
    const { name, description, price, image_url, is_active } = data;

    if (!name || !price) {
      throw new Error("Thiếu thông tin combo (name, price)");
    }

    const combo = await ComboModel.create({
      name,
      description: description || "",
      price,
      is_active: is_active ?? true,
      image_url: image_url || null,
    });

    return combo;
  },

  async update(id, data) {
    const exists = await ComboModel.getById(id);
    if (!exists) {
      throw new Error("Combo không tồn tại");
    }

    await ComboModel.update(id, data);
    // trả về combo sau khi cập nhật
    return ComboModel.getById(id);
  },

  async remove(id) {
    const exists = await ComboModel.getById(id);
    if (!exists) {
      throw new Error("Combo không tồn tại");
    }

    await ComboModel.remove(id);
    return { message: "Xoá combo thành công" };
  },
};
