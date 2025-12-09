import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

/**
 * Liveness: API còn sống
 */
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * Readiness: API + DB
 */
router.get("/db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({
      status: "ok",
      db: "connected",
      rows
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      db: "error",
      message: err.message
    });
  }
});

export default router;
