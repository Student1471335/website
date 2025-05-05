var express = require('express');
const bcryptjs = require('bcryptjs');
var router = express.Router();
const mysql = require('mysql2');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('profile', { title: 'CityFinderUserPage' });
});

router.post('/', (req, res) => {
  const { UserID } = req.body;
  readFromDB(UserID, res);

  console.log("hi");
});

router.delete('/delete', (req, res) => {
  const { UserID } = req.body;

  deleteFromDB(UserID, res);

  console.log("hi2");
});

function readFromDB(UserID, res) {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Spacewolf", //redact this in the final version
    database: "Cityfinder"
  });

  db.connect(err => {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    var sql = "SELECT username, email FROM users where UserID = ?";

    db.query(sql, [UserID], (err, result) => {
      if (err) throw err;
      console.log(result[0]);
      res.json({ username: result[0].username });


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

function deleteFromDB(UserID, res) {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Spacewolf",
    database: "Cityfinder"
  });

  var sql = "DELETE FROM users WHERE UserID = ?";
  db.query(sql, [UserID], (err, result) => {
    if (err) throw err;
  });
  db.end();
}
module.exports = router;
