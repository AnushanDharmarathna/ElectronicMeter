// backend/routes/influxRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const { writeApi, queryApi, Point } = require('../config/influxService');

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Apply authentication to all routes
router.use(authenticateToken);

// Push Sensor Data
router.post('/push', async (req, res) => {
  const {
    sensor_id,
    measurement,
    value,
    device_sn,
  } = req.body;

  // ---- Validation -------------------------------------------------
  if (!sensor_id || typeof sensor_id !== 'string') {
    return res.status(400).json({
      error: 'sensor_id (string) is required',
    });
  }

  if (!measurement || typeof measurement !== 'string') {
    return res.status(400).json({
      error: 'measurement (string) is required',
    });
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return res.status(400).json({
      error: 'value must be a finite number',
    });
  }

  if (!device_sn || typeof device_sn !== 'string') {
    return res.status(400).json({
      error: 'device_sn (string) is required',
    });
  }

  // Optional: validate format (alphanumeric + hyphen/underscore)
  if (!/^[A-Za-z0-9_-]+$/.test(device_sn)) {
    return res.status(400).json({
      error: 'device_sn must contain only letters, numbers, hyphens, or underscores',
    });
  }

  const ALLOWED_MEASUREMENTS = new Set(['temperature', 'humidity', 'pressure']);
  if (!ALLOWED_MEASUREMENTS.has(measurement)) {
    return res.status(400).json({
      error: `measurement must be one of: ${[...ALLOWED_MEASUREMENTS].join(', ')}`,
    });
  }

  // ---- Build InfluxDB point ---------------------------------------
  const point = new Point(measurement)
    .tag('sensor_id', sensor_id)
    .tag('device_sn', device_sn)
    .floatField('value', value);

  try {
    writeApi.writePoint(point);
    await writeApi.flush();
    res.json({
      success: true,
      measurement,
      sensor_id,
      device_sn,
      value,
    });
  } catch (err) {
    console.error('Influx write error:', err);
    res.status(500).json({ error: 'Failed to write to InfluxDB' });
  }
});

// Get Sensor Data
router.get('/:device_sn/:measurement/:sensorId/:hours', async (req, res) => {
  const { device_sn, measurement, sensorId, hours: hoursParam } = req.params;
  const hours = parseInt(hoursParam, 10);

  // Validate hours
  if (isNaN(hours) || hours <= 0) {
    return res.status(400).json({ error: 'Invalid hours parameter. Must be a positive integer.' });
  }

  const flux = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -${hours}h)
      |> filter(fn: (r) => r.device_sn == "${device_sn}")
      |> filter(fn: (r) => r._measurement == "${measurement}")
      |> filter(fn: (r) => r._field == "value")
      |> filter(fn: (r) => r.sensor_id == "${sensorId}")
      |> timeShift(duration: 5h30m, columns: ["_time"])
  `;

  const result = [];

  try {
    for await (const { values, tableMeta } of queryApi.iterateRows(flux)) {
      const out = tableMeta.toObject(values);
      result.push({
        device: out.device_sn,
        time: out._time,
        value: out._value,
      });
    }
    res.json(result);
  } catch (err) {
    console.error('Influx query error:', err);
    res.status(500).json({ error: 'Query failed' });
  }
});

module.exports = router;