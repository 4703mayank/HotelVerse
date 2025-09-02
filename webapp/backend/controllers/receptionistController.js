const { query } = require("../config/db");
const bcrypt = require("bcryptjs");

// Add new receptionist
exports.addReceptionist = async (req, res) => {
  try {
    const {
      full_name,
      date_of_birth,
      gender,
      phone_number,
      email,
      permanent_address,
      current_address,
      job_title,
      department,
      joining_date,
      employee_type,
      salary,
      bank_name,
      account_number,
      ifsc_code,
      pan_number,
      govt_id_number
    } = req.body;

    // Validate required fields
    if (!full_name || !date_of_birth || !gender || !phone_number || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Extract year of birth for password
    const yearOfBirth = new Date(date_of_birth).getFullYear();
    const rawPassword = `rec@${yearOfBirth}`;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 1️⃣ Insert receptionist into employee table
    const result = await query(
      `INSERT INTO employee 
      (full_name, date_of_birth, gender, phone_number, email, permanent_address, current_address, 
       job_title, department, joining_date, employee_type, salary, bank_name, account_number, ifsc_code, pan_number, govt_id_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        date_of_birth,
        gender,
        phone_number,
        email,
        permanent_address || "",
        current_address || "",
        job_title || "Receptionist",
        department || "Front Desk",
        joining_date || new Date(),
        employee_type || "full-time",
        salary || 0,
        bank_name || "",
        account_number || "",
        ifsc_code || "",
        pan_number || "",
        govt_id_number || ""
      ]
    );

    const employee_id = result.insertId;

    // 2️⃣ Insert into users table (for login)
    await query(
      "INSERT INTO users (username, password, role, employee_id) VALUES (?, ?, ?, ?)",
      [phone_number, hashedPassword, "RECEPTIONIST", employee_id]
    );

    // 3️⃣ Return credentials
    res.json({
      message: "Receptionist added successfully",
      username: phone_number,
      password: rawPassword
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
