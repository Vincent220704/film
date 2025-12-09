// backend/src/models/booking.model.js
import { pool } from "../config/db.js";

export const BookingModel = {
  async createBooking(data) {
    const {
      user_id,
      showtime_id,
      voucher_id,
      booking_code,
      status,
      total_amount,
      discount_amount,
      final_amount,
      payment_method = null,
      payment_ref = null,
      paid_at = null,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO bookings (
        user_id, showtime_id, voucher_id, booking_code,
        status, total_amount, discount_amount, final_amount,
        payment_method, payment_ref, paid_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user_id,
        showtime_id,
        voucher_id,
        booking_code,
        status,
        total_amount,
        discount_amount,
        final_amount,
        payment_method,
        payment_ref,
        paid_at,
      ]
    );

    return { id: result.insertId, ...data };
  },

  async addSeats(booking_id, seatsWithPrice) {
    if (!seatsWithPrice.length) return;

    const values = seatsWithPrice.map((s) => [
      booking_id,
      s.seat_id,
      s.price,
    ]);

    await pool.query(
      `INSERT INTO booking_seats (booking_id, seat_id, price)
       VALUES ?`,
      [values]
    );
  },

  async addCombos(booking_id, combos) {
    if (!combos || !combos.length) return;

    const values = combos.map((c) => [
      booking_id,
      c.combo_id,
      c.quantity,
      c.unit_price,
    ]);

    await pool.query(
      `INSERT INTO booking_combos (booking_id, combo_id, quantity, unit_price)
       VALUES ?`,
      [values]
    );
  },

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT 
          b.*,
          s.start_time, s.end_time, s.base_price, s.format, s.language,
          m.title AS movie_title,
          r.name  AS room_name,
          c.name  AS cinema_name,
          v.code  AS voucher_code
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies   m ON s.movie_id = m.id
       JOIN rooms    r ON s.room_id = r.id
       JOIN cinemas  c ON r.cinema_id = c.id
       LEFT JOIN vouchers v ON b.voucher_id = v.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async getSeatsForBooking(booking_id) {
    const [rows] = await pool.query(
      `SELECT 
          bs.id,
          bs.booking_id,
          bs.seat_id,
          bs.price,
          bs.created_at,
          se.row_label,
          se.seat_number,
          se.seat_type
       FROM booking_seats bs
       JOIN seats se ON bs.seat_id = se.id
       WHERE bs.booking_id = ?
       ORDER BY se.row_label, se.seat_number`,
      [booking_id]
    );
    return rows;
  },

  async getCombosForBooking(booking_id) {
    const [rows] = await pool.query(
      `SELECT 
          bc.id,
          bc.booking_id,
          bc.combo_id,
          bc.quantity,
          bc.unit_price,
          bc.created_at,
          cb.name,
          cb.description
       FROM booking_combos bc
       JOIN combos cb ON bc.combo_id = cb.id
       WHERE bc.booking_id = ?`,
      [booking_id]
    );
    return rows;
  },

  async getByUser(user_id) {
    const [rows] = await pool.query(
      `SELECT 
          b.*,
          s.start_time, s.end_time,
          m.title AS movie_title,
          c.name  AS cinema_name
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies   m ON s.movie_id = m.id
       JOIN rooms    r ON s.room_id = r.id
       JOIN cinemas  c ON r.cinema_id = c.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  async findExistingSeatsForShowtime(showtime_id, seat_ids) {
    if (!seat_ids.length) return [];

    const [rows] = await pool.query(
      `SELECT bs.seat_id
       FROM booking_seats bs
       JOIN bookings b ON bs.booking_id = b.id
       WHERE b.showtime_id = ?
         AND b.status IN ('PENDING','PAID')
         AND bs.seat_id IN (?)`,
      [showtime_id, seat_ids]
    );

    return rows.map((r) => r.seat_id);
  },

  async updatePayment(id, { status, payment_method, payment_ref, paid_at }) {
    await pool.query(
      `UPDATE bookings
       SET status = ?,
           payment_method = ?,
           payment_ref = ?,
           paid_at = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, payment_method, payment_ref, paid_at, id]
    );
  },

  async updateStatus(id, status) {
    await pool.query(
      `UPDATE bookings
       SET status = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [status, id]
    );
  },

  async findById(id) {
    return this.getById(id);
  },

  async markPaid(id) {
    const paid_at = new Date();
    await this.updatePayment(id, {
      status: "PAID",
      payment_method: "MOMO",
      payment_ref: null,
      paid_at,
    });
  },

  async markCanceled(id) {
    await this.updateStatus(id, "CANCELLED");
  },

  async expireOldPending(expireMinutes) {
    const [result] = await pool.query(
      `UPDATE bookings
       SET status = 'CANCELLED',
           updated_at = CURRENT_TIMESTAMP
       WHERE status = 'PENDING'
         AND created_at < (CURRENT_TIMESTAMP - INTERVAL ? MINUTE)`,
      [expireMinutes]
    );

    // trả về số hàng bị ảnh hưởng để log
    return result.affectedRows;
  },
};

