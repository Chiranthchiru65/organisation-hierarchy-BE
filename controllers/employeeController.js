const Employee = require("../models/Employee");
const {
  getDirectReportees,
  buildHierarchyTree,
} = require("../utils/hierarchyHelper");

exports.addEmployee = async (req, res, next) => {
  try {
    const { employeeId, name, email, position, department, managerId } =
      req.body;

    // check if employee alreeady exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employeeId }, { email }],
    });

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message:
          existingEmployee.employeeId === employeeId
            ? "Employee ID already exists"
            : "Email already exists",
      });
    }

    // vvalidate manager exists (if managerId provided)
    if (managerId) {
      const managerExists = await Employee.findOne({ employeeId: managerId });
      if (!managerExists) {
        return res.status(400).json({
          success: false,
          message: "Manager not found. Please provide a valid manager ID.",
        });
      }
    }

    // create employee
    const employee = await Employee.create({
      employeeId,
      name,
      email,
      position,
      department,
      managerId,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// get all employees

exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

//g et specific employee with manager details

exports.getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ employeeId: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // get manager details if exists
    let manager = null;
    if (employee.managerId) {
      manager = await Employee.findOne(
        { employeeId: employee.managerId },
        "employeeId name position department"
      );
    }

    // get direct reportees count
    const directReportees = await getDirectReportees(id);

    res.status(200).json({
      success: true,
      data: {
        ...employee.toObject(),
        manager,
        directReporteesCount: directReportees.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// update employee details

exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, position, department, managerId } = req.body;

    const employee = await Employee.findOne({ employeeId: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // if updating managerId, validate it
    if (managerId !== undefined && managerId !== employee.managerId) {
      if (managerId) {
        // check if new manager exists
        const managerExists = await Employee.findOne({ employeeId: managerId });
        if (!managerExists) {
          return res.status(400).json({
            success: false,
            message: "Manager not found",
          });
        }
      }
      employee.managerId = managerId;
    }

    // update other fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (position) employee.position = position;
    if (department) employee.department = department;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

//delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({ employeeId: id });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // check if employee has direct reportees
    const directReportees = await getDirectReportees(id);

    if (directReportees.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete employee: ${directReportees.length} employee(s) report to this person. Please reassign them first.`,
        directReportees: directReportees.map((emp) => ({
          employeeId: emp.employeeId,
          name: emp.name,
          position: emp.position,
        })),
      });
    }

    await Employee.deleteOne({ employeeId: id });

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//   get full organization hierarchy
exports.getHierarchy = async (req, res, next) => {
  try {
    const hierarchyTree = await buildHierarchyTree();

    res.status(200).json({
      success: true,
      data: hierarchyTree,
    });
  } catch (error) {
    next(error);
  }
};
