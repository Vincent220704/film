// backend/src/controllers/booking.controller.js
import { BookingService } from "../services/booking.service.js";

export const BookingController = {
  // POST /api/bookings
  async create(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user_id = req.user.id;
      const { showtime_id, seat_ids, combos, voucher_code } = req.body;

      // createBooking giờ sẽ:
      // - tạo booking
      // - lưu ghế
      // - tạo payment MoMo
      // - trả về: { booking_id, total, payUrl, momoResponse }
      const result = await BookingService.createBooking({
        user_id,
        showtime_id,
        seat_ids,
        combos,
        voucher_code,
      });

      res.status(201).json(result);
    } catch (err) {
      console.error("Create booking error:", err);
      res.status(400).json({ message: err.message || "Tạo booking thất bại" });
    }
  },

  // GET /api/bookings/:id
  async getDetail(req, res) {
    try {
      const bookingId = req.params.id;
      const booking = await BookingService.getBookingDetail(bookingId);
      res.json(booking);
    } catch (err) {
      console.error("Get booking detail error:", err);
      res
        .status(404)
        .json({ message: err.message || "Không tìm thấy booking" });
    }
  },

  // GET /api/bookings/me/history
  async getMine(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user_id = req.user.id;
      const bookings = await BookingService.getUserBookings(user_id);
      res.json(bookings);
    } catch (err) {
      console.error("Get user bookings error:", err);
      res
        .status(400)
        .json({ message: err.message || "Lấy lịch sử booking thất bại" });
    }
  },

  // PATCH /api/bookings/:id/pay
  async pay(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking_id = req.params.id;
      const { payment_method, payment_ref } = req.body;

      const booking = await BookingService.payBooking({
        booking_id,
        user_id: req.user.id,
        role: req.user.role,
        payment_method,
        payment_ref,
      });

      res.json(booking);
    } catch (err) {
      console.error("Pay booking error:", err);
      res.status(400).json({ message: err.message || "Thanh toán thất bại" });
    }
  },

  // PATCH /api/bookings/:id/cancel
  async cancel(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const booking_id = req.params.id;

      const booking = await BookingService.cancelBooking({
        booking_id,
        user_id: req.user.id,
        role: req.user.role,
      });

      res.json(booking);
    } catch (err) {
      console.error("Cancel booking error:", err);
      res.status(400).json({ message: err.message || "Huỷ booking thất bại" });
    }
  },
};
