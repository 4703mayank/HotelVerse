const express = require("express");
const { addDriver, getDrivers, toggleDriver  } = require("../controllers/driverController");

const router = express.Router();

router.get("/", getDrivers);   // ✅ View all drivers
router.post("/", addDriver);   // ✅ Add new driver

router.put("/:id/toggle", toggleDriver);

module.exports = router;
