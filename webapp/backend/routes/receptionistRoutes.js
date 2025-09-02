const express = require("express");
const { addReceptionist } = require("../controllers/receptionistController");
const { verifyToken } = require("../controllers/authController");

const router = express.Router();

// Only ADMIN can add receptionists
router.post("/add", verifyToken(["ADMIN"]), addReceptionist);

module.exports = router;
