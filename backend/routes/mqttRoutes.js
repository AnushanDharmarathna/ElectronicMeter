// backend/routes/mqttRoutes.js
const express = require("express");
const router = express.Router();
const mqttService = require("../services/mqttService");

// GET /api/mqtt/events → SSE stream
router.get("/events", (req, res) => {
  mqttService.addClient(res);
});

module.exports = router;