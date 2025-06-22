import React, { createContext } from 'react';
import useWebSocket from '../hooks/useWebSocket';

export const WebSocketContext = createContext(null);

export default function WebSocketProvider({ url = 'ws://localhost:8080', children }) {
  const wsApi = useWebSocket(url);
  return <WebSocketContext.Provider value={wsApi}>{children}</WebSocketContext.Provider>;
}
