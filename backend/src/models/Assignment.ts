import mongoose, { Document, Schema } from "mongoose";
import type { QuestionPaper, AssignmentStatus } from "../types";

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: {
    type: string;
    count: number;
    marksPerQuestion: number;
  }[];
  additionalInstructions?: string;
  fileName?: string;
  fileContent?: string;
  status: AssignmentStatus;
  progress?: number;
  progressMessage?: string;
  questionPaper?: QuestionPaper;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema(
  {
    type: { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, default: "Untitled Assignment" },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    additionalInstructions: { type: String },
    fileName: { type: String },
    fileContent: { type: String },
    status: {
      type: String,
      enum: ["draft", "queued", "processing", "completed", "failed"],
      default: "draft",
    },
    progress: { type: Number, default: 0 },
    progressMessage: { type: String },
    questionPaper: { type: Schema.Types.Mixed },
    errorMessage: { type: String },
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  AssignmentSchema
);
