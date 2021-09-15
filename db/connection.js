const mysql = require("mysql2");

const db_connection = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  password: "",
  database: "workPlace_db",
});

db_connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = db_connection;
