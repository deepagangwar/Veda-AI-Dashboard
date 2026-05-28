import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "../config";
import type { JobProgress } from "../types";

let io: Server | null = null;

export function initWebSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: config.corsOrigin,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("subscribe:assignment", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
    });

    socket.on("unsubscribe:assignment", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
    });
  });

  return io;
}

export function emitJobProgress(progress: JobProgress): void {
  if (!io) return;
  io.to(`assignment:${progress.assignmentId}`).emit(
    "generation:progress",
    progress
  );
}

export function getIO(): Server | null {
  return io;
}
