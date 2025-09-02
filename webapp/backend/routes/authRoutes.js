const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");

router.post("/employees", employeeController.addEmployee);

module.exports = router;
