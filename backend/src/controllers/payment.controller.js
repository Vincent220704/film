// backend/src/controllers/payment.controller.js
import { PaymentService } from "../services/payment.service.js";

export const PaymentController = {
  // POST /api/payments/webhook
  async webhook(req, res) {
    console.log("Webhook (ignored on localhost):", req.body);
    return res.status(200).json({ message: "Webhook ignored (localhost)" });
  },

  // GET /api/payments/return
  async returnFromMomo(req, res) {
    try {
      const result = await PaymentService.handleReturnFromMomo(req.query);

      // Sau này redirect về frontend được:
      // return res.redirect(`http://localhost:5173/payment-result?...`);

      return res.json(result);
    } catch (err) {
      console.error("ReturnFromMomo error:", err);
      return res.status(400).json({ message: err.message });
    }
  },
};
