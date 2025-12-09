// backend/src/services/booking.service.js

import { BookingModel } from "../models/booking.model.js";
import { ShowtimeModel } from "../models/showtime.model.js";
import { SeatModel } from "../models/seat.model.js";
import { ComboModel } from "../models/combo.model.js";
import { VoucherModel } from "../models/voucher.model.js";
import { PaymentModel } from "../models/payment.model.js";
import { createMomoPayment } from "../integrations/paymentGateway.client.js";

function generateBookingCode() {
  const now = Date.now();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `BK${now}${rand}`;
}

function calcVoucherDiscount(voucher, totalAmount) {
  if (!voucher) {
    return { discount: 0, voucher_id: null };
  }

  const now = new Date();
  const start = new Date(voucher.start_date);
  const end = new Date(voucher.end_date);

  if (now < start || now > end) {
    throw new Error("Voucher đã hết hạn hoặc chưa đến thời gian sử dụng");
  }

  if (
    voucher.usage_limit !== null &&
    voucher.usage_limit !== undefined &&
    Number(voucher.usage_limit) > 0 &&
    Number(voucher.usage_count) >= Number(voucher.usage_limit)
  ) {
    throw new Error("Voucher đã sử dụng hết số lần cho phép");
  }

  if (voucher.min_order_total && totalAmount < Number(voucher.min_order_total)) {
    throw new Error("Đơn hàng không đủ điều kiện áp dụng voucher");
  }

  let discount = 0;

  if (voucher.discount_type === "PERCENT") {
    discount = (Number(voucher.discount_value) / 100) * totalAmount;
    if (voucher.max_discount_amount) {
      discount = Math.min(discount, Number(voucher.max_discount_amount));
    }
  } else if (voucher.discount_type === "AMOUNT") {
    discount = Number(voucher.discount_value);
  }

  discount = Math.min(discount, totalAmount);

  return { discount, voucher_id: voucher.id };
}

