import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { config } from "./config";
import { assignmentsRouter } from "./routes/assignments";
import { initWebSocket } from "./websocket";
const app = express();
const server = http.createServer(app);

initWebSocket(server);

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/assignments", assignmentsRouter);

async function start() {
  if (!config.mongodbUri) {
    console.error(
      "MONGODB_URI is not set. Add your remote URL to backend/.env"
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }

  server.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
  });
}

start();
