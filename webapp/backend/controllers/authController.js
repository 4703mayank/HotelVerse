const { query } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Use environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// --- LOGIN CONTROLLER ---
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    // 1️⃣ Fetch user from DB
    const users = await query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = users[0];

    // 2️⃣ Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3️⃣ Sign JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role, employee_id: user.employee_id },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // 4️⃣ Send response
    res.json({
      message: "Login successful",
      token,
      role: user.role,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- MIDDLEWARE TO PROTECT ROUTES ---
exports.verifyToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(403).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Token missing" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid or expired token" });

      // Check role if restricted
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden: insufficient rights" });
      }

      req.user = decoded; // attach decoded info to request
      next();
    });
  };
};
