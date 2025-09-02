// routes/dashboard.js
const express = require("express");
const { query } = require("../config/db");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const [employees] = await query("SELECT COUNT(*) AS count FROM employee");
    const [rooms] = await query("SELECT COUNT(*) AS count FROM room");
    const [drivers] = await query("SELECT COUNT(*) AS count FROM driver");
    const [availableRooms] = await query(
      "SELECT COUNT(*) AS count FROM room WHERE current_status = 'available'"
    );

    res.json({
      employees: employees.count,
      rooms: rooms.count,
      drivers: drivers.count,
      availableRooms: availableRooms.count,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

module.exports = router;   // ✅ export router
