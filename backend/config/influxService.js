// backend/services/influxService.js
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
require('dotenv').config();

const {
  INFLUX_URL,
  INFLUX_TOKEN,
  INFLUX_ORG,
  INFLUX_BUCKET,
} = process.env;

// const INFLUX_URL = 'http://localhost:8086';
// const INFLUX_TOKEN = "OK6Hiwc1o3tNYHrArMsrNtUl3fILkieK8Zdh14HwkCXRLyQPDyT-86-1ETjeaC5kB8iilnya2ZFTmb6CdvOHxA==";
// const INFLUX_ORG = "rcs2";
// const INFLUX_BUCKET = "ElecMeter";

if (!INFLUX_TOKEN || !INFLUX_ORG || !INFLUX_BUCKET) {
  throw new Error('Missing InfluxDB credentials – check .env');
}

const influxDB = new InfluxDB({ url: INFLUX_URL, token: INFLUX_TOKEN });
const writeApi = influxDB.getWriteApi(INFLUX_ORG, INFLUX_BUCKET);
const queryApi = influxDB.getQueryApi(INFLUX_ORG);

// Graceful shutdown
process.on('SIGINT', async () => {
  await writeApi.close();
  process.exit();
});

module.exports = { writeApi, queryApi, Point };