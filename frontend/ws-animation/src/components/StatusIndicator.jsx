import React, { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../context/WebSocketProvider';

const StatusIndicator = () => {
  const { connectionStatus, lastMessage } = useContext(WebSocketContext);
  const [messageLog, setMessageLog] = useState([]);

  useEffect(() => {
    if (lastMessage) {
      setMessageLog(prev => [
        { ...lastMessage, receivedAt: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
    }
  }, [lastMessage]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Connection Status</h3>
      <div className={`text-lg font-semibold ${getStatusColor(connectionStatus)}`}>
        🔗 {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Recent Messages:</h4>
        <div className="max-h-64 overflow-y-auto bg-gray-50 rounded p-3">
          {messageLog.length === 0 ? (
            <p className="text-gray-500 text-sm">No messages yet...</p>
          ) : (
            messageLog.map((msg, index) => (
              <div key={index} className="text-xs mb-2 font-mono">
                <span className="text-gray-500">[{msg.receivedAt}]</span>{' '}
                <span className="font-semibold text-blue-600">{msg.type}</span>
                {msg.payload && (
                  <div className="ml-4 text-gray-600">{JSON.stringify(msg.payload).slice(0, 100)}...</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
