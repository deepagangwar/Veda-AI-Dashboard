export type Difficulty = "easy" | "moderate" | "hard";

export interface QuestionTypeRow {
  id: string;
  type: string;
  count: number;
  marksPerQuestion: number;
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

export interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
  questionTypes: {
    type: string;
    count: number;
    marksPerQuestion: number;
  }[];
  status: AssignmentStatus;
  questionPaper?: QuestionPaper;
  createdAt: string;
  updatedAt: string;
}

export interface JobProgress {
  assignmentId: string;
  status: AssignmentStatus;
  progress: number;
  message: string;
  error?: string;
}
