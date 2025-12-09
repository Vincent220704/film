// backend/src/jobs/bookingExpiry.job.js
import { BookingModel } from "../models/booking.model.js";

const EXPIRE_MINUTES = Number(process.env.BOOKING_EXPIRE_MINUTES || 15);

export function startBookingExpiryJob() {
  const intervalMs = 60 * 1000; // chạy mỗi 1 phút

  console.log(
    `[BookingExpiryJob] Start: tự hủy booking PENDING sau ${EXPIRE_MINUTES} phút`
  );

  setInterval(async () => {
    try {
      const affected = await BookingModel.expireOldPending(EXPIRE_MINUTES);
      if (affected > 0) {
        console.log(
          `[BookingExpiryJob] Đã tự hủy ${affected} booking PENDING quá hạn`
        );
      }
    } catch (err) {
      console.error("[BookingExpiryJob] Lỗi khi expire booking:", err);
    }
  }, intervalMs);
}
