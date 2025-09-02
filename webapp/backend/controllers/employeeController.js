const bcrypt = require("bcryptjs");
const { query } = require("../config/db"); // adjust path to your DB config

// Get all employees - THIS WAS MISSING!
exports.getEmployees = async (req, res) => {
  try {
    const employees = await query(`SELECT * FROM employee ORDER BY joining_date DESC`);
    res.json({
      status: "success",
      data: employees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Failed to fetch employees" });
  }
};

// Add employee
exports.addEmployee = async (req, res) => {
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

    // 1️⃣ Insert employee
    const employeeResult = await query(
      `INSERT INTO employee 
      (full_name, date_of_birth, gender, phone_number, email, permanent_address, current_address, job_title, department, joining_date, employee_type, salary, bank_name, account_number, ifsc_code, pan_number, govt_id_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name, date_of_birth, gender, phone_number, email, permanent_address, current_address,
        job_title, department, joining_date, employee_type, salary, bank_name, account_number, ifsc_code, pan_number, govt_id_number
      ]
    );

    const employeeId = employeeResult.insertId;

    let receptionistCredentials = null;

    // 2️⃣ If receptionist, create user account
    if (job_title.toLowerCase() === "receptionist") {
      const yearOfBirth = new Date(date_of_birth).getFullYear();
      const passwordPlain = `rec@${yearOfBirth}`;
      const hashedPassword = await bcrypt.hash(passwordPlain, 10);

      await query(
        `INSERT INTO users (username, password, role, employee_id) VALUES (?, ?, ?, ?)`,
        [phone_number, hashedPassword, "RECEPTIONIST", employeeId]
      );

      receptionistCredentials = { username: phone_number, password: passwordPlain };
    }

    res.json({
      status: "success",
      message: "Employee added successfully",
      employeeId,
      receptionistCredentials
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};