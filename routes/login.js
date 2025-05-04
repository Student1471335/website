var express = require('express');
const bcryptjs = require('bcryptjs');
var router = express.Router();
const mysql = require('mysql2');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'CityFinderloginPage' });
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  readFromDB(email, password, res);
});

function readFromDB(email, password, res) {
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
    var sql = "SELECT UserID, email, password FROM users where email = ?";

    db.query(sql, [email], (err, result) => {
      if (err) throw err;
      console.log(result[0]);

      if (result[0] === undefined) {
        res.status(401).send("Wrong email, try again");
      }
      else {
        const hashedPassword = result[0].password;

        bcryptjs.compare(password, hashedPassword, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            console.log("Login successful");

            res.json({UserID: result[0].UserID});
          }
          else {
            res.status(401).send("Wrong password, try again");
          }
        });
      }
      const UserID = result[0].UserID;
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
