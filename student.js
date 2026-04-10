const express = require("express");
const router = express.Router();
const db = require("../db");

// Enroll Student
router.post("/enroll", (req, res) => {
    const { name, email, department, year } = req.body;

    const eligible = year >= 1 && year <= 4;

    db.query(
        "INSERT INTO students(name,email,department,year,eligible) VALUES (?,?,?,?,?)",
        [name, email, department, year, eligible],
        (err) => {
            if (err) return res.send(err);
            res.send({ message: "Student enrolled", eligible });
        }
    );
});

// Get Students
router.get("/", (req, res) => {
    db.query("SELECT * FROM students", (err, result) => {
        res.json(result);
    });
});

module.exports = router;