const express = require("express");
const router = express.Router();
const db = require("../db");

// Insert test result
router.post("/add", (req, res) => {
  const { video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent } = req.body;

  const query = `INSERT INTO video_tests (video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent)
                 VALUES (?, ?, ?, ?, ?, ?)`;

  db.query(query, [video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json({ message: "Test result added successfully", id: result.insertId });
  });
});

// Fetch all results
router.get("/results", (req, res) => {
  const query = "SELECT * FROM video_tests ORDER BY test_timestamp DESC";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }
    res.json(results);
  });
});

module.exports = router;
