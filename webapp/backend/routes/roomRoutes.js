// backend/routes/roomRoutes.js
const express = require("express");
const { getRooms, addRoom } = require("../controllers/roomController");
const router = express.Router();

// GET /api/rooms  -> fetch all rooms
router.get("/", getRooms);

// POST /api/rooms -> add a new room
router.post("/", addRoom);

module.exports = router;
