// backend/src/services/payment.service.js
import { PaymentModel } from "../models/payment.model.js";
import { BookingModel } from "../models/booking.model.js";

export const PaymentService = {
  // Xử lý khi MoMo redirect về: GET /api/payments/return
  async handleReturnFromMomo(query) {
    const { orderId, resultCode, amount, message } = query;

    if (!orderId) {
      throw new Error("orderId is required");
    }

    // 1. Tìm payment theo orderId
    const payment = await PaymentModel.findByOrderId(orderId);
    if (!payment) {
      throw new Error("Payment not found");
    }

    // 2. Nếu đã SUCCESS rồi -> không cho đổi nữa
    if (payment.status === "SUCCESS") {
      return {
        bookingId: payment.booking_id,
        status: "SUCCESS_ALREADY",
        momoMessage: message,
      };
    }

    // 3. Nếu đã FAILED rồi -> cũng không cho đổi nữa
    if (payment.status === "FAILED") {
      return {
        bookingId: payment.booking_id,
        status: "FAILED_ALREADY",
        momoMessage: message,
      };
    }

    // => Đến đây chắc chắn payment đang ở trạng thái PENDING

    // 4. Kiểm tra số tiền + resultCode
    const paidAmount = Number(amount);
    const expectedAmount = Number(payment.amount);
    const isSuccess =
      paidAmount === expectedAmount && Number(resultCode) === 0; // 0 = thanh toán thành công bên MoMo

    let status;

    if (isSuccess) {
      // Thanh toán thành công
      await PaymentModel.updateStatusByOrderId(orderId, "SUCCESS");

      const paid_at = new Date();
      await BookingModel.updatePayment(payment.booking_id, {
        status: "PAID",
        payment_method: "MOMO",
        payment_ref: orderId,
        paid_at,
      });

      status = "SUCCESS";
    } else {
      // Thanh toán thất bại / huỷ
      await PaymentModel.updateStatusByOrderId(orderId, "FAILED");
      await BookingModel.updateStatus(payment.booking_id, "CANCELLED");
      status = "FAILED";
    }

    return {
      bookingId: payment.booking_id,
      status,
      momoMessage: message,
    };
  },
};
