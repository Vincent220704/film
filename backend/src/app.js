import express from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import moviesRouter from "./routes/movies.routes.js";
import cinemasRouter from "./routes/cinemas.routes.js";
import roomsRouter from "./routes/rooms.routes.js";
import seatsRouter from "./routes/seats.routes.js";
import showtimesRouter from "./routes/showtimes.routes.js";
import bookingsRouter from "./routes/bookings.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";

const app = express();

// Cấu hình CORS
app.use(cors({
  origin: 'http://localhost:3001',  // Cổng frontend của bạn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Cho phép các phương thức này
}));

// Middleware để xử lý JSON requests
app.use(express.json());

// Các route hệ thống
app.use("/api/health", healthRouter);

// Các route khác
app.use("/api/auth", authRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/cinemas", cinemasRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/seats", seatsRouter);
app.use("/api/showtimes", showtimesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRoutes);

// 404 fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
