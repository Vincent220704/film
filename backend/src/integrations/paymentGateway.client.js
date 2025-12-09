// backend/src/integrations/paymentGateway.client.js
import axios from "axios";
import crypto from "crypto";

const {
  MOMO_PARTNER_CODE,
  MOMO_ACCESS_KEY,
  MOMO_SECRET_KEY,
  MOMO_ENDPOINT,
  MOMO_REDIRECT_URL,
  MOMO_IPN_URL,
} = process.env;

function signCreatePayment({ amount, orderId, orderInfo, requestId }) {
  const raw =
    `accessKey=${MOMO_ACCESS_KEY}` +
    `&amount=${amount}` +
    `&extraData=` +
    `&ipnUrl=${MOMO_IPN_URL}` +
    `&orderId=${orderId}` +
    `&orderInfo=${orderInfo}` +
    `&partnerCode=${MOMO_PARTNER_CODE}` +
    `&redirectUrl=${MOMO_REDIRECT_URL}` +
    `&requestId=${requestId}` +
    `&requestType=captureWallet`;

  return crypto.createHmac("sha256", MOMO_SECRET_KEY).update(raw).digest("hex");
}

export async function createMomoPayment({ orderId, requestId, amount, orderInfo }) {
  const signature = signCreatePayment({ amount, orderId, orderInfo, requestId });

  const payload = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl: MOMO_REDIRECT_URL,
    ipnUrl: MOMO_IPN_URL,
    extraData: "",
    requestType: "captureWallet",
    signature,
    lang: "vi",
  };

  const { data } = await axios.post(MOMO_ENDPOINT, payload);

  return data; // trả về payUrl, deeplink, qrCodeUrl...
}
