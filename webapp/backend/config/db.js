// backend/config/db.js
const mysql = require("mysql2/promise");

/**
 * Update the defaults below OR set OS env vars:
 * DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME
 * (No dotenv needed.)
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "4703@Mayank",           // <= put your MySQL password
  database: process.env.DB_NAME || "hotel", // <= match your SQL script DB
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function ensureConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log("✅ MySQL connection OK");
  } finally {
    conn.release();
  }
}

// Helper to run queries with async/await
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { pool, ensureConnection, query };
