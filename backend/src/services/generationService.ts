import { Assignment } from "../models/Assignment";
import { generateQuestionPaper } from "./aiGenerator";
import { emitJobProgress } from "../websocket";
import type { CreateAssignmentInput, AssignmentStatus } from "../types";

async function updateProgress(
  assignmentId: string,
  status: AssignmentStatus,
  progress: number,
  message: string,
  error?: string
) {
  await Assignment.findByIdAndUpdate(assignmentId, {
    status,
    progress,
    progressMessage: message,
    ...(error ? { errorMessage: error } : {}),
  });

  emitJobProgress({ assignmentId, status, progress, message, error });
}

export function enqueueGeneration(assignmentId: string): void {
  setImmediate(() => {
    runGeneration(assignmentId).catch((err) => {
      console.error(`Generation failed for ${assignmentId}:`, err);
    });
  });
}

async function runGeneration(assignmentId: string) {
  try {
    await updateProgress(assignmentId, "processing", 10, "Starting generation...");

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error("Assignment not found");

    await updateProgress(assignmentId, "processing", 30, "Building AI prompt...");

    const input: CreateAssignmentInput = {
      dueDate: assignment.dueDate.toISOString(),
      questionTypes: assignment.questionTypes,
      additionalInstructions: assignment.additionalInstructions,
      fileName: assignment.fileName,
      fileContent: assignment.fileContent,
    };

    await updateProgress(assignmentId, "processing", 50, "Generating questions...");

    const questionPaper = await generateQuestionPaper(input);

    await updateProgress(assignmentId, "processing", 80, "Saving results...");

    const title =
      questionPaper.subject +
      " - " +
      new Date(assignment.dueDate).toLocaleDateString("en-IN");

    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "completed",
      progress: 100,
      progressMessage: "Question paper generated successfully!",
      questionPaper,
      title,
      errorMessage: undefined,
    });

    emitJobProgress({
      assignmentId,
      status: "completed",
      progress: 100,
      message: "Question paper generated successfully!",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: "failed",
      progress: 0,
      progressMessage: "Generation failed",
      errorMessage: message,
    });
    emitJobProgress({
      assignmentId,
      status: "failed",
      progress: 0,
      message: "Generation failed",
      error: message,
    });
    throw err;
  }
}

export async function regenerateAssignment(assignmentId: string): Promise<void> {
  await Assignment.findByIdAndUpdate(assignmentId, {
    status: "queued",
    progress: 0,
    progressMessage: "Queued for processing",
    questionPaper: undefined,
    errorMessage: undefined,
  });

  emitJobProgress({
    assignmentId,
    status: "queued",
    progress: 0,
    message: "Queued for processing",
  });

  enqueueGeneration(assignmentId);
}
