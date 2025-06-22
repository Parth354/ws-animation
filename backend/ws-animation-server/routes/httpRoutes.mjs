import http from 'http';
import { HTTP_PORT } from '../config.mjs';

export function createHttpServer(serverLogic = () => ({})) {
  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    let body;
    if (req.url === '/health') body = { status: 'healthy', time: new Date().toISOString() };
    else if (req.url === '/stats') body = serverLogic();
    else { res.statusCode = 404; body = { error: 'Not found' }; }
    res.end(JSON.stringify(body));
  });

  server.listen(HTTP_PORT, () => console.log(`🩺 HTTP server running on ${HTTP_PORT}`));
  return server;
}
