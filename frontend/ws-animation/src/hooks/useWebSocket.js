import { useState, useEffect, useCallback, useRef } from 'react';

export default function useWebSocket(url) {
  const [ws, setWs] = useState(null);
  const [connectionStatus, setStatus] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState(null);
  const reconnectRef = useRef(0);
  const timeoutRef = useRef(null);

  const connect = useCallback(() => {
    const socket = new WebSocket(url);
    setStatus('connecting');

    socket.onopen = () => {
      setWs(socket);
      setStatus('connected');
      reconnectRef.current = 0;
    };

    socket.onmessage = (evt) => {
      try { setLastMessage(JSON.parse(evt.data)); } catch {}
    };

    socket.onclose = () => {
      setWs(null);
      setStatus('disconnected');
      if (reconnectRef.current < 5)
        timeoutRef.current = setTimeout(() => {
          reconnectRef.current++;
          connect();
        }, Math.pow(2, reconnectRef.current) * 1000);
      else setStatus('failed');
    };

    socket.onerror = () => setStatus('error');
  }, [url]);

  const sendMessage = useCallback((msg) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
      return true;
    }
    return false;
  }, [ws]);

  const disconnect = useCallback(() => {
    clearTimeout(timeoutRef.current);
    ws?.close(1000, 'User disconnect');
  }, [ws]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(timeoutRef.current);
      ws?.close();
    };
  }, []);

  return { ws, connectionStatus, lastMessage, sendMessage, disconnect };
}
