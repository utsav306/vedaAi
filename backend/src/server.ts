import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "./config/env";
import { createApp } from "./app";
import { connectMongo } from "./db/connect";
import { verifyAccessToken } from "./services/jwt";
import { registerRealtimeSubscriber } from "./services/realtimeEvents";

async function bootstrap() {
  await connectMongo();

  const app = createApp();
  const httpServer = createServer(app);

  const io = new SocketIOServer(httpServer);

  io.use((socket, next) => {
    const token = socket.handshake.auth.token as string | undefined;
    if (!token) return next(new Error("Missing socket token"));

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.userId;
      next();
    } catch {
      next(new Error("Invalid socket token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);

    socket.on("assignment:join", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on("assignment:leave", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });
  });

  registerRealtimeSubscriber(io);

  httpServer.listen(env.PORT, () => {
    console.log(`API server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap server", error);
  process.exit(1);
});
