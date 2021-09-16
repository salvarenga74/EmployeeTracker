const mysql = require("mysql2");

const db_connection = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    password: "",
    database: "workPlace_db",
  },
  console.log(`Connected to the workPlace database 🗃`)
);

db_connection.connect(function (err) {
  if (err) throw err;
});

module.exports = db_connection;
