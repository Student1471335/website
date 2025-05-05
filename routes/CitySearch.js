var express = require('express');
var router = express.Router();
const mysql = require('mysql2');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('CitySearch', { title: 'CityFinderSearchPage' });
});

router.post('/', (req, res) => {
  const { UserID, search } = req.body;
  if (UserID !== undefined || UserID !== "null") {
    addToHistory(UserID, search, res);
  }
});

function addToHistory(UserID, search) {
  const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Spacewolf",
    database: "Cityfinder"
  });
  if (UserID === "null"){
    return
  }

  db.connect(err => {
    if (err) {
      console.error("Database connection failed: " + err.stack);
      return;
    }
    var sql = "INSERT INTO userHistory (UserID, search) VALUES (?, ?)";
    db.query(sql, [UserID, search], (err, result) => {
      if (err) throw err;
      console.log("1 record inserted");

      db.end((error) => {
        if (error) {
          console.error('Error closing MySQL connection:', error);
          return;
        }
      })
    });
  });
}

module.exports = router;
