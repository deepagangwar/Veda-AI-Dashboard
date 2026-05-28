export type Difficulty = "easy" | "moderate" | "hard";

export interface QuestionTypeInput {
  type: string;
  count: number;
  marksPerQuestion: number;
}

export interface CreateAssignmentInput {
  dueDate: string;
  questionTypes: QuestionTypeInput[];
  additionalInstructions?: string;
  fileName?: string;
  fileContent?: string;
}

export interface Question {
  number: number;
  text: string;
  difficulty: Difficulty;
  marks: number;
}

export interface QuestionSection {
  id: string;
  title: string;
  instruction: string;
  questions: Question[];
}

export interface AnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface QuestionPaper {
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maximumMarks: number;
  generalInstructions: string;
  sections: QuestionSection[];
  answerKey: AnswerKeyItem[];
  aiMessage?: string;
}

export type AssignmentStatus =
  | "draft"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type JobProgress = {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
  error?: string;
};
