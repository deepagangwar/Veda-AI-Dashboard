import { Router, Request, Response } from "express";
import multer from "multer";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { Assignment } from "../models/Assignment";
import {
  enqueueGeneration,
  regenerateAssignment,
} from "../services/generationService";
import { generateQuestionPaperPdf } from "../services/pdfService";
import type { QuestionPaper } from "../types";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "text/plain",
      "image/jpeg",
      "image/png",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF, text, JPEG, PNG allowed"));
  },
});

const questionTypeSchema = z.object({
  type: z.string().min(1),
  count: z.number().int().min(1),
  marksPerQuestion: z.number().int().min(1),
});

const createSchema = z.object({
  dueDate: z.string().min(1),
  questionTypes: z.array(questionTypeSchema).min(1),
  additionalInstructions: z.string().optional(),
});

export const assignmentsRouter = Router();

assignmentsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find()
      .select("-questionPaper -fileContent")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch {
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

assignmentsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ error: "Assignment not found" });
      return;
    }
    res.json(assignment);
  } catch {
    res.status(500).json({ error: "Failed to fetch assignment" });
  }
});

assignmentsRouter.post(
  "/",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const body = createSchema.parse(
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body
      );

      let fileContent: string | undefined;
      let fileName: string | undefined;

      if (req.file) {
        fileName = req.file.originalname;
        if (req.file.mimetype === "text/plain") {
          fileContent = fs.readFileSync(req.file.path, "utf-8");
        } else if (req.file.mimetype.startsWith("image/")) {
          fileContent = `[Image uploaded: ${fileName}]`;
        } else {
          fileContent = `[PDF uploaded: ${fileName}]`;
        }
        fs.unlinkSync(req.file.path);
      }

      const dueDate = new Date(body.dueDate);
      if (isNaN(dueDate.getTime())) {
        res.status(400).json({ error: "Invalid due date" });
        return;
      }

      const assignment = await Assignment.create({
        title: `Assignment - ${dueDate.toLocaleDateString("en-IN")}`,
        dueDate,
        questionTypes: body.questionTypes,
        additionalInstructions: body.additionalInstructions,
        fileName,
        fileContent,
        status: "queued",
        progress: 0,
        progressMessage: "Queued for processing",
      });

      enqueueGeneration(assignment._id.toString());

      res.status(201).json(assignment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ error: err.errors });
        return;
      }
      console.error(err);
      res.status(500).json({ error: "Failed to create assignment" });
    }
  }
);

assignmentsRouter.get("/:id/status", async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id).select(
    "status progress progressMessage errorMessage"
  );
  if (!assignment) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({
    status: assignment.status,
    progress: assignment.progress ?? 0,
    message: assignment.progressMessage ?? "",
    errorMessage: assignment.errorMessage,
  });
});

assignmentsRouter.post("/:id/regenerate", async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await regenerateAssignment(assignment._id.toString());
  res.json({ status: "queued" });
});

assignmentsRouter.delete("/:id", async (req: Request, res: Response) => {
  const result = await Assignment.findByIdAndDelete(req.params.id);
  if (!result) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ success: true });
});

assignmentsRouter.get("/:id/pdf", async (req: Request, res: Response) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment?.questionPaper) {
    res.status(404).json({ error: "Question paper not ready" });
    return;
  }

  const doc = generateQuestionPaperPdf(
    assignment.questionPaper as QuestionPaper
  );
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="question-paper-${req.params.id}.pdf"`
  );
  doc.pipe(res);
});
