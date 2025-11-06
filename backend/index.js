// backend/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');

// === NEW: Import MQTT service & route ===
const mqttService = require('./services/mqttService');
const mqttRoutes = require('./routes/mqttRoutes');

dotenv.config();
const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173"  // Allow Vite frontend
}));
app.use(express.json());

// Serve static files (images)
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOADS_DIR)));

// Mount routes
app.use('/api', authRoutes);           // ← existing
app.use('/api/mqtt', mqttRoutes);      // ← NEW: SSE endpoint

// === NEW: Start MQTT → SSE bridge ===
mqttService.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`SSE stream: http://localhost:${PORT}/api/mqtt/events`);
});