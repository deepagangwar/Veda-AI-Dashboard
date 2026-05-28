import path from "path";
import dotenv from "dotenv";

// Always load backend/.env (works regardless of cwd when using tsx/npm)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const mongodbUri = process.env.MONGODB_URI?.trim() || "";

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongodbUri,
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  schoolName: process.env.SCHOOL_NAME || "",
  subject: process.env.SUBJECT || "Science",
  className: process.env.CLASS_NAME || "8",
};
