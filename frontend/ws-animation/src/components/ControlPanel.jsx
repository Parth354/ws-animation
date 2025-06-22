import React, { useContext, useState } from 'react';
import { WebSocketContext } from '../context/WebSocketProvider.jsx';

const ControlPanel = () => {
  const { sendMessage, connectionStatus } = useContext(WebSocketContext);
  const [isAnimating, setIsAnimating] = useState(false);
  const isConnected = connectionStatus === 'connected';

  const handleStart = () => {
    if (sendMessage({ type: 'START', timestamp: Date.now() })) setIsAnimating(true);
  };

  const handleStop = () => {
    if (sendMessage({ type: 'STOP', timestamp: Date.now() })) setIsAnimating(false);
  };

  const handleHeartbeat = () => {
    sendMessage({ type: 'HEARTBEAT', timestamp: Date.now() });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Animation Controls</h2>
      <div className="flex flex-wrap gap-3 mb-4">
        <button onClick={handleStart} disabled={!isConnected || isAnimating}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300">▶️ Start</button>
        <button onClick={handleStop} disabled={!isConnected || !isAnimating}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300">⏹️ Stop</button>
        <button onClick={handleHeartbeat} disabled={!isConnected}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300">💓 Heartbeat</button>
      </div>
      <div className="text-sm text-gray-600">
        <p><strong>Status:</strong> <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
          {isConnected ? 'Connected' : 'Disconnected'}</span></p>
        <p><strong>Animation:</strong> <span className={isAnimating ? 'text-green-600' : 'text-gray-500'}>
          {isAnimating ? 'Running' : 'Stopped'}</span></p>
      </div>
    </div>
  );
};

export default ControlPanel;
