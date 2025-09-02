// seedAdmin.js
const bcrypt = require("bcryptjs");
const { query } = require("./db");

async function seedAdmin() {
  const password = await bcrypt.hash("admin123", 10);
  await query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ["admin", password, "ADMIN"]);
  console.log("Admin user seeded!");
}

seedAdmin();
