const Employee = require("../models/Employee");

// validate employee data
exports.validateEmployeeData = (req, res, next) => {
  const { employeeId, name, email, position, department } = req.body;

  const errors = [];

  if (!employeeId || employeeId.trim() === "") {
    errors.push("employee ID is required");
  }

  if (!name || name.trim() === "") {
    errors.push("name is required");
  }

  if (!email || email.trim() === "") {
    errors.push("email is required");
  }

  if (!position || position.trim() === "") {
    errors.push("position is required");
  }

  if (!department || department.trim() === "") {
    errors.push("department is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "validation failed",
      errors,
    });
  }

  next();
};
