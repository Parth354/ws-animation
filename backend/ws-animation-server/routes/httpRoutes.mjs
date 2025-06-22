import http from 'http';
import { HTTP_PORT } from '../config.mjs';

export function createHttpServer(server) {
  http
    .createServer((req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      let body;
      if (req.url === '/health') body = { status: 'healthy', time: new Date().toISOString() };
      else if (req.url === '/stats') body = server.getStats();
      else { res.statusCode = 404; body = { error: 'Not found' }; }
      res.end(JSON.stringify(body));
    })
    .listen(HTTP_PORT, () => console.log(`HTTP server on port ${HTTP_PORT}`));
}
