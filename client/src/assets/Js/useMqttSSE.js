// frontend/src/hooks/useMqttSSE.js
import { useEffect, useRef, useState } from "react";

const SSE_URL = "http://localhost:5000/api/mqtt/events";  // ← now port 5000

export function useMqttSSE() {
  const [message, setMessage] = useState(null);
  const [connected, setConnected] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    const es = new EventSource(SSE_URL);
    esRef.current = es;

    es.onopen = () => {
      console.log("[SSE] Connected to backend");
      setConnected(true);
    };

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setMessage(data);
      } catch (err) {
        console.error("[SSE] Parse error:", err);
      }
    };

    es.onerror = () => {
      console.error("[SSE] Error – reconnecting...");
      setConnected(false);
    };

    return () => es.close();
  }, []);

  return { message, connected };
}