export const BookingService = {
  async createBooking({ user_id, showtime_id, seat_ids, combos, voucher_code }) {
    if (!user_id || !showtime_id || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      throw new Error("Thiếu thông tin booking (user_id, showtime_id, seat_ids)");
    }

    // 1. Lấy suất chiếu
    const showtime = await ShowtimeModel.getById(showtime_id);
    if (!showtime) {
      throw new Error("Suất chiếu không tồn tại");
    }
    if (showtime.status !== "SCHEDULED") {
      throw new Error("Suất chiếu không khả dụng");
    }

    // 2. Lấy tất cả ghế của phòng
    const seats = await SeatModel.getByRoom(showtime.room_id);
    const seatMap = new Map(seats.map((s) => [Number(s.id), s]));

    const validSeatObjects = [];
    for (const seatId of seat_ids) {
      const seat = seatMap.get(Number(seatId));
      if (!seat) {
        throw new Error(`Ghế không hợp lệ hoặc không thuộc phòng này: seat_id=${seatId}`);
      }
      if (!seat.is_active) {
        throw new Error(`Ghế đang bị khoá: seat_id=${seatId}`);
      }
      validSeatObjects.push(seat);
    }

    // 3. Check ghế đã được giữ/đặt chưa
    const existing = await BookingModel.findExistingSeatsForShowtime(showtime_id, seat_ids);
    if (existing.length > 0) {
      throw new Error("Một số ghế đã được đặt hoặc đang giữ: " + existing.join(", "));
    }

    // 4. Tính tiền ghế
    const basePrice = Number(showtime.base_price);
    const seatAmount = basePrice * seat_ids.length;

    // 5. Tính tiền combo
    let comboAmount = 0;
    let combosExpanded = [];

    if (Array.isArray(combos) && combos.length > 0) {
      const comboIds = combos.map((c) => c.combo_id);
      const comboRows = await ComboModel.getByIds(comboIds);
      const comboMap = new Map(comboRows.map((c) => [Number(c.id), c]));

      for (const c of combos) {
        const comboInfo = comboMap.get(Number(c.combo_id));
        if (!comboInfo || !comboInfo.is_active) {
          throw new Error(`Combo không hợp lệ hoặc không hoạt động: combo_id=${c.combo_id}`);
        }
        const qty = Number(c.quantity) || 1;
        const unitPrice = Number(comboInfo.price);
        const lineTotal = unitPrice * qty;
        comboAmount += lineTotal;

        combosExpanded.push({
          combo_id: c.combo_id,
          quantity: qty,
          unit_price: unitPrice,
        });
      }
    }

    const totalAmount = seatAmount + comboAmount;

    // 6. Áp dụng voucher
    let voucher = null;
    if (voucher_code) {
      voucher = await VoucherModel.getByCode(voucher_code);
      if (!voucher) {
        throw new Error("Voucher không hợp lệ hoặc không tồn tại");
      }
    }

    const { discount, voucher_id } = calcVoucherDiscount(voucher, totalAmount);
    const finalAmount = totalAmount - discount;

    // 7. Tạo booking
    const booking_code = generateBookingCode();

    const booking = await BookingModel.createBooking({
      user_id,
      showtime_id,
      voucher_id,
      booking_code,
      status: "PENDING",
      total_amount: totalAmount,
      discount_amount: discount,
      final_amount: finalAmount,
      payment_method: null,
      payment_ref: null,
      paid_at: null,
    });

    // 8. Lưu ghế
    const seatsWithPrice = seat_ids.map((id) => ({
      seat_id: id,
      price: basePrice,
    }));
    await BookingModel.addSeats(booking.id, seatsWithPrice);

    // 9. Lưu combo
    await BookingModel.addCombos(booking.id, combosExpanded);

    // 10. Tăng usage của voucher
    if (voucher_id) {
      await VoucherModel.increaseUsage(voucher_id);
    }

    // -------------------------------------
    // 11. TÍCH HỢP MOMO: tạo payment ngay lập tức
    // -------------------------------------

    const orderId = `${booking.id}-${Date.now()}`;
    const requestId = `${booking.id}-${Date.now()}`;
    const orderInfo = `Thanh toán vé xem phim #${booking.id}`;

    const momoResponse = await createMomoPayment({
      orderId,
      requestId,
      amount: finalAmount,
      orderInfo,
    });

    await PaymentModel.create({
      booking_id: booking.id,
      provider: "MOMO",
      order_id: orderId,
      request_id: requestId,
      amount: finalAmount,
      status: "PENDING",
      raw_response: JSON.stringify(momoResponse),
    });

    const payUrl =
      momoResponse.payUrl ||
      momoResponse.shortLink ||
      momoResponse.deeplink;

    // 12. Trả về cho FE cả booking + link MoMo
    return {
      message: "Booking created. Redirect to MoMo to complete payment.",
      booking_id: booking.id,
      booking_code,
      final_amount: finalAmount,
      payUrl,
      momoResponse
    };
  },

  async getBookingDetail(id) {
    const booking = await BookingModel.getById(id);
    if (!booking) throw new Error("Không tìm thấy booking");

    const seats = await BookingModel.getSeatsForBooking(id);
    const combos = await BookingModel.getCombosForBooking(id);

    return { ...booking, seats, combos };
  },

  async getUserBookings(user_id) {
    return BookingModel.getByUser(user_id);
  },

  async payBooking({ booking_id, user_id, role, payment_method, payment_ref }) {
    const booking = await BookingModel.getById(booking_id);
    if (!booking) {
      throw new Error("Không tìm thấy booking");
    }

    if (booking.user_id !== user_id && role !== "ADMIN") {
      throw new Error("Bạn không có quyền thanh toán booking này");  
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Booking đã bị huỷ, không thể thanh toán");
    }

    if (booking.status === "PAID") {
      throw new Error("Booking đã được thanh toán trước đó");
    }

    const paid_at = new Date();

    await BookingModel.updatePayment(booking_id, {
      status: "PAID",
      payment_method: payment_method || "OFFLINE",
      payment_ref: payment_ref || null,
      paid_at,
    });

    return this.getBookingDetail(booking_id);
  },

  async cancelBooking({ booking_id, user_id, role }) {
    const booking = await BookingModel.getById(booking_id);
    if (!booking) {
      throw new Error("Không tìm thấy booking");
    }

    if (booking.user_id !== user_id && role !== "ADMIN") {
      throw new Error("Bạn không có quyền huỷ booking này");
    }

    if (booking.status === "CANCELLED") {
      throw new Error("Booking đã được huỷ trước đó");
    }

    if (booking.status === "PAID") {
      throw new Error("Booking đã thanh toán, không thể huỷ");
    }

    await BookingModel.updateStatus(booking_id, "CANCELLED");

    return this.getBookingDetail(booking_id);
  },
};
