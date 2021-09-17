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
    // Select ... manager first name and last when we only defined manager_id?
    `SELECT e.employee.id, first_name, last_name, title, department_name, salary, f.manager_id as concat(firstName, " ", lastName)
    FROM employee e, employee f
    WHERE e.employee.id = f.employee.id and e.manager_id <> f.manager_id
    INNER JOIN employee_role on employee.role_id = employee_role.id
    INNER JOIN department on department.id = employee_role.department_id`,
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
        message: "Name of New Department:",
        name: "departmentName",
      },
    ])
    .then(function (response) {
      const sql = `INSERT INTO department (department_name)
    VALUES (?)`;

      db_connection.query(sql, response.departmentName, (err, result) => {
        if (err) throw err;
        console.log(" New Department Added 🏢");
        console.log("");
        return employeeTracker();
      });
    });
}

function addRole() {
  var currentDepartments = [];

  inquirer
    .prompt([
      {
        type: "input",
        message: "Title for New Role:",
        name: "roleTitle",
      },
      {
        type: "input",
        message: "Salary for New Role:",
        name: "roleSalary",
      },
      {
        type: "list",
        message: "Department to which New Role belongs to:",
        name: "roleDepartment",
        // HOW DO I PULL FROM THE DB??
        choices: currentDepartments,
      },
    ])
    .then(function (response) {
      // How does the individual department name get converted to department_id?
      const sql = `INSERT INTO employee_role (title, salary, department_id)
    VALUES (?)`;

      db_connection.query(
        sql,
        response.roleTitle,
        response.roleSalary,
        response.roleDepartment,
        (err, result) => {
          if (err) throw err;
          console.log(" New Role Added 💼");
          console.log("");
          return employeeTracker();
        }
      );
    });
}

function addEmployee() {
  var currentManagers = [];

  inquirer
    .prompt([
      {
        type: "input",
        message: "FIRST Name of New Employee:",
        name: "firstName",
      },
      {
        type: "input",
        message: "LAST Name of New Employee:",
        name: "lastName",
      },
      {
        type: "list",
        message: "Who is the Manager for the New Employee:",
        name: "roleDepartment",
        choices: currentManagers,
      },
    ])
    .then(function (response) {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?)`;

      db_connection.query(
        sql,
        response.roleTitle,
        response.roleSalary,
        response.roleDepartment,
        (err, result) => {
          if (err) throw err;
          console.log(" New Role Added 💼");
          console.log("");
          return employeeTracker();
        }
      );
    });
}

function updateEmployee() {
  var currentEmployees = [];
  var currentRoles = [];

  inquirer
    .prompt([
      {
        type: "list",
        message: "Which Employee would you like to Update:",
        name: "updatedEmployee",
        choices: currentEmployees,
      }
        .then(function (selectedEmployee) {
          // HOW to go forward???????
          selectedEmployee.role_id;
        })
        .prompt([
          {
            type: "list",
            message: "What is the Employee's New Role:",
            name: "updatedRole",
            choices: currentRoles,
          },
        ]),
    ])
    .then(function (response) {
      const sql = `UPDATE reviews SET review = ? WHERE id = ?`;

      db_connection.query(sql, response.updatedRole, (err, result) => {
        if (err) throw err;
        console.log(" Employee Role Updated! 👤");
        console.log("");
        return employeeTracker();
      });
    });
}
