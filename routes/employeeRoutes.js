const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getHierarchy,
} = require("../controllers/employeeController");

// http://localhost:5000/api/employees/hierarchy/tree
router.get("/hierarchy/tree", getHierarchy);

// CRUD routes
router.post("/", addEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

module.exports = router;
