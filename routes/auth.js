const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "MySerectKey"; // Use an environment variable in production

const app = express();
app.use(bodyParser.json());

// Create MySQL connection
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
    console.log("Connected to MySQL database.");
});

// User login route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (results.length === 0) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ success: true, token });
    });
});

// User registration route
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const apiKey = crypto.randomBytes(32).toString("hex"); // Generate API Key

    db.query("INSERT INTO users (email, passwordHash, api_key) VALUES (?, ?, ?)", [email, passwordHash, apiKey], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, message: "User registered successfully" });
    });
});

// Middleware to verify JWT tokens
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.userId = decoded.userId;
        next();
    });
};

// Example protected route
app.get("/api/protected", verifyToken, (req, res) => {
    res.json({ message: "This is a protected route!" });
});

app.listen(500, () => console.log("Server running on port 3000"));

