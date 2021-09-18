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
    `SELECT employee.id, employee.first_name, employee.last_name, title, department_name AS department, salary, 
    CONCAT(manager.first_name, " ", manager.last_name) AS manager 
    FROM employee
    LEFT JOIN employee_role on employee.role_id = employee_role.id
    LEFT JOIN department on employee_role.department_id = department.id
    LEFT JOIN employee manager on employee.manager_id = manager.id`,
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
  db_connection.query("SELECT * FROM department", function (err, results) {
    const departmentChoices = results.map((result) => {
      return {
        name: result.department_name,
        value: result.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "Title for New Role:",
          name: "title",
        },
        {
          type: "input",
          message: "Salary for New Role:",
          name: "salary",
        },
        {
          type: "list",
          message: "Department to which New Role belongs to:",
          name: "department_id",
          choices: departmentChoices,
        },
      ])
      .then(function (response) {
        const sql = `INSERT INTO employee_role SET ?`;

        db_connection.query(sql, response, (err, result) => {
          if (err) throw err;
          console.log(" New Role Added 💼");
          console.log("");
          return employeeTracker();
        });
      });
  });
}

function addEmployee() {
  db_connection.query(
    "SELECT title FROM employee_role",
    function (err, results) {
      const roleChoices = results.map((result) => {
        return {
          name: result.department_name,
          value: result.id,
        };
      });
      db_connection.query(
        `SELECT CONCAT(manager.first_name, " ", manager.last_name) 
    FROM employee 
    LEFT JOIN employee manager on employee.manager_id = manager.id`,
        function (err, results) {
          const managerChoices = results.map((result) => {
            return {
              name: result.manager,
              value: result.manager_id,
            };
          });
          inquirer
            .prompt([
              {
                type: "input",
                message: "FIRST Name of New Employee:",
                name: "first_name",
              },
              {
                type: "input",
                message: "LAST Name of New Employee:",
                name: "last_name",
              },
              {
                type: "list",
                message: "Who is the Role for the New Employee:",
                name: "employeeRole",
                choices: roleChoices,
              },
              {
                type: "list",
                message: "Who is the Manager for the New Employee:",
                name: "employeeManager",
                choices: managerChoices,
              },
            ])
            .then(function (response) {
              const sql = `INSERT INTO employee SET (?)`;

              db_connection.query(sql, response, (err, result) => {
                if (err) throw err;
                console.log(" New Role Added 💼");
                console.log("");
                return employeeTracker();
              });
            });
        }
      );
    }
  );
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
