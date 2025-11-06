import React from 'react'
import { useMqttSSE } from '../../assets/Js/useMqttSSE'

const MqttConnection = () => {
  const { message, connected } = useMqttSSE();
  console.log("Latest MQTT message:", message);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">MQTT Live Data</h1>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>

      {message ? (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {JSON.stringify(message, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">Waiting for data...</p>
      )}
    </div>
  )
}

export default MqttConnection