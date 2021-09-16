const inquirer = require("inquirer");
const db_connection = require("./db/connection");
require("console.table");

employeeTracker();

function employeeTracker() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to view?",
        name: "actionChoice",
        choices: [
          "View All Departments",
          "View all Roles",
          "View all Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then((data) => {
      switch (data.actionChoice) {
        case "View All Departments":
          console.log("");
          allDepartments();
          break;
        case "View all Roles":
          console.log("");
          allRoles();
          break;
        case "View all Employees":
          console.log("");
          allEmployees();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        default:
          console.log("Please select an available option");
      }
    })
    .catch((err) => console.error(err));
}

function allDepartments() {
  db_connection.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    return employeeTracker();
  });
}

function allRoles() {
  db_connection.query(
    `SELECT employee_role.id, title, department_name, salary 
    FROM employee_role 
    INNER JOIN department on department.id = employee_role.department_id`,
    function (err, results) {
      if (err) throw err;
      console.table(results);
      return employeeTracker();
    }
  );
}

function allEmployees() {
  db_connection.query(
    `SELECT employee.id, first_name, last_name, title, department, salary, manager
    FROM employee 
    INNER JOIN employee_role on employee.role_id = employee_role.id`,
    function (err, results) {
      if (err) throw err;
      console.table(results);
      return employeeTracker();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the Name of the New Department?",
        name: "departmentName",
      },
    ])

    .then(function (response) {
      const sql = `INSERT INTO department (department_name)
    VALUES (?)`;

      db_connection.query(sql, response.departmentName, (err, result) => {
        if (err) throw err;
        console.log(" New Department Added 🏢");
      });
    });
}

function addRole() {}

function addEmployee() {}

function updateEmployee() {}
