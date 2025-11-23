const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname));

const filePath = path.join(__dirname, "js", "sightings.json");

// GET all sightings
app.get("/api", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "File read error" });
    let sightings = [];
    try { sightings = JSON.parse(data); } catch(e) { sightings = []; }
    res.json(sightings);
  });
});

// POST a new sighting
app.post("/api", (req, res) => {
  const newSighting = req.body;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ success: false, message: "File read error" });

    let sightings = [];
    try { sightings = JSON.parse(data); } catch(e) { sightings = []; }

    const lastId = sightings.length > 0 ? sightings[sightings.length - 1].id || 0 : 0;
    newSighting.id = lastId + 1;
    
    sightings.push(newSighting);

    fs.writeFile(filePath, JSON.stringify(sightings, null, 2), err => {
      if (err) return res.status(500).json({ success: false, message: "File write error" });
      res.json({ success: true });
    });
  });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
