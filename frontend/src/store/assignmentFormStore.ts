import { create } from "zustand";
import type { QuestionTypeRow } from "@/types";

const DEFAULT_TYPES = [
  "Multiple Choice Questions",
  "Short Questions",
  "Diagram/Graph-Based Questions",
  "Numerical Problems",
];

function newRow(type = DEFAULT_TYPES[0]): QuestionTypeRow {
  return {
    id: crypto.randomUUID(),
    type,
    count: 5,
    marksPerQuestion: 2,
  };
}

interface FormState {
  dueDate: string;
  questionTypes: QuestionTypeRow[];
  additionalInstructions: string;
  file: File | null;
  step: number;
  errors: Record<string, string>;

  setDueDate: (date: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (
    id: string,
    field: keyof QuestionTypeRow,
    value: string | number
  ) => void;
  setAdditionalInstructions: (text: string) => void;
  setFile: (file: File | null) => void;
  setStep: (step: number) => void;
  validate: () => boolean;
  getTotals: () => { questions: number; marks: number };
  reset: () => void;
}

const initialRows = [
  newRow("Multiple Choice Questions"),
  newRow("Short Questions"),
  newRow("Diagram/Graph-Based Questions"),
  newRow("Numerical Problems"),
];

export const useAssignmentFormStore = create<FormState>((set, get) => ({
  dueDate: "",
  questionTypes: initialRows,
  additionalInstructions: "",
  file: null,
  step: 1,
  errors: {},

  setDueDate: (date) => set({ dueDate: date, errors: {} }),

  addQuestionType: () =>
    set((s) => ({
      questionTypes: [...s.questionTypes, newRow()],
    })),

  removeQuestionType: (id) =>
    set((s) => ({
      questionTypes:
        s.questionTypes.length > 1
          ? s.questionTypes.filter((q) => q.id !== id)
          : s.questionTypes,
    })),

  updateQuestionType: (id, field, value) =>
    set((s) => ({
      questionTypes: s.questionTypes.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    })),

  setAdditionalInstructions: (text) => set({ additionalInstructions: text }),
  setFile: (file) => set({ file }),
  setStep: (step) => set({ step }),

  getTotals: () => {
    const { questionTypes } = get();
    return {
      questions: questionTypes.reduce((s, q) => s + q.count, 0),
      marks: questionTypes.reduce(
        (s, q) => s + q.count * q.marksPerQuestion,
        0
      ),
    };
  },

  validate: () => {
    const { dueDate, questionTypes } = get();
    const errors: Record<string, string> = {};

    if (!dueDate) errors.dueDate = "Due date is required";

    const parsed = new Date(dueDate);
    if (dueDate && isNaN(parsed.getTime())) {
      errors.dueDate = "Invalid date format";
    }

    questionTypes.forEach((qt, i) => {
      if (!qt.type.trim()) errors[`type_${i}`] = "Question type required";
      if (qt.count < 1) errors[`count_${i}`] = "Must be at least 1";
      if (qt.marksPerQuestion < 1)
        errors[`marks_${i}`] = "Marks must be at least 1";
    });

    if (questionTypes.length === 0) {
      errors.questionTypes = "Add at least one question type";
    }

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  reset: () =>
    set({
      dueDate: "",
      questionTypes: initialRows.map((r) => ({ ...r, id: crypto.randomUUID() })),
      additionalInstructions: "",
      file: null,
      step: 1,
      errors: {},
    }),
}));

export { DEFAULT_TYPES };
