export function sendMessage(ws, message) {
  if (ws.readyState === ws.OPEN) {
    try {
      ws.send(JSON.stringify(message));
    } catch {
      setTimeout(() => {
        if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
      }, 100);
    }
  }
}
export function sendError(ws, msg) {
  sendMessage(ws, { type: 'ERROR', timestamp: Date.now(), payload: { error: msg } });
}
