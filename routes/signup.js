const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

router.post('/add-user',  (req, res,) => {
    const {username, email, password} = req.body;
});

function addDB() {
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Spacewolf",
    database: "Cityfinder"
  });

  db.connect(err => {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    var sql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
    db.query(sql, [username, email, password], (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");

      db.end((error) => {
        if (error) {
          console.error('Error closing MySQL connection:', error);
          return;
        }
      })
    });
    console.log("Connected to MySQL database.");
  });
}
module.exports = router;

