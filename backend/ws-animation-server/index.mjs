import { AnimationServer } from './core/AnimationServer.mjs';
import { createHttpServer } from './routes/httpRoutes.mjs';

const server = new AnimationServer();
server.start();
createHttpServer(server);

['SIGINT', 'SIGTERM'].forEach((sig) =>
  process.on(sig, () => {
    console.log(`Received ${sig}, shutting down.`);
    server.shutdown();
    process.exit(0);
  })
);
