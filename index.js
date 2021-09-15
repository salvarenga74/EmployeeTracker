const inquirer = require("inquirer");
const db_connection = require("./db/connection");
require("console.table");

const optionsArray = [
  "View All Departments",
  "View all Roles",
  "View all Employees",
  "Add Department",
  "Add Role",
  "Add Employee",
  "Update Employee Role",
];

employeeTracker();

function employeeTracker() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "What would you like to view?",
        message: "actionChoice",
        choices: optionsArray,
      },
    ])
    .then((data) => {
      switch (data.actionChoice) {
        case "View All Departments":
          allDepartments();
          break;
        case "View all Roles":
          allRoles();
          break;
        case "View all Employees":
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
      }
    })
    .catch((err) => console.error(err));
}

function allDepartments() {
  db_connection.query("SELECT * FROM department", function (err, results) {
    console.table(results);
  });
  employeeTracker();
}

function allRoles() {
  db_connection.query(
    "SELECT title, id, department.department_name FROM employee_role",
    function (err, results) {
      console.log(results);
    }
  );
}

function allEmployees() {}

function addDepartment() {
  const sql = `INSERT INTO department (department-name)
    VALUES (?)`;
  const params = [body.department_name];
  connection.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
  });
}

function addRole() {}

function addEmployee() {}

function updateEmployee() {}
// Create a movie from mini project server.js
// connection.post("/api/new-movie", ({ body }, res) => {
//   const sql = `INSERT INTO movies (movie_name)
//       VALUES (?)`;
//   const params = [body.movie_name];

//   connection.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: body,
//     });
//   });
// });
