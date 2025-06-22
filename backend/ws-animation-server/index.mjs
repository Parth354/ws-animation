import http from 'http';
import { WebSocketServer } from 'ws';
import { AnimationServer } from './core/AnimationServer.mjs';

const animationServer = new AnimationServer();

const port = process.env.PORT || 8080;

const httpServer = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  let body;
  if (req.url === '/health') {
    body = { status: 'healthy', time: new Date().toISOString() };
  } else if (req.url === '/stats') {
    body = animationServer.getStats();
  } else {
    res.statusCode = 404;
    body = { error: 'Not found' };
  }

  res.end(JSON.stringify(body));
});

const wss = new WebSocketServer({ server: httpServer });
animationServer.attach(wss);

httpServer.listen(port, () => {
  console.log(`🚀 HTTP + WebSocket server listening on port ${port}`);
});
