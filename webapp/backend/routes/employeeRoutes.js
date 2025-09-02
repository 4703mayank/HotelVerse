const express = require("express");
const { getEmployees, addEmployee } = require("../controllers/employeeController");

const router = express.Router();


router.get("/", getEmployees);
router.post("/", addEmployee);

module.exports = router;
