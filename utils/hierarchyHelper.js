const Employee = require("../models/Employee");

//  Get all direct reportees of a manager

exports.getDirectReportees = async (managerId) => {
  return await Employee.find({ managerId });
};

// build the complete organization hierarchy tree
// Tree structure with nested children

exports.buildHierarchyTree = async () => {
  // Get all employees
  const allEmployees = await Employee.find().lean();

  // create a map for quick lookup
  const employeeMap = {};
  allEmployees.forEach((emp) => {
    employeeMap[emp.employeeId] = { ...emp, children: [] };
  });

  // build tree structure
  const tree = [];

  allEmployees.forEach((emp) => {
    if (emp.managerId && employeeMap[emp.managerId]) {
      // add as child to manager
      employeeMap[emp.managerId].children.push(employeeMap[emp.employeeId]);
    } else {
      // Top-level employee (CEO/no manager)
      tree.push(employeeMap[emp.employeeId]);
    }
  });

  return tree;
};
