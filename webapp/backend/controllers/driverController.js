const { query } = require("../config/db");

// Fetch all drivers
exports.getDrivers = async (req, res) => {
  try {
    const drivers = await query("SELECT * FROM driver");
    res.json(drivers);
  } catch (err) {
    console.error("Error fetching drivers:", err);
    res.status(500).json({ error: "Failed to fetch drivers" });
  }
};

// Add a new driver
exports.addDriver = async (req, res) => {
  try {
    const {
      name, licenseType, dlNumber, issueDate, expiryDate, issuingAuthority,
      dateOfBirth, gender, phoneNumber, email, permanentAddress, vehicleNumber
    } = req.body;

    const payload = [
      name || null,
      licenseType || null,
      dlNumber || null,
      issueDate || null,
      expiryDate || null,
      issuingAuthority || null,
      dateOfBirth || null,
      gender || null,
      phoneNumber || null,
      email || null,
      permanentAddress || null,
      vehicleNumber || null
    ];

    const sql = `
      INSERT INTO driver
      (name, license_type, dl_number, issue_date, expiry_date, issuing_authority,
       date_of_birth, gender, phone_number, email, permanent_address, vehicle_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, payload);

    res.json({ message: "Driver added successfully", driver_id: result.insertId });
  } catch (err) {
    console.error("Error adding driver:", err);
    res.status(500).json({ error: "Failed to add driver" });
  }
};


// backend/controllers/driverController.js
// ✅ Toggle driver status (available <-> assigned)
exports.toggleDriver = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const [driver] = await query("SELECT status FROM driver WHERE driver_id = ?", [id]);
    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    // Flip status
    const newStatus = driver.status === "available" ? "assigned" : "available";

    await query("UPDATE driver SET status = ? WHERE driver_id = ?", [newStatus, id]);

    res.json({ message: `Driver status updated to ${newStatus}`, status: newStatus });
  } catch (err) {
    console.error("Error toggling driver status:", err);
    res.status(500).json({ error: "Failed to toggle driver status" });
  }
};
