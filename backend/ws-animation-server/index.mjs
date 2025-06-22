import { AnimationServer } from './core/AnimationServer.mjs';
import { createHttpServer } from './routes/httpRoutes.mjs';

const server = new AnimationServer();

createHttpServer(() => server.getStats());

server.start();
