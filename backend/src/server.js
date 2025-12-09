import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { startBookingExpiryJob } from "./jobs/bookingExpiry.job.js";

const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`🚀 Backend running on port ${env.PORT}`);
  startBookingExpiryJob();
});
