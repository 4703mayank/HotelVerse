const { query } = require("../config/db");

exports.getCustomers = async (req, res) => {
  try {
    console.log("Fetching customers..."); // Debug log
    
    const customers = await query(`
      SELECT 
        c.customer_id,
        c.full_name,
        c.phone_number,
        r.room_number,
        b.check_in,
        b.check_out,
        b.number_of_guests,
        b.total_bill,
        b.status
      FROM customer c
      LEFT JOIN booking b ON c.customer_id = b.customer_id
      LEFT JOIN room r ON b.room_id = r.room_id
      ORDER BY b.check_in DESC, c.customer_id DESC
    `);
    
    console.log(`Found ${customers.length} customers`); // Debug log
    
    res.json({
      status: "success",
      data: customers
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ 
      status: "error", 
      message: "Failed to fetch customers",
      error: err.message // Include actual error for debugging
    });
  }
};