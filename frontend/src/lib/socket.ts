import { io, Socket } from "socket.io-client";
import type { JobProgress } from "@/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, { autoConnect: true, transports: ["websocket", "polling"] });
  }
  return socket;
}

export function subscribeToAssignment(
  assignmentId: string,
  onProgress: (data: JobProgress) => void
): () => void {
  const s = getSocket();
  s.emit("subscribe:assignment", assignmentId);

  const handler = (data: JobProgress) => {
    if (data.assignmentId === assignmentId) onProgress(data);
  };

  s.on("generation:progress", handler);

  return () => {
    s.off("generation:progress", handler);
    s.emit("unsubscribe:assignment", assignmentId);
  };
}
