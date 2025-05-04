const express = require('express');
const bcryptjs = require('bcryptjs');
const router = express.Router();
const mysql = require('mysql2');

router.get('/', (req, res) => {
    res.render('signup', {title: 'City Finder Signup Page'});
  });

router.post('/',  (req, res) => {
    console.log('signup route hit');
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('Missing required fields');
    }

    bcryptjs.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          console.error('error hashing password ', err);
          return res.status(500).send('error hashing password');
      }
      addDB(username, email, hashedPassword, res);
  })
});

function addDB(username, email, hashedPassword, res) {
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
    db.query(sql, [email, username, hashedPassword], (err, result) => {
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

