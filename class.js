const express = require("express");
const router = express.Router();
const db = require("../db");

// Create Class
router.post("/create", (req, res) => {
    const { teacher_id, subject, department, date } = req.body;

    db.query(
        "INSERT INTO classes(teacher_id,subject,department,created_at) VALUES (?,?,?,?)",
        [teacher_id, subject, department, date],
        (err) => {
            if (err) return res.send(err);
            res.send("Class created");
        }
    );
});

// Get Classes
router.get("/", (req, res) => {
    db.query("SELECT * FROM classes", (err, result) => {
        res.json(result);
    });
});

module.exports = router;