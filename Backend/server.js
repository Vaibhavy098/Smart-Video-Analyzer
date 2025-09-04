const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
require('dotenv').config();

const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(bodyParser.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
});

// Import database configuration
const db = require('./db');

// Test database connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("⚠️  Server will run but database operations will fail");
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// Insert video result
app.post("/api/videos/add", (req, res) => {
  const { video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent } = req.body;

  const sql = "INSERT INTO video_tests (video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [video_name, startup_time, buffering_count, buffering_duration, avg_resolution, freeze_percent], (err, result) => {
    if (err) {
      console.error("Database insert error:", err.message);
      res.status(500).json({ error: "Database error", message: err.message });
      return;
    }

    // ✅ Emit event to all connected clients
    io.emit("new_result", {
      id: result.insertId,
      video_name,
      startup_time,
      buffering_count,
      buffering_duration,
      avg_resolution,
      freeze_percent
    });

    res.json({ message: "Data inserted", id: result.insertId });
  });
});

// Get all video results
app.get("/api/videos", (req, res) => {
  db.query("SELECT * FROM video_tests", (err, results) => {
    if (err) {
      console.error("Database query error:", err.message);
      res.status(500).json({ error: "Database error", message: err.message });
      return;
    }
    res.json(results);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Ready to accept connections from frontend`);
  console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
});
