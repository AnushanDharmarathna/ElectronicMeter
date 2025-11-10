// backend/services/mqttService.js
const mqtt = require("mqtt");

const MQTT_BROKER = "mqtt://124.43.65.197:1884";
const MQTT_TOPIC = "RCS2/DEVICE/PowerMonitor";

class MqttService {
  constructor() {
    this.clients = new Set();
    this.mqttClient = null;
  }

  start() {
    this.mqttClient = mqtt.connect(MQTT_BROKER, {
      clientId: `backend_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
      keepalive: 60,
      reconnectPeriod: 3000,
    });

    this.mqttClient.on("connect", () => {
      console.log("[MQTT] Connected to broker");
      this.mqttClient.subscribe(MQTT_TOPIC, { qos: 1 }, (err) => {
        if (err) console.error("[MQTT] Subscribe error:", err);
        else console.log(`[MQTT] Subscribed to ${MQTT_TOPIC}`);
      });
    });

    this.mqttClient.on("message", (topic, payload) => {
      if (topic !== MQTT_TOPIC) return;
      try {
        const data = JSON.parse(payload.toString());
        this.broadcast(data);
      } catch (e) {
        console.error("[MQTT] JSON parse error:", e);
      }
    });

    this.mqttClient.on("error", (err) => console.error("[MQTT] error:", err));
    this.mqttClient.on("offline", () => console.log("[MQTT] offline"));
  }

  addClient(res) {
    this.clients.add(res);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "http://localhost:5173",
    });
    res.flushHeaders();

    // Keep-alive ping every 15s
    const keepAlive = setInterval(() => res.write(": ping\n\n"), 15000);

    res.on("close", () => {
      clearInterval(keepAlive);
      this.clients.delete(res);
    });
  }

  broadcast(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch (err) {
        this.clients.delete(client);
      }
    }
  }
}

module.exports = new MqttService();