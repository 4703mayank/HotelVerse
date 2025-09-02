// backend/server.js
const express = require("express");
const cors = require("cors");
const { ensureConnection, query } = require("./config/db");

const app = express();

// --- Global middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/drivers", require("./routes/driverRoutes"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/receptionists", require("./routes/receptionistRoutes"));
app.use("/api/customers",  require("./routes/customerRoutes"));

// --- Health check ---
app.get("/api/health", async (req, res) => {
  try {
    await query("SELECT 1 AS ok");
    res.json({ status: "ok", db: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", db: false });
  }
});

// ✅ Fallback 404 for unknown API routes (keep this LAST!)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// --- Start server only after DB is reachable ---
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await ensureConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to MySQL. Check credentials & DB name.");
    console.error(err);
    process.exit(1);
  }
})();
