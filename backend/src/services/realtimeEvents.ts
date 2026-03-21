import { Server as SocketIOServer } from "socket.io";
import IORedis from "ioredis";
import { env } from "../config/env";

const CHANNEL = "assignment-events";

type RealtimeEvent = {
  type:
    | "assignment.status.updated"
    | "assignment.generation.progress"
    | "assignment.pdf.ready"
    | "assignment.failed";
  userId: string;
  assignmentId: string;
  payload: Record<string, unknown>;
};

const publisher = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export async function publishRealtimeEvent(event: RealtimeEvent): Promise<void> {
  await publisher.publish(CHANNEL, JSON.stringify(event));
}

export function registerRealtimeSubscriber(io: SocketIOServer): void {
  const subscriber = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  subscriber.subscribe(CHANNEL);
  subscriber.on("message", (_channel, message) => {
    const event = JSON.parse(message) as RealtimeEvent;

    io.to(`user:${event.userId}`).emit(event.type, {
      assignmentId: event.assignmentId,
      ...event.payload,
    });

    io.to(`assignment:${event.assignmentId}`).emit(event.type, {
      assignmentId: event.assignmentId,
      ...event.payload,
    });
  });
}
