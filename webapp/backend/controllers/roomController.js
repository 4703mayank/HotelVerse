// backend/controllers/roomController.js
const { query } = require("../config/db");

/**
 * GET /api/rooms
 */
exports.getRooms = async (req, res) => {
  try {
    const rows = await query("SELECT * FROM room");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching rooms:", err);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

/**
 * POST /api/rooms
 * Expected JSON body:
 * {
 *   room_number, room_type, floor_number, bed_type, max_occupancy,
 *   base_price, extra_bed_charges, amenities, current_status,
 *   housekeeping_status, maintenance_notes
 * }
 */
exports.addRoom = async (req, res) => {
  try {
    const {
      room_number,
      room_type,
      floor_number,
      bed_type,
      max_occupancy,
      base_price,
      extra_bed_charges,
      amenities,
      current_status,
      housekeeping_status,
      maintenance_notes,
    } = req.body;

    const sql = `
      INSERT INTO room
      (room_number, room_type, floor_number, bed_type, max_occupancy,
       base_price, extra_bed_charges, amenities, current_status,
       housekeeping_status, maintenance_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      room_number,
      room_type,
      floor_number,
      bed_type,
      max_occupancy,
      base_price,
      extra_bed_charges,
      amenities,
      current_status,
      housekeeping_status,
      maintenance_notes,
    ]);

    res.json({  message: "Room added successfully", room_id: result.insertId });

  } catch (err) {
    console.error("Error adding room:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Room number already exists" });
    }
    res.status(500).json({ error: "Failed to add room" });
  }
};
