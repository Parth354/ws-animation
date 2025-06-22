import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { generateFrame } from './FrameGenerator.mjs';
import { sendMessage, sendError } from '../utils/messageUtils.mjs';
import { WS_PORT, MAX_CLIENTS, FRAME_RATE, HEARTBEAT_INTERVAL, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT } from '../config.mjs';

export class AnimationServer {
  constructor() {
    this.wss = new WebSocketServer({ port: WS_PORT, perMessageDeflate: false });
    this.sessions = new Map();
    this.frameInterval = 1000 / FRAME_RATE;
  }

  start() {
    console.log(`WebSocket listening on ws://localhost:${WS_PORT}`);
    this.wss.on('connection', (ws) => {
      if (this.sessions.size >= MAX_CLIENTS) return ws.close(1013, 'Server overloaded');
      const id = uuidv4();
      ws.isAlive = true;
      ws.on('pong', () => (ws.isAlive = true));
      this.sessions.set(id, { ws, isActive: false, interval: null, startTime: null });

      sendMessage(ws, { type: 'CONNECTED', sessionId: id, timestamp: Date.now(), payload: { frameRate: FRAME_RATE } });

      ws.on('message', (data) => this.handleMessage(id, data));
      ws.on('close', () => this.cleanup(id));
      ws.on('error', () => this.cleanup(id));
    });

    this._hbInterval = setInterval(() => {
      for (const [id, s] of this.sessions) {
        if (!s.ws.isAlive) return this.cleanup(id);
        s.ws.isAlive = false;
        s.ws.ping();
      }
    }, HEARTBEAT_INTERVAL);
  }

  handleMessage(id, raw) {
    const s = this.sessions.get(id);
    if (!s) return;
    let msg;
    try { msg = JSON.parse(raw); } catch { return sendError(s.ws, 'Invalid JSON'); }
    switch (msg.type) {
      case 'START': return this.startAnim(id);
      case 'STOP': return this.stopAnim(id);
      case 'HEARTBEAT': return sendMessage(s.ws, { type: 'HEARTBEAT_ACK', sessionId: id, timestamp: Date.now(), payload: { active: s.isActive } });
      default: return sendError(s.ws, `Unknown type: ${msg.type}`);
    }
  }

  startAnim(id) {
    const s = this.sessions.get(id);
    if (!s || s.isActive) return;
    s.isActive = true;
    s.startTime = Date.now();
    let fid = 0;
    s.interval = setInterval(() => {
      if (!s.isActive) return this.cleanup(id);
      const frame = generateFrame(fid++, s.startTime, FRAME_RATE, DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT);
      sendMessage(s.ws, { type: 'FRAME', sessionId: id, timestamp: Date.now(), payload: { frameData: frame } });
    }, this.frameInterval);
    sendMessage(s.ws, { type: 'ANIMATION_STARTED', sessionId: id, timestamp: Date.now(), payload: { frameRate: FRAME_RATE } });
  }

  stopAnim(id) {
    const s = this.sessions.get(id);
    if (!s) return;
    clearInterval(s.interval);
    s.isActive = false;
    sendMessage(s.ws, { type: 'ANIMATION_STOPPED', sessionId: id, timestamp: Date.now(), payload: { message: 'Stopped' } });
  }

  cleanup(id) {
    const s = this.sessions.get(id);
    if (!s) return;
    clearInterval(s.interval);
    s.ws.terminate();
    this.sessions.delete(id);
  }

  getStats() {
    return {
      total: this.sessions.size,
      active: Array.from(this.sessions.values()).filter(s => s.isActive).length,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }

  shutdown() {
    clearInterval(this._hbInterval);
    this.wss.clients.forEach(ws => ws.terminate());
    this.wss.close();
    console.log('Server shutdown.');
  }
}
